import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { trace } from '../services/roles/authTrace';

/**
 * Shared auth state.
 *
 * This used to be a plain hook: every component that called it created its own
 * useState and its own onAuthStateChanged subscription. At sign-in each copy
 * updated independently, so for a moment ProtectedRoute could see a signed-in
 * user while RoleProvider still saw nobody — and a real employee got bounced to
 * /not-authorized on login while the same URL typed by hand worked fine.
 *
 * One module-level subscription, one snapshot, every consumer notified in the
 * same React batch. The hook's shape is unchanged, so callers don't care.
 */
let snapshot = { user: null, loading: true, error: null };
const subscribers = new Set();
let started = false;

const emit = next => {
  snapshot = next;
  subscribers.forEach(fn => fn(snapshot));
};

// Started lazily from the first useEffect, which guarantees the Firebase app is
// initialized by then (index.js imports it before rendering).
function startOnce() {
  if (started) return;
  started = true;
  onAuthStateChanged(
    getAuth(),
    user => {
      trace('auth:changed', { uid: user ? user.uid : null, subscribers: subscribers.size });
      emit({ user, loading: false, error: null });
    },
    error => {
      trace('auth:error', { error: String(error && error.code) });
      emit({ user: null, loading: false, error });
    }
  );
}

export const useAuth = () => {
  const [state, setState] = useState(snapshot);

  useEffect(() => {
    startOnce();
    subscribers.add(setState);
    // Catch up if auth resolved between this component's render and its effect.
    setState(snapshot);
    return () => subscribers.delete(setState);
  }, []);

  return state;
};
