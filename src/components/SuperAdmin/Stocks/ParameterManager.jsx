import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { saveParameter, deleteParameter } from 'src/services/stocks/stocks';

const BLANK = { name: '', unit: '', higherIsBetter: true, description: '', order: 50 };

const ParameterManager = ({ parameters, onChange }) => {
  const [form, setForm] = useState(BLANK);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async e => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await saveParameter({ ...form, name: form.name.trim() });
      setForm(BLANK);
      await onChange();
    } catch (err) {
      setError(err.message || 'Could not save parameter.');
    } finally {
      setBusy(false);
    }
  };

  const remove = async key => {
    await deleteParameter(key);
    await onChange();
  };

  return (
    <div className="stk-card">
      <h5 className="mb-3">Parameters</h5>
      <p className="text-muted small">
        Define the metrics to track. The description shows in the ⓘ tooltip. “Direction” sets
        whether a higher or lower value is favorable.
      </p>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <form className="row g-2 align-items-end mb-4" onSubmit={submit}>
        <div className="col-md-3">
          <label className="form-label small">Name</label>
          <input
            className="form-control form-control-sm"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Free Cash Flow"
          />
        </div>
        <div className="col-md-2">
          <label className="form-label small">Unit</label>
          <input
            className="form-control form-control-sm"
            value={form.unit}
            onChange={e => setForm({ ...form, unit: e.target.value })}
            placeholder="₹ Cr, %, x"
          />
        </div>
        <div className="col-md-2">
          <label className="form-label small">Direction</label>
          <select
            className="form-select form-select-sm"
            value={form.higherIsBetter ? 'high' : 'low'}
            onChange={e => setForm({ ...form, higherIsBetter: e.target.value === 'high' })}
          >
            <option value="high">Higher is better</option>
            <option value="low">Lower is better</option>
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label small">Description (tooltip)</label>
          <input
            className="form-control form-control-sm"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="What it means and why it matters"
          />
        </div>
        <div className="col-md-1">
          <button type="submit" className="btn btn-sm stk-btn w-100" disabled={busy}>
            Add
          </button>
        </div>
      </form>

      <div className="table-responsive">
        <table className="table stk-table align-middle">
          <thead>
            <tr>
              <th>Name</th>
              <th>Unit</th>
              <th>Direction</th>
              <th>Description</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {parameters.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-muted py-3">
                  No parameters yet.
                </td>
              </tr>
            )}
            {parameters.map(p => (
              <tr key={p.key}>
                <td className="fw-semibold">{p.name}</td>
                <td>{p.unit || '—'}</td>
                <td>
                  <span className={`stk-pill ${p.higherIsBetter ? 'pos' : 'neg'}`}>
                    {p.higherIsBetter ? 'higher ↑' : 'lower ↓'}
                  </span>
                </td>
                <td className="text-muted small">{p.description || '—'}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => remove(p.key)}
                    title="Delete parameter"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

ParameterManager.propTypes = {
  parameters: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ParameterManager;
