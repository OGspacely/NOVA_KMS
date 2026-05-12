import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabase.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Premium scenes based on the specific "Harvard/Apple" brand visual requirements
const premiumScenes = [
  {
    image: "/login-scenes/classroom.png",
    title: "Classroom Focus",
    description: "Intellectually vibrant environments designed for focused, aspirational learning."
  },
  {
    image: "/login-scenes/campus.png",
    title: "Campus Life",
    description: "Uplifting and community-driven campus experiences at the heart of excellence."
  }
];

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Student');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [logoError, setLogoError] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser } = useAuth();

  // Check for error in location state (e.g. from Layout timeout)
  useEffect(() => {
    if (location.state?.error) {
      setError(location.state.error);
      // Clear the state so the error doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Redirect if already logged in
  useEffect(() => {
    if (authUser) {
      navigate('/');
    }
  }, [authUser, navigate]);

  // Faster animation cycle (4 seconds instead of 6)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % premiumScenes.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setError('');
  }, [isLogin, isForgotPassword]);

  const checkPasswordStrength = (pwd: string) => {
    const length = pwd.length;
    const hasNumber = /\d/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);

    if (length < 8) {
      return 'weak';
    }

    if (length > 12 && hasNumber && hasUpper && hasLower && hasSymbol) {
      return 'strong';
    }

    if (hasNumber && hasUpper && hasLower) {
      return 'medium';
    }

    return 'weak';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              role,
            }
          }
        });
        if (error) throw error;
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate('/');
        } else {
          setError('Account created! Please check your email for verification.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      setError('');
      if (!isLogin && !role) {
        setError('Please select a role before signing up.');
        return;
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider.toLowerCase() as any,
        options: {
          redirectTo: window.location.origin,
          data: !isLogin ? { role } : undefined
        }
      });
      if (error) throw error;
    } catch (err: any) {
      console.error(err);
      setError(err.message || `Failed to initialize ${provider} login.`);
    }
  };

  const LogoFallback = () => (
    <div className="flex items-center gap-2">
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#0055A4]">
        <path d="M16 2L19.5 12.5L30 16L19.5 19.5L16 30L12.5 19.5L2 16L12.5 12.5L16 2Z" fill="currentColor"/>
        <circle cx="16" cy="16" r="4" fill="#E89B2D"/>
      </svg>
      <span className="text-2xl font-black tracking-tighter text-gray-900">NOVA</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-2 sm:p-4 md:p-8 flex items-center justify-center font-sans">
      <div className="w-full max-w-[1200px] bg-white rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,_0,_0,_0.05)] overflow-hidden flex flex-col lg:flex-row min-h-0 lg:min-h-[750px] border border-gray-100">
        
        {/* Cinematic Panel - Top on mobile/tablet, Left on desktop */}
        <div className="relative w-full lg:w-[45%] h-48 sm:h-56 md:h-64 lg:h-auto bg-[#0a0a0a] text-white overflow-hidden flex-shrink-0">
          <AnimatePresence mode="popLayout">
            <motion.div 
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Ken Burns Effect (Slow Zoom/Pan) */}
              <motion.img 
                src={premiumScenes[currentSlide].image} 
                alt={premiumScenes[currentSlide].title} 
                className="w-full h-full object-cover opacity-70"
                animate={{ 
                  scale: [1, 1.05],
                  x: [0, -10],
                }}
                transition={{ 
                  duration: 6, 
                  ease: "linear",
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </motion.div>
          </AnimatePresence>
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent"></div>
          
          {/* Preload next image to prevent black space */}
          <link rel="preload" as="image" href={premiumScenes[(currentSlide + 1) % premiumScenes.length].image} />

          {/* Desktop logo - hidden on mobile */}
          <div className="relative z-10 hidden lg:block p-12 pb-0">
            <div className="bg-white/95 backdrop-blur-sm inline-block px-5 py-3.5 rounded-2xl shadow-xl border border-white/20">
              {!logoError ? (
                <img 
                  src="/nova-logo.png" 
                  alt="NOVA" 
                  className="h-8 object-contain" 
                  onError={() => setLogoError(true)} 
                />
              ) : (
                <LogoFallback />
              )}
            </div>
          </div>

          {/* Text overlay */}
          <div className="absolute bottom-0 left-0 right-0 z-10 p-4 sm:p-6 lg:p-12">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentSlide}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.6 }}
              >
                <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-3 lg:mb-6 w-fit">
                  <span className="w-2 h-2 rounded-full bg-[#E89B2D] animate-pulse"></span>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-white/90 uppercase">Nova Experience</span>
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-1 sm:mb-2 lg:mb-4 leading-tight text-white tracking-tight">
                  {premiumScenes[currentSlide].title}
                </h2>
                <p className="text-white/60 text-xs sm:text-sm lg:text-base max-w-sm leading-relaxed font-medium italic hidden sm:block">
                  "{premiumScenes[currentSlide].description}"
                </p>
              </motion.div>
            </AnimatePresence>
            
            <div className="flex gap-2 mt-3 lg:mt-10">
              {premiumScenes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1 rounded-full transition-all duration-700 ${
                    currentSlide === index ? 'w-8 lg:w-10 bg-white' : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            {/* Footer - desktop only */}
            <div className="hidden lg:flex relative z-10 text-[10px] text-white/40 justify-between w-full mt-12 font-bold tracking-[0.2em] uppercase">
              <span>© 2026 Nova KMS</span>
              <span>Est. 2024</span>
            </div>
          </div>
        </div>

        {/* Right Panel - Auth Form */}
        <div className="w-full lg:w-[55%] p-5 sm:p-8 md:p-16 flex flex-col relative bg-white overflow-y-auto">
          <div className="flex justify-between items-center w-full mb-8 sm:mb-12">
            <div className="lg:hidden">
              {!logoError ? (
                <img src="/nova-logo.png" alt="NOVA" className="h-7 sm:h-8 object-contain" onError={() => setLogoError(true)} />
              ) : (
                <LogoFallback />
              )}
            </div>
            <div className="hidden lg:block"></div>
            {!isForgotPassword && (
              <div className="text-[10px] sm:text-sm text-gray-400 font-bold uppercase tracking-wider whitespace-nowrap">
                {isLogin ? "New here? " : "Joined? "}
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[#0055A4] hover:text-[#004080] transition-colors ml-0.5 sm:ml-1"
                >
                  {isLogin ? 'Create Account' : 'Sign In'}
                </button>
              </div>
            )}
          </div>

          <div className="max-w-[420px] w-full mx-auto flex-1 flex flex-col justify-center">
            {!isLogin && (
              <div className="mb-6 sm:mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                <label className="block text-[10px] font-bold text-gray-400 mb-3 sm:mb-4 uppercase tracking-[0.2em]">Select Your Platform Role</label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {['Student', 'Teacher', 'Admin'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-2.5 sm:py-3 px-2 rounded-xl text-[10px] sm:text-[11px] font-bold transition-all border uppercase tracking-widest ${
                        role === r 
                          ? 'bg-[#0055A4] text-white border-[#0055A4] shadow-lg scale-105' 
                          : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6 sm:mb-10">
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2 sm:mb-3 tracking-tighter">
                {isLogin ? 'Access Nova' : 'Join Nova'}
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm font-medium">
                {isLogin ? 'Enter your credentials to continue your journey.' : 'Unlock your academic potential today.'}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-2xl mb-8 text-xs font-bold border border-red-100 flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-10">
              <button onClick={() => handleSocialLogin('Google')} className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all text-xs font-bold text-gray-600 shadow-sm">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="G" className="w-4 h-4" />
                Google
              </button>
              <button onClick={() => handleSocialLogin('Apple')} className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all text-xs font-bold text-gray-600 shadow-sm">
                <img src="https://www.svgrepo.com/show/511330/apple-173.svg" alt="A" className="w-4 h-4" />
                Apple
              </button>
            </div>

            <div className="relative mb-10">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-50"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-black text-gray-300"><span className="bg-white px-4">Or</span></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-[#0055A4] transition-colors" />
                  <input type="text" required placeholder="Full Name" className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-transparent focus:border-[#0055A4]/20 focus:bg-white rounded-2xl outline-none text-sm transition-all font-medium" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              )}
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-[#0055A4] transition-colors" />
                <input type="email" required placeholder="Email Address" className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-transparent focus:border-[#0055A4]/20 focus:bg-white rounded-2xl outline-none text-sm transition-all font-medium" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-[#0055A4] transition-colors" />
                <input type={showPassword ? "text" : "password"} required placeholder="Password" className="w-full pl-12 pr-12 py-3.5 bg-gray-50/50 border border-transparent focus:border-[#0055A4]/20 focus:bg-white rounded-2xl outline-none text-sm transition-all font-medium" value={password} onChange={(e) => { const pwd = e.target.value; setPassword(pwd); setPasswordStrength(checkPasswordStrength(pwd)); }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && (
                <div className="mt-2 text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <span>Password strength:</span>
                    <span className={
                      passwordStrength === 'strong' ? 'text-green-600' :
                      passwordStrength === 'medium' ? 'text-yellow-600' :
                      'text-red-600'
                    }>{passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div className={
                      passwordStrength === 'strong' ? 'bg-green-600 w-2/3' :
                      passwordStrength === 'medium' ? 'bg-yellow-600 w-1/2' :
                      'bg-red-600 w-1/3'
                    } />
                  </div>
                </div>
              )}

              <button type="submit" className="w-full bg-[#0055A4] hover:bg-[#004080] text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-900/10 flex items-center justify-center gap-3 text-sm tracking-widest uppercase">
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="mt-auto pt-12 flex justify-center gap-10 text-[10px] font-black text-gray-300 uppercase tracking-widest">
            <Link to="/privacy" className="hover:text-gray-900 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-gray-900 transition-colors">Terms</Link>
            <Link to="/support" className="hover:text-gray-900 transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
