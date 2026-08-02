/**
 * Firestore + Storage handles for the connector, derived from the same Firebase
 * `app` used for Auth. When Phase 2 repoints Authentication/firebase.js to the
 * `anddhen` project, these follow automatically — one project, one config.
 */
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { app } from '../Authentication/firebase';

export const db = getFirestore(app);
export const storage = getStorage(app);
