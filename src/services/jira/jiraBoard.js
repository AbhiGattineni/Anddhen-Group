/**
 * Jira board service — an in-house, Jira-style ticket board (Firebase-native).
 *
 *  jiraTickets/{autoId} —
 *    { key: 'AG-12', title, description, type, priority, status,
 *      assigneeUid, assigneeName, reporterUid, reporterName,
 *      createdAt, updatedAt }
 *  jiraMeta/board — { nextNumber } (counter behind the AG-n keys)
 *
 * Access (enforced in firestore.rules): admins and above, plus employees who
 * hold the `jira` card. Anyone with access may create, edit and move tickets.
 */
import {
  collection,
  doc,
  onSnapshot,
  runTransaction,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../connector/firebase';

const TICKETS = 'jiraTickets';
const META_DOC = doc(db, 'jiraMeta', 'board');

export const KEY_PREFIX = 'AG';

export const STAGES = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'todo', label: 'To Do' },
  { id: 'inprogress', label: 'In Progress' },
  { id: 'inreview', label: 'In Review' },
  { id: 'done', label: 'Done' },
];

export const TYPES = {
  task: { label: 'Task', icon: 'bi-check-square-fill', color: '#3b82f6' },
  story: { label: 'Story', icon: 'bi-bookmark-fill', color: '#22c55e' },
  bug: { label: 'Bug', icon: 'bi-bug-fill', color: '#ef4444' },
};

export const PRIORITIES = {
  highest: { label: 'Highest', icon: 'bi-chevron-double-up', color: '#dc2626', rank: 0 },
  high: { label: 'High', icon: 'bi-chevron-up', color: '#f97316', rank: 1 },
  medium: { label: 'Medium', icon: 'bi-list', color: '#eab308', rank: 2 },
  low: { label: 'Low', icon: 'bi-chevron-down', color: '#3b82f6', rank: 3 },
};

const withId = s => ({ id: s.id, ...s.data() });

/** Live list of every ticket. Returns the unsubscribe function. */
export function subscribeTickets(onChange, onError) {
  return onSnapshot(
    collection(db, TICKETS),
    snap => onChange(snap.docs.map(withId)),
    err => {
      console.error('subscribeTickets failed:', err);
      if (onError) onError(err?.code || err?.message || String(err));
    }
  );
}

/** Create a ticket with the next AG-n key (allocated in a transaction). */
export async function createTicket(fields) {
  const ref = doc(collection(db, TICKETS));
  await runTransaction(db, async tx => {
    const meta = await tx.get(META_DOC);
    const n = (meta.exists() ? meta.data().nextNumber : 1) || 1;
    tx.set(META_DOC, { nextNumber: n + 1 }, { merge: true });
    tx.set(ref, {
      ...fields,
      key: `${KEY_PREFIX}-${n}`,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
  return ref.id;
}

export async function updateTicket(id, fields) {
  await updateDoc(doc(db, TICKETS, id), { ...fields, updatedAt: serverTimestamp() });
}

export async function deleteTicket(id) {
  await deleteDoc(doc(db, TICKETS, id));
}

/** Two-letter initials for an avatar. */
export function initials(name) {
  const parts = String(name || '?')
    .replace(/@.*/, '')
    .split(/[\s._-]+/)
    .filter(Boolean);
  return ((parts[0]?.[0] || '?') + (parts[1]?.[0] || '')).toUpperCase();
}

const AVATAR_COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#22c55e', '#f97316', '#ec4899', '#6366f1'];

/** Stable colour per person, so the same name is always the same avatar. */
export function avatarColor(seed) {
  let h = 0;
  for (const ch of String(seed || '')) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
