import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Badge, Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useAuth } from 'src/hooks/useAuth';
import {
  MARKETS,
  CURRENCIES,
  NOTE_KINDS,
  marketLabel,
  getMyAlias,
  ensureMyAlias,
  subscribeTrades,
  createTrade,
  updateTrade,
  deleteTrade,
  subscribeNotes,
  getNotes,
  addNote,
  deleteNote,
  getMyVotes,
  vote,
  tradeItem,
  noteItem,
  getFollows,
  setFollows,
  cleanUrl,
} from 'src/services/stocks/tradeJournal';

const today = () => new Date().toISOString().slice(0, 10);

function money(amount, currency) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: amount >= 1000 ? 0 : 2,
    }).format(amount);
  } catch (err) {
    // Not an ISO currency (e.g. USDT, BTC).
    return `${amount.toLocaleString(undefined, { maximumFractionDigits: 8 })} ${currency}`;
  }
}

const fmtDate = d =>
  d
    ? new Date(`${d}T00:00:00`).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';
const fmtTs = ts =>
  ts?.toDate
    ? ts.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : 'just now';

// ---------------------------------------------------------------- voting

function Votes({ up = 0, down = 0, mine, disabled, onVote }) {
  const score = up - down;
  return (
    <span className="tj-votes" title={`${up} up · ${down} down`}>
      <button
        type="button"
        className={`tj-vote${mine === 1 ? ' on-up' : ''}`}
        onClick={() => onVote(mine === 1 ? 0 : 1)}
        disabled={disabled}
        aria-label="Upvote"
      >
        <i className="bi bi-caret-up-fill" />
      </button>
      <span className={`tj-score${score > 0 ? ' pos' : score < 0 ? ' neg' : ''}`}>{score}</span>
      <button
        type="button"
        className={`tj-vote${mine === -1 ? ' on-down' : ''}`}
        onClick={() => onVote(mine === -1 ? 0 : -1)}
        disabled={disabled}
        aria-label="Downvote"
      >
        <i className="bi bi-caret-down-fill" />
      </button>
    </span>
  );
}

Votes.propTypes = {
  up: PropTypes.number,
  down: PropTypes.number,
  mine: PropTypes.number,
  disabled: PropTypes.bool,
  onVote: PropTypes.func.isRequired,
};

// ---------------------------------------------------------------- trade form

const EMPTY = {
  market: 'US',
  ticker: '',
  companyName: '',
  side: 'buy',
  price: '',
  currency: 'USD',
  quantity: '',
  tradeDate: '',
  description: '',
  sourceUrl: '',
};

function TradeForm({ show, trade, onClose, onSave }) {
  const [f, setF] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!show) return;
    setError('');
    setF(
      trade
        ? {
            market: trade.market,
            ticker: trade.ticker,
            companyName: trade.companyName || '',
            side: trade.side,
            price: String(trade.price),
            currency: trade.currency,
            quantity: String(trade.quantity),
            tradeDate: trade.tradeDate,
            description: trade.description || '',
            sourceUrl: trade.sourceUrl || '',
          }
        : { ...EMPTY, tradeDate: today() }
    );
  }, [show, trade]);

  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  const setMarket = e => {
    const m = MARKETS.find(x => x.id === e.target.value);
    setF(p => ({ ...p, market: m.id, currency: m.currency || p.currency }));
  };

  const submit = async e => {
    e.preventDefault();
    if (!f.ticker.trim()) return setError('Enter the ticker.');
    if (!(Number(f.price) > 0)) return setError('Enter the price per share.');
    if (!(Number(f.quantity) > 0)) return setError('Enter the quantity.');
    if (!/^[A-Za-z]{3,5}$/.test(f.currency.trim()))
      return setError('Enter a currency code like USD.');
    if (f.sourceUrl.trim() && !cleanUrl(f.sourceUrl))
      return setError('The source must be a web link, e.g. https://example.com/article.');
    setSaving(true);
    setError('');
    try {
      await onSave(f);
      onClose();
    } catch (err) {
      setError(
        err?.code === 'permission-denied'
          ? 'You do not have permission.'
          : err?.message || 'Could not save.'
      );
    } finally {
      setSaving(false);
    }
    return undefined;
  };

  const total = Number(f.price) * Number(f.quantity);
  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Form onSubmit={submit}>
        <Modal.Header closeButton>
          <Modal.Title className="h5">{trade ? 'Edit trade' : 'Log a trade'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="tj-side-toggle mb-3" role="group" aria-label="Buy or sell">
            {['buy', 'sell'].map(s => (
              <button
                key={s}
                type="button"
                className={`btn ${f.side === s ? (s === 'buy' ? 'btn-success' : 'btn-danger') : 'btn-outline-secondary'}`}
                onClick={() => setF(p => ({ ...p, side: s }))}
              >
                {s === 'buy' ? 'Bought' : 'Sold'}
              </button>
            ))}
          </div>
          <Row className="g-3">
            <Col md={6}>
              <Form.Label className="fw-semibold">Market</Form.Label>
              <Form.Select value={f.market} onChange={setMarket}>
                {MARKETS.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3} xs={6}>
              <Form.Label className="fw-semibold">Ticker</Form.Label>
              <Form.Control
                value={f.ticker}
                onChange={set('ticker')}
                placeholder="AAPL, RELIANCE…"
                maxLength={20}
                style={{ textTransform: 'uppercase' }}
              />
            </Col>
            <Col md={3} xs={6}>
              <Form.Label className="fw-semibold">Trade date</Form.Label>
              <Form.Control
                type="date"
                value={f.tradeDate}
                onChange={set('tradeDate')}
                max={today()}
              />
            </Col>
            <Col md={6}>
              <Form.Label className="fw-semibold">
                Company <span className="text-muted fw-normal">(optional)</span>
              </Form.Label>
              <Form.Control value={f.companyName} onChange={set('companyName')} maxLength={100} />
            </Col>
            <Col md={2} xs={4}>
              <Form.Label className="fw-semibold">Currency</Form.Label>
              <Form.Control
                value={f.currency}
                onChange={set('currency')}
                list="tj-currencies"
                maxLength={5}
                style={{ textTransform: 'uppercase' }}
              />
              <datalist id="tj-currencies">
                {CURRENCIES.map(c => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Col>
            <Col md={2} xs={4}>
              <Form.Label className="fw-semibold">Price</Form.Label>
              <Form.Control
                type="number"
                step="any"
                min="0"
                value={f.price}
                onChange={set('price')}
              />
            </Col>
            <Col md={2} xs={4}>
              <Form.Label className="fw-semibold">Quantity</Form.Label>
              <Form.Control
                type="number"
                step="any"
                min="0"
                value={f.quantity}
                onChange={set('quantity')}
              />
            </Col>
            <Col xs={12}>
              <Form.Label className="fw-semibold">Why this trade?</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={f.description}
                onChange={set('description')}
                maxLength={4000}
                placeholder="Thesis, key points, target, risks…"
              />
            </Col>
            <Col xs={12}>
              <Form.Label className="fw-semibold">
                Source URL <span className="text-muted fw-normal">(optional)</span>
              </Form.Label>
              <Form.Control
                type="text"
                inputMode="url"
                aria-label="Source URL"
                value={f.sourceUrl}
                onChange={set('sourceUrl')}
                maxLength={500}
                placeholder="https://… — article, filing or report you're quoting"
              />
            </Col>
          </Row>
          {total > 0 && f.currency && (
            <div className="small text-muted mt-2">
              Total: {money(total, f.currency.toUpperCase())}
            </div>
          )}
          {error && <div className="alert alert-danger py-2 mt-3 mb-0">{error}</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : trade ? 'Save' : 'Post trade'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

TradeForm.propTypes = {
  show: PropTypes.bool.isRequired,
  trade: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

// ---------------------------------------------------------------- timeline

function Timeline({ trade, isOwner, me, myVotes, onVote }) {
  const [notes, setNotes] = useState(null);
  const [kind, setKind] = useState('holding');
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => subscribeNotes(trade.id, setNotes), [trade.id]);

  const add = async e => {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    try {
      await addNote(trade.id, me, { kind, text });
      setText('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="tj-timeline">
      <div className="tj-tl-item tj-tl-origin">
        <span className="tj-tl-dot" />
        <div className="small text-muted">
          {fmtDate(trade.tradeDate)} · {trade.side === 'buy' ? 'Bought' : 'Sold'}
        </div>
        <div className="tj-text">
          {trade.description || <em className="text-muted">No description.</em>}
        </div>
      </div>
      {notes === null ? (
        <div className="small text-muted ps-4">Loading…</div>
      ) : (
        notes.map(n => {
          const k = NOTE_KINDS[n.kind] || NOTE_KINDS.update;
          return (
            <div className="tj-tl-item" key={n.id}>
              <span className={`tj-tl-dot bg-${k.color}`} />
              <div className="d-flex justify-content-between align-items-start gap-2">
                <div>
                  <Badge bg={k.color} className="me-2">
                    {k.label}
                  </Badge>
                  <span className="small text-muted">{fmtTs(n.createdAt)}</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Votes
                    up={n.up}
                    down={n.down}
                    mine={myVotes[noteItem(trade.id, n.id)]}
                    disabled={isOwner}
                    onVote={v => onVote({ tradeId: trade.id, noteId: n.id }, v)}
                  />
                  {isOwner && (
                    <button
                      type="button"
                      className="btn btn-link btn-sm p-0 text-danger"
                      onClick={() =>
                        window.confirm('Delete this note?') && deleteNote(trade.id, n.id)
                      }
                      aria-label="Delete note"
                    >
                      <i className="bi bi-trash" />
                    </button>
                  )}
                </div>
              </div>
              <div className="tj-text">{n.text}</div>
            </div>
          );
        })
      )}
      {isOwner && (
        <Form onSubmit={add} className="tj-note-form">
          <Form.Select
            size="sm"
            value={kind}
            onChange={e => setKind(e.target.value)}
            aria-label="Note type"
          >
            {Object.entries(NOTE_KINDS).map(([id, k]) => (
              <option key={id} value={id}>
                {k.label}
              </option>
            ))}
          </Form.Select>
          <Form.Control
            size="sm"
            as="textarea"
            rows={2}
            value={text}
            onChange={e => setText(e.target.value)}
            maxLength={2000}
            placeholder="Why are you still holding? What changed? A pro or a risk you see…"
          />
          <Button size="sm" type="submit" disabled={busy || !text.trim()}>
            Add to timeline
          </Button>
        </Form>
      )}
    </div>
  );
}

Timeline.propTypes = {
  trade: PropTypes.object.isRequired,
  isOwner: PropTypes.bool,
  me: PropTypes.object,
  myVotes: PropTypes.object.isRequired,
  onVote: PropTypes.func.isRequired,
};

// ---------------------------------------------------------------- ticker summary

function TickerSummary({ ticker, trades }) {
  const [notes, setNotes] = useState(null);
  useEffect(() => {
    let cancelled = false;
    Promise.all(trades.map(t => getNotes(t.id).then(ns => ns.map(n => ({ ...n, trade: t })))))
      .then(all => !cancelled && setNotes(all.flat()))
      .catch(() => !cancelled && setNotes([]));
    return () => {
      cancelled = true;
    };
  }, [trades]);

  const buys = trades.filter(t => t.side === 'buy');
  const sells = trades.filter(t => t.side === 'sell');
  const avgBy = list => {
    const by = {};
    list.forEach(t => {
      const b = by[t.currency] || { cost: 0, qty: 0 };
      b.cost += t.price * t.quantity;
      b.qty += t.quantity;
      by[t.currency] = b;
    });
    return Object.entries(by).map(([c, b]) => money(b.cost / b.qty, c));
  };
  const ranked = k =>
    (notes || [])
      .filter(n => n.kind === k)
      .sort((a, b) => b.up - b.down - (a.up - a.down))
      .slice(0, 6);
  const authors = new Set(trades.map(t => t.aliasId)).size;

  return (
    <div className="tj-summary">
      <div className="d-flex flex-wrap justify-content-between gap-2 mb-2">
        <h5 className="mb-0">{ticker}</h5>
        <span className="small text-muted">
          {trades.length} trade{trades.length === 1 ? '' : 's'} by {authors} trader
          {authors === 1 ? '' : 's'}
        </span>
      </div>
      <div className="d-flex flex-wrap gap-3 small mb-3">
        <span>
          <Badge bg="success">{buys.length} buys</Badge>
          {buys.length > 0 && (
            <span className="ms-1 text-muted">avg {avgBy(buys).join(' · ')}</span>
          )}
        </span>
        <span>
          <Badge bg="danger">{sells.length} sells</Badge>
          {sells.length > 0 && (
            <span className="ms-1 text-muted">avg {avgBy(sells).join(' · ')}</span>
          )}
        </span>
      </div>
      {notes === null ? (
        <div className="small text-muted">Loading pros & cons…</div>
      ) : (
        <Row className="g-3">
          {[
            ['pro', 'Pros', 'success'],
            ['con', 'Cons & risks', 'danger'],
          ].map(([k, title, color]) => (
            <Col md={6} key={k}>
              <div className={`fw-semibold text-${color} mb-1`}>{title}</div>
              {ranked(k).length === 0 ? (
                <div className="small text-muted">None yet.</div>
              ) : (
                <ul className="tj-proscons">
                  {ranked(k).map(n => (
                    <li key={n.id}>
                      <span className="tj-pc-score">{n.up - n.down}</span>
                      <span>
                        {n.text}
                        <span className="small text-muted"> — {n.alias}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

TickerSummary.propTypes = {
  ticker: PropTypes.string.isRequired,
  trades: PropTypes.array.isRequired,
};

// ---------------------------------------------------------------- main

export default function TradeJournal() {
  const { user } = useAuth();
  const [trades, setTrades] = useState(null);
  const [error, setError] = useState('');
  const [me, setMe] = useState(null);
  const [myVotes, setMyVotes] = useState({});
  const [follows, setFollowsState] = useState([]);
  const [scope, setScope] = useState('all');
  const [tickerQ, setTickerQ] = useState('');
  const [side, setSide] = useState('');
  const [market, setMarket] = useState('');
  const [sort, setSort] = useState('new');
  const [aliasFilter, setAliasFilter] = useState(null); // { aliasId, alias }
  const [form, setForm] = useState({ show: false, trade: null });
  const [open, setOpen] = useState(() => new Set());

  useEffect(() => subscribeTrades(setTrades, setError), []);
  useEffect(() => {
    if (!user) return;
    getMyAlias(user.uid)
      .then(setMe)
      .catch(() => {});
    getMyVotes(user.uid)
      .then(setMyVotes)
      .catch(() => {});
    getFollows(user.uid)
      .then(setFollowsState)
      .catch(() => {});
  }, [user]);

  const isMine = t => !!me && t.aliasId === me.aliasId;

  const onVote = useCallback(
    async (target, value) => {
      if (!user) return;
      const key = target.noteId
        ? noteItem(target.tradeId, target.noteId)
        : tradeItem(target.tradeId);
      const prev = myVotes[key];
      setMyVotes(v => ({ ...v, [key]: value || undefined }));
      try {
        await vote(user.uid, target, value);
      } catch (err) {
        setMyVotes(v => ({ ...v, [key]: prev }));
        setError(err?.message || 'Could not record your vote.');
      }
    },
    [user, myVotes]
  );

  const toggleFollow = async aliasId => {
    const next = follows.includes(aliasId)
      ? follows.filter(a => a !== aliasId)
      : [...follows, aliasId];
    setFollowsState(next);
    try {
      await setFollows(user.uid, next);
    } catch (err) {
      setError('Could not update who you follow.');
    }
  };

  const save = async f => {
    if (form.trade) {
      await updateTrade(form.trade.id, f);
      return;
    }
    const alias = me || (await ensureMyAlias(user.uid));
    setMe(alias);
    await createTrade(user.uid, alias, f);
  };

  const remove = async t => {
    if (!window.confirm(`Delete your ${t.side} of ${t.ticker} and its timeline?`)) return;
    try {
      await deleteTrade(t.id);
    } catch (err) {
      setError('Could not delete the trade.');
    }
  };

  const toggleOpen = id =>
    setOpen(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const shown = useMemo(() => {
    const q = tickerQ.trim().toLowerCase();
    return (trades || [])
      .filter(t => {
        if (scope === 'mine' && !isMine(t)) return false;
        if (scope === 'following' && !follows.includes(t.aliasId)) return false;
        if (aliasFilter && t.aliasId !== aliasFilter.aliasId) return false;
        if (side && t.side !== side) return false;
        if (market && t.market !== market) return false;
        if (
          q &&
          !t.ticker.toLowerCase().includes(q) &&
          !(t.companyName || '').toLowerCase().includes(q)
        )
          return false;
        return true;
      })
      .sort((a, b) =>
        sort === 'top'
          ? b.up - b.down - (a.up - a.down)
          : (b.createdAt?.seconds || Infinity) - (a.createdAt?.seconds || Infinity)
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trades, scope, follows, aliasFilter, side, market, tickerQ, sort, me]);

  // Exact ticker typed → show what everyone thinks about it.
  const exactTicker = useMemo(() => {
    const q = tickerQ.trim().toUpperCase();
    if (!q) return null;
    const list = (trades || []).filter(t => t.ticker === q);
    return list.length ? { ticker: q, list } : null;
  }, [tickerQ, trades]);

  const aliasStats = useMemo(() => {
    if (!aliasFilter) return null;
    const list = (trades || []).filter(t => t.aliasId === aliasFilter.aliasId);
    return { count: list.length, score: list.reduce((s, t) => s + (t.up || 0) - (t.down || 0), 0) };
  }, [aliasFilter, trades]);

  return (
    <div className="tj-wrap">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div className="small text-muted">
          {me ? (
            <>
              You post as <strong className="text-body">{me.alias}</strong>. Others never see your
              name.
            </>
          ) : (
            'You get an anonymous alias with your first post — others never see your name.'
          )}
        </div>
        <Button onClick={() => setForm({ show: true, trade: null })} disabled={!user}>
          <i className="bi bi-plus-lg me-1" />
          Log a trade
        </Button>
      </div>

      <div className="tj-filters">
        <div className="tj-seg" role="group" aria-label="Whose trades">
          {[
            ['all', 'Everyone'],
            ['mine', 'My trades'],
            ['following', `Following (${follows.length})`],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`tj-seg-btn${scope === id ? ' on' : ''}`}
              aria-pressed={scope === id}
              onClick={() => setScope(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <Form.Control
          size="sm"
          placeholder="Ticker or company"
          value={tickerQ}
          onChange={e => setTickerQ(e.target.value)}
          style={{ maxWidth: 200 }}
        />
        <Form.Select
          size="sm"
          value={side}
          onChange={e => setSide(e.target.value)}
          style={{ maxWidth: 120 }}
        >
          <option value="">Buy & sell</option>
          <option value="buy">Buys</option>
          <option value="sell">Sells</option>
        </Form.Select>
        <Form.Select
          size="sm"
          value={market}
          onChange={e => setMarket(e.target.value)}
          style={{ maxWidth: 220 }}
        >
          <option value="">All markets</option>
          {MARKETS.map(m => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </Form.Select>
        <Form.Select
          size="sm"
          value={sort}
          onChange={e => setSort(e.target.value)}
          style={{ maxWidth: 140 }}
        >
          <option value="new">Newest</option>
          <option value="top">Top voted</option>
        </Form.Select>
      </div>

      {error && (
        <div className="alert alert-warning py-2 small" role="alert">
          {String(error)}
        </div>
      )}

      {aliasFilter && (
        <div className="tj-alias-head">
          <div>
            <i className="bi bi-person-circle me-2" />
            <strong>{aliasFilter.alias}</strong>
            <span className="small text-muted ms-2">
              {aliasStats.count} trade{aliasStats.count === 1 ? '' : 's'} · score {aliasStats.score}
            </span>
          </div>
          <div className="d-flex gap-2">
            {(!me || me.aliasId !== aliasFilter.aliasId) && (
              <Button
                size="sm"
                variant={follows.includes(aliasFilter.aliasId) ? 'primary' : 'outline-primary'}
                onClick={() => toggleFollow(aliasFilter.aliasId)}
              >
                {follows.includes(aliasFilter.aliasId) ? 'Following' : 'Follow'}
              </Button>
            )}
            <Button size="sm" variant="light" onClick={() => setAliasFilter(null)}>
              Show everyone
            </Button>
          </div>
        </div>
      )}

      {exactTicker && <TickerSummary ticker={exactTicker.ticker} trades={exactTicker.list} />}

      {trades === null ? (
        <div className="text-muted py-4">Loading trades…</div>
      ) : shown.length === 0 ? (
        <div className="tj-empty">
          {trades.length === 0
            ? 'No trades yet. Log the first one — what did you buy or sell, and why?'
            : 'No trades match these filters.'}
        </div>
      ) : (
        shown.map(t => {
          const mine = isMine(t);
          const total = t.price * t.quantity;
          return (
            <div key={t.id} className={`tj-card${mine ? ' mine' : ''}`}>
              <div className="tj-card-head">
                <div>
                  <span className={`tj-side ${t.side}`}>{t.side === 'buy' ? 'BUY' : 'SELL'}</span>
                  <button
                    type="button"
                    className="tj-ticker btn btn-link p-0"
                    onClick={() => setTickerQ(t.ticker)}
                    title={`See everyone's ${t.ticker} trades`}
                  >
                    {t.ticker}
                  </button>
                  {t.companyName && <span className="text-muted ms-2">{t.companyName}</span>}
                  <div className="small text-muted">{marketLabel(t.market)}</div>
                </div>
                <Votes
                  up={t.up}
                  down={t.down}
                  mine={myVotes[tradeItem(t.id)]}
                  disabled={mine || !user}
                  onVote={v => onVote({ tradeId: t.id }, v)}
                />
              </div>
              <div className="tj-figures">
                <span>
                  {t.quantity.toLocaleString()} × {money(t.price, t.currency)}
                </span>
                <span className="fw-semibold">= {money(total, t.currency)}</span>
                <span className="text-muted">{fmtDate(t.tradeDate)}</span>
              </div>
              {t.description && <div className="tj-text">{t.description}</div>}
              {cleanUrl(t.sourceUrl) && (
                <div className="tj-source">
                  <i className="bi bi-link-45deg me-1" />
                  Source:{' '}
                  <a
                    href={cleanUrl(t.sourceUrl)}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                  >
                    {new URL(cleanUrl(t.sourceUrl)).hostname.replace(/^www\./, '')}
                  </a>
                </div>
              )}
              <div className="tj-card-foot">
                <span className="small">
                  by{' '}
                  <button
                    type="button"
                    className="btn btn-link btn-sm p-0 align-baseline"
                    onClick={() => setAliasFilter({ aliasId: t.aliasId, alias: t.alias })}
                  >
                    {t.alias}
                  </button>
                  {mine && (
                    <Badge bg="light" text="dark" className="ms-1">
                      you
                    </Badge>
                  )}
                  {!mine && follows.includes(t.aliasId) && (
                    <Badge bg="primary" className="ms-1">
                      following
                    </Badge>
                  )}
                </span>
                <span className="d-flex gap-3">
                  <button
                    type="button"
                    className="btn btn-link btn-sm p-0"
                    onClick={() => toggleOpen(t.id)}
                  >
                    <i
                      className={`bi ${open.has(t.id) ? 'bi-chevron-up' : 'bi-clock-history'} me-1`}
                    />
                    {open.has(t.id) ? 'Hide timeline' : mine ? 'Timeline · add update' : 'Timeline'}
                  </button>
                  {mine && (
                    <>
                      <button
                        type="button"
                        className="btn btn-link btn-sm p-0"
                        onClick={() => setForm({ show: true, trade: t })}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-link btn-sm p-0 text-danger"
                        onClick={() => remove(t)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </span>
              </div>
              {open.has(t.id) && (
                <Timeline trade={t} isOwner={mine} me={me} myVotes={myVotes} onVote={onVote} />
              )}
            </div>
          );
        })
      )}

      <TradeForm
        show={form.show}
        trade={form.trade}
        onClose={() => setForm({ show: false, trade: null })}
        onSave={save}
      />
    </div>
  );
}
