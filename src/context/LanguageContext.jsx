import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from './translations'; // Çeviri dosyasını import ettik

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  
  // 1. Başlangıç dilini belirle (LocalStorage -> Tarayıcı Dili -> Varsayılan 'KU')
  const getInitialLanguage = () => {
    const savedLang = localStorage.getItem('siteLang');
    if (savedLang) return savedLang;

    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('tr')) return 'TR';
    if (browserLang.startsWith('en')) return 'EN';
    
    return 'KU'; // Varsayılan
  };

  const [lang, setLang] = useState(getInitialLanguage);

  // 2. Dili güvenli bir şekilde değiştir
  const changeLanguage = (languageCode) => {
    // Geçersiz bir dil kodu gelirse engelle
    if (!['KU', 'TR', 'EN'].includes(languageCode)) return;
    
    setLang(languageCode);
    localStorage.setItem('siteLang', languageCode);
  };

  // 3. HTML etiketini güncelle (SEO için)
  useEffect(() => {
    document.documentElement.lang = lang.toLowerCase();
  }, [lang]);

  // 4. Çeviri Fonksiyonu (EN ÖNEMLİ KISIM)
  // Kullanımı: t('welcome') -> "Bixêr hatî" (Eğer dil KU ise)
  const t = (key) => {
    // Seçili dilde bu anahtar var mı?
    if (translations[lang] && translations[lang][key]) {
      return translations[lang][key];
    }
    
    // Yoksa Fallback olarak İngilizce ver, o da yoksa anahtarın kendisini göster
    return translations['EN'][key] || key;
  };

  const value = {
    lang,
    changeLanguage,
    t, // Translate fonksiyonunu dışarı açıyoruz
    supportedLanguages: ['KU', 'TR', 'EN']
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);