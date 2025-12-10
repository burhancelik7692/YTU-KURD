import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Music, Palette, History, Languages, 
  Calendar, Quote, Bell, Search, Gamepad2, Users, ArrowRight, Sparkles, Star
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { siteContent } from '../data/locales';
// daily.js dosyasını oluşturduğunuzdan emin olun
import { DAILY_CONTENT } from '../data/daily';
import { db } from '../firebase'; 
import { doc, getDoc } from 'firebase/firestore'; 

const Home = () => {
  const { lang } = useLanguage();
  
  // 1. Locales verisini çek (Varsayılan olarak locales.js kullanılır)
  // Dil değiştiğinde bu değişkenler otomatik güncellenir.
  const content = siteContent[lang] || siteContent['KU'];
  const defaultHome = content.home || {};
  const cards = content.cards || {};
  const timeLabels = defaultHome.time || { day: 'Roj', hour: 'Saet', min: 'Deqe', sec: 'Çirk' };

  // 2. State
  const [siteSettings, setSiteSettings] = useState(defaultHome);
  const [dailyItem, setDailyItem] = useState(null);

  // --- AYARLARI GÜNCELLE ---
  useEffect(() => {
    // 1. Adım: Önce yerel veriyi (locales.js) yükle
    // Bu sayede sayfa açılır açılmaz içerik görünür (bekleme olmaz)
    setSiteSettings(content.home || {});

    // 2. Adım: Firebase'den güncel veri var mı bak (Opsiyonel)
    // Eğer admin panelinden başlıkları değiştirdiyseniz, bu kısım devreye girer.
    const fetchSettings = async () => {
        try {
            const settingsRef = doc(db, "settings", "home");
            const docSnap = await getDoc(settingsRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                // Eğer o dile ait özel ayar varsa üzerine yaz
                if(data[lang]) { 
                    setSiteSettings(prev => ({ ...prev, ...data[lang] }));
                }
            }
        } catch (err) {
            // Hata olursa sessizce varsayılan (locales) ile devam et
            console.warn("Firebase ayarları çekilemedi, varsayılan kullanılıyor.");
        }
    };
    fetchSettings();
  }, [lang, content.home]); // Dil değiştiğinde tekrar çalış


  // --- GÜNÜN SÖZÜ MANTIĞI ---
  useEffect(() => {
    if (DAILY_CONTENT && DAILY_CONTENT.length > 0) {
      // Yılın gününe göre sabit bir index belirle (Her gün değişir)
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 0);
      const diff = now - start;
      const oneDay = 1000 * 60 * 60 * 24;
      const dayOfYear = Math.floor(diff / oneDay);
      setDailyItem(DAILY_CONTENT[dayOfYear % DAILY_CONTENT.length]);
    } else {
      // Yedek içerik
      setDailyItem({ type: 'Gotin', text: 'Bi yek gulê bihar nayê.', meaning: 'Bir çiçekle bahar gelmez.' });
    }
  }, []);

  // --- KARTLAR (Renkli Gradientler ile) ---
  const features = [
    { icon: Languages, title: cards.zimanTitle, desc: cards.zimanDesc, path: '/ziman', color: 'from-blue-500 to-blue-700' },
    { icon: BookOpen, title: cards.candTitle, desc: cards.candDesc, path: '/cand', color: 'from-cyan-500 to-cyan-700' },
    { icon: History, title: cards.dirokTitle, desc: cards.dirokDesc, path: '/dirok', color: 'from-slate-500 to-slate-700' },
    { icon: Music, title: cards.muzikTitle, desc: cards.muzikDesc, path: '/muzik', color: 'from-indigo-500 to-indigo-700' },
    { icon: Palette, title: cards.hunerTitle, desc: cards.hunerDesc, path: '/huner', color: 'from-teal-500 to-teal-700' }
  ];

  return (
    <>
      <Helmet><title>{lang === 'KU' ? 'Sereke' : (lang === 'TR' ? 'Anasayfa' : 'Home')} - YTU Kurdî</title></Helmet>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 overflow-x-hidden">
        
        {/* 1. HERO SECTION (Giriş Alanı) */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-20">
          
          {/* Arka Plan (Hareketli Işıklar) */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-slate-900">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full blur-[128px] opacity-40 animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-yellow-600 rounded-full blur-[128px] opacity-30 animate-pulse delay-1000"></div>
            </div>
          </div>

          {/* İçerik */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }} 
            className="max-w-5xl mx-auto text-center relative z-10 px-4"
          >
            {/* Logo */}
            <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
                className="relative inline-block mb-8"
            >
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <img src="/logo.png" alt="YTU Kurdî" className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/10 shadow-2xl" />
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
              {siteSettings.heroTitle1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-200">{siteSettings.heroTitle2}</span>
              <br className="hidden md:block" /> {siteSettings.heroTitle3}
            </h1>
            
            <p className="text-lg md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                {siteSettings.heroSubtitle}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
               <Link to="/ferheng" className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-3 rounded-full font-bold text-lg hover:bg-white hover:text-blue-900 transition-all shadow-lg group">
                 <Search size={20} className="group-hover:scale-110 transition-transform" /> {siteSettings.quickDict}
               </Link>
               <Link to="/listik" className="flex items-center gap-2 bg-yellow-500 text-blue-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/30 transform hover:-translate-y-1">
                 <Gamepad2 size={20} /> {siteSettings.quickGame}
               </Link>
            </div>
          </motion.div>

          {/* Aşağı Kaydır İkonu */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/50 animate-bounce"
          >
              <ArrowRight className="rotate-90" size={24} />
          </motion.div>
        </section>

        {/* 2. BİLGİ KARTLARI (Event & Quote) */}
        <section className="relative z-20 px-4 -mt-16 md:-mt-24 pb-16">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* ETKİNLİK KARTI */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true }} 
                className="bg-slate-800/80 dark:bg-slate-800/90 backdrop-blur-lg border border-slate-700 rounded-3xl p-8 shadow-2xl flex flex-col justify-center relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-blue-500/30 transition-colors"></div>
              
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-600/30"><Bell size={24} /></div>
                <h3 className="text-xs font-bold text-blue-200 uppercase tracking-widest">{siteSettings.eventTitle}</h3>
              </div>
              
              <div className="flex-1 flex flex-col justify-center items-center text-center relative z-10">
                <h2 className="text-2xl font-bold text-white mb-2">{siteSettings.eventEmptyTitle}</h2>
                <p className="text-slate-400 text-sm mb-6">{siteSettings.eventEmptyDesc}</p>
                <div className="flex gap-3 opacity-40">
                    {['day', 'hour', 'min'].map((u, i) => (
                        <div key={i} className="bg-slate-700/50 p-2 rounded-xl text-center w-16 border border-slate-600">
                            <span className="block text-xl font-bold text-white">--</span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wide">{timeLabels[u]}</span>
                        </div>
                    ))}
                </div>
              </div>
            </motion.div>

            {/* GÜNÜN SÖZÜ KARTI */}
            {dailyItem && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: 0.2 }} 
                className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-center relative overflow-hidden"
              >
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
                
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2.5 rounded-xl text-yellow-600 dark:text-yellow-500"><Calendar size={24} /></div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {siteSettings.dailyTitle}: <span className="text-yellow-600 dark:text-yellow-500">{dailyItem.type === 'Gotin' ? siteSettings.dailyQuote : siteSettings.dailyWord}</span>
                  </h3>
                </div>
                
                <div className="flex-1 flex flex-col justify-center relative z-10">
                  <p className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white mb-4 leading-snug">
                    "{dailyItem.text}"
                  </p>
                  <div className="flex items-center gap-2">
                      <span className="w-8 h-1 bg-yellow-400 rounded-full"></span>
                      <p className="text-lg text-slate-500 dark:text-slate-400 italic">{dailyItem.meaning}</p>
                  </div>
                </div>
                
                <Quote className="absolute top-6 right-6 text-slate-100 dark:text-slate-700" size={80} />
              </motion.div>
            )}
          </div>
        </section>

        {/* 3. HAKKIMIZDA (Koyu Mod Uyumlu) */}
        <section className="py-20 px-4 relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                className="text-center"
            >
              <div className="inline-flex items-center justify-center p-3 bg-blue-50 dark:bg-slate-800 rounded-full mb-6 text-blue-600 dark:text-blue-400">
                  <Users size={32} />
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">{siteSettings.aboutTitle}</h2>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-light">
                {siteSettings.aboutText1}
              </p>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                {siteSettings.aboutText2}
              </p>
            </motion.div>
          </div>
        </section>

        {/* 4. ÖZELLİKLER GRID */}
        <section className="py-20 px-4 bg-slate-100 dark:bg-slate-950/50">
          <div className="max-w-7xl mx-auto">
            <motion.div 
                initial={{ opacity: 0 }} 
                whileInView={{ opacity: 1 }} 
                className="flex items-center justify-center gap-3 mb-16"
            >
                <Sparkles className="text-yellow-500" />
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white text-center">{siteSettings.featuresTitle}</h2>
                <Sparkles className="text-yellow-500" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div 
                    key={feature.path} 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }} 
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to={feature.path} className="block h-full">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border border-slate-100 dark:border-slate-700 h-full flex flex-col relative overflow-hidden">
                      {/* Kart Gradiyanı */}
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity -mr-10 -mt-10`}></div>
                      
                      <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon size={28} />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-6 flex-1 text-lg">
                        {feature.desc}
                      </p>
                      
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

        {/* 5. CTA SECTION (Çağrı) */}
        <section className="py-24 px-4 bg-slate-900 dark:bg-black relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          {/* Mavi Işık Efekti */}
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20"></div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="mb-8 flex justify-center">
                <div className="bg-white/10 p-4 rounded-full backdrop-blur-md border border-white/10">
                    <Star size={40} className="text-yellow-400 fill-yellow-400" />
                </div>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">{siteSettings.ctaTitle}</h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">{siteSettings.ctaText}</p>
            
            <a href="https://instagram.com/ytukurdi" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-900 px-10 py-5 rounded-full font-bold text-xl hover:shadow-2xl hover:shadow-yellow-500/20 hover:scale-105 transition-all transform">
              {siteSettings.ctaButton} <ArrowRight size={24} />
            </a>
          </div>
        </section>

      </div>
    </>
  );
};

export default Home;