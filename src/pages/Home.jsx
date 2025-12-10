import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, Music, Palette, History, Languages, 
  Calendar, MapPin, Ticket, FileText, Image as ImageIcon, 
  Search, ArrowRight, Sparkles, Star, Zap, Video, Mail, CheckCircle2, ArrowUpRight, Copy, Check, ExternalLink
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { siteContent } from '../data/locales';
import { STATIC_DICTIONARY } from '../data/dictionary'; // Günün kelimesi için
import { db } from '../firebase'; 
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'; 

const Home = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  
  // --- PARALAKS EFEKTLERİ ---
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacityHero = useTransform(scrollY, [0, 400], [1, 0]);

  // --- STATE ---
  const [heroData, setHeroData] = useState(siteContent[lang]?.home || {});
  const [nextEvent, setNextEvent] = useState(null);
  const [recentContent, setRecentContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dailyWord, setDailyWord] = useState(null);
  const [copiedDaily, setCopiedDaily] = useState(false);

  // Arama State'leri
  const [searchTerm, setSearchTerm] = useState('');
  const [allSearchData, setAllSearchData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);

  // İstatistik State'i
  const [stats, setStats] = useState({ words: 0, posts: 0, photos: 0 });

  // --- 1. GÜNÜN KELİMESİ MANTIĞI ---
  useEffect(() => {
    if (STATIC_DICTIONARY.length > 0) {
        const today = new Date();
        // Tarihe dayalı rastgelelik (Seed) - Her gün aynı kelimeyi seçer
        const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        const dailyIndex = seed % STATIC_DICTIONARY.length;
        setDailyWord(STATIC_DICTIONARY[dailyIndex]);
    }
  }, []);

  const handleCopyDaily = () => {
      if(dailyWord) {
          navigator.clipboard.writeText(`${dailyWord.ku} - ${dailyWord.tr}`);
          setCopiedDaily(true);
          setTimeout(() => setCopiedDaily(false), 2000);
      }
  };

  // --- 2. VERİ ÇEKME (Firebase) ---
  useEffect(() => {
    const fetchData = async () => {
        try {
            // A. Site Ayarları
            const settingsRef = doc(db, "settings", "home");
            const settingsSnap = await getDoc(settingsRef);
            if (settingsSnap.exists()) {
                const data = settingsSnap.data();
                setHeroData(prev => ({ ...prev, ...data })); 
            }

            // B. Tüm İçerik (Tek seferde çekip istemcide filtreliyoruz - Performans ve Arama için)
            const contentRef = collection(db, "dynamicContent");
            const q = query(contentRef, where("type", "in", ["blog", "gallery", "event", "dictionary"]));
            const querySnapshot = await getDocs(q);
            const allData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Arama Havuzunu Doldur
            setAllSearchData(allData);

            // İstatistikleri Hesapla
            setStats({
                words: allData.filter(i => i.type === 'dictionary').length + STATIC_DICTIONARY.length, // Statik + Dinamik
                posts: allData.filter(i => i.type === 'blog').length,
                photos: allData.filter(i => i.type === 'gallery').length
            });

            // C. Sıradaki Etkinlik (Tarihi geçmemiş en yakın etkinlik)
            const today = new Date().toISOString().split('T')[0];
            const upcoming = allData
                .filter(item => item.type === 'event' && item.date >= today)
                .sort((a, b) => a.date.localeCompare(b.date));
            if (upcoming.length > 0) setNextEvent(upcoming[0]);

            // D. Son Eklenenler (Blog & Galeri)
            const recents = allData
                .filter(item => item.type === 'blog' || item.type === 'gallery')
                .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
                .slice(0, 3);
            setRecentContent(recents);

        } catch (err) {
            console.error("Veri hatası:", err);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [lang]);

  // --- 3. ARAMA MANTIĞI ---
  useEffect(() => {
      if (searchTerm.trim().length === 0) { setSearchResults([]); return; }
      const term = searchTerm.toLowerCase();
      
      const results = allSearchData.filter(item => 
          (item.title?.toLowerCase().includes(term)) ||
          (item.ku?.toLowerCase().includes(term)) ||
          (item.tr?.toLowerCase().includes(term)) ||
          (item.desc?.toLowerCase().includes(term))
      ).slice(0, 5); // Maksimum 5 sonuç göster
      
      setSearchResults(results);
  }, [searchTerm, allSearchData]);

  // Arama dışına tıklayınca kapat
  useEffect(() => {
      const handleClickOutside = (event) => {
          if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
              setIsSearchFocused(false);
          }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (item) => {
      setSearchTerm('');
      setIsSearchFocused(false);
      if (item.type === 'dictionary') navigate('/ferheng');
      else if (item.type === 'gallery') navigate('/galeri');
      else if (item.type === 'blog') navigate('/agahdari');
      else if (item.type === 'event') document.getElementById('event-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const getTypeIcon = (type) => {
      switch(type) {
          case 'dictionary': return <BookOpen size={16} className="text-purple-500" />;
          case 'blog': return <FileText size={16} className="text-blue-500" />;
          case 'gallery': return <ImageIcon size={16} className="text-orange-500" />;
          case 'event': return <Ticket size={16} className="text-red-500" />;
          default: return <Search size={16} />;
      }
  };

  // --- KARTLAR ---
  const cards = siteContent[lang]?.cards || {};
  const features = [
    { icon: Languages, title: cards.zimanTitle || 'Ziman', desc: cards.zimanDesc, path: '/ziman', color: 'from-blue-500 to-blue-700' },
    { icon: BookOpen, title: cards.candTitle || 'Çand', desc: cards.candDesc, path: '/cand', color: 'from-cyan-500 to-cyan-700' },
    { icon: History, title: cards.dirokTitle || 'Dîrok', desc: cards.dirokDesc, path: '/dirok', color: 'from-slate-500 to-slate-700' },
    { icon: Music, title: cards.muzikTitle || 'Muzîk', desc: cards.muzikDesc, path: '/muzik', color: 'from-indigo-500 to-indigo-700' },
    { icon: Palette, title: cards.hunerTitle || 'Huner', desc: cards.hunerDesc, path: '/huner', color: 'from-teal-500 to-teal-700' },
    { icon: FileText, title: t('blog'), desc: t('recent_content'), path: '/agahdari', color: 'from-pink-500 to-rose-600' }
  ];

  return (
    <>
      <Helmet><title>{heroData.heroTitle1 || 'YTU Kurdî'}</title></Helmet>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 overflow-x-hidden font-sans">
        
        {/* ================= HERO BÖLÜMÜ ================= */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 z-0 bg-slate-900">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
             {/* Paralaks Baloncuklar */}
             <motion.div style={{ y: y1 }} className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600 rounded-full blur-[150px] opacity-20"></motion.div>
             <motion.div style={{ y: y2 }} className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600 rounded-full blur-[150px] opacity-20"></motion.div>
          </div>

          <motion.div 
            style={{ opacity: opacityHero }}
            className="max-w-5xl mx-auto text-center relative z-10 px-4 w-full"
          >
            {/* Logo */}
            <div className="relative inline-block mb-8 group cursor-default">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <motion.img 
                    initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", damping: 20 }}
                    src="/logo.png" alt="YTU Kurdî" className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/10 shadow-2xl relative z-10" 
                />
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
              {heroData.heroTitle1} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-200">{heroData.heroTitle2}</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">{heroData.heroSubtitle}</p>

            {/* --- AKILLI ARAMA ÇUBUĞU --- */}
            <div className="max-w-2xl mx-auto mb-8 relative z-50" ref={searchContainerRef}>
                <div className={`relative transition-all duration-300 ${isSearchFocused ? 'scale-105' : 'scale-100'}`}>
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                    <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex items-center p-2 border border-white/10">
                        <Search className="text-slate-400 ml-3" size={24} />
                        <input 
                            type="text" placeholder={t('search_placeholder') || "Li seranserê malperê bigere..."} 
                            className="w-full py-4 px-4 bg-transparent text-slate-800 dark:text-white text-lg font-medium placeholder-slate-400 outline-none"
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onFocus={() => setIsSearchFocused(true)}
                        />
                        {searchTerm && <button onClick={() => setSearchTerm('')} className="p-2 text-slate-400 hover:text-red-500 transition"><X size={20} /></button>}
                        <button onClick={() => navigate('/ferheng')} className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-all shadow-lg"><ArrowRight size={20} /></button>
                    </div>
                </div>

                {/* Popüler Aramalar (YENİ) */}
                {!searchTerm && !isSearchFocused && (
                  <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-slate-400">
                    <span className="opacity-70 mr-2 flex items-center gap-1"><Zap size={12} className="text-yellow-400" /> Trend:</span>
                    {['Rojbaş', 'Evîn', 'Newroz', 'Ziman'].map(tag => (
                      <button key={tag} onClick={() => {setSearchTerm(tag); navigate('/ferheng')}} className="hover:text-white hover:underline transition">{tag}</button>
                    ))}
                  </div>
                )}

                {/* Dropdown Sonuçlar */}
                <AnimatePresence>
                    {isSearchFocused && searchTerm && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 right-0 mt-4 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50">
                            {searchResults.length > 0 ? (
                                <ul>
                                    {searchResults.map((item) => (
                                        <li key={item.id} onClick={() => handleResultClick(item)} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer border-b border-slate-100 dark:border-slate-700 last:border-0 transition-colors text-left">
                                            <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg text-blue-500">
                                                {getTypeIcon(item.type)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 dark:text-white text-sm">{item.type === 'dictionary' ? `${item.ku} - ${item.tr}` : item.title}</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{t(item.type) || item.type}</p>
                                            </div>
                                            <ArrowUpRight size={16} className="ml-auto text-slate-300" />
                                        </li>
                                    ))}
                                    <li className="p-3 text-center bg-slate-50 dark:bg-slate-900 text-xs font-bold text-blue-500 cursor-pointer hover:underline" onClick={() => navigate('/ferheng')}>
                                        Hemû encaman bibîne...
                                    </li>
                                </ul>
                            ) : (
                                <div className="p-6 text-center text-slate-500"><p>Encam nehat dîtin.</p></div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
          </motion.div>

          {/* İstatistik Bandı */}
          <div className="absolute bottom-0 w-full bg-white/5 backdrop-blur-sm border-t border-white/5 py-4 hidden md:block">
             <div className="max-w-6xl mx-auto flex justify-center gap-12 text-slate-400 text-sm font-bold uppercase tracking-widest">
                 <div className="flex items-center gap-2"><BookOpen size={16} className="text-blue-500"/> {stats.words}+ {t('total_words')}</div>
                 <div className="flex items-center gap-2"><FileText size={16} className="text-purple-500"/> {stats.posts} {t('total_blogs')}</div>
                 <div className="flex items-center gap-2"><ImageIcon size={16} className="text-orange-500"/> {stats.photos} {t('total_photos')}</div>
             </div>
          </div>
        </section>

        {/* ================= 2. İKİLİ BÖLÜM: ETKİNLİK & GÜNÜN KELİMESİ ================= */}
        <section id="event-section" className="relative z-20 px-4 -mt-12 pb-12">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* SOL: ETKİNLİK KARTI */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-1 overflow-hidden shadow-2xl relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 opacity-20 blur-xl group-hover:opacity-40 transition duration-700"></div>
                    <div className="relative bg-slate-900 rounded-[2.4rem] h-full overflow-hidden flex flex-col md:flex-row border border-slate-700/50">
                        {nextEvent ? (
                            <>
                                <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative z-10">
                                    <div className="inline-flex items-center gap-2 bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-xs font-black uppercase mb-4 border border-red-600/30 w-fit"><Ticket size={14} /> {t('upcoming_event')}</div>
                                    <h2 className="text-2xl md:text-3xl font-black text-white mb-4 line-clamp-2">{nextEvent.title}</h2>
                                    <p className="text-slate-400 text-lg mb-8 line-clamp-2">{nextEvent.desc}</p>
                                    <div className="flex flex-wrap gap-4 mt-auto">
                                        <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 text-sm text-slate-300"><Calendar size={16} className="text-yellow-400" /> {new Date(nextEvent.date).toLocaleDateString()}</div>
                                        <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 text-sm text-slate-300"><MapPin size={16} className="text-blue-400" /> {nextEvent.location}</div>
                                    </div>
                                    {nextEvent.url && (
                                        <a href={nextEvent.url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-white hover:text-blue-400 font-bold underline transition"><ExternalLink size={16}/> Hûrgilî</a>
                                    )}
                                </div>
                                <div className="w-full md:w-2/5 relative min-h-[250px]">
                                    {nextEvent.url ? <img src={nextEvent.url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-800 flex items-center justify-center"><Calendar size={48} className="text-slate-600"/></div>}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-gradient-to-l"></div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center w-full py-16 px-6">
                                <div className="bg-slate-800 p-4 rounded-full mb-4"><Ticket size={32} className="text-slate-500" /></div>
                                <h3 className="text-xl font-bold text-white mb-2">{t('no_upcoming_event')}</h3>
                                <p className="text-slate-400 text-sm">Nûçeyan bişopînin.</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* SAĞ: GÜNÜN KELİMESİ WIDGET */}
                {dailyWord && (
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-indigo-600 to-purple-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl flex flex-col justify-between border border-white/10 group">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"><Sparkles size={120} /></div>
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase mb-8 backdrop-blur-sm border border-white/10"><Sparkles size={12} /> {t('word_of_day')}</div>
                            <h3 className="text-4xl font-black mb-2 tracking-tight">{dailyWord.ku}</h3>
                            <p className="text-xl text-purple-200 font-light">{dailyWord.tr}</p>
                            {dailyWord.desc && <div className="mt-4 text-sm text-purple-100 italic opacity-80 border-l-2 border-purple-400 pl-3">"{dailyWord.desc}"</div>}
                        </div>
                        <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                            <span className="text-xs font-bold opacity-60 uppercase tracking-widest">YTU FERHENG</span>
                            <button onClick={handleCopyDaily} className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors backdrop-blur-md" title="Kopyala">
                                {copiedDaily ? <CheckCircle2 size={20} className="text-green-400" /> : <Copy size={20} />}
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>

        {/* ================= 3. KATEGORİLER (GRID) ================= */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-16">
                <Sparkles className="text-yellow-500" />
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white text-center">Kategoriyên Sereke</h2>
                <Sparkles className="text-yellow-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div key={feature.path} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                  <Link to={feature.path} className="block h-full group">
                    <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 dark:border-slate-700 h-full flex flex-col relative overflow-hidden">
                      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${feature.color} rounded-full blur-2xl opacity-10 group-hover:opacity-30 transition-opacity -mr-8 -mt-8`}></div>
                      <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon size={28} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                      <p className="text-slate-500 dark:text-slate-400 mb-6 flex-1 text-sm leading-relaxed">{feature.desc}</p>
                      <div className="flex items-center text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">{t('view')} <ArrowRight size={16} /></div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 4. SON EKLENENLER ================= */}
        <section className="py-20 px-6 bg-slate-100 dark:bg-slate-950/50 relative">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-end mb-12 px-2">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white">{t('recent_content')}</h2>
                        <p className="text-slate-500 mt-2 text-sm">Naverokên herî dawî li vir in.</p>
                    </div>
                    <Link to="/agahdari" className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-2 hover:gap-3 transition-all bg-white dark:bg-slate-800 px-5 py-2.5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        {t('see_more')} <ArrowRight size={18} />
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-20 opacity-50 flex flex-col items-center gap-4"><Loader2 className="animate-spin" size={32} />{t('loading')}</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {recentContent.length > 0 ? recentContent.map((item, index) => (
                            <Link to={item.type === 'gallery' ? '/galeri' : '/agahdari'} key={item.id}>
                                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-slate-200 dark:border-slate-700 transition-all group h-full flex flex-col">
                                    <div className="h-52 bg-slate-200 dark:bg-slate-700 relative overflow-hidden">
                                        {item.url ? <img src={item.url} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" /> : <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100 dark:bg-slate-800">{item.type === 'gallery' ? <ImageIcon size={48} /> : <FileText size={48} />}</div>}
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                                        <span className={`absolute top-4 left-4 text-[10px] font-bold px-3 py-1 rounded-full uppercase shadow-lg backdrop-blur-md text-white ${item.type === 'gallery' ? 'bg-orange-500/90' : 'bg-blue-600/90'}`}>{t(item.type)}</span>
                                    </div>
                                    <div className="p-8 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">{item.desc}</p>
                                        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mt-auto border-t border-slate-100 dark:border-slate-700 pt-4">
                                            <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(item.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                                            <span className="text-blue-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform">{t('view')} <ArrowRight size={12} /></span>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        )) : (
                            <div className="col-span-3 text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700"><p className="text-slate-500">{t('no_content_found')}</p></div>
                        )}
                    </div>
                )}
            </div>
        </section>

        {/* ================= 5. NEWSLETTER (Bülten) ================= */}
        <section className="py-24 px-4 bg-slate-900 dark:bg-black relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20"></div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="mb-8 flex justify-center"><div className="bg-white/10 p-4 rounded-full backdrop-blur-md border border-white/10 shadow-xl"><Mail size={40} className="text-blue-400" /></div></div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Nûçename</h2>
            <p className="text-xl text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed">Ji bo nûçeyên herî dawî, çalakî û peyvên nû tevlî lîsteya me bibin.</p>
            
            <form className="max-w-md mx-auto flex gap-2 relative">
                <input type="email" placeholder="E-nameya we..." className="w-full px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-md transition-all" />
                <button type="button" className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-full font-bold transition-colors shadow-lg">Tevlî Bibe</button>
            </form>

            <div className="mt-12 flex flex-wrap justify-center gap-8 text-slate-500 text-sm font-medium">
                <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Belaş e</span>
                <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Spam tune</span>
                <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Her dem betal bike</span>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default Home;