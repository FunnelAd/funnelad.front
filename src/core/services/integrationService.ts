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
  async getAllIntegrations(): Promise<Integration[]> {
       try {
    
          const token = TokenService.getToken();
          const email = TokenService.getEmail();
          // console.log(token)
          const response = await api.post(
            "/api/integration/getAllIntegrations",
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
      throw error;
    }
  },

  /**
   * Deletes a single integration by its ID.
   * @param id The ID of the integration to delete.
   * @returns A promise that resolves when the integration is deleted.
   */
  async delete(id: string): Promise<void> {
    try {
      const token = TokenService.getToken();
      await api.delete(`/api/integration/${id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch (error) {
      console.error(`Error deleting integration ${id}:`, error);
      throw error;
    }
  },

  /**
   * Deletes multiple integrations by their IDs.
   * @param ids An array of integration IDs to delete.
   * @returns A promise that resolves when the integrations are deleted.
   */
  async deleteMany(ids: string[]): Promise<void> {
    try {
      const token = TokenService.getToken();
      await api.post("/api/integration/delete-many", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "application/json",
        },
        ids,
      });
    } catch (error) {
      console.error("Error deleting multiple integrations:", error);
      throw error;
    }
  },

};
