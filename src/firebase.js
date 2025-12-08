import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"; 
import { getFirestore } from "firebase/firestore";  // Firestore Veritabanı
import { getStorage } from "firebase/storage";    // Storage Depolama
import { getAuth } from "firebase/auth";      // Authentication Servisi

// --- KRİTİK: BURAYI KENDİ FIREBASE AYARLARINIZLA DOLDURUN ---
const firebaseConfig = {
  apiKey: "SENIN_YENI_VE_DOGRULANMIS_API_KEYIN_BURAYA", // Hatanın kaynağı burasıydı
  authDomain: "ytu-kurdi.firebaseapp.com",
  projectId: "ytu-kurdi",
  storageBucket: "ytu-kurdi.firebasestorage.app",
  messagingSenderId: "384217788430",
  appId: "1:384217788430:web:ca8903eb0d18f322778c5f",
  measurementId: "G-KNWPL77C9F"
};


const app = initializeApp(firebaseConfig);

// Servisleri başlat
const analytics = getAnalytics(app); 
export const auth = getAuth(app); 
export const db = getFirestore(app); 
export const storage = getStorage(app); 

export { 
  app, 
  analytics, 
  db, 
  storage,
  auth
};