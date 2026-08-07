import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  listReviewCandidates,
  listReviews,
  saveReview,
  computeAccuracyStats,
  pickReviewQueue,
  countViolations,
  countDetections,
} from 'src/services/ambulance/ambulance';
import { SafeImg, fmt, sharpnessOf, Chart } from './shared';

const BUCKET_COLOR = acc => {
  if (acc == null) return 'amb-bucket-empty';
  if (acc >= 85) return 'amb-bucket-good';
  if (acc >= 60) return 'amb-bucket-mid';
  return 'amb-bucket-bad';
};

/**
 * Turns human-reviewed labels into decisions: how accurate the OCR actually
 * is (confidence is the model's own guess, not ground truth), which
 * confidence level to trust automatically, whether blur is the real problem
 * or the OCR logic itself, and the exact characters it confuses.
 */
export default function AccuracyView() {
  const [candidates, setCandidates] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [totals, setTotals] = useState(null);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const load = useCallback(async () => {
    setError('');
    try {
      const [c, r, violations, detections] = await Promise.all([
        listReviewCandidates(),
        listReviews(),
        countViolations(),
        countDetections(),
      ]);
      setCandidates(c);
      setReviews(r);
      setTotals({ violations, detections });
    } catch (e) {
      setError(e.message || 'Could not load accuracy data');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const stats = useMemo(() => (reviews ? computeAccuracyStats(reviews) : null), [reviews]);
  const queue = useMemo(
    () => (candidates && reviews ? pickReviewQueue(candidates, reviews) : []),
    [candidates, reviews]
  );

  const handleReviewed = () => setRefreshKey(k => k + 1);

  const trendSeries = useMemo(() => {
    if (!stats?.trend?.length) return null;
    return [
      {
        name: 'accuracy',
        color: '#3b82f6',
        points: stats.trend
          .filter(d => d.accuracy != null)
          .map(d => [new Date(`${d.day}T12:00:00`), d.accuracy]),
      },
    ];
  }, [stats]);

  const exportCsv = () => {
    if (!reviews?.length) return;
    const header =
      'sourceCollection,sourceId,plate,correctedPlate,correct,confidence,sharpness,time,reviewedAt';
    const rows = reviews.map(r =>
      [
        r.sourceCollection,
        r.sourceId,
        r.plate,
        r.correctedPlate || '',
        r.correct,
        r.confidence ?? '',
        r.sharpness ?? '',
        r.time ? r.time.toISOString() : '',
        r.reviewedAt ? r.reviewedAt.toISOString() : '',
      ]
        .map(v => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    );
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `plate-review-labels-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  if (error) return <div className="alert alert-warning">{error}</div>;
  if (!stats || !totals) return <div className="spinner-border text-primary" />;

  return (
    <>
      {/* Headline counts — "how many has it made" */}
      <div className="row g-3 mb-3">
        <div className="col-6 col-lg-3">
          <div className="amb-tile">
            <div className="amb-tile-label">Detections (all-time)</div>
            <div className="amb-tile-value">{totals.detections}</div>
            <div className="amb-tile-sub">every plate read, logged forever</div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="amb-tile">
            <div className="amb-tile-label">Violations (all-time)</div>
            <div className="amb-tile-value">{totals.violations}</div>
            <div className="amb-tile-sub">
              {totals.detections
                ? `${((totals.violations / totals.detections) * 100).toFixed(1)}% of detections`
                : '—'}
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="amb-tile">
            <div className="amb-tile-label">Reviewed (ground truth)</div>
            <div className="amb-tile-value">{stats.reviewedCount}</div>
            <div className="amb-tile-sub">
              {stats.reviewedCount < 20 ? 'review more for a reliable number' : 'human-verified'}
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="amb-tile">
            <div className="amb-tile-label">Real accuracy</div>
            <div className="amb-tile-value">
              {stats.overallAccuracy != null ? `${stats.overallAccuracy}%` : '—'}
            </div>
            <div className="amb-tile-sub">correct plate reads out of reviewed, not confidence</div>
          </div>
        </div>
      </div>

      <Recommendations stats={stats} />

      {/* Accuracy by confidence bucket */}
      <div className="amb-card mb-3">
        <div className="amb-card-head">
          Accuracy by confidence level{' '}
          <span className="text-muted fw-normal">
            — is the model&rsquo;s own confidence score trustworthy?
          </span>
        </div>
        {stats.byBucket.every(b => b.count === 0) ? (
          <p className="text-muted mb-0">Review some detections below to see this.</p>
        ) : (
          <div className="amb-buckets">
            {stats.byBucket.map(b => (
              <div className="amb-bucket-row" key={b.label}>
                <span className="amb-bucket-label">{b.label}</span>
                <div className="amb-bucket-track">
                  <div
                    className={`amb-bucket-fill ${BUCKET_COLOR(b.accuracy)}`}
                    style={{ width: `${b.accuracy ?? 0}%` }}
                  />
                </div>
                <span className="amb-bucket-value">
                  {b.accuracy != null ? `${b.accuracy}%` : '—'}{' '}
                  <span className="text-muted">({b.count})</span>
                </span>
              </div>
            ))}
          </div>
        )}
        {stats.recommendedThreshold != null && (
          <p className="text-muted small mt-2 mb-0">
            Recommended: auto-trust reads with confidence ≥{' '}
            <strong>{Math.round(stats.recommendedThreshold * 100)}%</strong> — everything at or
            above that has held ≥90% accuracy in your reviewed sample.
          </p>
        )}
      </div>

      {/* Accuracy over time */}
      {trendSeries && (
        <Chart
          title="Accuracy over time"
          subtitle="by original capture day — shows whether a physical fix actually helped"
          unit="%"
          yDomain={[0, 100]}
          series={trendSeries}
        />
      )}

      {/* Clarity vs accuracy + confusions */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-lg-6">
          <div className="amb-card h-100">
            <div className="amb-card-head">Does a sharper photo read more accurately?</div>
            {stats.sharpnessCorrelation.sampleSize === 0 ? (
              <p className="text-muted mb-0">
                Not enough reviewed photos with a readable image yet.
              </p>
            ) : (
              <>
                <div className="d-flex gap-4">
                  <div>
                    <div className="amb-focus-score">
                      {stats.sharpnessCorrelation.correctAvg ?? '—'}
                    </div>
                    <div className="text-muted small">avg sharpness, correct reads</div>
                  </div>
                  <div>
                    <div className="amb-focus-score">
                      {stats.sharpnessCorrelation.wrongAvg ?? '—'}
                    </div>
                    <div className="text-muted small">avg sharpness, wrong reads</div>
                  </div>
                </div>
                <p className="text-muted small mt-2 mb-0">
                  {stats.sharpnessCorrelation.correctAvg != null &&
                  stats.sharpnessCorrelation.wrongAvg != null
                    ? stats.sharpnessCorrelation.correctAvg - stats.sharpnessCorrelation.wrongAvg >
                      30
                      ? 'Blurry photos are clearly more likely to be misread — fixing camera focus (see the Detections tab) will likely raise accuracy more than any software change right now.'
                      : 'Sharpness is not the main driver of errors — most mistakes happen on clear photos too, so the fix is in the OCR/algorithm logic (see confusions below), not the lens.'
                    : ''}
                </p>
              </>
            )}
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="amb-card h-100">
            <div className="amb-card-head">Most common OCR mistakes</div>
            {stats.confusions.length === 0 ? (
              <p className="text-muted mb-0">
                None yet — mark a wrong read with its correct plate (same length) to build this up.
              </p>
            ) : (
              <div className="d-flex flex-wrap gap-2">
                {stats.confusions.map(c => (
                  <span key={c.pair} className="amb-gap-chip">
                    {c.pair} × {c.count}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Export */}
      <div className="mb-3">
        <button
          className="btn btn-sm btn-outline-secondary"
          disabled={!reviews.length}
          onClick={exportCsv}
        >
          <i className="bi bi-download me-1" />
          Export {reviews.length} labeled row{reviews.length === 1 ? '' : 's'} as CSV
        </button>
      </div>

      {/* Review queue */}
      <div className="amb-card">
        <div className="amb-card-head">
          Review queue{' '}
          <span className="text-muted fw-normal">
            — stratified across confidence levels, violations first
          </span>
        </div>
        {!candidates ? (
          <div className="spinner-border spinner-border-sm text-primary" />
        ) : queue.length === 0 ? (
          <p className="text-muted mb-0">
            Nothing pending — every recent violation/detection has been reviewed.
          </p>
        ) : (
          <div className="row g-3">
            {queue.map(c => (
              <ReviewCard
                key={`${c.sourceCollection}_${c.id}`}
                candidate={c}
                onSaved={handleReviewed}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function Recommendations({ stats }) {
  const lines = [];
  if (stats.reviewedCount < 20) {
    lines.push({
      icon: 'bi-clipboard-check',
      text: `Only ${stats.reviewedCount} reviewed so far — review at least 20-30 in the queue below before trusting any of these numbers.`,
    });
  }
  if (stats.overallAccuracy != null && stats.overallAccuracy < 70) {
    lines.push({
      icon: 'bi-exclamation-triangle',
      text: `Accuracy is ${stats.overallAccuracy}%, which is low — check the sharpness comparison below before tuning software; a focus/lighting fix usually moves this number more than algorithm changes.`,
    });
  }
  if (stats.recommendedThreshold != null) {
    lines.push({
      icon: 'bi-sliders',
      text: `Set your violation/alert threshold to confidence ≥ ${Math.round(stats.recommendedThreshold * 100)}% — reads below that are unreliable in your own data.`,
    });
  } else if (stats.byBucket.some(b => b.count > 0)) {
    lines.push({
      icon: 'bi-sliders',
      text: `No confidence bucket has cleared 90% accuracy yet — confidence alone is not a safe filter right now; treat every low-confidence read as needing a human look until more reviews land.`,
    });
  }
  if (stats.confusions.length > 0) {
    const top = stats.confusions[0];
    lines.push({
      icon: 'bi-fonts',
      text: `The most frequent OCR mistake is ${top.pair} (${top.count}× in your reviews) — worth a targeted post-processing rule or a prompt/model tweak for that specific confusion.`,
    });
  }
  if (!lines.length) return null;
  return (
    <div className="amb-card mb-3 amb-recs">
      <div className="amb-card-head">
        <i className="bi bi-lightbulb me-1" />
        What to do next
      </div>
      <ul className="mb-0 ps-3">
        {lines.map((l, i) => (
          <li key={i} className="mb-1">
            <i className={`bi ${l.icon} me-2 text-primary`} />
            {l.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

Recommendations.propTypes = {
  stats: PropTypes.object.isRequired,
};

function ReviewCard({ candidate, onSaved }) {
  const [mode, setMode] = useState(null); // null | 'wrong'
  const [correctedPlate, setCorrectedPlate] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async correct => {
    setBusy(true);
    setError('');
    try {
      let sharpness = null;
      try {
        sharpness = await sharpnessOf(candidate.photoUrl);
      } catch {
        sharpness = null; // expired/unreadable — still record the verdict
      }
      await saveReview({
        sourceCollection: candidate.sourceCollection,
        sourceId: candidate.id,
        plate: candidate.plate,
        correct,
        correctedPlate: correct ? null : correctedPlate.trim() || null,
        confidence: candidate.confidence,
        sharpness,
        time: candidate.time,
      });
      onSaved();
    } catch (e) {
      setError(e.message || 'Could not save review');
      setBusy(false);
    }
  };

  return (
    <div className="col-6 col-md-4 col-xl-3">
      <div className="amb-review-card">
        <SafeImg src={candidate.photoUrl} alt={candidate.plate} className="amb-thumb" />
        <div className="p-2">
          <div className="d-flex justify-content-between align-items-center">
            <span className="amb-plate">{candidate.plate || 'UNKNOWN'}</span>
            <span
              className={`amb-badge-src ${candidate.sourceCollection === 'violations' ? 'is-violation' : ''}`}
            >
              {candidate.sourceCollection === 'violations' ? 'violation' : 'detection'}
            </span>
          </div>
          <div className="text-muted small mb-2">
            {fmt(candidate.time)}
            {candidate.confidence != null && ` · ${Math.round(candidate.confidence * 100)}%`}
          </div>

          {error && <div className="text-danger small mb-1">{error}</div>}

          {mode !== 'wrong' ? (
            <div className="d-flex gap-1">
              <button
                className="btn btn-sm btn-success flex-fill"
                disabled={busy}
                onClick={() => submit(true)}
              >
                <i className="bi bi-check-lg" /> Correct
              </button>
              <button
                className="btn btn-sm btn-outline-danger flex-fill"
                disabled={busy}
                onClick={() => setMode('wrong')}
              >
                <i className="bi bi-x-lg" /> Wrong
              </button>
            </div>
          ) : (
            <div>
              <input
                className="form-control form-control-sm mb-1"
                placeholder="Correct plate (optional)"
                value={correctedPlate}
                onChange={e => setCorrectedPlate(e.target.value.toUpperCase())}
                autoFocus
              />
              <div className="d-flex gap-1">
                <button
                  className="btn btn-sm btn-danger flex-fill"
                  disabled={busy}
                  onClick={() => submit(false)}
                >
                  Save
                </button>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  disabled={busy}
                  onClick={() => setMode(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

ReviewCard.propTypes = {
  candidate: PropTypes.object.isRequired,
  onSaved: PropTypes.func.isRequired,
};
