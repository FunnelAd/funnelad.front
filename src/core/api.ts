// En @/core/api.ts
import axios from "axios";
import { AuthResponse } from "@/core/types/auth";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "https://funnelad-api.onrender.com";

class TokenService {
  private static readonly TOKEN_KEY = "auth_token";
  private static readonly REFRESH_TOKEN_KEY = "refresh_token";
  private static readonly EMAIL_KEY = "user_email";

  static getToken(): string | undefined {
    // CAMBIO: Puede devolver undefined
    if (typeof window === "undefined") return undefined;
    return Cookies.get(this.TOKEN_KEY); // CAMBIO: Leer de Cookies
  }

  static getEmail(): string | undefined {
    if (typeof window === "undefined") return undefined;
    return Cookies.get(this.EMAIL_KEY); // CAMBIO: Leer de Cookies
  }

  static getRefreshToken(): string | undefined {
    if (typeof window === "undefined") return undefined;
    return Cookies.get(this.REFRESH_TOKEN_KEY); // CAMBIO: Leer de Cookies
  }

  static setAuthData(response: AuthResponse): void {
    if (typeof window === "undefined") return;

    const decodedToken: { email?: string } = jwtDecode(response.id_token);

    // CAMBIO: Guardar todo en Cookies en lugar de localStorage
    const cookieOptions = {
      expires: 7, // Días para que expire la cookie
      secure: process.env.NODE_ENV === "production",
      path: "/",
    };

    Cookies.set(this.TOKEN_KEY, response.id_token, cookieOptions);

    if (response.refresh_token) {
      Cookies.set(
        this.REFRESH_TOKEN_KEY,
        response.refresh_token,
        cookieOptions
      );
    }

    if (decodedToken.email) {
      Cookies.set(this.EMAIL_KEY, decodedToken.email, cookieOptions);
    }
  }

  static clearAuthData(): void {
    if (typeof window === "undefined") return;
    Cookies.remove(this.TOKEN_KEY);
    Cookies.remove(this.REFRESH_TOKEN_KEY);
    Cookies.remove(this.EMAIL_KEY);
  }
}

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window === "undefined") return config;

    const token = TokenService.getToken();
    const email = TokenService.getEmail();

    config.headers = config.headers || {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (email) {
      config.headers["email"] = email;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export { TokenService };
