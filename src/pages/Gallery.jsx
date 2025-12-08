import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, X, ZoomIn, Loader2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { siteContent } from '../data/locales';

// Firebase bağlantısı
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

const Gallery = () => {
  const { lang } = useLanguage();
  const t = siteContent[lang]?.gallery || { title: 'Wênegeh', desc: '...', cats: {} };
  
  const [images, setImages] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  // --- FIREBASE'DEN VERİ ÇEKME ---
  useEffect(() => {
    const fetchGallery = async () => {
      // Veri çekimi sırasında Auth hatası vermemesi için korumalı try-catch bloğu
      try {
        // dynamicContent koleksiyonundan sadece 'gallery' tipindeki verileri çek
        const contentRef = collection(db, "dynamicContent");
        
        // Sadece 'gallery' tipinde olan ve en son eklenenleri çeker
        const q = query(
          contentRef, 
          where("type", "==", "gallery"), 
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        
        const firebaseImages = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // NOT: Admin panelinden eklenen URL'ler data.url olarak geliyor
          firebaseImages.push({ 
              id: doc.id, 
              src: data.url, 
              title: data.title, 
              category: data.category?.toLowerCase() || 'calaki' 
          });
        });

        if (firebaseImages.length === 0) {
            setError("Henüz galeriye bir şey eklenmemiş.");
        }
        setImages(firebaseImages); 

      } catch (err) {
        console.error("Galeri verisi çekilemedi (Firebase Hatası):", err);
        setError("Veritabanı bağlantı hatası veya erişim reddedildi.");
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []); // Sadece bir kere çalışır

  // Filtreleme Mantığı
  const filteredImages = filter === 'all' 
    ? images 
    : images.filter(img => img.category === filter);

  const categories = [
    { id: 'all', label: t.cats.all || 'Hemû' },
    { id: 'newroz', label: t.cats.newroz || 'Newroz' },
    { id: 'calaki', label: t.cats.calaki || 'Çalakî' },
    { id: 'taste', label: t.cats.taste || 'Taştê' },
    { id: 'ger', label: t.cats.ger || 'Ger' },
  ];

  return (
    <>
      <Helmet>
        <title>{t.title} - YTU Kurdî</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          
          {/* Başlık */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <Link to="/" className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-blue-900 dark:hover:text-white transition">
              <ArrowLeft size={20} className="mr-2" /> {lang === 'KU' ? 'Vegere' : 'Geri'}
            </Link>
            <div className="text-center">
              <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">{t.title}</h1>
              <p className="text-slate-500 dark:text-slate-400">{t.desc}</p>
            </div>
            <Link to="/admin" className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition">
               Admin <ImageIcon size={14} />
            </Link>
          </div>

          {/* Hata Mesajı */}
          {error && (
             <div className="text-center bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-xl flex items-center justify-center gap-2 my-8">
               <AlertCircle size={20} /> {error}
             </div>
          )}

          {/* Filtre Butonları */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
                  filter === cat.id 
                    ? 'bg-blue-900 text-white shadow-lg scale-105 dark:bg-blue-600' 
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Yükleniyor Göstergesi */}
          {loading && (
            <div className="flex justify-center my-12">
              <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" size={40} />
            </div>
          )}

          {/* Fotoğraf Izgarası */}
          {!loading && !error && (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence>
                {filteredImages.length > 0 ? (
                  filteredImages.map((img) => (
                    <motion.div
                      layout
                      key={img.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.3 }}
                      className="relative group cursor-pointer overflow-hidden rounded-xl shadow-md bg-gray-200 dark:bg-slate-800 aspect-[4/3]"
                      onClick={() => setSelectedImage(img)}
                    >
                      <img 
                        src={img.src} // Firebase Firestore'dan gelen URL
                        alt={img.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        // Hata olursa (link kırılmışsa) ikon göster
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            e.target.parentNode.innerHTML = '<div class="w-full h-full flex items-center justify-center text-slate-400"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></div>';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <ZoomIn className="text-white" size={32} />
                      </div>
                      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white font-bold text-sm truncate">{img.title}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-slate-400">
                    <p>Bu kategoride henüz fotoğraf yok.</p>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Lightbox (Büyük Resim Modu) */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-6 right-6 text-white/70 hover:text-white transition bg-white/10 p-2 rounded-full">
              <X size={32} />
            </button>
            
            <motion.div 
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-5xl w-full max-h-[85vh] relative"
              onClick={(e) => e.stopPropagation()} 
            >
              <img 
                src={selectedImage.src} 
                alt={selectedImage.title} 
                className="w-full h-full object-contain rounded-lg shadow-2xl"
              />
              <p className="text-white text-center mt-4 text-xl font-medium">{selectedImage.title}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Gallery;