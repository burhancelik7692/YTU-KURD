import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { LogOut, Image, Plus, CheckCircle, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  
  // --- STATE ---
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Galeri Form Verileri
  const [imgTitle, setImgTitle] = useState('');
  const [imgCategory, setImgCategory] = useState('newroz');
  const [imageFile, setImageFile] = useState(null);

  // Çıkış Yap
  const handleLogout = async () => {
    await logout();
    navigate('/admin');
  };

  // --- RESİM YÜKLEME VE VERİTABANINA KAYIT ---
  const handleGalleryUpload = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert("Lütfen bir resim seçin!");

    setLoading(true);
    try {
      // 1. Resmi Storage'a Yükle
      const storageRef = ref(storage, `gallery/${imageFile.name + Date.now()}`);
      await uploadBytes(storageRef, imageFile);
      const url = await getDownloadURL(storageRef);

      // 2. Veriyi Firestore'a Yaz (Link + Başlık)
      await addDoc(collection(db, "gallery"), {
        title: imgTitle,
        category: imgCategory,
        src: url,
        createdAt: new Date()
      });

      setSuccess(true);
      setImgTitle('');
      setImageFile(null);
      setTimeout(() => setSuccess(false), 3000);

    } catch (error) {
      console.error("Hata:", error);
      alert("Yükleme başarısız oldu.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* SOL MENÜ (SIDEBAR) */}
      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:block">
        <h1 className="text-2xl font-black text-yellow-500 mb-8">YTU Admin</h1>
        <nav className="space-y-4">
          <button className="w-full text-left p-3 rounded-xl bg-blue-900/50 text-blue-200 font-bold border border-blue-800">Galeri Yönetimi</button>
          <button className="w-full text-left p-3 rounded-xl hover:bg-slate-800 text-slate-400 font-bold transition">Sözlük (Yakında)</button>
          <button className="w-full text-left p-3 rounded-xl hover:bg-slate-800 text-slate-400 font-bold transition">Duyurular (Yakında)</button>
        </nav>
        <button onClick={handleLogout} className="mt-12 flex items-center gap-2 text-red-400 hover:text-red-300 font-bold text-sm"><LogOut size={18} /> Çıkış Yap</button>
      </aside>

      {/* ANA İÇERİK */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800">Galeriye Resim Ekle</h2>
          <div className="text-sm text-slate-500">Giriş yapan: {currentUser?.email}</div>
        </div>

        {/* --- GALERİ FORMU --- */}
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-2xl border border-slate-200">
          {success && (
            <div className="bg-green-100 text-green-800 p-4 rounded-xl mb-6 flex items-center gap-2">
              <CheckCircle /> Başarıyla Eklendi!
            </div>
          )}

          <form onSubmit={handleGalleryUpload} className="space-y-6">
            
            {/* Başlık */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Resim Başlığı</label>
              <input 
                type="text" 
                value={imgTitle}
                onChange={(e) => setImgTitle(e.target.value)}
                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none"
                placeholder="Örn: Newroz 2025 Halayı"
                required
              />
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Kategori</label>
              <select 
                value={imgCategory}
                onChange={(e) => setImgCategory(e.target.value)}
                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none"
              >
                <option value="newroz">Newroz</option>
                <option value="calaki">Çalakî (Etkinlik)</option>
                <option value="taste">Taştê (Kahvaltı)</option>
                <option value="ger">Ger (Gezi)</option>
              </select>
            </div>

            {/* Resim Dosyası */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Resim Seç</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition cursor-pointer relative">
                <input 
                  type="file" 
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*"
                />
                <div className="flex flex-col items-center">
                   <Image size={48} className="text-slate-300 mb-2" />
                   <span className="text-slate-500 font-medium">
                     {imageFile ? imageFile.name : "Dosyayı buraya sürükle veya tıkla"}
                   </span>
                </div>
              </div>
            </div>

            {/* Gönder Butonu */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <><Loader2 className="animate-spin" /> Yükleniyor...</> : <><Plus /> Ekle ve Yayınla</>}
            </button>

          </form>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;