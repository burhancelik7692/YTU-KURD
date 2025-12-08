import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../../firebase';
import { uploadGalleryItem, addDynamicContent } from '../../services/adminService';
import { LogOut, Image, Plus, CheckCircle, Loader2, BookOpen, Music, Film } from 'lucide-react';

// --- SABİT KATEGORİLER ---
const GALLERY_CATEGORIES = [
  { value: "newroz", label: "Newroz" },
  { value: "calaki", label: "Çalakî (Etkinlik)" },
  { value: "taste", label: "Taştê (Kahvaltı)" },
  { value: "ger", label: "Ger (Gezi)" },
];

const Dashboard = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('gallery'); // gallery, content
  
  // Galeri Form State'leri
  const [imgTitle, setImgTitle] = useState('');
  const [imgCategory, setImgCategory] = useState('newroz');
  const [imageFile, setImageFile] = useState(null);

  // İçerik Form State'leri
  const [contentType, setContentType] = useState('book');
  const [contentData, setContentData] = useState({ title: '', url: '', category: '', desc: '' });

  const handleLogout = async () => {
    await logout();
    navigate('/admin');
  };

  // --- RESİM YÜKLEME (FIREBASE STORAGE) ---
  const handleGalleryUpload = async (e) => {
    e.preventDefault();
    setError(null);
    if (!imageFile) {
      setError("Lütfen bir resim dosyası seçin!");
      return;
    }

    setLoading(true);
    try {
      await uploadGalleryItem(imageFile, imgTitle, imgCategory);
      setSuccess(true);
      setImgTitle('');
      setImageFile(null);
      document.getElementById('fileInput').value = ''; // Inputu temizle
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError("Yükleme başarısız: " + error.message);
    }
    setLoading(false);
  };
  
  // --- HARİCİ İÇERİK YÜKLEME (URL TABANLI) ---
  const handleContentUpload = async (e) => {
      e.preventDefault();
      setError(null);
      if (!contentData.title || !contentData.url) {
        setError("Başlık ve URL boş bırakılamaz!");
        return;
      }
      
      setLoading(true);
      try {
          await addDynamicContent(contentType, contentData);
          setSuccess(true);
          setContentData({ title: '', url: '', category: '', desc: '' });
          setTimeout(() => setSuccess(false), 3000);
      } catch (error) {
          setError("İçerik ekleme başarısız oldu: " + error.message);
      }
      setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex text-slate-900 dark:text-white transition-colors">
      {/* SOL MENÜ (SIDEBAR) */}
      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:block border-r border-slate-700">
        <h1 className="text-2xl font-black text-yellow-500 mb-8">YTU Admin</h1>
        <nav className="space-y-2">
          <button onClick={() => setActiveTab('gallery')} className={`w-full text-left p-3 rounded-xl font-bold transition flex items-center gap-2 ${activeTab === 'gallery' ? 'bg-blue-600' : 'hover:bg-slate-800 text-slate-400'}`}><Image size={18} /> Galeri Yönetimi</button>
          <button onClick={() => setActiveTab('content')} className={`w-full text-left p-3 rounded-xl font-bold transition flex items-center gap-2 ${activeTab === 'content' ? 'bg-blue-600' : 'hover:bg-slate-800 text-slate-400'}`}><BookOpen size={18} /> İçerik (Link/Metin)</button>
        </nav>
        <button onClick={handleLogout} className="mt-12 flex items-center gap-2 text-red-400 hover:text-red-300 font-bold text-sm"><LogOut size={18} /> Çıkış Yap</button>
      </aside>

      {/* ANA İÇERİK */}
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">Yönetim Paneli</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Hoş geldiniz, {currentUser?.email}</p>

        {/* Hata Alanı */}
        {error && (
            <div className="bg-red-500/20 text-red-200 p-4 rounded-lg mb-6 flex items-center gap-2">
                <AlertCircle size={20} /> {error}
            </div>
        )}

        {/* BAŞARI MESAJI */}
        {success && (
            <div className="bg-green-600 text-white p-4 rounded-lg mb-6 flex items-center gap-2">
                <CheckCircle size={20} /> Başarıyla Eklendi ve Yayınlandı!
            </div>
        )}


        {/* --- 1. GALERİ SEKME İÇERİĞİ --- */}
        {activeTab === 'gallery' && (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl max-w-2xl border border-slate-200 dark:border-slate-700">
                <h3 className="text-2xl font-bold text-blue-600 mb-6 flex items-center gap-2"><Image size={24} /> Yeni Fotoğraf Ekle (Storage)</h3>
                <form onSubmit={handleGalleryUpload} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Başlık</label>
                        <input type="text" value={imgTitle} onChange={(e) => setImgTitle(e.target.value)} className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 outline-none" placeholder="Örn: Newroz 2025 Halayı" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Kategori</label>
                        <select value={imgCategory} onChange={(e) => setImgCategory(e.target.value)} className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 outline-none">
                            {GALLERY_CATEGORIES.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Resim Dosyası (.jpg, .png)</label>
                        <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer relative">
                            <input id="fileInput" type="file" onChange={(e) => setImageFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" required />
                            <div className="flex flex-col items-center">
                                <Image size={48} className="text-slate-400 mb-2" />
                                <span className="text-slate-500 dark:text-slate-300 font-medium">{imageFile ? imageFile.name : "Dosyayı buraya sürükle veya tıkla"}</span>
                            </div>
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">
                        {loading ? <><Loader2 className="animate-spin" /> Yükleniyor...</> : <><Plus /> Ekle ve Yayınla (Firebase Storage)</>}
                    </button>
                </form>
            </div>
        )}

        {/* --- 2. DİNAMİK İÇERİK SEKME İÇERİĞİ (Video/Müzik/Kitap) --- */}
        {activeTab === 'content' && (
             <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl max-w-2xl border border-slate-200 dark:border-slate-700">
                <h3 className="text-2xl font-bold text-purple-600 mb-6 flex items-center gap-2"><BookOpen size={24} /> Harici İçerik Ekle (URL)</h3>
                
                <form onSubmit={handleContentUpload} className="space-y-6">
                    {/* TÜR SEÇİMİ */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">İçerik Tipi</label>
                        <select value={contentType} onChange={(e) => setContentType(e.target.value)} className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 outline-none">
                            <option value="book">Kitap / Makale (PDF, Drive)</option>
                            <option value="music">Müzik (Spotify, SoundCloud)</option>
                            <option value="video">Video (YouTube, Vimeo)</option>
                        </select>
                    </div>

                    {/* BAŞLIK & URL */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Başlık</label>
                        <input type="text" value={contentData.title} onChange={(e) => setContentData({...contentData, title: e.target.value})} className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 outline-none" placeholder="Örn: Mem û Zîn Tam Metni" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Harici URL (Link)</label>
                        <input type="url" value={contentData.url} onChange={(e) => setContentData({...contentData, url: e.target.value})} className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 outline-none" placeholder="https://youtube.com/linkiniz" required />
                    </div>

                    {/* KATEGORİ (Opsiyonel) */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Kategori (Örn: Edebiyat)</label>
                         <input type="text" value={contentData.category} onChange={(e) => setContentData({...contentData, category: e.target.value})} className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 outline-none" placeholder="Örn: Edebiyat, Dîrok" />
                    </div>
                    
                    {/* AÇIKLAMA */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Kısa Açıklama</label>
                        <textarea value={contentData.desc} onChange={(e) => setContentData({...contentData, desc: e.target.value})} rows="3" className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 outline-none resize-none" placeholder="Bu içerik ne hakkında..."></textarea>
                    </div>

                    <button type="submit" disabled={loading} className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">
                        {loading ? <><Loader2 className="animate-spin" /> Yükleniyor...</> : <><Plus /> İçerik Ekle (Harici)</>}
                    </button>
                </form>
            </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;