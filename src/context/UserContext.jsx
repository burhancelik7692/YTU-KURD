import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase'; 
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext'; // AuthContext'i dinlemek için çağırıyoruz

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  // AuthContext'ten kullanıcı durumunu al
  const { currentUser, loading: authLoading } = useAuth();
  
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  
  const initialUserData = { 
    favoriteWords: [],
    lastLogin: new Date().toISOString()
  };

  // Firestore'dan veriyi çekme/kaydetme
  const fetchUserData = async (id) => {
    if (!id || !db) {
        setLoading(false);
        return;
    }
    setLoading(true);
    try {
      const userRef = doc(db, "users", id);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        await setDoc(userRef, initialUserData); 
        setUserData(initialUserData);
      }
    } catch (err) {
      console.error("Kullanıcı verisi çekilemedi/kaydedilemedi, misafir modu aktif:", err);
      setUserData(initialUserData); 
    } finally {
      setLoading(false);
    }
  };

  // --- ANA YÖNETİM HOOK'U ---
  useEffect(() => {
    // 1. Auth yüklenene kadar bekle
    if (authLoading) return;
    
    let currentId = null;
    
    if (currentUser) {
        // 2. Giriş yapmış kullanıcı: Firebase UID kullan
        currentId = currentUser.uid;
        localStorage.setItem('ytu_user_id', currentUser.uid);
    } else {
        // 3. Anonim kullanıcı: LocalStorage'daki misafir ID'sini kullan
        let localId = localStorage.getItem('ytu_user_id');
        if (!localId || localId.startsWith('guest_')) {
             // Eğer ID yoksa veya eski misafir ID'si ise yeni misafir ID'si oluştur
             localId = `guest_${Date.now()}_${Math.floor(Math.random() * 9999)}`;
             localStorage.setItem('ytu_user_id', localId);
        }
        currentId = localId;
    }
    
    setUserId(currentId);
    fetchUserData(currentId);
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, authLoading]); // currentUser veya Auth durumu değiştiğinde çalış

  // Veri Güncelleme Fonksiyonu
  const updateUserData = async (data) => {
    if (!userId || !db) {
      console.error("Kullanıcı ID'si veya Firestore bağlantısı yok. Güncelleme yapılamadı.");
      return;
    }
    try {
      const userRef = doc(db, "users", userId);
      
      const newData = { ...userData, ...data };
      
      await setDoc(userRef, newData, { merge: true });
      setUserData(newData); // Local state'i anında güncelle
      
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