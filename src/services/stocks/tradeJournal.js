/**
 * Trade Journal — a shared log of stock trades, with each author's reasoning
 * as a timeline and up/down votes. Visible to everyone holding the Stocks card.
 *
 * Authors appear only as an auto-generated alias. Public documents never hold
 * the author's uid (User/{uid} docs are readable by any signed-in user, so a
 * uid would reveal the real name); ownership lives in owner-only lookup docs
 * that firestore.rules consult.
 *
 *  tradeAliases/{aliasId}        public  { alias, createdAt }
 *  tradeAliasOwners/{uid}        private { aliasId, alias, createdAt }
 *  trades/{tradeId}              public  { aliasId, alias, ticker, companyName, market,
 *                                          currency, side, price, quantity, tradeDate,
 *                                          description, up, down, createdAt, updatedAt }
 *  trades/{tradeId}/notes/{id}   public  { aliasId, alias, kind, text, up, down, createdAt }
 *  tradeOwners/{tradeId}         private { uid }
 *  tradeVotes/{item}_{uid}       private { uid, item, value: 1 | -1 }  (item: t-… / n-…)
 *  tradeFollows/{uid}            private { aliasIds: [] }
 */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
  limit,
  writeBatch,
  runTransaction,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../connector/firebase';

// Markets and their default currency. "Other" lets the user pick any currency.
export const MARKETS = [
  { id: 'US', label: 'United States (NYSE / NASDAQ)', currency: 'USD' },
  { id: 'IN', label: 'India (NSE / BSE)', currency: 'INR' },
  { id: 'GB', label: 'United Kingdom (LSE)', currency: 'GBP' },
  { id: 'CA', label: 'Canada (TSX)', currency: 'CAD' },
  { id: 'AU', label: 'Australia (ASX)', currency: 'AUD' },
  { id: 'EU', label: 'Eurozone (Euronext / XETRA …)', currency: 'EUR' },
  { id: 'CH', label: 'Switzerland (SIX)', currency: 'CHF' },
  { id: 'JP', label: 'Japan (TSE)', currency: 'JPY' },
  { id: 'HK', label: 'Hong Kong (HKEX)', currency: 'HKD' },
  { id: 'CN', label: 'China (SSE / SZSE)', currency: 'CNY' },
  { id: 'SG', label: 'Singapore (SGX)', currency: 'SGD' },
  { id: 'KR', label: 'South Korea (KRX)', currency: 'KRW' },
  { id: 'TW', label: 'Taiwan (TWSE)', currency: 'TWD' },
  { id: 'BR', label: 'Brazil (B3)', currency: 'BRL' },
  { id: 'MX', label: 'Mexico (BMV)', currency: 'MXN' },
  { id: 'ZA', label: 'South Africa (JSE)', currency: 'ZAR' },
  { id: 'AE', label: 'UAE (ADX / DFM)', currency: 'AED' },
  { id: 'SA', label: 'Saudi Arabia (Tadawul)', currency: 'SAR' },
  { id: 'OTHER', label: 'Other / crypto', currency: '' },
];

export const CURRENCIES = [
  'USD',
  'INR',
  'EUR',
  'GBP',
  'CAD',
  'AUD',
  'CHF',
  'JPY',
  'HKD',
  'CNY',
  'SGD',
  'KRW',
  'TWD',
  'BRL',
  'MXN',
  'ZAR',
  'AED',
  'SAR',
  'NZD',
  'SEK',
  'NOK',
  'DKK',
  'PLN',
  'ILS',
  'THB',
  'MYR',
  'IDR',
  'PHP',
  'USDT',
  'BTC',
];

export const NOTE_KINDS = {
  holding: { label: 'Still holding', color: 'primary' },
  pro: { label: 'Pro', color: 'success' },
  con: { label: 'Con / risk', color: 'danger' },
  update: { label: 'Update', color: 'secondary' },
};

export const marketLabel = id => MARKETS.find(m => m.id === id)?.label || id || '';

// ------------------------------------------------------------------ aliases

const ADJ = [
  'Swift',
  'Calm',
  'Bold',
  'Keen',
  'Wise',
  'Steady',
  'Brisk',
  'Lucky',
  'Patient',
  'Sharp',
  'Quiet',
  'Bright',
  'Clever',
  'Nimble',
  'Brave',
  'Sunny',
  'Silver',
  'Golden',
  'Cosmic',
  'Polar',
];
const ANIMALS = [
  'Falcon',
  'Otter',
  'Lynx',
  'Heron',
  'Bison',
  'Panda',
  'Tiger',
  'Orca',
  'Raven',
  'Fox',
  'Koala',
  'Hawk',
  'Wolf',
  'Eagle',
  'Badger',
  'Gecko',
  'Moose',
  'Owl',
  'Puma',
  'Yak',
];
const pick = list => list[Math.floor(Math.random() * list.length)];
const makeAlias = () => `${pick(ADJ)}${pick(ANIMALS)}${10 + Math.floor(Math.random() * 90)}`;

/** The signed-in user's alias ({ aliasId, alias }), or null if they have none yet. */
export async function getMyAlias(uid) {
  const snap = await getDoc(doc(db, 'tradeAliasOwners', uid));
  return snap.exists() ? { aliasId: snap.data().aliasId, alias: snap.data().alias } : null;
}

/** Get the user's alias, creating an auto-generated one on first use. */
export async function ensureMyAlias(uid) {
  const existing = await getMyAlias(uid);
  if (existing) return existing;
  const aliasRef = doc(collection(db, 'tradeAliases'));
  const alias = makeAlias();
  const batch = writeBatch(db);
  batch.set(aliasRef, { alias, createdAt: serverTimestamp() });
  batch.set(doc(db, 'tradeAliasOwners', uid), {
    aliasId: aliasRef.id,
    alias,
    createdAt: serverTimestamp(),
  });
  await batch.commit();
  return { aliasId: aliasRef.id, alias };
}

// ------------------------------------------------------------------ trades

const withId = s => ({ id: s.id, ...s.data() });

export function subscribeTrades(onChange, onError) {
  return onSnapshot(
    query(collection(db, 'trades'), orderBy('createdAt', 'desc'), limit(500)),
    snap => onChange(snap.docs.map(withId)),
    err => {
      console.error('subscribeTrades failed:', err);
      if (onError) onError(err?.code || err?.message || String(err));
    }
  );
}

function tradeFields(f) {
  return {
    ticker: f.ticker.trim().toUpperCase().slice(0, 20),
    companyName: (f.companyName || '').trim().slice(0, 100),
    market: f.market,
    currency: f.currency.trim().toUpperCase().slice(0, 5),
    side: f.side,
    price: Number(f.price),
    quantity: Number(f.quantity),
    tradeDate: f.tradeDate,
    description: (f.description || '').trim().slice(0, 4000),
  };
}

export async function createTrade(uid, me, fields) {
  const ref = doc(collection(db, 'trades'));
  const batch = writeBatch(db);
  batch.set(doc(db, 'tradeOwners', ref.id), { uid });
  batch.set(ref, {
    ...tradeFields(fields),
    aliasId: me.aliasId,
    alias: me.alias,
    up: 0,
    down: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await batch.commit();
  return ref.id;
}

export async function updateTrade(tradeId, fields) {
  const batch = writeBatch(db);
  batch.update(doc(db, 'trades', tradeId), {
    ...tradeFields(fields),
    updatedAt: serverTimestamp(),
  });
  await batch.commit();
}

/** Delete a trade with its timeline. Owner (or admin) only, per firestore.rules. */
export async function deleteTrade(tradeId) {
  const notes = await getDocs(collection(db, 'trades', tradeId, 'notes'));
  const batch = writeBatch(db);
  notes.docs.forEach(n => batch.delete(n.ref));
  batch.delete(doc(db, 'trades', tradeId));
  await batch.commit();
  // The private owner doc goes last: the rules above read it.
  await deleteDoc(doc(db, 'tradeOwners', tradeId)).catch(() => {});
}

// ------------------------------------------------------------------ notes

export function subscribeNotes(tradeId, onChange) {
  return onSnapshot(
    query(collection(db, 'trades', tradeId, 'notes'), orderBy('createdAt', 'asc')),
    snap => onChange(snap.docs.map(withId)),
    err => console.error('subscribeNotes failed:', err)
  );
}

export async function getNotes(tradeId) {
  const snap = await getDocs(
    query(collection(db, 'trades', tradeId, 'notes'), orderBy('createdAt', 'asc'))
  );
  return snap.docs.map(withId);
}

export async function addNote(tradeId, me, { kind, text }) {
  const ref = doc(collection(db, 'trades', tradeId, 'notes'));
  await setDoc(ref, {
    aliasId: me.aliasId,
    alias: me.alias,
    kind,
    text: text.trim().slice(0, 2000),
    up: 0,
    down: 0,
    createdAt: serverTimestamp(),
  });
}

export async function deleteNote(tradeId, noteId) {
  const batch = writeBatch(db);
  batch.delete(doc(db, 'trades', tradeId, 'notes', noteId));
  await batch.commit();
}

// ------------------------------------------------------------------ votes

export const tradeItem = tradeId => `t-${tradeId}`;
export const noteItem = (tradeId, noteId) => `n-${tradeId}-${noteId}`;

/** item -> 1 | -1 for the signed-in user's votes. */
export async function getMyVotes(uid) {
  const snap = await getDocs(query(collection(db, 'tradeVotes'), where('uid', '==', uid)));
  const map = {};
  snap.docs.forEach(d => {
    map[d.data().item] = d.data().value;
  });
  return map;
}

/**
 * Cast, change or withdraw (value 0) a vote. The vote doc and the target's
 * up/down counters change in one transaction; the rules check they agree.
 */
export async function vote(uid, { tradeId, noteId }, value) {
  const item = noteId ? noteItem(tradeId, noteId) : tradeItem(tradeId);
  const voteRef = doc(db, 'tradeVotes', `${item}_${uid}`);
  const targetRef = noteId
    ? doc(db, 'trades', tradeId, 'notes', noteId)
    : doc(db, 'trades', tradeId);
  await runTransaction(db, async tx => {
    const [v, t] = await Promise.all([tx.get(voteRef), tx.get(targetRef)]);
    if (!t.exists()) throw new Error('This post no longer exists.');
    const before = v.exists() ? v.data().value : 0;
    if (before === value) return;
    const up = (t.data().up || 0) + (value === 1 ? 1 : 0) - (before === 1 ? 1 : 0);
    const down = (t.data().down || 0) + (value === -1 ? 1 : 0) - (before === -1 ? 1 : 0);
    if (value === 0) tx.delete(voteRef);
    else tx.set(voteRef, { uid, item, value });
    tx.update(targetRef, { up, down });
  });
}

// ------------------------------------------------------------------ follows

export async function getFollows(uid) {
  const snap = await getDoc(doc(db, 'tradeFollows', uid));
  return snap.exists() ? snap.data().aliasIds || [] : [];
}

export async function setFollows(uid, aliasIds) {
  await setDoc(doc(db, 'tradeFollows', uid), { aliasIds: aliasIds.slice(0, 500) });
}
