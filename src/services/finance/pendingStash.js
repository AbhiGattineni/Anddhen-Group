/**
 * Holds a signed-out visitor's statement files across the trip to the login
 * page, so they can save the analysis once signed in. Kept in this browser's
 * IndexedDB only, cleared after saving or discarding, and ignored after an
 * hour. Nothing here leaves the device.
 */
const DB = 'anddhen-finance';
const STORE = 'pending';
const KEY = 'current';
const MAX_AGE_MS = 60 * 60 * 1000;

function open() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('IndexedDB unavailable'));
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function run(mode, fn) {
  return open().then(
    db =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const result = fn(tx.objectStore(STORE));
        tx.oncomplete = () => {
          db.close();
          resolve(result && 'result' in result ? result.result : undefined);
        };
        tx.onerror = () => {
          db.close();
          reject(tx.error);
        };
      })
  );
}

export async function stashFiles(files) {
  const entries = await Promise.all(
    files.map(async f => ({ name: f.name, type: f.type, data: await f.arrayBuffer() }))
  );
  await run('readwrite', store => store.put({ savedAt: Date.now(), entries }, KEY));
}

/** Returns File[] (or null) and clears the stash. */
export async function takeStashedFiles() {
  try {
    const record = await run('readonly', store => store.get(KEY));
    await run('readwrite', store => store.delete(KEY));
    if (!record || Date.now() - record.savedAt > MAX_AGE_MS) return null;
    return record.entries.map(
      e => new File([e.data], e.name, { type: e.type || 'application/pdf' })
    );
  } catch (err) {
    return null;
  }
}

export async function clearStash() {
  try {
    await run('readwrite', store => store.delete(KEY));
  } catch (err) {
    /* nothing stashed / storage unavailable */
  }
}
