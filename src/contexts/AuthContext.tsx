
import React, { createContext, useState, useContext, useEffect } from 'react';

// Define types for our authentication
interface User {
  id: string;
  name: string;
  nim: string;
  role: 'mahasiswa' | 'petugas' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (nim: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Creating the context
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: () => {},
});

// Mock users for demonstration (in a real app, this would come from a database)
const MOCK_USERS = [
  {
    id: '1',
    name: 'Mahasiswa Undip',
    nim: '21120120140100',
    password: 'password123',
    role: 'mahasiswa' as const,
  },
  {
    id: '2',
    name: 'Petugas Keamanan',
    nim: 'petugas',
    password: 'petugas123',
    role: 'petugas' as const,
  },
  {
    id: '3',
    name: 'Admin Sistem',
    nim: 'admin',
    password: 'admin123',
    role: 'admin' as const,
  },
];

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('undipSafeUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem('undipSafeUser');
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (nim: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // In a real app, this would be an API call to a backend
    return new Promise((resolve) => {
      // Simulate network request
      setTimeout(() => {
        const foundUser = MOCK_USERS.find(
          (u) => u.nim === nim && u.password === password
        );

        if (foundUser) {
          const { password, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          localStorage.setItem('undipSafeUser', JSON.stringify(userWithoutPassword));
          setIsLoading(false);
          resolve(true);
        } else {
          setIsLoading(false);
          resolve(false);
        }
      }, 1000);
    });
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('undipSafeUser');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
