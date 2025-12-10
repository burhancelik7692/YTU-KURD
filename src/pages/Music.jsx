import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Music as MusicIcon, Mic2, Disc, Speaker, Guitar, Radio, Volume2, Wind } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { siteContent } from '../data/locales';

// YouTube Modülü
import YouTubeSection from '../components/music/YouTubeSection';

const Music = () => {
  const { lang } = useLanguage();
  
  // Locales verisini çek
  const content = siteContent[lang]?.pages?.muzik || { 
    title: "Muzîk", 
    desc: "Loading...", 
    sections: [] 
  };

  // Enstrüman Listesi (Dile göre dinamik)
  const instruments = [
    { 
        name: lang === 'TR' ? 'Bağlama (Tembûr)' : 'Tembûr', 
        icon: Guitar, 
        desc: lang === 'TR' ? 'Kürt müziğinin en kutsal enstrümanı.' : 'Amûra herî pîroz.' 
    },
    { 
        name: lang === 'TR' ? 'Def (Erbane)' : 'Def (Erbane)', 
        icon: Disc, 
        desc: lang === 'TR' ? 'Kalbin ritmi.' : 'Rîtma dilê Kurdan.' 
    },
    { 
        name: lang === 'TR' ? 'Kaval (Bilûr)' : 'Bilûr', 
        icon: Wind, 
        desc: lang === 'TR' ? 'Çoban ve dağların sesi.' : 'Dengê şivan û çiya.' 
    },
    { 
        name: lang === 'TR' ? 'Dengbêj' : 'Dengbêj', 
        icon: Mic2, 
        desc: lang === 'TR' ? 'Sözlü tarih anlatıcıları.' : 'Dîroka devkî û çand.' 
    }
  ];

  return (
    <>
      <Helmet>
        <title>{content.title} - YTU Kurdî</title>
        <meta name="description" content={content.desc} />
      </Helmet>

      {/* Ana Kapsayıcı */}
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          
          {/* 1. HERO BÖLÜMÜ (Animasyonlu Plak) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="relative bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 dark:from-indigo-900 dark:via-purple-900 dark:to-indigo-950 rounded-3xl p-8 md:p-16 text-white overflow-hidden shadow-2xl mb-16"
          >
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
               
               {/* Sol Taraf: Dönen Plak Animasyonu */}
               <div className="relative group cursor-pointer">
                   <motion.div 
                     animate={{ rotate: 360 }}
                     transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                     className="w-40 h-40 md:w-56 md:h-56 rounded-full border-[6px] border-white/10 flex items-center justify-center bg-black shadow-2xl relative z-10"
                   >
                      {/* Plak Etiketi */}
                      <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-red-500 to-yellow-500 rounded-full flex items-center justify-center border-4 border-black">
                          <MusicIcon size={32} className="text-black opacity-50" />
                      </div>
                      {/* Parlama Efekti */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                   </motion.div>
                   
                   {/* Arka Plan Glow */}
                   <div className="absolute inset-0 bg-purple-500 blur-3xl opacity-30 rounded-full scale-110 -z-10 group-hover:opacity-50 transition-opacity"></div>
               </div>

               {/* Sağ Taraf: Metin */}
               <div className="text-center md:text-left flex-1">
                  <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full mb-4 border border-white/10 backdrop-blur-sm">
                      {/* Ekolayzer Animasyonu */}
                      <div className="flex gap-1 h-4 items-end">
                          <motion.div animate={{ height: [4, 12, 4] }} transition={{ duration: 0.5, repeat: Infinity }} className="w-1 bg-green-400 rounded-full"></motion.div>
                          <motion.div animate={{ height: [6, 16, 6] }} transition={{ duration: 0.4, repeat: Infinity }} className="w-1 bg-yellow-400 rounded-full"></motion.div>
                          <motion.div animate={{ height: [4, 10, 4] }} transition={{ duration: 0.6, repeat: Infinity }} className="w-1 bg-red-400 rounded-full"></motion.div>
                          <motion.div animate={{ height: [5, 14, 5] }} transition={{ duration: 0.5, repeat: Infinity }} className="w-1 bg-blue-400 rounded-full"></motion.div>
                      </div>
                      <span className="text-xs font-bold tracking-widest uppercase opacity-90">Rîtma Jiyanê</span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter drop-shadow-lg">{content.title}</h1>
                  <p className="text-indigo-100 text-lg md:text-2xl font-light leading-relaxed max-w-2xl">{content.desc}</p>
               </div>
            </div>

            {/* Arka Plan Müzik Notaları (Dekor) */}
            <div className="absolute top-10 right-10 opacity-5 text-9xl pointer-events-none select-none rotate-12"><MusicIcon /></div>
            <div className="absolute bottom-10 left-10 opacity-5 text-8xl -rotate-12 pointer-events-none select-none"><Speaker /></div>
          </motion.div>

          {/* 2. ENSTRÜMANLAR (Grid Kartları) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {instruments.map((item, idx) => (
                <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg hover:shadow-2xl border border-slate-100 dark:border-slate-700 text-center hover:-translate-y-2 transition-all duration-300 group cursor-default"
                >
                    <div className="w-16 h-16 mx-auto bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                        <item.icon size={32} />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{item.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-snug">{item.desc}</p>
                </motion.div>
            ))}
          </div>

          {/* 3. BİLGİ KARTLARI (Text Sections) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {content.sections && content.sections.map((section, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-3xl shadow-xl border-l-8 border-indigo-500 dark:border-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
              >
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-300">
                        {idx === 0 ? <Mic2 size={24} /> : <Radio size={24} />}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{section.title}</h2>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                  {section.text}
                </p>
              </motion.div>
            ))}
          </div>

          {/* 4. YOUTUBE VİDEO MODÜLÜ */}
          {/* Admin panelinden eklenen videolar burada görünür */}
          <YouTubeSection title={lang === 'KU' ? 'Vîdeoyên Bijartî' : (lang === 'TR' ? 'Seçme Videolar' : 'Featured Videos')} />

          {/* 5. ALT MESAJ */}
          <div className="mt-16 text-center">
             <span className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-lg italic shadow-xl hover:shadow-2xl hover:scale-105 transition-all cursor-default">
                <Volume2 size={24} />
                {lang === 'KU' ? 'Muzîk xwarina giyan e.' : 'Müzik ruhun gıdasıdır.'}
             </span>
          </div>

        </div>
      </div>
    </>
  );
};

export default Music;