// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Firebase web config for the CONSOLIDATED `anddhen` project. HARDCODED ON
// PURPOSE — do not reintroduce process.env here. A stale REACT_APP_FIREBASE_APP_KEY
// in Vercel (pointing at the retired `anddhen-group` project) silently overrode
// the old env-driven config and broke production Google login with
// auth/invalid-continue-uri (API key and authDomain from different projects).
// These values are public client identifiers, not secrets.
const firebaseConfig = {
  apiKey: 'AIzaSyDyF8KL3IriKUnNDYhhZXBoxwqbxxhqqpY',
  authDomain: 'anddhen.firebaseapp.com',
  projectId: 'anddhen',
  storageBucket: 'anddhen.firebasestorage.app',
  messagingSenderId: '258132609295',
  appId: '1:258132609295:web:57d3f5211a038c85ce167a',
  measurementId: 'G-JZEQ2L9FEV',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app); // Initialize Firebase Analytics if needed

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Google Auth
const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({ prompt: 'select_account' });

// Facebook Auth
const facebookAuthProvider = new FacebookAuthProvider();
facebookAuthProvider.setCustomParameters({ display: 'popup' });

// GitHub Auth
const githubAuthProvider = new GithubAuthProvider();
githubAuthProvider.addScope('read:user');

// Popup sign-in fails outright in popup-hostile environments (mobile
// browsers, in-app webviews, strict blockers). For those error codes we fall
// back to the full-page redirect flow instead of surfacing an error; the
// Login page completes the round-trip via completeRedirectSignIn() on mount.
const POPUP_FALLBACK_CODES = [
  'auth/popup-blocked',
  'auth/cancelled-popup-request',
  'auth/operation-not-supported-in-this-environment',
];

const popupWithRedirectFallback = async provider => {
  try {
    return await signInWithPopup(auth, provider);
  } catch (err) {
    if (POPUP_FALLBACK_CODES.includes(err?.code)) {
      await signInWithRedirect(auth, provider); // navigates away from the app
      return new Promise(() => {}); // page is leaving — never resolves
    }
    throw err;
  }
};

// Exported sign-in methods
export const signInWithGoogle = () => popupWithRedirectFallback(googleAuthProvider);
export const signInWithFacebook = () => popupWithRedirectFallback(facebookAuthProvider);
export const signInWithGitHub = () => popupWithRedirectFallback(githubAuthProvider);
/** Result of a redirect round-trip (null user when none happened). */
export const completeRedirectSignIn = () => getRedirectResult(auth);
export const signInWithEmailPassword = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);
export const createUserWithEmailPassword = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export { auth, app };
