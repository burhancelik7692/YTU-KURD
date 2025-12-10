import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Key, LogIn, UserPlus, AlertTriangle, Loader2, Home, Settings, CheckCircle, EyeOff, ShieldCheck, Users, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';
import { useLanguage } from '../../context/LanguageContext';
import { doc, getDoc } from 'firebase/firestore'; 
import { db } from '../../firebase'; // Firestore kontrolü için db eklendi

// Google Logo
const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

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

const AuthPage = () => {
    // --- STATE ---
    const [authMode, setAuthMode] = useState('user'); // 'user' | 'admin'
    const [currentTab, setCurrentTab] = useState('login'); 
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState(null); 
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const navigate = useNavigate();
    const { login, register, resetPassword, googleLogin, logout } = useAuth();
    const { userData, loading: userLoading } = useUser();
    const { t, lang, changeLanguage } = useLanguage(); 

    // Yönlendirme Kontrolü
    useEffect(() => {
        if (!userLoading && userData?.uid) { 
             if (userData.role === 'admin') {
                navigate('/admin/dashboard');
             } else {
                navigate('/user');
             }
        }
    }, [userData, userLoading, navigate]);

    // Mesaj Temizleme
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);
    
    // Tab/Mod değişince inputları temizle
    useEffect(() => {
        setEmail('');
        setPassword('');
        setName('');
        setMessage(null);
    }, [currentTab, authMode]);

    // Firebase Hataları
    const handleFirebaseError = (error) => {
        let errorMsg = t('error_generic');
        switch (error.code) {
            case 'auth/invalid-email': errorMsg = t('error_invalid_email'); break;
            case 'auth/user-not-found': errorMsg = t('error_user_not_found'); break;
            case 'auth/wrong-password': errorMsg = t('error_wrong_password'); break;
            case 'auth/email-already-in-use': errorMsg = t('error_email_in_use'); break;
            default: errorMsg = error.message;
        }
        return errorMsg;
    };

    // --- KRİTİK: ROL GÜVENLİK KONTROLÜ ---
    const checkRoleAndLogin = async (userCredential) => {
        const uid = userCredential.user.uid;
        
        // Firestore'dan rolü anında çek
        const userDocRef = doc(db, "users", uid);
        const userDocSnap = await getDoc(userDocRef);
        const role = userDocSnap.exists() ? userDocSnap.data().role : 'standard';

        // 1. SENARYO: Yönetici Panelinden giriş yapılıyor
        if (authMode === 'admin') {
            if (role !== 'admin') {
                await logout(); // Kullanıcıyı hemen at
                throw new Error("NOT_ADMIN");
            }
        } 
        // 2. SENARYO: Üye Panelinden giriş yapılıyor
        else {
            if (role === 'admin') {
                await logout(); // Admin'i at (Admin panelinden girmeli)
                throw new Error("ADMIN_IN_USER_TAB");
            }
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) return setMessage({ type: 'error', text: t('error_generic') });

        setIsLoading(true);
        setMessage(null);
        
        try {
            const userCredential = await login(email, password);
            
            // Güvenlik Kontrolü
            try {
                await checkRoleAndLogin(userCredential);
            } catch (roleError) {
                if (roleError.message === "NOT_ADMIN") {
                    setMessage({ type: 'error', text: t('error_user_trying_admin') });
                    setIsLoading(false);
                    return;
                }
                if (roleError.message === "ADMIN_IN_USER_TAB") {
                    setMessage({ type: 'error', text: t('error_admin_trying_user') });
                    setIsLoading(false);
                    return;
                }
            }

        } catch (error) {
            setMessage({ type: 'error', text: handleFirebaseError(error) });
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            const result = await googleLogin();
            // Google ile girişte de rol kontrolü yapabiliriz
            try {
                await checkRoleAndLogin(result);
            } catch (roleError) {
                if (roleError.message === "NOT_ADMIN") {
                     setMessage({ type: 'error', text: t('error_user_trying_admin') });
                     return;
                }
                // Admin Google ile user panelinden girerse sorun etmeyebiliriz (tercih meselesi), 
                // ama katı kural istiyorsan burayı da açabilirsin.
                // Şimdilik Google girişlerinde kullanıcıyı üzmemek için sadece Admin paneli korumasını aktif ettik.
            }
        } catch (error) {
            setMessage({ type: 'error', text: handleFirebaseError(error) });
            setIsLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!email || !password || !name) return setMessage({ type: 'error', text: t('error_generic') });

        setIsLoading(true);
        try {
            // Sadece 'user' modunda kayıt olunabilir ve rol 'standard' olur.
            await register(email, password, name, 'standard'); 
            setMessage({ type: 'success', text: t('success_register') });
            setCurrentTab('login'); 
        } catch (error) {
            setMessage({ type: 'error', text: handleFirebaseError(error) });
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!email) return setMessage({ type: 'error', text: t('error_invalid_email') });

        setIsLoading(true);
        try {
            await resetPassword(email); 
            setMessage({ type: 'success', text: t('success_reset') });
        } catch (error) {
            setMessage({ type: 'error', text: handleFirebaseError(error) });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 overflow-hidden relative">
            <Helmet><title>{authMode === 'admin' ? t('admin_title') : t('login_title')} | YTU Kurdî</title></Helmet>

            {/* Arkaplan Efektleri */}
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute w-96 h-96 bg-blue-600 rounded-full opacity-10 blur-3xl -top-20 -left-20 pointer-events-none" />
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute w-80 h-80 bg-yellow-500 rounded-full opacity-10 blur-3xl -bottom-20 -right-20 pointer-events-none" />

            {/* ANA KART */}
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-lg relative z-10"
            >
                <div className="bg-slate-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-700 overflow-hidden">
                    
                    {/* Header: Home Linki ve Dil Değiştirici */}
                    <div className="p-6 pb-0 flex justify-between items-center">
                        <Link to="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
                            <Home size={18} /> {t('back_to_home')}
                        </Link>

                        {/* DİL SEÇİCİ */}
                        <div className="flex items-center gap-1 bg-slate-900/50 rounded-lg p-1 border border-slate-700">
                            <Globe size={14} className="text-slate-400 ml-1" />
                            {['KU', 'TR', 'EN'].map(code => (
                                <button
                                    key={code}
                                    onClick={() => changeLanguage(code)}
                                    className={`px-2 py-1 rounded text-xs font-bold transition-all ${lang === code ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    {code}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 pt-4">
                        
                        {/* MOD SEÇİM BUTONLARI */}
                        <div className="flex bg-slate-900/50 p-1.5 rounded-xl mb-8 border border-slate-700/50">
                            <button 
                                onClick={() => setAuthMode('user')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${authMode === 'user' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                                <Users size={18} />
                                {t('role_standard') || "Üye"}
                            </button>
                            <button 
                                onClick={() => setAuthMode('admin')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${authMode === 'admin' ? 'bg-yellow-500 text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                                <ShieldCheck size={18} />
                                {t('role_admin') || "Yönetici"}
                            </button>
                        </div>

                        {/* BAŞLIK */}
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-black text-white mb-2">
                                {authMode === 'admin' ? t('admin_title') : (currentTab === 'register' ? t('register_title') : t('login_title'))}
                            </h1>
                            <p className="text-slate-400 text-sm">
                                {authMode === 'admin' ? t('auth_desc_admin') : t('auth_desc_standard')}
                            </p>
                        </div>

                        {message && <Notification message={message.text} type={message.type} />}

                        {/* FORM ALANI */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={authMode + currentTab} 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {authMode === 'admin' ? (
                                    /* --- ADMIN FORMU --- */
                                    <form onSubmit={handleLogin} className="space-y-4">
                                        <FormInput icon={<Mail size={20} />} type="email" placeholder={t('email_placeholder')} value={email} onChange={(e) => setEmail(e.target.value)} />
                                        <FormInput icon={<Lock size={20} />} type="password" placeholder={t('password_placeholder')} value={password} onChange={(e) => setPassword(e.target.value)} isPassword={true} isVisible={isPasswordVisible} toggleVisible={() => setIsPasswordVisible(!isPasswordVisible)} />
                                        
                                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading} className="w-full py-3.5 bg-yellow-500 text-slate-900 font-bold rounded-xl shadow-lg hover:bg-yellow-400 transition disabled:opacity-50 flex items-center justify-center gap-2">
                                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Settings size={20} />}
                                            {t('admin_title')}
                                        </motion.button>
                                    </form>
                                ) : (
                                    /* --- USER FORMU --- */
                                    <>
                                        {currentTab === 'forgot' ? (
                                            <form onSubmit={handleForgotPassword} className="space-y-4">
                                                <FormInput icon={<Mail size={20} />} type="email" placeholder={t('email_placeholder')} value={email} onChange={(e) => setEmail(e.target.value)} />
                                                <motion.button type="submit" disabled={isLoading} className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition disabled:opacity-50 flex justify-center">
                                                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : t('forgot_button')}
                                                </motion.button>
                                                <div className="text-center"><button type="button" onClick={() => setCurrentTab('login')} className="text-sm text-slate-400 hover:text-white transition">{t('back_to_login')}</button></div>
                                            </form>
                                        ) : (
                                            <form onSubmit={currentTab === 'login' ? handleLogin : handleRegister} className="space-y-4">
                                                {currentTab === 'register' && (
                                                    <FormInput icon={<User size={20} />} type="text" placeholder={t('name_placeholder')} value={name} onChange={(e) => setName(e.target.value)} />
                                                )}
                                                <FormInput icon={<Mail size={20} />} type="email" placeholder={t('email_placeholder')} value={email} onChange={(e) => setEmail(e.target.value)} />
                                                <FormInput icon={<Lock size={20} />} type="password" placeholder={t('password_placeholder')} value={password} onChange={(e) => setPassword(e.target.value)} isPassword={true} isVisible={isPasswordVisible} toggleVisible={() => setIsPasswordVisible(!isPasswordVisible)} />
                                                
                                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading} className={`w-full py-3.5 font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 ${currentTab === 'login' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
                                                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : (currentTab === 'login' ? <LogIn size={20} /> : <UserPlus size={20} />)}
                                                    {currentTab === 'login' ? t('login_button') : t('register_button')}
                                                </motion.button>

                                                {currentTab === 'login' && (
                                                    <motion.button type="button" onClick={handleGoogleLogin} disabled={isLoading} className="w-full py-3.5 bg-white text-slate-700 font-bold rounded-xl shadow hover:bg-slate-100 transition flex items-center justify-center gap-2 disabled:opacity-50">
                                                        <GoogleIcon /> {t('google_login')}
                                                    </motion.button>
                                                )}

                                                <div className="flex flex-col gap-2 text-center text-sm pt-2">
                                                    <button type="button" onClick={() => setCurrentTab('forgot')} className="text-blue-400 hover:text-blue-300 transition">{t('switch_to_forgot')}</button>
                                                    <button type="button" onClick={() => setCurrentTab(currentTab === 'login' ? 'register' : 'login')} className="text-slate-400 hover:text-white transition">
                                                        {currentTab === 'login' ? t('switch_to_register') : t('switch_to_login')}
                                                    </button>
                                                </div>
                                            </form>
                                        )}
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>

                    </div>
                </div>
                
                <p className="text-center text-slate-500 text-xs mt-6">
                    &copy; 2025 YTU Kurdî. Tüm hakları saklıdır.
                </p>
            </motion.div>
        </div>
    );
};

// Yardımcı Input Bileşeni
const FormInput = ({ icon, type, placeholder, value, onChange, isPassword, isVisible, toggleVisible }) => (
    <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
            {icon}
        </div>
        <input
            type={isPassword ? (isVisible ? 'text' : 'password') : type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required
            className="w-full pl-12 pr-12 py-3.5 bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
        />
        {isPassword && (
             <button
                type="button"
                onClick={toggleVisible}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors cursor-pointer"
             >
                {isVisible ? <EyeOff size={18} /> : <Lock size={18} />}
             </button>
        )}
    </div>
);

export default AuthPage;