import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Delete, CornerDownLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WORDLE_DB } from '../../data/questions';

// Ayarlar
const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

const WordleGame = ({ onBack, lang }) => {
  const t = {
    KU: { title: 'Peyvê Bibîne', win: 'Te Serkeft! 🥳', lose: 'Te Windakir 😔', again: 'Dîsa Bilîze', back: 'Vegere', enter: 'BAŞ', del: 'JÊB', hint: 'Peyv 5 tîp e', meaning: 'Wate' },
    TR: { title: 'Kelimeyi Bul', win: 'Tebrikler! 🥳', lose: 'Kaybettin 😔', again: 'Tekrar', back: 'Dön', enter: 'GİR', del: 'SİL', hint: 'Kelime 5 harf', meaning: 'Anlamı' },
    EN: { title: 'Wordle', win: 'You Won! 🥳', lose: 'Game Over 😔', again: 'Again', back: 'Back', enter: 'ENT', del: 'DEL', hint: '5 chars', meaning: 'Meaning' }
  }[lang] || { title: 'Peyvê Bibîne' };

  const [target, setTarget] = useState({ word: "", meaning: "" });
  const [guesses, setGuesses] = useState(Array(MAX_GUESSES).fill(null));
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [status, setStatus] = useState(null);
  const [shakeRow, setShakeRow] = useState(false);

  useEffect(() => {
    if (WORDLE_DB && WORDLE_DB.length > 0) {
      const randomObj = WORDLE_DB[Math.floor(Math.random() * WORDLE_DB.length)];
      setTarget(randomObj);
    }
  }, []);

  const handleType = (char) => {
    if (isGameOver) return;
    if (char === 'ENTER') {
      if (currentGuess.length !== WORD_LENGTH) {
        setShakeRow(true); setTimeout(() => setShakeRow(false), 500); return;
      }
      const newGuesses = [...guesses];
      const idx = newGuesses.findIndex(v => v === null);
      newGuesses[idx] = currentGuess;
      setGuesses(newGuesses);
      
      if (currentGuess === target.word) { 
        setIsGameOver(true); setStatus('won'); confetti(); 
      } else if (idx === MAX_GUESSES - 1) { 
        setIsGameOver(true); setStatus('lost'); 
      }
      setCurrentGuess("");
      return;
    }
    if (char === 'DEL') { setCurrentGuess(prev => prev.slice(0, -1)); return; }
    if (currentGuess.length < WORD_LENGTH) setCurrentGuess(prev => prev + char);
  };

  const getKeyStatus = (key) => {
    let status = 'default';
    guesses.forEach((guess) => {
      if (!guess) return;
      for (let i = 0; i < WORD_LENGTH; i++) {
        if (guess[i] === key) {
          if (target.word[i] === key) return status = 'correct';
          if (target.word.includes(key) && status !== 'correct') status = 'present';
          if (!target.word.includes(key) && status === 'default') status = 'absent';
        }
      }
    });
    return status;
  };

  const keys = ["E R T Y U Û I Î O P", "A S D F G H J K L Ş", "Z C Ç V B N M W Ê"];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-2 font-sans w-full">
      <div className="w-full max-w-md flex justify-between items-center mb-4 px-2">
        <button onClick={onBack} className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition"><ArrowLeft /></button>
        <h1 className="text-xl font-bold text-yellow-500 tracking-wider">{t.title}</h1>
        <div className="w-10"></div>
      </div>

      <div className="grid grid-rows-6 gap-2 mb-4 p-3 bg-slate-800/50 rounded-2xl border border-slate-700">
        {guesses.map((guess, i) => {
          const isCurrent = i === guesses.findIndex(v=>v===null);
          return (
            <motion.div key={i} className="grid grid-cols-5 gap-2" animate={isCurrent && shakeRow ? { x: [-5, 5, -5, 5, 0] } : {}}>
              {Array.from({ length: WORD_LENGTH }).map((_, j) => {
                const letter = isCurrent ? currentGuess[j] : (guess ? guess[j] : "");
                let color = "bg-slate-800 border-slate-700";
                if (guess) {
                  if (letter === target.word[j]) color = "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/40";
                  else if (target.word.includes(letter)) color = "bg-yellow-500 border-yellow-500 text-black shadow-lg shadow-yellow-500/40";
                  else color = "bg-slate-600 border-slate-600 opacity-50";
                }
                return <div key={j} className={`w-10 h-10 md:w-12 md:h-12 border-2 flex items-center justify-center text-xl font-bold rounded-lg transition-all ${color}`}>{letter}</div>;
              })}
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {isGameOver && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="absolute z-50 bg-white text-slate-900 p-6 rounded-2xl shadow-2xl text-center border-4 border-yellow-500 max-w-xs">
            <h2 className="text-2xl font-bold mb-2">{status === 'won' ? t.win : t.lose}</h2>
            <p className="text-3xl font-black text-blue-600 mb-2 tracking-widest">{target.word}</p>
            <p className="text-sm font-medium text-slate-500 mb-4 bg-slate-100 p-2 rounded">{t.meaning}: {target.meaning}</p>
            <button onClick={() => window.location.reload()} className="w-full bg-blue-900 text-white px-4 py-3 rounded-xl font-bold hover:bg-blue-800 transition flex items-center justify-center gap-2"><RotateCcw size={18} /> {t.again}</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-md space-y-1.5 px-1">
        {keys.map((row, i) => (
          <div key={i} className="flex justify-center gap-1">
            {row.split(' ').map(char => {
              const status = getKeyStatus(char);
              let kCol = "bg-slate-700 text-white";
              if(status==='correct') kCol="bg-emerald-500"; 
              if(status==='present') kCol="bg-yellow-500 text-black";
              if(status==='absent') kCol="bg-slate-800 text-slate-500";
              return <button key={char} onClick={() => handleType(char)} className={`flex-1 h-11 rounded-md font-bold text-sm transition-all active:scale-90 ${kCol}`}>{char}</button>;
            })}
          </div>
        ))}
        <div className="flex justify-center gap-2 mt-2">
          <button onClick={() => handleType('ENTER')} className="flex-1 py-3 bg-emerald-600 rounded-xl font-bold text-white text-xs">{t.enter}</button>
          <button onClick={() => handleType('DEL')} className="flex-1 py-3 bg-rose-600 rounded-xl font-bold text-white text-xs">{t.del}</button>
        </div>
      </div>
    </motion.div>
  );
};

export default WordleGame;