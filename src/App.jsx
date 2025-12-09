import React from 'react';
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

// --- HATA YAKALAYICI (BEYAZ EKRAN SORUNU İÇİN) ---
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uygulama Hatası:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-6 text-center">
          <AlertTriangle size={64} className="text-red-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Bir şeyler ters gitti!</h1>
          <p className="text-slate-400 mb-6">Siteniz yüklenirken kritik bir hata oluştu.</p>
          <div className="bg-slate-800 p-4 rounded-lg text-left overflow-auto max-w-full w-full border border-red-500/30">
            <p className="text-red-400 font-mono text-sm">{this.state.error?.message}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition font-bold"
          >
            Sayfayı Yenile
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

// Korumalı Rota
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/admin" />;
};

const Layout = ({ children }) => {
  const location = useLocation();
  const isFullScreen = location.pathname === '/listik' || location.pathname.startsWith('/admin');

  return (
    <div className="app-container flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Helmet><title>YTU Kurdî</title></Helmet>
      {!isFullScreen && <Navigation />}
      <main className="flex-grow">{children}</main>
      {!isFullScreen && <Footer />}
    </div>
  );
};

const AppRoutes = () => {
    // Context'lerden veri çekerken hata olursa patlamaması için güvenli erişim
    const authContext = useAuth();
    const userContext = useUser();
    
    // Yüklenme durumlarını kontrol et
    const authLoading = authContext?.loading || false;
    const userLoading = userContext?.loading || false;

    // Yükleniyor Ekranı
    if (authLoading || userLoading) {
        return (
          <div className="flex items-center justify-center min-h-screen bg-slate-900">
            <div className="text-center">
                <Loader2 className="animate-spin text-yellow-500 mx-auto mb-4" size={50} />
                <p className="text-slate-400 animate-pulse">Yükleniyor...</p>
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
                    <Route path="/haberler" element={<Blog />} />
                    
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
                <AppRoutes />
              </ThemeProvider>
            </LanguageProvider>
          </UserProvider>
        </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;