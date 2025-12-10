import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, Music, Palette, History, Languages, 
  Calendar, MapPin, Ticket, FileText, Image as ImageIcon, 
  Search, ArrowRight, Sparkles, Star, Zap, Video, Mail, CheckCircle2, ArrowUpRight, Copy, Check, ExternalLink, Loader2, Bell, Quote 
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
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

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
        const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        const dailyIndex = seed % STATIC_DICTIONARY.length;
        setDailyWord(STATIC_DICTIONARY[dailyIndex]);
    }
  }, []);

  // --- 2. GERİ SAYIM MANTIĞI ---
  useEffect(() => {
    if (!nextEvent) return;
    const calculateTimeLeft = () => {
        const difference = +new Date(nextEvent.date) - +new Date();
        if (difference > 0) {
            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
            });
        }
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, [nextEvent]);

  // --- 3. VERİ ÇEKME ---
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

            // B. Tüm İçerik
            const contentRef = collection(db, "dynamicContent");
            const q = query(contentRef, where("type", "in", ["blog", "gallery", "event", "dictionary"]));
            const querySnapshot = await getDocs(q);
            const allData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            setAllSearchData(allData);

            setStats({
                words: allData.filter(i => i.type === 'dictionary').length + STATIC_DICTIONARY.length,
                posts: allData.filter(i => i.type === 'blog').length,
                photos: allData.filter(i => i.type === 'gallery').length
            });

            // C. Sıradaki Etkinlik
            const today = new Date().toISOString().split('T')[0];
            const upcoming = allData
                .filter(item => item.type === 'event' && item.date >= today)
                .sort((a, b) => a.date.localeCompare(b.date));
            if (upcoming.length > 0) setNextEvent(upcoming[0]);

            // D. Son Eklenenler
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

  // --- ARAMA ---
  useEffect(() => {
      if (searchTerm.trim().length === 0) { setSearchResults([]); return; }
      const term = searchTerm.toLowerCase();
      const results = allSearchData.filter(item => 
          (item.title?.toLowerCase().includes(term)) ||
          (item.ku?.toLowerCase().includes(term)) ||
          (item.tr?.toLowerCase().includes(term))
      ).slice(0, 5);
      setSearchResults(results);
  }, [searchTerm, allSearchData]);

  // Kartlar
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
           {/* ... (Hero Arka Plan ve Arama Çubuğu - Mevcut kodlar aynı kalacak) ... */}
           {/* Kod tekrarı olmaması için burayı kısaltıyorum, mevcut Hero kodunuzu koruyun */}
           <div className="absolute inset-0 z-0 bg-slate-900">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
             <motion.div style={{ y: y1 }} className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600 rounded-full blur-[150px] opacity-20"></motion.div>
             <motion.div style={{ y: y2 }} className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600 rounded-full blur-[150px] opacity-20"></motion.div>
          </div>

          <motion.div style={{ opacity: opacityHero }} className="max-w-5xl mx-auto text-center relative z-10 px-4 w-full">
            <div className="relative inline-block mb-8 group cursor-default">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <motion.img initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", damping: 20 }} src="/logo.png" alt="YTU Kurdî" className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/10 shadow-2xl relative z-10" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
              {heroData.heroTitle1} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-200">{heroData.heroTitle2}</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">{heroData.heroSubtitle}</p>
            
            {/* Arama Çubuğu (Mevcut kodun aynısı) */}
            <div className="max-w-2xl mx-auto mb-16 relative z-50" ref={searchContainerRef}>
                <div className={`relative transition-all duration-300 ${isSearchFocused ? 'scale-105' : 'scale-100'}`}>
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                    <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex items-center p-2 border border-white/10">
                        <Search className="text-slate-400 ml-3" size={24} />
                        <input type="text" placeholder={t('search_placeholder') || "Li seranserê malperê bigere..."} className="w-full py-4 px-4 bg-transparent text-slate-800 dark:text-white text-lg font-medium placeholder-slate-400 outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onFocus={() => setIsSearchFocused(true)} />
                        {searchTerm && <button onClick={() => setSearchTerm('')} className="p-2 text-slate-400 hover:text-red-500 transition"><X size={20} /></button>}
                        <button onClick={() => navigate('/ferheng')} className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-all shadow-lg"><ArrowRight size={20} /></button>
                    </div>
                </div>
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

        {/* ================= 2. YENİLENMİŞ KART TASARIMLARI ================= */}
        <section id="event-section" className="relative z-20 px-4 -mt-12 pb-12">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* SOL KART: ETKİNLİK / DUYURULACAK */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative bg-slate-800/80 backdrop-blur-xl border border-slate-600/30 rounded-[2rem] p-8 md:p-12 shadow-2xl overflow-hidden flex flex-col justify-center min-h-[300px]"
                >
                    {/* Arka Plan Efekti */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                    {nextEvent ? (
                        // ETKİNLİK VARSA
                        <div className="relative z-10 text-center">
                             <div className="inline-flex items-center gap-2 bg-blue-600 px-4 py-1.5 rounded-xl text-white text-xs font-bold uppercase mb-6 shadow-lg shadow-blue-600/20">
                                <Bell size={16} /> {t('upcoming_event')}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 line-clamp-2">{nextEvent.title}</h2>
                            <p className="text-slate-400 mb-8 max-w-md mx-auto">{nextEvent.desc}</p>
                            
                            <div className="flex justify-center gap-4">
                                <div className="bg-slate-900/50 p-4 rounded-2xl min-w-[80px] border border-slate-700">
                                    <span className="block text-2xl font-bold text-white">{timeLeft.days}</span>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">GÜN</span>
                                </div>
                                <div className="bg-slate-900/50 p-4 rounded-2xl min-w-[80px] border border-slate-700">
                                    <span className="block text-2xl font-bold text-white">{timeLeft.hours}</span>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">SAAT</span>
                                </div>
                                <div className="bg-slate-900/50 p-4 rounded-2xl min-w-[80px] border border-slate-700">
                                    <span className="block text-2xl font-bold text-white">{timeLeft.minutes}</span>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">DAK</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // ETKİNLİK YOKSA (BOŞ DURUM - GÖRSELDEKİ GİBİ)
                        <div className="relative z-10 text-center">
                            <div className="inline-flex items-center gap-2 bg-blue-600 px-4 py-1.5 rounded-xl text-white text-xs font-bold uppercase mb-6 shadow-lg shadow-blue-600/20">
                                <Bell size={16} /> SIRADAKİ ETKİNLİK
                            </div>
                            <h2 className="text-4xl font-black text-white mb-2">Duyurulacak</h2>
                            <p className="text-slate-400 mb-10">Yeni etkinlikler için beklemede kalın.</p>
                            
                            <div className="flex justify-center gap-4">
                                <div className="bg-slate-900/50 p-4 rounded-2xl min-w-[80px] border border-slate-700">
                                    <span className="block text-xl font-bold text-slate-600">--</span>
                                    <span className="text-[10px] text-slate-600 uppercase tracking-wider font-bold">GÜN</span>
                                </div>
                                <div className="bg-slate-900/50 p-4 rounded-2xl min-w-[80px] border border-slate-700">
                                    <span className="block text-xl font-bold text-slate-600">--</span>
                                    <span className="text-[10px] text-slate-600 uppercase tracking-wider font-bold">SAAT</span>
                                </div>
                                <div className="bg-slate-900/50 p-4 rounded-2xl min-w-[80px] border border-slate-700">
                                    <span className="block text-xl font-bold text-slate-600">--</span>
                                    <span className="text-[10px] text-slate-600 uppercase tracking-wider font-bold">DAK</span>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* SAĞ KART: GÜNÜN KELİMESİ (Tasarım Revize) */}
                {dailyWord && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="relative bg-[#FDFBF7] dark:bg-slate-800 rounded-[2rem] p-8 md:p-12 shadow-2xl overflow-hidden flex flex-col justify-center min-h-[300px] border border-slate-200 dark:border-slate-700"
                    >
                        {/* Dekoratif Tırnak */}
                        <div className="absolute top-4 right-6 opacity-10">
                            <Quote size={140} className="text-slate-900 dark:text-white fill-current" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg text-yellow-600 dark:text-yellow-400">
                                    <Calendar size={20} />
                                </div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    GÜNÜN İÇERİĞİ: <span className="text-yellow-600 dark:text-yellow-500">KELİME</span>
                                </span>
                            </div>

                            <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                                "{dailyWord.ku}"
                            </h2>
                            
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-1.5 bg-yellow-400 rounded-full"></div>
                                <p className="text-xl text-slate-500 dark:text-slate-400 italic font-serif">
                                    {dailyWord.tr}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>

        {/* 3. KATEGORİLER (GRID) */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="flex items-center justify-center gap-3 mb-16">
                <Sparkles className="text-yellow-500" />
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white text-center">Kategoriyên Sereke</h2>
                <Sparkles className="text-yellow-500" />
            </motion.div>

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

        {/* 4. SON EKLENEN İÇERİKLER */}
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
                                    <div className="h-56 bg-slate-200 dark:bg-slate-700 relative overflow-hidden">
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

        {/* 5. NEWSLETTER */}
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
          </div>
        </section>

      </div>
    </>
  );
};

export default Home;