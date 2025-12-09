import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setError('');
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      let errorMessage = 'Giriş başarısız oldu. Lütfen e-posta ve şifrenizi kontrol edin.';
      // Hata kodlarına göre daha net mesajlar veriyoruz
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        errorMessage = 'Hata: E-posta veya şifre hatalı.';
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/api-key-not-valid') {
        errorMessage = 'Sistem Hatası: Kimlik bilgisi geçersiz. Sunucu ayarlarını kontrol edin.';
      }
      
      setError(errorMessage);
    }
    setLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-slate-900 px-4"
    >
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white">Yönetici Paneli</h2>
          <p className="text-slate-400">Sadece yetkili personel girebilir.</p>
        </div>

        {error && <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-slate-300 mb-2 font-bold">E-Posta</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full p-3 rounded-xl bg-slate-700 text-white border border-slate-600 focus:border-blue-500 outline-none transition" required />
          </div>
          <div>
            <label className="block text-slate-300 mb-2 font-bold">Şifre</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full p-3 rounded-xl bg-slate-700 text-white border border-slate-600 focus:border-blue-500 outline-none transition" required />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition disabled:opacity-50">
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Login;