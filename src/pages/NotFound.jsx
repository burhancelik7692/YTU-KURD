import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Home, Map } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { siteContent } from '../data/locales';

const NotFound = () => {
  const { lang } = useLanguage();
  
  // Veritabanından çevirileri çek (Yoksa varsayılan Kürtçe)
  const t = siteContent[lang]?.notFound || {
    title: "Rêya Xwe Winda Kir?",
    desc: "Bibore, rûpela ku tu lê digerî me nedît.",
    backButton: "Vegere Sereke"
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 overflow-hidden relative transition-colors duration-300">
      
      {/* Arka Plan Süslemeleri (Blur Efektleri) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="text-center max-w-lg relative z-10">
        
        {/* Hareketli Pusula ve 404 */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="relative mb-8 inline-block"
        >
          {/* Arka plandaki dev 404 yazısı */}
          <div className="text-[10rem] font-black text-slate-200 dark:text-slate-800 leading-none select-none tracking-tighter">
            404
          </div>
          
          {/* Ortadaki Dönen Pusula */}
          <motion.div 
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 15, -15, 0] }} // Pusula iğnesi gibi sallanma efekti
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 p-6 rounded-full shadow-2xl border-4 border-slate-100 dark:border-slate-700"
          >
            <Compass size={64} className="text-blue-600 dark:text-blue-400" />
          </motion.div>
        </motion.div>

        {/* Başlık ve Açıklama */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            {t.title}
          </h1>
          
          <p className="text-slate-600 dark:text-slate-400 mb-10 text-lg leading-relaxed">
            {t.desc}
          </p>

          {/* Ana Sayfaya Dön Butonu */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-3 bg-blue-900 dark:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-800 dark:hover:bg-blue-500 transition-all shadow-xl hover:shadow-blue-900/20 hover:-translate-y-1 group"
          >
            <Home size={22} className="group-hover:scale-110 transition-transform" />
            {t.backButton}
          </Link>
        </motion.div>

        {/* Alt Kısım - Dekoratif Harita İkonu */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 1 }}
           className="mt-12 text-slate-300 dark:text-slate-700"
        >
           <Map size={32} className="mx-auto opacity-50" />
        </motion.div>

      </div>
    </div>
  );
};

export default NotFound;