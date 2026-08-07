import React, { useEffect, useMemo, useState } from 'react';
import { powerHistory } from 'src/services/ambulance/ambulance';
import { fmtTime, Chart } from './shared';

const WINDOWS = [
  { key: '1h', label: '1 h', ms: 3600e3 },
  { key: '24h', label: '24 h', ms: 24 * 3600e3 },
  { key: '7d', label: '7 d', ms: 7 * 24 * 3600e3 },
];

// Series colors from the app palette — validated pair (CVD ΔE 41).
const BLUE = '#3b82f6';
const CYAN = '#06b6d4';
const INDIGO = '#6366f1';

/** Thin a row set to at most `max` points (keeps first/last). */
const thin = (rows, max = 600) => {
  if (rows.length <= max) return rows;
  const step = Math.ceil(rows.length / max);
  return rows.filter((_, i) => i % step === 0 || i === rows.length - 1);
};

/** Contiguous on-battery time ranges for background shading. */
function batteryBands(rows) {
  const bands = [];
  let start = null;
  rows.forEach((r, i) => {
    if (r.on_battery && start == null) start = r.time;
    if ((!r.on_battery || i === rows.length - 1) && start != null) {
      bands.push({ start, end: r.time });
      start = null;
    }
  });
  return bands;
}

export default function PowerCharts() {
  const [win, setWin] = useState('24h');
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let dead = false;
    setRows(null);
    const w = WINDOWS.find(x => x.key === win);
    powerHistory(new Date(Date.now() - w.ms))
      .then(r => !dead && setRows(thin(r)))
      .catch(e => !dead && setError(e.message || 'Could not load power history'));
    return () => {
      dead = true;
    };
  }, [win]);

  const bands = useMemo(() => (rows ? batteryBands(rows) : []), [rows]);
  const latest = rows?.[rows.length - 1];

  return (
    <>
      <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
        {WINDOWS.map(w => (
          <button
            key={w.key}
            className={`amb-win ${win === w.key ? 'active' : ''}`}
            onClick={() => setWin(w.key)}
          >
            {w.label}
          </button>
        ))}
        {latest && (
          <span className="text-muted small ms-auto">
            {rows.length} samples · latest {fmtTime(latest.time)} · shaded = on battery
          </span>
        )}
      </div>

      {error && <div className="alert alert-warning py-2">{error}</div>}
      {!rows && !error && <div className="spinner-border text-primary" />}

      {rows && rows.length === 0 && (
        <p className="text-muted">No power samples in this window (retention is 30 days).</p>
      )}

      {rows && rows.length > 0 && (
        <>
          <Chart
            title="Battery %"
            unit="%"
            yDomain={[0, 100]}
            bands={bands}
            series={[
              {
                name: 'battery',
                color: BLUE,
                points: rows.map(r => [r.time, Number(r.battery_percentage)]),
              },
            ]}
          />
          <Chart
            title="Power (watts) — input vs output"
            unit=" W"
            bands={bands}
            series={[
              {
                name: 'input',
                color: BLUE,
                points: rows.map(r => [r.time, Number(r.input_power_w)]),
              },
              {
                name: 'output',
                color: CYAN,
                points: rows.map(r => [r.time, Number(r.output_power_w)]),
              },
            ]}
          />
          <Chart
            title="CPU temperature (°C)"
            unit=" °C"
            bands={bands}
            threshold={{ v: 75, label: '75° throttle risk' }}
            series={[
              { name: 'cpu', color: INDIGO, points: rows.map(r => [r.time, Number(r.cpu_temp_c)]) },
            ]}
          />
        </>
      )}
    </>
  );
}
