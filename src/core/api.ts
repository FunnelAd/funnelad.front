// En @/core/api.ts
import axios from "axios";
import { AuthResponse } from "@/core/types/auth";
import { jwtDecode } from "jwt-decode";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "https://funnelad-api.onrender.com";

class TokenService {
  private static readonly TOKEN_KEY = "access_token";
  private static readonly EXPIRES_AT_KEY = "token_expires_at";
  private static readonly EMAIL_KEY = "user_email";

  static getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static getEmail(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(this.EMAIL_KEY);
  }

  static setAuthData(response: AuthResponse): void {
    if (typeof window === "undefined") return;
    const expiresInSeconds = response.expires_in;
    const expirationTime = new Date().getTime() + expiresInSeconds * 1000;
    const decodedToken: { email?: string } = jwtDecode(response.access_token);
    localStorage.setItem(this.TOKEN_KEY, response.access_token);
    localStorage.setItem(this.EXPIRES_AT_KEY, expirationTime.toString());
    if (decodedToken.email) {
      localStorage.setItem(this.EMAIL_KEY, decodedToken.email);
    }
  }

  static clearAuthData(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.EXPIRES_AT_KEY);
    localStorage.removeItem(this.EMAIL_KEY);
  }

  static isTokenExpired(): boolean {
    if (typeof window === "undefined") return true;
    const expirationTime = localStorage.getItem(this.EXPIRES_AT_KEY);
    if (!expirationTime) return true;
    return new Date().getTime() > Number(expirationTime);
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
    if (token && !TokenService.isTokenExpired()) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (email) {
      config.headers = config.headers || {};
      config.headers["email"] = email;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { TokenService };
