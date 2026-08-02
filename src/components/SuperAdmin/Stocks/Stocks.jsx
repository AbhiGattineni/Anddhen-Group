import React, { useEffect, useState, useCallback } from 'react';
import { ensureDefaultParameters, listParameters, listCompanies } from 'src/services/stocks/stocks';
import CompanyAnalysis from './CompanyAnalysis';
import ParameterManager from './ParameterManager';
import SectorDashboard from './SectorDashboard';
import './Stocks.css';

const TABS = [
  { id: 'analysis', label: 'Company Analysis' },
  { id: 'sectors', label: 'Sector Dashboard' },
  { id: 'params', label: 'Parameters' },
];

const Stocks = () => {
  const [tab, setTab] = useState('analysis');
  const [parameters, setParameters] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshParameters = useCallback(async () => {
    setParameters(await listParameters());
  }, []);
  const refreshCompanies = useCallback(async () => {
    setCompanies(await listCompanies());
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        await ensureDefaultParameters();
        await Promise.all([refreshParameters(), refreshCompanies()]);
      } catch (e) {
        setError(
          'Could not load stock data from Firestore. Make sure you are signed in as an admin and Firestore is enabled. ' +
            (e.message || '')
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshParameters, refreshCompanies]);

  return (
    <div className="stk-wrap container-fluid px-3 px-md-5">
      <div className="py-3">
        <h1 className="stk-title h3">Stocks</h1>
        <p className="stk-subtitle">
          Track company fundamentals quarter by quarter and gauge their health at a glance.
        </p>
      </div>

      {error && <div className="alert alert-warning">{error}</div>}

      <ul className="nav nav-pills gap-2 mb-3">
        {TABS.map(t => (
          <li className="nav-item" key={t.id}>
            <button
              type="button"
              className={`nav-link ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          </li>
        ))}
      </ul>

      {loading ? (
        <div className="text-muted">Loading…</div>
      ) : (
        <>
          {tab === 'analysis' && (
            <CompanyAnalysis
              parameters={parameters}
              companies={companies}
              onCompaniesChange={refreshCompanies}
            />
          )}
          {tab === 'sectors' && <SectorDashboard companies={companies} parameters={parameters} />}
          {tab === 'params' && (
            <ParameterManager parameters={parameters} onChange={refreshParameters} />
          )}
        </>
      )}
    </div>
  );
};

export default Stocks;
