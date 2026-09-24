import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const ASSETS = [
  { name: 'US Equity (S&P 500)', pct: 15, cagrINR: 14, cagrUSD: 11, color: '#3b82f6' },
  { name: 'Gold', pct: 15, cagrINR: 12, cagrUSD: 9, color: '#f59e0b' },
  { name: 'Large Cap (Nifty 50)', pct: 20, cagrINR: 14, cagrUSD: 14, color: '#10b981' },
  { name: 'Midcap (Nifty 150)', pct: 20, cagrINR: 17, cagrUSD: 17, color: '#8b5cf6' },
  { name: 'Smallcap (Nifty 250)', pct: 20, cagrINR: 15, cagrUSD: 15, color: '#ef4444' },
  { name: 'FDs / Silver / Misc', pct: 10, cagrINR: 7, cagrUSD: 7, color: '#6b7280' },
];

const START_YEAR = 2004;
const END_YEAR = 2024;

function buildHistoricalData(currency) {
  const rows = [];
  for (let yr = START_YEAR; yr <= END_YEAR; yr++) {
    const n = yr - START_YEAR;
    const row = { year: yr };
    ASSETS.forEach(a => {
      const cagr = currency === 'INR' ? a.cagrINR : a.cagrUSD;
      row[a.name] = parseFloat((100 * Math.pow(1 + cagr / 100, n)).toFixed(1));
    });
    rows.push(row);
  }
  return rows;
}

function weightedCagr(currency, allocMap, total) {
  if (!total) return 0;
  return ASSETS.reduce((sum, a) => {
    const cagr = currency === 'INR' ? a.cagrINR : a.cagrUSD;
    const frac = (allocMap[a.name] || 0) / total;
    return sum + frac * cagr;
  }, 0);
}

function fmt(val, currency) {
  if (currency === 'INR') {
    if (val >= 1e7) return `₹${(val / 1e7).toFixed(2)} Cr`;
    if (val >= 1e5) return `₹${(val / 1e5).toFixed(2)} L`;
    return `₹${Math.round(val).toLocaleString('en-IN')}`;
  }
  if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
  return `$${Math.round(val).toLocaleString('en-US')}`;
}

const LABEL_SX = { fontSize: 11 };

const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, pct }) => {
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11}>
      {`${pct}%`}
    </text>
  );
};

export default function PortfolioDashboard() {
  const [currency, setCurrency] = useState('INR');
  const [investAmount, setInvestAmount] = useState('');
  const [projYears, setProjYears] = useState(10);
  const [rows, setRows] = useState([{ fund: '', amount: '', category: '' }]);

  const historical = useMemo(() => buildHistoricalData(currency), [currency]);

  const shansCagr = useMemo(
    () =>
      ASSETS.reduce((s, a) => {
        const cagr = currency === 'INR' ? a.cagrINR : a.cagrUSD;
        return s + (a.pct / 100) * cagr;
      }, 0),
    [currency]
  );

  const parsedAmount = parseFloat(investAmount) || 0;
  const shansProjected = parsedAmount
    ? parsedAmount * Math.pow(1 + shansCagr / 100, projYears)
    : null;

  const totalUserAmt = useMemo(
    () => rows.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0),
    [rows]
  );

  const userAllocMap = useMemo(() => {
    const m = {};
    ASSETS.forEach(a => (m[a.name] = 0));
    rows.forEach(r => {
      const amt = parseFloat(r.amount) || 0;
      if (r.category && m[r.category] !== undefined) m[r.category] += amt;
    });
    return m;
  }, [rows]);

  const userCagr = useMemo(
    () => weightedCagr(currency, userAllocMap, totalUserAmt),
    [currency, userAllocMap, totalUserAmt]
  );

  const userProjected = totalUserAmt
    ? totalUserAmt * Math.pow(1 + userCagr / 100, projYears)
    : null;

  const comparisonData = useMemo(
    () =>
      ASSETS.map(a => ({
        name: a.name.replace(' (', '\n('),
        "Shan's Target": a.pct,
        'Your Allocation': totalUserAmt
          ? parseFloat(((userAllocMap[a.name] / totalUserAmt) * 100).toFixed(1))
          : 0,
      })),
    [userAllocMap, totalUserAmt]
  );

  const addRow = () => setRows(p => [...p, { fund: '', amount: '', category: '' }]);
  const removeRow = idx => setRows(p => p.filter((_, i) => i !== idx));
  const updateRow = (idx, field, val) =>
    setRows(p => {
      const next = [...p];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });

  const sectionStyle = {
    background: '#ffffff',
    borderRadius: 12,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    padding: '24px',
    marginBottom: '24px',
  };

  const sectionHeading = {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '16px',
    borderLeft: '4px solid #3b82f6',
    paddingLeft: '10px',
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '8px 16px 32px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
            ATI Portfolio Dashboard
          </h2>
          <p style={{ color: '#64748b', fontSize: 13, margin: '4px 0 0' }}>
            Compare your allocation against our model portfolio and see projected returns.
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 0,
            border: '1.5px solid #e2e8f0',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          {['INR', 'USD'].map(c => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              style={{
                padding: '6px 18px',
                fontSize: 13,
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: currency === c ? '#3b82f6' : '#f8fafc',
                color: currency === c ? '#fff' : '#475569',
                transition: 'all 0.15s',
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Target Allocation Pie */}
      <div style={sectionStyle}>
        <div style={sectionHeading}>Shan&apos;s Target Allocation</div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <ResponsiveContainer width="100%" height={240} style={{ minWidth: 260, maxWidth: 360 }}>
            <PieChart>
              <Pie
                data={ASSETS.map(a => ({ name: a.name, value: a.pct, pct: a.pct }))}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                labelLine={false}
                label={renderPieLabel}
              >
                {ASSETS.map(a => (
                  <Cell key={a.name} fill={a.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [`${v}%`, n]} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ flex: 1, minWidth: 200 }}>
            {ASSETS.map(a => {
              const cagr = currency === 'INR' ? a.cagrINR : a.cagrUSD;
              return (
                <div
                  key={a.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 8,
                    fontSize: 13,
                  }}
                >
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 3,
                      background: a.color,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ flex: 1, color: '#374151' }}>{a.name}</span>
                  <span style={{ fontWeight: 700, color: '#1e293b', minWidth: 32 }}>{a.pct}%</span>
                  <span
                    style={{
                      fontSize: 11,
                      color: '#10b981',
                      background: '#d1fae5',
                      borderRadius: 4,
                      padding: '1px 6px',
                      minWidth: 56,
                      textAlign: 'center',
                    }}
                  >
                    ~{cagr}% p.a.
                  </span>
                </div>
              );
            })}
            <div
              style={{
                marginTop: 12,
                padding: '8px 12px',
                background: '#eff6ff',
                borderRadius: 8,
                fontSize: 13,
              }}
            >
              <span style={{ color: '#475569' }}>Weighted CAGR: </span>
              <span style={{ fontWeight: 700, color: '#1d4ed8' }}>
                ~{shansCagr.toFixed(1)}% p.a.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Growth Chart */}
      <div style={sectionStyle}>
        <div style={sectionHeading}>20-Year Historical Growth (₹100 invested in 2004)</div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={historical} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="year" tick={LABEL_SX} />
            <YAxis tick={LABEL_SX} tickFormatter={v => `₹${v}`} domain={['auto', 'auto']} />
            <Tooltip
              formatter={(v, n) => [`₹${v.toFixed(0)}`, n]}
              contentStyle={{ fontSize: 12 }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {ASSETS.map(a => (
              <Line
                key={a.name}
                type="monotone"
                dataKey={a.name}
                stroke={a.color}
                dot={false}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
        <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 8, marginBottom: 0 }}>
          Based on historical CAGR averages. Past performance is not indicative of future results.
          {currency === 'USD' ? ' US indices shown in USD; Indian indices retain INR CAGR.' : ''}
        </p>
      </div>

      {/* Projection Calculator */}
      <div style={sectionStyle}>
        <div style={sectionHeading}>Investment Projection — Shan&apos;s Portfolio</div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ fontSize: 13, color: '#475569', display: 'block', marginBottom: 4 }}>
              Investment Amount ({currency === 'INR' ? '₹' : '$'})
            </label>
            <input
              type="number"
              min="0"
              value={investAmount}
              onChange={e => setInvestAmount(e.target.value)}
              placeholder={currency === 'INR' ? 'e.g. 500000' : 'e.g. 10000'}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 8,
                border: '1.5px solid #e2e8f0',
                fontSize: 14,
              }}
            />
          </div>
          <div style={{ flex: '2 1 280px' }}>
            <label style={{ fontSize: 13, color: '#475569', display: 'block', marginBottom: 4 }}>
              Projection Horizon: <strong>{projYears} years</strong>
            </label>
            <input
              type="range"
              min={1}
              max={30}
              value={projYears}
              onChange={e => setProjYears(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#3b82f6' }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 11,
                color: '#94a3b8',
              }}
            >
              <span>1 yr</span>
              <span>30 yrs</span>
            </div>
          </div>
        </div>

        {shansProjected !== null && (
          <div
            style={{
              marginTop: 20,
              display: 'flex',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                flex: 1,
                minWidth: 160,
                background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                borderRadius: 10,
                padding: '14px 18px',
              }}
            >
              <div style={{ fontSize: 11, color: '#475569', marginBottom: 4 }}>Invested amount</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>
                {fmt(parsedAmount, currency)}
              </div>
            </div>
            <div
              style={{
                flex: 1,
                minWidth: 160,
                background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                borderRadius: 10,
                padding: '14px 18px',
              }}
            >
              <div style={{ fontSize: 11, color: '#475569', marginBottom: 4 }}>
                Projected value in {projYears} yrs (Shan&apos;s portfolio)
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#15803d' }}>
                {fmt(shansProjected, currency)}
              </div>
            </div>
            <div
              style={{
                flex: 1,
                minWidth: 160,
                background: 'linear-gradient(135deg, #fefce8, #fef9c3)',
                borderRadius: 10,
                padding: '14px 18px',
              }}
            >
              <div style={{ fontSize: 11, color: '#475569', marginBottom: 4 }}>Gain</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#a16207' }}>
                {fmt(shansProjected - parsedAmount, currency)}{' '}
                <span style={{ fontSize: 13 }}>
                  ({(((shansProjected - parsedAmount) / parsedAmount) * 100).toFixed(0)}%)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Portfolio Form */}
      <div style={sectionStyle}>
        <div style={sectionHeading}>Your Portfolio</div>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>
          Enter your investments to compare with the model portfolio.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th
                  style={{ padding: '8px', textAlign: 'left', color: '#475569', fontWeight: 600 }}
                >
                  Fund / Instrument
                </th>
                <th
                  style={{ padding: '8px', textAlign: 'left', color: '#475569', fontWeight: 600 }}
                >
                  Amount ({currency === 'INR' ? '₹' : '$'})
                </th>
                <th
                  style={{ padding: '8px', textAlign: 'left', color: '#475569', fontWeight: 600 }}
                >
                  Category
                </th>
                <th style={{ width: 40 }} />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '6px 8px' }}>
                    <input
                      type="text"
                      value={row.fund}
                      onChange={e => updateRow(idx, 'fund', e.target.value)}
                      placeholder="e.g. HDFC Nifty 50 Index"
                      style={{
                        width: '100%',
                        padding: '6px 10px',
                        borderRadius: 6,
                        border: '1.5px solid #e2e8f0',
                        fontSize: 13,
                      }}
                    />
                  </td>
                  <td style={{ padding: '6px 8px' }}>
                    <input
                      type="number"
                      min="0"
                      value={row.amount}
                      onChange={e => updateRow(idx, 'amount', e.target.value)}
                      placeholder="0"
                      style={{
                        width: '100%',
                        padding: '6px 10px',
                        borderRadius: 6,
                        border: '1.5px solid #e2e8f0',
                        fontSize: 13,
                      }}
                    />
                  </td>
                  <td style={{ padding: '6px 8px' }}>
                    <select
                      value={row.category}
                      onChange={e => updateRow(idx, 'category', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '6px 10px',
                        borderRadius: 6,
                        border: '1.5px solid #e2e8f0',
                        fontSize: 13,
                        background: '#fff',
                      }}
                    >
                      <option value="">— select —</option>
                      {ASSETS.map(a => (
                        <option key={a.name} value={a.name}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '6px 4px', textAlign: 'center' }}>
                    {rows.length > 1 && (
                      <button
                        onClick={() => removeRow(idx)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: 16,
                          lineHeight: 1,
                          padding: 4,
                        }}
                        title="Remove row"
                      >
                        ×
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={addRow}
          style={{
            marginTop: 10,
            padding: '6px 16px',
            fontSize: 13,
            borderRadius: 6,
            border: '1.5px dashed #cbd5e1',
            background: '#f8fafc',
            color: '#475569',
            cursor: 'pointer',
          }}
        >
          + Add row
        </button>

        {totalUserAmt > 0 && (
          <div
            style={{
              marginTop: 12,
              padding: '10px 14px',
              background: '#f0fdf4',
              borderRadius: 8,
              fontSize: 13,
              display: 'flex',
              gap: 24,
              flexWrap: 'wrap',
            }}
          >
            <span>
              Total invested:{' '}
              <strong style={{ color: '#15803d' }}>{fmt(totalUserAmt, currency)}</strong>
            </span>
            <span>
              Weighted CAGR:{' '}
              <strong style={{ color: '#15803d' }}>{userCagr.toFixed(1)}% p.a.</strong>
            </span>
          </div>
        )}
      </div>

      {/* Comparison Chart */}
      {totalUserAmt > 0 && (
        <div style={sectionStyle}>
          <div style={sectionHeading}>Allocation Comparison</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={comparisonData} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, whiteSpace: 'pre' }}
                interval={0}
                angle={-25}
                textAnchor="end"
              />
              <YAxis tick={LABEL_SX} unit="%" />
              <Tooltip formatter={(v, n) => [`${v}%`, n]} contentStyle={{ fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Shan's Target" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Your Allocation" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          {/* Forward projection comparison */}
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 12 }}>
              {projYears}-Year Projection Comparison
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div
                style={{
                  flex: 1,
                  minWidth: 160,
                  background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                  borderRadius: 10,
                  padding: '14px 18px',
                }}
              >
                <div style={{ fontSize: 11, color: '#475569', marginBottom: 4 }}>
                  Your portfolio in {projYears} yrs
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e293b' }}>
                  {fmt(userProjected, currency)}
                </div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                  CAGR ~{userCagr.toFixed(1)}% p.a.
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  minWidth: 160,
                  background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                  borderRadius: 10,
                  padding: '14px 18px',
                }}
              >
                <div style={{ fontSize: 11, color: '#475569', marginBottom: 4 }}>
                  Shan&apos;s portfolio ({fmt(totalUserAmt, currency)} invested) in {projYears} yrs
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#15803d' }}>
                  {fmt(totalUserAmt * Math.pow(1 + shansCagr / 100, projYears), currency)}
                </div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                  CAGR ~{shansCagr.toFixed(1)}% p.a.
                </div>
              </div>
              {userProjected !== null && (
                <div
                  style={{
                    flex: 1,
                    minWidth: 160,
                    background:
                      totalUserAmt * Math.pow(1 + shansCagr / 100, projYears) > userProjected
                        ? 'linear-gradient(135deg, #fff7ed, #fed7aa)'
                        : 'linear-gradient(135deg, #f0fdf4, #bbf7d0)',
                    borderRadius: 10,
                    padding: '14px 18px',
                  }}
                >
                  <div style={{ fontSize: 11, color: '#475569', marginBottom: 4 }}>
                    Difference (Shan&apos;s − yours)
                  </div>
                  <div
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      color:
                        totalUserAmt * Math.pow(1 + shansCagr / 100, projYears) > userProjected
                          ? '#c2410c'
                          : '#15803d',
                    }}
                  >
                    {fmt(
                      Math.abs(
                        totalUserAmt * Math.pow(1 + shansCagr / 100, projYears) - userProjected
                      ),
                      currency
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                    {totalUserAmt * Math.pow(1 + shansCagr / 100, projYears) > userProjected
                      ? 'You could gain more by rebalancing'
                      : 'Your portfolio outperforms the model'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center' }}>
        All projections use historical CAGR averages and are for illustrative purposes only. Consult
        a SEBI-registered advisor before making investment decisions.
      </p>
    </div>
  );
}
