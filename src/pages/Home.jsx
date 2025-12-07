import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Music, Palette, History, Languages, 
  Calendar, Quote, Clock, Bell, MapPin 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { siteContent } from '../data/locales';
import { DAILY_CONTENT } from '../data/daily';

// Newroz Tarihi
const TARGET_DATE = new Date("2025-03-21T00:00:00").getTime(); 
const EVENT_NAME = { KU: "Newroz 2025", TR: "2025 Newroz'u", EN: "Newroz 2025" };

const Home = () => {
  const { lang } = useLanguage();
  
  // Veritabanından verileri çek (Hata korumalı)
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

  // --- GERİ SAYIM ---
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = TARGET_DATE - now;
      if (distance < 0) clearInterval(timer);
      else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
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
        <section className="relative h-auto min-h-[600px] lg:h-screen flex items-center justify-center overflow-hidden pb-20 lg:pb-0">
          <div className="absolute inset-0 z-0">
            <div className="absolute w-full h-full bg-center bg-cover bg-no-repeat transform scale-105 blur-sm" style={{ backgroundImage: "url('/banner.jpg')" }}></div>
            <div className="absolute w-full h-full bg-slate-900/85"></div>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-6xl mx-auto text-center relative z-10 px-4 pt-32 lg:pt-16">
            <motion.img initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }} src="/logo.png" alt="YTU Kurdî" className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 mx-auto mb-6 md:mb-8 rounded-full shadow-2xl ring-4 ring-white/20" />
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-4 md:mb-6 drop-shadow-2xl leading-tight">
              {t.heroTitle1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-200">{t.heroTitle2}</span>,<br /> {t.heroTitle3}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto font-light px-2">{t.heroSubtitle}</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
               <a href="mailto:ytukurdidrive@gmail.com" className="inline-block bg-white text-blue-900 px-8 py-3 md:px-10 md:py-4 rounded-full font-bold text-base md:text-lg hover:bg-blue-50 transition shadow-lg shadow-white/10">{t.heroButton}</a>
            </motion.div>
          </motion.div>
        </section>

        {/* BİLGİ KARTLARI */}
        <section className="relative z-20 px-4 pb-12 mt-8 lg:-mt-32">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* ETKİNLİK KARTI (DİNAMİK ÇEVİRİ) */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-blue-900 text-white rounded-3xl p-8 shadow-2xl border border-blue-800 flex flex-col justify-center relative overflow-hidden min-h-[250px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full filter blur-3xl opacity-20 -mr-10 -mt-10"></div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-yellow-500 p-2 rounded-lg text-blue-900"><Bell size={24} /></div>
                <h3 className="text-xs font-bold text-blue-200 uppercase tracking-widest">{t.eventTitle}</h3>
              </div>
              <div className="flex-1 flex flex-col justify-center items-center text-center">
                <h2 className="text-3xl font-bold text-white mb-2">{t.eventEmptyTitle}</h2>
                <p className="text-blue-200 text-sm">{t.eventEmptyDesc}</p>
                {/* Sayaç Sönük */}
                <div className="flex gap-2 mt-6 opacity-50 grayscale">
                    {['day', 'hour', 'min'].map((u, i) => (
                        <div key={i} className="bg-white/10 p-2 rounded-lg text-center w-16">
                            <span className="block text-lg font-bold">--</span>
                            <span className="text-[10px]">{timeLabels[u]}</span>
                        </div>
                    ))}
                </div>
              </div>
            </motion.div>

            {/* GÜNÜN SÖZÜ KARTI (DİNAMİK ÇEVİRİ) */}
            {dailyItem && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 flex flex-col justify-center relative min-h-[250px]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600"><Calendar size={24} /></div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {t.dailyTitle}: {dailyItem.type === 'Gotin' ? t.dailyQuote : t.dailyWord}
                  </h3>
                </div>
                <div className="flex-1 flex flex-col justify-center relative z-10">
                  <p className="text-2xl md:text-3xl font-black text-slate-800 mb-3">"{dailyItem.text}"</p>
                  <p className="text-base md:text-lg text-slate-500 italic">{dailyItem.meaning}</p>
                </div>
                <Quote className="absolute bottom-4 right-4 text-slate-100 rotate-180" size={80} />
              </motion.div>
            )}

          </div>
        </section>

        {/* ... About ve Features bölümleri aynı kalabilir, zaten t.aboutTitle gibi dinamik çekiyorlar ... */}
        {/* ABOUT SECTION */}
        <section className="py-12 md:py-20 px-4 bg-white relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">{t.aboutTitle}</h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">{t.aboutText1}</p>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">{t.aboutText2}</p>
            </motion.div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-12 md:py-20 px-4 bg-slate-50 relative z-10">
          <div className="max-w-7xl mx-auto">
            <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-12">{t.featuresTitle}</motion.h2>
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

        {/* CTA */}
        <section className="py-16 md:py-24 px-4 bg-blue-900 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t.ctaTitle}</h2>
            <p className="text-lg md:text-xl mb-10 text-blue-100">{t.ctaText}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://instagram.com/ytukurdi" target="_blank" rel="noopener noreferrer" className="bg-cyan-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-cyan-50 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-cyan-500/20">{t.ctaButton}</a>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default Home;