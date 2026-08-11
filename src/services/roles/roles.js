/**
 * Role system — single source of truth is the Firestore `User/{uid}.role` field.
 * Roles are always read/written from Firebase, independent of the Django/Firebase
 * data-provider toggle (per requirement: "roles should come from firebase").
 *
 * Hierarchy (higher inherits lower access):
 *   user (0) < employee (1) < admin (2) < superadmin (3)
 * Everyone defaults to `user`. Only admin/superadmin can change roles; only a
 * superadmin can grant/revoke `superadmin` or modify another admin/superadmin —
 * enforced here AND in firestore.rules.
 */
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../connector/firebase';

export const ROLES = {
  USER: 'user',
  EMPLOYEE: 'employee',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
};

export const ROLE_LABELS = {
  user: 'User',
  employee: 'Employee',
  admin: 'Admin',
  superadmin: 'Super Admin',
};

export const ASSIGNABLE_ROLES = [ROLES.USER, ROLES.EMPLOYEE, ROLES.ADMIN, ROLES.SUPERADMIN];

/**
 * Bootstrap superadmins — treated as superadmin by the client even before a
 * Firestore role doc exists (or while Firestore is disabled). This is what
 * guarantees the first superadmin can get in without a chicken-and-egg. Keep in
 * sync with the same list in firestore.rules (isBootstrapSuper).
 */
export const SUPERADMIN_EMAILS = ['abhishekgattineni@gmail.com'];

export const isBootstrapSuperadmin = email =>
  !!email && SUPERADMIN_EMAILS.some(e => e.toLowerCase() === String(email).toLowerCase());

const RANK = { user: 0, employee: 1, admin: 2, superadmin: 3 };

export const rankOf = role => RANK[role] ?? 0;

/** Does `role` meet or exceed `required` in the hierarchy? */
export const hasAtLeast = (role, required) => rankOf(role) >= rankOf(required);

/** Can this role open the role-management UI at all? (admin or above) */
export const canManageRoles = role => hasAtLeast(role, ROLES.ADMIN);

/**
 * Can `actorRole` change a user currently at `targetRole` to `newRole`?
 * - superadmin: may set any role on anyone.
 * - admin: may manage user/employee/admin, but NOT touch a superadmin and NOT
 *   grant superadmin.
 */
export function canAssign(actorRole, targetRole, newRole) {
  if (actorRole === ROLES.SUPERADMIN) return true;
  if (actorRole === ROLES.ADMIN) {
    if (targetRole === ROLES.SUPERADMIN || newRole === ROLES.SUPERADMIN) return false;
    return ASSIGNABLE_ROLES.includes(newRole);
  }
  return false;
}

/** Roles an actor is allowed to pick in a dropdown for a given target. */
export function assignableOptions(actorRole, targetRole) {
  return ASSIGNABLE_ROLES.filter(r => canAssign(actorRole, targetRole, r) || r === targetRole);
}

/**
 * Read a user's role from Firestore. Resilient: returns `user` if the doc is
 * missing or Firestore is unavailable, so the app never hard-fails on roles.
 */
export async function getUserRole(uid) {
  try {
    const snap = await getDoc(doc(db, 'User', uid));
    return (snap.exists() && snap.data().role) || ROLES.USER;
  } catch (e) {
    console.error('getUserRole failed, defaulting to user:', e);
    return ROLES.USER;
  }
}

/**
 * Ensure a User doc exists for this signed-in user and return their access:
 * `{ role, cards }`, where `cards` are the dashboard-card grants an admin has
 * handed them (see services/roles/cards.js). Creates the doc with role `user`
 * and no grants on first sign-in WITHOUT clobbering either field on an existing
 * doc. This is what makes "everyone is a user by default" work.
 */
export async function ensureUserProfile(user) {
  const empty = { role: ROLES.USER, cards: [] };
  if (!user) return empty;

  // Bootstrap superadmins are honored even if Firestore is unreachable/disabled,
  // so the first superadmin is never locked out.
  const bootstrap = isBootstrapSuperadmin(user.email);
  const fallback = { role: bootstrap ? ROLES.SUPERADMIN : ROLES.USER, cards: [] };

  try {
    const ref = doc(db, 'User', user.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      const stored = data.role || ROLES.USER;
      const cards = data.cardAccess || [];
      // Promote a bootstrap superadmin whose stored role hasn't caught up yet.
      if (bootstrap && stored !== ROLES.SUPERADMIN) {
        try {
          await setDoc(
            ref,
            { role: ROLES.SUPERADMIN, updatedAt: serverTimestamp() },
            { merge: true }
          );
        } catch (_) {
          /* rules/offline may block the write; client role still applies */
        }
        return { role: ROLES.SUPERADMIN, cards };
      }
      return { role: stored, cards };
    }

    await setDoc(
      ref,
      {
        user_id: user.uid,
        email_id: user.email || '',
        full_name: user.displayName || '',
        role: fallback.role,
        cardAccess: [],
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
    return fallback;
  } catch (e) {
    // IMPORTANT: report the failure rather than only falling back. A denied or
    // failed read used to be indistinguishable from "this person is a plain
    // user", so an infrastructure problem surfaced as a confident 403 telling a
    // real employee their role was User. Callers decide what to do with it.
    console.error('ensureUserProfile failed, using fallback access:', e);
    return { ...fallback, error: e?.code || e?.message || String(e) };
  }
}

/**
 * Watch a user's role/card grants and call `onChange` whenever they change.
 * Without this the role resolves once per session, so an admin's change didn't
 * reach an already-open tab until the user signed out and back in — which looks
 * exactly like the change not having worked.
 * Returns an unsubscribe function.
 */
export function subscribeUserProfile(user, onChange, onError) {
  if (!user) return () => {};
  const bootstrap = isBootstrapSuperadmin(user.email);
  return onSnapshot(
    doc(db, 'User', user.uid),
    snap => {
      const data = snap.exists() ? snap.data() : {};
      onChange({
        role: bootstrap ? ROLES.SUPERADMIN : data.role || ROLES.USER,
        cards: data.cardAccess || [],
      });
    },
    err => {
      console.error('subscribeUserProfile failed:', err);
      if (onError) onError(err?.code || err?.message || String(err));
    }
  );
}

/** List all users with their roles (for the management UI). Admin/superadmin only via rules. */
export async function listUsersWithRoles() {
  const snap = await getDocs(collection(db, 'User'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** Change a user's role. Authorization is enforced by firestore.rules; callers
 *  should also gate the UI with canAssign() for a good UX. */
export async function setUserRole(uid, role) {
  await updateDoc(doc(db, 'User', uid), { role, updatedAt: serverTimestamp() });
}

/**
 * Delete a user's profile document (role and card grants with it).
 *
 * Firebase Auth and Firestore are separate stores: removing someone from
 * Authentication leaves this document behind, so they keep appearing in the
 * role manager and their old grants would be waiting for them if they ever
 * signed up again with the same address. This is the cleanup for that.
 *
 * It does NOT delete the Auth account — that needs the Admin SDK. Authorization
 * is enforced by firestore.rules (admin or above).
 */
export async function deleteUserProfile(uid) {
  await deleteDoc(doc(db, 'User', uid));
}
