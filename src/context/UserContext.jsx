import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase'; 
import { doc, getDoc, setDoc } from 'firebase/firestore';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  // Veri çekme ve kullanıcı tanımlama
  const fetchUserData = async (id) => {
    if (!id || !db) {
        // Firestore bağlantısı yoksa, beklemeden misafir modunda başlat
        setLoading(false);
        return;
    }
    try {
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
      // Hata olsa bile uygulamayı kitleme, varsayılan veriyle başlat
      console.error("Kullanıcı verisi çekilemedi/kaydedilemedi, misafir modu aktif:", err);
      setUserData({ favoriteWords: [], lastLogin: new Date().toISOString() }); 
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    // ID oluşturma veya yükleme
    let id = localStorage.getItem('ytu_user_id');

    if (!id) {
      id = `guest_${Date.now()}_${Math.floor(Math.random() * 9999)}`;
      localStorage.setItem('ytu_user_id', id);
    }
    setUserId(id);
    
    fetchUserData(id);
  }, []);
  
  // Veri Güncelleme Fonksiyonu
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