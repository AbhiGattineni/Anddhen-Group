import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { powerHistory } from 'src/services/ambulance/ambulance';
import { fmtTime } from './shared';

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

/* ---------- minimal SVG time-series chart with crosshair tooltip ---------- */

const W = 720;
const H = 170;
const PAD = { l: 42, r: 12, t: 12, b: 22 };

function Chart({ title, unit, series, bands, yDomain, threshold }) {
  const wrapRef = useRef(null);
  const [hover, setHover] = useState(null); // data index

  const pts = series[0].points;
  const t0 = pts[0][0].getTime();
  const t1 = pts[pts.length - 1][0].getTime() || t0 + 1;
  const values = series.flatMap(s => s.points.map(p => p[1])).filter(v => Number.isFinite(v));
  let [yMin, yMax] = yDomain || [Math.min(...values), Math.max(...values)];
  if (!yDomain) {
    const pad = (yMax - yMin || 1) * 0.12;
    yMin = Math.floor(yMin - pad);
    yMax = Math.ceil(yMax + pad);
  }
  if (threshold) yMax = Math.max(yMax, threshold.v + 5);

  const x = t => PAD.l + ((t - t0) / (t1 - t0 || 1)) * (W - PAD.l - PAD.r);
  const y = v => PAD.t + (1 - (v - yMin) / (yMax - yMin || 1)) * (H - PAD.t - PAD.b);

  const path = s =>
    s.points
      .map((p, i) => `${i ? 'L' : 'M'}${x(p[0].getTime()).toFixed(1)},${y(p[1]).toFixed(1)}`)
      .join('');

  const onMove = e => {
    const rect = wrapRef.current.getBoundingClientRect();
    const frac = (e.clientX - rect.left) / rect.width;
    const t = t0 + frac * (t1 - t0);
    let best = 0;
    let bd = Infinity;
    pts.forEach((p, i) => {
      const d = Math.abs(p[0].getTime() - t);
      if (d < bd) {
        bd = d;
        best = i;
      }
    });
    setHover(best);
  };

  const gridYs = [0.25, 0.5, 0.75].map(f => yMin + f * (yMax - yMin));
  const xLabels = [t0, (t0 + t1) / 2, t1];

  return (
    <div className="amb-card mb-3">
      <div className="d-flex align-items-center gap-3 flex-wrap">
        <div className="amb-card-head mb-0">{title}</div>
        {series.length > 1 && (
          <div className="d-flex gap-3">
            {series.map(s => (
              <span key={s.name} className="amb-legend">
                <span className="amb-legend-chip" style={{ background: s.color }} />
                {s.name}
              </span>
            ))}
          </div>
        )}
      </div>
      <div
        className="amb-chart"
        ref={wrapRef}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="amb-chart-svg">
          {bands.map((b, i) => (
            <rect
              key={i}
              x={x(Math.max(b.start.getTime(), t0))}
              y={PAD.t}
              width={Math.max(
                1,
                x(Math.min(b.end.getTime(), t1)) - x(Math.max(b.start.getTime(), t0))
              )}
              height={H - PAD.t - PAD.b}
              fill="rgba(245, 158, 11, 0.14)"
            />
          ))}
          {gridYs.map((v, i) => (
            <g key={i}>
              <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} className="amb-grid" />
              <text x={PAD.l - 6} y={y(v) + 3} className="amb-tick" textAnchor="end">
                {Math.round(v)}
              </text>
            </g>
          ))}
          {threshold && (
            <g>
              <line
                x1={PAD.l}
                x2={W - PAD.r}
                y1={y(threshold.v)}
                y2={y(threshold.v)}
                className="amb-threshold"
              />
              <text x={W - PAD.r} y={y(threshold.v) - 4} className="amb-tick" textAnchor="end">
                {threshold.label}
              </text>
            </g>
          )}
          {series.map(s => (
            <path key={s.name} d={path(s)} fill="none" stroke={s.color} strokeWidth="2" />
          ))}
          {hover != null && (
            <g>
              <line
                x1={x(pts[hover][0].getTime())}
                x2={x(pts[hover][0].getTime())}
                y1={PAD.t}
                y2={H - PAD.b}
                className="amb-crosshair"
              />
              {series.map(s => (
                <circle
                  key={s.name}
                  cx={x(s.points[hover][0].getTime())}
                  cy={y(s.points[hover][1])}
                  r="4"
                  fill={s.color}
                  stroke="#fff"
                  strokeWidth="2"
                />
              ))}
            </g>
          )}
          {xLabels.map((t, i) => (
            <text
              key={i}
              x={x(t)}
              y={H - 6}
              className="amb-tick"
              textAnchor={i === 0 ? 'start' : i === 2 ? 'end' : 'middle'}
            >
              {new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </text>
          ))}
        </svg>
        {hover != null && (
          <div
            className="amb-tooltip"
            style={{
              left: `${((x(pts[hover][0].getTime()) / W) * 100).toFixed(1)}%`,
            }}
          >
            <div className="amb-tooltip-time">{pts[hover][0].toLocaleString()}</div>
            {series.map(s => (
              <div key={s.name}>
                <span className="amb-legend-chip" style={{ background: s.color }} />
                {s.name}: <strong>{Number(s.points[hover][1]).toFixed(1)}</strong>
                {unit}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

Chart.propTypes = {
  title: PropTypes.string.isRequired,
  unit: PropTypes.string,
  series: PropTypes.array.isRequired,
  bands: PropTypes.array,
  yDomain: PropTypes.array,
  threshold: PropTypes.object,
};
