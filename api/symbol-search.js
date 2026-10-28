/**
 * GET /api/symbol-search?q=reli — worldwide ticker / company look-up for the
 * Trade Journal. Vercel serverless function proxying Yahoo Finance's public
 * search (no API key). Responses are cached at the edge for a day.
 *
 * → { results: [{ symbol, ticker, name, exchange, market, currency, type }] }
 */

// Yahoo symbol suffix → [market id in src/services/stocks/tradeJournal.js, currency]
const SUFFIX = {
  NS: ['IN', 'INR'], BO: ['IN', 'INR'],
  L: ['GB', 'GBP'], IL: ['GB', 'GBP'],
  TO: ['CA', 'CAD'], V: ['CA', 'CAD'], NE: ['CA', 'CAD'], CN: ['CA', 'CAD'],
  AX: ['AU', 'AUD'],
  PA: ['EU', 'EUR'], DE: ['EU', 'EUR'], F: ['EU', 'EUR'], AS: ['EU', 'EUR'],
  MI: ['EU', 'EUR'], MC: ['EU', 'EUR'], BR: ['EU', 'EUR'], LS: ['EU', 'EUR'],
  HE: ['EU', 'EUR'], VI: ['EU', 'EUR'], IR: ['EU', 'EUR'], MU: ['EU', 'EUR'],
  SG: ['EU', 'EUR'], BE: ['EU', 'EUR'], DU: ['EU', 'EUR'], HM: ['EU', 'EUR'],
  SW: ['CH', 'CHF'],
  T: ['JP', 'JPY'],
  HK: ['HK', 'HKD'],
  SS: ['CN', 'CNY'], SZ: ['CN', 'CNY'],
  SI: ['SG', 'SGD'],
  KS: ['KR', 'KRW'], KQ: ['KR', 'KRW'],
  TW: ['TW', 'TWD'], TWO: ['TW', 'TWD'],
  SA: ['BR', 'BRL'],
  MX: ['MX', 'MXN'],
  JO: ['ZA', 'ZAR'],
  AD: ['AE', 'AED'],
  SR: ['SA', 'SAR'],
};
const TYPES = new Set(['EQUITY', 'ETF', 'MUTUALFUND', 'CRYPTOCURRENCY']);

function toResult(q) {
  const symbol = String(q.symbol || '');
  if (!symbol || !TYPES.has(q.quoteType)) return null;
  const name = q.longname || q.shortname || '';
  if (q.quoteType === 'CRYPTOCURRENCY') {
    const [base, cur] = symbol.split('-');
    return { symbol, ticker: base, name, exchange: 'Crypto', market: 'OTHER', currency: cur || 'USD', type: 'Crypto' };
  }
  const dot = symbol.lastIndexOf('.');
  const suffix = dot > 0 ? symbol.slice(dot + 1).toUpperCase() : '';
  let market = 'US';
  let currency = 'USD';
  let ticker = symbol;
  if (suffix) {
    const hit = SUFFIX[suffix];
    if (!hit) return null; // an exchange the journal has no market for
    [market, currency] = hit;
    ticker = symbol.slice(0, dot);
  }
  return {
    symbol,
    ticker: ticker.toUpperCase().slice(0, 20),
    name: name.slice(0, 100),
    exchange: q.exchDisp || q.exchange || '',
    market,
    currency,
    type: q.typeDisp || q.quoteType,
  };
}

module.exports = async function handler(req, res) {
  const q = String((req.query && req.query.q) || '').trim().slice(0, 40);
  if (!q) return res.status(200).json({ results: [] });
  try {
    const url =
      'https://query2.finance.yahoo.com/v1/finance/search?quotesCount=12&newsCount=0' +
      '&listsCount=0&enableFuzzyQuery=false&q=' + encodeURIComponent(q);
    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AnddhenTradeJournal/1.0)' },
      signal: AbortSignal.timeout(6000),
    });
    if (!r.ok) throw new Error(`upstream ${r.status}`);
    const data = await r.json();
    const results = (data.quotes || []).map(toResult).filter(Boolean).slice(0, 10);
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
    return res.status(200).json({ results });
  } catch (e) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(502).json({ results: [], error: 'Symbol search is unavailable right now.' });
  }
};

module.exports.toResult = toResult;
