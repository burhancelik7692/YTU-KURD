import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Instagram, Gamepad2, Book } from 'lucide-react'; // Book ikonu eklendi (Sözlük için)
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { siteContent } from '../data/locales';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const { lang, toggleLanguage } = useLanguage();
  
  // Veritabanından (locales.js) 'nav' kısmını çekiyoruz
  // Eğer veri yüklenmemişse hata vermemesi için boş obje kontrolü yapıyoruz
  const t = siteContent[lang]?.nav || {};

  // --- LİNKLER LİSTESİ ---
  const links = [
    { path: '/', label: t.sereke || 'Home' }, // Ana Sayfa
    { path: '/ferheng', label: t.ferheng || 'Sözlük', icon: <Book size={16} /> }, // YENİ: Sözlük
    { path: '/ziman', label: t.ziman || 'Dil' },
    { path: '/cand', label: t.cand || 'Kültür' },
    { path: '/dirok', label: t.dirok || 'Tarih' },
    { path: '/muzik', label: t.muzik || 'Müzik' },
    { path: '/huner', label: t.huner || 'Sanat' },
    // OYUN LİNKİ (Özel Tasarım)
    { path: '/listik', label: t.listik || 'Oyun', isGame: true } 
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-20">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/logo.png" 
              alt="YTU Kurdî Logo" 
              className="w-12 h-12 rounded-full object-cover shadow-md group-hover:scale-110 transition-transform duration-300"
            />
            <div className="flex flex-col">
              <span className="font-bold text-xl text-gray-900 leading-none">YTU Kurdî</span>
              <span className="text-xs text-gray-500 font-medium">Komeleya Kurdî</span>
            </div>
          </Link>

          {/* MASAÜSTÜ MENÜ */}
          <div className="hidden lg:flex items-center space-x-1">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              
              // OYUN LİNKİ İÇİN ÖZEL GÖRÜNÜM
              if (link.isGame) {
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ml-2 ${
                      isActive
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100 hover:scale-105'
                    }`}
                  >
                    <Gamepad2 size={18} />
                    {link.label}
                  </Link>
                );
              }

              // SÖZLÜK VE DİĞER LİNKLER
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  {link.icon && <span className="opacity-70">{link.icon}</span>}
                  {link.label}
                </Link>
              );
            })}
            
            {/* DİL BUTONU */}
            <button 
              onClick={toggleLanguage} 
              className="ml-4 flex items-center gap-1 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-colors border border-gray-200"
            >
              <Globe size={18} />
              <span className="font-bold text-sm">{lang}</span>
            </button>

            {/* INSTAGRAM BUTONU */}
            <motion.a 
              href="https://instagram.com/ytukurdi" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-[#833ab4] hover:via-[#fd1d1d] hover:to-[#fcb045] text-white px-4 py-2 rounded-full text-sm font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all duration-500"
              whileHover={{ scale: 1.05 }}
            >
              <Instagram size={18} />
              <span className="hidden xl:inline">{t.follow}</span>
            </motion.a>
          </div>

          {/* MOBİL İÇİN HAMBURGER VE DİL BUTONU */}
          <div className="lg:hidden flex items-center gap-2">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2 py-2 text-gray-600 font-bold border border-gray-200 rounded-lg"
            >
              <span className="text-sm">{lang}</span>
              <Globe size={20} />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-blue-600 transition-colors p-2"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBİL MENÜ AÇILIR KISMI */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t overflow-hidden shadow-xl"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg text-base font-medium ${
                     link.isGame 
                     ? 'text-yellow-700 bg-yellow-50 font-bold' 
                     : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  {link.isGame && <Gamepad2 size={20} />}
                  {link.icon && <span className="text-blue-500">{link.icon}</span>}
                  {link.label}
                </Link>
              ))}
              
              <a 
                href="https://instagram.com/ytukurdi"
                className="flex items-center justify-center gap-2 w-full text-center mt-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-5 py-3 rounded-xl font-bold"
              >
                <Instagram size={20} />
                <span>{t.follow}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;