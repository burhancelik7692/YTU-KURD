import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, Play, Pause, Music as MusicIcon, Award, Clock, Trophy, ChevronRight, Zap, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';

// =================================================================
// 🎵 MÜZİK VERİTABANI
// =================================================================
const MUSIC_PLAYLIST = [
  { id: "bg_music", src: "/music/bg_music.mp3" }, 
  { id: "win", src: "/music/win.mp3" },
  { id: "lose", src: "/music/lose.mp3" }
];

const SFX = {
  win: "/music/win.mp3",
  lose: "/music/lose.mp3"
};

// =================================================================
// ❓ SORU VERİTABANI (Dahili)
// =================================================================
const QUIZ_DB = [
  // --- TARİH (DÎROK) ---
  {
    id: 'h1',
    category: 'Dîrok',
    difficulty: 1,
    question: "Paytextê Împaratoriya Medan kîjan bajar bû?",
    options: [
      { text: "Ecbatana (Hemedan)", points: 10 },
      { text: "Amed", points: 0 },
      { text: "Hewlêr", points: 0 },
      { text: "Wan", points: 0 }
    ],
    explanation: "Ecbatana (îro Hemedan), paytextê Medan bû."
  },
  {
    id: 'h2',
    category: 'Dîrok',
    difficulty: 2,
    question: "Kîjan mîrektî li Bedlîsê hukum kiriye?",
    options: [
      { text: "Şerefxan", points: 10 },
      { text: "Botan", points: 0 },
      { text: "Soran", points: 0 },
      { text: "Baban", points: 0 }
    ],
    explanation: "Mîrektiya Şerefxan li Bedlîsê hukum kiriye û 'Şerefname' li vir hatiye nivîsandin."
  },
  {
    id: 'h3',
    category: 'Dîrok',
    difficulty: 1,
    question: "Nivîskarê 'Şerefname' kî ye?",
    options: [
      { text: "Şerefxanê Bedlîsî", points: 10 },
      { text: "Ehmedê Xanî", points: 0 },
      { text: "Melayê Cizîrî", points: 0 },
      { text: "Feqiyê Teyran", points: 0 }
    ],
    explanation: "Şerefname, di sala 1597an de ji aliyê Şerefxanê Bedlîsî ve hatiye nivîsandin."
  },
  {
    id: 'h4',
    category: 'Dîrok',
    difficulty: 3,
    question: "Komara Mahabadê kengî hat damezrandin?",
    options: [
      { text: "1946", points: 10 },
      { text: "1923", points: 0 },
      { text: "1958", points: 0 },
      { text: "1975", points: 0 }
    ],
    explanation: "Komara Mahabadê di 22ê Çileya 1946an de hat damezrandin."
  },

  // --- EDEBİYAT (WÊJE) ---
  {
    id: 'l1',
    category: 'Wêje',
    difficulty: 1,
    question: "Destana 'Mem û Zîn' berhema kê ye?",
    options: [
      { text: "Ehmedê Xanî", points: 10 },
      { text: "Melayê Cizîrî", points: 0 },
      { text: "Feqiyê Teyran", points: 0 },
      { text: "Cegerxwîn", points: 0 }
    ],
    explanation: "Mem û Zîn, şahesera Ehmedê Xanî ye û di sedsala 17an de hatiye nivîsandin."
  },
  {
    id: 'l2',
    category: 'Wêje',
    difficulty: 2,
    question: "Yekem rojnameya Kurdî çi ye?",
    options: [
      { text: "Kurdistan", points: 10 },
      { text: "Hawar", points: 0 },
      { text: "Ronahî", points: 0 },
      { text: "Jîn", points: 0 }
    ],
    explanation: "Rojnameya 'Kurdistan' di sala 1898an de li Qahîreyê ji aliyê Mîqtad Mîdhed Bedirxan ve hat derxistin."
  },
  {
    id: 'l3',
    category: 'Wêje',
    difficulty: 2,
    question: "Kovar 'Hawar' ji aliyê kê ve hatiye derxistin?",
    options: [
      { text: "Celadet Alî Bedirxan", points: 10 },
      { text: "Cegerxwîn", points: 0 },
      { text: "Osman Sebrî", points: 0 },
      { text: "Qedrîcan", points: 0 }
    ],
    explanation: "Hawar, di sala 1932an de li Şamê ji aliyê Celadet Alî Bedirxan ve dest bi weşanê kir."
  },

  // --- DİL (ZIMAN) ---
  {
    id: 'z1',
    category: 'Ziman',
    difficulty: 1,
    question: "'Rojbaş' tê wateya çi?",
    options: [
      { text: "Günaydın", points: 10 },
      { text: "İyi geceler", points: 0 },
      { text: "Merhaba", points: 0 },
      { text: "Hoşça kal", points: 0 }
    ],
    explanation: "Roj (Güneş/Gün) + Baş (İyi) = Günaydın / Tünaydın."
  },
  {
    id: 'z2',
    category: 'Ziman',
    difficulty: 3,
    question: "Di alfabeya Kurdî (Kurmancî) de çend tîp hene?",
    options: [
      { text: "31", points: 10 },
      { text: "29", points: 0 },
      { text: "33", points: 0 },
      { text: "28", points: 0 }
    ],
    explanation: "Alfabeya Kurdî ya latînî ji 31 tîpan pêk tê (8 dengdêr, 23 dengdar)."
  },
  {
    id: 'z3',
    category: 'Ziman',
    difficulty: 2,
    question: "Kîjan peyv nayê wateya 'Spas'?",
    options: [
      { text: "Serçava", points: 0 },
      { text: "Mala te ava", points: 0 },
      { text: "Berxudar be", points: 0 },
      { text: "Şevbaş", points: 10 }
    ],
    explanation: "'Şevbaş' tê wateya 'İyi geceler', yên din spasiyê nîşan didin."
  },

  // --- FOLKLOR ---
  {
    id: 'f1',
    category: 'Folklor',
    difficulty: 1,
    question: "Cejna neteweyî ya Kurdan kîjan e?",
    options: [
      { text: "Newroz", points: 10 },
      { text: "Çarşema Sor", points: 0 },
      { text: "Sersal", points: 0 },
      { text: "Bihuşt", points: 0 }
    ],
    explanation: "Newroz (21ê Adarê), cejna neteweyî û sersala nû ya Kurdan e."
  },
  {
    id: 'f2',
    category: 'Folklor',
    difficulty: 2,
    question: "Kîjan amûr sembola muzîka Kurdî ye?",
    options: [
      { text: "Tembûr", points: 10 },
      { text: "Gîtar", points: 0 },
      { text: "Piyano", points: 0 },
      { text: "Keman", points: 0 }
    ],
    explanation: "Tembûr amûra herî kevn û pîroz a çanda muzîka Kurdî ye."
  },
  {
    id: 'f3',
    category: 'Folklor',
    difficulty: 2,
    question: "Kawayê Hesinkar li dijî kê serî hilda?",
    options: [
      { text: "Dehaq", points: 10 },
      { text: "Keyxusrew", points: 0 },
      { text: "Rustemê Zal", points: 0 },
      { text: "Îskender", points: 0 }
    ],
    explanation: "Li gorî efsaneya Newrozê, Kawayê Hesinkar li dijî zilmkar Dehaq serî hilda."
  }
];

// =================================================================
// 🎵 MÜZİK SONUÇLARI VERİTABANI (Dinamik Seçim İçin)
// =================================================================
// 'filename': public/music/ içindeki dosya adı (uzantısıyla birlikte)
// 'mood': 'sad' (Hüzünlü), 'mid' (Orta/Normal), 'happy' (Coşkulu)
const RESULTS_MUSIC_DB = [
  // --- Düşük Puan (%0 - %49) -> Hüzünlü Şarkılar ---
  { filename: "huzunlu1.mp3", title: "Dil Perîşan im", artist: "Mihemed Şêxo", mood: "sad" },
  { filename: "huzunlu2.mp3", title: "Qamişlo", artist: "Ciwan Haco", mood: "sad" },
  { filename: "huzunlu3.mp3", title: "Dayê", artist: "Nizamettin Ariç", mood: "sad" },

  // --- Orta Puan (%50 - %79) -> Normal/Ritmik Şarkılar ---
  { filename: "orta1.mp3", title: "Eman Dilo", artist: "Hozan Serhat", mood: "mid" },
  { filename: "orta2.mp3", title: "Zembîlfiroş", artist: "Şivan Perwer", mood: "mid" },
  { filename: "orta3.mp3", title: "Sebra Dila", artist: "Aynur Doğan", mood: "mid" },

  // --- Yüksek Puan (%80 - %100) -> Coşkulu/Halay Şarkıları ---
  { filename: "cosku1.mp3", title: "Keçê Kurdan", artist: "Aynur Doğan", mood: "happy" },
  { filename: "cosku2.mp3", title: "Govenda Gel", artist: "Şivan Perwer", mood: "happy" },
  { filename: "cosku3.mp3", title: "Potporî", artist: "Koma Rojda", mood: "happy" },
];


const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const CultureQuiz = ({ onBack, lang }) => {
  const t = {
    KU: { title: 'Testa YTU Kurdî', diff: 'Asta Zehmetiyê', easy: 'Hêsan', medium: 'Navîn', hard: 'Zehmet', start: 'Dest Pê Bike', q: 'Pirs', result: 'Encam', restart: 'Ji Nû Ve', music: 'Muzîk', play: 'Bilîze', cat: 'Kategorî', next: 'Pirsê Din', joker: 'Joker', timeup: 'Dem Qediya!', score: 'Xal', playing: 'Tê lêxistin' },
    TR: { title: 'YTU Kurdî Testi', diff: 'Zorluk Seviyesi', easy: 'Kolay', medium: 'Orta', hard: 'Zor', start: 'Başla', q: 'Soru', result: 'Sonuç', restart: 'Tekrar', music: 'Müzik', play: 'Oyna', cat: 'Kategori', next: 'Sonraki Soru', joker: 'Joker', timeup: 'Süre Doldu!', score: 'Puan', playing: 'Çalıyor' },
    EN: { title: 'YTU Quiz', diff: 'Difficulty', easy: 'Easy', medium: 'Medium', hard: 'Hard', start: 'Start', q: 'Q', result: 'Result', restart: 'Restart', music: 'Music', play: 'Play', cat: 'Category', next: 'Next Question', joker: 'Joker', timeup: 'Time Up!', score: 'Score', playing: 'Now Playing' }
  }[lang] || { title: 'Testa YTU Kurdî' };

  // State'ler
  const [screen, setScreen] = useState('diff');
  const [difficulty, setDifficulty] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [jokers, setJokers] = useState({ fiftyFifty: true });
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null); 

  // Ses Referansları
  const bgMusicRef = useRef(new Audio());
  const sfxRef = useRef(new Audio());

  // Güvenli Oynatma
  const safePlay = (audioObj) => {
    if (!audioObj || !audioObj.src) return;
    const playPromise = audioObj.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => console.warn("Otomatik oynatma engellendi:", error));
    }
  };

  // Müzik Kontrolü (Arka Plan ve Sonuç Müziği)
  useEffect(() => {
    if (screen === 'play') {
        // Quiz sırasındaki fon müziği
        bgMusicRef.current.src = MUSIC_PLAYLIST.find(m => m.id === "bg_music")?.src || "";
        bgMusicRef.current.loop = true;
        bgMusicRef.current.volume = 0.2;
    } 
    // Sonuç ekranı müziği playResultMusic fonksiyonunda ayarlanır

    if (isMusicOn) {
        safePlay(bgMusicRef.current);
    } else {
        bgMusicRef.current.pause();
    }

    return () => {
        bgMusicRef.current.pause();
    };
  }, [isMusicOn, screen]);

  // Efekt Sesi
  const playSfx = (type) => {
      if (!isMusicOn) return;
      sfxRef.current.src = type === 'win' ? SFX.win : SFX.lose;
      sfxRef.current.volume = 0.5;
      safePlay(sfxRef.current);
  };

  // Sonuç Müziğini Seç ve Çal
  const playResultMusic = (finalScore, totalQuestions) => {
      const percentage = (finalScore / (totalQuestions * 10)) * 100;
      let mood = 'mid'; 

      if (percentage >= 80) mood = 'happy'; 
      else if (percentage < 50) mood = 'sad'; 

      // O moda uygun şarkıları filtrele
      const possibleTracks = RESULTS_MUSIC_DB.filter(t => t.mood === mood);
      const pool = possibleTracks.length > 0 ? possibleTracks : RESULTS_MUSIC_DB;
      
      if (pool.length > 0) {
          const randomTrack = pool[Math.floor(Math.random() * pool.length)];
          
          setCurrentTrack(randomTrack);
          
          bgMusicRef.current.src = `/music/${randomTrack.filename}`;
          bgMusicRef.current.loop = true;
          bgMusicRef.current.volume = 0.5;
          
          if(isMusicOn) safePlay(bgMusicRef.current);
      }
  };

  const startGame = (diff, catId) => {
    let pool = QUIZ_DB.filter(q => q.difficulty === diff);
    
    if (catId && catId !== 'mix') {
      const catMap = { 'dirok': 'Dîrok', 'weje': 'Wêje', 'ziman': 'Ziman', 'folklor': 'Folklor' };
      const targetCat = catMap[catId] || catId;
      pool = pool.filter(q => q.category === targetCat);
    }
    
    if(pool.length === 0) pool = QUIZ_DB.filter(q => q.difficulty === diff);
    
    const selectedQuestions = pool.sort(() => 0.5 - Math.random()).slice(0, 10).map(q => ({
      ...q,
      options: shuffleArray([...q.options])
    }));
    
    setQuestions(selectedQuestions);
    setScore(0);
    setIndex(0);
    setScreen('play');
    setTimeLeft(20);
    setSelectedAnswerIndex(null);
    setJokers({ fiftyFifty: true });
    setHiddenOptions([]);
    setIsMusicOn(true); 
    setCurrentTrack(null);
  };

  // Sayaç
  useEffect(() => {
    if (screen === 'play' && timeLeft > 0 && selectedAnswerIndex === null) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && selectedAnswerIndex === null) {
      setSelectedAnswerIndex(-1);
      playSfx('lose');
    }
  }, [screen, timeLeft, selectedAnswerIndex]);

  const handleAnswer = (points, idx) => {
    if (selectedAnswerIndex !== null) return;
    setSelectedAnswerIndex(idx);
    if (points > 0) {
        setScore(score + (points * 10) + timeLeft);
        playSfx('win');
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 }, colors: ['#22c55e', '#ffffff'] });
    } else {
        playSfx('lose');
    }
  };

  const useFiftyFifty = () => {
    if (!jokers.fiftyFifty || selectedAnswerIndex !== null) return;
    const currentQ = questions[index];
    const wrongIndices = currentQ.options.map((opt, i) => (opt.points === 0 ? i : -1)).filter(i => i !== -1);
    const shuffledWrong = wrongIndices.sort(() => 0.5 - Math.random()).slice(0, 2);
    setHiddenOptions(shuffledWrong);
    setJokers({ ...jokers, fiftyFifty: false });
  };

  const nextQuestion = () => {
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setSelectedAnswerIndex(null);
      setTimeLeft(20);
      setHiddenOptions([]);
    } else {
      setScreen('result');
      playResultMusic(score, questions.length);
    }
  };

  const toggleMusic = () => {
      setIsMusicOn(!isMusicOn);
  };

  // --- EKRANLAR ---
  if (screen === 'diff') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl p-8 border border-slate-200 dark:border-slate-700 relative text-center">
          <button onClick={onBack} className="absolute top-6 left-6 text-slate-400 hover:text-blue-900 dark:hover:text-white transition"><ArrowLeft size={24} /></button>
          
          <div className="mt-4 mb-6 relative">
             <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full"></div>
             <img src="/logo.png" alt="YTU Kurdî" className="w-28 h-28 mx-auto rounded-full shadow-lg border-4 border-white dark:border-slate-700 relative z-10" />
          </div>
          
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">{t.title}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-10">Zanîna xwe bipîve / Bilgini Ölç</p>
          
          <div className="space-y-4">
            {[1, 2, 3].map(lvl => (
              <motion.button 
                key={lvl} 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                onClick={() => { setDifficulty(lvl); setScreen('category'); }} 
                className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center justify-between group
                    ${lvl === 1 ? 'border-green-100 hover:border-green-500 bg-green-50/50 dark:bg-green-900/10 dark:border-green-900' : ''}
                    ${lvl === 2 ? 'border-yellow-100 hover:border-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10 dark:border-yellow-900' : ''}
                    ${lvl === 3 ? 'border-red-100 hover:border-red-500 bg-red-50/50 dark:bg-red-900/10 dark:border-red-900' : ''}
                `}
              >
                <span className="font-bold text-slate-700 dark:text-slate-200 text-lg">
                    {lvl === 1 ? t.easy : (lvl === 2 ? t.medium : t.hard)}
                </span>
                <div className="flex gap-1">
                    {[...Array(lvl)].map((_, i) => (
                        <Award key={i} size={20} className={lvl === 1 ? 'text-green-500' : lvl === 2 ? 'text-yellow-500' : 'text-red-500'} fill="currentColor" />
                    ))}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (screen === 'category') {
    return (
      <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl p-8 border border-slate-200 dark:border-slate-700 relative text-center">
          <button onClick={() => setScreen('diff')} className="absolute top-6 left-6 text-slate-400 hover:text-blue-900 dark:hover:text-white transition"><ArrowLeft size={24} /></button>
          
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 mt-2">{t.cat}</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {[{id:'dirok', label:'Dîrok', icon:'🏛️', color:'bg-amber-100 text-amber-700'}, 
              {id:'weje', label:'Wêje', icon:'📚', color:'bg-blue-100 text-blue-700'}, 
              {id:'ziman', label:'Ziman', icon:'🗣️', color:'bg-green-100 text-green-700'}, 
              {id:'folklor', label:'Folklor', icon:'🎶', color:'bg-purple-100 text-purple-700'}].map(c => (
              <motion.button 
                key={c.id} 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => startGame(difficulty, c.id)} 
                className={`p-6 rounded-2xl flex flex-col items-center gap-3 transition-transform ${c.color} dark:bg-opacity-20`}
              >
                <span className="text-4xl">{c.icon}</span>
                <span className="font-bold">{c.label}</span>
              </motion.button>
            ))}
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            onClick={() => startGame(difficulty, 'mix')} 
            className="w-full mt-6 p-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-lg flex items-center justify-center gap-2"
          >
            Tevlihev / Karışık 🎲
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (screen === 'play') {
    const q = questions[index];
    const progress = ((index + 1) / questions.length) * 100;
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-700 relative overflow-hidden">
          
          <div className="bg-slate-50 dark:bg-slate-900/50 p-6 flex justify-between items-center border-b border-slate-100 dark:border-slate-700">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 flex items-center justify-center font-bold text-sm text-slate-600 dark:text-slate-300">
                    {index + 1}
                </div>
                <div className="h-2 w-24 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-blue-600" />
                </div>
             </div>
             
             <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-full">
                <Trophy size={16} className="text-yellow-600 dark:text-yellow-500" />
                <span className="font-bold text-yellow-700 dark:text-yellow-400">{score}</span>
             </div>
          </div>

          <div className="p-8">
            
            <div className="flex justify-between items-center mb-8">
               <button onClick={() => setIsMusicOn(!isMusicOn)} className={`p-2 rounded-full transition-colors ${isMusicOn ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                  {isMusicOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
               </button>

               <div className={`flex items-center gap-2 text-xl font-black ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-slate-700 dark:text-white'}`}>
                  <Clock size={24} /> {timeLeft}s
               </div>

               <button 
                 onClick={useFiftyFifty} 
                 disabled={!jokers.fiftyFifty || selectedAnswerIndex !== null}
                 className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    jokers.fiftyFifty 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30 hover:scale-105' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-50'
                 }`}
               >
                 <Zap size={14} fill="currentColor" /> 50:50
               </button>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-8 leading-snug min-h-[5rem]">
              {q.question}
            </h2>

            <div className="space-y-3">
              {q.options.map((opt, i) => {
                const isSelected = selectedAnswerIndex === i;
                const isCorrectOption = opt.points > 0;
                const isHidden = hiddenOptions.includes(i);

                let style = "bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20";
                
                if (selectedAnswerIndex !== null) {
                  if (isCorrectOption) style = "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-300 font-bold transform scale-[1.02] shadow-md";
                  else if (isSelected && !isCorrectOption) style = "bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-300 font-bold opacity-80";
                  else style = "opacity-40 grayscale border-slate-100 dark:border-slate-700";
                }

                if (isHidden) return null;

                return (
                  <motion.button
                    key={i}
                    whileHover={selectedAnswerIndex === null ? { scale: 1.02 } : {}}
                    whileTap={selectedAnswerIndex === null ? { scale: 0.98 } : {}}
                    disabled={selectedAnswerIndex !== null}
                    onClick={() => handleAnswer(opt.points, i)}
                    className={`w-full p-4 rounded-xl text-left font-semibold transition-all flex justify-between items-center ${style}`}
                  >
                    <span className="flex-1">{opt.text}</span>
                    {selectedAnswerIndex !== null && isCorrectOption && <CheckCircle size={20} className="text-green-600 dark:text-green-400" />}
                    {selectedAnswerIndex !== null && isSelected && !isCorrectOption && <XCircle size={20} className="text-red-500" />}
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {selectedAnswerIndex !== null && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                  {timeLeft === 0 && selectedAnswerIndex === -1 && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-lg text-sm font-bold mb-3 text-center">
                          {t.timeup}
                      </div>
                  )}
                  {q.explanation && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-xl mb-4 text-sm text-slate-700 dark:text-slate-300">
                          <span className="font-bold block mb-1 text-blue-800 dark:text-blue-300">💡 Zanîn / Bilgi:</span> 
                          {q.explanation}
                      </div>
                  )}
                  <button onClick={nextQuestion} className="w-full py-4 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20 transition-all">
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

  // --- 4. EKRAN: SONUÇ ---
  if (screen === 'result') {
    const percentage = Math.round((score / (questions.length * 10)) * 100);
    const isSuccess = percentage >= 50;

    return (
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl p-8 text-center border-t-8 border-yellow-500 relative overflow-hidden">
          {isSuccess && <confetti className="absolute inset-0" />}
          
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
             <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center border-4 border-yellow-500 shadow-xl">
                <Trophy size={48} className="text-yellow-500" fill="currentColor" />
             </div>
          </div>

          <div className="mt-12">
            <h2 className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-2">{t.result}</h2>
            <div className="text-6xl font-black text-slate-900 dark:text-white mb-2">{score}</div>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">
                {isSuccess ? "Pîroz be! Te pir baş kir." : "Dîsa biceribîne, tu dikarî baştir bikî."}
            </p>

            {/* --- GELİŞMİŞ MÜZİK BİLGİSİ EKRANI --- */}
            <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-2xl mb-8 flex items-center gap-4 border border-slate-200 dark:border-slate-700">
               <button 
                 onClick={toggleMusic} 
                 className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all ${isMusicOn ? 'bg-green-500 text-white animate-pulse' : 'bg-slate-300 text-slate-500'}`}
               >
                  {isMusicOn ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
               </button>
               
               <div className="text-left flex-1 overflow-hidden">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-0.5">{t.playing}</span>
                  {currentTrack ? (
                      <div>
                          <div className="font-bold text-slate-800 dark:text-white truncate text-lg">{currentTrack.title}</div>
                          <div className="text-sm text-blue-600 dark:text-blue-400 font-medium truncate">{currentTrack.artist}</div>
                      </div>
                  ) : (
                      <div className="text-slate-400 italic text-sm">Muzîk nayê dîtin...</div>
                  )}
               </div>
               
               {/* Ekolayzer Efekti */}
               {isMusicOn && (
                   <div className="flex gap-1 h-6 items-end">
                       {[1,2,3,4].map(i => (
                           <motion.div 
                             key={i} 
                             animate={{ height: [5, 20, 5] }} 
                             transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }} 
                             className="w-1 bg-blue-500 rounded-full" 
                           />
                       ))}
                   </div>
               )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => { setScreen('diff'); }} className="py-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center gap-2 transition">
                 {t.restart}
              </button>
              <button onClick={onBack} className="py-4 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 flex items-center justify-center gap-2 transition shadow-lg shadow-blue-900/20">
                 {lang === 'KU' ? 'Derkeve' : 'Çıkış'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
};

export default CultureQuiz;