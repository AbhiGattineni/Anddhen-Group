import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  watchWorkspace,
  watchDaemon,
  isAgentOnline,
  triggerRefresh,
  watchAgents,
  createAgent,
  sendAgentMessage,
  runAgent,
  fetchWorkspaceOnce,
} from 'src/services/tripsaathi/tripsaathi';
import './TripSaathiDashboard.css';

const KIND_ICON = {
  trip: '🧭',
  event: '🎉',
  project: '🛠️',
  purchase: '🛒',
  money: '💸',
  other: '📌',
};
const STATUS_CLASS = { live: 'ts-good', done: 'ts-neutral', abandoned: 'ts-dim' };

/** Money rows the owner still owes / is still owed, pulled from ws.summary. */
function MoneyCard({ title, total, rows, dirKey }) {
  if (!rows?.length) return null;
  return (
    <div className="ts-money-card">
      <h4>{title}</h4>
      <div className="ts-money-total">
        {total || `${rows.length} item${rows.length > 1 ? 's' : ''}`}
      </div>
      <ul>
        {rows.map((r, i) => (
          <li key={i}>
            <strong>{r.amount}</strong> {dirKey === 'to' ? 'to' : 'from'} {r[dirKey]} — {r.what}
            <span className="ts-where"> {r.trackTitle}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function QueueList({ items, owner }) {
  if (!items?.length) {
    return <p className="ts-empty">Nothing is waiting on {owner || 'you'} right now.</p>;
  }
  return (
    <ul className="ts-queue">
      {items.map((it, i) => (
        <li key={i}>
          <span
            className={`ts-pill ${it.type === 'unclaimed' ? 'ts-warm' : it.type === 'question' ? 'ts-neutral' : 'ts-good'}`}
          >
            {it.type === 'unclaimed'
              ? 'unclaimed'
              : it.type === 'question'
                ? 'needs answer'
                : 'yours'}
          </span>
          <span>{it.text}</span>
          {it.due && <span className="ts-where">due {it.due}</span>}
          <span className="ts-where">{it.trackTitle}</span>
        </li>
      ))}
    </ul>
  );
}

function TrackCard({ track, manual, online, running, onSend, onRun }) {
  const [open, setOpen] = useState(false);
  const s = track.state;
  const openTodos = (s?.todos ?? []).filter(t => t.status !== 'done').length;
  const isManual = track.source === 'manual';
  const pending = manual?.pendingCount ?? 0;

  return (
    <div className="ts-track">
      <button className="ts-track-summary" onClick={() => setOpen(o => !o)}>
        <span>{KIND_ICON[track.kind] ?? '📌'}</span>
        <span className="ts-track-title">{track.title}</span>
        <span className={`ts-pill ${STATUS_CLASS[track.status] ?? 'ts-neutral'}`}>
          {track.status}
        </span>
        {isManual && <span className="ts-pill ts-neutral">manual</span>}
        {openTodos > 0 && <span className="ts-pill ts-warm">{openTodos} open</span>}
        {isManual && pending > 0 && <span className="ts-pill ts-warm">{pending} new</span>}
        <span className="ts-track-sub">{track.summary}</span>
      </button>
      {open && isManual && (
        <Composer
          trackId={track.id}
          pending={pending}
          online={online}
          running={running}
          onSend={onSend}
          onRun={onRun}
        />
      )}
      {open && s && (
        <div className="ts-track-body">
          <p className="ts-vibe">{s.vibe}</p>
          {s.decisions?.length > 0 && (
            <>
              <h5>Decided</h5>
              <ul>
                {s.decisions.map((d, i) => (
                  <li key={i}>
                    {d.decision} <em className="ts-conf">({d.confidence})</em>
                  </li>
                ))}
              </ul>
            </>
          )}
          {s.todos?.length > 0 && (
            <>
              <h5>Todos</h5>
              <ul>
                {s.todos.map((t, i) => (
                  <li key={i}>
                    {t.status === 'done' ? '✅' : '⬜'} {t.task}
                    {t.owner ? ` — ${t.owner}` : ' — unclaimed'}
                    {t.due ? ` (${t.due})` : ''}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/** Message input box for one manual agent. Sending queues; Run extracts. */
function Composer({ trackId, pending, online, running, onSend, onRun }) {
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');

  const send = async () => {
    const text = draft.trim();
    if (!text || busy) return;
    setBusy(true);
    setNote('');
    try {
      const r = await onSend(trackId, text);
      setDraft('');
      setNote(`queued — ${r.pendingCount ?? '?'} message(s) not yet extracted`);
    } catch (e) {
      setNote(e.message || 'Could not send.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="ts-composer">
      <textarea
        rows={2}
        value={draft}
        placeholder="Tell this agent something… (Ctrl+Enter to send)"
        disabled={!online || busy}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) send();
        }}
      />
      <div className="ts-composer-actions">
        <button
          className="btn btn-sm btn-primary"
          disabled={!online || busy || !draft.trim()}
          onClick={send}
        >
          Send
        </button>
        {pending > 0 && (
          <button
            className="btn btn-sm btn-outline-primary"
            disabled={!online || running}
            title="One extraction run over this agent's messages — uses LLM credits"
            onClick={() => onRun(trackId)}
          >
            <i className="bi bi-play-fill me-1" />
            Run agent ({pending} new)
          </button>
        )}
        {note && <span className="ts-where">{note}</span>}
        {!online && <span className="ts-where">machine offline — sending disabled</span>}
      </div>
    </div>
  );
}

Composer.propTypes = {
  trackId: PropTypes.string.isRequired,
  pending: PropTypes.number,
  online: PropTypes.bool,
  running: PropTypes.bool,
  onSend: PropTypes.func.isRequired,
  onRun: PropTypes.func.isRequired,
};

/** Inline create form — title + profile + optional focus. */
function NewAgentForm({ online, onCreated }) {
  const [openForm, setOpenForm] = useState(false);
  const [title, setTitle] = useState('');
  const [profile, setProfile] = useState('general');
  const [focus, setFocus] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async e => {
    e.preventDefault();
    if (!title.trim() || busy) return;
    setBusy(true);
    setError('');
    try {
      await createAgent({ title: title.trim(), profile, focus: focus.trim() || null });
      setTitle('');
      setFocus('');
      setOpenForm(false);
      onCreated();
    } catch (err) {
      setError(err.message || 'Could not create the agent.');
    } finally {
      setBusy(false);
    }
  };

  if (!openForm) {
    return (
      <button
        className="btn btn-sm btn-outline-primary"
        disabled={!online}
        onClick={() => setOpenForm(true)}
      >
        <i className="bi bi-plus-lg me-1" />
        New agent
      </button>
    );
  }

  return (
    <form className="ts-new-agent" onSubmit={submit}>
      <input
        autoFocus
        value={title}
        placeholder="Agent title, e.g. Goa Trip 2027"
        onChange={e => setTitle(e.target.value)}
      />
      <select value={profile} onChange={e => setProfile(e.target.value)}>
        {['general', 'trip', 'event', 'project', 'purchase'].map(p => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <input
        value={focus}
        placeholder="Focus (optional)"
        onChange={e => setFocus(e.target.value)}
      />
      <button className="btn btn-sm btn-primary" type="submit" disabled={busy || !title.trim()}>
        Create
      </button>
      <button
        className="btn btn-sm btn-outline-secondary"
        type="button"
        onClick={() => setOpenForm(false)}
      >
        Cancel
      </button>
      {error && <span className="ts-error">{error}</span>}
    </form>
  );
}

NewAgentForm.propTypes = {
  online: PropTypes.bool,
  onCreated: PropTypes.func.isRequired,
};

MoneyCard.propTypes = {
  title: PropTypes.string.isRequired,
  total: PropTypes.string,
  rows: PropTypes.array,
  dirKey: PropTypes.string.isRequired,
};

QueueList.propTypes = {
  items: PropTypes.array,
  owner: PropTypes.string,
};

TrackCard.propTypes = {
  track: PropTypes.object.isRequired,
  manual: PropTypes.object,
  online: PropTypes.bool,
  running: PropTypes.bool,
  onSend: PropTypes.func.isRequired,
  onRun: PropTypes.func.isRequired,
};

export default function TripSaathiDashboard() {
  // One machine, no cloud database — this polls that machine's local server
  // (through a tunnel in production; see src/services/tripsaathi/tripsaathi.js).
  const [ws, setWs] = useState(null);
  const [daemon, setDaemon] = useState(null);
  const [agents, setAgents] = useState(null); // manual-agent inbox stats
  // Loading only means "we haven't heard back from the first poll yet" — once
  // we have, "offline" is a normal state shown via `daemon`, not an error.
  const [loading, setLoading] = useState(true);
  const [refreshMsg, setRefreshMsg] = useState('');

  useEffect(() => {
    const unsubWs = watchWorkspace(data => {
      if (data) setWs(data); // keep last known data through offline spells
      setLoading(false);
    });
    const unsubDaemon = watchDaemon(setDaemon);
    const unsubAgents = watchAgents(setAgents);
    return () => {
      unsubWs();
      unsubDaemon();
      unsubAgents();
    };
  }, []);

  const online = isAgentOnline(daemon);
  const running = daemon?.running;
  const lastRunFailed = daemon?.lastRun && daemon.lastRun.ok === false;
  const agentsById = Object.fromEntries((agents ?? []).map(a => [a.id, a]));

  const refetchWorkspace = async () => {
    try {
      setWs(await fetchWorkspaceOnce());
    } catch {
      /* next poll will catch up */
    }
  };

  const onRefresh = async () => {
    setRefreshMsg('');
    try {
      await triggerRefresh();
      setRefreshMsg('Refresh started — extraction can take a few minutes.');
    } catch (e) {
      setRefreshMsg(e.message || 'Could not start a refresh.');
    }
  };

  const onSend = async (id, text) => {
    const r = await sendAgentMessage(id, { text, sender: ws?.owner || 'me' });
    setAgents(prev =>
      prev
        ? prev.map(a =>
            a.id === id ? { ...a, messageCount: r.messageCount, pendingCount: r.pendingCount } : a
          )
        : prev
    );
    return r;
  };

  const onRun = async id => {
    setRefreshMsg('');
    try {
      await runAgent(id);
      setRefreshMsg(`Agent "${id}" is running — data appears when it finishes.`);
    } catch (e) {
      setRefreshMsg(e.message || 'Could not start the agent.');
    }
  };

  const tracks = ws?.tracks ?? [];
  const liveTracks = tracks.filter(t => t.status === 'live');
  const pastTracks = tracks.filter(t => t.status !== 'live');

  return (
    <div className="ts-dashboard container-fluid px-3 px-md-5">
      <div className="ts-header d-flex justify-content-between align-items-start flex-wrap gap-2">
        <div>
          <h2>PlanningSaathi</h2>
          <p className="ts-sub">
            Group-chat planning agent — one agent per live effort, straight from the owner&rsquo;s
            machine.
          </p>
          <div className="ts-daemon-line">
            {loading ? (
              <span className="ts-pill ts-dim">● checking…</span>
            ) : online ? (
              <span className="ts-pill ts-good">
                ● machine online{running ? ' — refresh running…' : ''}
              </span>
            ) : (
              <span className="ts-pill ts-dim">
                ● machine offline{ws ? ' — showing last known data' : ''}
              </span>
            )}
            {lastRunFailed && <span className="ts-pill ts-warm">last refresh failed</span>}
          </div>
        </div>
        <div className="text-end">
          <div className="d-flex gap-2 justify-content-end flex-wrap">
            <NewAgentForm online={online} onCreated={refetchWorkspace} />
            <button
              className="btn btn-sm btn-outline-primary"
              disabled={!online || running}
              title="Runs the extraction pipeline on the machine — uses LLM credits"
              onClick={onRefresh}
            >
              <i className="bi bi-arrow-repeat me-1" />
              {running ? 'Refreshing…' : 'Run refresh'}
            </button>
          </div>
          {refreshMsg && <div className="ts-where mt-1">{refreshMsg}</div>}
        </div>
      </div>

      {loading && <p className="ts-empty">Checking whether the machine is reachable…</p>}

      {!loading && !ws && online && (
        <p className="ts-empty">
          Machine is online but hasn&rsquo;t generated a workspace yet — run a refresh (or `cycle`
          on the machine).
        </p>
      )}

      {!loading && !ws && !online && (
        <p className="ts-empty">
          Nothing to show yet — the machine hasn&rsquo;t been reachable since this page loaded. It
          only shows data while it&rsquo;s actually running; that&rsquo;s expected, not an error.
        </p>
      )}

      {ws && (
        <>
          <h3>{ws.owner ? `${ws.owner}'s workspace` : 'Group workspace'}</h3>
          <p className="ts-vibe">
            {tracks.length} effort{tracks.length === 1 ? '' : 's'} tracked,{' '}
            {ws.summary?.liveEvents ?? 0} still live · updated{' '}
            {ws.generatedAt ? new Date(ws.generatedAt).toLocaleString() : '—'}
          </p>

          <h4>Your queue</h4>
          <QueueList items={ws.summary?.needsYou} owner={ws.owner} />

          <div className="ts-money-grid">
            <MoneyCard
              title="You owe"
              total={ws.summary?.youOweTotal}
              rows={ws.summary?.youOwe}
              dirKey="to"
            />
            <MoneyCard
              title="Owed to you"
              total={ws.summary?.owedToYouTotal}
              rows={ws.summary?.owedToYou}
              dirKey="from"
            />
          </div>

          {liveTracks.length > 0 && (
            <>
              <h4>Live efforts</h4>
              {liveTracks.map(t => (
                <TrackCard
                  key={t.id}
                  track={t}
                  manual={agentsById[t.id]}
                  online={online}
                  running={Boolean(running)}
                  onSend={onSend}
                  onRun={onRun}
                />
              ))}
            </>
          )}

          {pastTracks.length > 0 && (
            <details className="ts-past">
              <summary>Finished &amp; abandoned ({pastTracks.length})</summary>
              {pastTracks.map(t => (
                <TrackCard
                  key={t.id}
                  track={t}
                  manual={agentsById[t.id]}
                  online={online}
                  running={Boolean(running)}
                  onSend={onSend}
                  onRun={onRun}
                />
              ))}
            </details>
          )}
        </>
      )}
    </div>
  );
}
