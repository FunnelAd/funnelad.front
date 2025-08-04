import {
  Integration,
  CreateIntegrationData,
  // UpdateVoiceData,
} from "../types/integration";
import { api, TokenService } from "../api"; // Asumo que 'api' es tu instancia de Axios o un wrapper similar

export const integrationService = {
  /**
   * Obtiene todos los asistentes del backend.
   * @returns Una promesa que resuelve a un array de asistentes.
   */
  async getAllIntegrations(idBusiness:string): Promise<Integration[]> {
       try {
    
          const token = TokenService.getToken();
          const email = TokenService.getEmail();
          console.log(token)
          const response = await api.post(
            "/api/integration/getAllIntegrations",
            {idBusiness:idBusiness},
            {
              headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...(email ? { email } : {}),
                "Content-Type": "application/json",
              },
            }
          );
          return response.data as Integration[];
        } catch (error) {
          console.error("Error al obtener clientes:", error);
          throw error;
        }
  },

  /**
   * Crea un nuevo asistente en el backend.
   * @param data Los datos del nuevo asistente.
   * @returns Una promesa que resuelve al asistente creado.
   */
  async create(data: CreateIntegrationData): Promise<Integration> {

    try {

      const token = TokenService.getToken();
      const email = TokenService.getEmail();
      // console.log(token)
      // console.log(email)
      // console.log(data)
      const response = await api.post("/api/integration/create", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(email ? { email } : {}),
          "Content-Type": "application/json",
        },
        ...data
      });
      return response.data as Integration;
    } catch (error) {
      console.error("Error al crear asistente:", error);
      // Re-lanzar el error
      throw error;
    }
  },

};
