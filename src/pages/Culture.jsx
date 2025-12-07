import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { siteContent } from '../data/locales';

const Culture = () => {
  const { lang } = useLanguage();
  const content = siteContent[lang]?.pages?.cand || { 
    title: "Çand", 
    desc: "Loading...", 
    sections: [] 
  };

  return (
    <>
      <Helmet>
        <title>{content.title} - YTU Kurdî</title>
        <meta name="description" content={content.desc} />
      </Helmet>

      <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          
          <Link to="/" className="inline-flex items-center text-slate-500 hover:text-blue-900 mb-6 transition group">
            <ArrowLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" /> 
            {lang === 'KU' ? 'Vegere' : (lang === 'TR' ? 'Geri' : 'Back')}
          </Link>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100"
          >
            {/* Başlık (Yeşil) */}
            <div className="bg-emerald-600 p-8 md:p-12 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                  <Users size={32} className="text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">{content.title}</h1>
                <p className="text-emerald-100 text-lg md:text-xl font-medium max-w-2xl">{content.desc}</p>
              </div>
              <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
            </div>

            <div className="p-8 md:p-12 space-y-10">
              {content.sections && content.sections.map((section, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow"
                >
                  <h2 className="text-2xl font-bold text-emerald-800 mb-3">{section.title}</h2>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {section.text}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="bg-slate-50 p-8 text-center border-t border-slate-100">
              <p className="text-slate-400 text-sm italic flex items-center justify-center gap-2">
                <Globe size={16} />
                {lang === 'KU' ? 'Çand hebûna me ye.' : 'Kültür varlığımızdır.'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Culture;