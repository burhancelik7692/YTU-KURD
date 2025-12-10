import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Youtube, ExternalLink } from 'lucide-react';

// Örnek YouTube Video Listesi (ID'leri güncelleyebilirsiniz)
const VIDEOS = [
  { id: '7aaWkC9F9Mw', title: 'Keçê Kurdan - Aynur Doğan' },
  { id: 't42-7p0_rjY', title: 'Xewna Bajarekî - Mem Ararat' },
  { id: 'C97JtKkHQA4', title: 'Şivan Perwer - Helebçe' },
  { id: '1swgq9OXHqQ', title: 'Ciwan Haco - Nesrîn' },
  { id: 'P3G23Yk3XNY', title: 'Ahmet Kaya - Karwan' },
  { id: 'L_dJ-G2_HZA', title: 'Rojda - Disa Dilan' }
];

const YouTubeSection = ({ title }) => {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <section className="py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-red-600 rounded-xl text-white shadow-lg shadow-red-500/30">
            <Youtube size={28} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{title}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {VIDEOS.map((video, index) => (
          <motion.div 
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative rounded-2xl overflow-hidden shadow-lg bg-black aspect-video cursor-pointer border border-slate-200 dark:border-slate-700"
            onClick={() => setActiveVideo(video.id)}
          >
            {/* Eğer video aktifse Iframe göster, değilse Kapak Resmi göster */}
            {activeVideo === video.id ? (
              <iframe 
                src={`https://www.youtube.com/embed/${video.id}?autoplay=1`} 
                title={video.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            ) : (
              <>
                <img 
                  src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`} 
                  alt={video.title} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-red-600/90 rounded-full flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                    <Play size={32} fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent">
                    <p className="text-white font-bold truncate">{video.title}</p>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <a 
            href="https://www.youtube.com/results?search_query=kurdish+music" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-red-600 dark:text-red-400 font-bold hover:underline"
        >
            Li ser YouTube bibîne (YouTube'da daha fazlası) <ExternalLink size={16} />
        </a>
      </div>
    </section>
  );
};

export default YouTubeSection;