// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APP_KEY,
  authDomain: "anddhen-group.firebaseapp.com",
  projectId: "anddhen-group",
  storageBucket: "anddhen-group.appspot.com",
  messagingSenderId: "621666010648",
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: "G-GBVN9E58VP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("env ",process.env.REACT_APP_FIREBASE_APP_KEY)
getAnalytics(app); // Initialize Firebase Analytics if needed

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Google Auth
const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({ prompt: "select_account" });

// Facebook Auth
const facebookAuthProvider = new FacebookAuthProvider();
facebookAuthProvider.setCustomParameters({ 'display': 'popup' });

// GitHub Auth
const githubAuthProvider = new GithubAuthProvider();
githubAuthProvider.addScope('read:user');

// Exported sign-in methods
export const signInWithGoogle = () => signInWithPopup(auth, googleAuthProvider);
export const signInWithFacebook = () => signInWithPopup(auth, facebookAuthProvider);
export const signInWithGitHub = () => signInWithPopup(auth, githubAuthProvider);
export const signInWithEmailPassword = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const createUserWithEmailPassword = (email, password) => createUserWithEmailAndPassword(auth, email, password);

export { auth, app };
