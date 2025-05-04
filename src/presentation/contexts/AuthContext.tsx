'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { User, UserRole, ClientSubRole, Permission, hasPermission } from '@/core/types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
}

interface RegisterData {
  email: string;
  password: string;
  storeName: string;
  phoneNumber: string;
  countryCode: string;
  role: UserRole;
  clientSubRole?: ClientSubRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuarios de prueba
const TEST_USERS: Record<string, User> = {
  'admin@funnelad.com': {
    id: '1',
    name: 'Admin FunnelAd',
    email: 'admin@funnelad.com',
    role: UserRole.FUNNELAD,
    permissions: [
      'view_conversations',
      'manage_conversations',
      'view_contacts',
      'manage_contacts',
      'view_reports',
      'manage_settings',
      'manage_users',
    ],
  },
  'client@example.com': {
    id: '2',
    name: 'Cliente Admin',
    email: 'client@example.com',
    role: UserRole.CLIENT,
    clientSubRole: ClientSubRole.ADMIN,
    storeId: 'store1',
    storeName: 'Mi Tienda',
    permissions: [
      'view_conversations',
      'manage_conversations',
      'view_contacts',
      'manage_contacts',
      'view_reports',
      'manage_settings',
    ],
  },
  'auxiliary@example.com': {
    id: '3',
    name: 'Cliente Auxiliar',
    email: 'auxiliary@example.com',
    role: UserRole.CLIENT,
    clientSubRole: ClientSubRole.AUXILIARY,
    storeId: 'store1',
    storeName: 'Mi Tienda',
    permissions: [
      'view_conversations',
      'view_contacts',
      'view_reports',
    ],
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('auth-token');
    if (token) {
      // Simular verificación del token
      const userEmail = token.split(':')[0];
      const testUser = TEST_USERS[userEmail];
      if (testUser) {
        setUser(testUser);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simular verificación de credenciales
    const testUser = TEST_USERS[email];
    if (testUser && password === 'Test123!') {
      const token = `${email}:${Date.now()}`;
      Cookies.set('auth-token', token, { expires: 7 });
      setUser(testUser);
      router.push('/dashboard');
    } else {
      throw new Error('Credenciales inválidas');
    }
  };

  const register = async (data: RegisterData) => {
    // Simular registro de usuario
    const newUser: User = {
      id: Date.now().toString(),
      name: data.email.split('@')[0],
      email: data.email,
      role: data.role,
      clientSubRole: data.clientSubRole,
      storeId: data.role === UserRole.CLIENT ? `store${Date.now()}` : undefined,
      storeName: data.storeName,
      permissions: [],
    };

    // Asignar permisos según el rol
    if (data.role === UserRole.FUNNELAD) {
      newUser.permissions = [
        'view_conversations',
        'manage_conversations',
        'view_contacts',
        'manage_contacts',
        'view_reports',
        'manage_settings',
        'manage_users',
      ];
    } else if (data.role === UserRole.CLIENT) {
      if (data.clientSubRole === ClientSubRole.ADMIN) {
        newUser.permissions = [
          'view_conversations',
          'manage_conversations',
          'view_contacts',
          'manage_contacts',
          'view_reports',
          'manage_settings',
        ];
      } else {
        newUser.permissions = [
          'view_conversations',
          'view_contacts',
          'view_reports',
        ];
      }
    }

    const token = `${data.email}:${Date.now()}`;
    Cookies.set('auth-token', token, { expires: 7 });
    setUser(newUser);
    router.push('/dashboard');
  };

  const logout = () => {
    Cookies.remove('auth-token');
    setUser(null);
    router.push('/auth');
  };

  const checkPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return hasPermission(user, permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        hasPermission: checkPermission,
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