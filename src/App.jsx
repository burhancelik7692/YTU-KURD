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
import Dictionary from "./pages/Dictionary"; 
import NotFound from "./pages/NotFound"; 
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery"; // Galeri
import ScrollToTop from "./components/ScrollToTop"; 
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext'; 
import "./index.css";

const Layout = ({ children }) => {
  const location = useLocation();
  const isGamePage = location.pathname === '/listik';

  return (
    <div className="app-container flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
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
      <ThemeProvider>
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
              <Route path="/listik" element={<Listik />} />
              <Route path="/galeri" element={<Gallery />} />
              <Route path="/tekili" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;