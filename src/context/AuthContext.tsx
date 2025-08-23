// src/context/AuthContext.tsx

import React, { createContext, useState, ReactNode } from 'react';

// Định nghĩa kiểu dữ liệu cho người dùng
interface User {
  userID: string;
  userName: string;
  role: string;
}

// Định nghĩa kiểu dữ liệu cho Context
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}


// Tạo Provider Component
 const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- PROVIDER COMPONENT (chỉ export component này) ---
 function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export { AuthContext, AuthProvider };