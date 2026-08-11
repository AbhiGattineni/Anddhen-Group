/**
 * Where a user should land right after signing in.
 *
 *  1. If they were bounced to /login while trying to reach a protected page,
 *     send them back to it. `preLoginPath` is consumed here — it's a one-shot
 *     hand-off, and leaving it behind meant a path from an old session kept
 *     hijacking later logins.
 *  2. Otherwise always the dashboard. ProtectedRoute owns the access decision
 *     from there: authorized users see it, everyone else gets a 403 that names
 *     what they're missing.
 *
 * Deliberately no role check here. Branching on the role meant a brand-new
 * account — which resolves as a plain `user` until an admin promotes it — got
 * dropped on the marketing home page with no hint that a dashboard exists or
 * that access has to be granted. Landing on the dashboard and being told why
 * it's closed is more useful than landing nowhere.
 */
export const DASHBOARD_PATH = '/employeedashboard';

const AUTH_PATHS = ['/login', '/register', '/resetpassword'];

export async function postLoginPath() {
  const stored = localStorage.getItem('preLoginPath');
  localStorage.removeItem('preLoginPath');
  // Never send them back to an auth page they just came through.
  if (stored && !AUTH_PATHS.includes(stored)) return stored;
  return DASHBOARD_PATH;
}
