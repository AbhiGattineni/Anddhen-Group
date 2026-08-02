/**
 * Ambulance tracking service — reads the SEPARATE `ambulance-280f8` Firebase
 * project, where the Raspberry Pi ALPR monitor already uploads every plate
 * detection. Read-only dashboard feed via a secondary Firebase app; the
 * ambulance project's rules allow public reads, so no sign-in to it is needed.
 *
 * Pi's existing schema (do not change without updating the Pi):
 *  detections/{autoId} — { plate, confidence, time (timestamp), type: 'detection',
 *                          photo: 'detections/YYYY-MM-DD/plate_<P>_<ts>.jpg',
 *                          photoUrl: tokened download URL }
 *  deviceStatus/{id}   — optional heartbeat docs { lastSeenAt, ip, ... } if a
 *                        heartbeat sender is ever added on the Pi.
 */
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  getCountFromServer,
  query,
  orderBy,
  limit,
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

/** No fresh upload/heartbeat for this long → device shown as IDLE/OFFLINE. */
export const ONLINE_WINDOW_MIN = 15;

const toDate = v => (v?.toDate ? v.toDate() : v ? new Date(v) : null);

/** Public download URL for a Storage path (rules allow public read). */
export function imageUrl(path) {
  if (!path) return '';
  return `https://firebasestorage.googleapis.com/v0/b/${AMB_CONFIG.storageBucket}/o/${encodeURIComponent(path)}?alt=media`;
}

/** Newest detections first, normalized to one shape regardless of doc vintage. */
export async function listRecentDetections(n = 200) {
  const q = query(collection(db, 'detections'), orderBy('time', 'desc'), limit(n));
  const snap = await getDocs(q);
  return snap.docs.map(s => {
    const d = s.data();
    return {
      id: s.id,
      plate: d.plate || 'UNKNOWN',
      confidence: typeof d.confidence === 'number' ? d.confidence : null,
      capturedAt: toDate(d.time || d.capturedAt),
      photoUrl: d.photoUrl || imageUrl(d.photo || d.imagePath),
      fileName: (d.photo || d.imagePath || '').split('/').pop(),
    };
  });
}

/** Exact all-time total (server-side aggregate, no doc reads). */
export async function countAllDetections() {
  const agg = await getCountFromServer(collection(db, 'detections'));
  return agg.data().count;
}

export async function listDevices() {
  const snap = await getDocs(collection(db, 'deviceStatus'));
  return snap.docs.map(s => ({ id: s.id, ...s.data() }));
}

/** Roll the raw feed up into everything the dashboard needs. */
export function computeStats(detections, devices, total) {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const dates = detections.map(d => d.capturedAt).filter(Boolean);
  const today = dates.filter(d => d >= startOfToday).length;
  const week = dates.filter(d => now - d.getTime() < 7 * dayMs).length;

  // Per-day counts for the last 7 days (oldest first).
  const perDay = [...Array(7)].map((_, i) => {
    const day = new Date(startOfToday.getTime() - (6 - i) * dayMs);
    const next = new Date(day.getTime() + dayMs);
    return {
      label: day.toLocaleDateString(undefined, { weekday: 'short' }),
      count: dates.filter(d => d >= day && d < next).length,
    };
  });

  // Device liveness: freshest of heartbeat (if a heartbeat sender exists)
  // and the newest photo upload. The Pi only writes on detection, so "last
  // activity" is the honest health signal.
  const device = devices[0] || null;
  const heartbeat = device ? toDate(device.lastSeenAt) : null;
  const lastUpload = dates[0] || null;
  const lastActivity =
    heartbeat && lastUpload
      ? new Date(Math.max(heartbeat.getTime(), lastUpload.getTime()))
      : heartbeat || lastUpload;
  const online = lastActivity
    ? now - lastActivity.getTime() < ONLINE_WINDOW_MIN * 60 * 1000
    : false;

  return {
    total,
    today,
    week,
    perDay,
    lastDetection: detections[0] || null,
    device,
    heartbeat,
    lastActivity,
    online,
  };
}
