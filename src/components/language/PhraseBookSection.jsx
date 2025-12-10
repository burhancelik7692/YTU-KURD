import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, PlayCircle } from 'lucide-react';

const PhraseBookSection = ({ title, phrases }) => {
  return (
    <section className="py-12">
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl shadow-2xl p-8 md:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
                <MessageCircle size={24} className="text-yellow-400" />
            </div>
            <h2 className="text-3xl font-bold">{title}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {phrases && phrases.map((phrase, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-5 transition-all cursor-default"
              >
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors">{phrase.org}</span>
                    <PlayCircle size={16} className="text-white/30 group-hover:text-white/80 transition-colors" />
                </div>
                <div className="h-px bg-white/10 my-2"></div>
                <div className="text-indigo-100 text-sm font-medium">{phrase.mean}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhraseBookSection;