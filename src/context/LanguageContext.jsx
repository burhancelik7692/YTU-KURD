import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // 1. Dil bilgisini localStorage'dan al, yoksa varsayılan 'KU' yap
  const [lang, setLang] = useState(() => {
    const savedLang = localStorage.getItem('siteLang');
    return savedLang || 'KU';
  });

  // 2. Dili değiştiren fonksiyon
  const changeLanguage = (languageCode) => {
    setLang(languageCode);
    localStorage.setItem('siteLang', languageCode);
  };

  // 3. Dil değiştiğinde HTML etiketini güncelle (SEO için)
  useEffect(() => {
    document.documentElement.lang = lang === 'KU' ? 'ku' : lang === 'TR' ? 'tr' : 'en';
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);