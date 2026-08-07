import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

export const fmt = v => {
  const d = v?.toDate ? v.toDate() : v ? new Date(v) : null;
  return d ? d.toLocaleString() : '—';
};

export const fmtTime = v => {
  const d = v?.toDate ? v.toDate() : v ? new Date(v) : null;
  return d ? d.toLocaleTimeString() : '—';
};

export const ago = d => {
  if (!d) return 'never';
  const min = Math.floor((Date.now() - d.getTime()) / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min} min ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} h ${min % 60} min ago`;
  return `${Math.floor(h / 24)} d ago`;
};

/** Grey "photo expired" placeholder — detections/heartbeats images are deleted
 *  by the device after ~1 day while their Firestore docs remain. */
export const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120">
      <rect width="100%" height="100%" fill="#e2e8f0"/>
      <text x="50%" y="46%" text-anchor="middle" font-family="sans-serif" font-size="26" fill="#94a3b8">&#128247;</text>
      <text x="50%" y="72%" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#64748b">photo expired</text>
    </svg>`
  );

/** <img> that swaps to the placeholder when the Storage object is gone. */
export function SafeImg({ src, alt, className }) {
  const [failed, setFailed] = useState(false);
  return (
    <img
      src={failed || !src ? PLACEHOLDER : src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

SafeImg.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
};

/**
 * Sharpness = variance of the Laplacian on a downscaled grayscale copy.
 * Higher is sharper; typical range 0 (flat/blurred) to 1500+ (crisp). Used
 * both by the live Focus Assist and, once per review, stored on the review
 * doc so "does clarity predict accuracy" can be answered without refetching
 * every photo (detection photos expire ~1 day after capture).
 */
export async function sharpnessOf(url) {
  const img = await new Promise((resolve, reject) => {
    const i = new Image();
    i.crossOrigin = 'anonymous';
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = url;
  });
  const w = 96;
  const h = Math.max(8, Math.round((img.height / img.width) * w) || w);
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);
  const g = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    g[i] = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
  }
  let sum = 0;
  let sum2 = 0;
  let n = 0;
  for (let yy = 1; yy < h - 1; yy++) {
    for (let xx = 1; xx < w - 1; xx++) {
      const i = yy * w + xx;
      const lap = 4 * g[i] - g[i - 1] - g[i + 1] - g[i - w] - g[i + w];
      sum += lap;
      sum2 += lap * lap;
      n++;
    }
  }
  const mean = sum / n;
  return sum2 / n - mean * mean;
}

export const SHARP_AT = 150;
export const SOFT_AT = 50;

/* ---------------- full-screen image viewer ---------------- */

/** Photo fields worth surfacing next to the image, in display order. */
const META_FIELDS = [
  ['vehicle_make', 'Make', v => v],
  ['vehicle_model', 'Model', v => v],
  ['vehicle_type', 'Type', v => v],
  ['vehicle_color', 'Colour', v => v],
  ['confidence', 'OCR confidence', v => `${Math.round(v * 100)}%`],
  ['detector_conf', 'Plate detector', v => `${Math.round(v * 100)}%`],
  ['agreement', 'Frame agreement', v => `${Math.round(v * 100)}%`],
  ['distinct_spellings', 'Spellings seen', v => v],
  ['plate_px_w', 'Plate width', v => `${Math.round(v)} px`],
  ['plate_sharpness', 'Sharpness', v => Math.round(v)],
  ['plate_brightness', 'Brightness', v => Math.round(v)],
  ['lux', 'Light', v => `${Math.round(v)} lux`],
  ['exposure_us', 'Exposure', v => `${(v / 1000).toFixed(1)} ms`],
  ['gain', 'Gain', v => `${Number(v).toFixed(1)}×`],
];

/**
 * Full-screen modal viewer. Replaces opening photos in a new browser tab so
 * closing returns you to exactly the view and scroll position you came from.
 * Esc or the backdrop closes; ← / → step through the surrounding list.
 */
export function Lightbox({ items, index, onClose, onIndex }) {
  const item = items[index];

  const go = useCallback(
    delta => {
      const next = index + delta;
      if (next >= 0 && next < items.length) onIndex(next);
    },
    [index, items.length, onIndex]
  );

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; // page must not scroll behind
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [go, onClose]);

  if (!item) return null;

  const title = item.plate || item.shortName || item.name || 'photo';
  const meta = META_FIELDS.filter(
    ([k]) => item[k] !== undefined && item[k] !== null && item[k] !== ''
  );

  return (
    <div className="amb-viewer" onClick={onClose} role="presentation">
      <div className="amb-viewer-bar" onClick={e => e.stopPropagation()} role="presentation">
        <div className="amb-viewer-title">
          <span className="amb-plate">{title}</span>
          {item.time && <span className="amb-viewer-sub">{fmt(item.time)}</span>}
        </div>
        <div className="amb-viewer-actions">
          {items.length > 1 && (
            <span className="amb-viewer-count">
              {index + 1} / {items.length}
            </span>
          )}
          {item.photoUrl || item.url ? (
            <a
              className="amb-viewer-btn"
              href={item.photoUrl || item.url}
              target="_blank"
              rel="noreferrer"
              title="Open the original file in a new tab"
              onClick={e => e.stopPropagation()}
            >
              <i className="bi bi-box-arrow-up-right" />
            </a>
          ) : null}
          <button className="amb-viewer-btn" onClick={onClose} title="Close (Esc)" type="button">
            <i className="bi bi-x-lg" />
          </button>
        </div>
      </div>

      <div className="amb-viewer-stage" onClick={onClose} role="presentation">
        {index > 0 && (
          <button
            className="amb-viewer-nav amb-viewer-prev"
            onClick={e => {
              e.stopPropagation();
              go(-1);
            }}
            title="Previous (←)"
            type="button"
          >
            <i className="bi bi-chevron-left" />
          </button>
        )}
        <img
          src={item.photoUrl || item.url}
          alt={title}
          onClick={e => e.stopPropagation()}
          role="presentation"
        />
        {index < items.length - 1 && (
          <button
            className="amb-viewer-nav amb-viewer-next"
            onClick={e => {
              e.stopPropagation();
              go(1);
            }}
            title="Next (→)"
            type="button"
          >
            <i className="bi bi-chevron-right" />
          </button>
        )}
      </div>

      {meta.length > 0 && (
        <div className="amb-viewer-meta" onClick={e => e.stopPropagation()} role="presentation">
          {meta.map(([k, label, render]) => (
            <span key={k} className="amb-viewer-chip">
              <span className="amb-viewer-chip-k">{label}</span>
              <span className="amb-viewer-chip-v">{render(item[k])}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

Lightbox.propTypes = {
  items: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onIndex: PropTypes.func.isRequired,
};

/** Wiring for a grid of photos that opens the full-screen viewer. */
export function useLightbox() {
  const [index, setIndex] = useState(null);
  return {
    index,
    open: setIndex,
    close: () => setIndex(null),
    setIndex,
    isOpen: index != null,
  };
}

/* ---------------- generic SVG time-series chart with crosshair tooltip ---------------- */

const CW = 720;
const CH = 170;
const CPAD = { l: 42, r: 12, t: 12, b: 22 };

/**
 * `series`: [{ name, color, points: [[Date, number], ...] }]. `bands`: shaded
 * background ranges [{start: Date, end: Date}]. `threshold`: {v, label} draws
 * a dashed reference line. Shared by power history and accuracy-over-time.
 */
export function Chart({ title, unit, series, bands = [], yDomain, threshold, subtitle }) {
  const wrapRef = useRef(null);
  const [hover, setHover] = useState(null);

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

  const x = t => CPAD.l + ((t - t0) / (t1 - t0 || 1)) * (CW - CPAD.l - CPAD.r);
  const y = v => CPAD.t + (1 - (v - yMin) / (yMax - yMin || 1)) * (CH - CPAD.t - CPAD.b);

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
        {subtitle && <span className="text-muted small">{subtitle}</span>}
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
        <svg viewBox={`0 0 ${CW} ${CH}`} preserveAspectRatio="none" className="amb-chart-svg">
          {bands.map((b, i) => (
            <rect
              key={i}
              x={x(Math.max(b.start.getTime(), t0))}
              y={CPAD.t}
              width={Math.max(
                1,
                x(Math.min(b.end.getTime(), t1)) - x(Math.max(b.start.getTime(), t0))
              )}
              height={CH - CPAD.t - CPAD.b}
              fill="rgba(245, 158, 11, 0.14)"
            />
          ))}
          {gridYs.map((v, i) => (
            <g key={i}>
              <line x1={CPAD.l} x2={CW - CPAD.r} y1={y(v)} y2={y(v)} className="amb-grid" />
              <text x={CPAD.l - 6} y={y(v) + 3} className="amb-tick" textAnchor="end">
                {Math.round(v)}
              </text>
            </g>
          ))}
          {threshold && (
            <g>
              <line
                x1={CPAD.l}
                x2={CW - CPAD.r}
                y1={y(threshold.v)}
                y2={y(threshold.v)}
                className="amb-threshold"
              />
              <text x={CW - CPAD.r} y={y(threshold.v) - 4} className="amb-tick" textAnchor="end">
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
                y1={CPAD.t}
                y2={CH - CPAD.b}
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
              y={CH - 6}
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
            style={{ left: `${((x(pts[hover][0].getTime()) / CW) * 100).toFixed(1)}%` }}
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
  subtitle: PropTypes.string,
};
