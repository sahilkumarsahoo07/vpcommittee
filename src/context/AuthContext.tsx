import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'COMMITTEE_MEMBER';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  mustChangePassword?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  login: (email: string, role: UserRole, token: string, name: string, mustChangePassword?: boolean, id?: string) => void;
  logout: () => void;
  clearMustChangePassword: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedUser = localStorage.getItem('vighnaharta_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('vighnaharta_token') || null;
  });

  const login = (
    email: string,
    role: UserRole,
    userToken: string,
    name: string,
    mustChangePassword: boolean = false,
    id?: string
  ) => {
    const newUser: UserProfile = {
      id: id || `usr_${Date.now()}`,
      name,
      email,
      role,
      mustChangePassword,
    };
    setUser(newUser);
    setToken(userToken);
    localStorage.setItem('vighnaharta_user', JSON.stringify(newUser));
    localStorage.setItem('vighnaharta_token', userToken);
  };

  const clearMustChangePassword = () => {
    if (user) {
      const updatedUser = { ...user, mustChangePassword: false };
      setUser(updatedUser);
      localStorage.setItem('vighnaharta_user', JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('vighnaharta_user');
    localStorage.removeItem('vighnaharta_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, clearMustChangePassword, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
