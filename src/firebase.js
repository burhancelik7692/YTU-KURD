import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"; 
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage";   
import { getAuth } from "firebase/auth";      

// --- FIREBASE KONFİGÜRASYONU (API Anahtarınızı Kontrol Edin) ---
const firebaseConfig = {
 apiKey: "AIzaSyDadado7dT6SYDywKRCpAc9L7kqkubdadE",
  authDomain: "ytu-kurdi.firebaseapp.com",
  databaseURL: "https://ytu-kurdi-default-rtdb.firebaseio.com",
  projectId: "ytu-kurdi",
  storageBucket: "ytu-kurdi.firebasestorage.app",
  messagingSenderId: "384217788430",
  appId: "1:384217788430:web:ca8903eb0d18f322778c5f",
  measurementId: "G-KNWPL77C9F"
};


// 1. Firebase Uygulamasını Başlat
const app = initializeApp(firebaseConfig);

// 2. Servisleri Başlat
const analytics = getAnalytics(app); 
const auth = getAuth(app); 
const db = getFirestore(app); 
const storage = getStorage(app); 


// 3. Servisleri Dışarı Aktar (TEK VE KESİN NOKTA)
export { 
  app, 
  analytics, 
  db, 
  storage,
  auth // AuthContext'in ihtiyacı olan servis
};