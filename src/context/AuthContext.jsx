import React, { createContext, useContext, useEffect, useState } from 'react';
// auth servisini firebase dosyasından içe aktarıyoruz
import { auth } from '../firebase'; 
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const AuthContext = createContext();

// Hızlı kullanım kancası (hook)
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Uygulama yüklendiğinde oturum durumunu dinler
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    // Temizlik fonksiyonu (component kalkınca dinlemeyi durdur)
    return unsubscribe;
  }, []);

  // Giriş yapma fonksiyonu
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Çıkış yapma fonksiyonu
  const logout = () => {
    return signOut(auth);
  };

  const value = { currentUser, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {/* Yükleme bittiğinde çocuk bileşenleri göster */}
      {!loading && children}
    </AuthContext.Provider>
  );
};