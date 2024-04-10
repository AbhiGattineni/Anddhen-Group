// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

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

// Google Authentication
const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({ prompt: "select_account" });

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleAuthProvider);
};

export { auth, app };
