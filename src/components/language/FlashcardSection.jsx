import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ChevronRight, ChevronLeft, Layers } from 'lucide-react';

const CARDS = [
  { ku: 'Rojbaş', tr: 'Günaydın' },
  { ku: 'Spas', tr: 'Teşekkürler' },
  { ku: 'Evîn', tr: 'Aşk' },
  { ku: 'Azadî', tr: 'Özgürlük' },
  { ku: 'Heval', tr: 'Arkadaş' },
  { ku: 'Xwendekar', tr: 'Öğrenci' },
  { ku: 'Mamoste', tr: 'Öğretmen' },
  { ku: 'Dibistan', tr: 'Okul' },
  { ku: 'Zanîngeh', tr: 'Üniversite' },
  { ku: 'Pirtûk', tr: 'Kitap' }
];

const FlashcardSection = ({ lang }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => (prev + 1) % CARDS.length), 200);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => (prev - 1 + CARDS.length) % CARDS.length), 200);
  };

  const currentCard = CARDS[currentIndex];

  return (
    <section className="py-12 bg-blue-50 dark:bg-slate-800/50 rounded-3xl my-12 relative overflow-hidden">
      {/* Arka Plan Dekoru */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>

      <div className="max-w-md mx-auto px-6 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full text-sm font-bold mb-2">
            <Layers size={16} />
            <span>{lang === 'KU' ? 'Kartên Hînbûnê' : 'Dil Kartları'}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {lang === 'KU' ? 'Peyvan Ezber Bike' : 'Kelimeleri Ezberle'}
          </h2>
        </div>

        {/* Kart Alanı */}
        <div className="perspective-1000 h-64 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
          <motion.div
            className="relative w-full h-full preserve-3d transition-all duration-500"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
          >
            {/* Ön Yüz (Kürtçe) */}
            <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl flex flex-col items-center justify-center text-white border-4 border-white/20">
              <span className="text-xs uppercase tracking-widest opacity-70 mb-2">Kurdî</span>
              <h3 className="text-4xl font-black">{currentCard.ku}</h3>
              <p className="absolute bottom-4 text-xs opacity-50 flex items-center gap-1">
                <RefreshCw size={12} /> {lang === 'KU' ? 'Ji bo wateyê bitikîne' : 'Çeviri için tıkla'}
              </p>
            </div>

            {/* Arka Yüz (Türkçe) */}
            <div className="absolute inset-0 backface-hidden bg-white dark:bg-slate-700 rounded-2xl shadow-xl flex flex-col items-center justify-center text-slate-800 dark:text-white border-4 border-blue-600 dark:border-blue-500" style={{ transform: 'rotateY(180deg)' }}>
              <span className="text-xs uppercase tracking-widest text-slate-400 mb-2">Tirkî</span>
              <h3 className="text-3xl font-bold">{currentCard.tr}</h3>
            </div>
          </motion.div>
        </div>

        {/* Kontroller */}
        <div className="flex items-center justify-between mt-8">
          <button onClick={handlePrev} className="p-3 rounded-full bg-white dark:bg-slate-700 shadow-md text-slate-600 dark:text-white hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <span className="text-sm font-bold text-slate-400">
            {currentIndex + 1} / {CARDS.length}
          </span>
          <button onClick={handleNext} className="p-3 rounded-full bg-white dark:bg-slate-700 shadow-md text-slate-600 dark:text-white hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FlashcardSection;