import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Flower2, Flame, Shirt, Music, Globe, Star, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { siteContent } from '../data/locales';

const Culture = () => {
  const { lang } = useLanguage();
  
  // Veriyi çek
  const content = siteContent[lang]?.pages?.cand || { 
    title: "Çand", 
    desc: "Loading...", 
    sections: [] 
  };

  // Başlığa göre dinamik ikon seçimi yapan yardımcı fonksiyon
  const getSectionIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes('newroz')) return <Flame className="text-orange-500" size={32} />;
    if (t.includes('cil') || t.includes('giyim') || t.includes('clothing')) return <Shirt className="text-purple-500" size={32} />;
    if (t.includes('muzik') || t.includes('music')) return <Music className="text-pink-500" size={32} />;
    return <Star className="text-emerald-500" size={32} />;
  };

  // Kart Animasyon Ayarları
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <Helmet>
        <title>{content.title} - YTU Kurdî</title>
        <meta name="description" content={content.desc} />
      </Helmet>

      {/* Ana Kapsayıcı - Dark Mode */}
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          
          {/* 1. HERO BÖLÜMÜ (Başlık) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-800 dark:to-teal-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl mb-12"
          >
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <div className="bg-white/20 w-24 h-24 rounded-full flex items-center justify-center backdrop-blur-md shadow-inner">
                <Flower2 size={48} className="text-white drop-shadow-md" />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-6xl font-black mb-2 tracking-tight">{content.title}</h1>
                <p className="text-emerald-100 text-lg md:text-2xl font-medium max-w-2xl">{content.desc}</p>
              </div>
            </div>
            
            {/* Arka Plan Desenleri */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-yellow-400 opacity-20 rounded-full blur-2xl"></div>
          </motion.div>

          {/* 2. İÇERİK IZGARASI (Grid Layout) */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {content.sections && content.sections.map((section, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col"
              >
                {/* Kart Başlığı */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 flex items-center gap-4">
                  <div className="p-3 bg-white dark:bg-slate-700 rounded-xl shadow-sm">
                    {getSectionIcon(section.title)}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                    {section.title}
                  </h2>
                </div>

                {/* Kart İçeriği */}
                <div className="p-6 flex-1">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                    {section.text}
                  </p>
                </div>

                {/* Kart Altı Dekor */}
                <div className="h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
              </motion.div>
            ))}
          </motion.div>

          {/* 3. ALT BİLGİ / SÖZ */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 font-medium italic">
              <Sparkles size={18} />
              <span>
                {lang === 'KU' ? 'Çand hebûna me ye, nasnameya me ye.' : (lang === 'TR' ? 'Kültür varlığımızdır, kimliğimizdir.' : 'Culture is our existence, our identity.')}
              </span>
              <Globe size={18} />
            </div>
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default Culture;