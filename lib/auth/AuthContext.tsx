'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface AuthContextType {
  isAuthed: boolean;
  isHydrated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const HARDCODED_USERNAME = 'hacker';
const HARDCODED_PASSWORD = 'htn2026';
const AUTH_STORAGE_KEY = 'htn_isAuthed';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthed, setIsAuthed] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Hydrate from localStorage on mount (client-side only)
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored === 'true') {
      setIsAuthed(true);
    }
    setIsHydrated(true);
  }, []);

  // Persist auth state to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(AUTH_STORAGE_KEY, String(isAuthed));
    }
  }, [isAuthed, isHydrated]);

  const login = (username: string, password: string): boolean => {
    if (username === HARDCODED_USERNAME && password === HARDCODED_PASSWORD) {
      setIsAuthed(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthed(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ isAuthed, isHydrated, login, logout }}>
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
