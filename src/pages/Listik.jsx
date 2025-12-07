import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, RotateCcw, Delete, CornerDownLeft, HelpCircle, 
  Gamepad2, Library, CheckCircle, XCircle, Play, Pause, Music as MusicIcon, Share2,
  Award, Clock, Trophy, ChevronRight, AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti'; 
import { useLanguage } from '../context/LanguageContext';
// Veritabanı importu
import { WORDLE_DB, QUIZ_DB } from '../data/questions';

// --- YARDIMCI FONKSİYON: ŞIK KARIŞTIRMA ---
// Bu fonksiyon bir diziyi (şıklar) alır ve rastgele karıştırır
const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

// --- MÜZİK LİSTESİ ---
const musicPlaylist = [
  { id: "sad", title: "Dil Perîşan im", artist: "Mihemed Şêxo", src: "https://kurds.io/wp-content/uploads/2025/11/Mihemed-Sexo-Dil-Perisanim-.mp3", start: 15 },
  { id: "mid", title: "Welatê Min", artist: "Ciwan Haco", src: "https://kurds.io/wp-content/uploads/2025/11/Ciwan-Haco-Welate-Min-.mp3", start: 25 },
  { id: "happy", title: "Keçê Kurdan", artist: "Aynur Doğan", src: "https://kurds.io/wp-content/uploads/2025/11/Aynur-Dogan-Kece-Kurdan-.mp3", start: 45 }
];

// ==========================================
// 1. WORDLE OYUNU
// ==========================================
const WordleGame = ({ onBack, lang }) => {
  const t = {
    KU: { title: 'Peyvê Bibîne', win: 'Te Serkeft! 🥳', lose: 'Te Windakir 😔', again: 'Dîsa Bilîze', back: 'Vegere', enter: 'BAŞ', del: 'JÊB', hint: 'Peyv 5 tîp e', meaning: 'Wate' },
    TR: { title: 'Kelimeyi Bul', win: 'Tebrikler! 🥳', lose: 'Kaybettin 😔', again: 'Tekrar', back: 'Dön', enter: 'GİR', del: 'SİL', hint: 'Kelime 5 harf', meaning: 'Anlamı' },
    EN: { title: 'Wordle', win: 'You Won! 🥳', lose: 'Game Over 😔', again: 'Again', back: 'Back', enter: 'ENT', del: 'DEL', hint: '5 chars', meaning: 'Meaning' }
  }[lang] || { title: 'Peyvê Bibîne' };

  const [target, setTarget] = useState({ word: "", meaning: "" });
  const [guesses, setGuesses] = useState(Array(6).fill(null));
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
      if (currentGuess.length !== 5) {
        setShakeRow(true); setTimeout(() => setShakeRow(false), 500); return;
      }
      const newGuesses = [...guesses];
      const idx = newGuesses.findIndex(v => v === null);
      newGuesses[idx] = currentGuess;
      setGuesses(newGuesses);
      
      if (currentGuess === target.word) { 
        setIsGameOver(true); setStatus('won'); confetti(); 
      } else if (idx === 5) { 
        setIsGameOver(true); setStatus('lost'); 
      }
      setCurrentGuess("");
      return;
    }
    if (char === 'DEL') { setCurrentGuess(prev => prev.slice(0, -1)); return; }
    if (currentGuess.length < 5) setCurrentGuess(prev => prev + char);
  };

  const getKeyStatus = (key) => {
    let status = 'default';
    guesses.forEach((guess) => {
      if (!guess) return;
      for (let i = 0; i < 5; i++) {
        if (guess[i] === key) {
          if (target.word[i] === key) return status = 'correct';
          if (target.word.includes(key) && status !== 'correct') status = 'present';
          if (!target.word.includes(key) && status === 'default') status = 'absent';
        }
      }
    });
    return status;
  };

  const keys = ["E R T Y U Û I Î O P", "A S D F G H J K L Ş", "Z C Ç V B N M Ê"];

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
              {Array.from({ length: 5 }).map((_, j) => {
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

// ==========================================
// 2. KÜLTÜR TESTİ (GELİŞMİŞ ŞIK KARIŞTIRMALI VE DÜZELTİLMİŞ)
// ==========================================
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
  
  // Müzik için useRef kullanımı (GARANTİ ÇÖZÜM)
  // Bu sayede sayfa yenilenmeden müzik objesi kaybolmaz ve kontrol edilebilir.
  const audioRef = useRef(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null); 
  const [currentTrack, setCurrentTrack] = useState(null);

  // --- MÜZİĞİ SUSTURMA FONKSİYONU ---
  const stopMusic = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  // Component açıldığında veya kapandığında çalışır
  useEffect(() => {
    return () => {
      stopMusic(); // Component silinirken (Menüye dönerken) müziği sustur
    };
  }, []);

  const startGame = (diff, catId) => {
    // Müziği garanti sustur
    stopMusic();

    let pool = QUIZ_DB.filter(q => q.difficulty === diff);
    
    // Kategori Filtrele
    if (catId && catId !== 'mix') {
      const catMap = { 'dirok': 'Dîrok', 'weje': 'Wêje', 'ziman': 'Ziman', 'folklor': 'Folklor' };
      const targetCat = catMap[catId] || catId;
      pool = pool.filter(q => q.category === targetCat);
    }
    
    // Yedek (Eğer soru yoksa karışık getir)
    if(pool.length === 0) pool = QUIZ_DB.filter(q => q.difficulty === diff);
    if(pool.length === 0) return alert("Pirs tune / Soru yok");
    
    // --- ŞIKLARI VE SORULARI KARIŞTIRMA ---
    const selectedQuestions = pool.sort(() => 0.5 - Math.random()).slice(0, 10).map(q => {
      return {
        ...q,
        options: shuffleArray([...q.options]) // Şıkları karıştır!
      };
    });
    
    setQuestions(selectedQuestions);
    setScore(0);
    setIndex(0);
    setScreen('play');
    setTimeLeft(15);
    setSelectedAnswerIndex(null);
  };

  // Sayaç
  useEffect(() => {
    if (screen === 'play' && timeLeft > 0 && selectedAnswerIndex === null) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && selectedAnswerIndex === null) {
      // Süre bitti, yanlış işaretle ama bekle
      setSelectedAnswerIndex(-1); 
    }
  }, [screen, timeLeft, selectedAnswerIndex]);

  const handleAnswer = (points, idx) => {
    if (selectedAnswerIndex !== null) return; // Çift tıklama engeli
    
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
    if (isPlaying) audioRef.current.pause(); 
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  // Geri Dönme İşlemi (Müziği Durdurur)
  const handleBack = () => {
    stopMusic();
    onBack();
  };

  // Tekrar Oyna İşlemi (Müziği Durdurur)
  const handleRestart = () => {
    stopMusic();
    setScreen('diff');
  };

  // EKRANLAR
  if (screen === 'diff') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-200 relative overflow-hidden text-center">
          <button onClick={handleBack} className="absolute top-4 left-4 text-slate-400 hover:text-blue-900"><ArrowLeft size={24} /></button>
          <div className="h-2 w-full bg-gradient-to-r from-blue-900 via-blue-500 to-yellow-500 absolute top-0 left-0"></div>
          <div className="mt-6 mb-4"><img src="/logo.png" className="w-24 h-24 mx-auto rounded-full shadow-lg border-4 border-white animate-[spin_20s_linear_infinite]" /></div>
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

  // OYUN EKRANI
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
              <div className="flex items-center gap-2">
                <img src="/logo.png" className="w-6 h-6 rounded-full" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.q} {index+1} / {questions.length}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-600 font-bold bg-slate-100 px-3 py-1 rounded-full text-xs"><Clock size={14} /> {timeLeft}s</div>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-8 leading-snug min-h-[4rem]">{q.question}</h2>
            
            <div className="space-y-3">
              {q.options.map((opt, i) => {
                const isSelected = selectedAnswerIndex === i;
                const isCorrectOption = opt.points > 0;
                
                // --- RENK MANTIĞI (DÜZELTİLDİ) ---
                let style = "border-2 border-slate-100 hover:border-blue-200 hover:bg-slate-50"; 
                
                if (selectedAnswerIndex !== null) { // Cevap verildiyse
                  if (isCorrectOption) {
                    // Doğru cevap her zaman yeşil yanar (Öğretmek için)
                    style = "bg-green-100 border-green-500 text-green-800 font-bold shadow-md transform scale-[1.02]";
                  } else if (isSelected && !isCorrectOption) {
                    // Yanlış seçtiğin kırmızı yanar
                    style = "bg-red-100 border-red-500 text-red-800 font-bold";
                  } else {
                    // Diğerleri silikleşir
                    style = "opacity-40 border-slate-100 grayscale";
                  }
                }

                return (
                  <button key={i} disabled={selectedAnswerIndex !== null} onClick={() => handleAnswer(opt.points, i)} 
                    className={`w-full p-4 rounded-xl text-left font-semibold transition-all flex justify-between items-center ${style}`}
                  >
                    {opt.text}
                    {selectedAnswerIndex !== null && isCorrectOption && <CheckCircle size={18} className="text-green-600" />}
                    {selectedAnswerIndex !== null && isSelected && !isCorrectOption && <XCircle size={18} className="text-red-500" />}
                  </button>
                );
              })}
            </div>
            
            {/* MANUEL GEÇİŞ (Otomatik geçmez, buton bekler) */}
            <AnimatePresence>
              {selectedAnswerIndex !== null && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                  <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-xl mb-4">
                    <p className="text-sm text-blue-900"><strong>ℹ️</strong> {q.explanation}</p>
                  </div>
                  <button onClick={nextQuestion} className="w-full py-4 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-900/30 transition-all cursor-pointer">
                    {t.next} <ChevronRight size={20} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  // SONUÇ EKRANI
  if (screen === 'result') {
    const percentage = Math.round((score / (questions.length * 10)) * 100);
    return (
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center border-t-8 border-yellow-500 relative">
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
             <img src="/logo.png" className="w-20 h-20 rounded-full border-4 border-white shadow-xl" />
          </div>
          <div className="mt-8">
            <h2 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">{t.result}</h2>
            <div className="text-6xl font-black text-blue-900 mb-2">%{percentage}</div>
            <p className="text-slate-500 text-sm mb-6">{percentage > 50 ? "Serkeftin!" : "Dîsa biceribîne."}</p>
            
            {/* Müzik Player */}
            <div className="flex items-center gap-3 bg-slate-100 p-4 rounded-2xl mb-6 shadow-inner border border-slate-200">
              <button onClick={toggleMusic} className="w-12 h-12 bg-blue-900 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition shadow-lg shrink-0 cursor-pointer">
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <div className="text-left overflow-hidden w-full">
                {currentTrack ? (
                  <>
                    <div className="text-sm font-bold text-blue-900 truncate">{currentTrack.title}</div>
                    <div className="text-xs text-slate-500 truncate">{currentTrack.artist}</div>
                  </>
                ) : (
                  <div className="text-xs text-slate-400">Loading...</div>
                )}
              </div>
              <MusicIcon size={20} className="text-slate-400 ml-auto shrink-0" />
            </div>

            <div className="flex gap-3">
              <button onClick={handleRestart} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 flex items-center justify-center gap-2 transition cursor-pointer">
                <RotateCcw size={18}/> {t.restart}
              </button>
              <button onClick={handleBack} className="flex-1 py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 flex items-center justify-center gap-2 transition shadow-lg shadow-blue-900/20 cursor-pointer">
                <ArrowLeft size={18}/> {t.back}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
  return null;
};

// ... Wordle ve Ana Menü kodları (öncekiyle aynı, sadece CultureQuiz'i güncelledik) ...
// (Kodun devamı için yukarıdaki CultureQuiz'i önceki tam koda entegre etmen yeterli)
// Ancak karışıklık olmasın diye tam kodu veriyorum:

// ==========================================
// 3. ANA SAYFA (OYUN MENÜSÜ)
// ==========================================
const Listik = () => {
  const { lang } = useLanguage();
  const [activeGame, setActiveGame] = useState(null);

  const t = {
    KU: { title: 'Lîstikên Me', sub: 'Hêviya me ew e ku hûn kêfxweş bibin', wordle: 'Peyvê Bibîne', quiz: 'Testa YTU Kurdî', play: 'Bilîze' },
    TR: { title: 'Oyunlarımız', sub: 'Keyifli vakit geçirmeniz dileğiyle', wordle: 'Kelimeyi Bul', quiz: 'YTU Kurdî Testi', play: 'Oyna' },
    EN: { title: 'Our Games', sub: 'Have fun!', wordle: 'Wordle', quiz: 'Culture Quiz', play: 'Play' }
  }[lang] || { title: 'Lîstikên Me' };

  if (activeGame === 'wordle') return <WordleGame onBack={() => setActiveGame(null)} lang={lang} />;
  if (activeGame === 'quiz') return <CultureQuiz onBack={() => setActiveGame(null)} lang={lang} />;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 px-4 pb-12 w-full">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-blue-900 mb-3 tracking-tight">{t.title}</h1>
          <p className="text-slate-500 text-lg font-medium">{t.sub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div whileHover={{ y: -5 }} className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col items-center text-center group cursor-pointer hover:shadow-2xl transition-all" onClick={() => setActiveGame('wordle')}>
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
              <Gamepad2 size={48} className="text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{t.wordle}</h2>
            <p className="text-slate-400 text-sm mb-6">Peyvên 5 tîpî bibîne</p>
            <button className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 cursor-pointer">
              {t.play}
            </button>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col items-center text-center group cursor-pointer hover:shadow-2xl transition-all" onClick={() => setActiveGame('quiz')}>
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
              <Library size={48} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{t.quiz}</h2>
            <p className="text-slate-400 text-sm mb-6">Dîrok, Ziman û Wêje</p>
            <button className="w-full py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-lg shadow-blue-200 cursor-pointer">
              {t.play}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Listik;