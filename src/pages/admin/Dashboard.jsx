import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, LayoutDashboard, FileText, Image as ImageIcon, Book, 
  Users, Settings, Plus, Search, Trash2, Edit3, Save, X, 
  BarChart2, Clock, CheckCircle, AlertCircle, Home
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, orderBy, getDoc, setDoc } from 'firebase/firestore';

const Dashboard = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  
  // UI State
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  
  // Veri State
  const [stats, setStats] = useState({ words: 0, blogs: 0, images: 0, users: 0 });
  const [contents, setContents] = useState([]);
  
  // Ayarlar State (Anasayfa Yönetimi İçin)
  const [siteSettings, setSiteSettings] = useState({
      heroTitle1: '', heroTitle2: '', heroTitle3: '', heroSubtitle: '',
      aboutTitle: '', aboutText1: '', aboutText2: '',
      ctaTitle: '', ctaText: '', ctaButton: ''
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ 
    title: '', desc: '', category: '', type: 'blog', url: '', ku: '', tr: '' 
  });

  // --- VERİLERİ ÇEK ---
  useEffect(() => {
    const fetchAllData = async () => {
        setLoading(true);
        try {
            // 1. İçerikleri Çek
            const q = query(collection(db, "dynamicContent"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setContents(data);

            // 2. İstatistikleri Hesapla
            setStats({
                words: data.filter(i => i.type === 'dictionary').length,
                blogs: data.filter(i => i.type === 'blog' || i.type === 'content').length,
                images: data.filter(i => i.type === 'gallery').length,
                users: 1
            });

            // 3. Site Ayarlarını Çek
            const settingsRef = doc(db, "settings", "home");
            const settingsSnap = await getDoc(settingsRef);
            if (settingsSnap.exists()) {
                setSiteSettings(prev => ({ ...prev, ...settingsSnap.data() }));
            }

        } catch (err) {
            console.error("Veri hatası:", err);
            setError("Veriler yüklenirken hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    fetchAllData();
  }, []);

  // --- İŞLEMLER ---

  // Site Ayarlarını Güncelle
  const handleSettingsUpdate = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
          await setDoc(doc(db, "settings", "home"), siteSettings, { merge: true });
          setSuccess("Site ayarları başarıyla güncellendi!");
          setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
          setError("Ayarlar kaydedilemedi: " + err.message);
      }
      setLoading(false);
  };

  // Yeni İçerik Ekle / Güncelle
  const handleContentSubmit = async (e) => {
      e.preventDefault();
      try {
          const dataToSave = { ...formData, createdAt: new Date() };
          
          if (editingId) {
             await updateDoc(doc(db, "dynamicContent", editingId), dataToSave);
          } else {
             await addDoc(collection(db, "dynamicContent"), dataToSave);
          }

          setSuccess("İçerik başarıyla kaydedildi!");
          setIsModalOpen(false);
          setEditingId(null);
          setFormData({ title: '', desc: '', category: '', type: 'blog', url: '', ku: '', tr: '' });
          
          // Listeyi yenile (Basitçe sayfayı yenilemek yerine state güncellemek daha iyi olur ama şimdilik fetch çağırıyoruz)
          window.location.reload(); 
      } catch (err) {
          setError("İşlem başarısız: " + err.message);
      }
  };

  const handleDelete = async (id) => {
      if(window.confirm("Silmek istediğine emin misin?")) {
          try {
              await deleteDoc(doc(db, "dynamicContent", id));
              setContents(prev => prev.filter(item => item.id !== id));
              setSuccess("Silindi.");
              setTimeout(() => setSuccess(null), 2000);
          } catch (err) {
              setError("Silinemedi.");
          }
      }
  };

  const openEditModal = (item) => {
      setFormData(item);
      setEditingId(item.id);
      setIsModalOpen(true);
  };

  // Filtreleme
  const filteredContent = activeTab === 'overview' 
    ? contents.slice(0, 5) 
    : contents.filter(c => c.type === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex transition-colors duration-300">
      
      {/* 1. SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 flex flex-col fixed h-full z-20`}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && <h1 className="text-xl font-black text-blue-900 dark:text-white tracking-tight">YTU PANEL</h1>}
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
            <LayoutDashboard size={20} className="text-slate-500" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: 'overview', label: 'Genel Bakış', icon: BarChart2 },
            { id: 'settings', label: 'Site Ayarları', icon: Settings }, // YENİ
            { id: 'blog', label: 'Duyurular', icon: FileText },
            { id: 'dictionary', label: 'Sözlük', icon: Book },
            { id: 'gallery', label: 'Galeri', icon: ImageIcon },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-700">
          <button onClick={logout} className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-bold">Çıkış</span>}
          </button>
        </div>
      </aside>

      {/* 2. ANA ALAN */}
      <main className={`flex-1 p-8 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        
        {/* Bildirimler */}
        {success && <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-2 z-50 animate-bounce"><CheckCircle size={20} /> {success}</div>}
        {error && <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-2 z-50"><AlertCircle size={20} /> {error}</div>}

        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Admin Paneli</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">İçerik ve ayarları buradan yönet.</p>
          </div>
          {activeTab !== 'settings' && (
            <button 
              onClick={() => { setEditingId(null); setFormData({ title: '', desc: '', category: '', type: 'blog', url: '', ku: '', tr: '' }); setIsModalOpen(true); }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-transform transform hover:-translate-y-1"
            >
              <Plus size={20} /> Yeni Ekle
            </button>
          )}
        </header>

        {/* --- AYARLAR SEKME İÇERİĞİ --- */}
        {activeTab === 'settings' ? (
             <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700">
                 <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                    <Home className="text-yellow-500" size={28} />
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Anasayfa Metin Ayarları</h3>
                 </div>
                 <form onSubmit={handleSettingsUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2"><h4 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-4">Giriş (Hero) Bölümü</h4></div>
                    <div>
                        <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">Başlık 1 (Örn: Li YTÜ)</label>
                        <input type="text" value={siteSettings.heroTitle1} onChange={e => setSiteSettings({...siteSettings, heroTitle1: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">Başlık 2 (Renkli Kısım)</label>
                        <input type="text" value={siteSettings.heroTitle2} onChange={e => setSiteSettings({...siteSettings, heroTitle2: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600" />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">Alt Başlık (Slogan)</label>
                        <textarea value={siteSettings.heroSubtitle} onChange={e => setSiteSettings({...siteSettings, heroSubtitle: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600" rows="2" />
                    </div>

                    <div className="col-span-2 border-t border-slate-100 dark:border-slate-700 my-4 pt-4"><h4 className="text-sm font-bold text-blue-500 uppercase tracking-widest">Hakkımızda Bölümü</h4></div>
                    <div>
                        <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">Hakkımızda Başlık</label>
                        <input type="text" value={siteSettings.aboutTitle} onChange={e => setSiteSettings({...siteSettings, aboutTitle: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600" />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">Paragraf 1</label>
                        <textarea value={siteSettings.aboutText1} onChange={e => setSiteSettings({...siteSettings, aboutText1: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600" rows="3" />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">Paragraf 2</label>
                        <textarea value={siteSettings.aboutText2} onChange={e => setSiteSettings({...siteSettings, aboutText2: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600" rows="3" />
                    </div>

                    <div className="col-span-2 flex justify-end">
                        <button type="submit" disabled={loading} className="px-8 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg flex items-center gap-2">
                           {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Ayarları Kaydet</>}
                        </button>
                    </div>
                 </form>
             </div>
        ) : (
             /* --- DİĞER SEKMELER (TABLO) --- */
             <>
                {/* İstatistikler (Sadece Genel Bakışta) */}
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    {[
                      { title: 'Kelimeler', val: stats.words, icon: Book, color: 'bg-purple-500' },
                      { title: 'Duyurular', val: stats.blogs, icon: FileText, color: 'bg-blue-500' },
                      { title: 'Fotoğraflar', val: stats.images, icon: ImageIcon, color: 'bg-orange-500' },
                      { title: 'Admin', val: stats.users, icon: Users, color: 'bg-green-500' },
                    ].map((stat, i) => (
                      <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                        <div className={`p-4 rounded-xl text-white shadow-lg ${stat.color}`}><stat.icon size={24} /></div>
                        <div><p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.title}</p><h3 className="text-2xl font-black text-slate-800 dark:text-white">{stat.val}</h3></div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tablo */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                   {/* ... Tablo Başlığı ve Arama (Aynı kalır) ... */}
                   <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold">
                                <tr>
                                    <th className="p-4">İçerik</th>
                                    <th className="p-4">Tip</th>
                                    <th className="p-4 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {filteredContent.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-slate-800 dark:text-white">{item.title || item.ku}</div>
                                            <div className="text-xs text-slate-500 truncate max-w-xs">{item.desc || item.tr}</div>
                                        </td>
                                        <td className="p-4"><span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">{item.type}</span></td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEditModal(item)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><Edit3 size={18} /></button>
                                                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                   </div>
                </div>
             </>
        )}

      </main>

      {/* --- MODAL (EKLEME/DÜZENLEME) --- */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
               {/* Modal Header */}
               <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">{editingId ? 'Düzenle' : 'Yeni Ekle'}</h3>
                    <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
               </div>
               {/* Form */}
               <form onSubmit={handleContentSubmit} className="p-8 space-y-6">
                    {/* Tip Seçimi */}
                    <div>
                        <label className="block text-sm font-bold text-slate-500 mb-2">Tip</label>
                        <div className="flex gap-2">
                            {['blog', 'dictionary', 'gallery'].map(type => (
                                <button key={type} type="button" onClick={() => setFormData({...formData, type})} className={`px-4 py-2 rounded-lg text-sm font-bold border transition ${formData.type === type ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 text-slate-500'}`}>{type}</button>
                            ))}
                        </div>
                    </div>
                    
                    {/* İçerik Alanları */}
                    {formData.type === 'dictionary' ? (
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="Kürtçe (ku)" value={formData.ku} onChange={e => setFormData({...formData, ku: e.target.value})} className="w-full p-3 rounded-xl border bg-transparent" required />
                            <input type="text" placeholder="Türkçe (tr)" value={formData.tr} onChange={e => setFormData({...formData, tr: e.target.value})} className="w-full p-3 rounded-xl border bg-transparent" required />
                        </div>
                    ) : (
                        <>
                            <input type="text" placeholder="Başlık" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 rounded-xl border bg-transparent" required />
                            {formData.type === 'gallery' && <input type="url" placeholder="Resim URL" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="w-full p-3 rounded-xl border bg-transparent" required />}
                            {formData.type === 'blog' && <textarea placeholder="İçerik" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full p-3 rounded-xl border bg-transparent" rows="4" />}
                        </>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-xl text-slate-500 hover:bg-slate-100">İptal</button>
                        <button type="submit" className="px-6 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700">Kaydet</button>
                    </div>
               </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Dashboard;