import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

// Extend the Supabase User type with our custom profile fields
export interface User extends SupabaseUser {
  name?: string;
  role?: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isOAuth = window.location.hash.includes('access_token=') || 
                   window.location.search.includes('code=');

    // Get initial session
    const initializeAuth = async () => {
      try {
        // If we detect an OAuth redirect, ensure we stay in loading state
        if (isOAuth) setLoading(true);

        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session?.user) {
          await fetchUserProfile(session.user);
        }
      } catch (error) {
        console.error('Error fetching auth session:', error);
      } finally {
        // Only stop loading here if it's NOT an OAuth redirect.
        // For OAuth, we wait for onAuthStateChange to fire.
        if (!isOAuth) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event);
        
        if (session?.user) {
          setLoading(true);
          await fetchUserProfile(session.user);
          setLoading(false);
        } else {
          // Only clear user and stop loading if we aren't in the middle of a sign-in event
          if (event === 'SIGNED_OUT' || event === 'INITIAL_SESSION') {
            setUser(null);
            setLoading(false);
          }
        }
      }
    );

    // Fallback timeout for OAuth: if we're still loading after 15s, give up
    let timeout: NodeJS.Timeout;
    if (isOAuth) {
      timeout = setTimeout(() => {
        setLoading(false);
      }, 15000);
    }

    return () => {
      subscription.unsubscribe();
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      // In a full implementation, you would fetch additional profile data from a 'users' table
      // For now, we'll map the metadata directly
      const userData: User = {
        ...supabaseUser,
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
        role: supabaseUser.user_metadata?.role || 'Student',
      };
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(supabaseUser as User);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const updateUser = (userData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : null));
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
