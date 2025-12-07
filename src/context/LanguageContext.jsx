import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Sayfa yenilendiğinde dil kaybolmasın diye localStorage kullanıyoruz
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('siteLang') || 'KU';
  });

  useEffect(() => {
    localStorage.setItem('siteLang', lang);
  }, [lang]);

  // Dilleri sırayla değiştirme fonksiyonu
  const toggleLanguage = () => {
    setLang((prev) => {
      if (prev === 'KU') return 'TR';
      if (prev === 'TR') return 'EN'; // İngilizce istemiyorsan bu satırı sil
      return 'KU';
    });
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);