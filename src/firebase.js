import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics"; 
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// --- FIREBASE KONFİGÜRASYONU ---
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

// 1. Uygulamayı Başlat
const app = initializeApp(firebaseConfig);

// 2. Servisleri Başlat
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Analytics için güvenlik kontrolü (Bazı ortamlarda çalışmayabilir)
let analytics;
isSupported().then((yes) => {
  if (yes) {
    analytics = getAnalytics(app);
  }
}).catch((err) => {
  console.log("Analytics bu ortamda desteklenmiyor:", err);
});

// 3. Servisleri Dışa Aktar
// Diğer dosyalarda `import { db, auth } from './firebase'` şeklinde kullanacaksın.
export { app, analytics, db, storage, auth };