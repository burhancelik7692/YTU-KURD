import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, LayoutDashboard, FileText, Image as ImageIcon, Book, 
  Users, Settings, Plus, Search, Trash2, Edit3, Save, X, 
  BarChart2, Clock, CheckCircle, AlertCircle, Home, Loader2, Eye, 
  ChevronLeft, ChevronRight, TrendingUp, Video, Shield, Link as LinkIcon, ExternalLink, Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, orderBy, getDoc, setDoc } from 'firebase/firestore';

const Dashboard = () => {
  const { logout, currentUser } = useAuth();
  const { t, lang, changeLanguage } = useLanguage(); 
  const navigate = useNavigate();
  
  // --- STATE ---
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Veriler
  const [stats, setStats] = useState({ dictionary: 0, blog: 0, gallery: 0, users: 0, total: 0 });
  const [contents, setContents] = useState([]);
  const [usersList, setUsersList] = useState([]);

  // Site Ayarları
  const [siteSettings, setSiteSettings] = useState({
      heroTitle1: '', heroTitle2: '', heroTitle3: '', heroSubtitle: '',
      aboutTitle: '', aboutText1: '', aboutText2: '',
      ctaTitle: '', ctaText: '', ctaButton: ''
  });

  // Modal & Bildirim
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ 
    title: '', desc: '', category: '', type: 'blog', url: '', ku: '', tr: '' 
  });
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  // Sayfalama
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000);
  };

  // --- VIDEO KONTROLÜ ---
  const isVideoUrl = (url) => {
      if (!url) return false;
      const lower = url.toLowerCase();
      return lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.mov') || lower.endsWith('.ogg');
  };

  // --- VERİ ÇEKME ---
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. İçerik Çek
      const qContent = query(collection(db, "dynamicContent"), orderBy("createdAt", "desc"));
      const snapContent = await getDocs(qContent);
      const dataContent = snapContent.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setContents(dataContent);

      // 2. Kullanıcıları Çek
      const qUsers = collection(db, "users");
      const snapUsers = await getDocs(qUsers);
      const dataUsers = snapUsers.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsersList(dataUsers);

      setStats({
        dictionary: dataContent.filter(i => i.type === 'dictionary').length,
        blog: dataContent.filter(i => i.type === 'blog').length,
        gallery: dataContent.filter(i => i.type === 'gallery').length,
        users: dataUsers.length,
        total: dataContent.length
      });

      const settingsRef = doc(db, "settings", "home");
      const settingsSnap = await getDoc(settingsRef);
      if (settingsSnap.exists()) {
          setSiteSettings(prev => ({ ...prev, ...settingsSnap.data() }));
      }
    } catch (err) {
      console.error(err);
      showNotification('error', t('error_generic'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- KULLANICI YÖNETİMİ ---
  const handleRoleChange = async (userId, currentRole) => {
      const newRole = currentRole === 'admin' ? 'standard' : 'admin';
      if(window.confirm(`${t('change_role')} -> ${newRole}?`)) {
          try {
              await updateDoc(doc(db, "users", userId), { role: newRole });
              setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
              showNotification('success', t('success_saved'));
          } catch (error) {
              showNotification('error', t('error_generic'));
          }
      }
  };

  const handleUserDelete = async (userId) => {
      if(window.confirm(t('delete_user') + "?")) {
          try {
              await deleteDoc(doc(db, "users", userId));
              setUsersList(prev => prev.filter(u => u.id !== userId));
              setStats(prev => ({ ...prev, users: prev.users - 1 }));
              showNotification('success', t('success_deleted'));
          } catch (error) {
              showNotification('error', t('error_generic'));
          }
      }
  };

  // --- İÇERİK CRUD ---
  const handleContentSubmit = async (e) => {
      e.preventDefault();
      try {
          const dataToSave = { 
            ...formData, 
            createdAt: new Date(),
            title: formData.type === 'dictionary' ? formData.ku : formData.title 
          };
          
          if (editingId) {
             await updateDoc(doc(db, "dynamicContent", editingId), dataToSave);
             setContents(prev => prev.map(item => item.id === editingId ? { ...dataToSave, id: editingId } : item));
             showNotification('success', t('success_saved'));
          } else {
             const docRef = await addDoc(collection(db, "dynamicContent"), dataToSave);
             const newItem = { ...dataToSave, id: docRef.id };
             setContents(prev => [newItem, ...prev]);
             setStats(prev => ({...prev, [formData.type]: prev[formData.type] + 1, total: prev.total + 1}));
             showNotification('success', t('success_saved'));
          }
          closeModal();
      } catch (err) {
          showNotification('error', t('error_generic'));
      }
  };

  const handleDelete = async (id, type) => {
      if(window.confirm(t('delete') + "?")) {
          try {
              await deleteDoc(doc(db, "dynamicContent", id));
              setContents(prev => prev.filter(item => item.id !== id));
              setStats(prev => ({...prev, [type]: prev[type] > 0 ? prev[type] - 1 : 0, total: prev.total > 0 ? prev.total - 1 : 0}));
              showNotification('success', t('success_deleted'));
          } catch (err) {
              showNotification('error', t('error_generic'));
          }
      }
  };

  const handleSettingsUpdate = async (e) => {
      e.preventDefault();
      try {
          await setDoc(doc(db, "settings", "home"), siteSettings, { merge: true });
          showNotification('success', t('settings_save_success'));
      } catch (err) {
          showNotification('error', t('error_generic'));
      }
  };

  const closeModal = () => {
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ title: '', desc: '', category: '', type: activeTab === 'overview' ? 'blog' : activeTab, url: '', ku: '', tr: '' });
  };

  const openEditModal = (item) => {
      setFormData(item);
      setEditingId(item.id);
      setIsModalOpen(true);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin');
  };

  // --- FİLTRELEME ---
  const currentList = activeTab === 'users' ? usersList : contents;
  const filteredData = currentList.filter(item => {
      const term = searchTerm.toLowerCase();
      if (activeTab === 'users') {
          return (item.name?.toLowerCase() || '').includes(term) || (item.email?.toLowerCase() || '').includes(term);
      }
      return (activeTab === 'overview' ? true : item.type === activeTab) && 
             ((item.title || '').toLowerCase().includes(term) || (item.ku || '').toLowerCase().includes(term) || (item.tr || '').toLowerCase().includes(term));
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = activeTab === 'overview' ? filteredData.slice(0, 5) : filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  useEffect(() => { setCurrentPage(1); setSearchTerm(''); }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex font-sans transition-colors duration-300">
      
      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 flex flex-col fixed h-full z-30 shadow-lg`}>
        <div className="p-6 flex items-center justify-between h-20 border-b border-slate-100 dark:border-slate-700">
          {isSidebarOpen ? <h1 className="text-xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">ADMIN PANEL</h1> : <span className="text-xl font-black text-blue-600 mx-auto">A</span>}
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"><LayoutDashboard size={20} className="text-slate-500" /></button>
        </div>
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {[
            { id: 'overview', label: t('overview'), icon: BarChart2 },
            { id: 'users', label: t('user_management'), icon: Users },
            { id: 'settings', label: t('site_settings'), icon: Settings },
            { id: 'blog', label: t('blog'), icon: FileText },
            { id: 'dictionary', label: t('dictionary'), icon: Book },
            { id: 'gallery', label: t('gallery'), icon: ImageIcon },
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
              <item.icon size={20} className={`relative z-10 transition-transform ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
              {isSidebarOpen && <span className="font-semibold relative z-10">{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
           {isSidebarOpen && (<div className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-900 rounded-xl p-1 mb-2">{['KU', 'TR', 'EN'].map(code => (<button key={code} onClick={() => changeLanguage(code)} className={`flex-1 text-xs font-bold py-1.5 rounded-lg transition ${lang === code ? 'bg-white dark:bg-slate-700 shadow text-blue-600' : 'text-slate-400'}`}>{code}</button>))}</div>)}
          <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-bold"><LogOut size={20} />{isSidebarOpen && <span>{t('logout')}</span>}</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={`flex-1 p-6 md:p-8 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-20'}`}>
        <AnimatePresence>{notification.show && (<motion.div initial={{ opacity: 0, y: -50, x: 50 }} animate={{ opacity: 1, y: 0, x: 0 }} exit={{ opacity: 0, x: 50 }} className={`fixed top-6 right-6 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 text-white font-bold ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>{notification.type === 'error' ? <AlertCircle size={24} /> : <CheckCircle size={24} />}{notification.message}</motion.div>)}</AnimatePresence>

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">{activeTab === 'overview' ? t('admin_dashboard_title') : activeTab === 'users' ? t('user_management') : activeTab === 'settings' ? t('site_settings') : t('content_management')}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{t('welcome')}, <span className="font-semibold text-blue-600">{currentUser?.email}</span></p>
          </div>
          {activeTab !== 'settings' && activeTab !== 'overview' && activeTab !== 'users' && (<button onClick={() => { setFormData({ ...formData, type: activeTab }); setEditingId(null); setIsModalOpen(true); }} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95"><Plus size={20} /> {t('add_new')}</button>)}
        </header>

        {loading ? (<div className="flex flex-col items-center justify-center h-96"><Loader2 className="animate-spin text-blue-600 w-12 h-12 mb-4" /><p className="text-slate-400">{t('loading')}</p></div>) : (
            <>
                {/* SETTINGS */}
                {activeTab === 'settings' && (
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                         <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100 dark:border-slate-700"><div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-yellow-600 dark:text-yellow-400"><Home size={24} /></div><h3 className="text-xl font-bold text-slate-800 dark:text-white">{t('site_settings')}</h3></div>
                         <form onSubmit={handleSettingsUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="col-span-full"><span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">{t('settings_hero_section')}</span></div>
                            <div><label className="label-title">{t('title_label')} 1</label><input value={siteSettings.heroTitle1} onChange={e=>setSiteSettings({...siteSettings, heroTitle1: e.target.value})} className="input-field" /></div>
                            <div><label className="label-title">{t('title_label')} 2</label><input value={siteSettings.heroTitle2} onChange={e=>setSiteSettings({...siteSettings, heroTitle2: e.target.value})} className="input-field" /></div>
                            <div className="col-span-full"><label className="label-title">{t('desc_label')}</label><textarea value={siteSettings.heroSubtitle} onChange={e=>setSiteSettings({...siteSettings, heroSubtitle: e.target.value})} className="input-field h-24 pt-3" /></div>
                            <div className="col-span-full border-t border-slate-100 dark:border-slate-700 my-2"></div>
                            <div className="col-span-full"><span className="text-xs font-bold text-green-600 uppercase tracking-widest bg-green-50 px-2 py-1 rounded">{t('settings_about_section')}</span></div>
                            <div><label className="label-title">{t('title_label')}</label><input value={siteSettings.aboutTitle} onChange={e=>setSiteSettings({...siteSettings, aboutTitle: e.target.value})} className="input-field" /></div>
                            <div className="col-span-full flex justify-end mt-4"><button type="submit" className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg flex items-center gap-2"><Save size={20} /> {t('save')}</button></div>
                        </form>
                    </div>
                )}

                {/* LISTS */}
                {activeTab !== 'settings' && (
                    <>
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                {[{ title: t('total_words'), val: stats.dictionary, icon: Book, color: 'text-purple-600 bg-purple-100', trend: '+12%' }, { title: t('total_blogs'), val: stats.blog, icon: FileText, color: 'text-blue-600 bg-blue-100', trend: '+5%' }, { title: t('total_photos'), val: stats.gallery, icon: ImageIcon, color: 'text-orange-600 bg-orange-100', trend: '+2%' }, { title: t('total_users'), val: stats.users, icon: Users, color: 'text-green-600 bg-green-100', trend: 'Active' }].map((stat, i) => (<motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.1 } }} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-start justify-between hover:shadow-md transition-shadow"><div className="flex items-center gap-4"><div className={`p-4 rounded-2xl ${stat.color} dark:bg-opacity-20`}><stat.icon size={26} /></div><div><p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wide">{stat.title}</p><h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">{stat.val}</h3></div></div><div className="text-xs font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full flex items-center gap-1"><TrendingUp size={12} /> {stat.trend}</div></motion.div>))}
                            </div>
                        )}

                        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden min-h-[500px] flex flex-col">
                             <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white capitalize flex items-center gap-2"><span className={`w-2 h-8 rounded-full ${activeTab === 'users' ? 'bg-green-500' : 'bg-blue-500'}`}></span>{activeTab === 'users' ? t('user_list') : (activeTab === 'overview' ? t('recent_content') : t('content_list'))}</h3>
                                <div className="bg-slate-100 dark:bg-slate-900 rounded-xl px-4 py-2.5 flex items-center gap-3 text-slate-500 w-full md:w-auto focus-within:ring-2 focus-within:ring-blue-500/20 transition-all"><Search size={18} /><input type="text" placeholder={t('search_placeholder')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent outline-none text-sm w-full md:w-64 font-medium" /></div>
                            </div>
                            
                            <div className="overflow-x-auto flex-1">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">
                                        <tr>
                                            {activeTab === 'users' ? (
                                                <> <th className="p-5">{t('full_name')}</th> <th className="p-5">Email</th> <th className="p-5">{t('joined_date')}</th> <th className="p-5">{t('role')}</th> <th className="p-5 text-right">{t('actions')}</th> </>
                                            ) : (
                                                <> <th className="p-5">{t('title_label')}</th> <th className="p-5">{t('type')}</th> <th className="p-5">{t('date')}</th> <th className="p-5 text-right">{t('actions')}</th> </>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {currentItems.map((item) => (
                                            <motion.tr layout key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-blue-50/50 dark:hover:bg-slate-700/30 transition-colors group">
                                                {activeTab === 'users' ? (
                                                    <>
                                                        <td className="p-5 font-bold text-slate-800 dark:text-white">{item.name || '---'}</td>
                                                        <td className="p-5 text-slate-600 dark:text-slate-300 text-sm">{item.email}</td>
                                                        <td className="p-5 text-slate-500 text-sm">{item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : '-'}</td>
                                                        <td className="p-5"><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${item.role === 'admin' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{item.role || 'standard'}</span></td>
                                                        <td className="p-5 text-right flex items-center justify-end gap-2">
                                                            <button onClick={() => handleRoleChange(item.id, item.role)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition" title={t('change_role')}><Shield size={18} /></button>
                                                            <button onClick={() => handleUserDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title={t('delete_user')}><Trash2 size={18} /></button>
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className="p-5"><div className="font-bold text-slate-800 dark:text-white">{item.type === 'dictionary' ? item.ku : item.title}</div><div className="text-xs text-slate-500">{item.desc || ''}</div></td>
                                                        <td className="p-5"><span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs font-bold uppercase">{item.type}</span></td>
                                                        <td className="p-5 text-sm text-slate-500">{item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : '-'}</td>
                                                        <td className="p-5 text-right"><div className="flex items-center justify-end gap-2"><button onClick={() => openEditModal(item)} className="p-2 text-blue-500 rounded-lg hover:bg-blue-50"><Edit3 size={18} /></button><button onClick={() => handleDelete(item.id, item.type)} className="p-2 text-red-500 rounded-lg hover:bg-red-50"><Trash2 size={18} /></button></div></td>
                                                    </>
                                                )}
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                                {currentItems.length === 0 && (<div className="flex flex-col items-center justify-center py-20 text-slate-400"><p>{t('no_content_found')}</p></div>)}
                            </div>
                            
                            {totalPages > 1 && (
                                <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex justify-center items-center gap-4 bg-slate-50 dark:bg-slate-900/30">
                                    <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage===1} className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50"><ChevronLeft size={20}/></button>
                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{currentPage} / {totalPages}</span>
                                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage===totalPages} className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50"><ChevronRight size={20}/></button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </>
        )}
      </main>

      {/* GELİŞMİŞ MODAL (Split View & Templates) */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white dark:bg-slate-800 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[85vh]">
              
              {/* SOL: FORM ALANI */}
              <div className="flex-1 p-8 overflow-y-auto border-r border-slate-100 dark:border-slate-700">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                          {editingId ? <Edit3 className="text-blue-500" /> : <Plus className="text-green-500" />}
                          {editingId ? t('edit_content_title') : t('add_content_title')}
                      </h3>
                      <button onClick={closeModal} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition"><X /></button>
                  </div>

                  <form onSubmit={handleContentSubmit} className="space-y-6">
                      
                      {/* Tip Seçici (Sadece yeni eklemede) */}
                      {!editingId && activeTab === 'overview' && (
                        <div>
                            <label className="label-title">{t('content_type')}</label>
                            <div className="grid grid-cols-3 gap-3">
                                {['blog', 'dictionary', 'gallery'].map(type => (
                                    <button key={type} type="button" onClick={() => setFormData({...formData, type})} className={`py-3 rounded-xl text-sm font-bold border-2 transition capitalize ${formData.type === type ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500 hover:border-blue-200'}`}>{t(type)}</button>
                                ))}
                            </div>
                        </div>
                      )}

                      {/* --- FORM İÇERİKLERİ --- */}
                      {formData.type === 'dictionary' ? (
                          <div className="grid grid-cols-2 gap-4">
                              <div><label className="label-title text-purple-600">{t('kurdish_label')}</label><input value={formData.ku} onChange={e=>setFormData({...formData, ku:e.target.value})} className="input-field border-purple-100 focus:border-purple-500" required /></div>
                              <div><label className="label-title text-slate-600">{t('turkish_label')}</label><input value={formData.tr} onChange={e=>setFormData({...formData, tr:e.target.value})} className="input-field" required /></div>
                          </div>
                      ) : (
                          <>
                              {/* Başlık */}
                              <div><label className="label-title">{t('title_label')}</label><input value={formData.title} onChange={e=>setFormData({...formData, title:e.target.value})} className="input-field" required /></div>
                              
                              {/* Blog için Kategori Etiketleri */}
                              {formData.type === 'blog' && (
                                  <div>
                                      <label className="label-title">{t('category_label')} <span className="text-xs font-normal text-slate-400">({t('quick_tags')})</span></label>
                                      <div className="flex gap-2 mb-2">
                                          {['Nûçe', 'Daxuyanî', 'Çalakî'].map(tag => (
                                              <button key={tag} type="button" onClick={() => setFormData({...formData, category: tag})} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs hover:bg-blue-100 dark:hover:bg-blue-900 text-slate-600 dark:text-slate-300 transition">{tag}</button>
                                          ))}
                                      </div>
                                      <input value={formData.category} onChange={e=>setFormData({...formData, category:e.target.value})} className="input-field" />
                                  </div>
                              )}

                              {/* Açıklama */}
                              {formData.type === 'blog' && (
                                  <div><label className="label-title">{t('desc_label')}</label><textarea rows="6" value={formData.desc} onChange={e=>setFormData({...formData, desc:e.target.value})} className="input-field resize-none" /></div>
                              )}

                              {/* Medya & Link */}
                              <div>
                                  <label className="label-title">{formData.type === 'blog' ? t('cover_image') : t('image_url_label')}</label>
                                  <div className="flex gap-2"><ImageIcon className="text-slate-400" /><input value={formData.url} onChange={e=>setFormData({...formData, url:e.target.value})} className="input-field" placeholder="https://..." /></div>
                              </div>

                              {/* Blog için Dış Link */}
                              {formData.type === 'blog' && (
                                  <div>
                                      <label className="label-title">{t('external_link')}</label>
                                      <div className="flex gap-2"><LinkIcon className="text-slate-400" /><input value={formData.externalLink || ''} onChange={e=>setFormData({...formData, externalLink:e.target.value})} className="input-field" placeholder="https://..." /></div>
                                  </div>
                              )}
                          </>
                      )}

                      <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
                          <button type="button" onClick={closeModal} className="px-6 py-3 rounded-xl text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition">{t('cancel')}</button>
                          <button type="submit" className="px-8 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 flex items-center gap-2"><Save size={18} /> {t('save')}</button>
                      </div>
                  </form>
              </div>

              {/* SAĞ: CANLI ÖNİZLEME (PREVIEW) */}
              <div className="w-1/3 bg-slate-50 dark:bg-slate-900 p-8 border-l border-slate-200 dark:border-slate-700 hidden md:flex flex-col">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Eye size={14} /> {t('preview')}</h4>
                  
                  {/* Blog Card Preview */}
                  {formData.type === 'blog' && (
                      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                          <div className="h-40 bg-slate-200 dark:bg-slate-700 relative flex items-center justify-center overflow-hidden">
                              {formData.url ? <img src={formData.url} className="w-full h-full object-cover" /> : <FileText className="text-slate-400" size={40} />}
                          </div>
                          <div className="p-5">
                              <div className="flex items-center gap-2 mb-2"><span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-lg text-[10px] font-bold uppercase">{formData.category || 'CATEGORY'}</span><span className="text-slate-400 text-xs">Today</span></div>
                              <h4 className="font-bold text-slate-800 dark:text-white mb-2 line-clamp-2">{formData.title || 'Title Preview'}</h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3">{formData.desc || 'Description text will appear here...'}</p>
                          </div>
                      </div>
                  )}

                  {/* Gallery Preview */}
                  {formData.type === 'gallery' && (
                      <div className="bg-black rounded-3xl shadow-lg overflow-hidden relative aspect-square flex items-center justify-center group">
                          {formData.url ? (
                              isVideoUrl(formData.url) ? <video src={formData.url} className="w-full h-full object-cover" controls /> : <img src={formData.url} className="w-full h-full object-cover" />
                          ) : <ImageIcon className="text-slate-600" size={40} />}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4"><p className="text-white font-bold">{formData.title || 'Title'}</p></div>
                      </div>
                  )}

                  {/* Dictionary Preview */}
                  {formData.type === 'dictionary' && (
                      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md border-l-4 border-purple-500">
                          <h3 className="text-2xl font-black text-purple-600 mb-1">{formData.ku || 'Peyv'}</h3>
                          <p className="text-slate-500 text-sm font-bold uppercase">Tirkî</p>
                          <p className="text-lg text-slate-800 dark:text-white">{formData.tr || 'Kelime'}</p>
                      </div>
                  )}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .input-field { width: 100%; padding: 0.85rem 1rem; border-radius: 0.75rem; background-color: #f8fafc; border: 1px solid #e2e8f0; outline: none; transition: all 0.2s; font-size: 0.95rem; }
        .dark .input-field { background-color: #1e293b; border-color: #334155; color: white; }
        .input-field:focus { background-color: white; border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
        .dark .input-field:focus { background-color: #0f172a; }
        .label-title { display: block; font-size: 0.875rem; font-weight: 700; color: #475569; margin-bottom: 0.5rem; }
        .dark .label-title { color: #cbd5e1; }
      `}</style>

    </div>
  );
};

export default Dashboard;