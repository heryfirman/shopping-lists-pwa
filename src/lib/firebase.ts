// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAeJi4-EewF4o9uEYhmZf8ln-WVzYEqvE",
  authDomain: "shopping-lists-1c029.firebaseapp.com",
  projectId: "shopping-lists-1c029",
  storageBucket: "shopping-lists-1c029.firebasestorage.app",
  messagingSenderId: "1004878810890",
  appId: "1:1004878810890:web:4ac9ac1fee7e6a814bb4f3",
  measurementId: "G-4QDXEQEC2H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);