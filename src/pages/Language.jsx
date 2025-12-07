import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { BookOpen, MessageCircle, FileText, Headphones } from 'lucide-react';

const Language = () => {
  const topics = [
    {
      icon: BookOpen,
      title: 'Rêzimana Kurdî',
      description: 'Rêziman û qawaidên zimanê kurdî hîn bibin',
      content: 'Zimanê kurdî zimanek Hind-Ewropî ye û du zaravayên sereke hene: Kurmancî (Kurdiya Jorîn) û Soranî (Kurdiya Navîn). Alfabeya latînî ji bo Kurmancî û alfabeya erebî ji bo Soranî tê bikar anîn.'
    },
    {
      icon: MessageCircle,
      title: 'Axaftina Rojane',
      description: 'Hevokên rojane yên kurdî',
      content: 'Silav - Roj baş, Spas - Sipas, Bi xêr hatî - Bi xêr hatî, Çawa yî? - Tu çawa yî?, Ez baş im - Ez baş im, Navê te çi ye? - Navê te çi ye?'
    },
    {
      icon: FileText,
      title: 'Peyv û Bêje',
      description: 'Peyv û bêjeyên girîng',
      content: 'Mal - Xanî, Dê - Dayik, Bav - Bav, Birayê - Bira, Xwişk - Xwişk, Heval - Heval, Dibistan - Dibistan, Pirtûk - Pirtûk'
    },
    {
      icon: Headphones,
      title: 'Guhdarî û Axaftin',
      description: 'Pratîka guhdarî û axaftinê',
      content: 'Ji bo ku hûn zimanê kurdî baş hîn bibin, divê hûn her roj guhdarî bikin û bi kurdî bipeyivin. Stranên kurdî bibihîzin, fîlmên kurdî temaşe bikin û bi hevalên xwe re bi kurdî bipeyivin.'
    }
  ];

  const alphabet = [
    { letter: 'A', pronunciation: 'a' },
    { letter: 'B', pronunciation: 'be' },
    { letter: 'C', pronunciation: 'ce' },
    { letter: 'Ç', pronunciation: 'çe' },
    { letter: 'D', pronunciation: 'de' },
    { letter: 'E', pronunciation: 'e' },
    { letter: 'Ê', pronunciation: 'ê' },
    { letter: 'F', pronunciation: 'fe' },
    { letter: 'G', pronunciation: 'ge' },
    { letter: 'H', pronunciation: 'he' },
    { letter: 'I', pronunciation: 'ı' },
    { letter: 'Î', pronunciation: 'î' },
    { letter: 'J', pronunciation: 'je' },
    { letter: 'K', pronunciation: 'ke' },
    { letter: 'L', pronunciation: 'le' },
    { letter: 'M', pronunciation: 'me' },
    { letter: 'N', pronunciation: 'ne' },
    { letter: 'O', pronunciation: 'o' },
    { letter: 'P', pronunciation: 'pe' },
    { letter: 'Q', pronunciation: 'qe' },
    { letter: 'R', pronunciation: 're' },
    { letter: 'S', pronunciation: 'se' },
    { letter: 'Ş', pronunciation: 'şe' },
    { letter: 'T', pronunciation: 'te' },
    { letter: 'U', pronunciation: 'u' },
    { letter: 'Û', pronunciation: 'û' },
    { letter: 'V', pronunciation: 've' },
    { letter: 'W', pronunciation: 'we' },
    { letter: 'X', pronunciation: 'xe' },
    { letter: 'Y', pronunciation: 'ye' },
    { letter: 'Z', pronunciation: 'ze' }
  ];

  return (
    <>
      <Helmet>
        <title>Ziman - YTU Kurdî </title>
        <meta name="description" content="Zimanê kurdî hîn bibin - Rêziman, peyv, û axaftina rojane" />
      </Helmet>

      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Zimanê Kurdî</h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Zimanê kurdî hîn bibin - Alfabê, rêziman, peyv û axaftina rojane
            </p>
          </motion.div>

          {/* Alphabet Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Alfabeya Kurdî (Kurmancî)</h2>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
                {alphabet.map((item, index) => (
                  <motion.div
                    key={item.letter}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                    className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-center hover:scale-110 transition-transform duration-300 cursor-pointer shadow-lg"
                  >
                    <div className="text-3xl font-bold text-white mb-1">{item.letter}</div>
                    <div className="text-xs text-blue-100">{item.pronunciation}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {topics.map((topic, index) => (
              <motion.div
                key={topic.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500 rounded-xl p-3 flex-shrink-0">
                    <topic.icon className="text-white" size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{topic.title}</h3>
                    <p className="text-gray-600 mb-4">{topic.description}</p>
                    <p className="text-gray-700 leading-relaxed">{topic.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Common Phrases */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl shadow-xl p-8 md:p-12 text-white"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Hevokên Girîng</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { kurdish: 'Roj baş', meaning: 'Günaydın / İyi günler' },
                { kurdish: 'Êvar baş', meaning: 'İyi akşamlar' },
                { kurdish: 'Şev baş', meaning: 'İyi geceler' },
                { kurdish: 'Sipas', meaning: 'Teşekkür ederim' },
                { kurdish: 'Ji kerema xwe', meaning: 'Lütfen' },
                { kurdish: 'eman eman  ez dimirim', meaning: 'Özür dilerim' },
                { kurdish: 'Erê', meaning: 'Evet' },
                { kurdish: 'Na', meaning: 'Hayır' },
                { kurdish: 'Ez te hez dikim', meaning: 'Seni seviyorum' },
                { kurdish: 'Bi xêr hatî', meaning: 'Hoş geldin' }
              ].map((phrase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="text-xl font-bold mb-1">{phrase.kurdish}</div>
                  <div className="text-blue-100">{phrase.meaning}</div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </>
  );
};

export default Language;