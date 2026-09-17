import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, Company } from '../types';
import { db } from '../services/db';

interface AuthContextType {
  currentUser: Profile | null;
  currentCompany: Company | null;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);

  useEffect(() => {
    const list = db.getProfiles();
    // Restore an explicitly authenticated local session only (temporary until Supabase Auth is connected).
    const storedUserId = localStorage.getItem('circular_uio_current_user_id');
    if (storedUserId) {
      const found = list.find((p) => p.id === storedUserId);
      if (found) {
        setCurrentUser(found);
        return;
      }
    }

  }, []);

  const login = (email: string, _pass: string): boolean => {
    const list = db.getProfiles();
    const found = list.find((p) => p.email.toLowerCase().trim() === email.toLowerCase().trim());
    if (found && found.active) {
      setCurrentUser(found);
      localStorage.setItem('circular_uio_current_user_id', found.id);
      db.addAuditLog(found, 'Inicio de sesión', 'auth', found.id, null, null, `Acceso exitoso al sistema como ${found.role}`);
      return true;
    }
    return false;
  };

  const logout = () => {
    if (currentUser) {
      db.addAuditLog(currentUser, 'Cierre de sesión', 'auth', currentUser.id, null, null, 'Sesión finalizada por el usuario');
    }
    setCurrentUser(null);
    localStorage.removeItem('circular_uio_current_user_id');
  };


  const currentCompany = currentUser?.company_id ? db.getCompany(currentUser.company_id) || null : null;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentCompany,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
