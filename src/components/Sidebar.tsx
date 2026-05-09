import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { 
  Home, 
  FileText, 
  CheckSquare, 
  Settings, 
  LogOut, 
  BarChart, 
  BookOpen, 
  User, 
  MessageCircle, 
  BrainCircuit,
  ShieldCheck,
  LayoutDashboard,
  Users,
  GraduationCap
} from 'lucide-react';

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
    <div className="w-64 bg-[#0A192F] text-white flex flex-col h-screen fixed left-0 top-0 shadow-2xl z-30">
      <div className="p-4 flex items-center justify-center bg-white m-4 rounded-2xl shadow-lg">
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
      
      <div className="px-6 mb-6">
        <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3 border border-white/10">
          <div className="w-8 h-8 rounded-lg bg-[#0055A4] flex items-center justify-center text-xs font-bold shadow-inner">
            {user?.role?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">{user?.name || 'User'}</p>
            <p className="text-[10px] text-[#8892B0] uppercase tracking-wider font-bold">{user?.role || 'Guest'}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto pb-6 scrollbar-hide">
        <p className="px-4 text-[10px] font-bold text-[#8892B0] uppercase tracking-[0.2em] mb-3 mt-2 opacity-50">Menu</p>
        
        <NavLink to="/" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-[#233554] text-white shadow-md' : 'text-[#8892B0] hover:bg-white/5 hover:text-white'}`}>
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-sm font-medium">Dashboard</span>
        </NavLink>
        
        <NavLink to="/articles" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-[#233554] text-white shadow-md' : 'text-[#8892B0] hover:bg-white/5 hover:text-white'}`}>
          <FileText className="w-5 h-5" />
          <span className="text-sm font-medium">Browse Hub</span>
        </NavLink>

        <NavLink to="/resources" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-[#233554] text-white shadow-md' : 'text-[#8892B0] hover:bg-white/5 hover:text-white'}`}>
          <BookOpen className="w-5 h-5" />
          <span className="text-sm font-medium">Resources</span>
        </NavLink>

        {/* --- ROLE SPECIFIC FEATURES --- */}

        {user?.role === 'Student' && (
          <>
            <p className="px-4 text-[10px] font-bold text-[#8892B0] uppercase tracking-[0.2em] mb-3 mt-6 opacity-50">Learning</p>
            <NavLink to="/chatbot" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-[#233554] text-white' : 'text-[#8892B0] hover:bg-white/5 hover:text-white'}`}>
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Nova AI Assistant</span>
            </NavLink>

            <NavLink to="/quizzes" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-[#233554] text-white' : 'text-[#8892B0] hover:bg-white/5 hover:text-white'}`}>
              <BrainCircuit className="w-5 h-5" />
              <span className="text-sm font-medium">Active Recall</span>
            </NavLink>

            <NavLink to="/assignments" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-[#233554] text-white' : 'text-[#8892B0] hover:bg-white/5 hover:text-white'}`}>
              <GraduationCap className="w-5 h-5" />
              <span className="text-sm font-medium">Coursework</span>
            </NavLink>
          </>
        )}

        {(user?.role === 'Teacher' || user?.role === 'Admin') && (
          <>
            <p className="px-4 text-[10px] font-bold text-[#8892B0] uppercase tracking-[0.2em] mb-3 mt-6 opacity-50">Management</p>
            <NavLink to="/quizzes" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-[#233554] text-white' : 'text-[#8892B0] hover:bg-white/5 hover:text-white'}`}>
              <BrainCircuit className="w-5 h-5" />
              <span className="text-sm font-medium">Quiz Builder</span>
            </NavLink>

            <NavLink to="/assignments" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-[#233554] text-white' : 'text-[#8892B0] hover:bg-white/5 hover:text-white'}`}>
              <FileText className="w-5 h-5" />
              <span className="text-sm font-medium">Assign Work</span>
            </NavLink>
            
            <NavLink to="/editor" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-[#233554] text-white' : 'text-[#8892B0] hover:bg-white/5 hover:text-white'}`}>
              <ShieldCheck className="w-5 h-5" />
              <span className="text-sm font-medium">Create Content</span>
            </NavLink>
          </>
        )}

        {user?.role === 'Admin' && (
          <>
            <p className="px-4 text-[10px] font-bold text-[#8892B0] uppercase tracking-[0.2em] mb-3 mt-6 opacity-50">Administration</p>
            <NavLink to="/review" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-[#233554] text-white' : 'text-[#8892B0] hover:bg-white/5 hover:text-white'}`}>
              <CheckSquare className="w-5 h-5" />
              <span className="text-sm font-medium">Review Queue</span>
            </NavLink>

            <NavLink to="/admin" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-[#233554] text-white' : 'text-[#8892B0] hover:bg-white/5 hover:text-white'}`}>
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">User Control</span>
            </NavLink>
          </>
        )}

        <p className="px-4 text-[10px] font-bold text-[#8892B0] uppercase tracking-[0.2em] mb-3 mt-6 opacity-50">Insights</p>
        <NavLink to="/analytics" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-[#233554] text-white' : 'text-[#8892B0] hover:bg-white/5 hover:text-white'}`}>
          <BarChart className="w-5 h-5" />
          <span className="text-sm font-medium">Platform Data</span>
        </NavLink>

        <NavLink to="/submissions" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-[#233554] text-white' : 'text-[#8892B0] hover:bg-white/5 hover:text-white'}`}>
          <CheckSquare className="w-5 h-5" />
          <span className="text-sm font-medium">My History</span>
        </NavLink>
      </nav>
    </div>
  );
};
