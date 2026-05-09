import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { Search, Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import api from '../api/axios.ts';

export const Layout = () => {
  const { user, loading, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
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

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const [syncTimeout, setSyncTimeout] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading || (isOAuthRedirect && !user)) {
      timer = setTimeout(() => {
        setSyncTimeout(true);
      }, 8000); // 8 second timeout
    }
    return () => clearTimeout(timer);
  }, [loading, isOAuthRedirect, user]);

  // If loading or if we see OAuth tokens in the URL, show loading state
  // But if we timeout or loading finishes and still no user, we should stop showing this
  if ((loading || (isOAuthRedirect && !user)) && !syncTimeout) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A192F] text-white">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
          <div className="absolute inset-4 rounded-full border-4 border-white/10 border-b-white/40 animate-spin-slow"></div>
        </div>
        <p className="text-lg font-medium animate-pulse tracking-wide">Syncing your session...</p>
        <p className="text-xs text-gray-500 mt-4 italic">Verifying credentials with security providers</p>
      </div>
    );
  }

  if (!user) {
    // If we reach here and it's an OAuth redirect that failed (or timed out), 
    // we should redirect back to login and maybe show an error.
    return <Navigate to="/login" state={{ error: "Authentication failed or timed out. Please try again." }} replace />;
  }

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="min-h-screen bg-[#F4F7FE] dark:bg-gray-900 flex transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <header className="h-20 bg-white dark:bg-gray-800 flex items-center justify-between px-8 text-gray-800 dark:text-white relative z-20 transition-all duration-200 shadow-sm border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-[#0A192F] dark:text-white">NOVA KMS</h1>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Welcome back, <span className="text-[#0055A4] dark:text-blue-400">{user.name}</span></p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => navigate('/notifications')}
                className="p-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all relative group"
              >
                <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                )}
              </button>
            </div>
            
            <div className="relative" ref={profileMenuRef}>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-1.5 pr-3 rounded-xl transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-600"
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0055A4] to-[#004080] flex items-center justify-center text-white font-bold shadow-md">
                  {user.name.charAt(0)}
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {showProfileMenu && (
                <div className="absolute top-full right-0 mt-3 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 text-gray-700 dark:text-gray-200 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 mb-2">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</p>
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
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
