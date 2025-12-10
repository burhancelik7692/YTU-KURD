import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Book, X, Loader2, AlertCircle, Heart, Copy, Check, Filter, BookOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext'; 
import { siteContent } from '../data/locales';

// Firebase bağlantısı
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

// 1. KAYNAK: Dış Dosyadan Gelen Veri (src/data/dictionary.js dosyasından)
import { EXTERNAL_DICTIONARY } from '../data/dictionary';

// 2. KAYNAK: Sayfa İçindeki Acil Yedek Veri (İnternet yoksa veya dosya silinirse)
const INTERNAL_DICTIONARY = [
  { id: 'int_1', ku: 'Erê', tr: 'Evet' },
  { id: 'int_2', ku: 'Na', tr: 'Hayır' },
  { id: 'int_3', ku: 'Belê', tr: 'Evet (Onay)' },
  { id: 'int_4', ku: 'Nexêr', tr: 'Hayır (Red)' },
  { id: 'int_5', ku: 'Bibore', tr: 'Affedersin / Pardon' }
];

const Dictionary = () => {
  const { lang } = useLanguage();
  
  // UserContext'ten güvenli veri çekimi
  const userContext = useUser();
  const userData = userContext?.userData || {};
  const updateUserData = userContext?.updateUserData || (() => {});

  // Çeviriler (Eksikse varsayılan değerler)
  const t = {
    KU: { 
        title: "Ferhenga Kurdî", 
        desc: "Gencîneya peyvan bigere.",
        search: "Peyvê bigere...", 
        count: "peyv hat dîtin", 
        notFound: "Peyv nehat dîtin", 
        fav: "Bijare",
        all: "Hemû",
        copy: "Kopyala",
        copied: "Hat Kopyakirin!",
        total_label: "Hêjmara Peyvan"
    },
    TR: { 
        title: "Kürtçe Sözlük", 
        desc: "Kelime hazinesini keşfet.",
        search: "Kelime ara...", 
        count: "kelime bulundu", 
        notFound: "Kelime bulunamadı", 
        fav: "Favoriler",
        all: "Tümü",
        copy: "Kopyala",
        copied: "Kopyalandı!",
        total_label: "Kelime Sayısı"
    },
    EN: { 
        title: "Kurdish Dictionary", 
        desc: "Explore the vocabulary.",
        search: "Search word...", 
        count: "words found", 
        notFound: "Word not found", 
        fav: "Favorites",
        all: "All",
        copy: "Copy",
        copied: "Copied!",
        total_label: "Total Words"
    }
  }[lang] || { title: "Ferhenga Kurdî" };

  const [searchTerm, setSearchTerm] = useState("");
  const [dictionaryData, setDictionaryData] = useState([]); // Tüm veriler burada toplanacak
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeList, setActiveList] = useState('all'); 
  const [copiedId, setCopiedId] = useState(null);

  // --- FAVORİ İŞLEMLERİ ---
  const toggleFavorite = (wordObj) => {
    const wordKey = wordObj.ku; 
    const favorites = userData.favoriteWords || [];
    let newFavorites;

    if (favorites.includes(wordKey)) {
      newFavorites = favorites.filter(key => key !== wordKey);
    } else {
      newFavorites = [...favorites, wordKey];
    }
    updateUserData({ favoriteWords: newFavorites });
  };
  
  const isFavorite = (wordKey) => userData.favoriteWords?.includes(wordKey);

  // --- KOPYALAMA İŞLEMİ ---
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  
  // --- VERİ BİRLEŞTİRME VE ÇEKME (3 KAYNAK) ---
  useEffect(() => {
    const fetchAndMergeDictionary = async () => {
      try {
        // 3. KAYNAK: Firebase Admin Panelinden Gelenler
        const contentRef = collection(db, "dynamicContent");
        const q = query(contentRef, where("type", "==", "dictionary"));
        const querySnapshot = await getDocs(q);
        
        const firebaseWords = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.ku && data.tr) { 
              firebaseWords.push({ id: doc.id, ku: data.ku, tr: data.tr, source: 'admin' }); 
          }
        });

        // BİRLEŞTİRME MANTIĞI:
        // Öncelik Sırası: Admin (Firebase) > Dosya (External) > Kod İçi (Internal)
        // Aynı kelime (Kürtçesi aynı olan) varsa, en son eklenen listedeki geçerli olur.
        const allWords = [
            ...INTERNAL_DICTIONARY, 
            ...(EXTERNAL_DICTIONARY || []), 
            ...firebaseWords
        ];
        
        // Tekrarları Temizle (Kürtçe kelimeyi 'Key' yaparak)
        const uniqueMap = new Map();
        allWords.forEach(word => {
            // İlk harfi büyük yaparak standartlaştır
            if (word && word.ku) {
                const standardizedKey = word.ku.charAt(0).toUpperCase() + word.ku.slice(1).toLowerCase();
                uniqueMap.set(standardizedKey, { ...word, ku: standardizedKey });
            }
        });

        // Map'i tekrar diziye çevir ve sırala
        const uniqueList = Array.from(uniqueMap.values()).sort((a, b) => a.ku.localeCompare(b.ku));
        
        setDictionaryData(uniqueList); 

      } catch (err) {
        console.error("Sözlük veri hatası:", err);
        // Hata olsa bile en azından yerel dosyaları göster
        const fallback = [...INTERNAL_DICTIONARY, ...(EXTERNAL_DICTIONARY || [])];
        setDictionaryData(fallback);
        setError(lang === 'KU' ? "Pirsgirêka înternetê, tenê peyvên sabît tên nîşandan." : "Bağlantı hatası, sadece sabit kelimeler gösteriliyor.");
      } finally {
        setLoading(false);
      }
    };

    fetchAndMergeDictionary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // Arama ve Filtreleme
  const filteredWords = dictionaryData.filter(item => 
    item.ku.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.tr.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const wordsToShow = activeList === 'all' ? filteredWords : filteredWords.filter(item => isFavorite(item.ku));

  return (
    <>
      <Helmet>
        <title>{t.title} - YTU Kurdî</title>
      </Helmet>

      {/* Ana Kapsayıcı */}
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 transition-colors duration-300">
        <div className="max-w-5xl mx-auto">

          {/* 1. MODERN HEADER & İSTATİSTİK */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Sol: Başlık Kartı */}
              <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-indigo-900 dark:to-purple-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-center">
                  <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-2 opacity-80">
                          <BookOpen size={20} />
                          <span className="text-sm font-bold tracking-wider uppercase">Ferheng / Sözlük</span>
                      </div>
                      <h1 className="text-3xl md:text-4xl font-black mb-2">{t.title}</h1>
                      <p className="text-indigo-100 mb-6">{t.desc}</p>
                      
                      {/* --- YENİ EKLENEN TOPLAM SAYI BİLGİSİ --- */}
                      <div className="inline-flex items-center gap-2 bg-indigo-800/40 px-4 py-2 rounded-lg border border-indigo-400/30 text-indigo-50 text-sm font-medium backdrop-blur-md">
                          <Book size={16} />
                          <span>
                            {lang === 'KU' 
                                ? `Di ferhengê de ${dictionaryData.length} peyv hene.` 
                                : (lang === 'TR' ? `Sözlüğümüzde şu an ${dictionaryData.length} kelime bulunmaktadır.` : `There are currently ${dictionaryData.length} words.`)}
                          </span>
                      </div>
                  </div>
                  {/* Dekor */}
                  <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                      <Book size={120} />
                  </div>
              </div>

              {/* Sağ: İstatistik & Arama */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col justify-between">
                  <div className="mb-4">
                      <span className="text-slate-400 text-xs font-bold uppercase block mb-1">{t.total_label}</span>
                      <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400">{dictionaryData.length}</span>
                  </div>
                  
                  <div className="relative w-full">
                    <input 
                        type="text" 
                        placeholder={t.search} 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 transition-all font-medium" 
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    {searchTerm && (
                        <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-red-500">
                            <X size={16} />
                        </button>
                    )}
                  </div>
              </div>
          </div>

          {/* 2. FİLTRE & SONUÇ SAYISI */}
          <div className="flex items-center justify-between mb-6 px-2">
             <div className="flex gap-2">
                <button 
                    onClick={() => setActiveList('all')} 
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeList === 'all' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                >
                    <Filter size={16} /> {t.all}
                </button>
                <button 
                    onClick={() => setActiveList('favorites')} 
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeList === 'favorites' ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/30' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                >
                    <Heart size={16} className={activeList === 'favorites' ? "fill-current" : ""} /> {t.fav}
                    <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] px-2 py-0.5 rounded-full ml-1">
                        {userData.favoriteWords?.length || 0}
                    </span>
                </button>
             </div>
             <span className="text-xs font-bold text-slate-400 uppercase">
                {loading ? <Loader2 className="animate-spin" size={16} /> : <>{wordsToShow.length} {t.count}</>}
             </span>
          </div>

          {/* Hata Mesajı */}
          {error && (
             <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 p-4 rounded-xl flex items-center gap-3 mb-6 border border-yellow-100 dark:border-yellow-800">
                <AlertCircle size={20} /> <span className="text-sm font-medium">{error}</span>
             </div>
          )}

          {/* 3. KELİME KARTLARI IZGARASI */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {wordsToShow.length > 0 ? (
                wordsToShow.map((word) => {
                  const isFav = isFavorite(word.ku);
                  const isCopied = copiedId === word.id || copiedId === word.ku;

                  return (
                    <motion.div
                      key={word.id || word.ku}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 group relative flex flex-col justify-between h-full"
                    >
                      <div className="flex justify-between items-start mb-3">
                          <div>
                              <span className="text-2xl font-extrabold text-indigo-900 dark:text-indigo-100 tracking-tight block">
                                {word.ku}
                              </span>
                              {word.source === 'admin' && (
                                <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded ml-1">New</span>
                              )}
                          </div>
                          
                          <button 
                            onClick={() => toggleFavorite(word)} 
                            className={`p-2 rounded-full transition-colors ${isFav ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-500' : 'text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                          >
                              <Heart size={18} className={isFav ? "fill-current" : ""} />
                          </button>
                      </div>

                      <div className="flex justify-between items-end mt-2 pt-3 border-t border-slate-50 dark:border-slate-700/50">
                          <div className="flex-1">
                              <span className="text-sm font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Tirkî</span>
                              <span className="text-lg font-medium text-slate-700 dark:text-slate-300">{word.tr}</span>
                          </div>
                          
                          <button 
                            onClick={() => handleCopy(`${word.ku} - ${word.tr}`, word.id || word.ku)}
                            className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-700"
                            title={t.copy}
                          >
                              {isCopied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                          </button>
                      </div>
                      
                      <AnimatePresence>
                        {isCopied && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="absolute top-2 right-12 bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg z-10 pointer-events-none"
                            >
                                {t.copied}
                            </motion.div>
                        )}
                      </AnimatePresence>

                    </motion.div>
                  );
                })
              ) : (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="col-span-full text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700"
                >
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                      <Search size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 dark:text-white mb-2">{t.notFound}</h3>
                  <p className="text-slate-500 dark:text-slate-400">Ji kerema xwe peyveke din biceribîne.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default Dictionary;