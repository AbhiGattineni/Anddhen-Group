/**
 * Timesheet service — Firebase-native (like stocks/quiz/ambulance).
 *
 *  timesheetEntries/{autoId} —
 *    { uid, userName, userEmail, date: 'YYYY-MM-DD', category: 'professional'|'personal',
 *      activity, minutes, notes?, createdAt }
 *
 * Privacy model (enforced in firestore.rules, not just UI):
 *   - everyone reads/writes ONLY their own entries;
 *   - admins can additionally read others' PROFESSIONAL entries (team view);
 *   - personal entries are never readable by anyone but their owner.
 * The team query therefore MUST filter category == 'professional' — that's
 * what makes the rule provable server-side (composite index deployed).
 */
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../connector/firebase';

const ENTRIES = 'timesheetEntries';

const withId = s => ({ id: s.id, ...s.data() });

export const CATEGORIES = ['professional', 'personal'];

/** Local YYYY-MM-DD (entries are day-keyed strings so range queries work). */
export function dayStr(d = new Date()) {
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export async function addEntry({
  uid,
  userName,
  userEmail,
  date,
  category,
  activity,
  minutes,
  notes,
}) {
  if (!uid) throw new Error('Sign in to log time.');
  if (!activity?.trim()) throw new Error('What did you work on?');
  const mins = Math.round(Number(minutes));
  if (!Number.isFinite(mins) || mins <= 0) throw new Error('Enter a duration.');
  if (!CATEGORIES.includes(category)) throw new Error('Pick a category.');
  const ref = doc(collection(db, ENTRIES));
  const entry = {
    uid,
    userName: userName || '',
    userEmail: userEmail || '',
    date: date || dayStr(),
    category,
    activity: activity.trim(),
    minutes: mins,
    notes: notes?.trim() || '',
    createdAt: serverTimestamp(),
  };
  await setDoc(ref, entry);
  return { id: ref.id, ...entry };
}

export async function deleteEntry(id) {
  await deleteDoc(doc(db, ENTRIES, id));
}

/** All of MY entries since `sinceDays` ago (sorted newest first, client-side). */
export async function listMyEntries(uid, sinceDays = 30) {
  const since = new Date();
  since.setDate(since.getDate() - sinceDays);
  const snap = await getDocs(
    query(collection(db, ENTRIES), where('uid', '==', uid), where('date', '>=', dayStr(since)))
  );
  return snap.docs
    .map(withId)
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date) || (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
    );
}

/** PROFESSIONAL entries for everyone in a date range — admin team view. */
export async function listTeamEntries(fromDate, toDate) {
  const snap = await getDocs(
    query(
      collection(db, ENTRIES),
      where('category', '==', 'professional'),
      where('date', '>=', fromDate),
      where('date', '<=', toDate)
    )
  );
  return snap.docs.map(withId).sort((a, b) => a.date.localeCompare(b.date));
}

export const fmtMinutes = mins => {
  const m = Math.round(mins);
  const h = Math.floor(m / 60);
  if (!h) return `${m}m`;
  return m % 60 ? `${h}h ${m % 60}m` : `${h}h`;
};

/** Per-day professional/personal minute totals for the last `days` days. */
export function dailyTotals(entries, days = 7) {
  const out = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = dayStr(d);
    const dayEntries = entries.filter(e => e.date === key);
    out.push({
      date: key,
      label: d.toLocaleDateString(undefined, { weekday: 'short' }),
      professional: dayEntries
        .filter(e => e.category === 'professional')
        .reduce((s, e) => s + e.minutes, 0),
      personal: dayEntries
        .filter(e => e.category === 'personal')
        .reduce((s, e) => s + e.minutes, 0),
    });
  }
  return out;
}

// ---- running timer (survives reloads via localStorage) ----
const TIMER_KEY = 'anddhen.timesheet.timer';

export function getTimer() {
  try {
    return JSON.parse(localStorage.getItem(TIMER_KEY));
  } catch {
    return null;
  }
}

export function startTimer(activity, category) {
  const t = { startedAt: Date.now(), activity, category };
  localStorage.setItem(TIMER_KEY, JSON.stringify(t));
  return t;
}

export function clearTimer() {
  localStorage.removeItem(TIMER_KEY);
}
