// En @/presentation/contexts/AuthContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { User, Permission } from "@/core/types/auth";
import { RegisterData, AuthResponse } from "@/core/types/auth/responses";
import { authService } from "@/core/services/authService";
import { TokenService } from "@/core/api"; // Asegúrate que TokenService esté exportado de api.ts

// Helper para mapear datos del token a tu tipo User
const mapAuth0ProfileToUser = (decodedToken: any): User => {
  const auth0Id = decodedToken.sub;
  const permissions = decodedToken.permissions || [];
  return {
    id: auth0Id,
    auth0Id,
    email: decodedToken.email,
    name: decodedToken.name,
    picture: decodedToken.picture,
    permissions,
  };
};

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

  const logout = useCallback(() => {
    TokenService.clearAuthData();
    setUser(null);
    router.push("/auth");
  }, [router]);

  useEffect(() => {
    const verifySessionFromStorage = () => {
      try {
        const token = TokenService.getToken();
        if (token && !TokenService.isTokenExpired()) {
          const decodedToken = jwtDecode(token);
          setUser(mapAuth0ProfileToUser(decodedToken));
        }
      } catch (error) {
        console.error("Token local inválido, limpiando sesión.", error);
        TokenService.clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };
    verifySessionFromStorage();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const authResponse = await authService.login(email, password);
      TokenService.setAuthData(authResponse);
      const decodedToken = jwtDecode(authResponse.access_token);
      setUser(mapAuth0ProfileToUser(decodedToken));
      router.push("/dashboard");
    } catch (error) {
      console.error("Error durante el login:", error);
      throw new Error("Credenciales inválidas");
    }
  };

  const register = async (data: RegisterData) => {
    try {
      await authService.register(data);
      // Tras un registro exitoso, se hace login automáticamente
      await login(data.email, data.password);
    } catch (error) {
      console.error("Error durante el registro:", error);
      throw new Error(
        "No se pudo completar el registro. El email puede ya estar en uso."
      );
    }
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
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
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}
