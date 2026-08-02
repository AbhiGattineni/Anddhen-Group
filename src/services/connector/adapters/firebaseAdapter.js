/**
 * Firebase adapter — generic Firestore CRUD + Storage uploads, routed through the
 * resource registry. Field names are preserved from the Django models; translation
 * rules (FK -> <field>_id, JSONField -> array/map, dates -> Timestamp, files ->
 * Storage URL, unique -> query-before-write) are documented in
 * docs/FIREBASE_MIGRATION_PLAN.md and applied per-resource as schema lands (Phase 3).
 *
 * NOTE: default provider is still "django". This adapter is opt-in via the provider
 * toggle until Firestore collections + rules exist (Phases 2-3).
 */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query as fsQuery,
  where,
  orderBy as fsOrderBy,
  limit as fsLimit,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { getResource, FUNCTIONS } from '../registry';
import { getFunctions, httpsCallable } from 'firebase/functions';

const withId = snap => ({ id: snap.id, ...snap.data() });

function buildQuery(colRef, opts = {}) {
  const clauses = [];
  (opts.filters || []).forEach(([f, op, val]) => clauses.push(where(f, op, val)));
  if (opts.orderBy) clauses.push(fsOrderBy(opts.orderBy[0], opts.orderBy[1] || 'asc'));
  if (opts.limit) clauses.push(fsLimit(opts.limit));
  return clauses.length ? fsQuery(colRef, ...clauses) : colRef;
}

export const firebaseAdapter = {
  async list(resource, opts = {}) {
    const { collection: name } = getResource(resource);
    const snap = await getDocs(buildQuery(collection(db, name), opts));
    return snap.docs.map(withId);
  },

  async get(resource, id) {
    const { collection: name } = getResource(resource);
    const snap = await getDoc(doc(db, name, String(id)));
    return snap.exists() ? withId(snap) : null;
  },

  async create(resource, data, id) {
    const { collection: name, idField } = getResource(resource);
    const payload = { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
    const docId = id || (idField ? data[idField] : undefined);
    if (docId != null) {
      // Upsert with merge so re-provisioning a keyed doc (e.g. User on each
      // sign-in) never clobbers fields it didn't send — notably `role`.
      await setDoc(doc(db, name, String(docId)), payload, { merge: true });
      return { id: String(docId), ...data };
    }
    const created = await addDoc(collection(db, name), payload);
    return { id: created.id, ...data };
  },

  async update(resource, id, data) {
    const { collection: name } = getResource(resource);
    const ref_ = doc(db, name, String(id));
    await updateDoc(ref_, { ...data, updatedAt: serverTimestamp() });
    return { id: String(id), ...data };
  },

  async remove(resource, id) {
    const { collection: name } = getResource(resource);
    await deleteDoc(doc(db, name, String(id)));
  },

  async query(resource, opts = {}) {
    return this.list(resource, opts);
  },

  // "by <field>" lookup — the Firestore equivalent of Django's filtered-list
  // endpoints (/get_status_by_id/:id etc). Returns an array.
  async byField(resource, field, value) {
    return this.list(resource, { filters: [[field, '==', value]] });
  },

  async uploadFile(path, file) {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  },

  async callFunction(name, payload) {
    const def = FUNCTIONS[name];
    if (!def) throw new Error(`[firebase] unknown function "${name}"`);
    const callable = httpsCallable(getFunctions(), def.fn);
    const res = await callable(payload);
    return res.data;
  },
};
