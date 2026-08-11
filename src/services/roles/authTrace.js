/**
 * Diagnostic trace for the sign-in → role-resolution → route-guard sequence.
 *
 * Three fixes for "403 on login" have been reasoned about rather than
 * measured, and the failure can't be reproduced outside the live app. This
 * records what actually happens, in order, with timings, and posts it to
 * Firestore where it can be read back with the Admin SDK.
 *
 * OFF by default. Enable per-browser by visiting any page with `?trace=1`
 * (disable with `?trace=0`), so this never writes for ordinary visitors.
 * Events accumulate in memory and are flushed as ONE document per session when
 * the guard reaches a decision — writes require a signed-in user, and one doc
 * beats a write per event.
 */
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../connector/firebase';

const KEY = 'authTrace';
const COLLECTION = 'debugAuthTrace';
const t0 = Date.now();

const events = [];
let flushed = false;

function enabled() {
  try {
    const param = new URLSearchParams(window.location.search).get('trace');
    if (param === '1') localStorage.setItem(KEY, '1');
    if (param === '0') localStorage.removeItem(KEY);
    return localStorage.getItem(KEY) === '1';
  } catch (e) {
    return false;
  }
}

/** Record a step. Cheap and side-effect free when tracing is off. */
export function trace(name, data = {}) {
  if (!enabled()) return;
  const entry = { ms: Date.now() - t0, name, ...data };
  events.push(entry);
  // Also to the console, so it's visible without a round trip to Firestore.
  console.log('[authTrace]', entry);
}

/**
 * Write the accumulated trace as a single document. Called when the guard
 * decides, which is the moment worth explaining. Runs at most once per page
 * load, and never throws — diagnostics must not break the page they observe.
 */
export async function flushTrace(reason, user) {
  if (!enabled() || flushed || !user) return;
  flushed = true;
  try {
    await addDoc(collection(db, COLLECTION), {
      uid: user.uid,
      email: user.email || '',
      reason,
      path: window.location.pathname,
      userAgent: navigator.userAgent.slice(0, 200),
      events,
      createdAt: serverTimestamp(),
    });
    console.log('[authTrace] flushed', reason, events.length, 'events');
  } catch (e) {
    console.warn('[authTrace] flush failed', e);
  }
}
