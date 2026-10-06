import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Badge, Col, Form, Pagination, Row, Tab, Table, Tabs } from 'react-bootstrap';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  CATEGORIES,
  assignableCategories,
  isRecategorizable,
} from 'src/services/finance/categorize';

const COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ef4444',
  '#06b6d4',
  '#ec4899',
  '#84cc16',
  '#f97316',
  '#6366f1',
  '#14b8a6',
  '#64748b',
  '#a855f7',
  '#eab308',
  '#22c55e',
  '#0ea5e9',
  '#f43f5e',
  '#78716c',
  '#d946ef',
  '#0d9488',
];
const colorAt = i => COLORS[i % COLORS.length];

const usd = n =>
  `${n < 0 ? '-' : ''}$${Math.abs(n).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
const usd0 = n => `$${Math.round(n).toLocaleString('en-US')}`;
const fmtDate = d =>
  d
    ? new Date(`${d}T00:00:00`).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';
const fmtMonth = m =>
  new Date(`${m}-01T00:00:00`).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

const KIND_LABELS = {
  purchase: 'Purchase',
  refund: 'Refund',
  payment: 'Card payment',
  card_payment: 'Card payment',
  fee: 'Fee',
  interest: 'Interest',
  cash: 'Cash',
  transfer: 'Transfer',
  income: 'Income',
  deposit: 'Deposit',
  reward: 'Reward',
  adjustment: 'Balance refund',
};

function Stat({ label, value, sub, tone }) {
  return (
    <div className={`fin-stat${tone ? ` fin-stat-${tone}` : ''}`}>
      <div className="fin-stat-label">{label}</div>
      <div className="fin-stat-value">{value}</div>
      {sub && <div className="fin-stat-sub">{sub}</div>}
    </div>
  );
}

Stat.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
  sub: PropTypes.node,
  tone: PropTypes.string,
};

function Overview({ analysis }) {
  const { totals, byCategory, byMerchant, monthly, accountNames } = analysis;
  // Every category gets its own slice — no "everything else" lumping.
  const pie = byCategory;

  return (
    <>
      <div className="fin-stats">
        <Stat
          label="Total spend"
          value={usd(totals.spend)}
          sub="purchases, fees & interest, net of refunds"
        />
        {(totals.payments > 0 || analysis.accounts.some(a => a.accountType === 'credit')) && (
          <Stat label="Payments & credits" value={usd(totals.payments)} sub="paid toward cards" />
        )}
        <Stat
          label="Interest & fees"
          value={usd(totals.interestAndFees)}
          tone={totals.interestAndFees > 0 ? 'bad' : 'good'}
          sub={totals.interestAndFees > 0 ? 'avoidable costs' : 'none — nice'}
        />
        {totals.income > 0 && (
          <Stat label="Income & deposits" value={usd(totals.income)} sub="checking accounts" />
        )}
        {(totals.transfersOut > 0 || totals.transfersIn > 0) && (
          <Stat
            label="Transfers (Zelle etc.)"
            value={usd(totals.transfersOut)}
            sub={`sent · ${usd(totals.transfersIn)} received`}
          />
        )}
        {totals.rewards > 0 && (
          <Stat
            label="Rewards earned"
            value={usd(totals.rewards)}
            sub="cash back & points redeemed"
            tone="good"
          />
        )}
        {totals.cardPayments > 0 && (
          <Stat
            label="Card bills paid"
            value={usd(totals.cardPayments)}
            sub="from checking — not counted as spend"
          />
        )}
        <Stat
          label="Transactions"
          value={totals.count.toLocaleString()}
          sub={`${fmtDate(totals.from)} – ${fmtDate(totals.to)}`}
        />
      </div>

      <Row className="g-4 mt-1">
        <Col lg={6}>
          <h6 className="fin-h">Spending by category</h6>
          {pie.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pie}
                  dataKey="total"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={110}
                  paddingAngle={1}
                >
                  {pie.map((c, i) => (
                    <Cell key={c.name} fill={COLORS[i % COLORS.length]} stroke="#fff" />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [usd(v), n]} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted">No spending found.</p>
          )}
        </Col>
        <Col lg={6}>
          <h6 className="fin-h">Category totals</h6>
          <Table size="sm" className="fin-table">
            <tbody>
              {byCategory.map((c, i) => (
                <tr key={c.name}>
                  <td>
                    <span className="fin-dot" style={{ background: colorAt(i) }} />
                    {c.name}
                  </td>
                  <td className="text-muted text-end">{c.count}×</td>
                  <td className="text-end fw-semibold">{usd(c.total)}</td>
                  <td className="text-end text-muted" style={{ width: 60 }}>
                    {totals.spend > 0 ? `${Math.round((c.total / totals.spend) * 100)}%` : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {monthly.length > 0 && (
        <>
          <h6 className="fin-h mt-4">Monthly spend by account</h6>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthly} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
              <XAxis dataKey="month" tickFormatter={fmtMonth} tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={usd0} tick={{ fontSize: 12 }} width={70} />
              <Tooltip formatter={(v, n) => [usd(v), n]} labelFormatter={fmtMonth} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {accountNames.map((a, i) => (
                <Bar key={a} dataKey={a} stackId="spend" fill={COLORS[i % COLORS.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </>
      )}

      <h6 className="fin-h mt-4">Top merchants</h6>
      <Table size="sm" className="fin-table" responsive>
        <thead>
          <tr>
            <th>Merchant</th>
            <th className="text-end">Purchases</th>
            <th className="text-end">Total</th>
          </tr>
        </thead>
        <tbody>
          {byMerchant.map(m => (
            <tr key={m.name}>
              <td>{m.name}</td>
              <td className="text-end text-muted">{m.count}</td>
              <td className="text-end fw-semibold">{usd(m.total)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

Overview.propTypes = { analysis: PropTypes.object.isRequired };

const SOURCE_NOTE = {
  guess: 'best guess',
  merchant: 'merchant name',
  user: 'your choice',
  'user-rule': 'your rule',
};

function Accounts({ analysis }) {
  const { accounts } = analysis;
  const maxSpend = Math.max(1, ...accounts.map(a => a.spend));
  return (
    <>
      <Table className="fin-table" responsive hover>
        <thead>
          <tr>
            <th>Account</th>
            <th>Period</th>
            <th className="text-end">Spend</th>
            <th className="text-end">Payments in</th>
            <th className="text-end">Interest</th>
            <th className="text-end">Fees</th>
            <th>Top category</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((a, i) => (
            <tr key={a.account}>
              <td>
                <span className="fin-dot" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="fw-semibold">{a.account}</span>
                <div className="small text-muted">
                  {a.accountType === 'debit' ? 'Checking / debit' : 'Credit card'} · {a.statements}{' '}
                  statement{a.statements > 1 ? 's' : ''} · {a.count} rows
                </div>
                <div className="fin-bar">
                  <span
                    style={{
                      width: `${Math.max(2, (a.spend / maxSpend) * 100)}%`,
                      background: COLORS[i % COLORS.length],
                    }}
                  />
                </div>
              </td>
              <td className="small text-nowrap">
                {fmtDate(a.from)}
                <br />
                {fmtDate(a.to)}
              </td>
              <td className="text-end fw-semibold">{usd(a.spend)}</td>
              <td className="text-end">
                {a.accountType === 'debit' ? usd(a.income) : usd(a.paymentsIn)}
              </td>
              <td className={`text-end${a.interest > 0 ? ' text-danger fw-semibold' : ''}`}>
                {usd(a.interest)}
              </td>
              <td className={`text-end${a.fees > 0 ? ' text-danger fw-semibold' : ''}`}>
                {usd(a.fees)}
              </td>
              <td>{a.topCategory}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <p className="small text-muted mb-0">
        Card payments made from a checking account are not counted as spending, so uploading a
        checking statement together with the cards it pays never double counts.
      </p>
    </>
  );
}

Accounts.propTypes = { analysis: PropTypes.object.isRequired };

function Insights({ analysis }) {
  const { insights, recurring, duplicates, spikes } = analysis;
  return (
    <>
      {insights.length === 0 && (
        <Alert variant="success">No interest, fees, duplicates or unusual charges found.</Alert>
      )}
      {insights.map(i => (
        <Alert key={i.title} variant={i.level}>
          <div className="fw-semibold">{i.title}</div>
          <div className="small">{i.detail}</div>
        </Alert>
      ))}

      {recurring.length > 0 && (
        <>
          <h6 className="fin-h mt-4">Recurring charges</h6>
          <Table size="sm" className="fin-table" responsive>
            <thead>
              <tr>
                <th>Merchant</th>
                <th>Category</th>
                <th className="text-end">Each</th>
                <th className="text-end">Months seen</th>
                <th className="text-end">≈ Per year</th>
              </tr>
            </thead>
            <tbody>
              {recurring.map(r => (
                <tr key={r.merchant}>
                  <td>{r.merchant}</td>
                  <td>{r.category}</td>
                  <td className="text-end">{usd(r.amount)}</td>
                  <td className="text-end">{r.months}</td>
                  <td className="text-end fw-semibold">{usd(r.yearly)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {duplicates.length > 0 && (
        <>
          <h6 className="fin-h mt-4">Possible duplicate charges</h6>
          <Table size="sm" className="fin-table" responsive>
            <thead>
              <tr>
                <th>Merchant</th>
                <th>Account</th>
                <th>Dates</th>
                <th className="text-end">Amount</th>
              </tr>
            </thead>
            <tbody>
              {duplicates.map(d => (
                <tr key={`${d.first.date}-${d.first.merchantKey}-${d.first.amount}`}>
                  <td>{d.first.merchant}</td>
                  <td>{d.first.account}</td>
                  <td>
                    {fmtDate(d.first.date)} &amp; {fmtDate(d.second.date)}
                  </td>
                  <td className="text-end">{usd(d.first.amount)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <p className="small text-muted">
            Two identical charges a day apart are sometimes legitimate — check with the merchant
            before disputing.
          </p>
        </>
      )}

      {spikes.length > 0 && (
        <>
          <h6 className="fin-h mt-4">Largest unusual purchases</h6>
          <Table size="sm" className="fin-table" responsive>
            <tbody>
              {spikes.map(t => (
                <tr key={`${t.date}-${t.description}-${t.amount}`}>
                  <td>{fmtDate(t.date)}</td>
                  <td>{t.merchant}</td>
                  <td className="text-muted">{t.account}</td>
                  <td className="text-end fw-semibold">{usd(t.amount)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
}

Insights.propTypes = { analysis: PropTypes.object.isRequired };

function Recommendations({ analysis }) {
  const rec = analysis.recommendations;
  if (!rec) return <p className="text-muted">Not enough purchases to recommend a card.</p>;
  const months = Math.max(1, Math.round(rec.basedOnDays / 30));
  return (
    <>
      <p>
        Based on about {months} month{months > 1 ? 's' : ''} of purchases, you spend roughly{' '}
        <strong>{usd0(rec.annualSpend)}/year</strong> on reward-eligible categories. A basic 1% card
        would earn about {usd0(rec.baseline)}/year.
      </p>
      <Row className="g-3">
        {rec.cards.map((c, i) => (
          <Col md={6} key={c.name}>
            <div className={`fin-reco${i === 0 ? ' best' : ''}`}>
              <div className="d-flex justify-content-between align-items-start gap-2">
                <div>
                  <div className="fw-semibold">{c.name}</div>
                  <div className="small text-muted">
                    {c.issuer} · {c.fee ? `$${c.fee} annual fee` : 'No annual fee'}
                  </div>
                </div>
                {i === 0 && <Badge bg="success">Best fit</Badge>}
              </div>
              <div className="fin-reco-value">
                {usd0(c.net)}
                <span>/yr after fees</span>
              </div>
              <div className="small">
                {c.vsBaseline >= 0 ? '+' : ''}
                {usd0(c.vsBaseline)} vs a 1% card
                {c.bestFor && <> · strongest on {c.bestFor}</>}
              </div>
            </div>
          </Col>
        ))}
      </Row>
      <h6 className="fin-h mt-4">Estimated yearly spend used</h6>
      <Table size="sm" className="fin-table" responsive>
        <tbody>
          {rec.annualByCategory.map(c => (
            <tr key={c.name}>
              <td>{c.name}</td>
              <td className="text-end">{usd0(c.total)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <p className="small text-muted mb-0">
        Estimates use each card&apos;s published earn rates (points valued at 1¢) and your spending
        annualised from the uploaded statements. Rates, caps and fees change — check the
        issuer&apos;s site before applying. This is not financial advice.
      </p>
    </>
  );
}

Recommendations.propTypes = { analysis: PropTypes.object.isRequired };

const PAGE = 25;

function CategoryCell({ t, onCategoryChange, options }) {
  const baseKind = t.originalKind || t.kind;
  if (!isRecategorizable(baseKind, t.description, t.amount) || !onCategoryChange) {
    return (
      <>
        {t.category}
        {t.kind !== 'purchase' && (
          <div className="small text-muted">{KIND_LABELS[t.kind] || t.kind}</div>
        )}
      </>
    );
  }
  const custom = !options.includes(t.category);
  return (
    <>
      <Form.Select
        size="sm"
        value={t.category}
        onChange={e =>
          onCategoryChange(t.merchantKey, e.target.value === '__auto' ? null : e.target.value)
        }
        aria-label={`Category for ${t.merchant}`}
        className={
          t.categorySource === 'guess' || t.categorySource === 'merchant' ? 'fin-cat-unsure' : ''
        }
        style={{ minWidth: 170 }}
      >
        {custom && <option value={t.category}>{t.category}</option>}
        {options.map(c => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
        {t.categorySource === 'user' && <option value="__auto">↺ Automatic</option>}
      </Form.Select>
      <div className="small text-muted">
        {[
          baseKind !== 'purchase' && (KIND_LABELS[baseKind] || baseKind),
          SOURCE_NOTE[t.categorySource],
        ]
          .filter(Boolean)
          .join(' · ')}
      </div>
    </>
  );
}

CategoryCell.propTypes = {
  t: PropTypes.object.isRequired,
  onCategoryChange: PropTypes.func,
  options: PropTypes.array.isRequired,
};

const UNSURE = '__unsure';

function Transactions({
  analysis,
  onCategoryChange,
  signedIn,
  initialCategory,
  customCategories,
  onOpenMapper,
}) {
  const options = useMemo(() => assignableCategories(customCategories), [customCategories]);
  const [q, setQ] = useState('');
  const [account, setAccount] = useState('');
  const [category, setCategory] = useState(initialCategory || '');
  const [kind, setKind] = useState('');
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return analysis.transactions
      .filter(
        t =>
          (!account || t.account === account) &&
          (!category ||
            (category === UNSURE
              ? t.categorySource === 'guess' || t.categorySource === 'merchant'
              : t.category === category)) &&
          (!kind || t.kind === kind) &&
          (!s || t.description.toLowerCase().includes(s) || t.merchant.toLowerCase().includes(s))
      )
      .slice()
      .reverse();
  }, [analysis.transactions, q, account, category, kind]);

  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const current = Math.min(page, pages);
  const shown = rows.slice((current - 1) * PAGE, current * PAGE);
  const usedKinds = [...new Set(analysis.transactions.map(t => t.kind))];
  const present = new Set(analysis.transactions.map(t => t.category));
  const usedCats = [
    ...CATEGORIES.filter(c => present.has(c)),
    ...[...present].filter(c => !CATEGORIES.includes(c)).sort((a, b) => a.localeCompare(b)),
  ];

  const exportCsv = () => {
    const esc = v => `"${String(v).replace(/"/g, '""')}"`;
    const csv = [
      ['Date', 'Account', 'Description', 'Merchant', 'Category', 'Type', 'Amount'].join(','),
      ...rows.map(t =>
        [t.date, t.account, t.description, t.merchant, t.category, KIND_LABELS[t.kind], t.amount]
          .map(esc)
          .join(',')
      ),
    ].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = fn => e => {
    fn(e.target.value);
    setPage(1);
  };

  return (
    <>
      <Row className="g-2 mb-3">
        <Col md={4}>
          <Form.Control placeholder="Search transactions" value={q} onChange={reset(setQ)} />
        </Col>
        <Col md={3} xs={6}>
          <Form.Select value={account} onChange={reset(setAccount)} aria-label="Account">
            <option value="">All accounts</option>
            {analysis.accountNames.map(a => (
              <option key={a}>{a}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3} xs={6}>
          <Form.Select value={category} onChange={reset(setCategory)} aria-label="Category">
            <option value="">All categories</option>
            {analysis.unsure > 0 && (
              <option value={UNSURE}>Needs a check ({analysis.unsure})</option>
            )}
            {usedCats.map(c => (
              <option key={c}>{c}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select value={kind} onChange={reset(setKind)} aria-label="Type">
            <option value="">All types</option>
            {usedKinds.map(k => (
              <option key={k} value={k}>
                {KIND_LABELS[k] || k}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>
      <p className="small text-muted mb-2">
        Change a category and it applies to every transaction from that merchant
        {signedIn
          ? ', and is remembered in your account.'
          : ' (for this visit — sign in to remember it).'}{' '}
        “Best guess” and “merchant name” mean we weren&apos;t sure.
        {onOpenMapper && (
          <>
            {' '}
            For rules and your own categories, open the{' '}
            <button
              type="button"
              className="btn btn-link btn-sm p-0 align-baseline"
              onClick={onOpenMapper}
            >
              category mapper
            </button>
            .
          </>
        )}
      </p>
      <div className="d-flex justify-content-between align-items-center mb-2 small text-muted">
        <span>
          {rows.length} transaction{rows.length === 1 ? '' : 's'}
        </span>
        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={exportCsv}>
          Export CSV
        </button>
      </div>
      <Table size="sm" className="fin-table" responsive hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Account</th>
            <th className="text-end">Amount</th>
          </tr>
        </thead>
        <tbody>
          {shown.map((t, i) => (
            <tr key={`${t.date}-${t.description}-${t.amount}-${i}`}>
              <td className="text-nowrap">{t.date}</td>
              <td>
                <div>{t.merchant}</div>
                <div className="small text-muted">{t.description}</div>
              </td>
              <td>
                <CategoryCell t={t} onCategoryChange={onCategoryChange} options={options} />
              </td>
              <td className="small">{t.account}</td>
              <td className={`text-end fw-semibold ${t.amount < 0 ? 'text-success' : ''}`}>
                {t.amount < 0 ? `+${usd(-t.amount)}` : usd(t.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {pages > 1 && (
        <Pagination size="sm" className="justify-content-center">
          <Pagination.Prev disabled={current === 1} onClick={() => setPage(current - 1)} />
          <Pagination.Item active>
            {current} / {pages}
          </Pagination.Item>
          <Pagination.Next disabled={current === pages} onClick={() => setPage(current + 1)} />
        </Pagination>
      )}
    </>
  );
}

Transactions.propTypes = {
  analysis: PropTypes.object.isRequired,
  onCategoryChange: PropTypes.func,
  onOpenMapper: PropTypes.func,
  customCategories: PropTypes.array,
  signedIn: PropTypes.bool,
  initialCategory: PropTypes.string,
};

export default function FinanceAnalytics({
  analysis,
  onCategoryChange,
  onOpenMapper,
  customCategories,
  signedIn,
}) {
  const [tab, setTab] = useState('overview');
  // Bumped by "Review categories" so the Transactions tab reopens filtered.
  const [review, setReview] = useState(0);
  const flagged = analysis.insights.filter(i => i.level !== 'info').length;
  return (
    <Tabs activeKey={tab} onSelect={k => setTab(k)} className="mb-3 fin-tabs" mountOnEnter>
      <Tab eventKey="overview" title="Overview">
        {analysis.unsure > 0 && (
          <Alert variant="light" className="border small d-flex flex-wrap gap-2 align-items-center">
            <span>
              {analysis.unsure} merchant{analysis.unsure > 1 ? 's were' : ' was'} categorised by a
              best guess or by name.
            </span>
            <button
              type="button"
              className="btn btn-link btn-sm p-0"
              onClick={() => {
                setReview(r => r + 1);
                setTab('transactions');
              }}
            >
              Review categories
            </button>
          </Alert>
        )}
        <Overview analysis={analysis} />
      </Tab>
      <Tab eventKey="accounts" title={`Cards & accounts (${analysis.accounts.length})`}>
        <Accounts analysis={analysis} />
      </Tab>
      <Tab
        eventKey="insights"
        title={
          <>
            Insights{' '}
            {flagged > 0 && (
              <Badge bg="danger" pill>
                {flagged}
              </Badge>
            )}
          </>
        }
      >
        <Insights analysis={analysis} />
      </Tab>
      <Tab eventKey="cards" title="Card recommendations">
        <Recommendations analysis={analysis} />
      </Tab>
      <Tab eventKey="transactions" title="Transactions">
        <Transactions
          key={review}
          initialCategory={review ? UNSURE : ''}
          analysis={analysis}
          customCategories={customCategories || []}
          onOpenMapper={onOpenMapper}
          onCategoryChange={onCategoryChange}
          signedIn={signedIn}
        />
      </Tab>
    </Tabs>
  );
}

FinanceAnalytics.propTypes = {
  analysis: PropTypes.object.isRequired,
  onCategoryChange: PropTypes.func,
  onOpenMapper: PropTypes.func,
  customCategories: PropTypes.array,
  signedIn: PropTypes.bool,
};
