import { db, storage } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const GALLERY_COLLECTION = "gallery";
const CONTENT_COLLECTION = "siteContent"; // Blog/Makale/Duyuru gibi metinler

// --- 1. GALERİ YÖNETİMİ (Resim Yükleme) ---
export const uploadGalleryItem = async (file, title, category) => {
  if (!file) throw new Error("Dosya seçilmedi.");

  // Resmi Storage'a yükle (Dosya adı + Zaman damgası ile benzersiz hale getir)
  const storageRef = ref(storage, `gallery/${file.name}_${Date.now()}`);
  const snapshot = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(snapshot.ref);

  // Firestore'a linki ve meta verileri kaydet
  await addDoc(collection(db, GALLERY_COLLECTION), {
    title: title,
    category: category,
    src: url,
    createdAt: serverTimestamp() // Hangi tarihte yüklendi
  });

  return url;
};

// --- 2. DİNAMİK İÇERİK YÖNETİMİ (Video/Kitap/Müzik Linki Ekleme) ---
export const addDynamicContent = async (type, data) => {
    // data şunları içermeli: {title, category, url, description}
    
    // Firestore'a link ve meta verileri kaydet
    await addDoc(collection(db, CONTENT_COLLECTION), {
        type: type, // 'music', 'book', 'video'
        ...data,
        createdAt: serverTimestamp()
    });

    return true;
};