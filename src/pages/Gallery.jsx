import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Loader2, ZoomIn, X, Image as ImageIcon, Camera, Filter, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { siteContent } from '../data/locales';

// Firebase bağlantısı
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

const Gallery = () => {
  const { lang } = useLanguage();
  
  // Locales verisini güvenli çek
  const t = siteContent[lang]?.gallery || { 
    title: 'Wênegeh', 
    desc: 'Bîranînên me...', 
    cats: { all: 'Hemû', newroz: 'Newroz', calaki: 'Çalakî', taste: 'Taştê', ger: 'Ger' } 
  };
  
  const [images, setImages] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  // --- FIREBASE VERİ ÇEKME ---
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setError(null);
        const contentRef = collection(db, "dynamicContent");
        
        const q = query(
          contentRef, 
          where("type", "==", "gallery"), 
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        
        const firebaseImages = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          firebaseImages.push({ 
              id: doc.id, 
              src: data.url, 
              title: data.title, 
              category: data.category?.toLowerCase() || 'calaki' 
          });
        });

        setImages(firebaseImages); 

      } catch (err) {
        console.error("Galeri hatası:", err);
        setError(lang === 'KU' ? "Pirsgirêka girêdanê." : "Bağlantı hatası.");
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtreleme Mantığı
  const filteredImages = filter === 'all' 
    ? images 
    : images.filter(img => img.category === filter);

  // Kategoriler (Navigasyon için)
  const categories = [
    { id: 'all', label: t.cats.all || 'Hemû' },
    { id: 'newroz', label: t.cats.newroz || 'Newroz' },
    { id: 'calaki', label: t.cats.calaki || 'Çalakî' },
    { id: 'taste', label: t.cats.taste || 'Taştê' },
    { id: 'ger', label: t.cats.ger || 'Ger' },
  ];

  return (
    <>
      <Helmet><title>{t.title} - YTU Kurdî</title></Helmet>

      {/* Ana Kapsayıcı */}
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          
          {/* 1. HERO BÖLÜMÜ (Başlık) */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-900 dark:to-cyan-800 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl mb-10 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            {/* Arka Plan Efekti */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            
            <div className="relative z-10 text-center md:text-left">
                <div className="inline-flex items-center gap-3 mb-2 bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                    <Camera size={18} className="text-cyan-200" />
                    <span className="text-sm font-bold tracking-wide uppercase text-cyan-50">YTU Kurdî Galeri</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black mb-3 tracking-tight">{t.title}</h1>
                <p className="text-blue-100 text-lg md:text-xl max-w-xl">{t.desc}</p>
            </div>

            {/* Sağ Taraf Dekoru */}
            <div className="hidden md:block relative z-10">
                <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner rotate-3 hover:rotate-6 transition-transform">
                    <ImageIcon size={48} className="text-white drop-shadow-md" />
                </div>
            </div>
          </motion.div>

          {/* 2. FİLTRE KATEGORİLERİ */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`relative px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                  filter === cat.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105' 
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {filter === cat.id && <motion.div layoutId="activeFilter" className="absolute inset-0 bg-blue-600 rounded-full -z-10" />}
                {filter === cat.id && <Filter size={14} className="animate-pulse" />}
                <span className="relative z-10">{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Hata Mesajı */}
          {error && (
             <div className="text-center bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-xl flex items-center justify-center gap-2 my-8 border border-red-200 dark:border-red-800">
               <AlertCircle size={20} /> {error}
             </div>
          )}

          {/* Yükleniyor */}
          {loading && (
            <div className="flex flex-col items-center justify-center my-20 gap-4">
              <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" size={48} />
              <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Wêne tên barkirin...</p>
            </div>
          )}

          {/* 3. GALERİ GRID */}
          {!loading && !error && (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredImages.length > 0 ? (
                  filteredImages.map((img, index) => (
                    <motion.div
                      layout
                      key={img.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-md bg-slate-200 dark:bg-slate-800 aspect-[4/5] md:aspect-square"
                      onClick={() => setSelectedImage(img)}
                    >
                      {/* Resim */}
                      <img 
                        src={img.src} 
                        alt={img.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            e.target.parentNode.classList.add('flex', 'items-center', 'justify-center', 'bg-slate-100', 'dark:bg-slate-800');
                            e.target.parentNode.innerHTML += '<span class="text-slate-400"><svg.../></span>'; 
                        }}
                      />
                      
                      {/* Hover Overlay (Karanlık Perde) */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <span className="inline-block px-2 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase rounded mb-2 tracking-wider">
                                {img.category}
                            </span>
                            <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">{img.title}</h3>
                        </div>
                      </div>

                      {/* Büyüteç İkonu (Ortada) */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
                            <ZoomIn className="text-white" size={32} />
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-20 px-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <ImageIcon size={32} />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Di vê kategoriyê de wêne tune.</p>
                    <button onClick={() => setFilter('all')} className="mt-4 text-blue-600 dark:text-blue-400 font-bold hover:underline">
                        Hemû wêneyan nîşan bide
                    </button>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* 4. LIGHTBOX (Büyük Resim Modu) */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
            onClick={() => setSelectedImage(null)}
          >
            {/* Kapat Butonu */}
            <button className="absolute top-6 right-6 text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all z-50">
              <X size={40} />
            </button>
            
            {/* Resim Container */}
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()} 
            >
              <img 
                src={selectedImage.src} 
                alt={selectedImage.title} 
                className="w-auto h-auto max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
              <div className="mt-6 text-center">
                  <h2 className="text-white text-2xl font-bold mb-1">{selectedImage.title}</h2>
                  <span className="inline-block px-3 py-1 bg-white/10 text-white/80 text-xs font-bold uppercase rounded-full border border-white/10">
                    {selectedImage.category}
                  </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Gallery;