import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Book, X, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { DICTIONARY } from '../data/dictionary';

const Dictionary = () => {
  const { lang } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const t = {
    KU: { title: "Ferhenga Kurdî", search: "Peyvê bigere...", back: "Vegere", count: "peyv hat dîtin", notFound: "Peyv nehat dîtin" },
    TR: { title: "Kürtçe Sözlük", search: "Kelime ara...", back: "Geri", count: "kelime bulundu", notFound: "Kelime bulunamadı" },
    EN: { title: "Kurdish Dictionary", search: "Search word...", back: "Back", count: "words found", notFound: "Word not found" }
  }[lang] || { title: "Ferhenga Kurdî" };

  const filteredWords = DICTIONARY.filter(item => 
    item.ku.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.tr.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.ku.localeCompare(b.ku));

  return (
    <>
      <Helmet><title>{t.title} - YTU Kurdî</title></Helmet>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 transition-colors duration-300">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-blue-900 dark:hover:text-white mb-6 transition group">
            <ArrowLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" /> {t.back}
          </Link>

          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 mb-8 border border-slate-100 dark:border-slate-700 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-purple-600"></div>
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400"><Book size={32} /></div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-6">{t.title}</h1>
            
            <div className="relative max-w-lg mx-auto">
              <input type="text" placeholder={t.search} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-lg font-medium" />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={24} />
              {searchTerm && <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-red-500"><X size={20} /></button>}
            </div>
            <p className="mt-4 text-sm text-slate-400 font-medium">{filteredWords.length} {t.count}</p>
          </div>

          <motion.div layout className="grid gap-3">
            <AnimatePresence>
              {filteredWords.length > 0 ? (
                filteredWords.map((word, index) => (
                  <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
                    className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex justify-between items-center group">
                    <div className="flex-1"><span className="text-xl font-bold text-blue-900 dark:text-blue-300 block">{word.ku}</span><span className="text-xs text-slate-400 font-bold tracking-wider uppercase">Kurdî</span></div>
                    <div className="text-slate-300 dark:text-slate-600 mx-4"><ArrowLeft size={20} className="rotate-180" /></div>
                    <div className="flex-1 text-right"><span className="text-lg font-medium text-slate-600 dark:text-slate-300 block">{word.tr}</span><span className="text-xs text-slate-400 font-bold tracking-wider uppercase">Tirkî</span></div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12"><div className="text-6xl mb-4">🔍</div><h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">{t.notFound}</h3></div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Dictionary;