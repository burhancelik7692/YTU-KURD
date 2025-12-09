import React, { createContext, useContext, useEffect, useState } from 'react';
// Firebase bağlantılarını kontrol edin
import { db } from '../firebase'; 
import { doc, getDoc, setDoc } from 'firebase/firestore';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Yerel depolamada (localStorage) ID ara
    let id = localStorage.getItem('ytu_user_id');

    if (!id) {
      // 2. ID yoksa, yeni benzersiz ID oluştur
      id = `guest_${Date.now()}_${Math.floor(Math.random() * 9999)}`;
      localStorage.setItem('ytu_user_id', id);
    }
    setUserId(id);
    
    // 3. Kullanıcı verisini Firebase'den çek
    fetchUserData(id);
  }, []);

  const fetchUserData = async (id) => {
    if (!id) {
        setLoading(false);
        return;
    }
    try {
      // KRİTİK KONTROL: db bağlantısı var mı? (GCP hatası olursa bu korur)
      if (!db) {
          console.error("Firestore bağlantısı henüz hazır değil veya API anahtarı geçersiz.");
          setLoading(false);
          return;
      }
      
      const userRef = doc(db, "users", id);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        const initialData = { 
          favoriteWords: [],
          lastLogin: new Date().toISOString()
        };
        // Yeni kullanıcıysa, başlangıç verilerini kaydet
        await setDoc(userRef, initialData); 
        setUserData(initialData);
      }
    } catch (err) {
      // Hata olsa bile uygulamayı kitleme, sadece logla ve yüklemeyi tamamla
      console.error("Kullanıcı verisi çekilemedi/kaydedilemedi, misafir modu aktif:", err);
      setUserData({ favoriteWords: [], lastLogin: new Date().toISOString() }); // Varsayılan boş veri yükle
    } finally {
      setLoading(false);
    }
  };
  
  const updateUserData = async (data) => {
    if (!userId || !db) {
        console.error("Kullanıcı ID'si veya Firestore bağlantısı yok. Güncelleme yapılamadı.");
        return;
    }
    try {
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, { ...userData, ...data }, { merge: true });
      setUserData(prev => ({ ...prev, ...data }));
    } catch (err) {
      console.error("Veri güncelleme hatası:", err);
    }
  };

  const value = { userId, userData, loading, updateUserData };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};