import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'COMMITTEE_MEMBER' | 'MEMBER';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  profilePhoto?: string;
  permissions?: string[];
  mustChangePassword?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  login: (
    email: string,
    role: UserRole,
    userToken: string,
    name: string,
    mustChangePassword?: boolean,
    id?: string,
    phone?: string,
    address?: string,
    profilePhoto?: string,
    permissions?: string[]
  ) => void;
  updateUser: (updatedData: Partial<UserProfile>) => void;
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
    id?: string,
    phone?: string,
    address?: string,
    profilePhoto?: string,
    permissions?: string[]
  ) => {
    const newUser: UserProfile = {
      id: id || `usr_${Date.now()}`,
      name,
      email,
      role,
      phone: phone || '',
      address: address || '',
      profilePhoto: profilePhoto || '',
      permissions: permissions || [],
      mustChangePassword,
    };
    setUser(newUser);
    setToken(userToken);
    localStorage.setItem('vighnaharta_user', JSON.stringify(newUser));
    localStorage.setItem('vighnaharta_token', userToken);
  };

  const updateUser = (updatedData: Partial<UserProfile>) => {
    if (user) {
      const updated = { ...user, ...updatedData };
      setUser(updated);
      localStorage.setItem('vighnaharta_user', JSON.stringify(updated));
    }
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
    <AuthContext.Provider value={{ user, token, login, updateUser, logout, clearMustChangePassword, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
