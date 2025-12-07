import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react'; // Tarih için 'BookOpen' uygun
import { useLanguage } from '../context/LanguageContext';
import { siteContent } from '../data/locales';

const History = () => {
  const { lang } = useLanguage();
  
  // Veritabanından (locales.js) 'dirok' kısmını çekiyoruz
  // Veri yoksa hata vermemesi için boş obje {} kontrolü
  const content = siteContent[lang]?.pages?.dirok || { 
    title: "Dîrok", 
    desc: "Loading...", 
    sections: [] 
  };

  return (
    <>
      {/* SEO Ayarları */}
      <Helmet>
        <title>{content.title} - YTU Kurdî</title>
        <meta name="description" content={content.desc} />
      </Helmet>

      <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Geri Dön Butonu */}
          <Link to="/" className="inline-flex items-center text-slate-500 hover:text-blue-900 mb-6 transition group">
            <ArrowLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" /> 
            {lang === 'KU' ? 'Vegere' : (lang === 'TR' ? 'Geri' : 'Back')}
          </Link>
          
          {/* Ana İçerik Kartı */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100"
          >
            {/* Başlık Kısmı (Kırmızı - Red Tema) */}
            <div className="bg-red-600 p-8 md:p-12 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                  <BookOpen size={32} className="text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">{content.title}</h1>
                <p className="text-red-100 text-lg md:text-xl font-medium max-w-2xl">{content.desc}</p>
              </div>
              
              {/* Dekoratif Arka Plan Şekilleri */}
              <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
              <div className="absolute left-0 bottom-0 w-32 h-32 bg-black opacity-5 rounded-full -ml-10 -mb-10 pointer-events-none"></div>
            </div>

            {/* İçerik Döngüsü */}
            <div className="p-8 md:p-12 space-y-10">
              {content.sections && content.sections.map((section, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="border-l-4 border-red-500 pl-6 py-1 group hover:bg-red-50/50 rounded-r-xl transition-colors"
                >
                  <h2 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-red-700 transition-colors">
                    {section.title}
                  </h2>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {section.text}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Alt Bilgi Alanı */}
            <div className="bg-slate-50 p-8 text-center border-t border-slate-100">
              <p className="text-slate-400 text-sm italic">
                {lang === 'KU' ? 'Dîrok neynika paşerojê ye.' : 'Tarih geleceğin aynasıdır.'}
              </p>
            </div>

          </motion.div>
        </div>
      </div>
    </>
  );
};

export default History;