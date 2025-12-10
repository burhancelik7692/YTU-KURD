import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Giriş İşlemleri ---

  // 1. E-posta/Şifre Girişi
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // 2. Google ile Giriş
  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Kullanıcı veritabanında var mı kontrol et
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      // Eğer ilk kez giriyorsa Firestore'a kaydet
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          role: 'standard', // Varsayılan rol
          createdAt: new Date(),
        });
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  // --- Kayıt İşlemleri ---

  const register = async (email, password, name, role = 'standard') => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Firestore'a detaylı kayıt
    await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: name,
        role: role, 
        uid: user.uid,
        createdAt: new Date(),
        photoURL: user.photoURL || null
    }, { merge: true }); // merge: true güvenli güncelleme sağlar
    
    return userCredential;
  };

  // --- Yardımcı İşlemler ---

  const resetPassword = (email) => {
      return sendPasswordResetEmail(auth, email);
  };

  const logout = () => {
    return signOut(auth);
  };

  // --- Durum İzleyici (Listener) ---
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Kullanıcı giriş yaptıysa, Firestore'dan rol ve isim bilgisini çek
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            // Auth bilgisi ile Firestore verisini birleştiriyoruz
            setCurrentUser({ ...user, ...docSnap.data() });
          } else {
            // Veritabanında kaydı yoksa sadece auth bilgisini koy
            setCurrentUser(user);
          }
        } catch (error) {
          console.error("Kullanıcı verisi çekilirken hata:", error);
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    googleLogin,
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