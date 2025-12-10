import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Instagram, Gamepad2, Book, Mail, Moon, Sun, Image, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { siteContent } from '../data/locales';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const { lang, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  
  const t = siteContent[lang]?.nav || {};

  const links = [
    { path: '/', label: t.sereke || 'Home' },
    { path: '/ferheng', label: t.ferheng || 'Sözlük', icon: <Book size={16} /> },
    { path: '/haberler', label: t.blog || 'Duyurular', icon: <MessageSquare size={16} /> },
    { path: '/ziman', label: t.ziman || 'Dil' },
    { path: '/cand', label: t.cand || 'Kültür' },
    { path: '/dirok', label: t.dirok || 'Tarih' },
    { path: '/muzik', label: t.muzik || 'Müzik' },
    { path: '/huner', label: t.huner || 'Sanat' },
    { path: '/galeri', label: t.gallery || 'Galeri', icon: <Image size={16} /> },
    { path: '/tekili', label: t.tekili || 'İletişim', icon: <Mail size={16} /> },
    { path: '/listik', label: t.listik || 'Oyun', isGame: true } 
  ];

  return (
    <nav className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg sticky top-0 z-50 transition-colors duration-300 border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-20">
          
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/logo.png" 
              alt="YTU Kurdî Logo" 
              className="w-12 h-12 rounded-full object-cover shadow-md group-hover:scale-110 transition-transform duration-300 ring-2 ring-white dark:ring-slate-700"
            />
            <div className="flex flex-col">
              <span className="font-bold text-xl text-blue-900 dark:text-white leading-none transition-colors">YTU Kurdî</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Komeleya Kurdî</span>
            </div>
          </Link>

          <div className="hidden xl:flex items-center space-x-1">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              if (link.isGame) {
                return (
                  <Link key={link.path} to={link.path} className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ml-2 ${isActive ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-600 dark:text-white' : 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-500/20 hover:scale-105'}`}>
                    <Gamepad2 size={18} /> {link.label}
                  </Link>
                );
              }
              return (
                <Link key={link.path} to={link.path} className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isActive ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-300'}`}>
                  {link.icon && <span className="opacity-70">{link.icon}</span>}
                  {link.label}
                </Link>
              );
            })}
            
            <button onClick={toggleTheme} className="ml-2 p-2 rounded-lg text-slate-600 dark:text-yellow-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={toggleLanguage} className="flex items-center gap-1 px-2 py-2 rounded-lg text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 font-bold text-xs">
              <Globe size={16} /> {lang}
            </button>
            <motion.a href="https://instagram.com/ytukurdi" target="_blank" rel="noopener noreferrer" className="ml-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white p-2 rounded-full shadow-md hover:scale-105 transition-transform" whileHover={{ scale: 1.1 }}>
              <Instagram size={18} />
            </motion.a>
          </div>

          <div className="xl:hidden flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 text-slate-600 dark:text-yellow-400">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={toggleLanguage} className="flex items-center gap-1 px-2 py-2 text-slate-600 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-700 rounded-lg"><span className="text-sm">{lang}</span><Globe size={20} /></button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 dark:text-slate-200 transition-colors p-2">{isOpen ? <X size={28} /> : <Menu size={28} />}</button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="xl:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 overflow-hidden shadow-xl">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {links.map((link) => (
                <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className={`flex items-center gap-2 px-4 py-3 rounded-lg text-base font-medium ${link.isGame ? 'text-yellow-700 bg-yellow-50 dark:bg-yellow-500/20 dark:text-yellow-400 font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                  {link.isGame && <Gamepad2 size={20} />} {link.icon && <span className="text-blue-500 dark:text-blue-400">{link.icon}</span>} {link.label}
                </Link>
              ))}
              <a href="https://instagram.com/ytukurdi" className="flex items-center justify-center gap-2 w-full text-center mt-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-5 py-3 rounded-xl font-bold">
                <Instagram size={20} /> <span>{t.follow}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;