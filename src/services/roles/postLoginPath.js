/**
 * Where a user should land right after signing in.
 *
 * Two rules, in order:
 *  1. If they were bounced to /login while trying to reach a protected page,
 *     send them back to it. `preLoginPath` is consumed here — it's a one-shot
 *     hand-off, and leaving it behind meant a path from an old session kept
 *     hijacking later logins.
 *  2. Otherwise employees and above go to their dashboard, not the marketing
 *     home page. Everyone else goes home.
 *
 * The role is read from Firestore rather than from RoleContext, because this
 * runs inside the sign-in handler — before the provider has resolved the new
 * user's role.
 */
import { ensureUserProfile, hasAtLeast, ROLES } from './roles';

export const DASHBOARD_PATH = '/employeedashboard';

export async function postLoginPath(user) {
  const stored = localStorage.getItem('preLoginPath');
  localStorage.removeItem('preLoginPath');
  // Never send them back to an auth page they just came through.
  if (stored && !['/login', '/register', '/resetpassword'].includes(stored)) {
    return stored;
  }

  try {
    const { role } = await ensureUserProfile(user);
    return hasAtLeast(role, ROLES.EMPLOYEE) ? DASHBOARD_PATH : '/';
  } catch (e) {
    // A role lookup failure must never block a successful sign-in.
    console.error('postLoginPath: role lookup failed, sending home:', e);
    return '/';
  }
}
