import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, MessageCircle, FileText, Headphones, Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { siteContent } from '../data/locales';

const Language = () => {
  const { lang } = useLanguage();
  
  const content = siteContent[lang]?.pages?.ziman || { 
    title: "Ziman", desc: "Loading...", alphabetTitle: "Alfabe", topics: [], phrases: []
  };

  // Konu İkonları
  const getIcon = (id) => {
    switch (id) {
      case 'reziman': return BookOpen;
      case 'axaftin': return MessageCircle;
      case 'peyv': return FileText;
      case 'guhdari': return Headphones;
      default: return BookOpen;
    }
  };

  // Sabit Alfabe
  const alphabet = [
    { letter: 'A', pronunciation: 'a' }, { letter: 'B', pronunciation: 'be' },
    { letter: 'C', pronunciation: 'ce' }, { letter: 'Ç', pronunciation: 'çe' },
    { letter: 'D', pronunciation: 'de' }, { letter: 'E', pronunciation: 'e' },
    { letter: 'Ê', pronunciation: 'ê' }, { letter: 'F', pronunciation: 'fe' },
    { letter: 'G', pronunciation: 'ge' }, { letter: 'H', pronunciation: 'he' },
    { letter: 'I', pronunciation: 'ı' }, { letter: 'Î', pronunciation: 'î' },
    { letter: 'J', pronunciation: 'je' }, { letter: 'K', pronunciation: 'ke' },
    { letter: 'L', pronunciation: 'le' }, { letter: 'M', pronunciation: 'me' },
    { letter: 'N', pronunciation: 'ne' }, { letter: 'O', pronunciation: 'o' },
    { letter: 'P', pronunciation: 'pe' }, { letter: 'Q', pronunciation: 'qe' },
    { letter: 'R', pronunciation: 're' }, { letter: 'S', pronunciation: 'se' },
    { letter: 'Ş', pronunciation: 'şe' }, { letter: 'T', pronunciation: 'te' },
    { letter: 'U', pronunciation: 'u' }, { letter: 'Û', pronunciation: 'û' },
    { letter: 'V', pronunciation: 've' }, { letter: 'W', pronunciation: 'we' },
    { letter: 'X', pronunciation: 'xe' }, { letter: 'Y', pronunciation: 'ye' },
    { letter: 'Z', pronunciation: 'ze' }
  ];

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
          
          {/* Başlık */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
              <Languages size={40} className="text-blue-600" />
            </div>
            <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">{content.title}</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">{content.desc}</p>
          </motion.div>

          {/* Konular */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {content.topics && content.topics.map((topic, index) => {
              const Icon = getIcon(topic.id);
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 hover:shadow-xl transition-all"
                >
                  <div className="bg-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg shadow-blue-200">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">{topic.title}</h3>
                  <p className="text-sm font-bold text-blue-500 uppercase tracking-wide mb-4">{topic.desc}</p>
                  <p className="text-slate-600 leading-relaxed">{topic.text}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Alfabe */}
          <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="bg-white rounded-3xl shadow-xl p-8 mb-16 border border-slate-100">
            <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">{content.alphabetTitle}</h2>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
              {alphabet.map((item, index) => (
                <motion.div key={item.letter} whileHover={{ scale: 1.1 }} className="bg-slate-50 rounded-xl p-3 text-center cursor-pointer border border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition-colors">
                  <div className="text-2xl font-black text-slate-800">{item.letter}</div>
                  <div className="text-xs text-slate-400 font-medium">{item.pronunciation}</div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Pratik Cümleler */}
          <motion.section className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-3xl shadow-2xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
            <h2 className="text-3xl font-bold text-center mb-10 relative z-10">{content.phrasesTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
              {content.phrases && content.phrases.map((phrase, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/10 hover:bg-white/20 transition">
                  <div className="text-xl font-bold text-yellow-400 mb-1">{phrase.org}</div>
                  <div className="text-blue-100">{phrase.mean}</div>
                </div>
              ))}
            </div>
          </motion.section>

        </div>
      </div>
    </>
  );
};

export default Language;