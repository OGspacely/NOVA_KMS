import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { Home, FileText, CheckSquare, Settings, LogOut, BarChart, BookOpen, User, MessageCircle, BrainCircuit } from 'lucide-react';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const [logoError, setLogoError] = useState(false);

  const LogoFallback = () => (
    <div className="flex items-center gap-2">
      <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#0055A4]">
        <path d="M16 2L19.5 12.5L30 16L19.5 19.5L16 30L12.5 19.5L2 16L12.5 12.5L16 2Z" fill="currentColor"/>
        <circle cx="16" cy="16" r="4" fill="#E89B2D"/>
      </svg>
      <span className="text-xl font-black tracking-tighter text-gray-900">NOVA</span>
    </div>
  );

  return (
    <div className="w-64 bg-[#0A192F] text-white flex flex-col h-screen fixed left-0 top-0">
      <div className="p-4 flex items-center justify-center bg-white m-4 rounded-xl shadow-sm">
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
      
      <nav className="flex-1 px-4 space-y-2 mt-2 pb-6">
        <NavLink to="/" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-[#233554] text-white' : 'text-[#8892B0] hover:bg-white/5 hover:text-white'}`}>
          <Home className="w-5 h-5" />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/articles" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-[#233554] text-white' : 'text-[#8892B0] hover:bg-white/5 hover:text-white'}`}>
          <FileText className="w-5 h-5" />
          <span>Browse</span>
        </NavLink>

        <NavLink to="/resources" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-[#233554] text-white' : 'text-[#8892B0] hover:bg-white/5 hover:text-white'}`}>
          <BookOpen className="w-5 h-5" />
          <span>Resources</span>
        </NavLink>

        {user?.role !== 'Admin' && (
          <>
            <NavLink to="/forum" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-[#233554] text-white' : 'text-[#8892B0] hover:bg-white/5 hover:text-white'}`}>
              <MessageCircle className="w-5 h-5" />
              <span>Q&A Forum</span>
            </NavLink>

            <NavLink to="/quizzes" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-[#233554] text-white' : 'text-[#8892B0] hover:bg-white/5 hover:text-white'}`}>
              <BrainCircuit className="w-5 h-5" />
              <span>Quizzes</span>
            </NavLink>

            <NavLink to="/assignments" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-[#233554] text-white' : 'text-[#8892B0] hover:bg-white/5 hover:text-white'}`}>
              <FileText className="w-5 h-5" />
              <span>Assignments</span>
            </NavLink>
          </>
        )}

        <NavLink to="/analytics" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-[#233554] text-white' : 'text-[#8892B0] hover:bg-white/5 hover:text-white'}`}>
          <BarChart className="w-5 h-5" />
          <span>Analytics</span>
        </NavLink>

        <NavLink to="/editor" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-[#233554] text-white' : 'text-[#8892B0] hover:bg-white/5 hover:text-white'}`}>
          <FileText className="w-5 h-5" />
          <span>{user?.role === 'Student' ? 'Contribute' : 'Create Article'}</span>
        </NavLink>

        {(user?.role === 'Admin' || user?.role === 'Teacher') && (
          <NavLink to="/review" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-[#233554] text-white' : 'text-[#8892B0] hover:bg-white/5 hover:text-white'}`}>
            <CheckSquare className="w-5 h-5" />
            <span>Review Queue</span>
          </NavLink>
        )}

        {user?.role === 'Admin' && (
          <NavLink to="/admin" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-[#233554] text-white' : 'text-[#8892B0] hover:bg-white/5 hover:text-white'}`}>
            <Settings className="w-5 h-5" />
            <span>Admin</span>
          </NavLink>
        )}
      </nav>
    </div>
  );
};
