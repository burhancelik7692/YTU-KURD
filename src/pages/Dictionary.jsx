import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Book, X, Loader2, AlertCircle, Heart, Copy, Check, Filter, BookOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext'; 

// Firebase
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

// --- YEDEK VERİLER ---
// Eğer dışarıdan bir dosya (dictionary.js) varsa onu kullanır, yoksa boş dizi döner.
let EXTERNAL_DATA = [];
try {
    // Eğer src/data/dictionary.js dosyanız varsa burayı açabilirsiniz:
    // const mod = require('../data/dictionary'); 
    // EXTERNAL_DATA = mod.EXTERNAL_DICTIONARY || [];
} catch (e) {
    console.log("External dictionary not found, skipping.");
}

// Acil Durum Verisi (İnternet yoksa veya veritabanı boşsa görünür)
const INTERNAL_DICTIONARY = [
  { id: 'int_1', ku: 'Erê', tr: 'Evet' },
  { id: 'int_2', ku: 'Na', tr: 'Hayır' },
  { id: 'int_3', ku: 'Spas', tr: 'Teşekkürler' },
  { id: 'int_4', ku: 'Rojbaş', tr: 'Günaydın / İyi günler' },
  { id: 'int_5', ku: 'Şevbaş', tr: 'İyi geceler' }
];

const Dictionary = () => {
  const { t, lang } = useLanguage(); // Global çeviri fonksiyonu
  
  // UserContext Güvenli Erişim
  const userContext = useUser();
  const userData = userContext?.userData || {};
  const updateUserData = userContext?.updateUserData || (() => {});

  // Sayfaya Özel Yerel Çeviriler (Global dosyada olmayanlar için)
  const localT = {
    KU: { 
        desc: "Gencîneya peyvan bigere.",
        fav: "Bijare",
        all: "Hemû",
        copied: "Hat Kopyakirin!",
        total_label: "Hêjmara Peyvan",
        count_suffix: "peyv hatin dîtin",
        not_found: "Peyv nehat dîtin"
    },
    TR: { 
        desc: "Kelime hazinesini keşfet.",
        fav: "Favoriler",
        all: "Tümü",
        copied: "Kopyalandı!",
        total_label: "Kelime Sayısı",
        count_suffix: "kelime bulundu",
        not_found: "Kelime bulunamadı"
    },
    EN: { 
        desc: "Explore the vocabulary.",
        fav: "Favorites",
        all: "All",
        copied: "Copied!",
        total_label: "Total Words",
        count_suffix: "words found",
        not_found: "Word not found"
    }
  }[lang] || {};

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [dictionaryData, setDictionaryData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeList, setActiveList] = useState('all'); 
  const [copiedId, setCopiedId] = useState(null);

  // --- FAVORİ İŞLEMLERİ ---
  const isFavorite = (wordKey) => (userData.favoriteWords || []).includes(wordKey);

  const toggleFavorite = (wordObj) => {
    const wordKey = wordObj.ku; 
    const favorites = userData.favoriteWords || [];
    let newFavorites;

    if (favorites.includes(wordKey)) {
      newFavorites = favorites.filter(key => key !== wordKey);
    } else {
      newFavorites = [...favorites, wordKey];
    }
    // Veritabanını/Locali güncelle
    updateUserData({ favoriteWords: newFavorites });
  };

  // --- KOPYALAMA ---
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  
  // --- VERİ ÇEKME ---
  useEffect(() => {
    const fetchDictionary = async () => {
      setLoading(true);
      try {
        // 1. Firebase'den Veri Çek (Admin Panelinden eklenenler)
        // type: 'dictionary' olanları getir
        const q = query(
            collection(db, "dynamicContent"), 
            where("type", "==", "dictionary")
        );
        
        const querySnapshot = await getDocs(q);
        const firebaseWords = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Veri bütünlüğünü kontrol et
          if (data.ku && data.tr) { 
              firebaseWords.push({ 
                  id: doc.id, 
                  ku: data.ku, 
                  tr: data.tr, 
                  source: 'admin',
                  createdAt: data.createdAt 
              }); 
          }
        });

        // 2. Verileri Birleştir (Firebase + Yerel + Dış)
        // Öncelik: Firebase > Dış Dosya > Yerel
        const combined = [
            ...INTERNAL_DICTIONARY,
            ...EXTERNAL_DATA,
            ...firebaseWords
        ];

        // 3. Tekrarları Temizle (Kürtçe kelimeye göre)
        const uniqueMap = new Map();
        combined.forEach(word => {
            if (word && word.ku) {
                // Baş harfi büyük yap
                const key = word.ku.charAt(0).toUpperCase() + word.ku.slice(1);
                uniqueMap.set(key, { ...word, ku: key });
            }
        });

        // 4. Alfabetik Sırala
        const sortedList = Array.from(uniqueMap.values()).sort((a, b) => a.ku.localeCompare(b.ku, 'ku'));
        
        setDictionaryData(sortedList);

      } catch (err) {
        console.error("Sözlük yükleme hatası:", err);
        // Hata durumunda sadece yerel veriyi göster
        setDictionaryData(INTERNAL_DICTIONARY);
        setError(t('error_generic') || "Veri yüklenirken hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchDictionary();
  }, [t]); 

  // --- FİLTRELEME ---
  const filteredWords = dictionaryData.filter(item => 
    item.ku.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.tr.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const wordsToShow = activeList === 'all' 
    ? filteredWords 
    : filteredWords.filter(item => isFavorite(item.ku));

  return (
    <>
      <Helmet>
        <title>{t('dictionary')} - YTU Kurdî</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-28 pb-12 px-4 transition-colors duration-300">
        <div className="max-w-5xl mx-auto">

          {/* 1. HEADER & İSTATİSTİK KARTI */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Sol: Başlık Alanı */}
              <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-indigo-900 dark:to-purple-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-center">
                  <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-2 opacity-80">
                          <BookOpen size={20} />
                          <span className="text-xs font-bold tracking-wider uppercase">YTU FERHENG</span>
                      </div>
                      <h1 className="text-3xl md:text-4xl font-black mb-2">{t('dictionary')}</h1>
                      <p className="text-indigo-100 mb-6">{localT.desc}</p>
                      
                      <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg border border-white/10 text-sm font-medium backdrop-blur-md">
                          <Book size={16} />
                          <span>{t('kurdish')} - {t('turkish')}</span>
                      </div>
                  </div>
                  {/* Dekoratif İkon */}
                  <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                      <Book size={120} />
                  </div>
              </div>

              {/* Sağ: Arama & Sayı */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col justify-between">
                  <div className="mb-4">
                      <span className="text-slate-400 text-xs font-bold uppercase block mb-1">{localT.total_label}</span>
                      <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400">{dictionaryData.length}</span>
                  </div>
                  
                  <div className="relative w-full">
                    <input 
                        type="text" 
                        placeholder={t('search_placeholder')} 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 transition-all font-medium outline-none" 
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

          {/* 2. FİLTRE BUTONLARI & SONUÇ BİLGİSİ */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 px-2">
              <div className="flex gap-2">
                 <button 
                    onClick={() => setActiveList('all')} 
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeList === 'all' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                 >
                    <Filter size={16} /> {localT.all}
                 </button>
                 <button 
                    onClick={() => setActiveList('favorites')} 
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeList === 'favorites' ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/30' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                 >
                    <Heart size={16} className={activeList === 'favorites' ? "fill-current" : ""} /> {localT.fav}
                    <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] px-2 py-0.5 rounded-full ml-1">
                        {userData.favoriteWords?.length || 0}
                    </span>
                 </button>
              </div>
              
              <span className="text-xs font-bold text-slate-400 uppercase">
                {loading ? <Loader2 className="animate-spin" size={16} /> : <>{wordsToShow.length} {localT.count_suffix}</>}
              </span>
          </div>

          {/* Hata Mesajı */}
          {error && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 p-4 rounded-xl flex items-center gap-3 mb-6 border border-yellow-100 dark:border-yellow-800">
                <AlertCircle size={20} /> <span className="text-sm font-medium">{error}</span>
              </div>
          )}

          {/* 3. KELİME KARTLARI */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {wordsToShow.length > 0 ? (
                wordsToShow.map((word) => {
                  const isFav = isFavorite(word.ku);
                  const isCopied = copiedId === (word.id || word.ku);

                  return (
                    <motion.div
                      key={word.id || word.ku}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 group relative flex flex-col justify-between h-full transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                          <div>
                              <span className="text-2xl font-extrabold text-indigo-900 dark:text-indigo-100 tracking-tight block">
                                {word.ku}
                              </span>
                              {/* Admin'den eklenenler için rozet */}
                              {word.source === 'admin' && (
                                <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded font-bold">Admin</span>
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
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">{t('turkish')}</span>
                              <span className="text-lg font-medium text-slate-700 dark:text-slate-300">{word.tr}</span>
                          </div>
                          
                          <button 
                            onClick={() => handleCopy(`${word.ku} - ${word.tr}`, word.id || word.ku)}
                            className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-700 relative"
                            title="Kopyala"
                          >
                              {isCopied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                              
                              {/* Kopyalandı Tooltip */}
                              <AnimatePresence>
                                {isCopied && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: -20 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute bottom-full right-0 mb-2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none"
                                    >
                                        {localT.copied}
                                    </motion.div>
                                )}
                              </AnimatePresence>
                          </button>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="col-span-full text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700"
                >
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                      <Search size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700 dark:text-white mb-1">{localT.not_found}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Ji kerema xwe peyveke din biceribîne.</p>
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