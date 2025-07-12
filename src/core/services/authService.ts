import { api } from "@/core/api";
import type { AuthResponse } from "@/core/types/auth";

/**
 * Servicio para realizar las llamadas a la API relacionadas con la autenticación.
 */
export const authService = {
  /**
   * Llama al endpoint de login de la API.
   * @param email - Email del usuario.
   * @param password - Contraseña del usuario.
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post("/api/users/login", { email, password });
    console.log("Login response:", response);
    return response.data as AuthResponse;
  },
  /**
   * Llama al endpoint de logout de la API para revocar el refresh token.
   * @param refreshToken - El refresh token que se va a invalidar.
   */
  async logout(refreshToken: string): Promise<void> {
    // Esta llamada específica no necesita un token de autorización en la cabecera,
    // ya que se autoriza con el propio refresh token en el cuerpo de la solicitud.
    await api.post("/api/users/logout", { refreshToken });
  },

  /**
   * Llama al endpoint de verificación de sesión.
   */
  async verifyToken(): Promise<AuthResponse> {
    const response = await api.get("/auth/verify");
    return response.data as AuthResponse;
  },
};
