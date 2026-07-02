import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCsoYfFVX5O_0NzttWkRnPDDhvBvLCxbL8",
  authDomain: "guidoc-6c3be.firebaseapp.com",
  projectId: "guidoc-6c3be",
  storageBucket: "guidoc-6c3be.firebasestorage.app",
  messagingSenderId: "641544705495",
  appId: "1:641544705495:web:214236d90b2441f418a792",
  measurementId: "G-KTE1WEZ462"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getFirestore(app);

export { auth, googleProvider, analytics, db };
