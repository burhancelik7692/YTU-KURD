import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Languages, BookOpen, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { siteContent } from '../data/locales';

// Modülleri İçe Aktar
import AlphabetSection from '../components/language/AlphabetSection';
import FlashcardSection from '../components/language/FlashcardSection';
import PhraseBookSection from '../components/language/PhraseBookSection';

const Language = () => {
  const { lang } = useLanguage();
  
  // Locales verisini çek
  const content = siteContent[lang]?.pages?.ziman || { 
    title: "Ziman", 
    desc: "Loading...", 
    alphabetTitle: "Alfabe", 
    phrasesTitle: "Hevok",
    topics: [], 
    phrases: []
  };

  return (
    <>
      <Helmet>
        <title>{content.title} - YTU Kurdî</title>
        <meta name="description" content={content.desc} />
      </Helmet>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          
          {/* 1. HERO BÖLÜMÜ */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-center mb-16"
          >
            <div className="inline-block p-5 bg-blue-100 dark:bg-blue-900/30 rounded-3xl mb-6 shadow-sm">
              <Languages size={48} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">{content.title}</h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                {content.desc}
            </p>
          </motion.div>

          {/* 2. KONU KARTLARI (Topics) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            {content.topics && content.topics.map((topic, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 transition-all group"
              >
                <div className="bg-blue-50 dark:bg-slate-700 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {topic.title}
                </h3>
                <p className="text-sm font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wide mb-4">
                    {topic.desc}
                </p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                    {topic.text}
                </p>
              </motion.div>
            ))}
          </div>

          {/* 3. ALFABE MODÜLÜ */}
          <AlphabetSection title={content.alphabetTitle} />

          {/* 4. FLASHCARD (DİL KARTLARI) MODÜLÜ - YENİ */}
          <FlashcardSection lang={lang} />

          {/* 5. PRATİK CÜMLELER MODÜLÜ */}
          <PhraseBookSection title={content.phrasesTitle} phrases={content.phrases} />

          {/* ALT MESAJ */}
          <div className="mt-20 text-center">
             <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium italic">
                <Sparkles size={16} className="text-yellow-500" />
                {lang === 'KU' ? 'Zimanê me, nasnameya me ye.' : 'Dilimiz, kimliğimizdir.'}
             </span>
          </div>

        </div>
      </div>
    </>
  );
};

export default Language;