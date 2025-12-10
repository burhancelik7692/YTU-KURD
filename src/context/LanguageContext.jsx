import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Başlangıçta localStorage'a bak, yoksa 'KU' (Kürtçe) olsun
  const [lang, setLang] = useState(() => {
    const savedLang = localStorage.getItem('siteLang');
    return savedLang || 'KU';
  });

  const changeLanguage = (languageCode) => {
    setLang(languageCode); // State'i güncelle (Anlık değişim için şart)
    localStorage.setItem('siteLang', languageCode); // Hafızaya kaydet (Yenileyince gitmesin diye)
  };

  // Dil değiştiğinde HTML'in "lang" etiketini de değiştir (SEO için)
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