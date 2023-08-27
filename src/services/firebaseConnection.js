// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC6LfdpCfE4fB9Ju8wCeTcCyD9hXtQZNjI",
  authDomain: "mmadmin-afc0f.firebaseapp.com",
  projectId: "mmadmin-afc0f",
  storageBucket: "mmadmin-afc0f.appspot.com",
  messagingSenderId: "725065941418",
  appId: "1:725065941418:web:2dad936a9144053a9c2bd3",
  measurementId: "G-9HDPPM5WNV"
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, db, storage };