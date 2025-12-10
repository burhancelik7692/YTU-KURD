import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion"; 
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

// Sayfalar
import Home from "./pages/Home";
import Culture from "./pages/Culture"; 
import Music from "./pages/Music";
import Art from "./pages/Art";
import History from "./pages/History"; 
import Language from "./pages/Language";
import Listik from "./pages/Listik"; 
import Dictionary from "./pages/Dictionary"; 
import NotFound from "./pages/NotFound"; 
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import Blog from "./pages/Blog";
import UserDashboard from "./pages/UserDashboard"; // Kullanıcı Paneli

// Admin Sayfaları
import AuthPage from "./pages/admin/AuthPage"; // Login, Register, Forgot Password tek sayfada
import Dashboard from "./pages/admin/Dashboard";

import ScrollToTop from "./components/ScrollToTop"; 
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext'; 
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserProvider, useUser } from './context/UserContext'; 

import "./index.css";
import { AlertTriangle, Loader2 } from 'lucide-react'; 

// =========================================================
// 🚨 HATA YAKALAYICI (GLOBAL ERROR BOUNDARY)
// =========================================================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) { return { hasError: true, error }; }

  componentDidCatch(error, errorInfo) { console.error("Kritik Hata:", error, errorInfo); }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-6 text-center">
          <AlertTriangle size={64} className="text-red-500 mb-4" />
          <h1 className="text-2xl font-bold">Uygulama çöktü!</h1>
          <p className="text-red-300 mt-2 p-4 bg-slate-800 rounded border border-red-500/30 font-mono text-sm">{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 font-bold transition">Sayfayı Yenile</button>
        </div>
      );
    }
    return this.props.children; 
  }
}

// =========================================================
// 🔒 KORUMALI ROTA (Admin Rolü Kontrolü)
// =========================================================
const AdminPrivateRoute = ({ children }) => {
  const { currentUser, loading: authLoading } = useAuth();
  const { userData, loading: userLoading } = useUser();
  
  // Yükleme
  if (authLoading || userLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white"><Loader2 className="animate-spin text-yellow-500" size={50} /></div>
      );
  }

  // Yönlendirme Mantığı
  if (!currentUser) {
      return <Navigate to="/admin" />;
  }

  const isAdmin = userData?.role === 'admin';

  if (!isAdmin) {
      // Eğer kullanıcı giriş yapmış ama Admin değilse, kendi paneline yönlendir.
      return <Navigate to="/user" />;
  }
  
  return children;
};

// --- SAYFA DÜZENİ ---
const Layout = ({ children }) => {
  const location = useLocation();
  const isFullScreen = location.pathname.startsWith('/admin') || location.pathname.startsWith('/user'); 

  return (
    <div className="app-container flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Helmet><title>{"YTU Kurdî"}</title></Helmet>
      {!isFullScreen && <Navigation />}
      <main className="flex-grow">{children}</main>
      {!isFullScreen && <Footer />}
    </div>
  );
};

// --- İÇERİK VE YÖNLENDİRME (App'in İç Mantığı) ---
const AppContent = () => {
    const auth = useAuth();
    const user = useUser();
    
    // Yükleme durumları
    const authLoading = auth?.loading || false;
    const userLoading = user?.loading || false;
    
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    // Rastgele Parçacıklar (Görsel Efekt)
    const particles = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2
    }));

    useEffect(() => {
        // İlerleme çubuğu animasyonu
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) { clearInterval(interval); return 100; }
                return prev + Math.floor(Math.random() * 8) + 2;
            });
        }, 50);

        // Minimum bekleme süresi (2.5 saniye)
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2500);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, []);

    // Yükleme devam ediyorsa gösterilecek
    const showSplash = isLoading || authLoading || userLoading;

    return (
        <>
            {/* --- GELİŞMİŞ SPLASH SCREEN --- */}
            <AnimatePresence>
                {showSplash && (
                    <motion.div
                        key="splash-screen"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, filter: "blur(15px)", scale: 1.05 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 overflow-hidden"
                    >
                        {/* 1. ARKA PLAN EFEKTLERİ */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950"></div>
                        
                        {/* Uçuşan Parçacıklar */}
                        {particles.map((p) => (
                            <motion.div
                                key={p.id}
                                className="absolute bg-white rounded-full opacity-20"
                                style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, }}
                                animate={{ y: [0, -30, 0], opacity: [0.1, 0.5, 0.1], }}
                                transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
                            />
                        ))}

                        {/* 2. ARKA PLAN HAYALET LOGO */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 0.05, scale: 1 }}
                            transition={{ duration: 1 }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                        >
                            <img 
                                src="/logo.png" 
                                alt="Background Logo" 
                                className="w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] object-contain grayscale opacity-20 animate-[pulse_4s_ease-in-out_infinite]" 
                            />
                        </motion.div>

                        {/* 3. MERKEZİ YÜKLEYİCİ */}
                        <div className="relative z-10 flex flex-col items-center">
                            
                            {/* Logo ve Dönen Halkalar */}
                            <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                                {/* Dış Halka - Sarı */}
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 rounded-full border-2 border-transparent border-t-yellow-500 border-l-yellow-500/50"
                                ></motion.div>
                                
                                {/* İç Halka - Mavi */}
                                <motion.div 
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-3 rounded-full border-2 border-transparent border-b-blue-500 border-r-blue-500/50"
                                ></motion.div>

                                {/* Ortadaki Net Logo */}
                                <motion.div 
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5, type: "spring" }}
                                    className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center shadow-2xl border border-white/10 relative z-20"
                                >
                                    <img src="/logo.png" alt="Logo" className="w-16 h-16 object-contain" />
                                </motion.div>
                            </div>

                            {/* Marka İsmi */}
                            <motion.h1 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-[0.2em] mb-8 drop-shadow-lg text-center"
                            >
                                YTU KURDÎ
                            </motion.h1>
                            
                            {/* İlerleme Çubuğu ve Yazı */}
                            <div className="w-64">
                                <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
                                    <motion.span 
                                        animate={{ opacity: [0.5, 1, 0.5] }} 
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="text-yellow-500"
                                    >
                                        Tê Barkirin...
                                    </motion.span>
                                    <span>{Math.min(progress, 100)}%</span>
                                </div>
                                
                                {/* Bar */}
                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
                                    <motion.div 
                                        className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-yellow-400"
                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                        transition={{ ease: "linear" }}
                                    />
                                </div>
                                
                                {/* Alt Yazılar */}
                                <div className="flex justify-center gap-4 mt-3 text-[10px] text-slate-600 uppercase tracking-widest font-medium">
                                    <span>Yükleniyor</span>
                                    <span>•</span>
                                    <span>Loading</span>
                                </div>
                            </div>
                        </div>

                        {/* Alt Bilgi */}
                        <div className="absolute bottom-8 text-slate-700 text-[10px] font-mono tracking-widest opacity-50">
                            v1.0.0 &copy; 2025 ZANÎNGEHA YILDIZ TEKNÎK
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ANA UYGULAMA (Yükleme bitince Router devreye girer) */}
            {!showSplash && (
                <Router>
                    <ScrollToTop />
                    <Layout>
                        <Routes>
                            {/* Normal Sayfalar */}
                            <Route path="/" element={<Home />} />
                            <Route path="/cand" element={<Culture />} />
                            <Route path="/muzik" element={<Music />} />
                            <Route path="/huner" element={<Art />} />
                            <Route path="/dirok" element={<History />} />
                            <Route path="/ziman" element={<Language />} />
                            <Route path="/ferheng" element={<Dictionary />} /> 
                            <Route path="/galeri" element={<Gallery />} />
                            <Route path="/tekili" element={<Contact />} />
                            <Route path="/listik" element={<Listik />} />
                            <Route path="/agahdari" element={<Blog />} />
                            
                            {/* AUTHENTICATION (Login, Register, Forgot Password hepsi burada) */}
                            <Route path="/admin" element={<AuthPage />} />
                            
                            {/* KULLANICI PANELİ */}
                            <Route path="/user" element={<UserDashboard />} />

                            {/* ADMIN PANELİ - Sadece Rolü 'admin' Olanlar Girebilir */}
                            <Route path="/admin/dashboard" element={
                                <AdminPrivateRoute>
                                    <Dashboard />
                                </AdminPrivateRoute>
                            } />
                            
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Layout>
                </Router>
            )}
        </>
    );
};

// --- ANA UYGULAMA ---
function App() {
  return (
    <ErrorBoundary>
        {/* Tüm uygulama, Auth ve User Context'leri ile sarıldı */}
        <AuthProvider>
          <UserProvider>
            <LanguageProvider>
              <ThemeProvider>
                <AppContent />
              </ThemeProvider>
            </LanguageProvider>
          </UserProvider>
        </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;