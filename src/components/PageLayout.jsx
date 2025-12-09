import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
// Link, ArrowLeft importları kaldırıldı
import { useLanguage } from '../context/LanguageContext';

const PageLayout = ({ icon: Icon, title, description, color, children }) => {
  const { lang } = useLanguage();
  
  // Arka plan ve kenarlık renklerini ayarla
  const bgColor = `bg-${color}-600`;

  return (
    <>
      <Helmet>
        <title>{title} - YTU Kurdî</title>
        <meta name="description" content={description} />
      </Helmet>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          
          {/* GERİ TUŞU BURADAN KALDIRILDI */}
          {/* Kullanıcı sadece Ana Menüdeki linkler üzerinden navigasyon yapacaktır. */}

          {/* Başlık Alanı */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className={`inline-block p-4 ${bgColor} dark:bg-slate-800 rounded-full mb-4 shadow-xl`}>
              <Icon size={40} className="text-white" />
            </div>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{title}</h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">{description}</p>
          </motion.div>

          {/* İçerik Kartı */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700 p-8 md:p-12"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PageLayout;