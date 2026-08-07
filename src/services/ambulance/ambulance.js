/**
 * Ambulance tracking service — read-only feed from the SEPARATE
 * `ambulance-280f8` Firebase project, where the ambulance-mounted Pi writes
 * everything. Secondary Firebase app; that project's rules allow public reads.
 *
 * Device collections (all docs share {time, photo, photoUrl, type} unless noted):
 *  violations   — the product: a vehicle blocked the ambulance 10+ s.
 *                 { plate, confidence, time, photo, photoUrl, type:'violation' }
 *                 Photos kept forever.
 *  detections   — every plate read (noisy, once per vehicle per streak).
 *                 Photos DELETED after ~1 day (docs remain → photoUrl 404s).
 *  heartbeats   — liveness ping + camera still every 30 s. Photos deleted next day.
 *  power_stats  — device health, one doc/min, `device` = hostname (fleet key).
 *                 Docs older than 30 days deleted by the device.
 */
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  getCountFromServer,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  doc,
  setDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

// Public web config of the ambulance project (not a secret).
const AMB_CONFIG = {
  apiKey: 'AIzaSyDNqRix4FOsyqUszTXQz9Sh0RbukKwwCfg',
  authDomain: 'ambulance-280f8.firebaseapp.com',
  projectId: 'ambulance-280f8',
  storageBucket: 'ambulance-280f8.firebasestorage.app',
  messagingSenderId: '176712668339',
  appId: '1:176712668339:web:c37656b78c01e839e80cc6',
};

const APP_NAME = 'ambulance';
const app = getApps().find(a => a.name === APP_NAME) || initializeApp(AMB_CONFIG, APP_NAME);
const db = getFirestore(app);

/** Newest power sample older than this → device considered OFFLINE. */
export const OFFLINE_AFTER_MIN = 3;
/** Heartbeats come every 30 s; a silence longer than this is a coverage gap. */
export const GAP_MS = 2 * 60 * 1000;

const toDate = v => (v?.toDate ? v.toDate() : v ? new Date(v) : null);

/** Capture-quality fields the device attaches to every detection/violation.
 *  Passed through verbatim so the viewer and stats can use them without a
 *  second read; absent on docs written before the device started sending them. */
const QUALITY_KEYS = [
  'detector_conf',
  'plate_px_w',
  'plate_px_h',
  'plate_aspect',
  'plate_sharpness',
  'plate_brightness',
  'agreement',
  'distinct_spellings',
  'frames',
  'mean_ocr_conf',
  'exposure_us',
  'gain',
  'lux',
  'exposure_capped',
  // vehicle identification — present once the device runs make/model recognition
  'vehicle_make',
  'vehicle_model',
  'vehicle_type',
  'vehicle_color',
  'vehicle_conf',
];

const photoDoc = s => {
  const d = s.data();
  const out = {
    id: s.id,
    type: d.type || '',
    plate: d.plate || '',
    confidence: typeof d.confidence === 'number' ? d.confidence : null,
    time: toDate(d.time),
    photo: d.photo || '',
    photoUrl: d.photoUrl || imageUrl(d.photo),
    device: d.device || 'raspberrypi',
  };
  for (const k of QUALITY_KEYS) {
    if (d[k] !== undefined && d[k] !== null) out[k] = d[k];
  }
  return out;
};

/** Public download URL for a Storage path (bucket rules allow public read). */
export function imageUrl(path) {
  if (!path) return '';
  return `https://firebasestorage.googleapis.com/v0/b/${AMB_CONFIG.storageBucket}/o/${encodeURIComponent(path)}?alt=media`;
}

// ---- live status ----
export async function latestPower() {
  const snap = await getDocs(
    query(collection(db, 'power_stats'), orderBy('time', 'desc'), limit(1))
  );
  if (snap.empty) return null;
  const d = snap.docs[0].data();
  return { id: snap.docs[0].id, ...d, time: toDate(d.time) };
}

/** Power history since `since` (asc). 7d ≈ 10k docs → capped + thinned by caller. */
export async function powerHistory(since, max = 5000) {
  const snap = await getDocs(
    query(
      collection(db, 'power_stats'),
      where('time', '>=', Timestamp.fromDate(since)),
      orderBy('time', 'asc'),
      limit(max)
    )
  );
  return snap.docs.map(s => {
    const d = s.data();
    return { ...d, time: toDate(d.time) };
  });
}

// ---- violations (the product) ----
export async function listViolations({ from, to, pageSize = 48, cursor = null } = {}) {
  const parts = [collection(db, 'violations')];
  const constraints = [];
  if (from) constraints.push(where('time', '>=', Timestamp.fromDate(from)));
  if (to) constraints.push(where('time', '<=', Timestamp.fromDate(to)));
  constraints.push(orderBy('time', 'desc'));
  if (cursor) constraints.push(startAfter(cursor));
  constraints.push(limit(pageSize));
  const snap = await getDocs(query(...parts, ...constraints));
  return {
    rows: snap.docs.map(photoDoc),
    cursor: snap.docs.length === pageSize ? snap.docs[snap.docs.length - 1] : null,
  };
}

export async function countViolations() {
  const agg = await getCountFromServer(collection(db, 'violations'));
  return agg.data().count;
}

/** All-time detection count. Docs are never deleted (only their photos are). */
export async function countDetections() {
  const agg = await getCountFromServer(collection(db, 'detections'));
  return agg.data().count;
}

// ---- detections (OCR tuning; photos live ~24 h) ----
export async function listDetections({ sinceHours = 24, pageSize = 60, cursor = null } = {}) {
  const since = new Date(Date.now() - sinceHours * 3600 * 1000);
  const constraints = [where('time', '>=', Timestamp.fromDate(since)), orderBy('time', 'desc')];
  if (cursor) constraints.push(startAfter(cursor));
  constraints.push(limit(pageSize));
  const snap = await getDocs(query(collection(db, 'detections'), ...constraints));
  return {
    rows: snap.docs.map(photoDoc),
    cursor: snap.docs.length === pageSize ? snap.docs[snap.docs.length - 1] : null,
  };
}

// ---- heartbeats (coverage audit + latest camera still) ----
export async function latestHeartbeat() {
  const snap = await getDocs(
    query(collection(db, 'heartbeats'), orderBy('time', 'desc'), limit(1))
  );
  return snap.empty ? null : photoDoc(snap.docs[0]);
}

/** Just the ping times between two instants (asc). ~2 900/day. */
export async function heartbeatTimes(start, end) {
  const snap = await getDocs(
    query(
      collection(db, 'heartbeats'),
      where('time', '>=', Timestamp.fromDate(start)),
      where('time', '<=', Timestamp.fromDate(end)),
      orderBy('time', 'asc'),
      limit(4000)
    )
  );
  return snap.docs.map(s => toDate(s.data().time)).filter(Boolean);
}

/** Merge ping times into covered segments; silences > GAP_MS split segments. */
export function coverageSegments(times, gapMs = GAP_MS) {
  const segments = [];
  let start = null;
  let prev = null;
  for (const t of times) {
    if (!start) {
      start = t;
    } else if (t - prev > gapMs) {
      segments.push({ start, end: prev });
      start = t;
    }
    prev = t;
  }
  if (start) segments.push({ start, end: prev });
  const gaps = [];
  for (let i = 1; i < segments.length; i++) {
    gaps.push({ start: segments[i - 1].end, end: segments[i].start });
  }
  const coveredMs = segments.reduce((s, x) => s + (x.end - x.start), 0);
  return { segments, gaps, coveredMs };
}

// ---- storage folder browser ----
export async function listStorage(prefix = '', pageToken = null) {
  const params = new URLSearchParams({ delimiter: '/', prefix, maxResults: '60' });
  if (pageToken) params.set('pageToken', pageToken);
  const res = await fetch(
    `https://firebasestorage.googleapis.com/v0/b/${AMB_CONFIG.storageBucket}/o?${params}`
  );
  if (!res.ok) throw new Error(`Storage list failed (${res.status})`);
  const j = await res.json();
  return {
    folders: j.prefixes || [],
    files: (j.items || []).map(i => ({
      name: i.name,
      shortName: i.name.split('/').pop(),
      url: imageUrl(i.name),
      isImage: /\.(jpe?g|png|gif|webp)$/i.test(i.name),
    })),
    nextPageToken: j.nextPageToken || null,
  };
}

// ---- accuracy: human-labeled ground truth over OCR reads ----
//
// `confidence` is the OCR model's OWN self-reported certainty — not accuracy.
// Real accuracy needs a human comparing the photo to the plate text. The
// dashboard's review queue does exactly that; each verdict is stored once
// per source doc (doc id = `${sourceCollection}_${sourceId}`, so re-review
// overwrites instead of duplicating) and everything below turns the labeled
// set into numbers that say what to fix next: a confidence threshold, a
// clarity/focus correlation, and the specific characters the OCR confuses.

/** Candidate pool for the review queue: recent violations (kept forever) +
 *  last-24h detections (photos expire), whichever the caller wants. */
export async function listReviewCandidates({ violationsLimit = 120, detectionsLimit = 150 } = {}) {
  const [v, d] = await Promise.all([
    getDocs(query(collection(db, 'violations'), orderBy('time', 'desc'), limit(violationsLimit))),
    listDetections({ pageSize: detectionsLimit }),
  ]);
  return [
    ...v.docs.map(s => ({ ...photoDoc(s), sourceCollection: 'violations' })),
    ...d.rows.map(r => ({ ...r, sourceCollection: 'detections' })),
  ];
}

/** Every review verdict recorded so far (small — human-paced, not per-frame). */
export async function listReviews() {
  const snap = await getDocs(collection(db, 'plateReviews'));
  return snap.docs.map(s => {
    const d = s.data();
    return {
      id: s.id,
      sourceCollection: d.sourceCollection,
      sourceId: d.sourceId,
      plate: d.plate || '',
      correct: Boolean(d.correct),
      correctedPlate: d.correctedPlate || null,
      confidence: typeof d.confidence === 'number' ? d.confidence : null,
      sharpness: typeof d.sharpness === 'number' ? d.sharpness : null,
      time: toDate(d.time),
      reviewedAt: toDate(d.reviewedAt),
    };
  });
}

/**
 * Record one verdict. `sharpness` is computed by the caller (it already has
 * the image on screen to review) so this never has to refetch an expired photo.
 */
export async function saveReview({
  sourceCollection,
  sourceId,
  plate,
  correct,
  correctedPlate = null,
  confidence = null,
  sharpness = null,
  time = null,
}) {
  const id = `${sourceCollection}_${sourceId}`;
  await setDoc(doc(db, 'plateReviews', id), {
    sourceCollection,
    sourceId,
    plate: plate || '',
    correct: Boolean(correct),
    correctedPlate: correct ? null : correctedPlate || null,
    confidence,
    sharpness,
    time: time ? Timestamp.fromDate(time) : null,
    reviewedAt: serverTimestamp(),
  });
}

const CONF_BUCKETS = [
  { label: '<50%', min: 0, max: 0.5 },
  { label: '50–70%', min: 0.5, max: 0.7 },
  { label: '70–85%', min: 0.7, max: 0.85 },
  { label: '85–100%', min: 0.85, max: 1.01 },
];

const accuracyOf = rows =>
  rows.length ? Math.round((rows.filter(r => r.correct).length / rows.length) * 100) : null;

/** Position-wise char substitutions between what the OCR read and the human
 *  correction — only meaningful when the two strings are the same length. */
function tallyConfusions(reviews) {
  const counts = new Map();
  for (const r of reviews) {
    if (r.correct || !r.correctedPlate) continue;
    const a = (r.plate || '').toUpperCase();
    const b = r.correctedPlate.toUpperCase();
    if (a.length !== b.length) continue;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        const key = `${a[i]}→${b[i]}`;
        counts.set(key, (counts.get(key) || 0) + 1);
      }
    }
  }
  return [...counts.entries()]
    .map(([pair, count]) => ({ pair, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

/**
 * Turn the labeled set into the numbers that answer "what should I change
 * next": overall + per-confidence-bucket accuracy, a recommended confidence
 * threshold (highest bucket floor where accuracy still holds), whether sharp
 * photos are actually more accurate (so you know if fixing focus will help),
 * daily accuracy trend, and the specific OCR character confusions to fix.
 */
export function computeAccuracyStats(reviews, { targetAccuracy = 90 } = {}) {
  const withConf = reviews.filter(r => typeof r.confidence === 'number');

  const byBucket = CONF_BUCKETS.map(b => {
    const rows = withConf.filter(r => r.confidence >= b.min && r.confidence < b.max);
    return { ...b, count: rows.length, accuracy: accuracyOf(rows) };
  });

  // Walk buckets high-confidence -> low; the recommended floor is the lowest
  // bucket whose accuracy still clears the target, so "trust reads at or
  // above this confidence automatically" is a real, data-backed number.
  let recommendedThreshold = null;
  for (let i = byBucket.length - 1; i >= 0; i--) {
    const b = byBucket[i];
    if (b.count === 0) continue;
    if (b.accuracy >= targetAccuracy) recommendedThreshold = b.min;
    else break;
  }

  const withSharpness = reviews.filter(r => typeof r.sharpness === 'number');
  const avgSharpness = rows =>
    rows.length ? Math.round(rows.reduce((s, r) => s + r.sharpness, 0) / rows.length) : null;
  const sharpnessCorrelation = {
    correctAvg: avgSharpness(withSharpness.filter(r => r.correct)),
    wrongAvg: avgSharpness(withSharpness.filter(r => !r.correct)),
    sampleSize: withSharpness.length,
  };

  // Daily accuracy trend, keyed by the ORIGINAL capture day (not review day) —
  // this is what tells you whether a physical fix on a given date actually
  // moved the number, not just when you got around to reviewing it.
  const byDay = new Map();
  for (const r of reviews) {
    if (!r.time) continue;
    const key = r.time.toISOString().slice(0, 10);
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key).push(r);
  }
  const trend = [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, rows]) => ({ day, count: rows.length, accuracy: accuracyOf(rows) }));

  return {
    reviewedCount: reviews.length,
    overallAccuracy: accuracyOf(reviews),
    byBucket,
    recommendedThreshold,
    sharpnessCorrelation,
    trend,
    confusions: tallyConfusions(reviews),
  };
}

// ---- automatic capture-quality stats (no human labelling needed) ----
//
// The review queue above answers "is the text right" but needs a human. These
// stats come free with every upload: the device records how big, sharp, bright
// and well-lit each plate was, plus how many frames agreed on the reading.
// Together they say WHY reads fail — too small, too blurred, or too dark — and
// which of those is worth spending money on.

/** Detections + violations with their capture-quality fields, newest first. */
export async function listQualitySample({ sinceHours = 168, max = 1200 } = {}) {
  const since = new Date(Date.now() - sinceHours * 3600 * 1000);
  const q = c =>
    getDocs(
      query(
        collection(db, c),
        where('time', '>=', Timestamp.fromDate(since)),
        orderBy('time', 'desc'),
        limit(max)
      )
    );
  const [dets, vios] = await Promise.all([q('detections'), q('violations')]);
  return [
    ...dets.docs.map(s => ({ ...photoDoc(s), sourceCollection: 'detections' })),
    ...vios.docs.map(s => ({ ...photoDoc(s), sourceCollection: 'violations' })),
  ].sort((a, b) => (b.time?.getTime() || 0) - (a.time?.getTime() || 0));
}

/** Full daylight is ~10 000+ lux; a lit night street sits under ~100. */
export const NIGHT_LUX = 100;
export const TWILIGHT_LUX = 1000;

export const lightClass = lux =>
  typeof lux !== 'number'
    ? 'unknown'
    : lux < NIGHT_LUX
      ? 'night'
      : lux < TWILIGHT_LUX
        ? 'twilight'
        : 'day';

/** Confidence floors, highest first — "how many reads clear this bar". */
export const CONF_FLOORS = [0.95, 0.9, 0.8, 0.7, 0.6, 0.5];

const median = a => (a.length ? [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)] : null);
const pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);

/** Readable-plate thresholds, from what the device has actually produced. */
export const GOOD_PLATE_PX = 150;
export const GOOD_SHARPNESS = 150;
export const DARK_BRIGHTNESS = 60;
export const BLUR_EXPOSURE_US = 20000;

/**
 * Turn a raw sample into the distributions and the plain-language findings.
 * Everything here is derived from fields the device already uploads, so it
 * updates on its own — no review backlog required.
 */
export function computeQualityStats(rows) {
  const withConf = rows.filter(r => typeof r.confidence === 'number');

  // "at or above X" — cumulative, because that is how a threshold behaves
  const byFloor = CONF_FLOORS.map(floor => {
    const n = withConf.filter(r => r.confidence >= floor).length;
    return { floor, count: n, share: pct(n, withConf.length) };
  });
  const belowLowest = withConf.filter(
    r => r.confidence < CONF_FLOORS[CONF_FLOORS.length - 1]
  ).length;

  const group = cls => rows.filter(r => lightClass(r.lux) === cls);
  const summarise = list => {
    const conf = list.map(r => r.confidence).filter(v => typeof v === 'number');
    const px = list.map(r => r.plate_px_w).filter(v => typeof v === 'number');
    const sharp = list.map(r => r.plate_sharpness).filter(v => typeof v === 'number');
    const bright = list.map(r => r.plate_brightness).filter(v => typeof v === 'number');
    const expo = list.map(r => r.exposure_us).filter(v => typeof v === 'number');
    const agree = list.map(r => r.agreement).filter(v => typeof v === 'number');
    return {
      count: list.length,
      medConfidence: median(conf),
      highConfShare: pct(conf.filter(v => v >= 0.9).length, conf.length),
      medPlatePx: median(px),
      medSharpness: median(sharp),
      medBrightness: median(bright),
      medExposureUs: median(expo),
      medAgreement: median(agree),
    };
  };

  const day = summarise(group('day'));
  const twilight = summarise(group('twilight'));
  const night = summarise(group('night'));
  const unknown = summarise(group('unknown'));
  const all = summarise(rows);

  // vehicle identification coverage — zero until the device runs the model
  const withVehicle = rows.filter(r => r.vehicle_make || r.vehicle_model);
  const makes = new Map();
  for (const r of withVehicle) {
    const key = [r.vehicle_make, r.vehicle_model].filter(Boolean).join(' ') || 'unknown';
    makes.set(key, (makes.get(key) || 0) + 1);
  }
  const topVehicles = [...makes.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    total: rows.length,
    withConfidence: withConf.length,
    byFloor,
    belowLowest,
    belowLowestShare: pct(belowLowest, withConf.length),
    all,
    day,
    twilight,
    night,
    unknown,
    vehicleCoverage: pct(withVehicle.length, rows.length),
    vehicleCount: withVehicle.length,
    topVehicles,
    findings: buildFindings({ all, day, night, twilight, rows }),
  };
}

/** Rank what is actually limiting accuracy, worst first, in plain language. */
function buildFindings({ all, day, night, rows }) {
  const out = [];
  const push = (level, title, body) => out.push({ level, title, body });

  if (!rows.length) {
    push('warn', 'No sample yet', 'No detections in this window, so nothing can be assessed.');
    return out;
  }

  if (all.medPlatePx != null) {
    if (all.medPlatePx < GOOD_PLATE_PX) {
      push(
        'bad',
        `Plates are too small (median ${Math.round(all.medPlatePx)} px wide)`,
        `OCR needs roughly ${GOOD_PLATE_PX} px across the plate to be reliable. Fix with a longer focal length lens or by framing closer traffic — no software change recovers detail the lens never captured.`
      );
    } else {
      push(
        'ok',
        `Plate size is adequate (median ${Math.round(all.medPlatePx)} px wide)`,
        `At or above the ~${GOOD_PLATE_PX} px the OCR needs. Size is not what is limiting accuracy.`
      );
    }
  }

  if (all.medSharpness != null && all.medSharpness < GOOD_SHARPNESS) {
    const blurry = all.medExposureUs != null && all.medExposureUs > BLUR_EXPOSURE_US;
    push(
      'bad',
      `Images are blurred (median sharpness ${Math.round(all.medSharpness)})`,
      blurry
        ? `Exposure is running at ${(all.medExposureUs / 1000).toFixed(0)} ms, long enough to smear a moving vehicle. Cap the exposure or add light — a noisy sharp plate reads, a clean smeared one does not.`
        : 'Exposure is short, so this is focus rather than motion. Adjust the lens using Focus Assist on the Detections tab.'
    );
  }

  if (night.count > 0) {
    const dayConf = day.medConfidence;
    const nightConf = night.medConfidence;
    const gap =
      dayConf != null && nightConf != null ? Math.round((dayConf - nightConf) * 100) : null;
    const nightShare = pct(night.count, all.count);
    if (night.medBrightness != null && night.medBrightness < DARK_BRIGHTNESS) {
      push(
        'bad',
        `Night captures are underexposed (${nightShare}% of the sample)`,
        `Median plate brightness at night is ${Math.round(night.medBrightness)} of 255${
          gap != null ? `, and confidence runs ${gap} points below daytime` : ''
        }. Plates are retroreflective, so an 850 nm IR illuminator plus an IR-capable camera fixes this outright — nothing in software will.`
      );
    } else if (gap != null && gap >= 10) {
      push(
        'warn',
        `Night accuracy trails day by ${gap} points`,
        `${nightShare}% of reads happen below ${NIGHT_LUX} lux. Worth adding IR illumination if night coverage matters.`
      );
    }
  }

  if (all.medAgreement != null && all.medAgreement < 0.6) {
    push(
      'warn',
      `Frames disagree on the plate (median agreement ${Math.round(all.medAgreement * 100)}%)`,
      'The same vehicle is being read differently frame to frame, so the voted plate rests on a thin majority. This usually follows from small or blurred plates rather than being a separate fault.'
    );
  }

  if (!out.some(f => f.level === 'bad')) {
    push(
      'ok',
      'No dominant capture fault',
      'Size, sharpness and exposure all sit in workable ranges for this sample.'
    );
  }
  return out;
}

/** Rows still needing a verdict, stratified across confidence so the sample
 *  isn't skewed toward whichever bucket happens to be most common. */
export function pickReviewQueue(candidates, reviews, { perBucket = 5 } = {}) {
  const reviewedIds = new Set(reviews.map(r => `${r.sourceCollection}_${r.sourceId ?? r.id}`));
  const pending = candidates.filter(c => !reviewedIds.has(`${c.sourceCollection}_${c.id}`));

  const buckets = CONF_BUCKETS.map(b => ({
    ...b,
    rows: pending
      .filter(
        c => typeof c.confidence === 'number' && c.confidence >= b.min && c.confidence < b.max
      )
      .sort((a, b2) => (b2.time?.getTime() || 0) - (a.time?.getTime() || 0))
      .slice(0, perBucket),
  }));
  const noConfidence = pending.filter(c => typeof c.confidence !== 'number').slice(0, perBucket);

  // Violations first within each bucket — they're the ones that matter most
  // and their photos never expire, so reviewing them is never time-pressured.
  const rank = c => (c.sourceCollection === 'violations' ? 0 : 1);
  return [...buckets.flatMap(b => b.rows), ...noConfidence].sort((a, b) => rank(a) - rank(b));
}
