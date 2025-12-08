import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Music, Palette, History, Languages, 
  Calendar, Quote, Clock, Bell, MapPin, Search, Gamepad2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { siteContent } from '../data/locales';
import { DAILY_CONTENT } from '../data/daily';

const Home = () => {
  const { lang } = useLanguage();
  // Hata korumalı veri çekme
  const t = siteContent[lang]?.home || {};
  const c = siteContent[lang]?.cards || {};
  const timeLabels = t.time || { day: 'Roj', hour: 'Saet', min: 'Deqe', sec: 'Çirk' };

  // --- GÜNÜN SÖZÜ ---
  const [dailyItem, setDailyItem] = useState(null);
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

  const features = [
    { icon: Languages, title: c.zimanTitle, desc: c.zimanDesc, path: '/ziman', color: 'bg-blue-600' },
    { icon: BookOpen, title: c.candTitle, desc: c.candDesc, path: '/cand', color: 'bg-cyan-600' },
    { icon: History, title: c.dirokTitle, desc: c.dirokDesc, path: '/dirok', color: 'bg-slate-600' },
    { icon: Music, title: c.muzikTitle, desc: c.muzikDesc, path: '/muzik', color: 'bg-indigo-600' },
    { icon: Palette, title: c.hunerTitle, desc: c.hunerDesc, path: '/huner', color: 'bg-teal-600' }
  ];

  return (
    <>
      <Helmet>
        <title>{lang === 'KU' ? 'Sereke' : (lang === 'TR' ? 'Anasayfa' : 'Home')} - YTU Kurdî</title>
        <meta name="description" content={t.heroSubtitle} />
        <meta name="theme-color" content="#1e3a8a" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        
        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden pb-20 lg:pb-32">
          <div className="absolute inset-0 z-0">
            <div className="absolute w-full h-full bg-center bg-cover bg-no-repeat transform scale-105 blur-sm" style={{ backgroundImage: "url('/banner.jpg')" }}></div>
            <div className="absolute w-full h-full bg-slate-900/85"></div>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-6xl mx-auto text-center relative z-10 px-4 pt-24">
            <motion.img initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }} src="/logo.png" alt="YTU Kurdî" className="w-28 h-28 md:w-40 md:h-40 mx-auto mb-6 rounded-full shadow-2xl ring-4 ring-white/20" />
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl leading-tight">
              {t.heroTitle1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-200">{t.heroTitle2}</span>,<br /> {t.heroTitle3}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto font-light px-4">{t.heroSubtitle}</p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex flex-wrap justify-center gap-4">
               {/* HIZLI ERİŞİM BUTONLARI - ARTIK DİNAMİK */}
               <Link to="/ferheng" className="flex items-center gap-2 bg-white text-blue-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-blue-50 transition shadow-lg">
                 <Search size={20} /> {t.quickDict}
               </Link>
               <Link to="/listik" className="flex items-center gap-2 bg-yellow-500 text-blue-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-400 transition shadow-lg">
                 <Gamepad2 size={20} /> {t.quickGame}
               </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* BİLGİ KARTLARI */}
        <section className="relative z-20 px-4 pb-12 -mt-12 lg:-mt-32">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Etkinlik Kartı */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-blue-900 text-white rounded-3xl p-8 shadow-2xl border border-blue-800 flex flex-col justify-center relative overflow-hidden min-h-[260px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full filter blur-3xl opacity-20 -mr-10 -mt-10"></div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-yellow-500 p-2 rounded-lg text-blue-900"><Bell size={24} /></div>
                <h3 className="text-xs font-bold text-blue-200 uppercase tracking-widest">{t.eventTitle}</h3>
              </div>
              <div className="flex-1 flex flex-col justify-center items-center text-center">
                <h2 className="text-3xl font-bold text-white mb-2">{t.eventEmptyTitle}</h2>
                <p className="text-blue-200 text-sm mb-6">{t.eventEmptyDesc}</p>
                <div className="flex gap-3 opacity-40 grayscale">
                    {['day', 'hour', 'min'].map((u, i) => (
                        <div key={i} className="bg-white/10 p-2 rounded-xl text-center w-16 md:w-20 border border-white/10">
                            <span className="block text-xl font-bold">--</span>
                            <span className="text-[10px] uppercase tracking-wide">{timeLabels[u]}</span>
                        </div>
                    ))}
                </div>
              </div>
            </motion.div>

            {/* Günün Sözü Kartı */}
            {dailyItem && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 flex flex-col justify-center relative min-h-[260px]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600"><Calendar size={24} /></div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {t.dailyTitle}: <span className="text-yellow-600">{dailyItem.type === 'Gotin' ? t.dailyQuote : t.dailyWord}</span>
                  </h3>
                </div>
                <div className="flex-1 flex flex-col justify-center relative z-10 pr-12">
                  <p className="text-2xl md:text-3xl font-black text-slate-800 mb-3 leading-tight">"{dailyItem.text}"</p>
                  <p className="text-base md:text-lg text-slate-500 italic">{dailyItem.meaning}</p>
                </div>
                <Quote className="absolute bottom-6 right-6 text-slate-100 rotate-180" size={80} />
              </motion.div>
            )}

          </div>
        </section>

        {/* Features ve Diğer Bölümler */}
        <section className="py-16 px-4 bg-white relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">{t.aboutTitle}</h2>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">{t.aboutText1}</p>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">{t.aboutText2}</p>
          </div>
        </section>

        <section className="py-16 md:py-24 px-4 bg-slate-50 relative z-10">
          <div className="max-w-7xl mx-auto">
            <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-12">{t.featuresTitle}</motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {features.map((feature, index) => (
                <motion.div key={feature.path} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                  <Link to={feature.path}>
                    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border border-slate-100 h-full flex flex-col">
                      <div className={`${feature.color} w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                        <feature.icon className="text-white" size={28} />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">{feature.title}</h3>
                      <p className="text-gray-600 text-sm md:text-base">{feature.desc}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 px-4 bg-blue-900 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t.ctaTitle}</h2>
            <p className="text-lg md:text-xl mb-10 text-blue-100">{t.ctaText}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:ytukurdidrive@gmail.com" className="bg-cyan-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-cyan-50 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-cyan-500/20">{t.ctaButton}</a>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default Home;