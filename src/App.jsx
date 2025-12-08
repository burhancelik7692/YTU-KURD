import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Culture from "./pages/Culture"; 
import Music from "./pages/Music";
import Art from "./pages/Art";
import History from "./pages/History"; 
import Language from "./pages/Language";
import Listik from "./pages/Listik"; 
import Dictionary from "./pages/Dictionary"; // Sözlük eklendi
import NotFound from "./pages/NotFound";     // 404 eklendi
import ScrollToTop from "./components/ScrollToTop"; 
import { LanguageProvider } from './context/LanguageContext';
import "./index.css";

// Layout Bileşeni: Sayfaya göre Menü/Footer gösterip gizlemeye karar verir
const Layout = ({ children }) => {
  const location = useLocation();
  
  // Oyun sayfasında (/listik) menü ve footer gizlensin
  const isGamePage = location.pathname === '/listik';

  return (
    <div className="app-container flex flex-col min-h-screen">
      <Helmet>
        <title>YTU Kurdî</title>
      </Helmet>
      
      {/* Oyun sayfası DEĞİLSE (!isGamePage), Navigasyonu göster */}
      {!isGamePage && <Navigation />}
      
      {/* İçerik Alanı */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Oyun sayfası DEĞİLSE Footer'ı göster */}
      {!isGamePage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <Router>
        <ScrollToTop /> {/* Sayfa değişince en üste kaydırır */}
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cand" element={<Culture />} />
            <Route path="/muzik" element={<Music />} />
            <Route path="/huner" element={<Art />} />
            <Route path="/dirok" element={<History />} />
            <Route path="/ziman" element={<Language />} />
            <Route path="/ferheng" element={<Dictionary />} />
            <Route path="/listik" element={<Listik />} />
            
            {/* EN SONA BU SATIRI KOYUYORUZ (404 İÇİN) */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </LanguageProvider>
  );
}

export default App;