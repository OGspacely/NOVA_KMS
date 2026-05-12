import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { Bell, ChevronDown, User, Settings, LogOut, Menu } from 'lucide-react';
import api from '../api/axios.ts';

export const Layout = () => {
  const { user, loading, lastEvent, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState<any[]>([]);

  // Fix for Google Login: Check if we are in the middle of an OAuth redirect
  const isOAuthRedirect = location.hash.includes('access_token=') || location.search.includes('code=');

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const [showTroubleshoot, setShowTroubleshoot] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading || (isOAuthRedirect && !user)) {
      timer = setTimeout(() => setShowTroubleshoot(true), 6000);
    }
    return () => clearTimeout(timer);
  }, [loading, isOAuthRedirect, user]);

  // If loading or if we see OAuth tokens in the URL, show loading state
  if (loading || (isOAuthRedirect && !user)) {
    const hasUrl = !!import.meta.env.VITE_SUPABASE_URL;
    const hasKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A192F] text-white p-4 sm:p-6 text-center">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-6 sm:mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
          <div className="absolute inset-4 rounded-full border-4 border-white/10 border-b-white/40 animate-spin-slow"></div>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold mb-2 tracking-tight">Syncing your session...</h2>
        <p className="text-gray-400 max-w-sm mb-8 sm:mb-12 text-sm">We're verifying your credentials with security providers. This usually takes a moment.</p>
        
        {!showTroubleshoot ? (
          <div className="animate-pulse flex items-center gap-2 text-blue-400/80 text-sm font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            Security Handshake in progress...
          </div>
        ) : (
          <div className="p-5 sm:p-6 bg-white/5 rounded-2xl sm:rounded-3xl border border-white/10 w-full max-w-md animate-scale-in backdrop-blur-xl">
            <h3 className="text-sm font-bold uppercase tracking-widest text-blue-400 mb-4">Troubleshooting</h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-xs px-3 py-2 bg-black/20 rounded-lg">
                <span className="text-gray-400">Connection URL</span>
                <span className={hasUrl ? "text-green-400" : "text-red-400"}>{hasUrl ? "✓ Detected" : "✗ Missing"}</span>
              </div>
              <div className="flex items-center justify-between text-xs px-3 py-2 bg-black/20 rounded-lg">
                <span className="text-gray-400">Security Key</span>
                <span className={hasKey ? "text-green-400" : "text-red-400"}>{hasKey ? "✓ Detected" : "✗ Missing"}</span>
              </div>
              <div className="flex items-center justify-between text-xs px-3 py-2 bg-black/20 rounded-lg">
                <span className="text-gray-400">Auth Status</span>
                <span className="text-blue-400 font-mono uppercase tracking-tighter">{lastEvent}</span>
              </div>
            </div>
            <p className="text-[11px] text-gray-500 mb-6 italic">If you are using Brave, try disabling "Shields" for this site. This allows the login token to be saved.</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-bold transition-all mb-3 shadow-lg shadow-blue-900/20"
            >
              Force Refresh Platform
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-all border border-white/10 text-gray-400"
            >
              Cancel & Back to Login
            </button>
          </div>
        )}
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ error: "Authentication session expired or failed. Please sign in again." }} replace />;
  }

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="min-h-screen bg-[#F4F7FE] dark:bg-gray-900 flex transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen transition-all duration-300">
        {/* Header */}
        <header className="sticky top-0 h-16 sm:h-[72px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 lg:px-8 text-gray-800 dark:text-white relative z-20 transition-all duration-200 border-b border-gray-100/80 dark:border-gray-700/50">
          {/* Left side */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger for mobile/tablet */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:scale-95"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>

            {/* Logo on mobile */}
            <div className="lg:hidden flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#0055A4]">
                <path d="M16 2L19.5 12.5L30 16L19.5 19.5L16 30L12.5 19.5L2 16L12.5 12.5L16 2Z" fill="currentColor"/>
                <circle cx="16" cy="16" r="4" fill="#E89B2D"/>
              </svg>
              <span className="text-base font-black tracking-tighter text-[#0A192F] dark:text-white">NOVA</span>
            </div>

            {/* Desktop title */}
            <div className="hidden lg:flex items-center gap-4">
              <h1 className="text-lg font-bold text-[#0A192F] dark:text-white">NOVA KMS</h1>
              <div className="h-5 w-px bg-gray-200 dark:bg-gray-700"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium truncate">
                Welcome, <span className="text-[#0055A4] dark:text-blue-400">{user.name}</span>
              </p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification bell */}
            <button 
              onClick={() => navigate('/notifications')}
              className="p-2 sm:p-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all relative group active:scale-95"
            >
              <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
              )}
            </button>
            
            {/* Profile dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 sm:gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-1 sm:p-1.5 sm:pr-3 rounded-xl transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-600 active:scale-[0.98]"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-[#0055A4] to-[#004080] flex items-center justify-center text-white font-bold shadow-md text-sm">
                  {user.name.charAt(0)}
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform hidden sm:block ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {showProfileMenu && (
                <div className="absolute top-full right-0 mt-2 w-60 sm:w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 text-gray-700 dark:text-gray-200 animate-scale-in z-50">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 mb-2">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">{user.email}</p>
                    <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      {user.role}
                    </div>
                  </div>
                  
                  <button onClick={() => { setShowProfileMenu(false); navigate('/settings'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <User className="w-4 h-4 text-gray-400" /> Account Details
                  </button>
                  <button onClick={() => { setShowProfileMenu(false); navigate('/settings'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Settings className="w-4 h-4 text-gray-400" /> Platform Settings
                  </button>
                  <div className="h-px bg-gray-100 dark:bg-gray-700 my-2 mx-4"></div>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
