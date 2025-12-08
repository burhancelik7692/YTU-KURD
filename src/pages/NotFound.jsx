import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, ArrowLeft, Home } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { siteContent } from '../data/locales';

const NotFound = () => {
  const { lang } = useLanguage();
  
  // Veritabanından çevirileri çek (Hata korumalı)
  const t = siteContent[lang]?.notFound || {
    title: "404",
    desc: "Page Not Found",
    backButton: "Home"
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center max-w-lg">
        
        {/* Hareketli İkon ve 404 Yazısı */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8 inline-block"
        >
          <div className="text-9xl font-black text-slate-200 select-none">404</div>
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-100 p-6 rounded-full shadow-lg"
          >
            <Map size={64} className="text-blue-600" />
          </motion.div>
        </motion.div>

        {/* Başlık ve Açıklama */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-slate-800 mb-4"
        >
          {t.title}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-slate-500 mb-10 text-lg"
        >
          {t.desc}
        </motion.p>

        {/* Ana Sayfaya Dön Butonu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-blue-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg hover:shadow-blue-900/30 hover:-translate-y-1"
          >
            <Home size={20} />
            {t.backButton}
          </Link>
        </motion.div>

      </div>
    </div>
  );
};

export default NotFound;