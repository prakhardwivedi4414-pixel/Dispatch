import React, { createContext, useContext, useState } from 'react';
import { AuthUser, UserRole } from '../services/contentRepository';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (role: UserRole, name?: string) => void;
  logout: () => void;
}

const STORAGE_KEY_AUTH = 'the_dispatch_auth_v5';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  const login = (role: UserRole, name?: string) => {
    const defaultNames: Record<UserRole, string> = {
      contributor: 'Siya',
      editor: 'Editorial Desk',
      admin: 'Newsroom Director',
    };

    const newUser: AuthUser = {
      id: `usr_${role}_${Date.now()}`,
      role,
      name: name?.trim() || defaultNames[role],
    };

    setUser(newUser);
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(newUser));
    } catch {
      // ignore
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
