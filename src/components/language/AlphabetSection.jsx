import React from 'react';
import { motion } from 'framer-motion';

const alphabet = [
  { letter: 'A', pronunciation: 'a', type: 'vowel' }, { letter: 'B', pronunciation: 'be', type: 'consonant' },
  { letter: 'C', pronunciation: 'ce', type: 'consonant' }, { letter: 'Ç', pronunciation: 'çe', type: 'consonant' },
  { letter: 'D', pronunciation: 'de', type: 'consonant' }, { letter: 'E', pronunciation: 'e', type: 'vowel' },
  { letter: 'Ê', pronunciation: 'ê', type: 'vowel' }, { letter: 'F', pronunciation: 'fe', type: 'consonant' },
  { letter: 'G', pronunciation: 'ge', type: 'consonant' }, { letter: 'H', pronunciation: 'he', type: 'consonant' },
  { letter: 'I', pronunciation: 'ı', type: 'vowel' }, { letter: 'Î', pronunciation: 'î', type: 'vowel' },
  { letter: 'J', pronunciation: 'je', type: 'consonant' }, { letter: 'K', pronunciation: 'ke', type: 'consonant' },
  { letter: 'L', pronunciation: 'le', type: 'consonant' }, { letter: 'M', pronunciation: 'me', type: 'consonant' },
  { letter: 'N', pronunciation: 'ne', type: 'consonant' }, { letter: 'O', pronunciation: 'o', type: 'vowel' },
  { letter: 'P', pronunciation: 'pe', type: 'consonant' }, { letter: 'Q', pronunciation: 'qe', type: 'consonant' },
  { letter: 'R', pronunciation: 're', type: 'consonant' }, { letter: 'S', pronunciation: 'se', type: 'consonant' },
  { letter: 'Ş', pronunciation: 'şe', type: 'consonant' }, { letter: 'T', pronunciation: 'te', type: 'consonant' },
  { letter: 'U', pronunciation: 'u', type: 'vowel' }, { letter: 'Û', pronunciation: 'û', type: 'vowel' },
  { letter: 'V', pronunciation: 've', type: 'consonant' }, { letter: 'W', pronunciation: 'we', type: 'consonant' },
  { letter: 'X', pronunciation: 'xe', type: 'consonant' }, { letter: 'Y', pronunciation: 'ye', type: 'consonant' },
  { letter: 'Z', pronunciation: 'ze', type: 'consonant' }
];

const AlphabetSection = ({ title }) => {
  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center text-blue-900 dark:text-white mb-8">{title}</h2>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
        {alphabet.map((item) => (
          <motion.div 
            key={item.letter} 
            whileHover={{ scale: 1.1, y: -5 }} 
            whileTap={{ scale: 0.95 }}
            className={`
              relative p-4 rounded-2xl text-center cursor-pointer border-2 transition-all shadow-sm
              ${item.type === 'vowel' 
                ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-700/50' 
                : 'bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700'}
            `}
          >
            {item.type === 'vowel' && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-400 rounded-full"></span>
            )}
            <div className="text-2xl font-black text-slate-800 dark:text-white mb-1">{item.letter}</div>
            <div className="text-xs text-slate-400 dark:text-slate-500 font-medium font-mono">{item.pronunciation}</div>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-orange-400 rounded-full"></span> Dengdêr (Sesli)</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-slate-300 rounded-full"></span> Dengdar (Sessiz)</span>
      </div>
    </section>
  );
};

export default AlphabetSection;