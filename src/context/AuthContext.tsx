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
    try {
      const savedUser = localStorage.getItem('vighnaharta_user') || sessionStorage.getItem('vighnaharta_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('vighnaharta_token') || sessionStorage.getItem('vighnaharta_token') || null;
    } catch {
      return null;
    }
  });

  const saveToStorage = (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      console.warn(`[Storage Warning] Failed to write to localStorage for key: ${key}. Attempting storage cleanup.`, err);
      try {
        // Clear full/corrupted localStorage and retry
        localStorage.clear();
        localStorage.setItem(key, value);
      } catch (fallbackErr) {
        // Fallback to sessionStorage if localStorage is completely blocked
        console.warn(`[Storage Warning] Falling back to sessionStorage.`, fallbackErr);
        sessionStorage.setItem(key, value);
      }
    }
  };

  const removeFromStorage = (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch {}
    try {
      sessionStorage.removeItem(key);
    } catch {}
  };

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
    saveToStorage('vighnaharta_user', JSON.stringify(newUser));
    saveToStorage('vighnaharta_token', userToken);
  };

  const updateUser = (updatedData: Partial<UserProfile>) => {
    if (user) {
      const updated = { ...user, ...updatedData };
      setUser(updated);
      saveToStorage('vighnaharta_user', JSON.stringify(updated));
    }
  };

  const clearMustChangePassword = () => {
    if (user) {
      const updatedUser = { ...user, mustChangePassword: false };
      setUser(updatedUser);
      saveToStorage('vighnaharta_user', JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    removeFromStorage('vighnaharta_user');
    removeFromStorage('vighnaharta_token');
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
