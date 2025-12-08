import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
// Link kaldırıldı
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const PageLayout = ({ icon: Icon, title, description, color, children }) => {
  const { lang } = useLanguage();
  
  // Geri dönme yazısı için 'Geri/Vegere/Back' kullanıyoruz
  const goBackText = lang === 'KU' ? 'Vegere' : (lang === 'TR' ? 'Geri' : 'Back');
  
  // Arka plan ve kenarlık renklerini ayarla
  const bgColor = `bg-${color}-600`;

  // KRİTİK DÜZELTME: Tarayıcı geçmişinde bir adım geri git
  const handleBack = () => {
    window.history.back();
  };

  return (
    <>
      <Helmet>
        <title>{title} - YTU Kurdî</title>
        <meta name="description" content={description} />
      </Helmet>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          
          {/* GERİ DÖN TUŞU DÜZELTİLDİ */}
          <button onClick={handleBack} className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-blue-900 dark:hover:text-white mb-6 transition group">
            <ArrowLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" /> 
            {goBackText} 
          </button>

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