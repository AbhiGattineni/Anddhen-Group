import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  watchWorkspace,
  watchDaemon,
  isAgentOnline,
  triggerRefresh,
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

function TrackCard({ track }) {
  const [open, setOpen] = useState(false);
  const s = track.state;
  const openTodos = (s?.todos ?? []).filter(t => t.status !== 'done').length;

  return (
    <div className="ts-track">
      <button className="ts-track-summary" onClick={() => setOpen(o => !o)}>
        <span>{KIND_ICON[track.kind] ?? '📌'}</span>
        <span className="ts-track-title">{track.title}</span>
        <span className={`ts-pill ${STATUS_CLASS[track.status] ?? 'ts-neutral'}`}>
          {track.status}
        </span>
        {openTodos > 0 && <span className="ts-pill ts-warm">{openTodos} open</span>}
        <span className="ts-track-sub">{track.summary}</span>
      </button>
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
};

export default function TripSaathiDashboard() {
  // One machine, no cloud database — this polls that machine's local server
  // (through a tunnel in production; see src/services/tripsaathi/tripsaathi.js).
  const [ws, setWs] = useState(null);
  const [daemon, setDaemon] = useState(null);
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
    return () => {
      unsubWs();
      unsubDaemon();
    };
  }, []);

  const online = isAgentOnline(daemon);
  const running = daemon?.running;
  const lastRunFailed = daemon?.lastRun && daemon.lastRun.ok === false;

  const onRefresh = async () => {
    setRefreshMsg('');
    try {
      await triggerRefresh();
      setRefreshMsg('Refresh started — extraction can take a few minutes.');
    } catch (e) {
      setRefreshMsg(e.message || 'Could not start a refresh.');
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
          <button
            className="btn btn-sm btn-outline-primary"
            disabled={!online || running}
            title="Runs the extraction pipeline on the machine — uses LLM credits"
            onClick={onRefresh}
          >
            <i className="bi bi-arrow-repeat me-1" />
            {running ? 'Refreshing…' : 'Run refresh'}
          </button>
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
                <TrackCard key={t.id} track={t} />
              ))}
            </>
          )}

          {pastTracks.length > 0 && (
            <details className="ts-past">
              <summary>Finished &amp; abandoned ({pastTracks.length})</summary>
              {pastTracks.map(t => (
                <TrackCard key={t.id} track={t} />
              ))}
            </details>
          )}
        </>
      )}
    </div>
  );
}
