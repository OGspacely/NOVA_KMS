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
  lastEvent: string;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastEvent, setLastEvent] = useState<string>('STARTING');

  useEffect(() => {
    const isOAuth = window.location.hash.includes('access_token=') || 
                   window.location.search.includes('code=');

    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log('Initializing Auth... OAuth detected:', isOAuth);
        if (isOAuth) setLoading(true);

        // Force a small delay to allow Supabase to handle the URL hash
        if (isOAuth) await new Promise(resolve => setTimeout(resolve, 1000));

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session fetch error:', error);
          throw error;
        }

        if (session?.user) {
          console.log('Session found in initializeAuth');
          await fetchUserProfile(session.user);
        } else if (isOAuth) {
          console.log('No session found yet, but OAuth is in URL. Retrying once...');
          // One-time manual retry for sticky tokens
          const { data: { session: retrySession } } = await supabase.auth.getSession();
          if (retrySession?.user) {
            await fetchUserProfile(retrySession.user);
          }
        }
      } catch (error) {
        console.error('Error fetching auth session:', error);
      } finally {
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
        setLastEvent(event);
        
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
    console.log('Fetching user profile for:', supabaseUser.id);
    try {
      // In a full implementation, you would fetch additional profile data from a 'users' table
      // For now, we'll map the metadata directly
      const userData: User = {
        ...supabaseUser,
        name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
        role: supabaseUser.user_metadata?.role || 'Student',
      };
      console.log('User profile mapped:', userData.name, userData.role);
      setUser(userData);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const updateUser = (userData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : null));
  };

  return (
    <AuthContext.Provider value={{ user, loading, lastEvent, logout, updateUser }}>
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
