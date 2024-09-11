'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { getLoggedInUser, login as authLogin, logout as authLogout } from '@/utils/auth';

interface AuthContextType {
    user: User | null;
    login: (userName: string, password: string) => string | null;
    logout: () => void;
  }

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => getLoggedInUser());

  const login = (userName: string, password: string): string | null => {
    const errorMessage = authLogin(userName, password);
    if (!errorMessage) {
      setUser(getLoggedInUser());
    }
    return errorMessage;
  };

  const logout = () => {
    authLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};