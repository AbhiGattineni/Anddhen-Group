import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from 'src/hooks/useAuth';
import { useRole } from 'src/services/roles/RoleContext';
import {
  addEntry,
  deleteEntry,
  listMyEntries,
  listTeamEntries,
  dailyTotals,
  fmtMinutes,
  dayStr,
  getTimer,
  startTimer,
  clearTimer,
} from 'src/services/timesheet/timesheet';
import './Timesheet.css';

// Validated 2-series pair from the app palette (same as the ambulance charts).
const CAT_META = {
  professional: { color: '#3b82f6', label: 'Professional', icon: 'bi-briefcase' },
  personal: { color: '#06b6d4', label: 'Personal', icon: 'bi-heart' },
};

/** Side-by-side per-day bars, professional vs personal. */
function WeekBars({ days }) {
  const max = Math.max(60, ...days.map(d => Math.max(d.professional, d.personal)));
  return (
    <div>
      <div className="tsh-legend">
        {Object.values(CAT_META).map(m => (
          <span key={m.label} className="tsh-legend-item">
            <span className="tsh-chip" style={{ background: m.color }} />
            {m.label}
          </span>
        ))}
      </div>
      <div className="tsh-bars">
        {days.map(d => (
          <div
            className="tsh-bar-col"
            key={d.date}
            title={`${d.label}: ${fmtMinutes(d.professional)} professional · ${fmtMinutes(d.personal)} personal`}
          >
            <div className="tsh-bar-pair">
              <div
                className="tsh-bar"
                style={{
                  height: `${Math.max(2, (d.professional / max) * 100)}%`,
                  background: CAT_META.professional.color,
                }}
              />
              <div
                className="tsh-bar"
                style={{
                  height: `${Math.max(2, (d.personal / max) * 100)}%`,
                  background: CAT_META.personal.color,
                }}
              />
            </div>
            <div className="tsh-bar-label">{d.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

WeekBars.propTypes = { days: PropTypes.array.isRequired };

export default function Timesheet() {
  const { user } = useAuth();
  const { isAtLeast } = useRole();
  const [tab, setTab] = useState('mine');

  return (
    <div className="tsh-wrap container-fluid px-3 px-md-5">
      <div className="py-3">
        <h1 className="tsh-title h3">Timesheet</h1>
        <p className="tsh-subtitle">
          Log where your hours go — professional and personal — and see the balance.
        </p>
      </div>

      {!user ? (
        <p className="text-muted">Sign in to log your time.</p>
      ) : (
        <>
          {isAtLeast('admin') && (
            <ul className="nav gap-2 mb-3">
              {[
                ['mine', 'My time', 'bi-person'],
                ['team', 'Team', 'bi-people'],
              ].map(([key, label, icon]) => (
                <li className="nav-item" key={key}>
                  <button
                    className={`tsh-tab ${tab === key ? 'active' : ''}`}
                    onClick={() => setTab(key)}
                  >
                    <i className={`bi ${icon} me-1`} />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {tab === 'mine' ? <MyTime user={user} /> : <TeamView />}
        </>
      )}
    </div>
  );
}

/* ---------------- my time ---------------- */

function MyTime({ user }) {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [timer, setTimer] = useState(getTimer());
  const [, tick] = useState(0); // re-render the running clock

  const [form, setForm] = useState({
    activity: '',
    category: 'professional',
    date: dayStr(),
    hours: '',
    mins: '',
  });

  const refresh = useCallback(() => {
    listMyEntries(user.uid)
      .then(setEntries)
      .catch(e => setError(e.message || 'Could not load entries'));
  }, [user.uid]);

  useEffect(refresh, [refresh]);

  useEffect(() => {
    if (!timer) return undefined;
    const t = setInterval(() => tick(n => n + 1), 30000);
    return () => clearInterval(t);
  }, [timer]);

  const save = async ({ activity, category, minutes, date }) => {
    setBusy(true);
    setError('');
    try {
      await addEntry({
        uid: user.uid,
        userName: user.displayName || '',
        userEmail: user.email || '',
        date,
        category,
        activity,
        minutes,
      });
      refresh();
      return true;
    } catch (e) {
      setError(e.message || 'Could not save');
      return false;
    } finally {
      setBusy(false);
    }
  };

  const submitForm = async e => {
    e.preventDefault();
    const minutes = (Number(form.hours) || 0) * 60 + (Number(form.mins) || 0);
    if (await save({ ...form, minutes })) {
      setForm(f => ({ ...f, activity: '', hours: '', mins: '' }));
    }
  };

  const stopTimer = async () => {
    const minutes = Math.max(1, Math.round((Date.now() - timer.startedAt) / 60000));
    if (await save({ ...timer, minutes, date: dayStr() })) {
      clearTimer();
      setTimer(null);
    }
  };

  const days = useMemo(() => dailyTotals(entries, 7), [entries]);
  const weekPro = days.reduce((s, d) => s + d.professional, 0);
  const weekPer = days.reduce((s, d) => s + d.personal, 0);
  const proPct = weekPro + weekPer ? Math.round((weekPro / (weekPro + weekPer)) * 100) : null;

  const byDate = useMemo(() => {
    const m = new Map();
    entries.slice(0, 60).forEach(e => {
      if (!m.has(e.date)) m.set(e.date, []);
      m.get(e.date).push(e);
    });
    return [...m.entries()];
  }, [entries]);

  const elapsedMin = timer ? Math.floor((Date.now() - timer.startedAt) / 60000) : 0;

  return (
    <>
      {error && <div className="alert alert-warning py-2">{error}</div>}

      <div className="row g-3 mb-3">
        {/* Log form + timer */}
        <div className="col-12 col-lg-5">
          <div className="tsh-card h-100">
            {timer ? (
              <div className="tsh-timer">
                <div className="tsh-timer-label">
                  <span className="tsh-dot" /> Tracking&nbsp;
                  <strong>{timer.activity}</strong>
                  <span
                    className="tsh-cat-pill ms-2"
                    style={{ background: CAT_META[timer.category].color }}
                  >
                    {timer.category}
                  </span>
                </div>
                <div className="tsh-timer-clock">
                  {Math.floor(elapsedMin / 60)}:{String(elapsedMin % 60).padStart(2, '0')}
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-primary" disabled={busy} onClick={stopTimer}>
                    <i className="bi bi-stop-fill me-1" />
                    Stop &amp; save
                  </button>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => {
                      clearTimer();
                      setTimer(null);
                    }}
                  >
                    Discard
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={submitForm}>
                <label className="form-label small fw-bold">What did you work on?</label>
                <input
                  className="form-control mb-2"
                  value={form.activity}
                  placeholder="e.g. Anddhen quiz feature / gym / reading"
                  onChange={e => setForm({ ...form, activity: e.target.value })}
                />
                <div className="d-flex gap-2 mb-2">
                  {Object.entries(CAT_META).map(([key, m]) => (
                    <button
                      type="button"
                      key={key}
                      className={`tsh-cat ${form.category === key ? 'active' : ''}`}
                      style={form.category === key ? { background: m.color, color: '#fff' } : {}}
                      onClick={() => setForm({ ...form, category: key })}
                    >
                      <i className={`bi ${m.icon} me-1`} />
                      {m.label}
                    </button>
                  ))}
                </div>
                <div className="d-flex gap-2 align-items-end flex-wrap">
                  <div>
                    <label className="form-label small mb-1">Date</label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={form.date}
                      max={dayStr()}
                      onChange={e => setForm({ ...form, date: e.target.value })}
                    />
                  </div>
                  <div style={{ width: 70 }}>
                    <label className="form-label small mb-1">Hours</label>
                    <input
                      type="number"
                      min="0"
                      className="form-control form-control-sm"
                      value={form.hours}
                      onChange={e => setForm({ ...form, hours: e.target.value })}
                    />
                  </div>
                  <div style={{ width: 70 }}>
                    <label className="form-label small mb-1">Mins</label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      className="form-control form-control-sm"
                      value={form.mins}
                      onChange={e => setForm({ ...form, mins: e.target.value })}
                    />
                  </div>
                  <button
                    className="btn btn-sm btn-primary"
                    type="submit"
                    disabled={busy || !form.activity.trim()}
                  >
                    Add
                  </button>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    type="button"
                    disabled={!form.activity.trim()}
                    title="Start a live timer for this activity"
                    onClick={() => setTimer(startTimer(form.activity.trim(), form.category))}
                  >
                    <i className="bi bi-play-fill" />
                    Start timer
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Week balance */}
        <div className="col-12 col-lg-7">
          <div className="tsh-card h-100">
            <div className="d-flex justify-content-between flex-wrap gap-2 mb-1">
              <strong>Last 7 days</strong>
              <span className="text-muted small">
                {fmtMinutes(weekPro)} professional · {fmtMinutes(weekPer)} personal
                {proPct != null && ` · ${proPct}% professional`}
              </span>
            </div>
            <WeekBars days={days} />
          </div>
        </div>
      </div>

      {/* Recent entries */}
      <div className="tsh-card">
        <strong>Recent entries</strong>
        {byDate.length === 0 && (
          <p className="text-muted mb-0 mt-2">Nothing logged yet — add your first entry above.</p>
        )}
        {byDate.map(([date, list]) => (
          <div key={date} className="tsh-day">
            <div className="tsh-day-head">
              {date === dayStr() ? 'Today' : date} ·{' '}
              {fmtMinutes(list.reduce((s, e) => s + e.minutes, 0))}
            </div>
            {list.map(e => (
              <div key={e.id} className="tsh-entry">
                <span
                  className="tsh-chip"
                  style={{ background: CAT_META[e.category]?.color || '#94a3b8' }}
                  title={e.category}
                />
                <span className="tsh-entry-activity">{e.activity}</span>
                <span className="tsh-entry-mins">{fmtMinutes(e.minutes)}</span>
                <button
                  className="tsh-del"
                  title="Delete entry"
                  onClick={async () => {
                    await deleteEntry(e.id).catch(() => {});
                    refresh();
                  }}
                >
                  <i className="bi bi-x-lg" />
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

MyTime.propTypes = { user: PropTypes.object.isRequired };

/* ---------------- team view (admins — professional entries only) ---------------- */

const weekStart = offsetWeeks => {
  const d = new Date();
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + offsetWeeks * 7); // Monday
  return d;
};

function TeamView() {
  const [offset, setOffset] = useState(0);
  const [entries, setEntries] = useState(null);
  const [error, setError] = useState('');

  const from = weekStart(offset);
  const to = new Date(from);
  to.setDate(to.getDate() + 6);

  useEffect(() => {
    setEntries(null);
    listTeamEntries(dayStr(from), dayStr(to))
      .then(setEntries)
      .catch(e => setError(e.message || 'Could not load team entries'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  const byUser = useMemo(() => {
    const m = new Map();
    (entries ?? []).forEach(e => {
      const key = e.uid;
      if (!m.has(key)) m.set(key, { name: e.userName || e.userEmail || 'Unknown', entries: [] });
      m.get(key).entries.push(e);
    });
    return [...m.values()].sort(
      (a, b) =>
        b.entries.reduce((s, e) => s + e.minutes, 0) - a.entries.reduce((s, e) => s + e.minutes, 0)
    );
  }, [entries]);

  return (
    <>
      <div className="d-flex align-items-center gap-2 mb-3">
        <button className="btn btn-sm btn-outline-secondary" onClick={() => setOffset(o => o - 1)}>
          <i className="bi bi-chevron-left" />
        </button>
        <strong>
          {dayStr(from)} → {dayStr(to)}
        </strong>
        <button
          className="btn btn-sm btn-outline-secondary"
          disabled={offset >= 0}
          onClick={() => setOffset(o => o + 1)}
        >
          <i className="bi bi-chevron-right" />
        </button>
        {offset !== 0 && (
          <button className="btn btn-sm btn-outline-primary" onClick={() => setOffset(0)}>
            This week
          </button>
        )}
        <span className="text-muted small ms-auto">
          Professional hours only — personal time stays private to each person.
        </span>
      </div>

      {error && <div className="alert alert-warning py-2">{error}</div>}
      {!entries && !error && <div className="spinner-border text-primary" />}
      {entries && byUser.length === 0 && (
        <p className="text-muted">No professional time logged this week.</p>
      )}

      {byUser.map(u => (
        <details key={u.name} className="tsh-card tsh-user mb-2">
          <summary>
            <strong>{u.name}</strong>
            <span className="tsh-user-total">
              {fmtMinutes(u.entries.reduce((s, e) => s + e.minutes, 0))}
            </span>
          </summary>
          {u.entries.map(e => (
            <div key={e.id} className="tsh-entry">
              <span className="tsh-entry-date">{e.date.slice(5)}</span>
              <span className="tsh-entry-activity">{e.activity}</span>
              <span className="tsh-entry-mins">{fmtMinutes(e.minutes)}</span>
            </div>
          ))}
        </details>
      ))}
    </>
  );
}
