/**
 * PlanningSaathi service — polls the owner's LOCAL machine directly.
 * No cloud database: raw chat and the extracted workspace both live on that
 * machine's disk. This card is a window onto whatever is currently there —
 * when the machine is off or the tunnel is down we simply have nothing to
 * show, which is an expected state, not an error.
 *
 * Endpoints (spec: tripsaathi local API):
 *   GET  /api/workspace — full workspace JSON (404 until first extraction)
 *   GET  /api/status    — cheap liveness + { running, lastRun, hasWorkspace }
 *   POST /api/refresh   — trigger a pipeline run (costs money — button only!)
 *
 * Base URL: the local default is http://localhost:5173; a hosted dashboard
 * reaches it through a tunnel URL set via REACT_APP_PLANNINGSAATHI_URL.
 * NOTE: the endpoints are currently unauthenticated — don't publish the
 * tunnel URL anywhere public.
 */
const BASE = process.env.REACT_APP_PLANNINGSAATHI_URL || 'http://localhost:5173';

const WORKSPACE_POLL_MS = 15000;
const STATUS_POLL_MS = 8000;

async function fetchJson(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, { signal: AbortSignal.timeout(8000), ...options });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body.error || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return body;
}

/**
 * Poll the machine for the current workspace. Returns an unsubscribe fn
 * (same shape as the Firestore onSnapshot pattern used elsewhere).
 */
export function watchWorkspace(onData) {
  let stopped = false;

  const poll = async () => {
    try {
      const data = await fetchJson('/api/workspace');
      if (!stopped) onData(data);
    } catch (err) {
      // 404 = machine fine, just no extraction yet. Anything else (network
      // error, timeout) = unreachable. Either way there's nothing new to show;
      // the status poll is what tells the UI which case we're in.
      if (!stopped) onData(null, err);
    }
  };

  poll();
  const id = setInterval(poll, WORKSPACE_POLL_MS);
  return () => {
    stopped = true;
    clearInterval(id);
  };
}

/**
 * Poll `/api/status` — a SUCCESSFUL response of any kind means online (the
 * spec is explicit: reachability of this endpoint IS the online signal).
 * Passes the status body through so the UI can show refresh progress and
 * distinguish "online but no workspace yet".
 */
export function watchDaemon(onData) {
  let stopped = false;

  const poll = async () => {
    try {
      const status = await fetchJson('/api/status');
      if (!stopped) onData({ at: new Date().toISOString(), reachable: true, ...status });
    } catch {
      if (!stopped) onData({ at: null, reachable: false });
    }
  };

  poll();
  const id = setInterval(poll, STATUS_POLL_MS);
  return () => {
    stopped = true;
    clearInterval(id);
  };
}

/**
 * Trigger a full pipeline run on the machine. Costs real money (LLM calls) —
 * only ever call from an explicit user action. Resolves when ACCEPTED (202);
 * the run itself continues in the background — watch `/api/status.running`.
 */
export async function triggerRefresh() {
  try {
    return await fetchJson('/api/refresh', { method: 'POST' });
  } catch (err) {
    if (err.status === 409) throw new Error('A refresh is already running.');
    if (err.status === 501) throw new Error('This server was started without refresh support.');
    throw err;
  }
}

export function isAgentOnline(daemon) {
  return Boolean(daemon?.reachable);
}
