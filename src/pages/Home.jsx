import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Music, Palette, History, Languages, Calendar, Quote } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { siteContent } from '../data/locales';
import { DAILY_CONTENT } from '../data/daily'; // Veriyi çektik

const Home = () => {
  const { lang } = useLanguage();
  const t = siteContent[lang].home;
  const c = siteContent[lang].cards;

  // --- GÜNÜN SÖZÜ MANTIĞI ---
  const [dailyItem, setDailyItem] = useState(null);

  useEffect(() => {
    // Yılın kaçıncı günü olduğunu buluyoruz (Böylece her gün değişir)
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    // Güne göre listeden birini seç
    const item = DAILY_CONTENT[dayOfYear % DAILY_CONTENT.length];
    setDailyItem(item);
  }, []);

  const features = [{
    icon: Languages,
    title: c.zimanTitle,
    description: c.zimanDesc,
    path: '/ziman',
    color: 'bg-blue-600'
  }, {
    icon: BookOpen,
    title: c.candTitle,
    description: c.candDesc,
    path: '/cand',
    color: 'bg-cyan-600'
  }, {
    icon: History,
    title: c.dirokTitle,
    description: c.dirokDesc,
    path: '/dirok',
    color: 'bg-slate-600'
  }, {
    icon: Music,
    title: c.muzikTitle,
    description: c.muzikDesc,
    path: '/muzik',
    color: 'bg-indigo-600'
  }, {
    icon: Palette,
    title: c.hunerTitle,
    description: c.hunerDesc,
    path: '/huner',
    color: 'bg-teal-600'
  }];

  return (
    <>
      <Helmet>
        <title>{lang === 'KU' ? 'Sereke' : (lang === 'TR' ? 'Anasayfa' : 'Home')} - YTU Kurdî</title>
        <meta name="description" content={t.heroSubtitle} />
        {/* PWA için tema rengi */}
        <meta name="theme-color" content="#1e3a8a" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        
        {/* --- HERO SECTION --- */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div 
              className="absolute w-full h-full bg-center bg-cover bg-no-repeat transform scale-105 blur-sm"
              style={{ backgroundImage: "url('/banner.jpg')" }} 
            ></div>
            <div className="absolute w-full h-full bg-slate-900/85"></div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }} 
            className="max-w-6xl mx-auto text-center relative z-10 px-4 pt-16"
          >
            <motion.img 
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              transition={{ duration: 0.6 }} 
              src="/logo.png" 
              alt="YTU Kurdî" 
              className="w-32 h-32 md:w-48 md:h-48 mx-auto mb-8 rounded-full shadow-2xl ring-4 ring-white/20" 
            />
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl">
              {t.heroTitle1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-200">{t.heroTitle2}</span>,<br />
              {t.heroTitle3}
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto font-light">
              {t.heroSubtitle}
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
               <a 
                 href="mailto:ytukurdidrive@gmail.com" 
                 className="inline-block bg-white text-blue-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition shadow-lg shadow-white/10"
               >
                 {t.heroButton}
               </a>
            </motion.div>
          </motion.div>
        </section>

        {/* --- GÜNÜN SÖZÜ KARTI (YENİ EKLENDİ) --- */}
        {dailyItem && (
          <section className="relative z-20 -mt-16 px-4">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border-t-4 border-yellow-500 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6"
            >
              <div className="bg-yellow-100 p-4 rounded-full text-yellow-600">
                <Calendar size={32} />
              </div>
              <div className="text-center md:text-left flex-1">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">
                  {lang === 'KU' ? `Rojev: ${dailyItem.type}` : `Günün İçeriği: ${dailyItem.type === 'Gotin' ? 'Söz' : 'Kelime'}`}
                </h3>
                <p className="text-2xl font-black text-slate-800 mb-2">"{dailyItem.text}"</p>
                <p className="text-slate-500 italic text-lg">{dailyItem.meaning}</p>
              </div>
              <Quote className="text-slate-100 hidden md:block" size={80} />
            </motion.div>
          </section>
        )}

        {/* --- ABOUT SECTION --- */}
        <section className="py-20 px-4 bg-white relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
              <h2 className="text-4xl font-bold text-blue-900 mb-6">{t.aboutTitle}</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">{t.aboutText1}</p>
              <p className="text-lg text-gray-700 leading-relaxed">{t.aboutText2}</p>
            </motion.div>
          </div>
        </section>

        {/* --- FEATURES GRID --- */}
        <section className="py-20 px-4 bg-slate-50 relative z-10">
          <div className="max-w-7xl mx-auto">
            <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-4xl font-bold text-center text-blue-900 mb-16">
              {t.featuresTitle}
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div key={feature.path} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                  <Link to={feature.path}>
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border border-slate-100">
                      <div className={`${feature.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                        <feature.icon className="text-white" size={32} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- CTA SECTION --- */}
        <section className="py-24 px-4 bg-blue-900 relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-6">{t.ctaTitle}</h2>
            <p className="text-xl mb-10 text-blue-100">{t.ctaText}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://instagram.com/ytukurdi"
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-cyan-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-cyan-50 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-cyan-500/20"
              >
                {t.ctaButton}
              </a>
            </div>
          </motion.div>
        </section>

      </div>
    </>
  );
};

export default Home;