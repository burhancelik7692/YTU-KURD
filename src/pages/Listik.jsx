import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Library, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Yeni bileşenleri çağırıyoruz
import WordleGame from '../components/games/WordleGame';
import CultureQuiz from '../components/games/CultureQuiz';
import NameGenerator from '../components/games/NameGenerator';

const Listik = () => {
  const { lang } = useLanguage();
  const [activeGame, setActiveGame] = useState(null);

  const t = {
    KU: { title: 'Lîstikên Me', sub: 'Hêviya me ew e ku hûn kêfxweş bibin', wordle: 'Peyvê Bibîne', quiz: 'Testa YTU Kurdî', name: 'Navê Min Çi Ye?', play: 'Bilîze' },
    TR: { title: 'Oyunlarımız', sub: 'Keyifli vakit geçirmeniz dileğiyle', wordle: 'Kelimeyi Bul', quiz: 'YTU Kurdî Testi', name: 'Kürtçe İsmim Ne?', play: 'Oyna' },
    EN: { title: 'Our Games', sub: 'Have fun!', wordle: 'Wordle', quiz: 'Culture Quiz', name: 'My Kurdish Name', play: 'Play' }
  }[lang] || { title: 'Lîstikên Me' };

  if (activeGame === 'wordle') return <WordleGame onBack={() => setActiveGame(null)} lang={lang} />;
  if (activeGame === 'quiz') return <CultureQuiz onBack={() => setActiveGame(null)} lang={lang} />;
  if (activeGame === 'name') return <NameGenerator onBack={() => setActiveGame(null)} lang={lang} />;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 px-4 pb-12 w-full">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-blue-900 mb-3 tracking-tight">{t.title}</h1>
          <p className="text-slate-500 text-lg font-medium">{t.sub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <motion.div whileHover={{ y: -5 }} className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 flex flex-col items-center text-center group cursor-pointer hover:shadow-2xl transition-all" onClick={() => setActiveGame('wordle')}>
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
              <Gamepad2 size={40} className="text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">{t.wordle}</h2>
            <button className="w-full py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg mt-auto">{t.play}</button>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 flex flex-col items-center text-center group cursor-pointer hover:shadow-2xl transition-all" onClick={() => setActiveGame('quiz')}>
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
              <Library size={40} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">{t.quiz}</h2>
            <button className="w-full py-2 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-lg mt-auto">{t.play}</button>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 flex flex-col items-center text-center group cursor-pointer hover:shadow-2xl transition-all" onClick={() => setActiveGame('name')}>
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
              <Sparkles size={40} className="text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">{t.name}</h2>
            <button className="w-full py-2 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors shadow-lg mt-auto">{t.play}</button>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Listik;