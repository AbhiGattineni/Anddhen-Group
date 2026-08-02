import React, { useCallback, useEffect, useState } from 'react';
import {
  listRecentDetections,
  countAllDetections,
  listDevices,
  computeStats,
  ONLINE_WINDOW_MIN,
} from 'src/services/ambulance/ambulance';
import './AmbulanceTracking.css';

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
