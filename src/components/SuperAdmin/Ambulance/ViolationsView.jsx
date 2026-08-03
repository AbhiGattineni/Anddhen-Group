import React, { useCallback, useEffect, useState } from 'react';
import { listViolations, countViolations } from 'src/services/ambulance/ambulance';
import { SafeImg, fmt } from './shared';

/**
 * The primary screen: vehicles that blocked the ambulance 10+ seconds.
 * Server-side date-range filter + client-side plate substring search.
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
  const [zoom, setZoom] = useState(null); // violation shown full-size

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
        {shown.map(v => (
          <div className="col-6 col-md-4 col-xl-3" key={v.id}>
            <button className="amb-photo amb-violation w-100" onClick={() => setZoom(v)}>
              <SafeImg src={v.photoUrl} alt={v.plate} className="amb-vio-img" />
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

      {zoom && (
        <div className="amb-lightbox" onClick={() => setZoom(null)} role="presentation">
          <div className="amb-lightbox-body">
            <img src={zoom.photoUrl} alt={zoom.plate} />
            <div className="amb-lightbox-meta">
              <span className="amb-plate">{zoom.plate}</span> · {fmt(zoom.time)}
              {zoom.confidence != null && ` · confidence ${Math.round(zoom.confidence * 100)}%`}
              <a className="ms-2" href={zoom.photoUrl} target="_blank" rel="noreferrer">
                open original
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
