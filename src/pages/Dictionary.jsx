import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Book, X, Loader2, AlertCircle, Heart, Copy, Check, Filter, BookOpen, Keyboard, Sparkles, Lightbulb, Grid, Quote, ArrowRightLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext'; 

// Verileri Dışarıdan Alıyoruz
import { STATIC_DICTIONARY, INTERNAL_DICTIONARY, KURDISH_CHARS } from '../data/dictionary';

// Firebase
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Dictionary = () => {
  const { t, lang } = useLanguage();
  const searchInputRef = useRef(null);
  
  const userContext = useUser();
  const userData = userContext?.userData || {};
  const updateUserData = userContext?.updateUserData || (() => {});

  const localT = {
    KU: { 
        desc: "Gencîneya peyvan, mînak û wateyan.",
        search_hint: "Lêgerînê dest pê bike...",
        special_chars: "Tîpên Taybet",
        total_db: "Di databasê de",
        words: "peyv hene",
        copy: "Kopyala",
        fav_add: "Li bijareyan zêde bike",
        copied: "Hat Kopyakirin!",
        random_explore: "Tesadûfî Bibîne",
        daily_word: "Peyva Îro",
        example: "Mînak / Daxuyanî",
        source_admin: "Fermî"
    },
    TR: { 
        desc: "Kelime hazinesi, örnekler ve anlamlar.",
        search_hint: "Aramaya başla...",
        special_chars: "Özel Karakterler",
        total_db: "Veritabanında",
        words: "kelime var",
        copy: "Kopyala",
        fav_add: "Favorilere ekle",
        copied: "Kopyalandı!",
        random_explore: "Rastgele Keşfet",
        daily_word: "Günün Kelimesi",
        example: "Örnek / Açıklama",
        source_admin: "Resmi"
    },
    EN: { 
        desc: "Vocabulary, examples and meanings.",
        search_hint: "Start searching...",
        special_chars: "Special Characters",
        total_db: "Database has",
        words: "words",
        copy: "Copy",
        fav_add: "Add to favorites",
        copied: "Copied!",
        random_explore: "Random Explore",
        daily_word: "Word of Today",
        example: "Example / Description",
        source_admin: "Official"
    }
  }[lang] || {};

  const [searchTerm, setSearchTerm] = useState("");
  const [allDictionaryData, setAllDictionaryData] = useState([]); 
  const [displayedWords, setDisplayedWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [dailyWord, setDailyWord] = useState(null);
  const [randomSuggestions, setRandomSuggestions] = useState([]);

  // --- HARF EKLEME ---
  const insertChar = (char) => {
      const input = searchInputRef.current;
      if (input) {
          const start = input.selectionStart;
          const end = input.selectionEnd;
          const newValue = searchTerm.substring(0, start) + char + searchTerm.substring(end);
          setSearchTerm(newValue);
          setTimeout(() => {
              input.selectionStart = input.selectionEnd = start + 1;
              input.focus();
          }, 0);
      }
  };

  // --- FAVORİ & KOPYALAMA ---
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
    updateUserData({ favoriteWords: newFavorites });
  };

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
        // 1. Firebase'den Veri Çek
        const q = query(collection(db, "dynamicContent"), where("type", "==", "dictionary"));
        const querySnapshot = await getDocs(q);
        const firebaseWords = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.ku && data.tr) { 
              firebaseWords.push({ 
                  id: doc.id, 
                  ku: data.ku, 
                  tr: data.tr, 
                  desc: data.desc || null, 
                  source: 'admin' 
              }); 
          }
        });

        // 2. VERİ BİRLEŞTİRME
        const dictionaryMap = new Map();

        // A. Kod İçi Yedekler
        INTERNAL_DICTIONARY.forEach(word => dictionaryMap.set(word.ku.toLowerCase(), word));

        // B. Statik Dosyadan Gelenler
        STATIC_DICTIONARY.forEach((word, index) => {
             // ID çakışmaması için statik verilere ID atıyoruz
             dictionaryMap.set(word.ku.toLowerCase(), { ...word, id: `static_${index}` });
        });

        // C. Firebase (En Güncel) - Diğerlerini ezer
        firebaseWords.forEach(word => dictionaryMap.set(word.ku.toLowerCase(), word));

        const uniqueList = Array.from(dictionaryMap.values());
        setAllDictionaryData(uniqueList);

        // Günün Kelimesi
        if (uniqueList.length > 0) {
            const today = new Date();
            const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
            const dailyIndex = seed % uniqueList.length;
            setDailyWord(uniqueList[dailyIndex]);

            const shuffled = [...uniqueList].sort(() => 0.5 - Math.random());
            setRandomSuggestions(shuffled.slice(0, 3));
        }

      } catch (err) {
        console.error("Hata:", err);
        setAllDictionaryData([...INTERNAL_DICTIONARY, ...STATIC_DICTIONARY]);
      } finally {
        setLoading(false);
      }
    };

    fetchDictionary();
  }, []); 

  // --- ARAMA MOTORU ---
  useEffect(() => {
      if (searchTerm.trim().length === 0) {
          setDisplayedWords([]);
          return;
      }
      const term = searchTerm.toLowerCase();
      
      const results = allDictionaryData.filter(item => 
          item.ku.toLowerCase().includes(term) || item.tr.toLowerCase().includes(term)
      );

      // Akıllı Sıralama
      results.sort((a, b) => {
          const aKu = a.ku.toLowerCase() === term;
          const aTr = a.tr.toLowerCase() === term;
          const bKu = b.ku.toLowerCase() === term;
          const bTr = b.tr.toLowerCase() === term;
          if ((aKu || aTr) && !(bKu || bTr)) return -1;
          if (!(aKu || aTr) && (bKu || bTr)) return 1;
          return 0;
      });

      setDisplayedWords(results.slice(0, 50));
  }, [searchTerm, allDictionaryData]);

  const handleQuickSearch = (term) => {
      setSearchTerm(term);
      if(searchInputRef.current) searchInputRef.current.focus();
  };

  const getDisplayContent = (word) => {
      const term = searchTerm.toLowerCase();
      let mainText = word.ku;
      let subText = word.tr;
      let mainLang = "KU";
      let subLang = "TR";

      if (term && word.tr.toLowerCase().includes(term) && !word.ku.toLowerCase().includes(term)) {
          mainText = word.tr;
          subText = word.ku;
          mainLang = "TR";
          subLang = "KU";
      }

      return { mainText, subText, mainLang, subLang };
  };

  return (
    <>
      <Helmet><title>{t('dictionary')} - YTU Kurdî</title></Helmet>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-28 pb-12 px-4 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">

          {/* BAŞLIK */}
          <div className="text-center mb-10">
              <h1 className="text-4xl font-black text-slate-800 dark:text-white mb-2">{t('dictionary')}</h1>
              <p className="text-slate-500 dark:text-slate-400 mb-8">{localT.desc}</p>

              <div className="relative max-w-2xl mx-auto group z-20">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative">
                      <input 
                          ref={searchInputRef}
                          type="text" 
                          placeholder={t('search_placeholder')} 
                          value={searchTerm} 
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-12 pr-12 py-4 rounded-xl border-none bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-xl focus:ring-0 text-lg font-medium placeholder-slate-400" 
                      />
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={24} />
                      {searchTerm && (
                          <button onClick={() => {setSearchTerm(""); setDisplayedWords([]);}} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-red-500 transition">
                              <X size={20} />
                          </button>
                      )}
                  </div>
              </div>

              {/* Sanal Klavye */}
              <div className="mt-6 max-w-2xl mx-auto bg-white/50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-2 mb-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <Keyboard size={12} /> {localT.special_chars}
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                      {KURDISH_CHARS.map(char => (
                          <button key={char} onClick={() => insertChar(char)} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-white font-bold shadow-sm border-b-2 border-slate-200 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-slate-600 hover:border-blue-300 hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm sm:text-base">
                              {char}
                          </button>
                      ))}
                  </div>
              </div>
          </div>

          {/* KEŞFET MODÜLLERİ (BOŞKEN) */}
          {!searchTerm && !loading && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  {dailyWord && (
                      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl group">
                          <div className="absolute top-0 right-0 p-4 opacity-20"><Sparkles size={64} /></div>
                          <div className="relative z-10 text-center">
                              <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase mb-4 backdrop-blur-sm">
                                  <Sparkles size={12} /> {localT.daily_word}
                              </div>
                              <h2 className="text-4xl md:text-5xl font-black mb-2">{dailyWord.ku}</h2>
                              <p className="text-xl md:text-2xl text-indigo-100 font-light">{dailyWord.tr}</p>
                              {dailyWord.desc && (
                                  <div className="mt-4 bg-white/10 p-3 rounded-xl backdrop-blur-sm text-sm italic text-indigo-50 border border-white/10">"{dailyWord.desc}"</div>
                              )}
                              <div className="mt-6 flex justify-center gap-4">
                                  <button onClick={() => toggleFavorite(dailyWord)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition backdrop-blur-md">
                                      <Heart size={20} className={isFavorite(dailyWord.ku) ? "fill-white text-white" : "text-white"} />
                                  </button>
                                  <button onClick={() => handleCopy(`${dailyWord.ku} - ${dailyWord.tr}`, 'daily')} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition backdrop-blur-md">
                                      {copiedId === 'daily' ? <Check size={20} /> : <Copy size={20} />}
                                  </button>
                              </div>
                          </div>
                      </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                          <h3 className="flex items-center gap-2 font-bold text-slate-800 dark:text-white mb-4"><Lightbulb className="text-yellow-500" size={20} /> {localT.random_explore}</h3>
                          <div className="space-y-3">
                              {randomSuggestions.map((item, i) => (
                                  <div key={i} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-700 transition cursor-pointer" onClick={() => handleQuickSearch(item.ku)}>
                                      <span className="font-bold text-slate-700 dark:text-slate-200">{item.ku}</span>
                                      <span className="text-sm text-slate-500">{item.tr}</span>
                                  </div>
                              ))}
                          </div>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                          <h3 className="flex items-center gap-2 font-bold text-slate-800 dark:text-white mb-4"><Grid className="text-blue-500" size={20} /> {t('quick_categories')}</h3>
                          <div className="grid grid-cols-2 gap-3">
                              {[{ label: t('cat_colors'), search: 'sor' }, { label: t('cat_numbers'), search: 'yek' }, { label: t('cat_days'), search: 'şemî' }, { label: t('cat_family'), search: 'dayik' }].map((cat, i) => (
                                  <button key={i} onClick={() => handleQuickSearch(cat.search)} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 transition text-left">{cat.label}</button>
                              ))}
                          </div>
                      </div>
                  </div>
                  <div className="text-center"><p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{localT.total_db}: {allDictionaryData.length} {localT.words}</p></div>
              </motion.div>
          )}

          {/* 3. ARAMA SONUÇLARI */}
          <div className="space-y-4">
            <AnimatePresence>
                {searchTerm && displayedWords.length === 0 && !loading && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-10">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400"><Search size={32} /></div>
                        <p className="text-slate-500 font-medium">Encam nehat dîtin / Sonuç bulunamadı.</p>
                    </motion.div>
                )}

                {displayedWords.map((word, index) => {
                    const isFav = isFavorite(word.ku);
                    const isCopied = copiedId === (word.id || word.ku);
                    const { mainText, subText, mainLang, subLang } = getDisplayContent(word);

                    return (
                        <motion.div
                            key={word.id || word.ku}
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: index * 0.05 }}
                            className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group"
                        >
                            <div className="p-6 flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${mainLang === 'KU' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>{mainLang}</span>
                                        <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{mainText}</h3>
                                        {word.source === 'admin' && (<span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold uppercase">{localT.source_admin}</span>)}
                                    </div>
                                    <div className="flex items-center gap-3 text-lg text-slate-500 dark:text-slate-400 font-medium">
                                        <ArrowRightLeft size={16} className="text-slate-300" />
                                        <span className="text-slate-700 dark:text-slate-200">{subText}</span>
                                        <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 rounded">{subLang}</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <button onClick={() => handleCopy(`${mainText} - ${subText}`, word.id || word.ku)} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" title={localT.copy}>{isCopied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}</button>
                                    <button onClick={() => toggleFavorite(word)} className={`p-2.5 rounded-xl transition-colors ${isFav ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-500' : 'bg-slate-50 dark:bg-slate-700 text-slate-400 hover:text-pink-500'}`} title={localT.fav_add}><Heart size={20} className={isFav ? "fill-current" : ""} /></button>
                                </div>
                            </div>
                            {word.desc && (
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border-t border-slate-100 dark:border-slate-700 flex gap-3">
                                    <Quote size={20} className="text-slate-300 flex-shrink-0" />
                                    <div><p className="text-xs font-bold text-slate-400 uppercase mb-1">{localT.example}</p><p className="text-slate-600 dark:text-slate-300 text-sm italic leading-relaxed">"{word.desc}"</p></div>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </>
  );
};

export default Dictionary;