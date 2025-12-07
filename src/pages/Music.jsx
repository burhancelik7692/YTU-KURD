import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Music as MusicIcon, Play, Pause, Loader2, AlertCircle } from 'lucide-react';
// ARTIK SUPABASE DEĞİL, SERVİSİMİZİ ÇAĞIRIYORUZ
import { musicService } from '../services/musicService';

const Music = () => {
  const [musicList, setMusicList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Hata durumunu tutmak için
  const [playing, setPlaying] = useState(null);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    fetchMusic();
  }, []);

  // Kod ne kadar temizlendi, görüyor musun?
  const fetchMusic = async () => {
    setLoading(true);
    
    // Servisten veriyi iste
    const response = await musicService.getAllMusic();

    if (response.success) {
      // Başarılıysa listeyi güncelle
      setMusicList(response.data);
    } else {
      // Başarısızsa hatayı göster
      setError(response.error);
    }
    
    setLoading(false);
  };

  const togglePlay = (url, id) => {
    if (playing === id) {
      audio.pause();
      setPlaying(null);
    } else {
      if (audio) audio.pause();
      const newAudio = new Audio(url);
      newAudio.play();
      setAudio(newAudio);
      setPlaying(id);
      newAudio.onended = () => setPlaying(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Muzîk - YTU Kurdî</title>
        <meta name="description" content="Muzîka kurdî guhdarî bike." />
      </Helmet>

      <div className="min-h-screen py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Arşîva Muzîkê</h1>
            <p className="text-xl text-gray-600">Guhdarî bike û kêf bike</p>
          </motion.div>

          {/* HATA VARSA GÖSTER (Error Handling UI) */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-8 flex items-center justify-center gap-2">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {!error && musicList.length === 0 ? (
                <p className="text-center col-span-3 text-gray-500">Hîn muzîk nehatiye barkirin.</p>
              ) : (
                musicList.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="h-48 bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center relative">
                      {/* Servisten gelen formatlanmış 'imageUrl' kullanılıyor */}
                      {item.imageUrl ? (
                         <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                         <MusicIcon className="text-white/50 w-24 h-24" />
                      )}
                      
                      <button
                        onClick={() => togglePlay(item.url, item.id)}
                        className="absolute bg-white/90 p-4 rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer group-hover:bg-white"
                      >
                        {playing === item.id ? (
                          <Pause className="text-blue-600 fill-current" size={32} />
                        ) : (
                          <Play className="text-blue-600 fill-current ml-1" size={32} />
                        )}
                      </button>
                    </div>

                    <div className="p-6">
                      <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">
                        {item.category}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 mt-2 line-clamp-1">
                        {item.title}
                      </h3>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Music;