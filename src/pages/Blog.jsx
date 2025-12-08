import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2, BookOpen, Film, Music as MusicIcon, MessageSquare, ChevronRight, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { siteContent } from '../data/locales';

// Firebase bağlantısı
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

const Blog = () => {
  const { lang } = useLanguage();
  
  // Locales metinlerini çekiyoruz
  const t = {
    KU: { title: 'Duyurular & İçerikler', desc: 'Blog, makale, video ve önerilen kitaplar', back: 'Vegere', noContent: 'Henüz içerik eklenmemiş.', admin: 'Admin Panelinden içerik ekle' },
    TR: { title: 'Duyurular & İçerikler', desc: 'Blog, makale, video ve önerilen kitaplar', back: 'Geri', noContent: 'Henüz içerik eklenmemiş.', admin: 'Admin Panelinden içerik ekle' },
    EN: { title: 'Announcements & Content', desc: 'Blog, articles, videos, and suggested books', back: 'Back', noContent: 'No content added yet.', admin: 'Add content from Admin Panel' }
  }[lang];

  const [contentList, setContentList] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Veritabanından veri çekme
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setError(null);
        const contentRef = collection(db, "dynamicContent");
        
        // Sadece 'content', 'book', 'video', 'music' tiplerini çek
        const q = query(
          contentRef, 
          where("type", "in", ["content", "book", "video", "music"]), 
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        
        const list = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });

        setContentList(list); 
      } catch (err) {
        console.error("İçerik çekilemedi (Firebase Hatası):", err);
        setError("Veritabanı bağlantı hatası veya erişim reddedildi.");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  // İkona göre içerik türünü belirleme
  const getIcon = (type) => {
    switch (type) {
      case 'book': return BookOpen;
      case 'video': return Film;
      case 'music': return MusicIcon;
      default: return MessageSquare; // Blog/Content için varsayılan
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'book': return 'bg-yellow-500';
      case 'video': return 'bg-red-600';
      case 'music': return 'bg-indigo-600';
      default: return 'bg-blue-600';
    }
  };


  return (
    <>
      <Helmet><title>{t.title} - YTU Kurdî</title></Helmet>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          
          <Link to="/" className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-blue-900 dark:hover:text-white mb-6 transition group">
            <ArrowLeft size={20} className="mr-2" /> {t.back}
          </Link>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">{t.title}</h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">{t.desc}</p>
          </motion.div>

          {error && (<div className="text-center bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-xl flex items-center justify-center gap-2 my-8"><AlertCircle size={20} /> {error}</div>)}

          {loading ? (
            <div className="flex justify-center my-12"><Loader2 className="animate-spin text-blue-600 dark:text-blue-400" size={40} /></div>
          ) : (
            <div className="space-y-6">
              {contentList.length === 0 ? (
                <div className="text-center py-12 text-slate-400 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-800">
                    <p className="font-bold">{t.noContent}</p>
                    <Link to="/admin" className="text-blue-600 dark:text-blue-400 hover:underline text-sm mt-2 block">{t.admin}</Link>
                </div>
              ) : (
                contentList.map((item, index) => {
                  const Icon = getIcon(item.type);
                  return (
                    <motion.a 
                        key={item.id}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-all group cursor-pointer"
                    >
                        <div className={`w-12 h-12 ${getColor(item.type)} rounded-lg flex items-center justify-center text-white mr-4 group-hover:scale-105 transition-transform`}>
                            <Icon size={24} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">{item.title}</h3>
                            {/* Eğer metin içeriği varsa göster (örneğin blog yazısı) */}
                            {item.text && (
                                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{item.text}</p>
                            )}
                            {/* Metin yoksa kategori veya URL'yi göster */}
                            {(!item.text && item.category) && (
                                <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{item.category}</p>
                            )}
                        </div>
                        <div className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400 flex items-center gap-1 ml-4 group-hover:gap-2 transition-all">
                            {item.type} <ChevronRight size={16} />
                        </div>
                    </motion.a>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Blog;