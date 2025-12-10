import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext'; // AuthContext'i dinlemek için
import { db } from '../firebase'; // Firebase bağlantısı

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  // AuthContext'ten kullanıcı durumunu al
  const { currentUser, loading: authLoading } = useAuth();
  
  const [userId, setUserId] = useState(null);
  const [userProfile, setUserProfile] = useState({}); // Veriyi bu state'te tutuyoruz
  const [loading, setLoading] = useState(true);
  
  const initialUserData = { 
    favoriteWords: [],
    role: 'guest', // Varsayılan rol
    name: 'Anonim',
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
        setUserProfile(docSnap.data());
      } else {
        // Yeni kayıt olan Firebase kullanıcısı (uid)
        if (currentUser && currentUser.uid === id) {
             const signedInUserInitialData = { 
                ...initialUserData, 
                role: 'standard', 
                name: currentUser.email.split('@')[0],
                email: currentUser.email,
                lastLogin: new Date().toISOString()
             };
             await setDoc(userRef, signedInUserInitialData);
             setUserProfile(signedInUserInitialData);
        } else {
            // Tamamen anonim veya misafir
            setUserProfile(initialUserData); 
        }
      }
    } catch (err) {
      console.error("Kullanıcı verisi çekilemedi/kaydedilemedi:", err);
      setUserProfile(initialUserData); 
    } finally {
      setLoading(false);
    }
  };

  // --- KULLANICI ID YÖNETİMİ VE VERİ ÇEKME ---
  useEffect(() => {
    if (authLoading) return; // Auth yüklenene kadar bekle
    
    let currentId = null;
    
    if (currentUser) {
        // Oturum açan kullanıcı (Firebase UID)
        currentId = currentUser.uid;
    } else {
        // Anonim kullanıcı (Local ID)
        let localId = localStorage.getItem('ytu_user_id');
        if (!localId || !localId.startsWith('guest_')) {
             // Yeni misafir ID'si oluştur
             localId = `guest_${Date.now()}_${Math.floor(Math.random() * 9999)}`;
             localStorage.setItem('ytu_user_id', localId);
        }
        currentId = localId;
    }
    
    setUserId(currentId);
    fetchUserData(currentId);
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, authLoading]); 

  // Veri Güncelleme Fonksiyonu
  const updateUserData = async (data) => {
    if (!userId || !db) {
      console.error("Güncelleme yapılamadı.");
      return;
    }
    try {
      const userRef = doc(db, "users", userId);
      const newData = { ...userProfile, ...data };
      
      await setDoc(userRef, newData, { merge: true });
      setUserProfile(newData); // Local state'i anında güncelle
      
    } catch (err) {
      console.error("Veri güncelleme hatası:", err);
    }
  };

  // userData'yı userProfile olarak güncelledik (daha anlaşılır olması için)
  const value = { userId, userData: userProfile, loading, updateUserData };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};