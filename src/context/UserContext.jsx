import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { db } from '../firebase';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const { currentUser, loading: authLoading } = useAuth();
  
  // Varsayılan boş kullanıcı şablonu
  const defaultUserData = { 
    favoriteWords: [],
    role: 'guest',
    name: 'Misafir',
    theme: 'light',
    language: 'tr'
  };

  const [userData, setUserData] = useState(defaultUserData);
  const [loading, setLoading] = useState(true);

  // --- 1. Durum Senkronizasyonu ---
  // AuthContext veya LocalStorage'dan veriyi alıp state'e işler
  useEffect(() => {
    if (authLoading) return;

    if (currentUser) {
      // SENARYO A: Kullanıcı Giriş Yapmış
      // AuthContext zaten Firestore verisini çektiği için direkt kullanıyoruz.
      setUserData({
        ...defaultUserData, // Eksik alan varsa varsayılanı kullan
        ...currentUser      // Firestore'dan gelen güncel veri
      });
    } else {
      // SENARYO B: Misafir Kullanıcı
      // Veriyi tarayıcı hafızasından (LocalStorage) çek
      const localData = localStorage.getItem('guest_preferences');
      if (localData) {
        setUserData({ ...defaultUserData, ...JSON.parse(localData) });
      } else {
        setUserData(defaultUserData);
      }
    }
    setLoading(false);
  }, [currentUser, authLoading]);


  // --- 2. Veri Güncelleme Fonksiyonu ---
  // Tek bir fonksiyon hem misafiri hem üyeyi yönetir
  const updateUserData = async (newData) => {
    // Önce arayüzü anında güncelle (Optimistic UI)
    const updatedState = { ...userData, ...newData };
    setUserData(updatedState);

    try {
      if (currentUser) {
        // Üye ise -> Firestore'a yaz
        const userRef = doc(db, "users", currentUser.uid);
        await setDoc(userRef, newData, { merge: true });
      } else {
        // Misafir ise -> LocalStorage'a yaz
        // Sadece kalıcı olması gereken verileri sakla (role: guest olarak kalmalı)
        const dataToSave = {
            favoriteWords: updatedState.favoriteWords,
            theme: updatedState.theme,
            language: updatedState.language
        };
        localStorage.setItem('guest_preferences', JSON.stringify(dataToSave));
      }
    } catch (err) {
      console.error("Veri güncellenirken hata oluştu:", err);
      // Hata olursa state'i geri alabilirsin (Opsiyonel)
    }
  };

  const value = { 
    userData,     // Kullanıcının tüm verileri (isim, rol, favoriler vb.)
    updateUserData, // Veri güncelleme fonksiyonu
    loading,
    isGuest: !currentUser // Kolay kontrol için bir bayrak
  };

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
};