import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { addDynamicContent } from '../../services/adminService';
import { LogOut, Image, Plus, CheckCircle, Loader2, BookOpen, Music, Film, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('gallery'); // gallery, content
  
  // İçerik Form State'leri
  const [contentData, setContentData] = useState({ 
    title: '', 
    url: '', 
    category: '', 
    desc: '',
    type: 'gallery' // Varsayılan: Galeri
  });

  const handleLogout = async () => {
    await logout();
    navigate('/admin');
  };
  
  // --- HARİCİ İÇERİK YÜKLEME (URL TABANLI) ---
  const handleContentUpload = async (e) => {
      e.preventDefault();
      setError(null);
      
      if (!contentData.title || !contentData.url) {
        setError("Başlık ve URL (Link) boş bırakılamaz!");
        return;
      }
      
      setLoading(true);
      try {
          await addDynamicContent(contentData); // Servis artık sadece objeyi bekliyor
          setSuccess(true);
          // Formu temizle
          setContentData({ title: '', url: '', category: '', desc: '', type: contentData.type });
          
          setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
          setError("Ekleme başarısız oldu: " + err.message);
      }
      setLoading(false);
  };

  const setContentTab = (type) => {
      setActiveTab(type === 'gallery' ? 'gallery' : 'content');
      setContentData(prev => ({ ...prev, type: type, category: '', title: '', url: '', desc: '' }));
  };

  const isContentTab = activeTab === 'content';
  const currentContentType = contentData.type;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex text-slate-900 dark:text-white transition-colors">
      {/* SOL MENÜ (SIDEBAR) */}
      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:block border-r border-slate-700">
        <h1 className="text-2xl font-black text-yellow-500 mb-8">YTU Admin</h1>
        <nav className="space-y-2">
          <button onClick={() => setContentTab('gallery')} className={`w-full text-left p-3 rounded-xl font-bold transition flex items-center gap-2 ${currentContentType === 'gallery' ? 'bg-blue-600' : 'hover:bg-slate-800 text-slate-400'}`}><Image size={18} /> Galeri (Resim URL)</button>
          <button onClick={() => setContentTab('book')} className={`w-full text-left p-3 rounded-xl font-bold transition flex items-center gap-2 ${currentContentType === 'book' ? 'bg-blue-600' : 'hover:bg-slate-800 text-slate-400'}`}><BookOpen size={18} /> Kitap / Makale (PDF)</button>
          <button onClick={() => setContentTab('music')} className={`w-full text-left p-3 rounded-xl font-bold transition flex items-center gap-2 ${currentContentType === 'music' ? 'bg-blue-600' : 'hover:bg-slate-800 text-slate-400'}`}><Music size={18} /> Müzik / Podcast (MP3/Link)</button>
          <button onClick={() => setContentTab('video')} className={`w-full text-left p-3 rounded-xl font-bold transition flex items-center gap-2 ${currentContentType === 'video' ? 'bg-blue-600' : 'hover:bg-slate-800 text-slate-400'}`}><Film size={18} /> Video (YouTube)</button>
        </nav>
        <button onClick={handleLogout} className="mt-12 flex items-center gap-2 text-red-400 hover:text-red-300 font-bold text-sm"><LogOut size={18} /> Çıkış Yap</button>
      </aside>

      {/* ANA İÇERİK */}
      <main className="flex-1 p-8 dark:bg-slate-900">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">İçerik Yönetimi</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Hoş geldiniz, {currentUser?.email}. Lütfen içeriğinizi harici linkler üzerinden ekleyin.</p>

        {error && (<div className="bg-red-500/20 text-red-200 p-4 rounded-lg mb-6 flex items-center gap-2"><AlertCircle size={20} /> {error}</div>)}
        {success && (<div className="bg-green-600 text-white p-4 rounded-lg mb-6 flex items-center gap-2"><CheckCircle size={20} /> Başarıyla Eklendi ve Yayınlandı!</div>)}

        {/* ANA FORM (URL ODAKLI) */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl max-w-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                {currentContentType === 'gallery' ? <Image /> : currentContentType === 'book' ? <BookOpen /> : currentContentType === 'music' ? <Music /> : <Film />}
                Yeni {currentContentType.toUpperCase()} Ekle
            </h3>
            
            <form onSubmit={handleContentUpload} className="space-y-6">
                
                {/* BAŞLIK */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Başlık</label>
                    <input type="text" value={contentData.title} onChange={(e) => setContentData({...contentData, title: e.target.value})} className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 outline-none" placeholder="Örn: Newroz Kutlaması 2025" required />
                </div>

                {/* URL (Link) */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Harici URL (Resim Linki, YouTube, PDF Linki)</label>
                    <input type="url" value={contentData.url} onChange={(e) => setContentData({...contentData, url: e.target.value})} className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 outline-none" placeholder="https://drive.google.com/linkiniz.pdf" required />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">⚠️ Bu link doğrudan içeriğin kendisi olmalıdır (Firebase Storage kullanılmaz).</p>
                </div>

                {/* KATEGORİ */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Kategori (Örn: Wêje, Dîrok)</label>
                    <input type="text" value={contentData.category} onChange={(e) => setContentData({...contentData, category: e.target.value})} className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 outline-none" placeholder="Örn: Edebiyat, Folklor, Bîranîn" />
                </div>
                
                {/* AÇIKLAMA */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Kısa Açıklama</label>
                    <textarea value={contentData.desc} onChange={(e) => setContentData({...contentData, desc: e.target.value})} rows="3" className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 outline-none resize-none" placeholder="Bu içerik ne hakkında..."></textarea>
                </div>

                <button type="submit" disabled={loading} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? <><Loader2 className="animate-spin" /> Yükleniyor...</> : <><Plus /> Ekle ve Yayınla</>}
                </button>
            </form>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;