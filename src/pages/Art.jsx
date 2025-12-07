import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Palette, Pen, Camera, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
// Servisimizi çağırıyoruz
import { artService } from '../services/artService';

const Art = () => {
  const [artData, setArtData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // İkon Eşleştirme Haritası (Mapping)
  // Veritabanındaki 'category' ismine göre ikon seçer
  const iconMap = {
    'wene': Palette,
    'edebiyat': Pen,
    'sinema': Camera,
    'destkar': Sparkles,
    'default': Palette
  };

  useEffect(() => {
    fetchArt();
  }, []);

  const fetchArt = async () => {
    setLoading(true);
    // Servis katmanını kullanıyoruz
    const response = await artService.getArtContent();

    if (response.success) {
      setArtData(response.data);
    } else {
      setError(response.error);
    }
    setLoading(false);
  };

  // Kategoriye göre ikon getiren yardımcı fonksiyon
  const getIcon = (category) => {
    const key = category?.toLowerCase() || 'default';
    const IconComponent = iconMap[key] || iconMap['default'];
    return IconComponent;
  };

  // Sabit listeler (Bunlar şimdilik statik kalabilir veya ileride DB'ye alınabilir)
  const famousArtists = [
    { name: 'Ehmedê Xanî', field: 'Helbestvan û Zanyar', work: 'Mem û Zîn' },
    { name: 'Cigerxwîn', field: 'Helbestvan', work: 'Helbesta Azadiyê' },
    { name: 'Yılmaz Güney', field: 'Derhêner', work: 'Yol' },
    { name: 'Şêrko Bêkes', field: 'Helbestvan', work: 'Helbesta Nûjen' },
    { name: 'Bahman Ghobadi', field: 'Derhêner', work: 'Kela Kaseyan' },
    { name: 'Mehmet Uzun', field: 'Nivîskar', work: 'Bîra Qederê' }
  ];

  return (
    <>
      <Helmet>
        <title>Huner - YTU Kurdî </title>
        <meta name="description" content="Hunera kurdî - Wêne, helbest, sînema û hunerên destî" />
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
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Hunera Kurdî</h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Huner û hunermendên kurd - Wêne, helbest, sînema û hunerên destî
            </p>
          </motion.div>

          {/* Hata Mesajı */}
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-8 flex items-center gap-2 justify-center">
              <AlertCircle /> <span>{error}</span>
            </div>
          )}

          {/* Yükleniyor */}
          {loading ? (
            <div className="flex justify-center h-64 items-center">
              <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
          ) : (
            /* DİNAMİK İÇERİK (Supabase'den Gelenler) */
            <div className="space-y-12 mb-16">
              {artData.length === 0 ? (
                <p className="text-center text-gray-500">Hîn naverok nehatiye barkirin.</p>
              ) : (
                artData.map((art, index) => {
                  const Icon = getIcon(art.category); // Dinamik İkon
                  
                  return (
                    <motion.div
                      key={art.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 bg-white rounded-2xl shadow-xl overflow-hidden`}
                    >
                      <div className="md:w-1/2">
                        <img 
                          className="w-full h-80 object-cover hover:scale-105 transition-transform duration-500" 
                          alt={art.title}
                          src={art.image} 
                        />
                      </div>
                      <div className="md:w-1/2 p-8 flex flex-col justify-center">
                        <div className="bg-pink-500 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                          <Icon className="text-white" size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">{art.title}</h2>
                        <p className="text-lg text-pink-600 font-semibold mb-4 capitalize">{art.category}</p>
                        <p className="text-gray-700 leading-relaxed text-lg">{art.description}</p>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          )}

          {/* Famous Artists (Statik Liste) */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Hunermendên Navdar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {famousArtists.map((artist, index) => (
                <motion.div
                  key={artist.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="bg-gradient-to-br from-pink-500 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Palette className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{artist.name}</h3>
                  <p className="text-pink-600 font-semibold mb-1">{artist.field}</p>
                  <p className="text-gray-600 text-sm">{artist.work}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Galeri (Dinamik Veriden Besleniyor) */}
          {artData.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Galeriya Hunerî</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {artData.map((art, index) => (
                  <motion.div
                    key={art.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    <img 
                      className="w-full h-64 object-cover" 
                      alt={art.title}
                      src={art.image} 
                    />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl shadow-xl p-12 text-center text-white"
          >
            <p className="text-3xl font-bold mb-4 italic">"Huner rûhê gelekî ye"</p>
            <p className="text-xl text-pink-100">Huner û çand ji hev cuda nînin</p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Art;