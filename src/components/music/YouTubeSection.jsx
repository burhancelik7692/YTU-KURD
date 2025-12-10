import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Loader2, Youtube } from 'lucide-react';
import { db } from '../../firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

const YouTubeSection = ({ title }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // YouTube URL'den ID çıkarma fonksiyonu
  const getYouTubeID = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const q = query(
          collection(db, "dynamicContent"),
          where("type", "in", ["video", "music"]), // Hem video hem müzik tiplerini çek
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        
        const videoList = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(item => item.url && getYouTubeID(item.url)); // Sadece geçerli YouTube linkleri

        setVideos(videoList);
      } catch (err) {
        console.error("Video çekme hatası:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) return <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-red-600" /></div>;
  if (videos.length === 0) return null;

  return (
    <div className="py-12">
      <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-8 flex items-center gap-3">
        <Youtube className="text-red-600" size={32} /> {title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, index) => {
          const videoId = getYouTubeID(video.url);
          return (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative rounded-2xl overflow-hidden shadow-lg cursor-pointer aspect-video bg-black"
              onClick={() => setSelectedVideo(videoId)}
            >
              {/* Küçük Resim (Thumbnail) */}
              <img 
                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} 
                alt={video.title} 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-300"
              />
              
              {/* Play İkonu */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-red-600/90 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-xl">
                  <Play size={32} fill="currentColor" />
                </div>
              </div>

              {/* Başlık */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                <h3 className="text-white font-bold text-sm line-clamp-1">{video.title || 'Video'}</h3>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Video Modal (Lightbox) */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <button className="absolute top-6 right-6 text-white/70 hover:text-red-500 transition p-2 bg-white/10 rounded-full">
              <X size={32} />
            </button>
            <div className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <iframe 
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1&rel=0`} 
                title="YouTube video player" 
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default YouTubeSection;