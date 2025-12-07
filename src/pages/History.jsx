import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Scroll, Castle, Crown, BookOpen } from 'lucide-react';

const History = () => {
  const historicalPeriods = [
    {
      icon: Scroll,
      period: 'Dîroka Kevn',
      years: 'Berî Zayînê - Sedsala 7an',
      description: 'Kurdan ji Medan û Parthan tên. Ew li Mezopotamya û herêmên derdora wê dijîyan.',
      details: 'Gelê kurd yek ji gelên kevn ên Rojhilata Navîn e. Dîroka wan bi hezaran salan berê dest pê dike. Medan û Partan pêşiyên kurdan bûn.'
    },
    {
      icon: Castle,
      period: 'Dewleta Eyûbî',
      years: '1171 - 1250',
      description: 'Selahedînê Eyûbî dewletek mezin ava kir û Qudsê azad kir.',
      details: 'Selahedînê Eyûbî yek ji wêrekên herî navdar ên dîrokê ye. Ew Qudsê ji Xaçperestan azad kir û dewletek mezin ava kir ku ji Misirê heya Sûriyê dirêj bû.'
    },
    {
      icon: Crown,
      period: 'Mîrgehên Kurdî',
      years: 'Sedsala 10an - 19an',
      description: 'Gelek mîrgehên serbixwe yên kurdî hatin avakirin.',
      details: 'Di sedsalên navîn de gelek mîrgehên kurdî yên serbixwe hatin avakirin. Mîrgeha Botanê, Mîrgeha Hekkariyê û yên din navdar bûn.'
    },
    {
      icon: BookOpen,
      period: 'Serdema Nûjen',
      years: 'Sedsala 20an - Niha',
      description: 'Têkoşîna kurdan ji bo mafên xwe û nasnameyê xwe.',
      details: 'Di sedsala 20an de kurdan dest bi têkoşîna xwe ya ji bo mafên xwe kirin. Niha kurdan li çar parçeyên Kurdistanê dijîn û têkoşîna xwe didomînin.'
    }
  ];

  const importantFigures = [
    { name: 'Selahedînê Eyûbî', role: 'Wêrek û Damezrînerê Dewleta Eyûbî', period: '1137-1193' },
    { name: 'Ehmedê Xanî', role: 'Helbestvan û Zanyar', period: '1650-1707' },
    { name: 'Mela Mistefa Barzanî', role: 'Rêberê Neteweyî', period: '1903-1979' },
    { name: 'Cigerxwîn', role: 'Helbestvanê Mezin', period: '1903-1984' }
  ];

  return (
    <>
      <Helmet>
        <title>Dîrok - YTU Kurdî </title>
        <meta name="description" content="Dîroka kevn a gelê kurd - Ji Medan heya îro" />
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
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Dîroka Kurdî</h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Dîroka kevn û dewlemend a gelê kurd - Ji berê heya îro
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative mb-16">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-amber-500 to-blue-600 hidden md:block"></div>
            
            {historicalPeriods.map((period, index) => (
              <motion.div
                key={period.period}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative mb-12 ${index % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2 md:ml-auto'} md:w-1/2`}
              >
                <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="bg-amber-500 rounded-xl p-3 flex-shrink-0">
                      <period.icon className="text-white" size={28} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{period.period}</h3>
                      <p className="text-amber-600 font-semibold mb-3">{period.years}</p>
                      <p className="text-gray-700 mb-4 font-medium">{period.description}</p>
                      <p className="text-gray-600 leading-relaxed">{period.details}</p>
                    </div>
                  </div>
                </div>
                
                {/* Timeline dot */}
                <div className="hidden md:block absolute top-8 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-amber-500 rounded-full border-4 border-white shadow-lg"></div>
              </motion.div>
            ))}
          </div>

          {/* Important Figures */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Kesayetiyên Girîng</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {importantFigures.map((figure, index) => (
                <motion.div
                  key={figure.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white shadow-lg hover:scale-105 transition-transform duration-300"
                >
                  <h3 className="text-2xl font-bold mb-2">{figure.name}</h3>
                  <p className="text-amber-100 mb-1">{figure.role}</p>
                  <p className="text-sm text-amber-200">{figure.period}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Historical Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl overflow-hidden shadow-2xl mb-16"
          >
            <img 
              className="w-full h-96 object-cover" 
              alt="Dîroka Kurdî"
             src="https://images.unsplash.com/photo-1693282590392-c3ff51dd14e1" />
          </motion.div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl shadow-xl p-12 text-center text-white"
          >
            <p className="text-3xl font-bold mb-4 italic">
              "Dîrok û çand hêza me ye"
            </p>
            <p className="text-xl text-amber-100">
              Em divê dîroka xwe nas bikin û ji wê hîn bibin
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default History;