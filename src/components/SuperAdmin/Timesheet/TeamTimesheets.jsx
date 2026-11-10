import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  listStatuses,
  listTimesheetPeople,
  workingDays,
  dayStr,
  addDays,
} from 'src/services/timesheet/teamStatus';
import './Timesheet.css';

const RANGES = [
  ['Today', 0],
  ['Last 7 days', 6],
  ['Last 30 days', 29],
];

const fmtDay = d => {
  const [y, m, dd] = d.split('-').map(Number);
  return new Date(y, m - 1, dd).toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
};

const csvCell = v => `"${String(v ?? '').replace(/"/g, '""')}"`;

/**
 * Team Timesheets — the daily statuses everyone has filed, with the tickets
 * they worked on. For admins and managers (holders of the Team Timesheets
 * card); firestore.rules keep everyone else to their own.
 */
export default function TeamTimesheets() {
  const today = dayStr();
  const [from, setFrom] = useState(addDays(today, -6));
  const [to, setTo] = useState(today);
  const [person, setPerson] = useState('');
  const [search, setSearch] = useState('');
  const [rows, setRows] = useState(null);
  const [people, setPeople] = useState([]);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!from || !to || from > to) return;
    setRows(null);
    setError('');
    try {
      setRows(await listStatuses(from, to));
    } catch (err) {
      setError(
        err?.code === 'permission-denied'
          ? 'You need the Team Timesheets card to see the team’s timesheets.'
          : err?.message || 'Could not load timesheets.'
      );
      setRows([]);
    }
  }, [from, to]);

  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    listTimesheetPeople()
      .then(setPeople)
      .catch(() => setPeople([]));
  }, []);

  // Everyone who filed in range, plus everyone expected to.
  const everyone = useMemo(() => {
    const map = new Map(people.map(p => [p.uid, { ...p, expected: true }]));
    (rows || []).forEach(r => {
      if (r.uid && !map.has(r.uid)) map.set(r.uid, { uid: r.uid, name: r.name || 'Unknown' });
    });
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [people, rows]);

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (rows || []).filter(
      r =>
        (!person || r.uid === person) &&
        (!q ||
          r.description.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          r.subsidiary.toLowerCase().includes(q) ||
          r.tickets.some(t => `${t.key} ${t.title}`.toLowerCase().includes(q)))
    );
  }, [rows, person, search]);

  const days = useMemo(() => (from <= to ? workingDays(from, to) : []), [from, to]);

  const summary = useMemo(
    () =>
      everyone
        .filter(p => !person || p.uid === person)
        .map(p => {
          const mine = (rows || []).filter(r => r.uid === p.uid);
          const filed = new Set(mine.map(r => r.date));
          const tickets = new Set(mine.flatMap(r => r.tickets.map(t => t.key)));
          return {
            ...p,
            worked: new Set(mine.filter(r => !r.leave).map(r => r.date)).size,
            leave: new Set(mine.filter(r => r.leave).map(r => r.date)).size,
            tickets: tickets.size,
            last: mine[0]?.date || '',
            missing: p.expected ? days.filter(d => !filed.has(d)) : [],
          };
        }),
    [everyone, rows, days, person]
  );

  const missingToday =
    to === today && days.includes(today)
      ? summary.filter(p => p.expected && p.missing.includes(today))
      : [];

  const downloadCsv = () => {
    const lines = [
      ['Date', 'Employee', 'Subsidiary', 'Type', 'Tickets', 'Description'].map(csvCell).join(','),
      ...shown.map(r =>
        [
          r.date,
          r.name,
          r.subsidiary,
          r.leave ? 'Leave' : 'Work',
          r.tickets.map(t => `${t.key} ${t.title}`).join('; '),
          r.description,
        ]
          .map(csvCell)
          .join(',')
      ),
    ];
    const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `timesheets_${from}_to_${to}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tsh-wrap container-fluid px-3 px-md-5">
      <div className="py-3">
        <h1 className="tsh-title h3">Team Timesheets</h1>
        <p className="tsh-subtitle">
          Daily statuses your team has submitted, with the tickets they worked on.
        </p>
      </div>

      <div className="tt-filters">
        <div className="btn-group btn-group-sm" role="group" aria-label="Quick range">
          {RANGES.map(([label, back]) => (
            <button
              key={label}
              type="button"
              className={`btn ${from === addDays(today, -back) && to === today ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => {
                setFrom(addDays(today, -back));
                setTo(today);
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="tt-field">
          From
          <input
            type="date"
            className="form-control form-control-sm"
            value={from}
            max={to}
            onChange={e => setFrom(e.target.value)}
          />
        </label>
        <label className="tt-field">
          To
          <input
            type="date"
            className="form-control form-control-sm"
            value={to}
            min={from}
            max={today}
            onChange={e => setTo(e.target.value)}
          />
        </label>
        <select
          className="form-select form-select-sm"
          style={{ maxWidth: 220 }}
          value={person}
          onChange={e => setPerson(e.target.value)}
          aria-label="Employee"
        >
          <option value="">All employees</option>
          {everyone.map(p => (
            <option key={p.uid} value={p.uid}>
              {p.name}
            </option>
          ))}
        </select>
        <input
          className="form-control form-control-sm"
          style={{ maxWidth: 240 }}
          placeholder="Search work, tickets…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Search"
        />
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary ms-auto"
          onClick={downloadCsv}
          disabled={!shown.length}
        >
          <i className="bi bi-download me-1" />
          CSV
        </button>
      </div>

      {error && <div className="alert alert-warning py-2">{error}</div>}

      {missingToday.length > 0 && (
        <div className="alert alert-warning py-2 small" role="status">
          <i className="bi bi-exclamation-triangle me-1" />
          <strong>Not submitted today:</strong> {missingToday.map(p => p.name).join(', ')}
        </div>
      )}

      {rows === null ? (
        <div className="text-muted py-4">Loading timesheets…</div>
      ) : (
        <>
          <h2 className="h6 mt-3">Summary</h2>
          <div className="table-responsive">
            <table className="table table-sm align-middle tt-summary">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th className="text-end">Days worked</th>
                  <th className="text-end">Leave</th>
                  <th className="text-end">Tickets</th>
                  <th>Last submitted</th>
                  <th>Missing (Mon–Fri)</th>
                </tr>
              </thead>
              <tbody>
                {summary.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-muted">
                      Nobody has submitted a timesheet in this range.
                    </td>
                  </tr>
                )}
                {summary.map(p => (
                  <tr key={p.uid}>
                    <td>
                      <button
                        type="button"
                        className="btn btn-link btn-sm p-0"
                        onClick={() => setPerson(person === p.uid ? '' : p.uid)}
                      >
                        {p.name}
                      </button>
                    </td>
                    <td className="text-end">{p.worked}</td>
                    <td className="text-end">{p.leave}</td>
                    <td className="text-end">{p.tickets}</td>
                    <td>{p.last ? fmtDay(p.last) : <span className="text-muted">—</span>}</td>
                    <td>
                      {!p.expected ? (
                        <span className="text-muted small">not on Timesheet</span>
                      ) : p.missing.length === 0 ? (
                        <span className="text-success small">none</span>
                      ) : (
                        <span
                          className="text-danger small"
                          title={p.missing.map(fmtDay).join(', ')}
                        >
                          {p.missing.length} day{p.missing.length === 1 ? '' : 's'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="h6 mt-4">
            Entries <span className="text-muted fw-normal">({shown.length})</span>
          </h2>
          {shown.length === 0 ? (
            <p className="text-muted">No timesheets match.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-sm tt-entries">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Employee</th>
                    <th>Subsidiary</th>
                    <th>Tickets</th>
                    <th>Work done</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map(r => (
                    <tr key={r.id}>
                      <td className="text-nowrap">{fmtDay(r.date)}</td>
                      <td className="text-nowrap">{r.name}</td>
                      <td>{r.subsidiary}</td>
                      <td>
                        {r.leave ? (
                          <span className="badge bg-secondary">Leave</span>
                        ) : r.tickets.length ? (
                          <div className="tt-tickets">
                            {r.tickets.map(t => (
                              <span key={t.id || t.key} className="tt-ticket" title={t.title}>
                                <strong>{t.key}</strong> {t.title}
                              </span>
                            ))}
                          </div>
                        ) : /^https?:\/\//i.test(r.ticketLink) ? (
                          <a href={r.ticketLink} target="_blank" rel="noopener noreferrer">
                            link
                          </a>
                        ) : (
                          <span className="text-muted small">—</span>
                        )}
                      </td>
                      <td className="tt-desc">{r.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
