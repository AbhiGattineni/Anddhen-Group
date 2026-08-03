import React, { useCallback, useEffect, useState } from 'react';
import { latestPower, OFFLINE_AFTER_MIN } from 'src/services/ambulance/ambulance';
import ViolationsView from './ViolationsView';
import PowerCharts from './PowerCharts';
import TimelineView from './TimelineView';
import DetectionsView from './DetectionsView';
import FolderBrowser from './FolderBrowser';
import { ago, fmt } from './shared';
import './AmbulanceTracking.css';

const STATUS_REFRESH_SEC = 30;

const TABS = [
  ['violations', 'Violations', 'bi-exclamation-octagon'],
  ['power', 'Power & Health', 'bi-battery-charging'],
  ['timeline', 'Timeline', 'bi-clock-history'],
  ['detections', 'Detections', 'bi-camera'],
  ['storage', 'Storage', 'bi-folder2-open'],
];

/** Alert badges per the device spec — icon + label, never color alone. */
function buildAlerts(p) {
  if (!p) return [];
  const a = [];
  const add = (level, icon, label) => a.push({ level, icon, label });
  if (p.monitor_running === false) add('serious', 'bi-camera-video-off', 'camera pipeline STOPPED');
  if (p.input_insufficient)
    add('serious', 'bi-plug', 'input insufficient — plugged in but draining');
  if (Number(p.battery_percentage) < 20)
    add('serious', 'bi-battery', `battery low ${p.battery_percentage}%`);
  if (Number(p.shutdown_request) !== 0) add('serious', 'bi-power', 'shutdown pending');
  if (p.on_battery) add('warn', 'bi-battery-half', 'running on battery');
  if (p.upload_backlog)
    add('warn', 'bi-cloud-upload', `upload backlog (${p.uploads_pending} pending)`);
  if (Number(p.cpu_temp_c) > 75) add('warn', 'bi-thermometer-high', `CPU hot ${p.cpu_temp_c}°C`);
  if (p.last_upload_error) add('warn', 'bi-wifi-off', 'last upload failed');
  return a;
}

const fmtUptime = s => {
  const sec = Number(s) || 0;
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return h > 0 ? `${h} h ${m} min` : `${m} min`;
};

export default function AmbulanceTracking() {
  const [power, setPower] = useState(null);
  const [tab, setTab] = useState('violations');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatedAt, setUpdatedAt] = useState(null);

  const refresh = useCallback(async () => {
    try {
      setPower(await latestPower());
      setUpdatedAt(new Date());
      setError('');
    } catch (e) {
      setError('Could not load device status. ' + (e.message || ''));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, STATUS_REFRESH_SEC * 1000);
    return () => clearInterval(t);
  }, [refresh]);

  const online = power && Date.now() - power.time.getTime() < OFFLINE_AFTER_MIN * 60 * 1000;
  const alerts = online ? buildAlerts(power) : [];
  const battery = power ? Number(power.battery_percentage) : null;

  return (
    <div className="amb-wrap container-fluid px-3 px-md-5">
      <div className="py-3 d-flex justify-content-between align-items-end flex-wrap gap-2">
        <div>
          <h1 className="amb-title h3">Ambulance Tracking</h1>
          <p className="amb-subtitle">
            Traffic-violation IoT device — read-only monitor of what the Pi reports.
          </p>
        </div>
        <div className="text-end">
          <button className="btn btn-sm btn-outline-primary" onClick={refresh}>
            <i className="bi bi-arrow-clockwise me-1" />
            Refresh
          </button>
          <div className="text-muted small mt-1">
            {updatedAt ? `status ${ago(updatedAt)} · refreshes every ${STATUS_REFRESH_SEC}s` : ''}
          </div>
        </div>
      </div>

      {error && <div className="alert alert-warning">{error}</div>}
      {loading && <div className="spinner-border text-primary" />}

      {/* Live status header — newest power_stats sample */}
      {power && (
        <>
          <div className="row g-3 mb-2">
            <div className="col-6 col-lg-3">
              <div className={`amb-tile ${online ? 'amb-online' : 'amb-offline'}`}>
                <div className="amb-tile-label">
                  <span className={`amb-dot ${online ? 'on' : 'off'}`} />
                  {power.device || 'device'}
                </div>
                <div className="amb-tile-value">{online ? 'ONLINE' : 'OFFLINE'}</div>
                <div className="amb-tile-sub">
                  {online
                    ? `up ${fmtUptime(power.uptime_s)} · sample ${ago(power.time)}`
                    : `last seen ${ago(power.time)} (stale > ${OFFLINE_AFTER_MIN} min)`}
                </div>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="amb-tile">
                <div className="amb-tile-label">
                  <i
                    className={`bi me-1 ${power.on_battery ? 'bi-battery-half' : 'bi-plug-fill'}`}
                  />
                  Power
                </div>
                <div className="amb-tile-value">
                  {battery != null ? `${battery}%` : '—'}
                  {power.is_charging && <i className="bi bi-lightning-charge-fill amb-charge" />}
                </div>
                <div className="amb-tile-sub">
                  {power.power_source} · in {Number(power.input_power_w || 0).toFixed(1)} W · out{' '}
                  {Number(power.output_power_w || 0).toFixed(1)} W
                </div>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="amb-tile">
                <div className="amb-tile-label">
                  <i className="bi bi-cpu me-1" />
                  CPU
                </div>
                <div className="amb-tile-value">{Number(power.cpu_temp_c).toFixed(0)}°C</div>
                <div className="amb-tile-sub">
                  load {power.load_1min} · mem {Math.round(power.memory_used_pct)}% · disk{' '}
                  {power.disk_free_gb} GB free
                </div>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="amb-tile">
                <div className="amb-tile-label">
                  <i className="bi bi-cloud-upload me-1" />
                  Uploads
                </div>
                <div className="amb-tile-value">
                  {Number(power.uploads_pending) || 0}
                  <span className="amb-muted"> pending</span>
                </div>
                <div className="amb-tile-sub">
                  {power.uploads_ok} ok · {power.uploads_failed} failed · last{' '}
                  {power.last_upload_at ? ago(new Date(power.last_upload_at)) : '—'}
                </div>
              </div>
            </div>
          </div>

          {(alerts.length > 0 || !online) && (
            <div className="d-flex gap-2 flex-wrap mb-3">
              {!online && (
                <span className="amb-alert amb-alert-serious">
                  <i className="bi bi-wifi-off me-1" />
                  no fresh samples — device off or offline (last {fmt(power.time)})
                </span>
              )}
              {alerts.map((a, i) => (
                <span key={i} className={`amb-alert amb-alert-${a.level}`}>
                  <i className={`bi ${a.icon} me-1`} />
                  {a.label}
                </span>
              ))}
            </div>
          )}
        </>
      )}

      <ul className="nav gap-2 mb-3 mt-1">
        {TABS.map(([key, label, icon]) => (
          <li className="nav-item" key={key}>
            <button
              className={`amb-tab ${tab === key ? 'active' : ''}`}
              onClick={() => setTab(key)}
            >
              <i className={`bi ${icon} me-1`} />
              {label}
            </button>
          </li>
        ))}
        <li className="nav-item ms-auto">
          <a
            className="amb-lan-link"
            href="http://raspberrypi.local:8000/"
            target="_blank"
            rel="noreferrer"
            title="MJPEG live view — only reachable on the device's own network"
          >
            <i className="bi bi-broadcast-pin me-1" />
            LAN live view
          </a>
        </li>
      </ul>

      {tab === 'violations' && <ViolationsView />}
      {tab === 'power' && <PowerCharts />}
      {tab === 'timeline' && <TimelineView />}
      {tab === 'detections' && <DetectionsView />}
      {tab === 'storage' && <FolderBrowser />}
    </div>
  );
}
