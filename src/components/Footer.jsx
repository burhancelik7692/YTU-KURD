import React from 'react';
import { Instagram, Youtube, Mail } from 'lucide-react'; // İkonları ekledik
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto text-center">
        
        {/* Logo ve Başlık */}
        <img src="/logo.png" alt="YTU Kurdî" className="w-20 h-20 mx-auto mb-6 rounded-full shadow-lg shadow-white/10" />
        <p className="text-lg mb-8 text-gray-300">Zanîngeha Yıldız Teknîk - Komeleya Kurdî</p>
        
        {/* --- SOSYAL MEDYA BUTONLARI (YAN YANA) --- */}
        <div className="mb-10 flex flex-wrap justify-center gap-4">
          
          {/* 1. INSTAGRAM BUTONU */}
          <a 
            href="https://instagram.com/ytukurdi" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-white/5 border border-white/10 px-5 py-3 rounded-full hover:bg-gradient-to-tr hover:from-[#833ab4] hover:via-[#fd1d1d] hover:to-[#fcb045] transition-all duration-500 group"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Instagram size={24} className="text-white" />
            </motion.div>
            <span className="font-bold tracking-wide">Instagram</span>
          </a>

          {/* 2. YOUTUBE BUTONU (Kırmızı Efekt) */}
          <a 
            href="https://www.youtube.com/channel/UCmj55cxwMKHvVgxhR1v7Ljg" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-white/5 border border-white/10 px-5 py-3 rounded-full hover:bg-red-600 transition-all duration-500 group"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} // Hafif gecikmeli animasyon
            >
              <Youtube size={24} className="text-white" />
            </motion.div>
            <span className="font-bold tracking-wide">YouTube</span>
          </a>

          {/* 3. MAIL BUTONU (Sarı/Mavi Efekt) */}
          <a 
            href="mailto:ytukurdidrive@gmail.com" 
            className="flex items-center space-x-2 bg-white/5 border border-white/10 px-5 py-3 rounded-full hover:bg-blue-600 transition-all duration-500 group"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }} // Hafif gecikmeli animasyon
            >
              <Mail size={24} className="text-white" />
            </motion.div>
            <span className="font-bold tracking-wide">E-Mail</span>
          </a>

        </div>
        {/* --- BÖLÜM SONU --- */}

        <div className="border-t border-gray-800 pt-8">
          <p className="text-gray-500 text-sm">© 2025 YTU Kurdî. Hemû mafên parastî ne.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;