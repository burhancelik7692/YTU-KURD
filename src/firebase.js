import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"; 
import { getFirestore } from "firebase/firestore"; // Firestore (Veritabanı)
import { getStorage } from "firebase/storage";   // Storage (Depolama)


// Web uygulamanızın Firebase yapılandırması
// DİKKAT: Bu bilgileri .env dosyasına taşımak, genel güvenlik için önerilir.
const firebaseConfig = {
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
// Başlatılan 'app' değişkenini her bir servis fonksiyonuna parametre olarak verin.
const analytics = getAnalytics(app); 
const db = getFirestore(app);     
const storage = getStorage(app); 


// 3. Servisleri Dışarı Aktar (Export)
// Böylece projenizin diğer bileşenlerinde bu servisleri kolayca kullanabilirsiniz.
export { 
  app, 
  analytics, 
  db, 
  storage 
};