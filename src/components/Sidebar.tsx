import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { 
  FileText, 
  CheckSquare, 
  BarChart, 
  BookOpen, 
  MessageCircle, 
  BrainCircuit,
  ShieldCheck,
  LayoutDashboard,
  Users,
  GraduationCap,
  X,
  ChevronLeft
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [logoError, setLogoError] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Close sidebar on route change for mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isOpen) {
        // On desktop, sidebar is always visible, no need to close
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 250);
  };

  // Close on nav click (mobile only)
  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      handleClose();
    }
  };

  const LogoFallback = () => (
    <div className="flex items-center gap-2">
      <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#0055A4]">
        <path d="M16 2L19.5 12.5L30 16L19.5 19.5L16 30L12.5 19.5L2 16L12.5 12.5L16 2Z" fill="currentColor"/>
        <circle cx="16" cy="16" r="4" fill="#E89B2D"/>
      </svg>
      <span className="text-xl font-black tracking-tighter text-gray-900">NOVA</span>
    </div>
  );

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive
        ? 'bg-[#233554] text-white shadow-md shadow-black/20'
        : 'text-[#8892B0] hover:bg-white/5 hover:text-white active:bg-white/10'
    }`;

  const sidebarContent = (
    <>
      {/* Logo */}
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

      {/* Mobile close button */}
      <button
        onClick={handleClose}
        className="lg:hidden absolute top-5 right-4 w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all"
        aria-label="Close sidebar"
      >
        <X className="w-5 h-5" />
      </button>
      
      {/* User card */}
      <div className="px-4 lg:px-6 mb-6">
        <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3 border border-white/10">
          <div className="w-8 h-8 rounded-lg bg-[#0055A4] flex items-center justify-center text-xs font-bold shadow-inner flex-shrink-0">
            {user?.role?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.name || 'User'}</p>
            <p className="text-[10px] text-[#8892B0] uppercase tracking-wider font-bold">{user?.role || 'Guest'}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 lg:px-4 space-y-1 overflow-y-auto pb-6 scrollbar-hide">
        <p className="px-4 text-[10px] font-bold text-[#8892B0] uppercase tracking-[0.2em] mb-3 mt-2 opacity-50">Menu</p>
        
        <NavLink to="/" className={navLinkClass} onClick={handleNavClick}>
          <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">Dashboard</span>
        </NavLink>
        
        <NavLink to="/articles" className={navLinkClass} onClick={handleNavClick}>
          <FileText className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">Browse Hub</span>
        </NavLink>

        <NavLink to="/resources" className={navLinkClass} onClick={handleNavClick}>
          <BookOpen className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">Resources</span>
        </NavLink>

        {/* --- ROLE SPECIFIC FEATURES --- */}

        {user?.role === 'Student' && (
          <>
            <p className="px-4 text-[10px] font-bold text-[#8892B0] uppercase tracking-[0.2em] mb-3 mt-6 opacity-50">Learning</p>
            <NavLink to="/chatbot" className={navLinkClass} onClick={handleNavClick}>
              <MessageCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">Nova AI Assistant</span>
            </NavLink>

            <NavLink to="/quizzes" className={navLinkClass} onClick={handleNavClick}>
              <BrainCircuit className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">Active Recall</span>
            </NavLink>

            <NavLink to="/assignments" className={navLinkClass} onClick={handleNavClick}>
              <GraduationCap className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">Coursework</span>
            </NavLink>
          </>
        )}

        {(user?.role === 'Teacher' || user?.role === 'Admin') && (
          <>
            <p className="px-4 text-[10px] font-bold text-[#8892B0] uppercase tracking-[0.2em] mb-3 mt-6 opacity-50">Management</p>
            <NavLink to="/quizzes" className={navLinkClass} onClick={handleNavClick}>
              <BrainCircuit className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">Quiz Builder</span>
            </NavLink>

            <NavLink to="/assignments" className={navLinkClass} onClick={handleNavClick}>
              <FileText className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">Assign Work</span>
            </NavLink>
            
            <NavLink to="/editor" className={navLinkClass} onClick={handleNavClick}>
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">Create Content</span>
            </NavLink>
          </>
        )}

        {user?.role === 'Admin' && (
          <>
            <p className="px-4 text-[10px] font-bold text-[#8892B0] uppercase tracking-[0.2em] mb-3 mt-6 opacity-50">Administration</p>
            <NavLink to="/review" className={navLinkClass} onClick={handleNavClick}>
              <CheckSquare className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">Review Queue</span>
            </NavLink>

            <NavLink to="/admin" className={navLinkClass} onClick={handleNavClick}>
              <Users className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">User Control</span>
            </NavLink>
          </>
        )}

        <p className="px-4 text-[10px] font-bold text-[#8892B0] uppercase tracking-[0.2em] mb-3 mt-6 opacity-50">Insights</p>
        <NavLink to="/analytics" className={navLinkClass} onClick={handleNavClick}>
          <BarChart className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">Platform Data</span>
        </NavLink>

        <NavLink to="/submissions" className={navLinkClass} onClick={handleNavClick}>
          <CheckSquare className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">My History</span>
        </NavLink>
      </nav>
    </>
  );

  return (
    <>
      {/* ===== DESKTOP SIDEBAR (always visible on lg+) ===== */}
      <div className="hidden lg:flex w-64 bg-[#0A192F] text-white flex-col h-screen fixed left-0 top-0 shadow-2xl z-30">
        {sidebarContent}
      </div>

      {/* ===== MOBILE/TABLET SIDEBAR (drawer overlay) ===== */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className={`lg:hidden fixed inset-0 bg-black/50 z-40 ${isClosing ? 'opacity-0 transition-opacity duration-250' : 'sidebar-overlay'}`}
            onClick={handleClose}
            aria-hidden="true"
          />
          {/* Drawer */}
          <div
            className={`lg:hidden fixed left-0 top-0 w-72 max-w-[85vw] bg-[#0A192F] text-white flex flex-col h-full z-50 shadow-2xl safe-bottom ${
              isClosing ? 'sidebar-drawer-exit' : 'sidebar-drawer-enter'
            }`}
          >
            {sidebarContent}
          </div>
        </>
      )}
    </>
  );
};
