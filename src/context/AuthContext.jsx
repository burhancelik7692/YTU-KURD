import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase'; 
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Yükleme durumu

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false); // Kullanıcı durumu belirlendiğinde yükleme biter
    });
    return unsubscribe;
  }, []);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = { currentUser, login, logout, loading }; // Loading'i de dışa aktardık

  return (
    <AuthContext.Provider value={value}>
      {/* Loading true ise, beklemeye devam et */}
      {children}
    </AuthContext.Provider>
  );
};