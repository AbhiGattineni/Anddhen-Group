/**
 * Compute-endpoint client. These are Firebase Callable Functions and are NOT
 * subject to the Firebase|Django data toggle — they replace logic that either
 * lived on Django (parse-resume) or ran client-side with an exposed key
 * (aiSuggestions). Always routed to Cloud Functions.
 */
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import { app } from '../Authentication/firebase';

const functions = getFunctions(app);

if (process.env.REACT_APP_USE_EMULATORS === 'true') {
  connectFunctionsEmulator(functions, 'localhost', 5001);
}

/** Call a Callable Function by name; returns its `.data` payload. */
export async function callFunction(name, payload) {
  const callable = httpsCallable(functions, name);
  const res = await callable(payload);
  return res.data;
}

/** Read a File/Blob as base64 (no data: prefix) for parseResume uploads. */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
