import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  listQualitySample,
  computeQualityStats,
  CONF_FLOORS,
  NIGHT_LUX,
  TWILIGHT_LUX,
} from 'src/services/ambulance/ambulance';

/**
 * Automatic capture-quality report. Unlike the Accuracy tab (which needs a
 * human verdict per photo), everything here is derived from fields the device
 * already uploads with each image, so it answers "what is wrong right now"
 * without any review backlog.
 */

const RANGES = [
  ['24 h', 24],
  ['3 d', 72],
  ['7 d', 168],
  ['30 d', 720],
];

const num = (v, digits = 0, suffix = '') =>
  typeof v === 'number' ? `${v.toFixed(digits)}${suffix}` : '—';

function Bar({ label, count, share, total, color }) {
  return (
    <div className="amb-bar-row">
      <span className="amb-bar-label">{label}</span>
      <div className="amb-bar-track">
        <div className="amb-bar-fill" style={{ width: `${share}%`, background: color }} />
      </div>
      <span className="amb-bar-value">
        {count} of {total} · {share}%
      </span>
    </div>
  );
}

Bar.propTypes = {
  label: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  share: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};

function StatBox({ label, value, sub }) {
  return (
    <div className="amb-stat-box">
      <div className="amb-stat-box-label">{label}</div>
      <div className="amb-stat-box-value">{value}</div>
      {sub && <div className="amb-stat-box-sub">{sub}</div>}
    </div>
  );
}

StatBox.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
  sub: PropTypes.node,
};

function LightGroup({ title, hint, s }) {
  if (!s || s.count === 0) {
    return (
      <div className="amb-stat-box">
        <div className="amb-stat-box-label">{title}</div>
        <div className="amb-stat-box-value">0</div>
        <div className="amb-stat-box-sub">no captures in this window</div>
      </div>
    );
  }
  return (
    <div className="amb-stat-box">
      <div className="amb-stat-box-label">
        {title} <span className="text-muted fw-normal">{hint}</span>
      </div>
      <div className="amb-stat-box-value">{s.count}</div>
      <div className="amb-stat-box-sub">
        median confidence {s.medConfidence != null ? `${Math.round(s.medConfidence * 100)}%` : '—'}{' '}
        · {s.highConfShare}% at 90%+
        <br />
        plate {num(s.medPlatePx, 0, ' px')} · sharpness {num(s.medSharpness)} · brightness{' '}
        {num(s.medBrightness)}
        <br />
        exposure {s.medExposureUs != null ? `${(s.medExposureUs / 1000).toFixed(1)} ms` : '—'}
      </div>
    </div>
  );
}

LightGroup.propTypes = {
  title: PropTypes.string.isRequired,
  hint: PropTypes.string,
  s: PropTypes.object,
};

export default function QualityStatsView() {
  const [hours, setHours] = useState(168);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const rows = await listQualitySample({ sinceHours: hours });
      setStats(computeQualityStats(rows));
    } catch (e) {
      setError(e.message || 'Could not load capture stats');
    } finally {
      setLoading(false);
    }
  }, [hours]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <div className="d-flex align-items-center gap-2 flex-wrap mb-3">
        <span className="text-muted small">Window</span>
        {RANGES.map(([label, h]) => (
          <button
            key={h}
            className={`amb-tab ${hours === h ? 'active' : ''}`}
            onClick={() => setHours(h)}
          >
            {label}
          </button>
        ))}
        <button
          className="btn btn-sm btn-outline-primary ms-auto"
          onClick={load}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-1" />
          Refresh
        </button>
      </div>

      {error && <div className="alert alert-warning py-2">{error}</div>}
      {loading && <div className="spinner-border text-primary" />}

      {!loading && stats && stats.total === 0 && (
        <p className="text-muted">No detections in this window.</p>
      )}

      {!loading && stats && stats.total > 0 && (
        <>
          {/* What is wrong — the point of the page */}
          <div className="amb-card mb-3">
            <div className="amb-card-head">
              What is limiting accuracy{' '}
              <span className="text-muted fw-normal">
                (from {stats.total} captures, computed automatically)
              </span>
            </div>
            {stats.findings.map((f, i) => (
              <div key={i} className={`amb-finding amb-finding-${f.level}`}>
                <div className="amb-finding-title">
                  <i
                    className={`bi me-1 ${
                      f.level === 'bad'
                        ? 'bi-exclamation-octagon'
                        : f.level === 'warn'
                          ? 'bi-exclamation-triangle'
                          : 'bi-check-circle'
                    }`}
                  />
                  {f.title}
                </div>
                <div className="amb-finding-body">{f.body}</div>
              </div>
            ))}
          </div>

          {/* Confidence distribution */}
          <div className="amb-card mb-3">
            <div className="amb-card-head">
              Confidence distribution{' '}
              <span className="text-muted fw-normal">
                — how many reads clear each bar ({stats.withConfidence} with a confidence score)
              </span>
            </div>
            {stats.byFloor.map((b, i) => (
              <Bar
                key={b.floor}
                label={`≥ ${Math.round(b.floor * 100)}%`}
                count={b.count}
                share={b.share}
                total={stats.withConfidence}
                color={['#15803d', '#16a34a', '#65a30d', '#ca8a04', '#ea580c', '#dc2626'][i]}
              />
            ))}
            <Bar
              label={`< ${Math.round(CONF_FLOORS[CONF_FLOORS.length - 1] * 100)}%`}
              count={stats.belowLowest}
              share={stats.belowLowestShare}
              total={stats.withConfidence}
              color="#94a3b8"
            />
            <p className="text-muted small mb-0 mt-2">
              These bars are cumulative: a read counted at 95% is also counted at 90%. Note this is
              the OCR model&apos;s own certainty, not verified accuracy — the Accuracy tab measures
              that against human verdicts.
            </p>
          </div>

          {/* Day vs night */}
          <div className="amb-card mb-3">
            <div className="amb-card-head">
              Day vs night{' '}
              <span className="text-muted fw-normal">
                — split by measured light, not clock time
              </span>
            </div>
            <div className="amb-split">
              <LightGroup title="Day" hint={`≥ ${TWILIGHT_LUX} lux`} s={stats.day} />
              <LightGroup
                title="Twilight"
                hint={`${NIGHT_LUX}–${TWILIGHT_LUX} lux`}
                s={stats.twilight}
              />
              <LightGroup title="Night" hint={`< ${NIGHT_LUX} lux`} s={stats.night} />
              {stats.unknown.count > 0 && (
                <LightGroup title="Unknown" hint="no lux recorded" s={stats.unknown} />
              )}
            </div>
          </div>

          {/* Capture quality medians */}
          <div className="amb-card mb-3">
            <div className="amb-card-head">Capture quality — all captures in window</div>
            <div className="amb-split">
              <StatBox
                label="Plate width"
                value={num(stats.all.medPlatePx, 0, ' px')}
                sub="median; ~150 px needed for reliable OCR"
              />
              <StatBox
                label="Sharpness"
                value={num(stats.all.medSharpness)}
                sub="median; below 150 reads as soft or blurred"
              />
              <StatBox
                label="Brightness"
                value={num(stats.all.medBrightness)}
                sub="median of 255; below 60 is underexposed"
              />
              <StatBox
                label="Exposure"
                value={
                  stats.all.medExposureUs != null
                    ? `${(stats.all.medExposureUs / 1000).toFixed(1)} ms`
                    : '—'
                }
                sub="median; above 20 ms smears moving vehicles"
              />
              <StatBox
                label="Frame agreement"
                value={
                  stats.all.medAgreement != null
                    ? `${Math.round(stats.all.medAgreement * 100)}%`
                    : '—'
                }
                sub="how often frames read the same plate"
              />
              <StatBox
                label="At 90%+ confidence"
                value={`${stats.all.highConfShare}%`}
                sub={`of ${stats.withConfidence} scored reads`}
              />
            </div>
          </div>

          {/* Vehicle identification */}
          <div className="amb-card">
            <div className="amb-card-head">
              Vehicle identification{' '}
              <span className="text-muted fw-normal">— make and model alongside the plate</span>
            </div>
            {stats.vehicleCount === 0 ? (
              <p className="text-muted mb-0">
                No vehicle make/model on any capture in this window. The device is not running
                vehicle recognition yet — it detects the plate only. Once it uploads{' '}
                <code>vehicle_make</code> / <code>vehicle_model</code>, they appear here and in the
                photo viewer automatically; no dashboard change is needed.
              </p>
            ) : (
              <>
                <p className="text-muted small">
                  {stats.vehicleCount} of {stats.total} captures identified ({stats.vehicleCoverage}
                  %).
                </p>
                {stats.topVehicles.map(v => (
                  <Bar
                    key={v.name}
                    label={v.name}
                    count={v.count}
                    share={Math.round((v.count / stats.vehicleCount) * 100)}
                    total={stats.vehicleCount}
                    color="#0ea5e9"
                  />
                ))}
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
