import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { listDetections } from 'src/services/ambulance/ambulance';
import { SafeImg, fmt } from './shared';

/**
 * Sharpness = variance of the Laplacian on a downscaled grayscale copy.
 * Higher is sharper; typical range 0 (flat/blurred) to 1500+ (crisp).
 */
async function sharpnessOf(url) {
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

const SHARP_AT = 150;
const SOFT_AT = 50;

/** Last-24h detections (photos expire after ~1 day) + focus assist for OCR tuning. */
export default function DetectionsView() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    listDetections(24, 120)
      .then(setRows)
      .catch(e => setError(e.message || 'Could not load detections'));
  }, []);

  return (
    <>
      {error && <div className="alert alert-warning py-2">{error}</div>}
      {!rows && !error && <div className="spinner-border text-primary" />}
      {rows && (
        <>
          <FocusAssist detections={rows} />
          <div className="amb-card">
            <div className="amb-card-head">
              Detections — last 24 h{' '}
              <span className="text-muted fw-normal">
                ({rows.length} plates read · photos older than a day expire)
              </span>
            </div>
            {rows.length === 0 ? (
              <p className="text-muted mb-0">No detections in the last 24 hours.</p>
            ) : (
              <div className="row g-2">
                {rows.map(d => (
                  <div className="col-6 col-md-3 col-xl-2" key={d.id}>
                    <a
                      className="amb-photo"
                      href={d.photoUrl}
                      target="_blank"
                      rel="noreferrer"
                      title={d.photo}
                    >
                      <SafeImg src={d.photoUrl} alt={d.plate} className="amb-thumb" />
                      <div className="amb-photo-meta">
                        <span className="amb-plate">{d.plate}</span>
                        <span className="amb-photo-time">
                          {fmt(d.time)}
                          {d.confidence != null && (
                            <span className="amb-conf"> · {Math.round(d.confidence * 100)}%</span>
                          )}
                        </span>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

/* ---------------- focus assist ---------------- */

function FocusAssist({ detections }) {
  const cache = useRef({});
  const [scores, setScores] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const sample = detections.filter(d => d.photoUrl).slice(0, 12);
      for (const d of sample) {
        if (cache.current[d.id] === undefined) {
          try {
            cache.current[d.id] = await sharpnessOf(d.photoUrl);
          } catch {
            cache.current[d.id] = null; // expired/unreadable image — skip
          }
          if (cancelled) return;
        }
      }
      const vals = sample.map(d => cache.current[d.id]).filter(v => typeof v === 'number');
      if (!cancelled) setScores(vals);
    })();
    return () => {
      cancelled = true;
    };
  }, [detections]);

  if (!scores || scores.length === 0) return null;

  const avg = a => a.reduce((s, v) => s + v, 0) / a.length;
  const recent = avg(scores.slice(0, Math.min(6, scores.length)));
  const prev = scores.length > 6 ? avg(scores.slice(6)) : null;
  const trend = prev != null ? recent - prev : null;

  const status = recent >= SHARP_AT ? 'sharp' : recent >= SOFT_AT ? 'soft' : 'blurry';
  const label = { sharp: 'Sharp', soft: 'Slightly soft', blurry: 'Blurry' }[status];

  let advice;
  if (status === 'sharp') {
    advice = 'Focus looks good — no lens adjustment needed.';
  } else if (trend != null && trend < -10) {
    advice =
      'Sharpness is DROPPING. If you just adjusted the lens, turn it back the opposite way — anti-clockwise ↺ if your last turn was clockwise, and vice versa.';
  } else {
    advice =
      'Turn the lens a SMALL step clockwise ↻ and wait for the next captures. If this score rises, keep going clockwise; if it falls, turn anti-clockwise ↺ instead.';
  }

  return (
    <div className={`amb-card amb-focus amb-focus-${status} mb-3`}>
      <div className="amb-card-head">
        Focus assist{' '}
        <span className="text-muted fw-normal">
          (sharpness of the last {Math.min(6, scores.length)} photos)
        </span>
      </div>
      <div className="d-flex align-items-center gap-4 flex-wrap">
        <div className="text-center">
          <div className="amb-focus-score">{Math.round(recent)}</div>
          <div className={`amb-focus-label amb-focus-label-${status}`}>{label}</div>
          {trend != null && (
            <div className={`small ${trend >= 0 ? 'text-success' : 'text-danger'}`}>
              {trend >= 0 ? '▲ improving' : '▼ worsening'} vs previous photos
            </div>
          )}
        </div>
        <div className="amb-focus-advice">
          <div className="d-flex gap-3 mb-2">
            <span className="amb-turn">↻ clockwise</span>
            <span className="amb-turn">↺ anti-clockwise</span>
          </div>
          {advice}
          <div className="text-muted small mt-1">
            Score guide: below {SOFT_AT} = blurry, {SOFT_AT}–{SHARP_AT} = soft, above {SHARP_AT} =
            sharp. Updates as new photos arrive.
          </div>
        </div>
      </div>
    </div>
  );
}

FocusAssist.propTypes = {
  detections: PropTypes.array.isRequired,
};
