import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Loader2, FileText, Calendar, Tag, ChevronRight, AlertCircle, Megaphone, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Firebase bağlantısı
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore'; // orderBy kaldırıldı

const Blog = () => {
  const { t, lang } = useLanguage();
  
  // Sayfaya özel çeviriler
  const localT = {
    KU: { 
      desc: 'Nûçeyên herî dawî û daxuyaniyên girîng.',
      read_more: 'Zêdetir Bixwîne',
      admin_link: 'Biçe Panela Rêveber'
    },
    TR: { 
      desc: 'En güncel haberler ve önemli duyurular.',
      read_more: 'Devamını Oku',
      admin_link: 'Yönetim Paneline Git'
    },
    EN: { 
      desc: 'Latest news and important announcements.',
      read_more: 'Read More',
      admin_link: 'Go to Admin Panel'
    }
  }[lang] || {};

  const [contentList, setContentList] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Veritabanından veri çekme
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setError(null);
        const contentRef = collection(db, "dynamicContent");
        
        // DÜZELTME: orderBy("createdAt", "desc") kaldırıldı.
        // Firebase index hatasını önlemek için sadece filtreleme yapıyoruz.
        const q = query(
          contentRef, 
          where("type", "==", "blog")
        );
        const querySnapshot = await getDocs(q);
        
        const list = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });

        // DÜZELTME: Sıralama işlemini burada JavaScript ile yapıyoruz (Yeniden Eskiye)
        list.sort((a, b) => {
            const dateA = a.createdAt?.seconds || 0;
            const dateB = b.createdAt?.seconds || 0;
            return dateB - dateA;
        });

        setContentList(list); 
      } catch (err) {
        console.error("Blog yükleme hatası:", err);
        // Hatanın detayını konsola yazdırıyoruz ama kullanıcıya genel mesaj gösteriyoruz
        setError(lang === 'KU' ? "Pirsgirêka girêdanê." : "Bağlantı hatası.");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]); 

  // Kategoriye göre renk belirleme
  const getCategoryColor = (cat) => {
      if (!cat) return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      const c = cat.toLowerCase();
      if (c.includes('nûçe') || c.includes('haber')) return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      if (c.includes('çand') || c.includes('kültür')) return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      if (c.includes('teknolojî') || c.includes('teknoloji')) return 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400';
      return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
  };

  return (
    <>
      <Helmet><title>{t('blog')} - YTU Kurdî</title></Helmet>

      {/* Ana Kapsayıcı */}
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 transition-colors duration-300">
        <div className="max-w-5xl mx-auto">
          
          {/* Başlık Alanı */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400 mb-4">
                <Megaphone size={32} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">{t('blog')}</h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{localT.desc}</p>
          </motion.div>

          {/* Hata Mesajı */}
          {error && (
            <div className="text-center bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-xl flex items-center justify-center gap-2 my-8 border border-red-200 dark:border-red-800">
                <AlertCircle size={20} /> {error}
            </div>
          )}

          {/* İçerik Listesi */}
          {loading ? (
            <div className="flex flex-col items-center justify-center my-20 gap-4">
                <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" size={48} />
                <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">{t('loading')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {contentList.length === 0 ? (
                  // İçerik Yoksa
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full text-center py-20 px-6 text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl bg-white/50 dark:bg-slate-800/50"
                  >
                    <FileText size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="font-medium text-lg mb-4">{t('no_content_found')}</p>
                    <Link to="/admin" className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/30">
                        {localT.admin_link} <ArrowRight size={16} />
                    </Link>
                  </motion.div>
                ) : (
                  // İçerik Varsa
                  contentList.map((item, index) => (
                    <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex flex-col bg-white dark:bg-slate-800 rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 transition-all group overflow-hidden h-full"
                    >
                        <div className="p-6 md:p-8 flex-1 flex flex-col">
                            {/* Üst Bilgi: Tarih ve Kategori */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <Calendar size={14} />
                                    <span>{item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : '---'}</span>
                                </div>
                                {item.category && (
                                    <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${getCategoryColor(item.category)}`}>
                                        <Tag size={10} /> {item.category}
                                    </span>
                                )}
                            </div>

                            {/* Başlık */}
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                                {item.title}
                            </h3>

                            {/* Açıklama */}
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4 mb-6 flex-1">
                                {item.desc}
                            </p>

                            {/* Alt Buton */}
                            <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400">YTU KURDÎ</span>
                                {item.url ? (
                                    <a 
                                        href={item.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 dark:text-blue-400 hover:gap-2 transition-all"
                                    >
                                        {localT.read_more} <ChevronRight size={16} />
                                    </a>
                                ) : (
                                    <span className="text-slate-300 dark:text-slate-600 text-sm cursor-default select-none">
                                        ---
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Blog;