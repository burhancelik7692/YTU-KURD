import React, { createContext, useContext, useEffect, useState } from 'react';

// Firestore/Firebase bağlantılarını kontrol edin
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
      // 2. ID yoksa, yeni benzersiz ID oluştur (Basit bir zaman damgası)
      id = `guest_${Date.now()}_${Math.floor(Math.random() * 9999)}`;
      localStorage.setItem('ytu_user_id', id);
    }
    setUserId(id);
    
    // 3. Kullanıcı verisini Firebase'den çek
    fetchUserData(id);
  }, []);

  const fetchUserData = async (id) => {
    if (!id) return;
    try {
      const userRef = doc(db, "users", id);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        // Veri varsa yükle
        setUserData(docSnap.data());
      } else {
        // Yeni kullanıcıysa, başlangıç verilerini kaydet
        const initialData = { 
          favoriteWords: [],
          lastLogin: new Date().toISOString()
        };
        await setDoc(userRef, initialData);
        setUserData(initialData);
      }
    } catch (err) {
      console.error("Kullanıcı verisi çekilemedi:", err);
    } finally {
      setLoading(false);
    }
  };
  
  // Veri Güncelleme Fonksiyonu
  const updateUserData = async (data) => {
    if (!userId) return;
    try {
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, { ...userData, ...data }, { merge: true });
      setUserData(prev => ({ ...prev, ...data })); // Yerel state'i güncelle
    } catch (err) {
      console.error("Veri güncelleme hatası:", err);
    }
  };

  const value = { userId, userData, loading, updateUserData };

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
};