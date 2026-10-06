/**
 * Saved finance analyses — private to the signed-in user.
 *
 *  financeAnalyses/{id} — { uid, name, createdAt, fileCount, txnCount, from, to,
 *                            spend, statements: [statement meta, no transactions],
 *                            files: [{ name, size, storagePath }] }
 *  financeAnalyses/{id}/chunks/{n} — { uid, statementIndex, transactions: [...] }
 *  Storage: finance/{uid}/{id}/{n}-{filename}.pdf — the original statements
 *  financePrefs/{uid} — { categoryOverrides: { merchantKey: category } }, the
 *    user's own category choices, applied to every analysis they open
 *
 * Transactions live in chunk docs so a year of statements never hits
 * Firestore's 1 MB document limit. Only parsed rows are stored; the
 * assessment is recomputed on load, so improvements to it apply to old saves.
 * Owner-only access is enforced in firestore.rules and storage.rules.
 */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteField,
  query,
  where,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../connector/firebase';

const COL = 'financeAnalyses';
const CHUNK = 400;

const safeName = name => name.replace(/[^\w.-]+/g, '_').slice(-80);

export async function saveAnalysis({ uid, name, files, statements, totals }) {
  const docRef = doc(collection(db, COL));
  const id = docRef.id;

  const stored = [];
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    const path = `finance/${uid}/${id}/${i}-${safeName(file.name)}`;
    await uploadBytes(ref(storage, path), file, { contentType: 'application/pdf' });
    stored.push({ name: file.name, size: file.size, storagePath: path });
  }

  const batch = writeBatch(db);
  batch.set(docRef, {
    uid,
    name,
    createdAt: serverTimestamp(),
    fileCount: files.length,
    txnCount: totals.count,
    from: totals.from,
    to: totals.to,
    spend: totals.spend,
    files: stored,
    statements: statements.map(({ transactions, ...meta }) => meta),
  });
  let n = 0;
  statements.forEach((s, statementIndex) => {
    for (let i = 0; i < s.transactions.length || i === 0; i += CHUNK) {
      batch.set(doc(db, COL, id, 'chunks', String(n).padStart(4, '0')), {
        uid,
        statementIndex,
        transactions: s.transactions.slice(i, i + CHUNK),
      });
      n += 1;
      if (!s.transactions.length) break;
    }
  });
  await batch.commit();
  return id;
}

export async function listAnalyses(uid) {
  const snap = await getDocs(query(collection(db, COL), where('uid', '==', uid)));
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
}

/** Rebuild the statements (with transactions) of a saved analysis. */
export async function loadAnalysis(id, uid) {
  const snap = await getDoc(doc(db, COL, id));
  if (!snap.exists()) throw new Error('This saved analysis no longer exists.');
  const data = snap.data();
  const chunks = await getDocs(query(collection(db, COL, id, 'chunks'), where('uid', '==', uid)));
  const statements = (data.statements || []).map(s => ({ ...s, transactions: [] }));
  chunks.docs
    .sort((a, b) => a.id.localeCompare(b.id))
    .forEach(c => {
      const { statementIndex, transactions } = c.data();
      if (statements[statementIndex]) statements[statementIndex].transactions.push(...transactions);
    });
  return { id, ...data, statements };
}

export function fileUrl(storagePath) {
  return getDownloadURL(ref(storage, storagePath));
}

export async function deleteAnalysis(id, uid) {
  const snap = await getDoc(doc(db, COL, id));
  const files = snap.exists() ? snap.data().files || [] : [];
  await Promise.all(
    files.map(f =>
      deleteObject(ref(storage, f.storagePath)).catch(err => {
        if (err?.code !== 'storage/object-not-found') throw err;
      })
    )
  );
  const chunks = await getDocs(query(collection(db, COL, id, 'chunks'), where('uid', '==', uid)));
  const batch = writeBatch(db);
  chunks.docs.forEach(c => batch.delete(c.ref));
  batch.delete(doc(db, COL, id));
  await batch.commit();
}

const PREFS = 'financePrefs';

/** merchantKey -> category the user picked (empty when none / signed out). */
export async function getCategoryOverrides(uid) {
  const snap = await getDoc(doc(db, PREFS, uid));
  return (snap.exists() && snap.data().categoryOverrides) || {};
}

/** Remember (or with category=null, forget) a user's category for a merchant. */
export async function setCategoryOverride(uid, merchantKey, category) {
  const ref = doc(db, PREFS, uid);
  if (category) {
    await setDoc(ref, { categoryOverrides: { [merchantKey]: category } }, { merge: true });
  } else {
    await updateDoc(ref, { [`categoryOverrides.${merchantKey}`]: deleteField() }).catch(err => {
      if (err?.code !== 'not-found') throw err;
    });
  }
}
