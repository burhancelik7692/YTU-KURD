import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const CONTENT_COLLECTION = "dynamicContent"; 

/**
 * Harici linke dayalı içerik öğesi ekler (Storage kullanmadan).
 * @param {object} data - İçerik verisi (title, url, type, category, desc, ku, tr vb.)
 */
export const addDynamicContent = async (data) => {
    // Sözlük veya Galeri/Blog/Video ekleniyorsa zorunlu alan kontrolü
    if (data.type === 'dictionary') {
        if (!data.ku || !data.tr) throw new Error("Sözlük kelimeleri (KU ve TR) zorunludur.");
    } else if (!data.title || !data.url) {
        throw new Error("Başlık ve Harici URL zorunludur.");
    }
    
    // Firestore'a kaydetme
    await addDoc(collection(db, CONTENT_COLLECTION), {
        ...data,
        createdAt: serverTimestamp() // Sunucu saati ile kayıt tarihi
    });

    return true;
};