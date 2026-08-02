/**
 * Stocks service — Firebase-native (like the roles service). Three collections:
 *
 *  stockParameters  — user-defined metrics to track (debt, revenue, ROE, …).
 *      { key, name, description, higherIsBetter, unit, order }
 *  stockCompanies   — companies the user follows.
 *      { name, ticker, exchange, sector }
 *  stockSnapshots   — one document per company per quarter (doc id `${companyId}_${quarter}`).
 *      Quarterly results are stored ONCE and re-read from the DB, never re-fetched.
 *      { companyId, companyName, sector, quarter, source, values: { [paramKey]: { value, sign } }, updatedAt }
 *
 * `sign` is '+' (favorable) | '-' (unfavorable) | '' (neutral). The parameter's
 * `higherIsBetter` gives the direction (shown in the ⓘ tooltip); the sign is set
 * by the user or suggested by the AI/API fetch.
 */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../connector/firebase';

const PARAMS = 'stockParameters';
const COMPANIES = 'stockCompanies';
const SNAPSHOTS = 'stockSnapshots';

const withId = s => ({ id: s.id, ...s.data() });

/** Default parameters seeded on first use so the feature is usable immediately. */
export const DEFAULT_PARAMETERS = [
  {
    key: 'revenue',
    name: 'Revenue',
    unit: '₹ Cr',
    higherIsBetter: true,
    order: 1,
    description:
      'Total sales/income for the quarter. Rising revenue signals growing demand and market share.',
  },
  {
    key: 'netProfit',
    name: 'Net Profit',
    unit: '₹ Cr',
    higherIsBetter: true,
    order: 2,
    description:
      'Profit after all expenses, interest and tax. The bottom line — consistent growth is a strong positive.',
  },
  {
    key: 'debt',
    name: 'Total Debt',
    unit: '₹ Cr',
    higherIsBetter: false,
    order: 3,
    description:
      'Total borrowings. High or rising debt increases risk, especially when interest rates climb. Lower is better.',
  },
  {
    key: 'totalAssets',
    name: 'Total Assets',
    unit: '₹ Cr',
    higherIsBetter: true,
    order: 4,
    description: 'Everything the company owns. A growing asset base can support future earnings.',
  },
  {
    key: 'roe',
    name: 'Return on Equity',
    unit: '%',
    higherIsBetter: true,
    order: 5,
    description:
      'Net profit ÷ shareholder equity. How efficiently the company turns equity into profit. >15% is generally healthy.',
  },
  {
    key: 'eps',
    name: 'EPS',
    unit: '₹',
    higherIsBetter: true,
    order: 6,
    description:
      'Earnings per share = net profit ÷ shares outstanding. Rising EPS benefits shareholders.',
  },
  {
    key: 'peRatio',
    name: 'P/E Ratio',
    unit: 'x',
    higherIsBetter: false,
    order: 7,
    description:
      'Price ÷ earnings per share. How expensive the stock is relative to profit. A very high P/E can mean it is overvalued.',
  },
  {
    key: 'debtToEquity',
    name: 'Debt-to-Equity',
    unit: 'x',
    higherIsBetter: false,
    order: 8,
    description:
      'Total debt ÷ equity. Leverage level. Below ~1 is usually comfortable; higher means more financial risk.',
  },
];

// ---- Parameters ----
export async function listParameters() {
  const snap = await getDocs(collection(db, PARAMS));
  const rows = snap.docs.map(withId);
  return rows.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export async function ensureDefaultParameters() {
  const existing = await listParameters();
  if (existing.length > 0) return existing;
  const batch = writeBatch(db);
  DEFAULT_PARAMETERS.forEach(p => batch.set(doc(db, PARAMS, p.key), p));
  await batch.commit();
  return DEFAULT_PARAMETERS.map(p => ({ id: p.key, ...p }));
}

export async function saveParameter(param) {
  const key = param.key || param.name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  await setDoc(doc(db, PARAMS, key), { ...param, key }, { merge: true });
  return { id: key, ...param, key };
}

export async function deleteParameter(key) {
  await deleteDoc(doc(db, PARAMS, key));
}

// ---- Companies ----
export async function listCompanies() {
  const snap = await getDocs(collection(db, COMPANIES));
  return snap.docs.map(withId).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
}

export async function saveCompany(company) {
  if (company.id) {
    await setDoc(doc(db, COMPANIES, company.id), company, { merge: true });
    return company;
  }
  const ref = doc(collection(db, COMPANIES));
  await setDoc(ref, company);
  return { id: ref.id, ...company };
}

export async function deleteCompany(id) {
  await deleteDoc(doc(db, COMPANIES, id));
}

// ---- Snapshots (quarterly results) ----
const snapId = (companyId, quarter) => `${companyId}_${quarter}`;

export async function getSnapshot(companyId, quarter) {
  const s = await getDoc(doc(db, SNAPSHOTS, snapId(companyId, quarter)));
  return s.exists() ? withId(s) : null;
}

export async function listSnapshots() {
  const snap = await getDocs(collection(db, SNAPSHOTS));
  return snap.docs.map(withId);
}

export async function saveSnapshot(snapshot) {
  const id = snapId(snapshot.companyId, snapshot.quarter);
  await setDoc(
    doc(db, SNAPSHOTS, id),
    { ...snapshot, updatedAt: serverTimestamp() },
    { merge: true }
  );
  return { id, ...snapshot };
}

/** Suggest a +/- sign from quarter-over-quarter change and the parameter direction. */
export function suggestSign(param, currentValue, previousValue) {
  if (previousValue == null || currentValue == null || currentValue === '' || previousValue === '')
    return '';
  const cur = Number(currentValue);
  const prev = Number(previousValue);
  if (Number.isNaN(cur) || Number.isNaN(prev) || cur === prev) return '';
  const wentUp = cur > prev;
  const good = param.higherIsBetter ? wentUp : !wentUp;
  return good ? '+' : '-';
}

/** Build a quarter label like "2025-Q1" from a date, or list recent quarters. */
export function recentQuarters(count = 8) {
  // Static list avoids Date.now() (unavailable in some contexts); UI passes current.
  return count;
}
