import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; // db eklendi

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Giriş
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Kayıt Ol
  const register = async (email, password, name, role = 'standard') => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Firestore'a rol ve isim kaydet
    await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: name,
        role: role, // Varsayılan: standard
        createdAt: new Date(),
    }, { merge: true });
    
    return userCredential;
  };

  // Şifre Sıfırlama
  const resetPassword = (email) => {
      return sendPasswordResetEmail(auth, email);
  };

  // Çıkış Yap
  const logout = () => {
    return signOut(auth);
  };

  // Kullanıcı Durumunu İzle
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    register,
    resetPassword,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};