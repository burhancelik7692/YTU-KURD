import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext'; // Çıkış yapmak için
import { siteContent } from '../data/locales';
import { Heart, Book, Image as ImageIcon, Loader2, X, ArrowLeft, LogOut, User as UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const { lang } = useLanguage();
    // NOT: UserContext'ten verileri alırken güvenliğe dikkat ediyoruz.
    const { logout } = useAuth(); // Auth'tan sadece logout alıyoruz (çıkış butonu için)
    const { userData: userProfile, loading: profileLoading, updateUserData } = useUser(); // Kullanıcı verilerini UserContext'ten alıyoruz
    const navigate = useNavigate();

    const [tab, setTab] = useState('favorites');
    
    // Locales çevirileri
    const t = {
        KU: {
            title: 'Kevneşopiya Min', favorites: 'Bijareyên Min', loading: 'Tê Barkirin...', 
            lastLogin: 'Têketina Dawî', empty: 'Tişt tuneye.', wordCount: 'Peyvên Bijare',
            galleryTitle: 'Wênegeh', dictTitle: 'Ferheng', logout: 'Derkeve', 
            profile: 'Profîla Bikarhêner', back: 'Vegere Sereke',
            welcome: 'Bi xêr hatî', wordsFound: 'peyv hatin dîtin',
            lastLoginTitle: 'Têketina Dawî'
        },
        TR: {
            title: 'Kullanıcı Paneli', favorites: 'Favorilerim', loading: 'Yükleniyor...', 
            lastLogin: 'Son Giriş', empty: 'Henüz hiçbir şey eklenmemiş.', wordCount: 'Favori Kelime',
            galleryTitle: 'Galeri', dictTitle: 'Sözlük', logout: 'Çıkış Yap',
            profile: 'Kullanıcı Profili', back: 'Ana Sayfaya Dön',
            welcome: 'Hoş geldin', wordsFound: 'kelime bulundu',
            lastLoginTitle: 'Son Giriş'
        },
    }[lang] || {};

    const favoriteWords = userProfile.favoriteWords || [];
    const loading = profileLoading;

    // --- FAVORİ ÇIKARMA İŞLEVİ (Sözlük'teki ile aynı mantık) ---
    const removeFavorite = (wordKey) => {
        const newFavorites = favoriteWords.filter(key => key !== wordKey);
        updateUserData({ favoriteWords: newFavorites });
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    // Giriş tarihini formatla
    const formatLastLogin = (isoString) => {
        try {
            return new Date(isoString).toLocaleDateString(lang, { day: '2-digit', month: 'short', year: 'numeric' });
        } catch {
            return t.lastLogin;
        }
    };

    return (
        <>
            <Helmet><title>{t.title} - YTU Kurdî</title></Helmet>
            
            {/* Ana Kapsayıcı - Dark Mode Uyumlu */}
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 transition-colors duration-300">
                <div className="max-w-6xl mx-auto">

                    {/* 1. HEADER KARTI */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700 mb-8"
                    >
                        <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-700 mb-4">
                           <div className="flex items-center gap-3">
                              <UserIcon size={28} className="text-blue-600 dark:text-blue-400" />
                              <h1 className="text-3xl font-black text-slate-800 dark:text-white">{t.welcome}, {userProfile.name || 'Endam'}</h1>
                           </div>
                           <button onClick={handleLogout} className="text-red-500 hover:text-red-600 font-bold flex items-center gap-2 p-2 rounded-lg transition-colors">
                                <LogOut size={18} /> {t.logout}
                           </button>
                        </div>

                        {/* İstatistikler */}
                        <div className="grid grid-cols-3 gap-6 text-center">
                            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl">
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase">{t.wordCount}</p>
                                <p className="text-3xl font-black text-red-600 dark:text-red-400">{favoriteWords.length}</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl">
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase">{t.lastLoginTitle}</p>
                                <p className="text-lg font-bold text-slate-800 dark:text-white mt-1">
                                    {userProfile.lastLogin ? formatLastLogin(userProfile.lastLogin) : 'N/A'}
                                </p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl">
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase">{t.profile}</p>
                                <p className="text-lg font-bold text-slate-800 dark:text-white mt-1">{userProfile.name || 'Anonim'}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* 2. TABLAR */}
                    <div className="flex justify-start gap-4 mb-8">
                        <button 
                            onClick={() => setTab('favorites')}
                            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${tab === 'favorites' ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                        >
                            <Heart size={18} /> {t.favorites}
                            <span className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full text-xs">{favoriteWords.length}</span>
                        </button>
                    </div>

                    {/* 3. İÇERİK ALANI */}
                    <AnimatePresence mode="wait">
                        {loading ? (
                             <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
                                <Loader2 size={32} className="animate-spin text-red-500 mx-auto mb-4" />
                                <p className="text-slate-500 dark:text-slate-400">{t.loading}</p>
                             </motion.div>
                        ) : (
                            <motion.div key={tab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                {favoriteWords.length === 0 ? (
                                    <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                                        <X size={40} className="text-red-500 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-slate-700 dark:text-white mb-2">{t.empty}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                                            {t.favorites} {t.dictTitle} û {t.galleryTitle} rûpelan zêde bike.
                                        </p>
                                        <div className="mt-6 flex justify-center gap-4">
                                            <Link to="/ferheng" className="text-blue-600 dark:text-blue-400 hover:underline font-bold transition-colors flex items-center gap-2">
                                                <Book size={18} /> {t.dictTitle}
                                            </Link>
                                            <Link to="/galeri" className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold transition-colors flex items-center gap-2">
                                                <ImageIcon size={18} /> {t.galleryTitle}
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {/* Favori Kelimeler Listesi */}
                                        {favoriteWords.map((word, i) => (
                                            <motion.div 
                                                key={word} 
                                                className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-all relative"
                                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1, transition: { delay: i * 0.05 } }}
                                            >
                                                <button 
                                                    onClick={() => removeFavorite(word)} 
                                                    className="absolute top-2 right-2 text-slate-400 hover:text-red-500 transition-colors p-1"
                                                    title="Remove from favorites"
                                                >
                                                    <X size={18} />
                                                </button>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-3xl font-black text-red-600 dark:text-red-400 truncate">{word}</span>
                                                </div>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 border-t border-slate-100 dark:border-slate-700 pt-2">
                                                    {t.dictTitle} | {lang === 'KU' ? 'Peyv' : 'Kelime'}
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Ana Sayfaya Dön */}
                    <div className="mt-12 text-center">
                        <Link to="/" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-bold transition-colors">
                            <ArrowLeft size={20} /> {t.back}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserDashboard;