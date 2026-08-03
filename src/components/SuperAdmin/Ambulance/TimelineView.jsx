import React, { useEffect, useRef, useState } from 'react';
import {
  heartbeatTimes,
  coverageSegments,
  latestHeartbeat,
  GAP_MS,
} from 'src/services/ambulance/ambulance';
import { SafeImg, fmt, fmtTime } from './shared';

const dayKey = d => d.toISOString().slice(0, 10);
const localDayStr = d => {
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

const fmtDur = ms => {
  const min = Math.round(ms / 60000);
  if (min < 60) return `${min} min`;
  return `${Math.floor(min / 60)} h ${min % 60} min`;
};

/**
 * Coverage audit: heartbeats arrive every 30 s, so any silence longer than
 * 2 min means the device was off/offline. One day at a time (≈2 900 docs).
 */
export default function TimelineView() {
  const [dayStr, setDayStr] = useState(localDayStr(new Date()));
  const [data, setData] = useState(null); // {times, segments, gaps, coveredMs}
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const cache = useRef({});

  useEffect(() => {
    latestHeartbeat()
      .then(setLatest)
      .catch(() => {});
  }, []);

  useEffect(() => {
    let dead = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const start = new Date(`${dayStr}T00:00:00`);
        const end = new Date(`${dayStr}T23:59:59.999`);
        const key = dayKey(start);
        if (!cache.current[key] || dayStr === localDayStr(new Date())) {
          const times = await heartbeatTimes(start, end);
          cache.current[key] = { times, ...coverageSegments(times) };
        }
        if (!dead) setData(cache.current[key]);
      } catch (e) {
        if (!dead) setError(e.message || 'Could not load heartbeats');
      } finally {
        if (!dead) setLoading(false);
      }
    })();
    return () => {
      dead = true;
    };
  }, [dayStr]);

  const shiftDay = delta => {
    const d = new Date(`${dayStr}T12:00:00`);
    d.setDate(d.getDate() + delta);
    setDayStr(localDayStr(d));
  };

  const dayStart = new Date(`${dayStr}T00:00:00`).getTime();
  const DAY = 24 * 3600e3;
  const pct = t => (((t - dayStart) / DAY) * 100).toFixed(2);
  const topGaps = data ? [...data.gaps].sort((a, b) => b.end - b.start - (a.end - a.start)) : [];

  return (
    <>
      <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
        <button className="btn btn-sm btn-outline-secondary" onClick={() => shiftDay(-1)}>
          <i className="bi bi-chevron-left" />
        </button>
        <input
          type="date"
          className="form-control form-control-sm w-auto"
          value={dayStr}
          max={localDayStr(new Date())}
          onChange={e => e.target.value && setDayStr(e.target.value)}
        />
        <button className="btn btn-sm btn-outline-secondary" onClick={() => shiftDay(1)}>
          <i className="bi bi-chevron-right" />
        </button>
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => setDayStr(localDayStr(new Date()))}
        >
          Today
        </button>
        {loading && <span className="spinner-border spinner-border-sm" />}
      </div>

      {error && <div className="alert alert-warning py-2">{error}</div>}

      {data && (
        <div className="amb-card mb-3">
          <div className="amb-card-head">
            Recording coverage — {dayStr}
            <span className="text-muted fw-normal">
              {' '}
              (a gap means no heartbeat for over {GAP_MS / 60000} minutes)
            </span>
          </div>

          {data.times.length === 0 ? (
            <p className="text-muted mb-0">No heartbeats this day — device was off or offline.</p>
          ) : (
            <>
              <div className="amb-coverage">
                {data.segments.map((s, i) => (
                  <div
                    key={i}
                    className="amb-coverage-seg"
                    style={{
                      left: `${pct(s.start.getTime())}%`,
                      width: `${Math.max(0.15, pct(s.end.getTime()) - pct(s.start.getTime()))}%`,
                    }}
                    title={`${fmtTime(s.start)} – ${fmtTime(s.end)}`}
                  />
                ))}
              </div>
              <div className="amb-coverage-hours">
                {[0, 6, 12, 18, 24].map(h => (
                  <span key={h}>{String(h).padStart(2, '0')}:00</span>
                ))}
              </div>

              <div className="d-flex gap-4 flex-wrap mt-2 small">
                <span>
                  <strong>{fmtDur(data.coveredMs)}</strong> recorded
                </span>
                <span>
                  first ping <strong>{fmtTime(data.times[0])}</strong>
                </span>
                <span>
                  last ping <strong>{fmtTime(data.times[data.times.length - 1])}</strong>
                </span>
                <span>
                  <strong>{data.gaps.length}</strong> gap{data.gaps.length === 1 ? '' : 's'}
                </span>
                <span className="text-muted">{data.times.length} heartbeats</span>
              </div>

              {topGaps.length > 0 && (
                <div className="mt-2">
                  <div className="small fw-bold text-muted mb-1">Longest gaps</div>
                  <div className="d-flex gap-2 flex-wrap">
                    {topGaps.slice(0, 8).map((g, i) => (
                      <span key={i} className="amb-gap-chip">
                        {fmtTime(g.start)} → {fmtTime(g.end)} · {fmtDur(g.end - g.start)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {latest && (
        <div className="amb-card" style={{ maxWidth: 460 }}>
          <div className="amb-card-head">Latest camera view</div>
          <SafeImg src={latest.photoUrl} alt="latest heartbeat" className="amb-heartbeat-img" />
          <div className="text-muted small mt-1">
            heartbeat at {fmt(latest.time)} — pings arrive every 30 s while recording
          </div>
        </div>
      )}
    </>
  );
}
