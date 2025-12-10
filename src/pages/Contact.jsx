import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, MapPin, Send, CheckCircle, Instagram, Youtube, Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { siteContent } from '../data/locales';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const { lang } = useLanguage();
  const formRef = useRef();
  
  // EmailJS Ayarları
  const SERVICE_ID = "service_0hpjfn7";
  const TEMPLATE_ID = "template_2mlwdvd";
  const PUBLIC_KEY = "59FSh2DYoLKksW1Wf";

  // Çeviri verisini çek, yoksa varsayılan boş bir yapı kullan (Hata önlemek için)
  const content = siteContent[lang]?.pages?.tekili || { 
    title: "Têkilî", 
    desc: "Loading...", 
    form: { name: 'Nav', email: 'E-mail', message: 'Peyam', send: 'Bişîne', sending: '...', success: 'OK', error: 'Error' }, 
    info: { addressTitle: 'Address', address: '...', emailTitle: 'Email', follow: 'Follow' } 
  };

  const [status, setStatus] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      .then(() => {
          setStatus('success');
          e.target.reset();
          setTimeout(() => setStatus('idle'), 5000);
      }, (error) => {
          console.error(error);
          setStatus('error');
          setTimeout(() => setStatus('idle'), 5000);
      });
  };

  return (
    <>
      <Helmet>
        <title>{content.title} - YTU Kurdî</title>
        <meta name="description" content={content.desc} />
      </Helmet>

      {/* Ana Kapsayıcı - Dark Mode */}
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          
          {/* Başlık Bölümü */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-center mb-12"
          >
            <div className="inline-block p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4 shadow-sm">
              <Mail size={40} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{content.title}</h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{content.desc}</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* SOL TARA (İletişim Bilgileri) */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.2 }} 
                className="space-y-6"
            >
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 border border-slate-100 dark:border-slate-700 transition-colors">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">{content.info.addressTitle}</h3>
                
                {/* Adres */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg text-blue-600 dark:text-blue-400">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                        {content.info.address}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg text-blue-600 dark:text-blue-400">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white text-sm mb-1">{content.info.emailTitle}</p>
                    <a href="mailto:ytukurdidrive@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline font-medium break-all">
                        ytukurdidrive@gmail.com
                    </a>
                  </div>
                </div>

                {/* Sosyal Medya */}
                <div>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">{content.info.follow}</p>
                  <div className="flex gap-4">
                    <a href="https://instagram.com/ytukurdi" target="_blank" rel="noreferrer" className="bg-slate-100 dark:bg-slate-700 p-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-pink-100 hover:text-pink-600 dark:hover:bg-pink-900/30 dark:hover:text-pink-400 transition">
                      <Instagram size={24} />
                    </a>
                    <a href="https://www.youtube.com/@ytukurdi" target="_blank" rel="noreferrer" className="bg-slate-100 dark:bg-slate-700 p-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition">
                      <Youtube size={24} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Harita */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700 h-64 lg:h-80 transition-colors">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.650490016626!2d28.88724831540456!3d41.02237897929944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cabb7e23b9f9c7%3A0x6c63a56247c16c5b!2zWcSxbZLFsXogVGVrbmlrIMOcbml2ZXJzaXRlc2kgRGF2dXRwYcWfYSBLYW1ww7xzw7w!5e0!3m2!1str!2str!4v1646754023451!5m2!1str!2str" 
                  width="100%" 
                  height="100%" 
                  style={{border:0}} 
                  allowFullScreen="" 
                  loading="lazy" 
                  title="YTU Map"
                  className="dark:opacity-80 dark:grayscale-[50%]" // Haritayı karanlık modda biraz soldur
                ></iframe>
              </div>
            </motion.div>

            {/* SAĞ TARAF (Form) */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.4 }} 
                className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 border border-slate-100 dark:border-slate-700 flex flex-col transition-colors"
            >
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
                {lang === 'KU' ? 'Ji me re binivîse' : (lang === 'TR' ? 'Bize Yazın' : 'Write to Us')}
              </h2>
              
              {status === 'success' ? (
                // Başarılı Mesajı
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-800">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-800/50 text-green-600 dark:text-green-300 rounded-full flex items-center justify-center mb-4"><CheckCircle size={40} /></div>
                  <h3 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-2">{lang === 'KU' ? 'Spas!' : 'Teşekkürler!'}</h3>
                  <p className="text-green-700 dark:text-green-400">{content.form.success}</p>
                </motion.div>
              ) : status === 'error' ? (
                // Hata Mesajı
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-800">
                  <div className="w-20 h-20 bg-red-100 dark:bg-red-800/50 text-red-600 dark:text-red-300 rounded-full flex items-center justify-center mb-4"><AlertCircle size={40} /></div>
                  <h3 className="text-2xl font-bold text-red-800 dark:text-red-300 mb-2">Hata!</h3>
                  <p className="text-red-700 dark:text-red-400">{content.form.error}</p>
                  <button onClick={() => setStatus('idle')} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition">Tekrar Dene</button>
                </motion.div>
              ) : (
                // Form Alanı
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 flex-1">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{content.form.name}</label>
                    <input type="text" name="name" required className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:text-white outline-none transition" placeholder="..." />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{content.form.email}</label>
                    <input type="email" name="email" required className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:text-white outline-none transition" placeholder="nav@mînak.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{content.form.message}</label>
                    <textarea name="message" required rows="5" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:text-white outline-none transition resize-none" placeholder="..."></textarea>
                  </div>
                  <button type="submit" disabled={status === 'sending'} className="w-full py-4 bg-blue-900 dark:bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-800 dark:hover:bg-blue-500 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                    {status === 'sending' ? <><Loader2 className="animate-spin" /> {content.form.sending}</> : <>{content.form.send} <Send size={20} /></>}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;