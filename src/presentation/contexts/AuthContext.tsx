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
import { TokenService } from "@/core/api";

interface DecodedJwtPayload {
  sub: string;
  email: string;
  name?: string;
  nickname?: string;
  picture?: string;
  permissions?: Permission[];
}

const mapAuth0ProfileToUser = (decodedToken: DecodedJwtPayload): User => {
  const auth0Id = decodedToken.sub; // El 'sub' es el ID único del usuario de Auth0
  const permissions = decodedToken.permissions || []; // Asegura que sea un array vacío si no hay permisos

  return {
    id: auth0Id,
    auth0Id: auth0Id,
    email: decodedToken.email,
    name:
      decodedToken.name ||
      decodedToken.nickname ||
      decodedToken.email.split("@")[0] ||
      "Usuario",
    picture: decodedToken.picture || "",
    permissions,
  };
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>; // Convertido a Promise<void> para que el await en Sidebar no de warning
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(async () => {
    TokenService.clearAuthData();
    localStorage.removeItem("user_data");
    setUser(null);
    router.push("/auth");
  }, [router]);

  useEffect(() => {
    const verifySessionFromStorage = () => {
      try {
        const token = TokenService.getToken(); // Obtiene el token de localStorage/cookies
        const userDataString = localStorage.getItem("user_data"); // Intenta obtener user_data

        // Verifica si el token existe, no está expirado y tenemos user_data.
        // Asume que TokenService.isTokenExpired() ya maneja tokens inválidos/no existentes.
        if (token && userDataString && !TokenService.isTokenExpired()) {
          const decodedToken: DecodedJwtPayload = jwtDecode(token);
          const storedUser: User = JSON.parse(userDataString);

          setUser(mapAuth0ProfileToUser(decodedToken));
        } else {
          TokenService.clearAuthData();
          localStorage.removeItem("user_data");
          setUser(null);
        }
      } catch (error) {
        console.error(
          "Error al verificar la sesión desde el almacenamiento, limpiando sesión.",
          error
        );
        TokenService.clearAuthData();
        localStorage.removeItem("user_data");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    verifySessionFromStorage();
  }, [logout]);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);

      const authData: AuthResponse = response.data;

      TokenService.setAuthData(authData);

      // 4. El resto del código también usa 'authData'
      const decodedToken: DecodedJwtPayload = jwtDecode(authData.access_token);
      const userFromToken = mapAuth0ProfileToUser(decodedToken);

      setUser(userFromToken);
      localStorage.setItem("user_data", JSON.stringify(userFromToken));

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error durante el login:", error);
      // Es bueno también loguear el error específico que viene del backend
      if (error.response) {
        console.error("Respuesta del backend:", error.response.data);
      }
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      const authData: AuthResponse = response.data;

      // Si el registro te da un token, haz el login "automático" como arriba
      TokenService.setAuthData(authData.access_token);
      const decodedToken: DecodedJwtPayload = jwtDecode(authData.access_token);

      const userFromToken = mapAuth0ProfileToUser(decodedToken);
      setUser(userFromToken);
      localStorage.setItem("user_data", JSON.stringify(userFromToken));
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error durante el registro:", error);
      throw error; // Propaga el error
    }
  };
  const hasPermission = (permission: Permission): boolean => {
    // Si los permisos también vienen del token (decodedToken.permissions)
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
