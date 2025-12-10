import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Scroll, Landmark, Hourglass, Globe, Crown, Sparkles, BookOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { siteContent } from '../data/locales';

const History = () => {
  const { lang } = useLanguage();
  
  // Veritabanından veriyi çek
  const content = siteContent[lang]?.pages?.dirok || { 
    title: "Dîrok", 
    desc: "Loading...", 
    sections: [] 
  };

  // Başlığa göre dinamik ikon seçimi
  const getSectionIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes('kok') || t.includes('origin') || t.includes('köken')) return <Landmark size={28} className="text-amber-600 dark:text-amber-400" />;
    if (t.includes('mîr') || t.includes('mir') || t.includes('principalities')) return <Crown size={28} className="text-red-600 dark:text-red-400" />;
    if (t.includes('nûjen') || t.includes('modern')) return <Globe size={28} className="text-blue-600 dark:text-blue-400" />;
    return <Scroll size={28} className="text-slate-600 dark:text-slate-400" />;
  };

  // Animasyon varyantları
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, type: "spring" } }
  };

  return (
    <>
      <Helmet>
        <title>{content.title} - YTU Kurdî</title>
        <meta name="description" content={content.desc} />
      </Helmet>

      {/* Ana Kapsayıcı - Dark Mode */}
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 transition-colors duration-300">
        <div className="max-w-5xl mx-auto">
          
          {/* 1. HERO BÖLÜMÜ (Epik Kırmızı/Kehribar) */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-red-800 to-amber-700 dark:from-red-900 dark:to-amber-900 rounded-3xl p-10 md:p-14 text-white relative overflow-hidden shadow-2xl mb-16 flex flex-col md:flex-row items-center gap-8"
          >
            {/* Dekoratif Arka Plan */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black opacity-10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>
            
            <div className="relative z-10 bg-white/10 backdrop-blur-md p-6 rounded-full shadow-inner border border-white/10">
               <Hourglass size={48} className="text-amber-100" />
            </div>

            <div className="relative z-10 text-center md:text-left flex-1">
               <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight leading-tight">{content.title}</h1>
               <p className="text-red-100 text-lg md:text-2xl font-medium opacity-90 max-w-2xl">{content.desc}</p>
            </div>
          </motion.div>

          {/* 2. TARİH ŞERİDİ (TIMELINE GÖRÜNÜMÜ) */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative space-y-12 pl-4 md:pl-0"
          >
            {/* Dikey Çizgi (Sadece Desktop) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-red-200 via-amber-200 to-transparent dark:from-red-900 dark:via-amber-900 -translate-x-1/2 rounded-full"></div>

            {content.sections && content.sections.map((section, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                className={`flex flex-col md:flex-row gap-8 items-center ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* 1. Kısım: İçerik Kartı */}
                <div className="flex-1 w-full">
                  <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-shadow relative group">
                    
                    {/* Kart Kenar Süsü */}
                    <div className={`absolute top-0 bottom-0 w-2 rounded-l-3xl transition-colors ${idx % 2 === 0 ? 'right-0 rounded-r-3xl rounded-l-none bg-red-500' : 'left-0 bg-amber-500'}`}></div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-2xl shadow-sm">
                        {getSectionIcon(section.title)}
                      </div>
                      <h2 className="text-2xl font-bold text-slate-800 dark:text-white group-hover:text-red-700 dark:group-hover:text-amber-400 transition-colors">
                        {section.title}
                      </h2>
                    </div>
                    
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg text-justify">
                      {section.text}
                    </p>
                  </div>
                </div>

                {/* 2. Kısım: Orta Nokta (İkon) */}
                <div className="relative z-10 flex-shrink-0 w-12 h-12 bg-white dark:bg-slate-900 border-4 border-red-100 dark:border-red-900 rounded-full flex items-center justify-center shadow-md">
                   <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-amber-500 rounded-full animate-pulse"></div>
                </div>

                {/* 3. Kısım: Boşluk (Dengelemek için) */}
                <div className="flex-1 hidden md:block"></div>
              </motion.div>
            ))}
          </motion.div>

          {/* 3. ALT SÖZ */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-20 text-center"
          >
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 italic font-medium shadow-sm">
              <BookOpen size={20} />
              <span>
                {lang === 'KU' ? 'Dîrok neynika paşerojê ye.' : (lang === 'TR' ? 'Tarih geleceğin aynasıdır.' : 'History is the mirror of the future.')}
              </span>
              <Sparkles size={20} className="text-amber-500" />
            </div>
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default History;