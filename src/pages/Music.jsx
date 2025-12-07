import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Music as MusicIcon, Play, Pause } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { siteContent } from '../data/locales';

const Music = () => {
  const { lang } = useLanguage();
  
  // 1. ADIM: Veritabanından (locales.js) 'muzik' kısmını çekiyoruz
  // Veri yoksa hata vermemesi için boş obje {} kontrolü
  const content = siteContent[lang]?.pages?.muzik || { 
    title: "Muzîk", 
    desc: "Loading...", 
    sections: [] 
  };

  // Müzik sayfası için ufak bir örnek oynatma listesi (Sabit Veri)
  // Bu kısım sayfa boş kalmasın diye eklendi
  const sampleTracks = [
    { title: "Keçê Kurdan", artist: "Aynur Doğan" },
    { title: "Xanima Min", artist: "Şivan Perwer" },
    { title: "Welatê Min", artist: "Ciwan Haco" },
    { title: "Eman Dilo", artist: "Mihemed Şêxo" }
  ];

  return (
    <>
      {/* SEO Ayarları */}
      <Helmet>
        <title>{content.title} - YTU Kurdî</title>
        <meta name="description" content={content.desc} />
      </Helmet>

      <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Geri Dön Butonu */}
          <Link to="/" className="inline-flex items-center text-slate-500 hover:text-blue-900 mb-6 transition group">
            <ArrowLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" /> 
            {lang === 'KU' ? 'Vegere' : (lang === 'TR' ? 'Geri' : 'Back')}
          </Link>
          
          {/* Ana İçerik Kartı */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100"
          >
            {/* Başlık Kısmı (Indigo Tema) */}
            <div className="bg-indigo-600 p-8 md:p-12 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                  <MusicIcon size={32} className="text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">{content.title}</h1>
                <p className="text-indigo-100 text-lg md:text-xl font-medium max-w-2xl">{content.desc}</p>
              </div>
              
              {/* Dekoratif Arka Plan Şekilleri */}
              <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
              <div className="absolute left-0 bottom-0 w-32 h-32 bg-black opacity-5 rounded-full -ml-10 -mb-10 pointer-events-none"></div>
            </div>

            {/* İçerik Döngüsü (Veritabanından Gelen Yazılar) */}
            <div className="p-8 md:p-12 space-y-10">
              {content.sections && content.sections.map((section, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="border-l-4 border-indigo-500 pl-6 py-1 group hover:bg-indigo-50/50 rounded-r-xl transition-colors"
                >
                  <h2 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-indigo-700 transition-colors">
                    {section.title}
                  </h2>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {section.text}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Örnek Şarkılar Listesi (Görsel Amaçlı) */}
            <div className="bg-slate-50 p-8 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                <Play size={20} className="text-indigo-600" /> 
                {lang === 'KU' ? 'Stranên Gelêrî' : 'Popüler Şarkılar'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sampleTracks.map((track, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">{i+1}</div>
                    <div>
                      <div className="font-bold text-slate-800 text-sm">{track.title}</div>
                      <div className="text-xs text-slate-500">{track.artist}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Music;