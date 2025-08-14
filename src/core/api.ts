"use client";
import axios from "axios";
import { AuthResponse } from "@/core/types/auth";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
// const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://funnelad-api-tq49.onrender.com";
class TokenService {
  private static readonly TOKEN_KEY = "auth_token";
  private static readonly REFRESH_TOKEN_KEY = "refresh_token";
  private static readonly EMAIL_KEY = "user_email";

  static getToken(): string | undefined {
    if (typeof window === "undefined") return undefined;
    return Cookies.get(this.TOKEN_KEY);
  }

  static getEmail(): string | undefined {
    if (typeof window === "undefined") return undefined;
    return Cookies.get(this.EMAIL_KEY);
  }

  static setAuthData(response: AuthResponse): void {
    if (typeof window === "undefined") return;
    const decoded: { email?: string } = jwtDecode(response.access_token);
    const isProd = process.env.NODE_ENV === "test";
    const cookieOptions = {
      expires: 7,
      secure: isProd, // Solo secure en producción
      path: "/",
      sameSite: "lax" as const,
      // domain: window.location.hostname, // Asegura dominio local y en prod_hostname
    };

    // Guarda el access_token
    Cookies.set(this.TOKEN_KEY, response.access_token, cookieOptions);
    Cookies.set(this.TOKEN_KEY, response.access_token, cookieOptions);
    // Guarda refresh token
    if (response.refresh_token) {
      Cookies.set(
        this.REFRESH_TOKEN_KEY,
        response.refresh_token,
        cookieOptions
      );
    }
    // Guarda email extraído
    if (decoded.email) {
      Cookies.set(this.EMAIL_KEY, decoded.email, cookieOptions);
    }
  }

  static clearAuthData(): void {
    if (typeof window === "undefined") return;
    const domain = window.location.hostname;
    Cookies.remove(this.TOKEN_KEY, { domain, path: "/" });
    Cookies.remove(this.REFRESH_TOKEN_KEY, { domain, path: "/" });
    Cookies.remove(this.EMAIL_KEY, { domain, path: "/" });
  }
}

// Instancia de Axios sin headers por defecto
const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Interceptor opcional para auto-inyección de headers
api.interceptors.request.use(
  (config: any) => {
    if (typeof window === "undefined" || !config.headers) return config;

    const token = TokenService.getToken();
    const email = TokenService.getEmail();
    console.log(email);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (email) config.headers.email = email;

    return config;
  },
  (error: any) => Promise.reject(error)
);

export { api, TokenService };
