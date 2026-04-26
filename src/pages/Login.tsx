import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase.ts';
import { useAuth } from '../context/AuthContext.tsx';
import api from '../api/axios.ts';
import { Eye, EyeOff, Mail, Lock, User, Shield, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=2070&q=80",
    badge: "Knowledge Management",
    title: "One Platform to Streamline",
    highlight: "All Academic Knowledge",
    description: "Your students are set to learn 20% faster next month. Your institutional knowledge is preserved and easily accessible with our KMS tools."
  },
  {
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=2070&q=80",
    badge: "Collaborative Learning",
    title: "Empower Your",
    highlight: "Teaching Staff",
    description: "Share resources, lesson plans, and best practices seamlessly across your entire institution to foster a culture of continuous improvement."
  },
  {
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2070&q=80",
    badge: "Data-Driven Insights",
    title: "Track Academic",
    highlight: "Progress & Success",
    description: "Monitor student engagement and content effectiveness with powerful built-in analytics to ensure no one falls behind."
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
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // HCI Best Practice: Clear errors when switching between login/register/forgot password views
  useEffect(() => {
    setError('');
  }, [isLogin, isForgotPassword]);

  // HCI Best Practice: Clear errors when the user starts typing to correct their mistake
  useEffect(() => {
    if (error) setError('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, password, name, role]);

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
        // Optionally inform the user to check their email for verification here
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider.toLowerCase() as any,
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      console.error(err);
      setError(err.message || `Failed to initialize ${provider} login.`);
    }
  };



  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    // Mock API call for password reset
    setTimeout(() => {
      setResetSent(true);
    }, 1000);
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
    <div className="min-h-screen bg-[#f3f4f6] p-4 md:p-8 flex items-center justify-center font-sans">
      <div className="w-full max-w-[1200px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,_0,_0,_0.05)] overflow-hidden flex min-h-[750px] border border-gray-100">
        
        {/* Left Panel - Image Background */}
        <div className="hidden lg:flex flex-col justify-between w-[45%] bg-[#0a0a0a] text-white p-12 relative overflow-hidden">
          {/* Background Images - Sliding from right to left only */}
          <AnimatePresence initial={false}>
            <motion.div 
              key={currentSlide}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 1, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full"
            >
              <img 
                src={slides[currentSlide].image} 
                alt={`Slide ${currentSlide + 1}`} 
                className="w-full h-full object-cover opacity-50"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </AnimatePresence>
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent"></div>
          
          <div className="relative z-10">
            {/* Logo */}
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

          <div className="relative z-10 flex-1 flex flex-col justify-end mt-12 w-full overflow-hidden">
            <div className="relative h-[280px] w-full">
              <AnimatePresence initial={false}>
                <motion.div 
                  key={currentSlide}
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ duration: 1, ease: 'easeInOut' }}
                  className="absolute inset-0 flex flex-col justify-end"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6 w-fit">
                    <span className="w-2 h-2 rounded-full bg-[#E89B2D] animate-pulse"></span>
                    <span className="text-xs font-medium tracking-wide text-white/90 uppercase">{slides[currentSlide].badge}</span>
                  </div>
                  <h2 className="text-4xl font-semibold mb-5 leading-[1.15] text-white tracking-tight">
                    {slides[currentSlide].title}<br />
                    <span className="text-white/60">{slides[currentSlide].highlight}</span>
                  </h2>
                  <p className="text-white/70 text-base max-w-md leading-relaxed font-light">
                    {slides[currentSlide].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Pagination Dots */}
            <div className="flex gap-2 mt-8">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-500 outline-none focus:outline-none ${
                    currentSlide === index ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="relative z-10 text-xs text-white/40 flex justify-between w-full mt-12 font-medium tracking-wide">
            <span>© 2026 Nova KMS</span>
            <span>Empowering Education</span>
          </div>
        </div>

        {/* Right Panel - Light */}
        <div className="w-full lg:w-[55%] p-8 md:p-16 flex flex-col relative bg-white overflow-y-auto">
          
          {/* Top Bar */}
          <div className="flex justify-between items-center w-full mb-12">
            <div className="lg:hidden">
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
            <div className="hidden lg:block"></div> {/* Spacer */}
            {!isForgotPassword && (
              <div className="text-sm text-gray-500 font-medium">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[#0055A4] font-semibold hover:text-[#004080] transition-colors outline-none focus:outline-none"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </div>
            )}
          </div>

          {/* Form Container */}
          <div className="max-w-[420px] w-full mx-auto flex-1 flex flex-col justify-center">
            
            {isForgotPassword ? (
              /* Forgot Password View */
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <button 
                  onClick={() => {
                    setIsForgotPassword(false);
                    setResetSent(false);
                    setError('');
                  }}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors outline-none focus:outline-none"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </button>

                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
                    Reset password
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>

                {error && (
                  <div role="alert" aria-live="assertive" className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm flex items-start gap-3 border border-red-100">
                    <div className="mt-0.5">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
                    </div>
                    <span>{error}</span>
                  </div>
                )}

                {resetSent ? (
                  <div className="bg-green-50 text-green-700 p-6 rounded-2xl border border-green-100 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Check your email</h3>
                    <p className="text-sm text-green-600/80">
                      We've sent a password reset link to <span className="font-medium">{email}</span>.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          required
                          placeholder="johndoe@mail.com"
                          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#0055A4]/10 focus:border-[#0055A4] outline-none transition-all text-sm bg-gray-50/50 focus:bg-white"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#0055A4] hover:bg-[#004080] text-white font-semibold py-3.5 rounded-xl transition-all mt-4 text-sm shadow-[0_4px_14px_0_rgba(0,85,164,0.25)] hover:shadow-[0_6px_20px_rgba(0,85,164,0.23)] hover:-translate-y-0.5 flex items-center justify-center gap-2 outline-none focus:outline-none"
                    >
                      Send Reset Link
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            ) : (
              /* Login / Register View */
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
                    {isLogin ? 'Welcome back' : 'Create an account'}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {isLogin ? 'Please enter your details to sign in to your account.' : 'Enter your details below to create your Nova account.'}
                  </p>
                </div>

                {error && (
                  <div role="alert" aria-live="assertive" className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm flex items-start gap-3 border border-red-100">
                    <div className="mt-0.5">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
                    </div>
                    <span>{error}</span>
                  </div>
                )}

                {/* Social Logins */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <button 
                    type="button" 
                    onClick={() => handleSocialLogin('Google')}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-medium text-gray-700 shadow-sm outline-none focus:outline-none"
                  >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
                    Google
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleSocialLogin('Apple')}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-medium text-gray-700 shadow-sm outline-none focus:outline-none"
                  >
                    <img src="https://www.svgrepo.com/show/511330/apple-173.svg" alt="Apple" className="w-4 h-4" />
                    Apple
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <div className="flex-1 h-px bg-gray-100"></div>
                  <span className="text-[11px] text-gray-400 uppercase tracking-widest font-medium">Or continue with email</span>
                  <div className="flex-1 h-px bg-gray-100"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {!isLogin && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Full Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="John Doe"
                          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#0055A4]/10 focus:border-[#0055A4] outline-none transition-all text-sm bg-gray-50/50 focus:bg-white"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                      {isLogin ? 'Email or Username' : 'Email'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        {isLogin ? <User className="h-4 w-4 text-gray-400" /> : <Mail className="h-4 w-4 text-gray-400" />}
                      </div>
                      <input
                        type={isLogin ? "text" : "email"}
                        required
                        placeholder={isLogin ? "johndoe@mail.com or John Doe" : "johndoe@mail.com"}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#0055A4]/10 focus:border-[#0055A4] outline-none transition-all text-sm bg-gray-50/50 focus:bg-white"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">Password</label>
                      {isLogin && (
                        <button 
                          type="button"
                          onClick={() => setIsForgotPassword(true)}
                          className="text-xs font-medium text-[#0055A4] hover:text-[#004080] transition-colors outline-none focus:outline-none"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#0055A4]/10 focus:border-[#0055A4] outline-none transition-all text-sm bg-gray-50/50 focus:bg-white"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 outline-none focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {!isLogin && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Role</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Shield className="h-4 w-4 text-gray-400" />
                        </div>
                        <select
                          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#0055A4]/10 focus:border-[#0055A4] outline-none transition-all text-sm bg-gray-50/50 focus:bg-white appearance-none"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                        >
                          <option value="Student">Student</option>
                          <option value="Teacher">Teacher</option>
                          <option value="Admin">Admin</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-[#0055A4] hover:bg-[#004080] text-white font-semibold py-3.5 rounded-xl transition-all mt-4 text-sm shadow-[0_4px_14px_0_rgba(0,85,164,0.25)] hover:shadow-[0_6px_20px_rgba(0,85,164,0.23)] hover:-translate-y-0.5 flex items-center justify-center gap-2 outline-none focus:outline-none"
                  >
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Bottom Links */}
          <div className="mt-auto pt-8 flex justify-center gap-8 text-xs text-gray-400 font-medium">
            <Link to="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
            <Link to="/support" className="hover:text-gray-900 transition-colors">Support</Link>
          </div>

        </div>
      </div>
    </div>
  );
};
