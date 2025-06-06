import axios from "axios";
import { AuthResponse } from "@/core/types/auth";

// Se obtiene la URL base de las variables de entorno para mayor flexibilidad
const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "https://funnelad-api.onrender.com";

/**
 * Servicio para gestionar el token de autenticación y datos relacionados en localStorage.
 * Está diseñado para funcionar de forma segura en entornos de Next.js (cliente/servidor).
 */
class TokenService {
  // Claves para almacenar los datos en localStorage
  private static readonly TOKEN_KEY = "access_token";
  private static readonly EMAIL_KEY = "user_email";
  // CAMBIO: Almacenaremos la fecha exacta de expiración, no la duración. Es más fiable.
  private static readonly EXPIRES_AT_KEY = "token_expires_at";

  /**
   * Obtiene el token de acceso desde localStorage.
   * Retorna null si no está en el entorno del navegador.
   */
  static getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Obtiene el email del usuario desde localStorage.
   */
  static getEmail(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(this.EMAIL_KEY);
  }

  /**
   * Guarda los datos de autenticación recibidos de la API.
   * Calcula y guarda la marca de tiempo exacta de cuando el token expirará.
   */
  static setAuthData(response: AuthResponse): void {
    if (typeof window === "undefined") return;

    // El 'expires_in' suele ser la duración en segundos.
    // Calculamos la fecha y hora exactas en que expirará.
    const expiresInSeconds = response.expires_in;
    const expirationTime = new Date().getTime() + expiresInSeconds * 1000;

    localStorage.setItem(this.TOKEN_KEY, response.access_token);
    localStorage.setItem(this.EXPIRES_AT_KEY, expirationTime.toString());

    if (response.email) {
      localStorage.setItem(this.EMAIL_KEY, response.email);
    }
    if (response.company) {
      localStorage.setItem("company", JSON.stringify(response.company));
    }
  }

  /**
   * Limpia todos los datos de autenticación de localStorage.
   */
  static clearAuthData(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.EMAIL_KEY);
    localStorage.removeItem(this.EXPIRES_AT_KEY);
    localStorage.removeItem("company");
  }

  /**
   * CORREGIDO: Verifica si el token ha expirado comparando la fecha guardada con la actual.
   * @returns {boolean} - true si el token ha expirado o no existe, false si es válido.
   */
  static isTokenExpired(): boolean {
    if (typeof window === "undefined") return true; // En el servidor, no hay token.

    const expirationTime = localStorage.getItem(this.EXPIRES_AT_KEY);
    if (!expirationTime) return true; // Si no hay fecha de expiración, se asume expirado.

    // Compara la fecha actual con la fecha de expiración guardada.
    return new Date().getTime() > Number(expirationTime);
  }
}

// Creación de la instancia de Axios que se usará en toda la aplicación.
export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// === INTERCEPTORES: La clave para la automatización ===

/**
 * Interceptor de Petición (Request):
 * Se ejecuta ANTES de que cada petición sea enviada.
 * Su trabajo es verificar si el token es válido y añadirlo a las cabeceras.
 */
api.interceptors.request.use(
  (config) => {
    // Si estamos en el servidor, no hacemos nada con los tokens.
    if (typeof window === "undefined") return config;

    const token = TokenService.getToken();

    // Si hay un token, verificamos si ha expirado.
    if (token) {
      if (TokenService.isTokenExpired()) {
        // Si expiró, limpiamos los datos y redirigimos al login.
        TokenService.clearAuthData();
        window.location.href = "/auth"; // O la ruta de tu login
        // Rechazamos la promesa para detener la petición original.
        return Promise.reject(new Error("Token expirado"));
      }

      // Si el token es válido, lo añadimos a la cabecera de autorización.
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Opcional: Si necesitas enviar el email en cada petición
    const email = TokenService.getEmail();
    if (email) {
      config.headers["X-User-Email"] = email; // Usar 'X-User-Email' es una convención común
    }

    return config;
  },
  (error) => {
    // Si hay un error al configurar la petición, lo rechazamos.
    return Promise.reject(error);
  }
);

/**
 * Interceptor de Respuesta (Response):
 * Se ejecuta DESPUÉS de recibir una respuesta de la API.
 * Su trabajo es manejar errores globales, como un '401 Unauthorized'.
 */
api.interceptors.response.use(
  // Si la respuesta es exitosa (código 2xx), simplemente la pasamos.
  (response) => response,
  // Si la respuesta es un error...
  (error) => {
    // Verificamos si el error es una respuesta de la API y si el código es 401.
    if (error.response?.status === 401) {
      // Un 401 significa que el servidor nos rechazó (token inválido, expirado, etc.).
      // Actuamos como un "seguro" por si la verificación en el request falló.
      TokenService.clearAuthData();
      if (typeof window !== "undefined") {
        window.location.href = "/auth";
      }
    }
    // Es crucial rechazar el error para que el código que hizo la llamada (p. ej., en un componente)
    // pueda manejarlo en su propio bloque .catch().
    return Promise.reject(error);
  }
);

// Exportamos el servicio de token y la instancia de api para ser usados en otras partes.
export { TokenService };
