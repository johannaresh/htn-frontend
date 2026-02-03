import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface AuthContextType {
  isAuthed: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const HARDCODED_USERNAME = 'hacker';
const HARDCODED_PASSWORD = 'htn2026';
const AUTH_STORAGE_KEY = 'htn_isAuthed';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthed, setIsAuthed] = useState<boolean>(() => {
    // Initialize from localStorage
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored === 'true';
  });

  useEffect(() => {
    // Persist auth state to localStorage
    localStorage.setItem(AUTH_STORAGE_KEY, String(isAuthed));
  }, [isAuthed]);

  const login = (username: string, password: string): boolean => {
    // Check hardcoded credentials
    if (username === HARDCODED_USERNAME && password === HARDCODED_PASSWORD) {
      setIsAuthed(true);
      return true;
    }

    // In the future, we could add Firebase Auth here
    // For now, just reject invalid credentials
    return false;
  };

  const logout = () => {
    setIsAuthed(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ isAuthed, login, logout }}>
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
