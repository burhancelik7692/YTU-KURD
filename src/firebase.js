import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"; 
import { getFirestore } from "firebase/firestore";  // Firestore
import { getStorage } from "firebase/storage";    // Storage
import { getAuth } from "firebase/auth";      // Authentication

// --- FIREBASE KONFİGÜRASYONU ---
// Lütfen bu bilgilerin KONSOLDAN DOĞRU kopyalandığından emin olun.
const firebaseConfig = {
  // Sizin güncel anahtarınız buraya gelecek
  apiKey: "SENIN_YENI_VE_DOGRULANMIS_API_KEYIN_BURAYA", 
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
// NOT: Burada 'export' etmiyoruz, sadece 'const' ile başlatıyoruz.
const analytics = getAnalytics(app); 
const auth = getAuth(app); 
const db = getFirestore(app); 
const storage = getStorage(app); 


// 3. Servisleri Dışarı Aktar (TEK VE KESİN NOKTA)
// Tüm servisleri burada toplu halde dışa aktarıyoruz.
export { 
  app, 
  analytics, 
  db, 
  storage,
  auth
};