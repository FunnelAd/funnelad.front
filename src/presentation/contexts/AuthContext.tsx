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
import { User, Permission, UserRole } from "@/core/types/auth";
import { AuthResponse } from "@/core/types/auth";
import { authService } from "@/core/services/authService";
import { TokenService } from "@/core/api";
import { RegisterData } from "@/core/types/auth/responses";

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
      decodedToken.email ||
      "Usuario",
    role: UserRole.FUNNELAD,
    permissions: permissions,
  };
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(async () => {
    const refreshToken = TokenService.getRefreshToken();

    try {
      if (refreshToken) {
        await authService.logout(refreshToken);
        console.log("Sesión cerrada en el backend.");
      }
    } catch (error) {
      console.error("Fallo al cerrar la sesión en el backend:", error);
    } finally {
      TokenService.clearAuthData();
      localStorage.removeItem("user_data");
      setUser(null);
      router.push("/auth");
    }
  }, [router]);

  useEffect(() => {
    const verifySessionFromStorage = () => {
      try {
        const token = TokenService.getToken();
        const userDataString = localStorage.getItem("user_data");

        if (token && userDataString) {
          const decodedToken: DecodedJwtPayload = jwtDecode(token);
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
      console.log(response);
      const authData: AuthResponse = response;

      TokenService.setAuthData(authData);

      const decodedToken = jwtDecode<DecodedJwtPayload>(authData.access_token);
      console.log("Decoded Token:", decodedToken);
      const userFromToken = mapAuth0ProfileToUser(decodedToken);

      setUser(userFromToken);
      localStorage.setItem("user_data", JSON.stringify(userFromToken));

      router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Error durante el login:", error);

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response: { data: string } };
        console.error("Respuesta del backend:", axiosError.response.data);
      }

      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      console.log(data);
    } catch (error) {
      console.error("Error durante el registro:", error);
      throw error; // Propaga el error
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
        register,
        login,
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
