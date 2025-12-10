import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Heart, Book, Edit3, Loader2, X, ArrowLeft, LogOut, User as UserIcon, Calendar, Globe, Save } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const { t, lang, changeLanguage } = useLanguage();
    const { logout } = useAuth();
    const { userData, loading: profileLoading, updateUserData } = useUser();
    const navigate = useNavigate();

    const [tab, setTab] = useState('favorites');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editName, setEditName] = useState('');
    
    const userProfile = userData || {};
    const favoriteWords = userProfile.favoriteWords || [];
    
    const removeFavorite = (wordKey) => {
        const newFavorites = favoriteWords.filter(key => key !== wordKey);
        updateUserData({ favoriteWords: newFavorites });
    };

    const handleLogout = async () => {
        try { await logout(); navigate('/'); } catch (error) { console.error(error); }
    };

    // PROFİL GÜNCELLEME
    const openEditProfile = () => {
        setEditName(userProfile.name || '');
        setIsEditModalOpen(true);
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        if(editName.trim()) {
            await updateUserData({ name: editName });
            setIsEditModalOpen(false);
        }
    };

    if (profileLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900"><Loader2 className="w-10 h-10 text-blue-600 animate-spin" /></div>;

    return (
        <>
            <Helmet><title>{t('user_dashboard_title')} - YTU Kurdî</title></Helmet>
            
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 transition-colors duration-300">
                <div className="max-w-6xl mx-auto">

                    {/* HEADER */}
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200 dark:border-slate-700 mb-8 relative overflow-hidden">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 dark:border-slate-700 pb-6 mb-6">
                           <div className="flex items-center gap-4 z-10">
                              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg relative group cursor-pointer" onClick={openEditProfile}>
                                  <UserIcon size={32} className="text-white" />
                                  <div className="absolute inset-0 bg-black/30 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Edit3 size={20} className="text-white" /></div>
                              </div>
                              <div>
                                  <div className="flex items-center gap-2">
                                      <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">
                                          {t('welcome')}, <span className="text-blue-600 dark:text-blue-400">{userProfile.name || 'Endam'}</span>
                                      </h1>
                                      <button onClick={openEditProfile} className="text-slate-400 hover:text-blue-500 transition"><Edit3 size={18} /></button>
                                  </div>
                                  <div className="flex items-center gap-4 mt-2">
                                      <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1"><Calendar size={12} /> {t('last_login')}: {userProfile.lastLogin ? new Date(userProfile.lastLogin).toLocaleDateString() : '-'}</p>
                                      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg">
                                          <Globe size={12} className="text-slate-500" />
                                          {['KU', 'TR', 'EN'].map(code => (<button key={code} onClick={() => changeLanguage(code)} className={`text-xs font-bold px-1.5 py-0.5 rounded ${lang === code ? 'bg-white dark:bg-slate-600 shadow text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>{code}</button>))}
                                      </div>
                                  </div>
                              </div>
                           </div>
                           <button onClick={handleLogout} className="group flex items-center gap-2 px-5 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-600 hover:text-white transition-all font-bold text-sm z-10"><LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> {t('logout')}</button>
                        </div>

                        {/* İstatistikler */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-2xl text-center border border-slate-100 dark:border-slate-700/50"><p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">{t('favorite_words')}</p><p className="text-3xl font-black text-slate-800 dark:text-white">{favoriteWords.length}</p></div>
                            <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-2xl text-center border border-slate-100 dark:border-slate-700/50"><p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">{t('role')}</p><p className="text-lg font-bold text-slate-800 dark:text-white mt-1 capitalize">{userProfile.role}</p></div>
                        </div>
                    </motion.div>

                    {/* FAVORİLER TABLOSU */}
                    <div className="mb-6"><button className="px-6 py-3 rounded-xl font-bold bg-blue-600 text-white flex items-center gap-2 shadow-lg shadow-blue-500/30"><Heart size={18} className="fill-current" /> {t('favorite_words')} <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{favoriteWords.length}</span></button></div>
                    <AnimatePresence>
                        {favoriteWords.length === 0 ? (
                            <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700"><Book size={32} className="text-slate-400 mx-auto mb-4" /><h3 className="text-xl font-bold text-slate-700 dark:text-white mb-2">{t('no_favorites')}</h3><Link to="/ferheng" className="text-blue-600 hover:underline">{t('start_exploring')}</Link></div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {favoriteWords.map((word, i) => (
                                    <motion.div key={word} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 relative group">
                                        <div className="flex justify-between items-start"><span className="text-lg font-bold text-slate-800 dark:text-white">{word}</span><button onClick={() => removeFavorite(word)} className="text-slate-300 hover:text-red-500 transition"><X size={18} /></button></div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                    <div className="mt-12 text-center"><Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition"><ArrowLeft size={20} /> {t('back_to_home')}</Link></div>
                </div>

                {/* EDIT PROFILE MODAL */}
                <AnimatePresence>
                    {isEditModalOpen && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-2xl p-6">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">{t('edit_profile')}</h3>
                                <form onSubmit={handleSaveProfile} className="space-y-4">
                                    <div><label className="block text-sm font-bold text-slate-500 mb-1">{t('full_name')}</label><input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500" /></div>
                                    <div className="flex justify-end gap-2 pt-4"><button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 rounded-lg text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-700">{t('cancel')}</button><button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2"><Save size={18} /> {t('save')}</button></div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default UserDashboard;