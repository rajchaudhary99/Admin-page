import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCRq9kmmaR29lk4ksjsHJASvp5QN7xMuCY",
  authDomain: "adminapp-50164.firebaseapp.com",
  projectId: "adminapp-50164",
  storageBucket: "adminapp-50164.appspot.com", // Corrected this line
  messagingSenderId: "354383942850",
  appId: "1:354383942850:web:c5020131a2c1e5afbb575b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore Database
const db = getFirestore(app);
export { db };

// Firebase Authentication
const auth = getAuth(app);
export { auth };
