// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNVy9eaehNao9PZ1v0LuqarZrLPuqNKOk",
  authDomain: "import-export-6282f.firebaseapp.com",
  projectId: "import-export-6282f",
  storageBucket: "import-export-6282f.firebasestorage.app",
  messagingSenderId: "179448390320",
  appId: "1:179448390320:web:9f0f50d48077a5efded175",
  measurementId: "G-R49YHTQKSB"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
