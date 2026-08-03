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

const photoDoc = s => {
  const d = s.data();
  return {
    id: s.id,
    type: d.type || '',
    plate: d.plate || '',
    confidence: typeof d.confidence === 'number' ? d.confidence : null,
    time: toDate(d.time),
    photo: d.photo || '',
    photoUrl: d.photoUrl || imageUrl(d.photo),
    device: d.device || 'raspberrypi',
  };
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
