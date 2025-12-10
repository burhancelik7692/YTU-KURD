import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
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

// Admin Sayfaları
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";

import ScrollToTop from "./components/ScrollToTop"; 
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext'; 
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserProvider, useUser } from './context/UserContext'; 

import "./index.css";
import { Loader2, AlertTriangle, XCircle } from 'lucide-react';

// =========================================================
// 🚨 GELİŞMİŞ HATA YAKALAYICI (GLOBAL ERROR BOUNDARY)
// =========================================================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uygulama Çöktü:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh',
          backgroundColor: '#1a1a1a', color: '#ff4d4d', zIndex: 9999,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '20px', fontFamily: 'monospace', overflow: 'auto'
        }}>
          <div style={{ maxWidth: '800px', width: '100%', backgroundColor: '#2a2a2a', padding: '30px', borderRadius: '15px', border: '2px solid #ff4d4d', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', borderBottom: '1px solid #444', paddingBottom: '15px' }}>
                <AlertTriangle size={40} />
                <h1 style={{ margin: 0, fontSize: '24px', color: '#fff' }}>Uygulama Hatası (Crash)</h1>
            </div>
            
            <h2 style={{ fontSize: '18px', color: '#ff8080', marginBottom: '10px' }}>Hata Mesajı:</h2>
            <div style={{ backgroundColor: '#000', padding: '15px', borderRadius: '8px', marginBottom: '20px', color: '#fff', border: '1px solid #ff4d4d' }}>
              {this.state.error && this.state.error.toString()}
            </div>

            <h2 style={{ fontSize: '18px', color: '#ff8080', marginBottom: '10px' }}>Hata Yeri (Stack Trace):</h2>
            <div style={{ backgroundColor: '#000', padding: '15px', borderRadius: '8px', maxHeight: '200px', overflowY: 'auto', fontSize: '12px', color: '#ccc', whiteSpace: 'pre-wrap' }}>
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button 
                    onClick={() => window.location.reload()} 
                    style={{ padding: '12px 24px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
                >
                    Sayfayı Yenile
                </button>
                <button 
                    onClick={() => window.location.href = '/'} 
                    style={{ padding: '12px 24px', backgroundColor: '#444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
                >
                    Ana Sayfaya Dön
                </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children; 
  }
}

// --- KORUMALI ROTA ---
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/admin" />;
};

// --- SAYFA DÜZENİ ---
const Layout = ({ children }) => {
  const location = useLocation();
  const isFullScreen = location.pathname.startsWith('/admin');

  return (
    <div className="app-container flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Helmet>
        <title>{"YTU Kurdî"}</title>
      </Helmet>
      
      {!isFullScreen && <Navigation />}
      <main className="flex-grow">{children}</main>
      {!isFullScreen && <Footer />}
    </div>
  );
};

// --- İÇERİK VE YÖNLENDİRME ---
const AppContent = () => {
    const auth = useAuth();
    const user = useUser();
    
    // Auth ve User verilerinin yüklenme durumu
    // Hata almamak için opsiyonel zincirleme (?.) kullanıyoruz
    const authLoading = auth?.loading || false;
    const userLoading = user?.loading || false;
    
    // 2 Saniyelik Zorunlu Bekleme
    const [minTimePassed, setMinTimePassed] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMinTimePassed(true);
        }, 2000); // 2000ms = 2 Saniye
        return () => clearTimeout(timer);
    }, []);

    // Yükleniyor Ekranı
    if (authLoading || userLoading || !minTimePassed) {
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white z-50 fixed inset-0">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-yellow-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
                <Loader2 className="animate-spin text-yellow-500 relative z-10" size={64} />
            </div>
            
            <div className="flex flex-col items-center gap-2 font-medium tracking-wide animate-pulse">
                <span className="text-yellow-400 text-lg font-bold">Tê Barkirin...</span>
                <span className="text-slate-400 text-sm">Yükleniyor...</span>
                <span className="text-slate-500 text-xs">Loading...</span>
            </div>
          </div>
        );
    }

    return (
        <Router>
            <ScrollToTop />
            <Layout>
                <Routes>
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
                    
                    <Route path="/admin" element={<Login />} />
                    <Route path="/admin/dashboard" element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } />
                    
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Layout>
        </Router>
    );
};

// --- ANA UYGULAMA ---
function App() {
  return (
    // ErrorBoundary'yi en dışa koyduk ki Context hatalarını da yakalasın
    <ErrorBoundary>
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