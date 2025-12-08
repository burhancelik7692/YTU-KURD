import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Tüm içerikleri (Galeri, Kitap, Video) bu tek koleksiyonda tutacağız.
const CONTENT_COLLECTION = "dynamicContent"; 

/**
 * Harici linke dayalı içerik öğesi ekler (Storage kullanmadan).
 * @param {object} data - İçerik verisi (title, url, type, category, desc)
 */
export const addDynamicContent = async (data) => {
    if (!data.title || !data.url) {
        throw new Error("Başlık ve URL (Link) boş bırakılamaz.");
    }
    
    // Firestore'a kaydetme
    await addDoc(collection(db, CONTENT_COLLECTION), {
        ...data,
        createdAt: serverTimestamp() // Sunucu saati ile kayıt tarihi
    });

    return true;
};

/**
 * NOT: Artık Storage'a dosya yükleme fonksiyonları bu serviste YOKTUR.
 * Yönetici paneli tamamen URL girişi üzerinden çalışır.
 */