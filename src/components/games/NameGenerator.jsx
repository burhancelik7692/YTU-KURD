import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Sparkles } from 'lucide-react';
import { KURDISH_NAMES } from '../../data/names';

const NameGenerator = ({ onBack, lang }) => {
  const t = {
    KU: { title: 'Navê Min Çi Ye?', input: 'Navê xwe binivîse', btn: 'Navê Min Bibîne', meaning: 'Wate', back: 'Vegere' },
    TR: { title: 'Kürtçe İsmim Ne?', input: 'Adını yaz', btn: 'İsmimi Bul', meaning: 'Anlamı', back: 'Geri Dön' },
    EN: { title: 'My Kurdish Name', input: 'Enter your name', btn: 'Find My Name', meaning: 'Meaning', back: 'Back' }
  }[lang] || { title: 'Navê Min Çi Ye?' };

  const [inputName, setInputName] = useState("");
  const [result, setResult] = useState(null);

  const generateName = () => {
    if (!inputName.trim()) return;
    const sum = inputName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = sum % KURDISH_NAMES.length;
    setResult(KURDISH_NAMES[index]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 w-full">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-200 relative">
        <button onClick={onBack} className="absolute top-4 left-4 text-slate-400 hover:text-blue-900"><ArrowLeft size={24} /></button>
        <div className="w-20 h-20 bg-purple-100 rounded-full mx-auto flex items-center justify-center mb-6 shadow-inner">
           <User size={40} className="text-purple-600" />
        </div>
        <h1 className="text-2xl font-black text-slate-800 mb-6">{t.title}</h1>
        
        {!result ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <input 
              type="text" 
              placeholder={t.input}
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="w-full p-4 rounded-xl border-2 border-slate-200 bg-slate-50 text-center text-lg font-bold focus:border-purple-500 focus:outline-none mb-4"
            />
            <button 
              onClick={generateName}
              disabled={!inputName.trim()}
              className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t.btn}
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
             <h2 className="text-lg text-slate-500 mb-2">Ji bo <span className="font-bold text-purple-600">{inputName}</span></h2>
             <div className="text-4xl font-black text-slate-800 mb-2">{result.name}</div>
             <div className="text-sm font-medium text-slate-500 bg-white p-2 rounded-lg inline-block shadow-sm">
               {t.meaning}: {result.meaning}
             </div>
             <button onClick={() => {setResult(null); setInputName("");}} className="block w-full mt-6 text-sm font-bold text-purple-600 hover:underline">{t.back}</button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NameGenerator;