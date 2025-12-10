import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Library, Sparkles, ArrowLeft, Trophy } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Oyun Bileşenlerini Çağırıyoruz
import WordleGame from '../components/games/WordleGame';
import CultureQuiz from '../components/games/CultureQuiz';
import NameGenerator from '../components/games/NameGenerator';

const Listik = () => {
  const { lang } = useLanguage();
  const [activeGame, setActiveGame] = useState(null);

  const t = {
    KU: { 
      title: 'Lîstikên Me', 
      sub: 'Hîn bibe, bilîze û kêfê bike.', 
      wordle: 'Peyvê Bibîne', wordleDesc: 'Peyva veşartî texmîn bike.',
      quiz: 'Testa Çandê', quizDesc: 'Zanîna xwe bipîve.',
      name: 'Navê Min Çi Ye?', nameDesc: 'Navekî kurdî hilbijêre.',
      play: 'Bilîze', back: 'Vegere Lîstikan'
    },
    TR: { 
      title: 'Oyun Alanı', 
      sub: 'Öğren, oyna ve eğlen.', 
      wordle: 'Kelime Avı', wordleDesc: 'Gizli kelimeyi tahmin et.',
      quiz: 'Kültür Testi', quizDesc: 'Bilgini ölç.',
      name: 'Kürtçe İsmim Ne?', nameDesc: 'Kendine Kürtçe isim seç.',
      play: 'Oyna', back: 'Oyunlara Dön'
    },
    EN: { 
      title: 'Game Zone', 
      sub: 'Learn, play and enjoy.', 
      wordle: 'Wordle', wordleDesc: 'Guess the hidden word.',
      quiz: 'Culture Quiz', quizDesc: 'Test your knowledge.',
      name: 'My Kurdish Name', nameDesc: 'Pick a Kurdish name.',
      play: 'Play', back: 'Back to Games'
    }
  }[lang] || { title: 'Lîstikên Me' };

  // Oyun Seçilince Gösterilecek Ekran
  if (activeGame) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setActiveGame(null)} 
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 font-bold transition-colors"
          >
            <ArrowLeft size={20} /> {t.back}
          </button>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {activeGame === 'wordle' && <WordleGame lang={lang} />}
            {activeGame === 'quiz' && <CultureQuiz lang={lang} />}
            {activeGame === 'name' && <NameGenerator lang={lang} />}
          </motion.div>
        </div>
      </div>
    );
  }

  // Ana Menü
  return (
    <>
      <Helmet><title>{t.title} - YTU Kurdî</title></Helmet>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          
          {/* HERO */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-8 md:p-16 text-center overflow-hidden shadow-2xl mb-16"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20"></div>

            <div className="relative z-10">
              <div className="inline-block p-4 bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/10 shadow-lg">
                <Gamepad2 size={48} className="text-yellow-400" />
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">{t.title}</h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">{t.sub}</p>
            </div>
          </motion.div>

          {/* OYUN KARTLARI */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* 1. Kelime Oyunu */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center group cursor-pointer relative overflow-hidden"
              onClick={() => setActiveGame('wordle')}
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform shadow-inner">
                <Gamepad2 size={40} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{t.wordle}</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8">{t.wordleDesc}</p>
              <button className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg mt-auto flex items-center justify-center gap-2">
                {t.play}
              </button>
            </motion.div>

            {/* 2. Quiz */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center group cursor-pointer relative overflow-hidden"
              onClick={() => setActiveGame('quiz')}
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-blue-500"></div>
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform shadow-inner">
                <Library size={40} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{t.quiz}</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8">{t.quizDesc}</p>
              <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg mt-auto flex items-center justify-center gap-2">
                {t.play}
              </button>
            </motion.div>

            {/* 3. İsim Üretici */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center group cursor-pointer relative overflow-hidden"
              onClick={() => setActiveGame('name')}
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-purple-500"></div>
              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform shadow-inner">
                <Sparkles size={40} className="text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{t.name}</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8">{t.nameDesc}</p>
              <button className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors shadow-lg mt-auto flex items-center justify-center gap-2">
                {t.play}
              </button>
            </motion.div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Listik;