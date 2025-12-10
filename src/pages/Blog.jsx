import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Loader2, BookOpen, Film, Music as MusicIcon, MessageSquare, ChevronRight, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { siteContent } from '../data/locales';

// Firebase bağlantısı
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

const Blog = () => {
  const { lang } = useLanguage();
  
  // Locales.js dosyasından çevirileri çek, yoksa varsayılanları kullan
  const t = siteContent[lang]?.pages?.blog || { // 'pages.blog' yoksa 'nav.blog' kullanabiliriz veya manuel
    title: lang === 'KU' ? 'Agahdarî' : 'Duyurular',
    desc: lang === 'KU' ? 'Nûçeyên herî dawî' : 'Güncel Haberler',
    noContent: lang === 'KU' ? 'Hîn naverok tune.' : 'Henüz içerik yok.',
    admin: lang === 'KU' ? 'Biçe Panela Rêveber' : 'Yönetim Paneline Git'
  };

  const [contentList, setContentList] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Veritabanından veri çekme
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setError(null);
        const contentRef = collection(db, "dynamicContent");
        
        // Sadece belirli türleri çek
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
        console.error(err);
        setError(lang === 'KU' ? "Pirsgirêka girêdanê." : "Bağlantı hatası.");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]); 

  // İkona göre içerik türünü belirleme
  const getIcon = (type) => {
    switch (type) {
      case 'book': return BookOpen;
      case 'video': return Film;
      case 'music': return MusicIcon;
      default: return MessageSquare;
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

      {/* Ana Kapsayıcı - Dark Mode Uyumlu */}
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          
          {/* Başlık Alanı */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">{t.title}</h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">{t.desc}</p>
          </motion.div>

          {/* Hata Mesajı */}
          {error && (
            <div className="text-center bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-xl flex items-center justify-center gap-2 my-8 border border-red-200 dark:border-red-800">
                <AlertCircle size={20} /> {error}
            </div>
          )}

          {/* İçerik Listesi */}
          {loading ? (
            <div className="flex justify-center my-12">
                <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" size={40} />
            </div>
          ) : (
            <div className="space-y-6">
              {contentList.length === 0 ? (
                // İçerik Yoksa
                <div className="text-center py-16 px-6 text-slate-400 dark:text-slate-500 border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl bg-white dark:bg-slate-800/50">
                    <p className="font-medium text-lg mb-2">{t.noContent}</p>
                    <Link to="/admin" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-bold transition-colors">
                        {t.admin}
                    </Link>
                </div>
              ) : (
                // İçerik Varsa Map et
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
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all group cursor-pointer"
                    >
                        {/* Sol İkon Kutusu */}
                        <div className={`w-14 h-14 ${getColor(item.type)} rounded-xl flex items-center justify-center text-white mr-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <Icon size={28} />
                        </div>
                        
                        {/* Metin Alanı */}
                        <div className="flex-1 overflow-hidden">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {item.title}
                            </h3>
                            {item.desc && (
                                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                    {item.desc}
                                </p>
                            )}
                            {(!item.desc && item.category) && (
                                <p className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                                    {item.category}
                                </p>
                            )}
                        </div>
                        
                        {/* Sağ Ok */}
                        <div className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 flex items-center gap-2 ml-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all">
                            <span className="hidden sm:block">{item.type}</span> 
                            <ChevronRight size={20} />
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