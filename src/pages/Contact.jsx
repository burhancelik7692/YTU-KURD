import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, MapPin, Send, CheckCircle, Instagram, Youtube, Twitter } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { siteContent } from '../data/locales';

const Contact = () => {
  const { lang } = useLanguage();
  
  const content = siteContent[lang]?.pages?.tekili || { 
    title: "Têkilî", 
    desc: "Loading...", 
    form: {}, 
    info: {} 
  };

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Helmet>
        <title>{content.title} - YTU Kurdî</title>
        <meta name="description" content={content.desc} />
      </Helmet>

      <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          
          <Link to="/" className="inline-flex items-center text-slate-500 hover:text-blue-900 mb-6 transition group">
            <ArrowLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" /> 
            {lang === 'KU' ? 'Vegere' : (lang === 'TR' ? 'Geri' : 'Back')}
          </Link>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-center mb-12"
          >
            <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
              <Mail size={40} className="text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">{content.title}</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">{content.desc}</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
                <h3 className="text-2xl font-bold text-slate-800 mb-6">{content.info.addressTitle}</h3>
                
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-slate-600 font-medium leading-relaxed">
                      {content.info.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{content.info.emailTitle}</p>
                    <a href="mailto:ytukurdidrive@gmail.com" className="text-blue-600 hover:underline">ytukurdidrive@gmail.com</a>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">{content.info.follow}</p>
                  <div className="flex gap-4">
                    <a href="https://instagram.com/ytukurdi" target="_blank" rel="noreferrer" className="bg-slate-100 p-3 rounded-xl text-slate-600 hover:bg-pink-100 hover:text-pink-600 transition">
                      <Instagram size={24} />
                    </a>
                    <a href="https://youtube.com" target="_blank" rel="noreferrer" className="bg-slate-100 p-3 rounded-xl text-slate-600 hover:bg-red-100 hover:text-red-600 transition">
                      <Youtube size={24} />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noreferrer" className="bg-slate-100 p-3 rounded-xl text-slate-600 hover:bg-blue-100 hover:text-blue-500 transition">
                      <Twitter size={24} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 h-64 lg:h-80">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.650490016626!2d28.88724831540456!3d41.02237897929944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cabb7e23b9f9c7%3A0x6c63a56247c16c5b!2zWcSxbZLFsXogVGVrbmlrIMOcbml2ZXJzaXRlc2kgRGF2dXRwYcWfYSBLYW1ww7xzw7w!5e0!3m2!1str!2str!4v1646754023451!5m2!1str!2str" 
                  width="100%" 
                  height="100%" 
                  style={{border:0}} 
                  allowFullScreen="" 
                  loading="lazy"
                  title="YTU Map"
                ></iframe>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 flex flex-col"
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-6">{lang === 'KU' ? 'Ji me re binivîse' : (lang === 'TR' ? 'Bize Yazın' : 'Write to Us')}</h2>
              
              {status === 'success' ? (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-green-50 rounded-2xl border border-green-100">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-green-800 mb-2">{lang === 'KU' ? 'Spas!' : 'Teşekkürler!'}</h3>
                  <p className="text-green-700">{content.form.success}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 flex-1">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{content.form.name}</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition"
                      placeholder="..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{content.form.email}</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition"
                      placeholder="nav@mînak.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{content.form.message}</label>
                    <textarea 
                      name="message"
                      required
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition resize-none"
                      placeholder="..."
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={status === 'sending'}
                    className="w-full py-4 bg-blue-900 text-white rounded-xl font-bold text-lg hover:bg-blue-800 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {status === 'sending' ? (
                      content.form.sending
                    ) : (
                      <>
                        {content.form.send} <Send size={20} />
                      </>
                    )}
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