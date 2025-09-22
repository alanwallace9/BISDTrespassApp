import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { supabaseClient } from '../lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any | null }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSessionAndProfile = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
        if (sessionError) throw sessionError;
        
        setSession(session);
        if (session) {
          const { data: profile, error: profileError } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) throw profileError;

          setUser(profile ? { ...profile, id: profile.id, username: profile.username || session.user.email } : null);
        }
      } catch (error) {
        console.error("Error getting session or profile:", error);
        setUser(null);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };
    
    getSessionAndProfile();

    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        if (newSession) {
            setLoading(true);
            try {
                const { data: profile, error } = await supabaseClient
                    .from('profiles')
                    .select('*')
                    .eq('id', newSession.user.id)
                    .single();
                if (error) throw error;
                setUser(profile ? { ...profile, id: profile.id, username: profile.username || newSession.user.email } : null);
            } catch (error) {
                console.error("Error fetching profile on auth change:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        } else {
            setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  const login = async (email: string, password: string) => {
      const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
      return { error };
  };

  const logout = async () => {
    await supabaseClient.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin, // URL to redirect to after password reset
    });
    return { error };
  };

  const value = {
      session,
      user,
      loading,
      login,
      logout,
      resetPassword,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
