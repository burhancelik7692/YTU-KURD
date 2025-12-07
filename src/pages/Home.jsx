import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Music, Palette, History, Languages, 
  Calendar, Quote, Clock, MapPin 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { siteContent } from '../data/locales';
import { DAILY_CONTENT } from '../data/daily';

// --- GERİ SAYIM HEDEFİ ---
const TARGET_DATE = new Date("2025-03-21T00:00:00").getTime(); 
const EVENT_NAME = { KU: "Newroz 2025", TR: "2025 Newroz'u", EN: "Newroz 2025" };

const Home = () => {
  const { lang } = useLanguage();
  
  // Hata koruması: Eğer dil dosyası yüklenmediyse boş obje döndür
  const t = siteContent[lang]?.home || {};
  const c = siteContent[lang]?.cards || {};

  // --- 1. GÜNÜN SÖZÜ MANTIĞI ---
  const [dailyItem, setDailyItem] = useState({ 
    type: 'Peyv', 
    text: 'Barkirin...', 
    meaning: 'Loading...' 
  });
  
  useEffect(() => {
    if (DAILY_CONTENT && DAILY_CONTENT.length > 0) {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 0);
      const diff = now - start;
      const oneDay = 1000 * 60 * 60 * 24;
      const dayOfYear = Math.floor(diff / oneDay);
      // Listeden günü seç
      const item = DAILY_CONTENT[dayOfYear % DAILY_CONTENT.length];
      setDailyItem(item);
    } else {
      // Eğer liste boşsa varsayılan göster
      setDailyItem({ type: 'Gotin', text: 'Bi yek gulê bihar nayê.', meaning: 'Bir çiçekle bahar gelmez.' });
    }
  }, []);

  // --- 2. GERİ SAYIM MANTIĞI ---
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = TARGET_DATE - now;
      if (distance < 0) {
        clearInterval(timer);
      } else {
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
        <title>{lang === 'KU' ? 'Sereke' : 'Anasayfa'} - YTU Kurdî</title>
        <meta name="description" content={t.heroSubtitle} />
        <meta name="theme-color" content="#1e3a8a" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        
        {/* HERO SECTION */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute w-full h-full bg-center bg-cover bg-no-repeat transform scale-105 blur-sm" style={{ backgroundImage: "url('/banner.jpg')" }}></div>
            <div className="absolute w-full h-full bg-slate-900/85"></div>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-6xl mx-auto text-center relative z-10 px-4 pt-16">
            <motion.img initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }} src="/logo.png" alt="YTU Kurdî" className="w-32 h-32 md:w-48 md:h-48 mx-auto mb-8 rounded-full shadow-2xl ring-4 ring-white/20" />
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl">
              {t.heroTitle1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-200">{t.heroTitle2}</span>,<br /> {t.heroTitle3}
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto font-light">{t.heroSubtitle}</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
               <a href="mailto:ytukurdidrive@gmail.com" className="inline-block bg-white text-blue-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition shadow-lg shadow-white/10">
                 {t.heroButton}
               </a>
            </motion.div>
          </motion.div>
        </section>

        {/* GERİ SAYIM & GÜNÜN SÖZÜ */}
        <section className="relative z-20 -mt-20 px-4 pb-12">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Geri Sayım Kartı */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-blue-900 text-white rounded-3xl p-8 shadow-2xl border border-blue-800 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full filter blur-3xl opacity-20 -mr-10 -mt-10"></div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-yellow-500 p-2 rounded-lg text-blue-900"><Clock size={24} /></div>
                <div>
                  <h3 className="text-xs font-bold text-blue-200 uppercase tracking-widest">{lang === 'KU' ? 'Çalakiya Pêşerojê' : 'Sıradaki Etkinlik'}</h3>
                  <h2 className="text-2xl font-bold text-white">{EVENT_NAME[lang]}</h2>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                {['days', 'hours', 'minutes', 'seconds'].map((unit, i) => (
                  <div key={i} className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                    <div className="text-2xl font-black text-yellow-400">{timeLeft[unit]}</div>
                    <div className="text-[10px] uppercase text-blue-200">{lang==='KU' ? (i===0?'Roj':i===1?'Saet':i===2?'Deqe':'Çirk') : (i===0?'Gün':i===1?'Saat':i===2?'Dak':'San')}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm text-blue-200"><MapPin size={16} /> YTÜ Davutpaşa Kampüsü</div>
            </motion.div>

            {/* Günün Sözü Kartı */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 flex flex-col justify-center relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600"><Calendar size={24} /></div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {lang === 'KU' ? `Rojev: ${dailyItem.type}` : `Günün İçeriği: ${dailyItem.type}`}
                </h3>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-3xl font-black text-slate-800 mb-2">"{dailyItem.text}"</p>
                <p className="text-lg text-slate-500 italic">{dailyItem.meaning}</p>
              </div>
              <Quote className="absolute bottom-4 right-4 text-slate-100" size={80} />
            </motion.div>

          </div>
        </section>

        {/* KARTLAR */}
        <section className="py-20 px-4 bg-slate-50 relative z-10">
          <div className="max-w-7xl mx-auto">
            <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-4xl font-bold text-center text-blue-900 mb-16">
              {t.featuresTitle}
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div key={feature.path} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                  <Link to={feature.path}>
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border border-slate-100 h-full">
                      <div className={`${feature.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                        <feature.icon className="text-white" size={32} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">{feature.title}</h3>
                      <p className="text-gray-600">{feature.desc}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 bg-blue-900 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-6">{t.ctaTitle}</h2>
            <p className="text-xl mb-10 text-blue-100">{t.ctaText}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://instagram.com/ytukurdi" target="_blank" rel="noopener noreferrer" className="bg-cyan-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-cyan-50 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-cyan-500/20">
                {t.ctaButton}
              </a>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default Home;