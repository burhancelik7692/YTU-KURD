import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Music, Palette, History, Languages, 
  Calendar, Quote, Clock, Bell, MapPin, Search, Gamepad2, Users, ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { siteContent } from '../data/locales';
import { DAILY_CONTENT } from '../data/daily';

// Firebase bağlantısı
import { db } from '../firebase';
import { collection, getDocs, query, where, doc } from 'firebase/firestore';


const Home = () => {
  const { lang } = useLanguage();
  const t = siteContent[lang]?.home || {};
  const timeLabels = t.time || { day: 'Roj', hour: 'Saet', min: 'Deqe', sec: 'Çirk' };
  const [dailyItem, setDailyItem] = useState(null);
  
  // --- YENİ EKLENEN STATE'LER ---
  const [contentCounts, setContentCounts] = useState({ 
    totalContent: 0, 
    totalMembers: 120, // Statik olarak tutuluyor
    totalDictionary: 50 
  });
  
  // --- 1. İSTATİSTİKLERİ ÇEKME FONKSİYONU ---
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const contentRef = collection(db, "dynamicContent");
        const snapshot = await getDocs(contentRef);
        
        const galleryCount = snapshot.docs.filter(doc => doc.data().type === 'gallery').length;
        const bookCount = snapshot.docs.filter(doc => doc.data().type === 'book').length;
        const videoCount = snapshot.docs.filter(doc => doc.data().type === 'video').length;
        
        setContentCounts({
            totalContent: galleryCount + bookCount + videoCount,
            totalMembers: 120, // Firebase Authentication'dan çekilebilir, şimdilik sabit
            totalDictionary: 50 // Dictionary.js'den çekilebilir, şimdilik sabit
        });

      } catch (err) {
        console.warn("İstatistikler çekilemedi (Firebase erişim sorunu):", err);
      }
    };
    fetchCounts();
  }, []);

  // --- GÜNÜN SÖZÜ MANTIĞI ---
  useEffect(() => {
    if (DAILY_CONTENT && DAILY_CONTENT.length > 0) {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 0);
      const diff = now - start;
      const oneDay = 1000 * 60 * 60 * 24;
      const dayOfYear = Math.floor(diff / oneDay);
      setDailyItem(DAILY_CONTENT[dayOfYear % DAILY_CONTENT.length]);
    } else {
      setDailyItem({ type: 'Gotin', text: 'Bi yek gulê bihar nayê.', meaning: 'Bir çiçekle bahar gelmez.' });
    }
  }, []);

  // --- KARTLAR ---
  const features = [
    { icon: Languages, title: siteContent[lang]?.cards?.zimanTitle, desc: siteContent[lang]?.cards?.zimanDesc, path: '/ziman', color: 'bg-blue-600' },
    { icon: BookOpen, title: siteContent[lang]?.cards?.candTitle, desc: siteContent[lang]?.cards?.candDesc, path: '/cand', color: 'bg-cyan-600' },
    { icon: History, title: siteContent[lang]?.cards?.dirokTitle, desc: siteContent[lang]?.cards?.dirokDesc, path: '/dirok', color: 'bg-slate-600' },
    { icon: Music, title: siteContent[lang]?.cards?.muzikTitle, desc: siteContent[lang]?.cards?.muzikDesc, path: '/muzik', color: 'bg-indigo-600' },
    { icon: Palette, title: siteContent[lang]?.cards?.hunerTitle, desc: siteContent[lang]?.cards?.hunerDesc, path: '/huner', color: 'bg-teal-600' }
  ];

  return (
    <>
      <Helmet>
        <title>{lang === 'KU' ? 'Sereke' : 'Anasayfa'} - YTU Kurdî</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
        
        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden pb-32 lg:pb-60 pt-20">
          <div className="absolute inset-0 z-0">
            <div className="absolute w-full h-full bg-center bg-cover bg-no-repeat transform scale-105 blur-sm" style={{ backgroundImage: "url('/banner.jpg')" }}></div>
            <div className="absolute w-full h-full bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-900/95"></div>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-6xl mx-auto text-center relative z-10 px-4 pt-24">
            <motion.img initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }} src="/logo.png" alt="YTU Kurdî" className="w-28 h-28 md:w-40 md:h-40 mx-auto mb-6 rounded-full shadow-2xl ring-4 ring-white/20" />
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl leading-tight">
              {t.heroTitle1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-200">{t.heroTitle2}</span>,<br /> {t.heroTitle3}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light px-2">{t.heroSubtitle}</p>

            <div className="flex flex-wrap justify-center gap-4">
               <Link to="/ferheng" className="flex items-center gap-2 bg-white text-blue-900 px-8 py-3 md:px-10 md:py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition shadow-lg transform hover:-translate-y-1">
                 <Search size={20} /> {t.quickDict}
               </Link>
               <Link to="/listik" className="flex items-center gap-2 bg-yellow-500 text-blue-900 px-8 py-3 md:px-10 md:py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition shadow-lg transform hover:-translate-y-1">
                 <Gamepad2 size={20} /> {t.quickGame}
               </Link>
            </div>
            
            {/* DİNAMİK İSTATİSTİK BAR (YENİ) */}
            <div className="mt-16 grid grid-cols-3 gap-4 md:gap-12 max-w-2xl mx-auto border-t border-white/10 pt-8">
                <div>
                    <div className="text-2xl md:text-3xl font-black text-white">{contentCounts.totalContent}+</div>
                    <div className="text-xs md:text-sm text-slate-400 uppercase tracking-widest">{lang === 'KU' ? 'Naverok' : 'İçerik'}</div>
                </div>
                <div>
                    <div className="text-2xl md:text-3xl font-black text-white">{contentCounts.totalMembers}+</div>
                    <div className="text-xs md:text-sm text-slate-400 uppercase tracking-widest">{lang === 'KU' ? 'Endam' : 'Üye'}</div>
                </div>
                <div>
                    <div className="text-2xl md:text-3xl font-black text-white">{contentCounts.totalDictionary}+</div>
                    <div className="text-xs md:text-sm text-slate-400 uppercase tracking-widest">{lang === 'KU' ? 'Peyv' : 'Sözcük'}</div>
                </div>
            </div>
          </motion.div>
        </section>

        {/* BİLGİ KARTLARI */}
        <section className="relative z-20 px-4 pb-12 -mt-16 lg:-mt-32">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Etkinlik Kartı (BOŞ) */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-blue-900 dark:bg-blue-950 text-white rounded-3xl p-8 shadow-2xl border border-blue-800 dark:border-blue-900 flex flex-col justify-center relative overflow-hidden min-h-[260px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full filter blur-3xl opacity-20 -mr-10 -mt-10"></div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-yellow-500 p-2 rounded-lg text-blue-900"><Bell size={24} /></div>
                <h3 className="text-xs font-bold text-blue-200 uppercase tracking-widest">{t.eventTitle}</h3>
              </div>
              <div className="flex-1 flex flex-col justify-center items-center text-center">
                <h2 className="text-3xl font-bold text-white mb-2">{t.eventEmptyTitle}</h2>
                <p className="text-blue-200 text-sm mb-6">{t.eventEmptyDesc}</p>
                <div className="flex gap-3 opacity-30 grayscale cursor-not-allowed">
                    {['day', 'hour', 'min'].map((u, i) => (<div key={i} className="bg-white/10 p-2 rounded-xl text-center w-16 md:w-20 border border-white/10"><span className="block text-xl font-bold">--</span><span className="text-[10px] uppercase tracking-wide">{timeLabels[u]}</span></div>))}
                </div>
              </div>
            </motion.div>

            {/* Günün Sözü Kartı */}
            {dailyItem && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-100 dark:border-slate-700 flex flex-col justify-center relative min-h-[260px]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg text-yellow-600 dark:text-yellow-500"><Calendar size={24} /></div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {t.dailyTitle}: <span className="text-yellow-600 dark:text-yellow-500">{dailyItem.type === 'Gotin' ? t.dailyQuote : t.dailyWord}</span>
                  </h3>
                </div>
                <div className="flex-1 flex flex-col justify-center relative z-10 pr-12">
                  <p className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 mb-3 leading-snug">"{dailyItem.text}"</p>
                  <p className="text-lg text-slate-500 dark:text-slate-400 italic border-l-4 border-yellow-400 pl-4">{dailyItem.meaning}</p>
                </div>
                <Quote className="absolute bottom-6 right-6 text-slate-100 dark:text-slate-700 rotate-180" size={80} />
              </motion.div>
            )}

          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-16 md:py-24 px-4 bg-slate-50 dark:bg-slate-950 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{t.featuresTitle}</h2>
              <div className="h-1 w-24 bg-yellow-500 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {features.map((feature, index) => (
                <motion.div key={feature.path} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                  <Link to={feature.path} className="block h-full">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border border-slate-100 dark:border-slate-700 h-full flex flex-col relative overflow-hidden">
                      <div className={`absolute top-0 right-0 w-32 h-32 ${feature.color} rounded-full filter blur-3xl opacity-10 -mr-10 -mt-10 group-hover:opacity-20 transition-opacity`}></div>
                      <div className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <feature.icon className="text-white" size={32} />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{feature.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-6 flex-1">{feature.desc}</p>
                      <div className="flex items-center text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
                        {lang === 'KU' ? 'Bixwîne' : (lang === 'TR' ? 'İncele' : 'Explore')} <ArrowRight size={16} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-20 px-4 bg-slate-900 dark:bg-black relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <Users size={48} className="text-yellow-500 mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-black text-white mb-8">{t.aboutTitle}</h2>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-6">{t.aboutText1}</p>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-12">{t.aboutText2}</p>
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">{t.ctaTitle}</h3>
              <p className="text-blue-200 mb-8">{t.ctaText}</p>
              <a href="https://instagram.com/ytukurdi" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-yellow-500 text-blue-900 px-10 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-all shadow-xl hover:shadow-yellow-500/20 transform hover:-translate-y-1">
                {t.ctaButton} <ArrowRight size={20} />
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;