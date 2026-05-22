import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCQcXrBkKccdimEFfRWXjEybCSSMLkgJlg",
  authDomain: "demon-lords-bestellung.firebaseapp.com",
  projectId: "demon-lords-bestellung",
  storageBucket: "demon-lords-bestellung.firebasestorage.app",
  messagingSenderId: "1085223445649",
  appId: "1:1085223445649:web:a241ce962d00fcabc44b30",
  measurementId: "G-V1SGJDKM2K"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);