import React, { useCallback, useEffect, useState } from 'react';
import {
  listViolations,
  countViolations,
  sequenceFrameUrls,
} from 'src/services/ambulance/ambulance';
import { SafeImg, fmt, Lightbox, useLightbox } from './shared';

/**
 * The primary screen: vehicles that blocked the ambulance 10+ seconds.
 * Server-side date-range filter + client-side plate substring search.
 *
 * A violation with a saved burst (sequenceFolder/frameCount — the device's
 * frame-by-frame proof of the 10-second streak) opens straight into that
 * frame sequence, since that IS the evidence a demo shows. Older violations
 * without a burst fall back to the plain cover-photo viewer, stepping across
 * the grid instead of within one event.
 */
export default function ViolationsView() {
  const [rows, setRows] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [total, setTotal] = useState(null);
  const [fromStr, setFromStr] = useState('');
  const [toStr, setToStr] = useState('');
  const [plateQ, setPlateQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const viewer = useLightbox();
  const burstViewer = useLightbox();
  const [burstItems, setBurstItems] = useState([]);

  const openViolation = (v, i) => {
    const frames = sequenceFrameUrls(v);
    if (frames.length > 0) {
      // Lightbox already shows "n / N" in its header — no per-frame label needed
      setBurstItems(frames.map(url => ({ url, plate: v.plate, time: v.time })));
      burstViewer.open(0);
    } else {
      viewer.open(i);
    }
  };

  const load = useCallback(
    async (reset = true, after = null) => {
      setLoading(true);
      setError('');
      try {
        const from = fromStr ? new Date(`${fromStr}T00:00:00`) : null;
        const to = toStr ? new Date(`${toStr}T23:59:59.999`) : null;
        const r = await listViolations({ from, to, cursor: after });
        setRows(prev => (reset ? r.rows : [...prev, ...r.rows]));
        setCursor(r.cursor);
      } catch (e) {
        setError(e.message || 'Could not load violations');
      } finally {
        setLoading(false);
      }
    },
    [fromStr, toStr]
  );

  useEffect(() => {
    load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    countViolations()
      .then(setTotal)
      .catch(() => {});
  }, []);

  const q = plateQ.trim().toUpperCase();
  const shown = q ? rows.filter(v => (v.plate || '').includes(q)) : rows;

  return (
    <>
      <div className="amb-filters d-flex align-items-end gap-2 flex-wrap mb-3">
        <div>
          <label className="form-label small mb-1">From</label>
          <input
            type="date"
            className="form-control form-control-sm"
            value={fromStr}
            onChange={e => setFromStr(e.target.value)}
          />
        </div>
        <div>
          <label className="form-label small mb-1">To</label>
          <input
            type="date"
            className="form-control form-control-sm"
            value={toStr}
            onChange={e => setToStr(e.target.value)}
          />
        </div>
        <button className="btn btn-sm btn-primary" disabled={loading} onClick={() => load(true)}>
          Apply
        </button>
        <div className="flex-grow-1" style={{ maxWidth: 260 }}>
          <label className="form-label small mb-1">Plate search</label>
          <input
            className="form-control form-control-sm"
            placeholder="e.g. 4156"
            value={plateQ}
            onChange={e => setPlateQ(e.target.value)}
          />
        </div>
        {total != null && (
          <span className="text-muted small ms-auto">{total} violations all-time</span>
        )}
      </div>

      {error && <div className="alert alert-warning py-2">{error}</div>}
      {loading && rows.length === 0 && <div className="spinner-border text-primary" />}

      {!loading && shown.length === 0 && (
        <p className="text-muted">
          No violations{q ? ` matching “${q}”` : ''} in this range. That is good news for
          ambulances.
        </p>
      )}

      <div className="row g-3">
        {shown.map((v, i) => (
          <div className="col-6 col-md-4 col-xl-3" key={v.id}>
            <button
              className="amb-photo amb-violation w-100"
              onClick={() => openViolation(v, i)}
              title={
                v.frameCount
                  ? `View the ${v.frameCount}-frame sequence that proves this violation`
                  : undefined
              }
            >
              <SafeImg src={v.photoUrl} alt={v.plate} className="amb-vio-img" />
              {v.frameCount > 0 && (
                <span className="amb-burst-badge">
                  <i className="bi bi-collection-play-fill me-1" />
                  {v.frameCount}
                </span>
              )}
              <div className="amb-photo-meta">
                <span className="amb-plate">{v.plate || '—'}</span>
                <span className="amb-photo-time">
                  {fmt(v.time)}
                  {v.confidence != null && (
                    <span className="amb-conf"> · {Math.round(v.confidence * 100)}%</span>
                  )}
                </span>
              </div>
            </button>
          </div>
        ))}
      </div>

      {cursor && (
        <div className="text-center mt-3">
          <button
            className="btn btn-outline-primary"
            disabled={loading}
            onClick={() => load(false, cursor)}
          >
            {loading ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}

      {viewer.isOpen && (
        <Lightbox
          items={shown}
          index={viewer.index}
          onClose={viewer.close}
          onIndex={viewer.setIndex}
        />
      )}
      {burstViewer.isOpen && (
        <Lightbox
          items={burstItems}
          index={burstViewer.index}
          onClose={burstViewer.close}
          onIndex={burstViewer.setIndex}
        />
      )}
    </>
  );
}
