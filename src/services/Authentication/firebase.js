// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration — env-driven with fallbacks to the
// CONSOLIDATED `anddhen` project (web config values are public, not secrets).
// The fallbacks mean production works even if Vercel's env vars are missing
// or stale; set REACT_APP_FIREBASE_* in Vercel only to point elsewhere.
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APP_KEY || 'AIzaSyDyF8KL3IriKUnNDYhhZXBoxwqbxxhqqpY',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'anddhen.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'anddhen',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'anddhen.firebasestorage.app',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '258132609295',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:258132609295:web:57d3f5211a038c85ce167a',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || 'G-JZEQ2L9FEV',
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

// Exported sign-in methods
export const signInWithGoogle = () => signInWithPopup(auth, googleAuthProvider);
export const signInWithFacebook = () => signInWithPopup(auth, facebookAuthProvider);
export const signInWithGitHub = () => signInWithPopup(auth, githubAuthProvider);
export const signInWithEmailPassword = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);
export const createUserWithEmailPassword = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export { auth, app };
