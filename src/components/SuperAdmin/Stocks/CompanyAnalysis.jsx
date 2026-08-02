import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { getSnapshot, saveSnapshot, saveCompany, suggestSign } from 'src/services/stocks/stocks';
import { callFunction } from 'src/services/connector/functions';

const SIGN_CYCLE = { '': '+', '+': '-', '-': '' };

function Sign({ value, onCycle }) {
  const cls = value === '+' ? 'pos' : value === '-' ? 'neg' : '';
  return (
    <button type="button" className={`stk-sign ${cls}`} onClick={onCycle} title="Toggle +/-">
      {value || '±'}
    </button>
  );
}
Sign.propTypes = { value: PropTypes.string, onCycle: PropTypes.func };

const CompanyAnalysis = ({ parameters, companies, onCompaniesChange }) => {
  const [companyId, setCompanyId] = useState('');
  const [quarter, setQuarter] = useState('');
  const [values, setValues] = useState({}); // { key: { value, sign } }
  const [prevValues, setPrevValues] = useState({});
  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    ticker: '',
    exchange: 'NSE',
    sector: '',
  });
  // Company/ticker typeahead (India + US) via the searchSymbols Cloud Function.
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchErr, setSearchErr] = useState(null);

  const company = companies.find(c => c.id === companyId) || null;

  // Debounced symbol search.
  useEffect(() => {
    const q = search.trim();
    if (q.length < 2) {
      setResults([]);
      return undefined;
    }
    setSearching(true);
    setSearchErr(null);
    const t = setTimeout(async () => {
      try {
        const res = await callFunction('searchSymbols', { query: q });
        setResults(res.results || []);
      } catch (e) {
        setResults([]);
        setSearchErr(
          'Search needs the searchSymbols Cloud Function deployed (no API key required). You can still add a company manually below.'
        );
      } finally {
        setSearching(false);
      }
    }, 450);
    return () => clearTimeout(t);
  }, [search]);

  const pickResult = r => {
    setNewCompany(nc => ({
      ...nc,
      name: r.name,
      ticker: r.symbol,
      exchange: r.exchange || nc.exchange,
    }));
    setSearch('');
    setResults([]);
  };

  const loadSnapshot = useCallback(async () => {
    if (!companyId || !quarter) {
      setValues({});
      return;
    }
    setLoading(true);
    try {
      const snap = await getSnapshot(companyId, quarter);
      setValues(snap ? snap.values || {} : {});
      setSource(snap ? snap.source || '' : '');
      // previous quarter (best-effort) for sign suggestions
      const prevQ = previousQuarter(quarter);
      const prev = prevQ ? await getSnapshot(companyId, prevQ) : null;
      setPrevValues(prev ? prev.values || {} : {});
    } finally {
      setLoading(false);
    }
  }, [companyId, quarter]);

  useEffect(() => {
    loadSnapshot();
  }, [loadSnapshot]);

  const setValue = (key, patch) =>
    setValues(v => ({ ...v, [key]: { value: '', sign: '', ...v[key], ...patch } }));

  const handleFetch = async () => {
    if (!company) return;
    setFetching(true);
    setMsg(null);
    try {
      const res = await callFunction('stockMetrics', {
        company: company.name,
        ticker: company.ticker || '',
        exchange: company.exchange || '',
        sector: company.sector || '',
        quarter,
        parameters: parameters.map(p => ({
          key: p.key,
          name: p.name,
          unit: p.unit,
          higherIsBetter: p.higherIsBetter,
        })),
      });
      const fetched = res.values || {};
      setValues(prev => {
        const next = { ...prev };
        parameters.forEach(p => {
          const f = fetched[p.key];
          if (f && f.value != null) {
            next[p.key] = { value: f.value, sign: f.sign || prev[p.key]?.sign || '' };
          }
        });
        return next;
      });
      setSource(res.source || 'yahoo');
      // Capture the sector from Yahoo if the company doesn't have one yet.
      if (res.sector && !company.sector) {
        await saveCompany({ ...company, sector: res.sector });
        await onCompaniesChange();
      }
      setMsg({ type: 'info', text: res.note || 'Draft loaded — review before saving.' });
    } catch (e) {
      setMsg({
        type: 'danger',
        text:
          'Could not fetch data. The stockMetrics Cloud Function must be deployed (uses Yahoo Finance, no API key). ' +
          (e.message || ''),
      });
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async () => {
    if (!company || !quarter) {
      setMsg({ type: 'danger', text: 'Pick a company and enter a quarter first.' });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      await saveSnapshot({
        companyId,
        companyName: company.name,
        sector: company.sector || '',
        quarter,
        source: source || 'manual',
        values,
      });
      setMsg({ type: 'success', text: `Saved ${company.name} — ${quarter}.` });
    } catch (e) {
      setMsg({ type: 'danger', text: `Save failed: ${e.message || e}` });
    } finally {
      setSaving(false);
    }
  };

  const handleAddCompany = async () => {
    if (!newCompany.name.trim()) return;
    const saved = await saveCompany({ ...newCompany, name: newCompany.name.trim() });
    setShowAdd(false);
    setNewCompany({ name: '', ticker: '', exchange: 'NSE', sector: '' });
    await onCompaniesChange();
    setCompanyId(saved.id);
  };

  return (
    <div className="stk-card">
      {/* Controls */}
      <div className="row g-3 align-items-end mb-3">
        <div className="col-md-5">
          <label className="form-label small fw-semibold">Company</label>
          <div className="d-flex gap-2">
            <select
              className="form-select"
              value={companyId}
              onChange={e => setCompanyId(e.target.value)}
            >
              <option value="">Select a company…</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                  {c.sector ? ` · ${c.sector}` : ''}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-outline-primary text-nowrap"
              onClick={() => setShowAdd(s => !s)}
            >
              + Add
            </button>
          </div>
        </div>
        <div className="col-md-3">
          <label className="form-label small fw-semibold">Quarter</label>
          <input
            className="form-control"
            placeholder="e.g. 2025-Q1"
            value={quarter}
            onChange={e => setQuarter(e.target.value)}
          />
        </div>
        <div className="col-md-4 d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary flex-fill"
            disabled={!company || !parameters.length || fetching}
            onClick={handleFetch}
          >
            {fetching ? 'Fetching…' : 'Fetch (API / AI)'}
          </button>
          <button
            type="button"
            className="btn stk-btn flex-fill"
            disabled={!company || !quarter || saving}
            onClick={handleSave}
          >
            {saving ? 'Saving…' : 'Save quarter'}
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="mb-3 p-3 bg-light rounded">
          {/* Typeahead search across India (NSE/BSE) + US (NYSE/NASDAQ) listings */}
          <div className="position-relative mb-2">
            <label className="form-label small">Search company or ticker (India &amp; US)</label>
            <input
              className="form-control form-control-sm"
              placeholder="e.g. Reliance, INFY, Apple, AAPL…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoComplete="off"
            />
            {(searching || results.length > 0) && (
              <div className="stk-search-menu">
                {searching && <div className="stk-search-item text-muted">Searching…</div>}
                {!searching &&
                  results.map(r => (
                    <button
                      type="button"
                      key={`${r.symbol}-${r.exchange}`}
                      className="stk-search-item"
                      onClick={() => pickResult(r)}
                    >
                      <span className="fw-semibold">{r.symbol}</span>
                      <span className="text-muted"> · {r.name}</span>
                      {r.exchange && <span className="stk-ex-badge">{r.exchange}</span>}
                    </button>
                  ))}
              </div>
            )}
          </div>
          {searchErr && <div className="alert alert-warning py-1 small mb-2">{searchErr}</div>}

          <div className="row g-2 align-items-end">
            <div className="col-md-4">
              <label className="form-label small">Name</label>
              <input
                className="form-control form-control-sm"
                value={newCompany.name}
                onChange={e => setNewCompany({ ...newCompany, name: e.target.value })}
              />
            </div>
            <div className="col-md-2">
              <label className="form-label small">Ticker</label>
              <input
                className="form-control form-control-sm"
                value={newCompany.ticker}
                onChange={e =>
                  setNewCompany({ ...newCompany, ticker: e.target.value.toUpperCase() })
                }
              />
            </div>
            <div className="col-md-2">
              <label className="form-label small">Exchange</label>
              <input
                className="form-control form-control-sm"
                value={newCompany.exchange}
                onChange={e => setNewCompany({ ...newCompany, exchange: e.target.value })}
              />
            </div>
            <div className="col-md-2">
              <label className="form-label small">Sector</label>
              <input
                className="form-control form-control-sm"
                value={newCompany.sector}
                onChange={e => setNewCompany({ ...newCompany, sector: e.target.value })}
              />
            </div>
            <div className="col-md-2">
              <button type="button" className="btn btn-sm stk-btn w-100" onClick={handleAddCompany}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {msg && <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>}

      {/* Parameter health check */}
      {!company ? (
        <p className="text-muted mb-0">
          Select or add a company to see its parameter health check.
        </p>
      ) : parameters.length === 0 ? (
        <p className="text-muted mb-0">No parameters yet — add some in the “Parameters” tab.</p>
      ) : (
        <div className="table-responsive">
          <table className="table stk-table align-middle">
            <thead>
              <tr>
                <th>Parameter</th>
                <th style={{ width: 200 }}>Value{loading ? ' (loading…)' : ''}</th>
                <th style={{ width: 90 }}>Health</th>
              </tr>
            </thead>
            <tbody>
              {parameters.map(p => {
                const cur = values[p.key] || { value: '', sign: '' };
                const suggested = suggestSign(p, cur.value, prevValues[p.key]?.value);
                return (
                  <tr key={p.key}>
                    <td>
                      <span className="fw-semibold">{p.name}</span>
                      {p.unit ? <span className="text-muted"> ({p.unit})</span> : null}
                      <i className="stk-info" data-tip={p.description || p.name}>
                        i
                      </i>
                      <div className="stk-dir">
                        {p.higherIsBetter ? 'higher is better' : 'lower is better'}
                      </div>
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control form-control-sm stk-value-input"
                        value={cur.value ?? ''}
                        onChange={e => setValue(p.key, { value: e.target.value })}
                        placeholder="—"
                      />
                    </td>
                    <td>
                      <Sign
                        value={cur.sign || ''}
                        onCycle={() => setValue(p.key, { sign: SIGN_CYCLE[cur.sign || ''] })}
                      />
                      {suggested && suggested !== (cur.sign || '') && (
                        <button
                          type="button"
                          className="btn btn-link btn-sm p-0 ms-1"
                          title="Apply suggested sign (from last quarter change)"
                          onClick={() => setValue(p.key, { sign: suggested })}
                        >
                          {suggested === '+' ? '↑?' : '↓?'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {source && <p className="stk-note mb-0">Source of current values: {source}</p>}
        </div>
      )}
    </div>
  );
};

// Compute the previous quarter label ("2025-Q1" -> "2024-Q4").
function previousQuarter(q) {
  const m = /^(\d{4})-Q([1-4])$/.exec(q || '');
  if (!m) return null;
  let year = Number(m[1]);
  let qn = Number(m[2]) - 1;
  if (qn === 0) {
    qn = 4;
    year -= 1;
  }
  return `${year}-Q${qn}`;
}

CompanyAnalysis.propTypes = {
  parameters: PropTypes.array.isRequired,
  companies: PropTypes.array.isRequired,
  onCompaniesChange: PropTypes.func.isRequired,
};

export default CompanyAnalysis;
