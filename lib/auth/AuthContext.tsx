'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface AuthContextType {
  isAuthed: boolean;
  // Signals when client-side hydration is complete and localStorage is available.
  // Components should check this before rendering auth-dependent content to avoid SSR mismatches.
  isHydrated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const HARDCODED_USERNAME = 'hacker';
const HARDCODED_PASSWORD = 'htn2026';
const AUTH_STORAGE_KEY = 'htn_isAuthed';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Start with isAuthed=false on server to match initial client render.
  // This prevents hydration mismatch where server renders "logged out" but client immediately shows "logged in".
  const [isAuthed, setIsAuthed] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Restore auth state from localStorage after initial mount.
  // Must run client-side only since localStorage doesn't exist during SSR.
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored === 'true') {
      setIsAuthed(true);
    }
    setIsHydrated(true);
  }, []);

  // Persist auth state to localStorage, but only after hydration completes.
  // Without the isHydrated guard, this would run during initial mount and overwrite
  // the stored auth state before we've had a chance to read it above.
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
