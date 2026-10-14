/**
 * Firestore + Storage handles for the connector, derived from the same Firebase
 * `app` used for Auth. When Phase 2 repoints Authentication/firebase.js to the
 * `anddhen` project, these follow automatically — one project, one config.
 */
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { app } from '../Authentication/firebase';

export const db = getFirestore(app);
export const storage = getStorage(app);

// Local development / testing only (see Authentication/firebase.js).
if (process.env.REACT_APP_USE_EMULATORS === 'true') {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
}
