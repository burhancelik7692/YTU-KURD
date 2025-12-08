import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, ArrowUp, Mail, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { siteContent } from '../data/locales'; // Site content'i menü için çekiyoruz

const Footer = () => {
  const { lang } = useLanguage();
  const t = siteContent[lang]?.nav || {}; // Menü çevirilerini al
  
  // Footer Linkleri (Menüden Dinamik Oluşturma)
  const footerLinks = [
    { path: '/', label: t.sereke },
    { path: '/ferheng', label: t.ferheng },
    { path: '/galeri', label: t.gallery },
    { path: '/haberler', label: t.blog || 'Duyurular' },
    { path: '/tekili', label: t.tekili },
    { path: '/admin', label: 'Admin Girişi' }
  ].filter(link => link.label); // Eğer çevirisi yoksa gösterme

  // --- SCROLL TO TOP MANTIĞI ---
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 300px aşağı kaydırıldığında butonu göster
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="bg-slate-900 dark:bg-black text-white pt-16 pb-8 border-t border-slate-700 dark:border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* 1. Kurumsal Bilgi */}
          <div>
            <span className="text-2xl font-bold text-white tracking-tight block mb-4">
              YTU <span className="text-yellow-500">Kurdî</span>
            </span>
            <p className="text-slate-400 text-sm leading-relaxed">
              {lang === 'KU' ? 'Komeleya xwendekarên Kurd li Zanîngeha Yıldız Teknîk.' : 'Yıldız Teknik Üniversitesi Kürtçe Topluluğu.'}
            </p>
          </div>
          
          {/* 2. Hızlı Linkler (Dinamik) */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-bold mb-4 text-yellow-500">{lang === 'KU' ? 'Zû Gihîştin' : 'Hızlı Erişim'}</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 text-sm">
              {footerLinks.map((link, i) => (
                <Link key={i} to={link.path} className="text-slate-400 hover:text-white transition">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* 3. İletişim / Sosyal Medya */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-yellow-500">{lang === 'KU' ? 'Têkilî' : 'İletişim'}</h4>
            <p className="text-slate-400 text-sm mb-2 flex items-center gap-2">
              <Mail size={16} className="text-slate-500" /> ytukurdidrive@gmail.com
            </p>
            <div className="flex gap-3 mt-4">
              <a href="https://instagram.com/ytukurdi" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-pink-500 transition"><Instagram size={20} /></a>
              <a href="https://www.youtube.com/@ytukurdi" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-red-600 transition"><Youtube size={20} /></a>
            </div>
          </div>
          
        </div>
        
        {/* Telif Hakkı */}
        <div className="border-t border-slate-800 pt-8 text-center">
          <p className="text-slate-500 text-sm">© 2025 YTU Kurdî. Hemû mafên parastî ne.</p>
        </div>
      </div>

      {/* --- YUKARI ÇIK BUTONU --- */}
      <motion.button
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 right-6 bg-yellow-500 text-slate-900 p-4 rounded-full shadow-xl hover:bg-yellow-400 transition-colors z-40"
      >
        <ArrowUp size={24} />
      </motion.button>
    </footer>
  );
};

export default Footer;