import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Book, X, ArrowLeft, Loader2, AlertCircle, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext'; // Kullanıcı Context'i
import { siteContent } from '../data/locales';

// Firebase bağlantısı
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

// Statik kelimeler (Veritabanı boşsa veya yavaşsa bunlar görünür)
import { DICTIONARY as STATIC_DICTIONARY } from '../data/dictionary';

const Dictionary = () => {
  const { lang } = useLanguage();
  // Not: useUser'ı burada çağırmamız gerekiyor.
  const { userData, updateUserData } = useUser(); 

  const t = {
    KU: { title: "Ferhenga Kurdî", search: "Peyvê bigere...", back: "Vegere", count: "peyv hat dîtin", notFound: "Peyv nehat dîtin", fav: "Favorilerim" },
    TR: { title: "Kürtçe Sözlük", search: "Kelime ara...", back: "Geri", count: "kelime bulundu", notFound: "Kelime bulunamadı", fav: "Favorilerim" },
    EN: { title: "Kurdish Dictionary", search: "Search word...", back: "Back", count: "words found", notFound: "Word not found", fav: "My Favorites" }
  }[lang] || { title: "Ferhenga Kurdî" };

  const [searchTerm, setSearchTerm] = useState("");
  const [dictionaryData, setDictionaryData] = useState(STATIC_DICTIONARY); // Başlangıçta statik
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeList, setActiveList] = useState('all'); // all veya favorites

  // --- FAVORİ EKLE/ÇIKAR MANTIĞI ---
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
  
  const isFavorite = (wordKey) => {
    return userData.favoriteWords?.includes(wordKey);
  };
  
  // --- FIREBASE'DEN VERİ ÇEKME ---
  useEffect(() => {
    const fetchDictionary = async () => {
      try {
        const contentRef = collection(db, "dynamicContent");
        
        // Sadece 'dictionary' tipindeki verileri çek
        const q = query(contentRef, where("type", "==", "dictionary"));
        const querySnapshot = await getDocs(q);
        
        const firebaseWords = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.ku && data.tr) { 
              firebaseWords.push({ ku: data.ku, tr: data.tr }); 
          }
        });

        // Statik ve dinamik kelimeleri birleştir
        const combined = [...STATIC_DICTIONARY, ...firebaseWords];
        
        // Tekrarlayanları temizle
        const uniqueWords = Array.from(new Set(combined.map(w => w.ku))).map(ku => combined.find(w => w.ku === ku));
        
        setDictionaryData(uniqueWords); 

      } catch (err) {
        console.error("Sözlük verisi çekilemedi:", err);
        setError("Veritabanı bağlantı hatası.");
      } finally {
        setLoading(false);
      }
    };

    fetchDictionary();
  }, [userData.favoriteWords]); 

  
  // Arama Mantığı
  const filteredWords = dictionaryData.filter(item => 
    item.ku.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.tr.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.ku.localeCompare(b.ku));

  
  // Hangi liste gösterilecek?
  const wordsToShow = activeList === 'all' ? filteredWords : filteredWords.filter(item => isFavorite(item.ku));


  return (
    <>
      <Helmet><title>{t.title} - YTU Kurdî</title></Helmet>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 transition-colors duration-300">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-blue-900 dark:hover:text-white mb-6 transition group">
            <ArrowLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" /> {t.back}
          </Link>

          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 mb-8 border border-slate-100 dark:border-slate-700 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-purple-600"></div>
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400"><Book size={32} /></div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-6">{t.title}</h1>
            
            <div className="relative max-w-lg mx-auto">
              <input type="text" placeholder={t.search} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-lg font-medium" />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={24} />
              {searchTerm && <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-red-500"><X size={20} /></button>}
            </div>
            <p className="mt-4 text-sm text-slate-400 dark:text-slate-500 font-medium">
                {loading ? <Loader2 className="animate-spin inline-block mr-2" size={16} /> : `${wordsToShow.length} ${t.count}`}
            </p>
            {error && (
               <div className="text-center bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-2 rounded-xl flex items-center justify-center gap-1 mt-4 text-xs">
                 <AlertCircle size={16} /> {error}
               </div>
            )}
          </div>

          {/* FİLTRE TABS (Tüm Kelimeler / Favoriler) */}
          <div className="flex justify-center gap-3 mb-6">
              <button 
                  onClick={() => setActiveList('all')} 
                  className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${activeList === 'all' ? 'bg-blue-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border'}`}
              >
                  {lang === 'KU' ? 'Hemû Peyv' : 'Tüm Kelimeler'}
              </button>
              <button 
                  onClick={() => setActiveList('favorites')} 
                  className={`px-5 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${activeList === 'favorites' ? 'bg-pink-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border'}`}
              >
                  <Heart size={16} fill="currentColor" /> {t.fav} ({userData.favoriteWords?.length || 0})
              </button>
          </div>


          {/* Sonuç Listesi */}
          <motion.div layout className="grid gap-3">
            <AnimatePresence>
              {wordsToShow.length > 0 ? (
                wordsToShow.map((word, index) => {
                  const isFav = isFavorite(word.ku);
                  return (
                    <motion.div
                      key={word.ku + word.tr} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex justify-between items-center group cursor-default"
                    >
                      <div className="flex-1"><span className="text-xl font-bold text-blue-900 dark:text-blue-300 block">{word.ku}</span><span className="text-xs text-slate-400 font-bold tracking-wider uppercase">Kurdî</span></div>
                      
                      <div className="flex items-center gap-4">
                          {/* FAVORİ BUTONU */}
                          <button onClick={() => toggleFavorite(word)} className="p-2 rounded-full hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors">
                              <Heart size={20} className={isFav ? "text-pink-600 fill-pink-600" : "text-slate-300 dark:text-slate-600"} />
                          </button>
                          
                          <div className="text-slate-300 dark:text-slate-600 mx-2"><ArrowLeft size={20} className="rotate-180" /></div>
                          
                          <div className="flex-1 text-right">
                              <span className="text-lg font-medium text-slate-600 dark:text-slate-300 block">{word.tr}</span>
                              <span className="text-xs text-slate-400 font-bold tracking-wider uppercase">Tirkî</span>
                          </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">{t.notFound}</h3>
                  <p className="text-slate-500 dark:text-slate-400">Ji kerema xwe peyveke din biceribîne.</p>
                </div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default Dictionary;