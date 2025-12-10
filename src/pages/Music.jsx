import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Music as MusicIcon, Mic2, Disc, Speaker, Guitar, Radio, Volume2 } from 'lucide-react'; // İkonları çeşitlendirdik
import { useLanguage } from '../context/LanguageContext';
import { siteContent } from '../data/locales';

// Yeni Modülümüzü Ekliyoruz
import YouTubeSection from '../components/music/YouTubeSection';

const Music = () => {
  const { lang } = useLanguage();
  
  // Locales verisini çek
  const content = siteContent[lang]?.pages?.muzik || { 
    title: "Muzîk", 
    desc: "Loading...", 
    sections: [] 
  };

  // Enstrüman Listesi (Sabit Veri - Görsel Zenginlik İçin)
  const instruments = [
    { name: 'Tembûr', icon: Guitar, desc: 'Amûra herî pîroz.' },
    { name: 'Def (Erbane)', icon: Disc, desc: 'Rîtma dilê Kurdan.' },
    { name: 'Bilûr (Kaval)', icon:  WindIcon, desc: 'Dengê şivan û çiya.' },
    { name: 'Dengbêj', icon: Mic2, desc: 'Dîroka devkî.' }
  ];

  // Yardımcı İkon Bileşeni (Kaval ikonu lucide'de yoksa MusicIcon kullan)
  function WindIcon(props) { return <MusicIcon {...props} />; }

  return (
    <>
      <Helmet>
        <title>{content.title} - YTU Kurdî</title>
        <meta name="description" content={content.desc} />
      </Helmet>

      {/* Ana Kapsayıcı - Dark Mode */}
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          
          {/* 1. HERO BÖLÜMÜ (Müzikal Efektli) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="relative bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 dark:from-indigo-900 dark:via-purple-900 dark:to-indigo-950 rounded-3xl p-8 md:p-16 text-white overflow-hidden shadow-2xl mb-16"
          >
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
               {/* Dönen Plak Efekti */}
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                 className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/20 flex items-center justify-center bg-black/30 backdrop-blur-md shadow-2xl"
               >
                  <MusicIcon size={64} className="text-white" />
               </motion.div>

               <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full mb-4 border border-white/10 backdrop-blur-sm">
                      <div className="flex gap-1 h-3 items-end">
                          <motion.div animate={{ height: [4, 12, 4] }} transition={{ duration: 0.5, repeat: Infinity }} className="w-1 bg-green-400 rounded-full"></motion.div>
                          <motion.div animate={{ height: [6, 16, 6] }} transition={{ duration: 0.4, repeat: Infinity }} className="w-1 bg-yellow-400 rounded-full"></motion.div>
                          <motion.div animate={{ height: [4, 10, 4] }} transition={{ duration: 0.6, repeat: Infinity }} className="w-1 bg-red-400 rounded-full"></motion.div>
                      </div>
                      <span className="text-xs font-bold tracking-widest uppercase opacity-90">Rîtma Jiyanê</span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter">{content.title}</h1>
                  <p className="text-indigo-100 text-lg md:text-2xl font-light max-w-2xl">{content.desc}</p>
               </div>
            </div>

            {/* Arka Plan Müzik Notaları */}
            <div className="absolute top-10 right-10 opacity-10 text-9xl"><MusicIcon /></div>
            <div className="absolute bottom-10 left-10 opacity-5 text-8xl rotate-12"><Speaker /></div>
          </motion.div>

          {/* 2. ENSTRÜMANLAR KARTI (Grid) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {instruments.map((item, idx) => (
                <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 text-center hover:-translate-y-2 transition-transform duration-300 group"
                >
                    <div className="w-14 h-14 mx-auto bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 group-hover:scale-110 transition-transform">
                        <item.icon size={28} />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">{item.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                </motion.div>
            ))}
          </div>

          {/* 3. BİLGİ KARTLARI (Locales'den Gelen İçerik) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {content.sections && content.sections.map((section, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border-l-8 border-indigo-500 dark:border-indigo-600"
              >
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                        {idx === 0 ? <Mic2 className="text-indigo-700 dark:text-indigo-300" /> : <Radio className="text-indigo-700 dark:text-indigo-300" />}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{section.title}</h2>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                  {section.text}
                </p>
              </motion.div>
            ))}
          </div>

          {/* 4. YOUTUBE VİDEO MODÜLÜ (Entegrasyon) */}
          <YouTubeSection title={lang === 'KU' ? 'Vîdeoyên Bijartî' : (lang === 'TR' ? 'Seçme Videolar' : 'Featured Videos')} />

          {/* 5. ALT MESAJ */}
          <div className="mt-16 text-center">
             <span className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium italic shadow-lg">
                <Volume2 size={20} />
                {lang === 'KU' ? 'Muzîk xwarina giyan e.' : 'Müzik ruhun gıdasıdır.'}
             </span>
          </div>

        </div>
      </div>
    </>
  );
};

export default Music;