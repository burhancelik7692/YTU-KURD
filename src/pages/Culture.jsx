import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Sparkles, Users, Heart, Globe } from 'lucide-react';

const Culture = () => {
  const culturalAspects = [
    {
      icon: Sparkles,
      title: 'Newroz',
      description: 'Sala Nû ya Kurdî',
      content: 'Newroz (21ê Adarê) cejna herî girîng a kurdan e. Ev cejn sala nû ya kurdî ye û bi agir û govend tê pîrozkirin. Newroz sembolê azadî û nûbûnê ye.',
      // Newroz ateşi ve kutlama görseli
      image: '/newroz.png'
    },
    {
      icon: Users,
      title: 'Govend',
      description: 'Dansa Kevneşopî ya Kurdî',
      content: 'Govend dansa tradîsyonel a kurdan e. Mirov bi dest girtin û bi rêzikî diherikin. Her herêmek govenda xwe ya taybetî heye. Govend di hemû cejnan de tê kirin.',
      // Kalabalık, el ele tutuşmuş insanlar görseli
      image: '/govend.jpg'
    },
    {
      icon: Heart,
      title: 'Cilên Neteweyî',
      description: 'Kincên Tradîsyonel',
      content: 'Cilên kurdî gelek rengîn û xweşik in. Jin şal û krasên bi reng li xwe dikin, mêr jî şal û pantolên fireh li xwe dikin. Her herêmek cilên xwe yên taybetî hene.',
      // Geleneksel, renkli kumaş ve kıyafet dokusu görseli
      image: '/cilen neteweyi.jpg'
    },
    {
      icon: Globe,
      title: 'Xwarin û Vexwarin',
      description: 'Xwarinên Kurdî',
      content: 'Xwarinên kurdî gelek lezîz in. Biryani, dolma, kufte, û naan xwarinên navdar in. Çay û dew jî vexwarinên herî populer in. Mêvandarî di çanda kurdî de gelek girîng e.',
      // Zengin bir sofra görseli
      image: '/xwarin u vexwarin.png'
    }
  ];

  const traditions = [
    { title: 'Dengbêj', description: 'Stranbêjên kevneşopî yên kurdî' },
    { title: 'Çîrokbêj', description: 'Kesên ku çîrokên kevn vedibêjin' },
    { title: 'Mêvandarî', description: 'Pêşwaziya germ ji mêvanan' },
    { title: 'Dawet', description: 'Zewacên tradîsyonel ên kurdî' },
    { title: 'Soz', description: 'Peymana kevneşopî' },
    { title: 'Kilam', description: 'Stranên gelêrî yên kurdî' }
  ];

  return (
    <>
      <Helmet>
        <title>Çand - YTU Kurdî </title>
        <meta name="description" content="Çanda dewlemend a gelê kurd - Newroz, govend, cilên neteweyî û tradîsyonên me" />
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
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Çanda Kurdî</h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Çanda dewlemend û kevneşopî ya gelê kurd - Tradîsyon, cejn û jiyana me
            </p>
          </motion.div>

          {/* Cultural Aspects */}
          <div className="space-y-12 mb-16">
            {culturalAspects.map((aspect, index) => (
              <motion.div
                key={aspect.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 bg-white rounded-2xl shadow-xl overflow-hidden`}
              >
                <div className="md:w-1/2">
                  {/* BURADA DÜZELTME YAPILDI: Artık her kart kendi resmini kullanıyor */}
                  <img 
                    className="w-full h-80 object-cover hover:scale-105 transition-transform duration-500" 
                    src={aspect.image}
                    alt={aspect.title}
                  />
                </div>
                <div className="md:w-1/2 p-8 flex flex-col justify-center">
                  <div className="bg-emerald-500 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                    <aspect.icon className="text-white" size={32} />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">{aspect.title}</h2>
                  <p className="text-lg text-emerald-600 font-semibold mb-4">{aspect.description}</p>
                  <p className="text-gray-700 leading-relaxed text-lg">{aspect.content}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Traditions Grid */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Tradîsyonên Me</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {traditions.map((tradition, index) => (
                <motion.div
                  key={tradition.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl p-6 text-white hover:scale-105 transition-transform duration-300 shadow-lg"
                >
                  <h3 className="text-2xl font-bold mb-2">{tradition.title}</h3>
                  <p className="text-emerald-100">{tradition.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Quote Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl shadow-xl p-12 text-center text-white"
          >
            <p className="text-3xl font-bold mb-4 italic">
              "Çand û ziman canê gelekî ne"
            </p>
            <p className="text-xl text-blue-100">
              Gotineke kurdî
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Culture;