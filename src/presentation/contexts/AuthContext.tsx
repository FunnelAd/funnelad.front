'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, UserRole, ClientSubRole, Permission } from '@/core/types/auth';
import { RegisterData } from '@/core/types/auth/responses';
import { authService } from '@/core/services/authService';
import { TokenService } from '@/core/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = TokenService.getToken();
        if (token && !TokenService.isTokenExpired()) {
          const response = await authService.verifyToken();
          TokenService.setAuthData(response);
          setUser(response.user);
        }
      } catch {
        TokenService.clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      console.log(response)
      TokenService.setAuthData(response);
      setUser(response.user);
      router.push('/dashboard');
    } catch {
      throw new Error('Credenciales inválidas');
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      TokenService.setAuthData(response);
      setUser(response.user);
      router.push('/dashboard');
    } catch {
      throw new Error('Error en el registro');
    }
  };

  const logout = () => {
    TokenService.clearAuthData();
    setUser(null);
    router.push('/auth');
  };

  const checkPermission = (_permission: Permission) => true; // Temporalmente permitimos todo

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        hasPermission: checkPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}