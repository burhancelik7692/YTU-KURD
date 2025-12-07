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
import ScrollToTop from "./components/ScrollToTop"; // YENİ EKLENDİ
import { LanguageProvider } from './context/LanguageContext';
import "./index.css";

const Layout = ({ children }) => {
  const location = useLocation();
  const isGamePage = location.pathname === '/listik';

  return (
    <div className="app-container flex flex-col min-h-screen">
      <Helmet>
        <title>YTU Kurdî</title>
      </Helmet>
      
      {!isGamePage && <Navigation />}
      
      <main className="flex-grow">
        {children}
      </main>

      {!isGamePage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <Router>
        <ScrollToTop /> {/* ARTIK SAYFA DEĞİŞİNCE YUKARI KAYACAK */}
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cand" element={<Culture />} />
            <Route path="/muzik" element={<Music />} />
            <Route path="/huner" element={<Art />} />
            <Route path="/dirok" element={<History />} />
            <Route path="/ziman" element={<Language />} />
            <Route path="/listik" element={<Listik />} />
          </Routes>
        </Layout>
      </Router>
    </LanguageProvider>
  );
}

export default App;