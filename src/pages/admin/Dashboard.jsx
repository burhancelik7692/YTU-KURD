import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase'; // YOL DÜZELTİLDİ (src/firebase)
import { addDynamicContent } from '../../services/adminService'; // YOL DÜZELTİLDİ
import { LogOut, Image, Plus, CheckCircle, Loader2, BookOpen, MessageSquare, Book, Trash2, Link as LinkIcon, Edit, AlertCircle, Music, Film, Settings } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext'; 
import { siteContent } from '../../data/locales'; // YOL DÜZELTİLDİ
import { collection, getDocs, deleteDoc, doc, query, orderBy, updateDoc } from 'firebase/firestore'; 

// --- SABİT KATEGORİLER (Sadece Galeri için kullanılıyor) ---
const GALLERY_CATEGORIES = [
  { value: "newroz", label: "Newroz" },
  { value: "calaki", label: "Çalakî (Etkinlik)" },
  { value: "taste", label: "Taştê (Kahvaltı)" },
  { value: "ger", label: "Ger (Gezi)" },
];

// Admin Dashboard Bileşeni
const Dashboard = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('gallery');
  const [contentList, setContentList] = useState([]);
  const [editingId, setEditingId] = useState(null); 
  
  // Form State'leri
  const [formData, setFormData] = useState({ 
    title: '', url: '', category: '', desc: '', type: 'gallery', text: '', ku: '', tr: ''
  });

  // --- 1. İÇERİK LİSTESİNİ ÇEKME ---
  useEffect(() => {
    fetchContentList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]); 

  const fetchContentList = async () => {
    setLoading(true);
    try {
        const q = query(collection(db, "dynamicContent"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toLocaleDateString(lang) : 'Bilinmiyor'
        }));
        setContentList(list);
    } catch (err) {
        console.error("İçerik listesi çekilemedi:", err);
        setError("İçerik listesi yüklenirken bir hata oluştu.");
    } finally {
        setLoading(false);
    }
  };

  // --- 2. SİLME İŞLEVİ ---
  const handleDelete = async (id, title) => {
    if (!window.confirm(`'${title}' başlıklı içeriği silmek istediğinizden emin misiniz?`)) {
        return;
    }
    setEditingId(null);
    try {
        await deleteDoc(doc(db, "dynamicContent", id));
        setSuccess(true);
        fetchContentList();
    } catch (err) {
        setError("Silme işlemi başarısız oldu.");
    }
  };
  
  // --- 3. DÜZENLEME BAŞLATMA İŞLEVİ ---
  const handleEdit = (item) => {
      setEditingId(item.id);
      setActiveTab(item.type === 'dictionary' ? 'dictionary' : item.type === 'gallery' ? 'gallery' : 'content');
      setFormData({ 
          title: item.title || '', 
          url: item.url || '', 
          category: item.category || '', 
          desc: item.desc || '',
          type: item.type,
          text: item.text || '', 
          ku: item.ku || '', 
          tr: item.tr || ''
      });
  };

  // --- 4. GÜNCELLEME VEYRA EKLEME İŞLEVİ ---
  const handleContentUpload = async (e) => {
      e.preventDefault();
      setError(null);
      
      let dataToSave = { ...formData };
      
      if (!dataToSave.title && dataToSave.type !== 'dictionary') {
          if (!dataToSave.url) { setError("Başlık ve URL boş bırakılamaz!"); return; }
      }
      if (dataToSave.type === 'dictionary' && (!dataToSave.ku || !dataToSave.tr)) {
          setError("Sözlük için Kürtçe ve Türkçe kelime zorunludur!");
          return;
      }
      
      setLoading(true);
      try {
          if (editingId) {
              const docRef = doc(db, "dynamicContent", editingId);
              await updateDoc(docRef, dataToSave);
              setEditingId(null);
          } else {
              await addDynamicContent(dataToSave);
          }
          
          setSuccess(true);
          setFormData(prev => ({ ...prev, title: '', url: '', category: '', desc: '', text: '', ku: '', tr: '' }));
          fetchContentList(); 
          
          setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
          setError("İşlem başarısız oldu: " + err.message);
      }
      setLoading(false);
  };
  
  const handleLogout = async () => {
    await logout();
    navigate('/admin');
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const setContentTab = (type) => {
      setEditingId(null); 
      setActiveTab(type);
      setFormData(prev => ({ ...prev, type: type, category: '', title: '', url: '', desc: '', text: '', ku: '', tr: '' }));
  };
  
  // Dilden bağımsız sabitler
  const T = siteContent[lang]?.nav || {};
  const contentHeader = {
    gallery: { icon: Image, label: editingId ? 'Galeri Öğesini Güncelle' : 'Resim Ekle (Galeri)', color: 'blue' },
    content: { icon: MessageSquare, label: editingId ? 'İçeriği Güncelle' : 'Blog/Duyuru Metni Ekle', color: 'green' },
    dictionary: { icon: Book, label: editingId ? 'Sözlük Kelimesini Güncelle' : 'Sözlük Kelimesi Ekle', color: 'purple' },
    settings: { icon: Settings, label: 'Site Ayarları', color: 'yellow' }
  }[activeTab];

  const typeIcons = {
      gallery: <Image size={20} className="text-blue-500" />, book: <BookOpen size={20} className="text-yellow-600" />,
      music: <Music size={20} className="text-indigo-500" />, video: <Film size={20} className="text-red-600" />,
      dictionary: <Book size={20} className="text-purple-600" />, content: <MessageSquare size={20} className="text-emerald-600" />
  };
  
  const formatTitle = (item) => {
    if (item.type === 'dictionary') return `${item.ku} -> ${item.tr}`;
    return item.title;
  };
  
  const formatDesc = (item) => {
      if (item.desc) return item.desc.substring(0, 50) + '...';
      if (item.category) return item.category;
      if (item.url) return item.url.substring(0, 30) + '...';
      return 'Açıklama yok';
  };


  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex text-slate-900 dark:text-white transition-colors">
      {/* SOL MENÜ (SIDEBAR) */}
      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:block border-r border-slate-700">
        <h1 className="text-2xl font-black text-yellow-500 mb-8">YTU Admin</h1>
        <nav className="space-y-2">
          <button onClick={() => setContentTab('gallery')} className={`w-full text-left p-3 rounded-xl font-bold transition flex items-center gap-2 ${activeTab === 'gallery' ? 'bg-blue-600' : 'hover:bg-slate-800 text-slate-400'}`}><Image size={18} /> Galeri Yönetimi</button>
          <button onClick={() => setContentTab('content')} className={`w-full text-left p-3 rounded-xl font-bold transition flex items-center gap-2 ${activeTab === 'content' ? 'bg-blue-600' : 'hover:bg-slate-800 text-slate-400'}`}><MessageSquare size={18} /> {T.admin_content || 'İçerik/Blog'}</button>
          <button onClick={() => setContentTab('dictionary')} className={`w-full text-left p-3 rounded-xl font-bold transition flex items-center gap-2 ${activeTab === 'dictionary' ? 'bg-blue-600' : 'hover:bg-slate-800 text-slate-400'}`}><Book size={18} /> {T.admin_dict || 'Sözlük'}</button>
          <div className="border-t border-slate-700 my-4"></div>
          <button onClick={() => setContentTab('settings')} className={`w-full text-left p-3 rounded-xl font-bold transition flex items-center gap-2 ${activeTab === 'settings' ? 'bg-yellow-600' : 'hover:bg-slate-800 text-slate-400'}`}><Settings size={18} /> Site Ayarları</button>
        </nav>
        <button onClick={handleLogout} className="mt-12 flex items-center gap-2 text-red-400 hover:text-red-300 font-bold text-sm"><LogOut size={18} /> Çıkış Yap</button>
      </aside>

      {/* ANA İÇERİK */}
      <main className="flex-1 p-8 dark:bg-slate-900">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">İçerik Yönetimi</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Hoş geldiniz, {currentUser?.email}. Lütfen içeriğinizi harici linkler üzerinden ekleyin.</p>

        {error && (<div className="bg-red-500/20 text-red-200 p-4 rounded-lg mb-6 flex items-center gap-2"><AlertCircle size={20} /> {error}</div>)}
        {success && (<div className="bg-green-600 text-white p-4 rounded-lg mb-6 flex items-center gap-2"><CheckCircle size={20} /> İşlem Başarılı!</div>)}

        {/* --- 1. YENİ İÇERİK EKLEME/GÜNCELLEME FORMU --- */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl max-w-2xl border border-slate-200 dark:border-slate-700 mb-12">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                <contentHeader.icon size={24} className={`text-${contentHeader.color}-600`} />
                {contentHeader.label}
            </h3>

            {activeTab === 'settings' ? (
                 /* AYARLAR FORMU (Hakkımızda Metinleri) */
                 <form onSubmit={handleSettingsUpdate} className="space-y-6">
                     <p className="text-sm text-yellow-500 font-bold flex items-center gap-2"><Settings size={16} /> Site Hakkında Metinlerini Güncelleyin</p>
                     
                     <div><label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Hakkımızda Metni 1 (Kısa Başlık)</label><textarea name="aboutText1" value={settings.aboutText1} onChange={(e) => setSettings({...settings, aboutText1: e.target.value})} className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 outline-none" placeholder="Örn: YTÜ Kürtçe Topluluğu 2025'te kurulmuştur." required></textarea></div>
                     <div><label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Hakkımızda Metni 2 (Detay)</label><textarea name="aboutText2" value={settings.aboutText2} onChange={(e) => setSettings({...settings, aboutText2: e.target.value})} className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 outline-none" placeholder="Örn: Amacımız Kürt dilini korumaktır..." required></textarea></div>

                     <button type="submit" disabled={loading} className="w-full py-4 bg-yellow-600 text-slate-900 rounded-xl font-bold text-lg hover:bg-yellow-700 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">
                         {loading ? <><Loader2 className="animate-spin" /> Güncelleniyor...</> : <><CheckCircle /> Ayarları Kaydet</>}
                     </button>
                 </form>
            ) : activeTab === 'dictionary' ? (
                /* SÖZLÜK FORM */
                <form onSubmit={handleContentUpload} className="space-y-6">
                    <p className="text-sm text-yellow-500 font-bold flex items-center gap-2"><BookOpen size={16} /> Sözlük içeriği ekliyorsunuz.</p>
                    <div><label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Kürtçe Kelime (ku)</label><input type="text" name="ku" value={formData.ku} onChange={handleChange} className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 outline-none" placeholder="Örn: Serkeftin" required /></div>
                    <div><label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Türkçe Anlamı (tr)</label><input type="text" name="tr" value={formData.tr} onChange={handleChange} className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 outline-none" placeholder="Örn: Başarı" required /></div>
                    <button type="submit" disabled={loading} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">
                        {loading ? <><Loader2 className="animate-spin" /> Yükleniyor...</> : <><Plus /> {editingId ? 'Güncelle' : 'Ekle'}</>}
                    </button>
                    {editingId && <button type="button" onClick={() => setEditingId(null)} className="w-full mt-2 py-2 bg-slate-200 text-slate-800 rounded-xl font-bold transition">Düzenlemeyi İptal Et</button>}
                </form>
            ) : (
                
                /* GALERİ VE CONTENT FORMLARI */
                <form onSubmit={handleContentUpload} className="space-y-6">
                    <div><label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Başlık</label><input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 outline-none" placeholder="Örn: Newroz Kutlaması 2025" required /></div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Harici URL (Resim/Video/PDF Linki)</label>
                        <input type="url" name="url" value={formData.url} onChange={handleChange} className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 outline-none" placeholder="https://drive.google.com/linkiniz" required />
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">⚠️ Maliyet için lütfen harici (Imgur, YouTube vb.) link kullanın.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Kategori (Örn: Wêje, Dîrok)</label>
                        <input type="text" name="category" value={formData.category} onChange={handleChange} className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 outline-none" placeholder="Örn: Edebiyat, Folklor" />
                    </div>
                    
                    {activeTab === 'content' && (
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Blog/Duyuru Metni</label>
                            <textarea name="desc" value={formData.desc} onChange={handleChange} rows="5" className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 outline-none resize-none" placeholder="Kısa açıklama veya duyuru metni..."></textarea>
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">
                        {loading ? <><Loader2 className="animate-spin" /> Yükleniyor...</> : <>{editingId ? 'Güncelle' : 'Ekle'} ve Yayınla</>}
                    </button>
                    {editingId && <button type="button" onClick={() => setEditingId(null)} className="w-full mt-2 py-2 bg-slate-200 text-slate-800 rounded-xl font-bold transition">Düzenlemeyi İptal Et</button>}
                </form>
            )}
        </div>


        {/* --- 2. İÇERİK LİSTESİ VE YÖNETİMİ --- */}
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-12 mb-6">Mevcut İçerikler ({contentList.length})</h3>
        
        {loading ? (
             <p className="text-slate-500 dark:text-slate-400">Yükleniyor...</p>
        ) : (
            <div className="space-y-4">
                {contentList.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-4 truncate flex-1">
                            {typeIcons[item.type] || <MessageSquare size={20} className="text-slate-500" />}
                            <div className="truncate">
                                <p className="font-bold text-sm truncate">{formatTitle(item)}</p>
                                <p className="text-xs text-slate-400">Tipi: {item.type} | Kategori: {item.category || 'Yok'} | Tarih: {item.createdAt}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                            {/* Linke Git */}
                            {item.url && (
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 transition" title="Linke Git">
                                    <LinkIcon size={20} />
                                </a>
                            )}
                            {/* Düzenle */}
                            <button onClick={() => handleEdit(item)} className="text-yellow-500 hover:text-yellow-600 transition" title="Düzenle">
                                <Edit size={20} />
                            </button>
                            {/* Sil */}
                            <button onClick={() => handleDelete(item.id, item.title || item.ku)} className="text-red-500 hover:text-red-700 transition" title="Sil">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;