import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Key, LogIn, UserPlus, AlertTriangle, Loader2, Home, Settings, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';
import { useLanguage } from '../../context/LanguageContext';

// Dil/Çeviri Verileri
const translations = {
    tr: {
        loginTitle: "Üye Girişi",
        adminTitle: "Yönetici Girişi",
        registerTitle: "Hesap Oluştur",
        forgotTitle: "Şifremi Unuttum",
        emailPlaceholder: "E-posta Adresi",
        passwordPlaceholder: "Şifre",
        namePlaceholder: "Kullanıcı Adı",
        loginButton: "Giriş Yap",
        registerButton: "Hesap Oluştur",
        forgotButton: "Şifre Sıfırlama Bağlantısı Gönder",
        switchToRegister: "Hesabın yok mu? Kayıt ol.",
        switchToLogin: "Zaten bir hesabın var mı? Giriş yap.",
        switchToForgot: "Şifreni mi unuttun?",
        backToLogin: "Giriş sayfasına geri dön",
        error: "Hata",
        success: "Başarılı",
        adminWarning: "Bu alan sadece yetkili personel içindir.",
        standardLoginText: "Kütüphane, Favoriler ve Oyunları Kaydetme",
        resetSent: "Şifre sıfırlama e-postası gönderildi. Lütfen e-postanı kontrol et.",
    },
    ku: {
        loginTitle: "Têketina Endam",
        adminTitle: "Têketina Rêveber",
        registerTitle: "Hesabê Çêke",
        forgotTitle: "Şîfreya Xwe Ji Bîr Bike",
        emailPlaceholder: "Navnîşana E-nameyê",
        passwordPlaceholder: "Şîfre",
        namePlaceholder: "Navê Bikarhêner",
        loginButton: "Têkeve",
        registerButton: "Hesabê Çêke",
        forgotButton: "Girêdana Sifirkirina Şîfreyê Bişîne",
        switchToRegister: "Hesabê te tune ye? Qeyd bike.",
        switchToLogin: "Jixwe hesabê te heye? Têkeve.",
        switchToForgot: "Te şîfreya xwe ji bîr kir?",
        backToLogin: "Vegere rûpela têketinê",
        error: "Şaşî",
        success: "Serkeftî",
        adminWarning: "Ev qad tenê ji bo personelên destûrdar e.",
        standardLoginText: "Pirtûkxane, Bijareyên Xwe û Lîstikan tomar bike.",
        resetSent: "E-nameya sifirkirina şîfreyê hate şandin. Ji kerema xwe e-nameya xwe kontrol bike.",
    }
};

// =========================================================
// 🧩 Yardımcı Bileşen: Bildirim Kutusu
// =========================================================
const Notification = ({ message, type }) => {
    const isError = type === 'error';
    const bgColor = isError ? 'bg-red-500' : 'bg-green-500';
    const icon = isError ? <AlertTriangle size={18} /> : <CheckCircle size={18} />;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`flex items-center p-3 rounded-lg text-white font-medium mb-4 shadow-xl ${bgColor}`}
        >
            {icon}
            <span className="ml-3 text-sm">{message}</span>
        </motion.div>
    );
};

// =========================================================
// 🔑 Ana Bileşen: AuthPage (Giriş/Kayıt/Şifre Sıfırlama)
// =========================================================
const AuthPage = () => {
    const [currentTab, setCurrentTab] = useState('login'); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState(null); 
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const navigate = useNavigate();
    // NOT: AuthContext'te register ve resetPassword fonksiyonlarının tanımlı olması gerekir.
    const { login, register, resetPassword } = useAuth();
    const { userData, loading: userLoading } = useUser();
    const { lang } = useLanguage(); 
    const t = translations[lang] || translations.tr;

    const isAdmin = userData?.role === 'admin';

    // Kullanıcı zaten giriş yapmışsa yönlendir
    useEffect(() => {
        if (!userLoading && userData?.userId && userData?.userId !== 'guest_') {
            if (isAdmin) {
                navigate('/admin/dashboard');
            } else {
                navigate('/user');
            }
        }
    }, [userData, userLoading, isAdmin, navigate]);

    // Hata/Başarı mesajını 5 saniye sonra temizle
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);
    
    // Sekme değiştiğinde form ve mesajları sıfırla
    useEffect(() => {
        setEmail('');
        setPassword('');
        setName('');
        setMessage(null);
    }, [currentTab]);


    const handleLogin = async (e, roleType) => {
        e.preventDefault();
        if (!email || !password) return setMessage({ type: 'error', text: t.error + ": Lütfen tüm alanları doldurun." });

        setIsLoading(true);
        setMessage(null);
        
        try {
            // Firebase Auth işlemi
            await login(email, password);

            // Başarılı girişten sonra yönlendirme useEffect'te yapılır.
            // (userData'nın çekilip rolün kontrol edilmesi beklenir)

        } catch (error) {
            let errorText = t.error + ": E-posta veya şifre yanlış.";
            if (roleType === 'admin') {
                errorText = t.error + ": Yönetici kimlik bilgileri yanlış.";
            }
            setMessage({ type: 'error', text: errorText });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!email || !password || !name) return setMessage({ type: 'error', text: t.error + ": Lütfen tüm alanları doldurun." });

        setIsLoading(true);
        setMessage(null);
        try {
            // Register işlemi Firebase'de kullanıcıyı 'standard' rolü ile kaydeder.
            await register(email, password, name, 'standard'); 
            setMessage({ type: 'success', text: t.registerSuccess });
            setCurrentTab('login'); 
        } catch (error) {
             let errorText = t.error + ": Bu e-posta adresi zaten kullanılıyor.";
            setMessage({ type: 'error', text: errorText });
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!email) return setMessage({ type: 'error', text: t.error + ": Lütfen e-posta adresinizi girin." });

        setIsLoading(true);
        setMessage(null);
        try {
            await resetPassword(email); 
            setMessage({ type: 'success', text: t.resetSent });
        } catch (error) {
            setMessage({ type: 'error', text: t.error + ": " + error.message });
        } finally {
            setIsLoading(false);
        }
    };


    const renderStandardForm = () => {
        const formVariants = {
            hidden: { opacity: 0, y: 20, transition: { duration: 0.3 } },
            visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        };
        
        // Form Başlıkları
        const currentFormTitle = 
            currentTab === 'login' ? t.loginTitle : 
            currentTab === 'register' ? t.registerTitle : t.forgotTitle;

        if (currentTab === 'login' || currentTab === 'register' || currentTab === 'forgot') {
             return (
                <motion.div key={currentTab} variants={formVariants} initial="hidden" animate="visible" exit="hidden" className="w-full">
                    <h2 className="text-2xl font-bold text-white mb-6">{currentFormTitle}</h2>
                    
                    <AnimatePresence mode="wait">
                        {currentTab === 'forgot' ? (
                            // Şifremi Unuttum Formu
                            <motion.form key="forgot-form" onSubmit={handleForgotPassword} className="space-y-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <FormInput icon={<Mail size={20} />} type="email" placeholder={t.emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} />
                                <motion.button type="submit" disabled={isLoading} className="w-full flex items-center justify-center px-4 py-3 bg-yellow-600 text-white font-semibold rounded-xl shadow-lg hover:bg-yellow-700 transition duration-300 disabled:opacity-50">
                                    {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Key size={20} className="mr-2" />}
                                    {t.forgotButton}
                                </motion.button>
                                <div className="text-center mt-4"><button type="button" onClick={() => setCurrentTab('login')} className="text-white/70 hover:text-white transition duration-200 text-sm">{t.backToLogin}</button></div>
                            </motion.form>

                        ) : (
                            // Giriş veya Kayıt Formu
                            <motion.form key="standard-form" onSubmit={currentTab === 'login' ? (e) => handleLogin(e, 'standard') : handleRegister} className="space-y-5">
                                {currentTab === 'register' && <FormInput icon={<User size={20} />} type="text" placeholder={t.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} />}
                                <FormInput icon={<Mail size={20} />} type="email" placeholder={t.emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} />
                                <FormInput icon={<Lock size={20} />} type="password" placeholder={t.passwordPlaceholder} value={password} onChange={(e) => setPassword(e.target.value)} isPassword={true} isVisible={isPasswordVisible} toggleVisible={() => setIsPasswordVisible(!isPasswordVisible)} />
                                
                                <motion.button type="submit" disabled={isLoading} className={`w-full flex items-center justify-center px-4 py-3 font-semibold rounded-xl shadow-lg transition duration-300 disabled:opacity-50 ${currentTab === 'login' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}>
                                    {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : (currentTab === 'login' ? <LogIn size={20} className="mr-2" /> : <UserPlus size={20} className="mr-2" />)}
                                    {currentTab === 'login' ? t.loginButton : t.registerButton}
                                </motion.button>
                                
                                <div className="flex justify-between text-sm mt-4">
                                    <button type="button" onClick={() => setCurrentTab('forgot')} className="text-blue-400 hover:text-blue-300 transition duration-200">{t.switchToForgot}</button>
                                    <button type="button" onClick={() => setCurrentTab(currentTab === 'login' ? 'register' : 'login')} className="text-white/70 hover:text-white transition duration-200">
                                        {currentTab === 'login' ? t.switchToRegister : t.switchToLogin}
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>
             );
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 overflow-hidden">
            <Helmet><title>{t.loginTitle} | YTU Kurdî</title></Helmet>

            {/* Arkaplan Işık Efekti */}
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl -top-20 -left-20"
            />
            <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute w-80 h-80 bg-yellow-500 rounded-full opacity-10 blur-3xl -bottom-20 -right-20"
            />

            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10"
            >
                
                {/* SOL TARAF: Standart Kullanıcı Formları */}
                <div className="lg:col-span-2 bg-slate-800/80 backdrop-blur-md rounded-3xl p-10 shadow-2xl border border-slate-700/50 relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-bl-3xl"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-black text-white">{t.loginTitle}</h1>
                            <Link to="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm">
                                <Home size={18} /> Ana Sayfa
                            </Link>
                        </div>
                        
                        {message && <Notification message={message.text} type={message.type} />}

                        <p className="text-sm text-slate-400 mb-4">{t.standardLoginText}</p>
                        <AnimatePresence mode="wait">
                            {renderStandardForm()}
                        </AnimatePresence>
                    </div>
                </div>

                {/* SAĞ TARAF: Yönetici Girişi */}
                <div className="lg:col-span-1 bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-700 relative overflow-hidden flex flex-col justify-center">
                    
                    {/* Arka Plan Dekor */}
                    <div className="absolute top-0 left-0 w-full h-full bg-yellow-500/10 opacity-10"></div>

                    <div className="flex items-center gap-3 mb-6 relative z-10">
                         <Lock size={32} className="text-yellow-500" />
                         <h2 className="text-2xl font-black text-white">{t.adminTitle}</h2>
                    </div>

                    <p className="text-slate-400 text-sm mb-6 relative z-10">
                        {t.adminWarning}
                    </p>

                    <form onSubmit={(e) => handleLogin(e, 'admin')} className="space-y-4">
                        <FormInput icon={<Mail size={20} />} type="email" placeholder={t.emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} />
                        <FormInput icon={<Lock size={20} />} type="password" placeholder={t.passwordPlaceholder} value={password} onChange={(e) => setPassword(e.target.value)} isPassword={true} isVisible={isPasswordVisible} toggleVisible={() => setIsPasswordVisible(!isPasswordVisible)} />
                        
                        <motion.button type="submit" disabled={isLoading} className="w-full py-3 bg-yellow-500 text-slate-900 font-bold rounded-xl shadow-lg hover:bg-yellow-400 transition disabled:opacity-50">
                            {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Settings size={20} className="mr-2" />}
                            {t.adminTitle}
                        </motion.button>
                    </form>
                </div>
                
            </motion.div>
        </div>
    );
};

// =========================================================
// 🧩 Yardımcı Bileşenler
// =========================================================

// Form Giriş Alanı (Geliştirilmiş)
const FormInput = ({ icon, type, placeholder, value, onChange, isPassword, isVisible, toggleVisible }) => (
    <div className="relative flex items-center border border-slate-700 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/50 transition duration-300">
        <div className="absolute left-4 text-slate-400">{icon}</div>
        <input
            type={isPassword ? (isVisible ? 'text' : 'password') : type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required
            className="w-full pl-12 pr-12 py-3 bg-slate-700/50 text-white placeholder-slate-400 rounded-xl focus:outline-none"
        />
        {isPassword && (
             <button
                type="button"
                onClick={toggleVisible}
                className="absolute right-4 text-slate-500 hover:text-white transition-colors"
             >
                {isVisible ? <EyeOff size={20} /> : <Lock size={20} />}
             </button>
        )}
    </div>
);

export default AuthPage;