import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { listSnapshots } from 'src/services/stocks/stocks';

// Latest snapshot per company (by quarter string, which sorts lexically for YYYY-Qn).
function latestByCompany(snapshots) {
  const map = {};
  snapshots.forEach(s => {
    const cur = map[s.companyId];
    if (!cur || (s.quarter || '') > (cur.quarter || '')) map[s.companyId] = s;
  });
  return Object.values(map);
}

function countSigns(values = {}) {
  let pos = 0;
  let neg = 0;
  Object.values(values).forEach(v => {
    if (v && v.sign === '+') pos += 1;
    else if (v && v.sign === '-') neg += 1;
  });
  return { pos, neg };
}

const SectorDashboard = ({ companies, parameters }) => {
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setSnapshots(await listSnapshots());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <div className="text-muted">Loading sector data…</div>;

  const latest = latestByCompany(snapshots);
  const byCompanyId = Object.fromEntries(latest.map(s => [s.companyId, s]));

  // Group companies by sector (include companies without snapshots).
  const sectors = {};
  companies.forEach(c => {
    const sec = c.sector || 'Unclassified';
    (sectors[sec] = sectors[sec] || []).push(c);
  });
  const sectorNames = Object.keys(sectors).sort();

  const paramByKey = Object.fromEntries(parameters.map(p => [p.key, p]));

  if (companies.length === 0) {
    return <p className="text-muted">Add companies (with a sector) to see the sector dashboard.</p>;
  }

  return (
    <div className="row g-3">
      {sectorNames.map(sec => {
        const secCompanies = sectors[sec];
        let secPos = 0;
        let secNeg = 0;
        secCompanies.forEach(c => {
          const snap = byCompanyId[c.id];
          if (snap) {
            const { pos, neg } = countSigns(snap.values);
            secPos += pos;
            secNeg += neg;
          }
        });
        return (
          <div className="col-md-6 col-xl-4" key={sec}>
            <div className="stk-sector-card">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="stk-sector-name">{sec}</span>
                <span>
                  <span className="stk-pill pos me-1">+{secPos}</span>
                  <span className="stk-pill neg">−{secNeg}</span>
                </span>
              </div>
              <div className="text-muted small mb-2">{secCompanies.length} company(ies)</div>
              <table className="table table-sm mb-0">
                <tbody>
                  {secCompanies.map(c => {
                    const snap = byCompanyId[c.id];
                    const { pos, neg } = snap ? countSigns(snap.values) : { pos: 0, neg: 0 };
                    return (
                      <tr key={c.id}>
                        <td className="fw-semibold">{c.name}</td>
                        <td className="text-end">
                          {snap ? (
                            <>
                              <span className="stk-pill pos me-1">+{pos}</span>
                              <span className="stk-pill neg">−{neg}</span>
                              <span className="text-muted small ms-2">{snap.quarter}</span>
                            </>
                          ) : (
                            <span className="text-muted small">no data</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {/* Per-parameter signs for the sector's companies */}
              {secCompanies.some(c => byCompanyId[c.id]) && (
                <details className="mt-2">
                  <summary className="small text-primary" style={{ cursor: 'pointer' }}>
                    Parameter detail
                  </summary>
                  <div className="table-responsive mt-2">
                    <table className="table table-sm stk-table mb-0">
                      <thead>
                        <tr>
                          <th>Company</th>
                          {parameters.map(p => (
                            <th key={p.key} title={p.description}>
                              {p.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {secCompanies
                          .filter(c => byCompanyId[c.id])
                          .map(c => {
                            const snap = byCompanyId[c.id];
                            return (
                              <tr key={c.id}>
                                <td className="fw-semibold">{c.name}</td>
                                {parameters.map(p => {
                                  const v = (snap.values || {})[p.key];
                                  const sign = v && v.sign;
                                  return (
                                    <td key={p.key}>
                                      {v && v.value != null && v.value !== '' ? (
                                        <>
                                          {v.value}
                                          {paramByKey[p.key]?.unit ? '' : ''}{' '}
                                          {sign === '+' && <span className="text-success">▲</span>}
                                          {sign === '-' && <span className="text-danger">▼</span>}
                                        </>
                                      ) : (
                                        <span className="text-muted">—</span>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </details>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

SectorDashboard.propTypes = {
  companies: PropTypes.array.isRequired,
  parameters: PropTypes.array.isRequired,
};

export default SectorDashboard;
