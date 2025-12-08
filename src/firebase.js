import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// --- BURAYI FIREBASE KONSOLUNDAN ALDIĞIN KODLARLA DEĞİŞTİR ---
const firebaseConfig = {
  apiKey: "AIzaSyDadado7dT6SYDywKRCpAc9L7kqkubdadE",
  authDomain: "ytu-kurdi.firebaseapp.com",
  projectId: "ytu-kurdi",
  storageBucket: "ytu-kurdi.firebasestorage.app",
  messagingSenderId: "384217788430",
  appId: "G-GC3SS4X5YB"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);