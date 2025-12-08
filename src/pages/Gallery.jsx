import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Image, X, ZoomIn } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { siteContent } from '../data/locales';
import { GALLERY_IMAGES } from '../data/gallery';

const Gallery = () => {
  const { lang } = useLanguage();
  const t = siteContent[lang]?.gallery || { title: 'Wênegeh', desc: '...', cats: {} };
  const [filter, setFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredImages = filter === 'all' ? GALLERY_IMAGES : GALLERY_IMAGES.filter(img => img.category === filter);
  const categories = [
    { id: 'all', label: t.cats.all }, { id: 'newroz', label: t.cats.newroz }, { id: 'calaki', label: t.cats.calaki },
    { id: 'taste', label: t.cats.taste }, { id: 'ger', label: t.cats.ger }
  ];

  return (
    <>
      <Helmet><title>{t.title} - YTU Kurdî</title></Helmet>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <Link to="/" className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-blue-900 dark:hover:text-white transition">
              <ArrowLeft size={20} className="mr-2" /> {lang === 'KU' ? 'Vegere' : (lang === 'TR' ? 'Geri' : 'Back')}
            </Link>
            <div className="text-center">
              <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">{t.title}</h1>
              <p className="text-slate-500 dark:text-slate-400">{t.desc}</p>
            </div>
            <div className="w-20 hidden md:block"></div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setFilter(cat.id)} className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${filter === cat.id ? 'bg-blue-900 text-white shadow-lg scale-105 dark:bg-blue-600' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}>
                {cat.label}
              </button>
            ))}
          </div>

          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {filteredImages.map((img) => (
                <motion.div layout key={img.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} className="relative group cursor-pointer overflow-hidden rounded-xl shadow-md bg-gray-200 dark:bg-slate-800 aspect-[4/3]" onClick={() => setSelectedImage(img)}>
                  <img src={img.src} alt={img.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"><ZoomIn className="text-white" size={32} /></div>
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"><p className="text-white font-bold text-sm truncate">{img.title}</p></div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {selectedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
            <button className="absolute top-6 right-6 text-white/70 hover:text-white transition bg-white/10 p-2 rounded-full"><X size={32} /></button>
            <motion.div initial={{ scale: 0.5, y: 50 }} animate={{ scale: 1, y: 0 }} className="max-w-5xl w-full max-h-[85vh] relative" onClick={(e) => e.stopPropagation()}>
              <img src={selectedImage.src} alt={selectedImage.title} className="w-full h-full object-contain rounded-lg shadow-2xl" />
              <p className="text-white text-center mt-4 text-xl font-medium">{selectedImage.title}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Gallery;