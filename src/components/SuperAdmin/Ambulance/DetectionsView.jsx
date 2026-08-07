import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { listDetections } from 'src/services/ambulance/ambulance';
import { SafeImg, fmt, sharpnessOf, SHARP_AT, SOFT_AT, Lightbox, useLightbox } from './shared';

/** Last-24h detections (photos expire after ~1 day) + focus assist for OCR tuning. */
export default function DetectionsView() {
  const [rows, setRows] = useState(null);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const viewer = useLightbox();

  const load = (after = null) => {
    setLoading(true);
    listDetections({ cursor: after })
      .then(r => {
        setRows(prev => (after && prev ? [...prev, ...r.rows] : r.rows));
        setCursor(r.cursor);
      })
      .catch(e => setError(e.message || 'Could not load detections'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                ({rows.length}
                {cursor ? '+' : ''} plates read · photos older than a day expire)
              </span>
            </div>
            {rows.length === 0 ? (
              <p className="text-muted mb-0">No detections in the last 24 hours.</p>
            ) : (
              <div className="row g-2">
                {rows.map((d, i) => (
                  <div className="col-6 col-md-3 col-xl-2" key={d.id}>
                    <button
                      className="amb-photo w-100"
                      onClick={() => viewer.open(i)}
                      title={d.photo}
                      type="button"
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
                    </button>
                  </div>
                ))}
              </div>
            )}
            {cursor && (
              <div className="text-center mt-3">
                <button
                  className="btn btn-sm btn-outline-primary"
                  disabled={loading}
                  onClick={() => load(cursor)}
                >
                  {loading ? 'Loading…' : 'Load more'}
                </button>
              </div>
            )}
          </div>
          {viewer.isOpen && (
            <Lightbox
              items={rows}
              index={viewer.index}
              onClose={viewer.close}
              onIndex={viewer.setIndex}
            />
          )}
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
