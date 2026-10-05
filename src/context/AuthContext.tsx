import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/initialData';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => { success: boolean; error?: string };
  demoLogin: (role: UserRole) => void;
  registerCitizen: (data: { name: string; email: string; phone: string }) => { success: boolean; error?: string };
  logout: () => void;
  isCitizen: boolean;
  isPolice: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('cw_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.email && parsed.email.endsWith('@crimewatch.demo')) {
          return parsed;
        }
      } catch {
        return null;
      }
    }
    // Default initial user for instant seamless experience
    return INITIAL_USERS[0]; // Ananya Reddy (Citizen)
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('cw_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('cw_user');
    }
  }, [currentUser]);

  const login = (email: string, role?: UserRole): { success: boolean; error?: string } => {
    // Find user in initial or saved users
    const allUsers: User[] = JSON.parse(localStorage.getItem('cw_all_users') || JSON.stringify(INITIAL_USERS));
    const normalizedEmail = email.trim().toLowerCase();
    const user = allUsers.find(
      (u) => u.email.toLowerCase() === normalizedEmail && (!role || u.role === role)
    );

    if (!user) {
      return { success: false, error: 'Invalid email or credentials for the selected role.' };
    }

    if (user.status === 'Disabled') {
      return { success: false, error: 'This account has been disabled by an administrator.' };
    }

    setCurrentUser(user);
    return { success: true };
  };

  const demoLogin = (role: UserRole) => {
    const allUsers: User[] = JSON.parse(localStorage.getItem('cw_all_users') || JSON.stringify(INITIAL_USERS));
    const targetUser = allUsers.find((u) => u.role === role && u.status === 'Active');
    if (targetUser) {
      setCurrentUser(targetUser);
    }
  };

  const registerCitizen = (data: { name: string; email: string; phone: string }): { success: boolean; error?: string } => {
    const allUsers: User[] = JSON.parse(localStorage.getItem('cw_all_users') || JSON.stringify(INITIAL_USERS));
    const existing = allUsers.find((u) => u.email.toLowerCase() === data.email.trim().toLowerCase());

    if (existing) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser: User = {
      id: `user-cit-${Date.now()}`,
      name: data.name,
      email: data.email.trim().toLowerCase(),
      phone: data.phone,
      role: 'Citizen',
      status: 'Active',
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...allUsers, newUser];
    localStorage.setItem('cw_all_users', JSON.stringify(updatedUsers));
    setCurrentUser(newUser);

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const isCitizen = currentUser?.role === 'Citizen';
  const isPolice = currentUser?.role === 'Police Officer';
  const isAdmin = currentUser?.role === 'Administrator';

  const value: AuthContextType = {
    currentUser,
    isAuthenticated: !!currentUser,
    login,
    demoLogin,
    registerCitizen,
    logout,
    isCitizen,
    isPolice,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
