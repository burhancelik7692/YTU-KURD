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
import { Loader2, AlertTriangle } from 'lucide-react';

// --- HATA YAKALAYICI ---
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
          <h1 className="text-2xl font-bold">Bir şeyler ters gitti!</h1>
          <p className="text-red-300 mt-2 p-4 bg-slate-800 rounded border border-red-500/30 font-mono text-sm">{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 font-bold transition">Sayfayı Yenile</button>
        </div>
      );
    }
    return this.props.children; 
  }
}

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/admin" />;
};

const Layout = ({ children }) => {
  const location = useLocation();
  const isFullScreen = location.pathname === '/listik' || location.pathname.startsWith('/admin');

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

// --- İÇERİK BİLEŞENİ ---
const AppContent = () => {
    const auth = useAuth();
    const user = useUser();
    
    // Veri yükleme durumu
    const authLoading = auth?.loading || false;
    const userLoading = user?.loading || false;
    
    // 2 Saniyelik Yapay Bekleme
    const [minTimePassed, setMinTimePassed] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMinTimePassed(true);
        }, 2000); // 2 saniye
        return () => clearTimeout(timer);
    }, []);

    // Yükleniyor Ekranı (Veriler gelmediyse VEYA 2 saniye dolmadıysa göster)
    if (authLoading || userLoading || !minTimePassed) {
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white z-50 fixed inset-0">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-yellow-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
                <Loader2 className="animate-spin text-yellow-500 relative z-10" size={64} />
            </div>
            
            {/* 3 Dilli Yükleme Yazısı */}
            <div className="flex flex-col items-center gap-2 font-medium tracking-wide animate-pulse">
                <span className="text-yellow-400 text-lg">Tê Barkirin...</span>
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

function App() {
  return (
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