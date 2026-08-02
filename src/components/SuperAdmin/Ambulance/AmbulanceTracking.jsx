import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  listRecentDetections,
  countAllDetections,
  listDevices,
  computeStats,
  listStorage,
  ONLINE_WINDOW_MIN,
} from 'src/services/ambulance/ambulance';
import './AmbulanceTracking.css';

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
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const lap = 4 * g[i] - g[i - 1] - g[i + 1] - g[i - w] - g[i + w];
      sum += lap;
      sum2 += lap * lap;
      n++;
    }
  }
  const mean = sum / n;
  return sum2 / n - mean * mean;
}

const SHARP_AT = 150; // heuristic variance-of-Laplacian thresholds
const SOFT_AT = 50;

const REFRESH_SEC = 60;

const fmt = v => {
  const d = v?.toDate ? v.toDate() : v ? new Date(v) : null;
  return d ? d.toLocaleString() : '—';
};

const ago = d => {
  if (!d) return 'never';
  const min = Math.floor((Date.now() - d.getTime()) / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min} min ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} h ${min % 60} min ago`;
  return `${Math.floor(h / 24)} d ago`;
};

export default function AmbulanceTracking() {
  const [detections, setDetections] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatedAt, setUpdatedAt] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const [recent, total, devices] = await Promise.all([
        listRecentDetections(),
        countAllDetections(),
        listDevices(),
      ]);
      setDetections(recent);
      setStats(computeStats(recent, devices, total));
      setUpdatedAt(new Date());
      setError('');
    } catch (e) {
      setError(
        'Could not load ambulance data from Firebase. ' + (e.message || 'Check the connection.')
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, REFRESH_SEC * 1000);
    return () => clearInterval(t);
  }, [refresh]);

  const maxDay = stats ? Math.max(1, ...stats.perDay.map(d => d.count)) : 1;

  return (
    <div className="amb-wrap container-fluid px-3 px-md-5">
      <div className="py-3 d-flex justify-content-between align-items-end flex-wrap gap-2">
        <div>
          <h1 className="amb-title h3">Ambulance Tracking</h1>
          <p className="amb-subtitle">
            Plate photos uploaded by the Pi monitor — device health and detection stats.
          </p>
        </div>
        <div className="text-end">
          <button className="btn btn-sm btn-outline-primary" onClick={refresh}>
            <i className="bi bi-arrow-clockwise me-1" />
            Refresh
          </button>
          <div className="text-muted small mt-1">
            {updatedAt ? `updated ${ago(updatedAt)} · auto-refreshes every ${REFRESH_SEC}s` : ''}
          </div>
        </div>
      </div>

      {error && <div className="alert alert-warning">{error}</div>}
      {loading && <div className="spinner-border text-primary" />}

      {stats && (
        <>
          {/* Stat tiles */}
          <div className="row g-3 mb-3">
            <div className="col-6 col-lg-3">
              <div className={`amb-tile ${stats.online ? 'amb-online' : 'amb-offline'}`}>
                <div className="amb-tile-label">
                  <span className={`amb-dot ${stats.online ? 'on' : 'off'}`} />
                  Device {stats.device?.deviceId || 'pi-01'}
                </div>
                <div className="amb-tile-value">{stats.online ? 'ACTIVE' : 'IDLE'}</div>
                <div className="amb-tile-sub">
                  last activity {ago(stats.lastActivity)}
                  {!stats.online && stats.lastActivity && ` (>${ONLINE_WINDOW_MIN} min)`}
                  {stats.device?.ip && ` · ${stats.device.ip}`}
                </div>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="amb-tile">
                <div className="amb-tile-label">Last detection</div>
                <div className="amb-tile-value amb-plate">{stats.lastDetection?.plate || '—'}</div>
                <div className="amb-tile-sub">{fmt(stats.lastDetection?.capturedAt)}</div>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="amb-tile">
                <div className="amb-tile-label">Today / last 7 days</div>
                <div className="amb-tile-value">
                  {stats.today} <span className="amb-muted">/ {stats.week}</span>
                </div>
                <div className="amb-tile-sub">photos captured</div>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="amb-tile">
                <div className="amb-tile-label">Total uploaded</div>
                <div className="amb-tile-value">{stats.total}</div>
                <div className="amb-tile-sub">
                  {stats.device?.pendingUploads > 0
                    ? `${stats.device.pendingUploads} waiting on device`
                    : 'all photos synced'}
                </div>
              </div>
            </div>
          </div>

          {/* Focus assist — lens turning suggestions from photo sharpness */}
          <FocusAssist detections={detections} />

          {/* 7-day activity strip */}
          <div className="amb-card mb-4">
            <div className="amb-card-head">Last 7 days</div>
            <div className="amb-bars">
              {stats.perDay.map((d, i) => (
                <div className="amb-bar-col" key={i} title={`${d.label}: ${d.count}`}>
                  <div className="amb-bar-count">{d.count || ''}</div>
                  <div
                    className="amb-bar"
                    style={{ height: `${Math.max(4, (d.count / maxDay) * 100)}%` }}
                  />
                  <div className="amb-bar-label">{d.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Storage folder browser (challans/, detections/, heartbeats/, …) */}
          <div className="mb-4">
            <FolderBrowser />
          </div>

          {/* Recent photos */}
          <div className="amb-card">
            <div className="amb-card-head">
              Recent photos{' '}
              <span className="text-muted">(latest {Math.min(12, detections.length)})</span>
            </div>
            {detections.length === 0 ? (
              <p className="text-muted mb-0">
                No photos yet — once the Pi uploader is running, every detected plate lands here.
              </p>
            ) : (
              <div className="row g-3">
                {detections.slice(0, 12).map(d => (
                  <div className="col-6 col-md-4 col-xl-3" key={d.id}>
                    <a
                      className="amb-photo"
                      href={d.photoUrl}
                      target="_blank"
                      rel="noreferrer"
                      title={d.fileName || d.plate}
                    >
                      <img src={d.photoUrl} alt={d.plate} loading="lazy" />
                      <div className="amb-photo-meta">
                        <span className="amb-plate">{d.plate}</span>
                        <span className="amb-photo-time">
                          {fmt(d.capturedAt)}
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
    </div>
  );
}

/* ---------------- focus assist ---------------- */

function FocusAssist({ detections }) {
  const cache = useRef({}); // detection id -> sharpness variance
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
            cache.current[d.id] = null; // unreadable image — skip
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
    <div className={`amb-card amb-focus amb-focus-${status} mb-4`}>
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
            <span className="amb-turn" title="Clockwise">
              ↻ clockwise
            </span>
            <span className="amb-turn" title="Anti-clockwise">
              ↺ anti-clockwise
            </span>
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

/* ---------------- storage folder browser ---------------- */

function FolderBrowser() {
  const [prefix, setPrefix] = useState('');
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (pfx, pageToken = null) => {
    setLoading(true);
    setError('');
    try {
      const r = await listStorage(pfx, pageToken);
      setFolders(pageToken ? f => [...f, ...r.folders] : r.folders);
      setFiles(pageToken ? f => [...f, ...r.files] : r.files);
      setToken(r.nextPageToken);
    } catch (e) {
      setError(e.message || 'Could not list storage');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(prefix);
  }, [prefix, load]);

  const crumbs = prefix.split('/').filter(Boolean);

  return (
    <div className="amb-card">
      <div className="amb-card-head d-flex align-items-center gap-2 flex-wrap">
        <i className="bi bi-folder2-open text-primary" />
        <button className="amb-crumb" onClick={() => setPrefix('')}>
          storage
        </button>
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            <span className="text-muted">/</span>
            <button
              className="amb-crumb"
              onClick={() => setPrefix(crumbs.slice(0, i + 1).join('/') + '/')}
            >
              {c}
            </button>
          </React.Fragment>
        ))}
        {loading && <span className="spinner-border spinner-border-sm ms-1" />}
      </div>

      {error && <div className="alert alert-warning py-2">{error}</div>}

      {folders.length > 0 && (
        <div className="d-flex gap-2 flex-wrap mb-3">
          {folders.map(f => (
            <button key={f} className="amb-folder-chip" onClick={() => setPrefix(f)}>
              <i className="bi bi-folder-fill me-1" />
              {f.slice(prefix.length).replace(/\/$/, '')}
            </button>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="row g-2">
          {files.map(f => (
            <div className="col-6 col-md-3 col-xl-2" key={f.name}>
              <a
                className="amb-photo"
                href={f.url}
                target="_blank"
                rel="noreferrer"
                title={f.shortName}
              >
                {f.isImage ? (
                  <img src={f.url} alt={f.shortName} loading="lazy" className="amb-thumb" />
                ) : (
                  <div className="amb-file-icon">
                    <i className="bi bi-file-earmark" />
                  </div>
                )}
                <div className="amb-photo-meta">
                  <span className="amb-file-name">{f.shortName}</span>
                </div>
              </a>
            </div>
          ))}
        </div>
      )}

      {!loading && folders.length === 0 && files.length === 0 && !error && (
        <p className="text-muted mb-0">Empty folder.</p>
      )}

      {token && (
        <button
          className="btn btn-sm btn-outline-primary mt-3"
          disabled={loading}
          onClick={() => load(prefix, token)}
        >
          Load more
        </button>
      )}
    </div>
  );
}
