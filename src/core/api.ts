import axios from 'axios';
import { AuthResponse } from '@/core/types/auth';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class TokenService {
  private static readonly TOKEN_KEY = 'token';
  private static readonly EMAIL_KEY = 'email';
  private static readonly EXPIRES_KEY = 'expires_in';

  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static getEmail(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.EMAIL_KEY);
  }

  static setAuthData(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.access_token);
    localStorage.setItem(this.EXPIRES_KEY, response.expires_in.toString());
    if (response.email) {
      localStorage.setItem(this.EMAIL_KEY, response.email);
    }
    if (response.company) {
      localStorage.setItem('company', JSON.stringify(response.company));
    }
  }

  static clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.EMAIL_KEY);
    localStorage.removeItem(this.EXPIRES_KEY);
  }

  static isTokenExpired(): boolean {
    // const expiresIn = localStorage.getItem(this.EXPIRES_KEY);
    // if (!expiresIn) return true;
    
    // const expirationDate = new Date(parseInt(expiresIn) * 1000); // Convertir a milisegundos
    // return new Date() > expirationDate;
    return false;
  }
}

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar headers de autenticación
api.interceptors.request.use((config) => {
  if (typeof window === 'undefined') return config;

  const token = TokenService.getToken();
  const email = TokenService.getEmail();

  if (config.headers) {
    // Verificar y añadir token si existe
    if (token) {
      if (TokenService.isTokenExpired()) {
        TokenService.clearAuthData();
        window.location.href = '/auth';
        return Promise.reject('Token expirado');
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Añadir email si existe, independientemente del token
    if (email) {
      config.headers['email'] = email;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      TokenService.clearAuthData();
      if (typeof window !== 'undefined') {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

export { TokenService };