import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, CheckCircle, XCircle, Play, Pause, Music as MusicIcon, Share2, Award, Clock, Trophy, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUIZ_DB } from '../../data/questions';

// Şık karıştırma fonksiyonu
const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const musicPlaylist = [
  { id: "sad", title: "Dil Perîşan im", artist: "Mihemed Şêxo", src: "https://kurds.io/wp-content/uploads/2025/11/Mihemed-Sexo-Dil-Perisanim-.mp3", start: 15 },
  { id: "mid", title: "Welatê Min", artist: "Ciwan Haco", src: "https://kurds.io/wp-content/uploads/2025/11/Ciwan-Haco-Welate-Min-.mp3", start: 25 },
  { id: "happy", title: "Keçê Kurdan", artist: "Aynur Doğan", src: "https://kurds.io/wp-content/uploads/2025/11/Aynur-Dogan-Kece-Kurdan-.mp3", start: 45 }
];

const CultureQuiz = ({ onBack, lang }) => {
  const t = {
    KU: { title: 'Testa YTU Kurdî', diff: 'Asta Zehmetiyê', easy: 'Hêsan', medium: 'Navîn', hard: 'Zehmet', start: 'Dest Pê Bike', q: 'Pirs', result: 'Encam', restart: 'Ji Nû Ve', music: 'Muzîk', play: 'Bilîze', cat: 'Kategorî', next: 'Pirsê Din' },
    TR: { title: 'YTU Kurdî Testi', diff: 'Zorluk Seviyesi', easy: 'Kolay', medium: 'Orta', hard: 'Zor', start: 'Başla', q: 'Soru', result: 'Sonuç', restart: 'Tekrar', music: 'Müzik', play: 'Oyna', cat: 'Kategori', next: 'Sonraki Soru' },
    EN: { title: 'YTU Quiz', diff: 'Difficulty', easy: 'Easy', medium: 'Medium', hard: 'Hard', start: 'Start', q: 'Q', result: 'Result', restart: 'Restart', music: 'Music', play: 'Play', cat: 'Category', next: 'Next Question' }
  }[lang] || { title: 'Testa YTU Kurdî' };

  const [screen, setScreen] = useState('diff');
  const [difficulty, setDifficulty] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const audioRef = useRef(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);

  const stopMusic = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  useEffect(() => { return () => stopMusic(); }, []);

  const startGame = (diff, catId) => {
    stopMusic();
    let pool = QUIZ_DB.filter(q => q.difficulty === diff);
    if (catId && catId !== 'mix') {
      const catMap = { 'dirok': 'Dîrok', 'weje': 'Wêje', 'ziman': 'Ziman', 'folklor': 'Folklor' };
      const targetCat = catMap[catId] || catId;
      pool = pool.filter(q => q.category === targetCat);
    }
    if(pool.length === 0) pool = QUIZ_DB.filter(q => q.difficulty === diff);
    if(pool.length === 0) return alert("Pirs tune / Soru yok");
    
    // Şıkları karıştır
    const selectedQuestions = pool.sort(() => 0.5 - Math.random()).slice(0, 10).map(q => ({
      ...q,
      options: shuffleArray([...q.options])
    }));
    
    setQuestions(selectedQuestions);
    setScore(0);
    setIndex(0);
    setScreen('play');
    setTimeLeft(15);
    setSelectedAnswerIndex(null);
  };

  useEffect(() => {
    if (screen === 'play' && timeLeft > 0 && selectedAnswerIndex === null) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && selectedAnswerIndex === null) {
      setSelectedAnswerIndex(-1);
    }
  }, [screen, timeLeft, selectedAnswerIndex]);

  const handleAnswer = (points, idx) => {
    if (selectedAnswerIndex !== null) return;
    setSelectedAnswerIndex(idx);
    setScore(score + points);
    if(points > 0) confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 }, colors: ['#fbbf24', '#1e3a8a'] });
  };

  const nextQuestion = () => {
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setSelectedAnswerIndex(null);
      setTimeLeft(15);
    } else {
      setScreen('result');
      playResultMusic(score);
    }
  };

  const playResultMusic = (finalScore) => {
    const totalMax = questions.length * 10;
    const percentage = (finalScore / totalMax) * 100;
    let mood = 'mid';
    if (percentage >= 80) mood = 'happy';
    else if (percentage < 50) mood = 'sad';
    const tracks = musicPlaylist.filter(t => t.id === mood);
    const track = tracks[Math.floor(Math.random() * tracks.length)] || musicPlaylist[0];
    setCurrentTrack(track);
    audioRef.current.src = track.src;
    audioRef.current.currentTime = track.start;
    audioRef.current.volume = 0.5;
    audioRef.current.play().catch(e => console.log("Oto-oynatma engellendi"));
    setIsPlaying(true);
  };

  const toggleMusic = () => {
    if (isPlaying) audioRef.current.pause(); else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  // EKRANLAR
  if (screen === 'diff') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-200 relative overflow-hidden text-center">
          <button onClick={() => {stopMusic(); onBack();}} className="absolute top-4 left-4 text-slate-400 hover:text-blue-900"><ArrowLeft size={24} /></button>
          <div className="h-2 w-full bg-gradient-to-r from-blue-900 via-blue-500 to-yellow-500 absolute top-0 left-0"></div>
          <div className="mt-6 mb-4"><img src="/logo.png" alt="YTU Kurdî" className="w-24 h-24 mx-auto rounded-full shadow-lg border-4 border-white animate-[spin_20s_linear_infinite]" /></div>
          <h1 className="text-2xl font-black text-blue-900 mb-2">{t.title}</h1>
          <p className="text-slate-500 text-sm mb-8">Dîrok, Wêje, Ziman û Çand</p>
          <div className="space-y-3">
            {[1, 2, 3].map(lvl => (
              <button key={lvl} onClick={() => { setDifficulty(lvl); setScreen('category'); }} className="w-full p-4 rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-between group">
                <span className="font-bold text-slate-700 group-hover:text-blue-900">{lvl === 1 ? t.easy : (lvl === 2 ? t.medium : t.hard)}</span>
                <div className="flex text-yellow-500">{[...Array(lvl)].map((_, i) => <Award key={i} size={16} fill="currentColor" />)}</div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (screen === 'category') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 border border-slate-200 relative text-center">
          <button onClick={() => setScreen('diff')} className="absolute top-4 left-4 text-slate-400 hover:text-blue-900"><ArrowLeft size={24} /></button>
          <img src="/logo.png" alt="Logo" className="w-12 h-12 mx-auto mb-2 rounded-full" />
          <h2 className="text-2xl font-bold text-blue-900 mb-6">{t.cat}</h2>
          <div className="grid grid-cols-2 gap-4">
            {[{id:'dirok', label:'Dîrok', icon:'🏛️'}, {id:'weje', label:'Wêje', icon:'📚'}, {id:'ziman', label:'Ziman', icon:'🗣️'}, {id:'folklor', label:'Folklor', icon:'🎶'}].map(c => (
              <button key={c.id} onClick={() => startGame(difficulty, c.id)} className="p-6 rounded-2xl bg-blue-50 hover:bg-blue-100 hover:scale-105 transition-transform flex flex-col items-center gap-2 border border-blue-100">
                <span className="text-3xl">{c.icon}</span><span className="font-bold text-blue-900">{c.label}</span>
              </button>
            ))}
          </div>
          <button onClick={() => startGame(difficulty, 'mix')} className="w-full mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-900 to-blue-700 text-white font-bold shadow-lg hover:shadow-blue-900/30">Tevlihev 🎲</button>
        </div>
      </motion.div>
    );
  }

  if (screen === 'play') {
    const q = questions[index];
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 relative overflow-hidden">
          <div className="h-2 w-full bg-slate-100">
            <motion.div initial={{ width: "100%" }} animate={{ width: `${(timeLeft / 15) * 100}%` }} transition={{ ease: "linear", duration: 1 }} className={`h-full ${timeLeft < 5 ? 'bg-red-500' : 'bg-yellow-500'}`}></motion.div>
          </div>
          <div className="p-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2"><img src="/logo.png" className="w-6 h-6 rounded-full" /><span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.q} {index+1} / {questions.length}</span></div>
              <div className="flex items-center gap-1 text-slate-600 font-bold bg-slate-100 px-3 py-1 rounded-full text-xs"><Clock size={14} /> {timeLeft}s</div>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-8 leading-snug min-h-[4rem]">{q.question}</h2>
            <div className="space-y-3">
              {q.options.map((opt, i) => {
                const isSelected = selectedAnswerIndex === i;
                const isCorrectOption = opt.points > 0;
                let style = "border-2 border-slate-100 hover:border-blue-200 hover:bg-slate-50";
                if (selectedAnswerIndex !== null) {
                  if (isCorrectOption) style = "bg-green-100 border-green-500 text-green-800 font-bold shadow-md transform scale-[1.02]";
                  else if (isSelected && !isCorrectOption) style = "bg-red-100 border-red-500 text-red-800 font-bold";
                  else style = "opacity-40 border-slate-100 grayscale";
                }
                return (
                  <button key={i} disabled={selectedAnswerIndex !== null} onClick={() => handleAnswer(opt.points, i)} className={`w-full p-4 rounded-xl text-left font-semibold transition-all flex justify-between items-center ${style}`}>
                    {opt.text}
                    {selectedAnswerIndex !== null && isCorrectOption && <CheckCircle size={18} className="text-green-600" />}
                    {selectedAnswerIndex !== null && isSelected && !isCorrectOption && <XCircle size={18} className="text-red-500" />}
                  </button>
                );
              })}
            </div>
            <AnimatePresence>
              {selectedAnswerIndex !== null && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                  <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-xl mb-4"><p className="text-sm text-blue-900"><strong>ℹ️</strong> {q.explanation}</p></div>
                  <button onClick={nextQuestion} className="w-full py-4 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 flex items-center justify-center gap-2 shadow-lg transition-all">{t.next} <ChevronRight size={20} /></button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'result') {
    const percentage = Math.round((score / (questions.length * 10)) * 100);
    return (
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center border-t-8 border-yellow-500 relative">
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2"><img src="/logo.png" className="w-20 h-20 rounded-full border-4 border-white shadow-xl" /></div>
          <div className="mt-8">
            <h2 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">{t.result}</h2>
            <div className="text-6xl font-black text-blue-900 mb-2">%{percentage}</div>
            <p className="text-slate-500 text-sm mb-6">{percentage > 50 ? "Serkeftin!" : "Dîsa biceribîne."}</p>
            <div className="flex items-center gap-3 bg-slate-100 p-4 rounded-2xl mb-6 shadow-inner border border-slate-200">
              <button onClick={toggleMusic} className="w-12 h-12 bg-blue-900 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition shadow-lg shrink-0">{isPlaying ? <Pause size={20} /> : <Play size={20} />}</button>
              <div className="text-left overflow-hidden w-full">
                {currentTrack ? (<><div className="text-sm font-bold text-blue-900 truncate">{currentTrack.title}</div><div className="text-xs text-slate-500 truncate">{currentTrack.artist}</div></>) : (<div className="text-xs text-slate-400">Loading...</div>)}
              </div>
              <MusicIcon size={20} className="text-slate-400 ml-auto shrink-0" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => {stopMusic(); setScreen('diff');}} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 flex items-center justify-center gap-2 transition"><RotateCcw size={18}/> {t.restart}</button>
              <button onClick={() => {stopMusic(); onBack();}} className="flex-1 py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 flex items-center justify-center gap-2 transition shadow-lg shadow-blue-900/20"><ArrowLeft size={18}/> {t.back}</button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
  return null;
};

export default CultureQuiz;