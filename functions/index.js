/**
 * Anddhen Cloud Functions — the compute endpoints that can't be Firestore
 * collections. All are Callable (v2) and require an authenticated caller.
 *
 *   aiSuggestions({ prompt })            -> string   (OpenAI, key stays server-side)
 *   parseResume({ fileBase64, filename })-> string   (pdf/docx text extraction)
 *   getDefaultWords()                    -> object   (config doc in Firestore)
 *   setDefaultWords({ data })            -> { ok }   (admin-only)
 *   searchSymbols({ query })             -> { results }        (Yahoo Finance, NO key)
 *   stockMetrics({ ticker, parameters }) -> { values, sector } (Yahoo Finance, NO key)
 *
 * Deploy: from functions/ run `npm i` then `npm run deploy`.
 * Secret (only for aiSuggestions/parseResume-AI): firebase functions:secrets:set OPENAI_API_KEY
 * Stocks functions need NO API key (Yahoo Finance via yahoo-finance2).
 */
const { onCall, HttpsError } = require('firebase-functions/v2/https');
// v1 API, needed only for the Auth account-deletion trigger at the bottom of
// this file; v2 has no equivalent non-blocking onDelete.
const functionsV1 = require('firebase-functions/v1');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');
const yahooFinance = require('yahoo-finance2').default;
// Quiet the one-time survey notice, and don't throw on schema mismatches
// (Yahoo frequently returns extra/unexpected fields — we only read a few).
try {
  yahooFinance.suppressNotices(['yahooSurvey']);
} catch (e) {
  /* older/newer versions may not expose this */
}
const YF_OPTS = { validateResult: false };

// Yahoo rate-limits datacenter IPs; retry a couple of times on 429/transient errors.
async function yfRetry(fn, attempts = 3) {
  let lastErr;
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      const msg = String((e && e.message) || e);
      if (!/Too Many Requests|429|fetch failed|ECONNRESET|timeout/i.test(msg)) throw e;
      await new Promise(res => setTimeout(res, 1200 * (i + 1)));
    }
  }
  throw lastErr;
}

admin.initializeApp();
const db = admin.firestore();

const OPENAI_API_KEY = defineSecret('OPENAI_API_KEY');

const CR = 1e7; // absolute currency -> ₹/₹-equivalent crore

function requireAuth(request) {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Sign-in required.');
  }
}

/** AI suggestions — replaces the client-side OpenAI call in AISuggestions.jsx.
 *  Contract preserved: takes a prompt, returns the cleaned completion string. */
exports.aiSuggestions = onCall({ secrets: [OPENAI_API_KEY] }, async request => {
  requireAuth(request);
  const prompt = (request.data && request.data.prompt) || '';
  if (!prompt) throw new HttpsError('invalid-argument', 'prompt is required.');

  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY.value()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 3000,
      temperature: 0.7,
    }),
  });

  if (!resp.ok) {
    const detail = await resp.text();
    throw new HttpsError('internal', `OpenAI error: ${resp.status} ${detail}`);
  }

  const json = await resp.json();
  return json.choices[0].message.content
    .trim()
    .split('\n')
    .map(line => line.replace(/^-\s*/, ''))
    .join('\n');
});

/** Resume text extraction — replaces Django POST /api/parse-resume/.
 *  Client sends the file as base64 (resumes are small); returns extracted text. */
exports.parseResume = onCall({ memory: '512MiB' }, async request => {
  requireAuth(request);
  const { fileBase64, filename } = request.data || {};
  if (!fileBase64 || !filename) {
    throw new HttpsError('invalid-argument', 'fileBase64 and filename are required.');
  }
  const buffer = Buffer.from(fileBase64, 'base64');
  const lower = filename.toLowerCase();

  if (lower.endsWith('.pdf')) {
    const pdfParse = require('pdf-parse');
    const data = await pdfParse(buffer);
    return data.text;
  }
  if (lower.endsWith('.docx')) {
    const mammoth = require('mammoth');
    const { value } = await mammoth.extractRawText({ buffer });
    return value;
  }
  throw new HttpsError('invalid-argument', 'Unsupported file format (pdf/docx only).');
});

/** Default words config — replaces Django get_default_words (a JSON blob).
 *  Stored as a single Firestore doc: config/defaultWords. */
exports.getDefaultWords = onCall(async request => {
  requireAuth(request);
  const snap = await db.doc('config/defaultWords').get();
  return snap.exists ? snap.data() : {};
});

exports.setDefaultWords = onCall(async request => {
  requireAuth(request);
  if (request.auth.token.admin !== true) {
    throw new HttpsError('permission-denied', 'Admin only.');
  }
  const data = (request.data && request.data.data) || {};
  await db.doc('config/defaultWords').set(data);
  return { ok: true };
});

/**
 * stockMetrics — fetch the requested fundamentals for a company from Yahoo Finance
 * (via yahoo-finance2, NO API key). Returns the latest available quarter's figures.
 * Returns { values: { key: { value, sign } }, source, sector, note }.
 *
 * Yahoo is unofficial (research/personal use) and may occasionally be unavailable;
 * on no data the UI keeps the fields editable for manual entry.
 */
exports.stockMetrics = onCall(async request => {
  requireAuth(request);
  const { ticker, parameters } = request.data || {};
  if (!Array.isArray(parameters) || parameters.length === 0) {
    throw new HttpsError('invalid-argument', 'parameters[] are required.');
  }
  if (!ticker) {
    throw new HttpsError(
      'invalid-argument',
      'A ticker is required to fetch from Yahoo (pick a company from search, or enter values manually).'
    );
  }
  const y = await fetchFromYahoo(ticker, parameters);
  if (!y) {
    return {
      values: emptyValues(parameters),
      source: 'yahoo',
      note: `No data found for "${ticker}" on Yahoo — enter values manually.`,
    };
  }
  return {
    values: y.values,
    source: 'yahoo',
    sector: y.sector,
    note: 'Yahoo Finance — latest available quarter. Verify before relying on it.',
  };
});

function emptyValues(parameters) {
  const values = {};
  parameters.forEach(p => {
    values[p.key] = { value: null, sign: '' };
  });
  return values;
}

const num = v =>
  typeof v === 'number' && !Number.isNaN(v) ? v : v && typeof v.raw === 'number' ? v.raw : null;

/** Map Yahoo Finance quoteSummary data onto the requested parameter keys. */
async function fetchFromYahoo(ticker, parameters) {
  const modules = [
    'incomeStatementHistoryQuarterly',
    'balanceSheetHistoryQuarterly',
    'financialData',
    'defaultKeyStatistics',
    'summaryDetail',
    'summaryProfile',
    'price',
  ];
  let qs;
  try {
    qs = await yfRetry(() => yahooFinance.quoteSummary(ticker, { modules }, YF_OPTS));
  } catch (e) {
    console.error('stockMetrics yahoo error:', e && (e.stack || e.message || e));
    return null;
  }
  if (!qs) return null;

  const incQ = (qs.incomeStatementHistoryQuarterly?.incomeStatementHistory || [])[0] || {};
  const balQ = (qs.balanceSheetHistoryQuarterly?.balanceSheetStatements || [])[0] || {};
  const fin = qs.financialData || {};
  const ks = qs.defaultKeyStatistics || {};
  const sd = qs.summaryDetail || {};
  const price = qs.price || {};
  const profile = qs.summaryProfile || {};

  const debtAbs =
    num(fin.totalDebt) != null
      ? num(fin.totalDebt)
      : (num(balQ.shortLongTermDebt) || 0) + (num(balQ.longTermDebt) || 0) || null;

  // Values that are absolute currency get converted to crore; ratios/EPS as-is.
  const raw = {
    revenue: num(incQ.totalRevenue) != null ? num(incQ.totalRevenue) / CR : null,
    netProfit: num(incQ.netIncome) != null ? num(incQ.netIncome) / CR : null,
    debt: debtAbs != null ? debtAbs / CR : null,
    totalAssets: num(balQ.totalAssets) != null ? num(balQ.totalAssets) / CR : null,
    roe: num(fin.returnOnEquity) != null ? num(fin.returnOnEquity) * 100 : null,
    eps: num(ks.trailingEps),
    peRatio: num(sd.trailingPE) != null ? num(sd.trailingPE) : num(price.trailingPE),
    // Yahoo returns debt/equity as a percentage number (e.g. 45.2); express as a ratio.
    debtToEquity: num(fin.debtToEquity) != null ? num(fin.debtToEquity) / 100 : null,
  };

  const values = {};
  parameters.forEach(p => {
    const v = raw[p.key];
    values[p.key] =
      v == null || Number.isNaN(v)
        ? { value: null, sign: '' }
        : { value: Math.round(v * 100) / 100, sign: '' };
  });
  return { values, sector: profile.sector || null };
}

/**
 * searchSymbols — typeahead company/ticker search across US + India (and other)
 * exchanges via Yahoo Finance (yahoo-finance2, NO API key). Ranks US + India first.
 */
exports.searchSymbols = onCall(async request => {
  requireAuth(request);
  const q = ((request.data && request.data.query) || '').trim();
  if (q.length < 2) return { results: [] };

  let res;
  try {
    res = await yfRetry(() => yahooFinance.search(q, { quotesCount: 20, newsCount: 0 }, YF_OPTS));
  } catch (e) {
    console.error('searchSymbols yahoo error:', e && (e.stack || e.message || e));
    throw new HttpsError('internal', `Search failed: ${e.message || e}`);
  }

  // Map Yahoo exchange codes to friendly labels (India: NSI=NSE, BSE; US: NMS/NGM=NASDAQ, NYQ=NYSE).
  const LABEL = {
    NMS: 'NASDAQ',
    NGM: 'NASDAQ',
    NCM: 'NASDAQ',
    NYQ: 'NYSE',
    PCX: 'NYSE',
    NSI: 'NSE',
    BSE: 'BSE',
  };
  const PRIORITY = ['NSE', 'BSE', 'NASDAQ', 'NYSE'];
  const rank = ex => {
    const i = PRIORITY.indexOf(ex);
    return i === -1 ? 99 : i;
  };
  const results = (res.quotes || [])
    .filter(x => x.symbol && x.quoteType !== 'ALTSYMBOL')
    .map(x => ({
      symbol: x.symbol,
      name: x.shortname || x.longname || x.symbol,
      exchange: LABEL[x.exchange] || x.exchDisp || x.exchange || '',
      currency: '',
    }))
    .sort((a, b) => rank(a.exchange) - rank(b.exchange));

  return { results };
});

/**
 * Delete a user's profile document when their Auth account is deleted.
 *
 * Auth and Firestore are separate stores, so removing someone from
 * Authentication otherwise leaves User/{uid} behind: they keep appearing in
 * Roles Management, and their old role and card grants would be inherited by
 * anyone who later signs up with that address.
 *
 * Auth triggers are a v1 API — the callables above are v2, and the two coexist
 * in one codebase. To clean up documents for accounts already deleted before
 * this deployed, run firestore/pruneDeletedUsers.js once.
 */
exports.cleanupUserProfile = functionsV1.auth.user().onDelete(async user => {
  try {
    await db.doc(`User/${user.uid}`).delete();
    console.log(`Deleted User/${user.uid} after auth account removal.`);
  } catch (e) {
    // Never throw: a failed cleanup must not retry-loop on account deletion.
    console.error(`Failed to delete User/${user.uid}:`, e);
  }
});
