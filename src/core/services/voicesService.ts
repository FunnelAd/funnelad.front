import {
  IVoice,
  CreateVoiceData,
  // UpdateVoiceData,
} from "../types/voices";
import { api,TokenService } from "../api"; // Asumo que 'api' es tu instancia de Axios o un wrapper similar

export const voicesService = {
  /**
   * Obtiene todos los asistentes del backend.
   * @returns Una promesa que resuelve a un array de asistentes.
   */
  async getAvailableVoices(): Promise<IVoice[]> {
    try {
            
      const token = TokenService.getToken();
      const email = TokenService.getEmail();
      const response = await api.get("/api/voices/getAvailableVoices",  {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(email ? { email } : {}),
            "Content-Type": "application/json",
          },
        });
      return response.data as IVoice[];
    } catch (error) {
      console.error("Error al obtener asistentes:", error);
      // Re-lanzar el error para que los componentes puedan manejarlo
      throw error;
    }
  },

   async testService(): Promise<void> {
    try {
            
      const token = TokenService.getToken();
      const email = TokenService.getEmail();
      const response = await api.get("/api/voices/getAvailableVoices",  {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(email ? { email } : {}),
            "Content-Type": "application/json",
          },
        });

    } catch (error) {
      console.error("Error al obtener asistentes:", error);
      // Re-lanzar el error para que los componentes puedan manejarlo
      throw error;
    }
  },

  /**
   * Crea un nuevo asistente en el backend.
   * @param data Los datos del nuevo asistente.
   * @returns Una promesa que resuelve al asistente creado.
   */
  async createAssistant(data: CreateVoiceData): Promise<IVoice> {
    console.log(
      "Enviando estos datos al backend para crear:",
      JSON.stringify(data, null, 2)
    );

    try {
      const response = await api.post("/api/assistants/create", data);
      return response.data as IVoice;
    } catch (error) {
      console.error("Error al crear asistente:", error);
      // Re-lanzar el error
      throw error;
    }
  },

};
