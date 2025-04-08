
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define user type
type User = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
};

type UserContextType = {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('leadflow_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData: User) => {
    localStorage.setItem('leadflow_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('leadflow_user');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
