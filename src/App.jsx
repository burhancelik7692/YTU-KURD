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
import { UserProvider } from './context/UserContext'; // YENİ EKLENDİ
import "./index.css";

// Korumalı Rota Bileşeni (Admin Girişi)
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
      
      {/* Admin ve Oyun sayfalarında Menü ve Footer gizlenir */}
      {!isFullScreen && <Navigation />}
      
      <main className="flex-grow">
        {children}
      </main>

      {!(isFullScreen || location.pathname.startsWith('/admin')) && <Footer />}
    </div>
  );
};

function App() {
  return (
    // UserProvider en dışta olmalı ki her şey ID'ye erişebilsin
    <UserProvider> 
      <AuthProvider>
        <LanguageProvider>
          <ThemeProvider>
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
                  <Route path="/haberler" element={<Blog />} />
                  
                  {/* Admin Sayfaları */}
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
          </ThemeProvider>
        </LanguageProvider>
      </AuthProvider>
    </UserProvider>
  );
}

export default App;