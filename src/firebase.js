import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"; 
import { getFirestore } from "firebase/firestore";  // Firestore
import { getStorage } from "firebase/storage";    // Storage
import { getAuth } from "firebase/auth";      // KRİTİK: Authentication Servisi

// Web uygulamanızın Firebase yapılandırması
// DİKKAT: Bu bilgileri .env dosyasına taşımak, genel güvenlik için önerilir.
const firebaseConfig = {
  // Bu bilgileri kendi Firebase konsolunuzdaki gerçek anahtarlarınızla değiştirin!
  apiKey: "AIzaSyDadado7dT6SYDywKRCpAcL7kqkubdadE", 
  authDomain: "ytu-kurdi.firebaseapp.com",
  projectId: "ytu-kurdi",
  storageBucket: "ytu-kurdi.firebasestorage.app",
  messagingSenderId: "384217788430",
  appId: "1:384217788430:web:ca8903eb0d18f322778c5f",
  measurementId: "G-KNWPL77C9F"
};


// 1. Firebase Uygulamasını Başlat
const app = initializeApp(firebaseConfig);

// 2. Kullanılacak Servisleri Başlat
// Servisler başlatılırken 'app' değişkeni parametre olarak verilir.
const analytics = getAnalytics(app); 
const db = getFirestore(app); 
const storage = getStorage(app); 
const auth = getAuth(app); // YENİ: Authentication servisi başlatıldı.


// 3. Servisleri Dışarı Aktar (Export)
// Artık 'auth' servisini dışarıya aktarıyoruz!
export { 
  app, 
  analytics, 
  db, 
  storage,
  auth // KRİTİK DÜZELTME: Auth servisi artık kullanılabilir.
};