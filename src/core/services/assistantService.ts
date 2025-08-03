import {
  IAssistant,
  CreateAssistantData,
  UpdateAssistantData,
} from "../types/assistant";
import { api, TokenService } from "../api"; // Asumo que 'api' es tu instancia de Axios o un wrapper similar

export const assistantService = {
  async getAssistants(): Promise<IAssistant[]> {
    try {
      const token = TokenService.getToken();
      const email = TokenService.getEmail();
      const response = await api.get("/api/assistants/getAll", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(email ? { email } : {}),
          "Content-Type": "application/json",
        },
      });
      return response.data as IAssistant[];
    } catch (error) {
      console.error("Error al obtener asistentes:", error);
      // Re-lanzar el error para que los componentes puedan manejarlo
      throw error;
    }
  },

  async createAssistant(data: CreateAssistantData): Promise<IAssistant> {
    console.log(
      "Enviando estos datos al backend para crear:",
      JSON.stringify(data, null, 2)
    );

    try {
      const response = await api.post("/api/assistants/create", data);
      return response.data as IAssistant;
    } catch (error) {
      console.error("Error al crear asistente:", error);
      // Re-lanzar el error
      throw error;
    }
  },

  async updateAssistant(
    id: string,
    data: UpdateAssistantData
  ): Promise<IAssistant> {
    console.log(
      `Enviando estos datos al backend para actualizar el asistente ${id}:`,
      JSON.stringify(data, null, 2)
    );
    try {
      const token = TokenService.getToken();
      const email = TokenService.getEmail();
      // console.log(token)
      // const response = await api.post(
      //   "/api/crm/customer",
      //   {idBusiness:idBusiness},
      //   {
      //     headers: {
      //       ...(token ? { Authorization: `Bearer ${token}` } : {}),
      //       ...(email ? { email } : {}),
      //       "Content-Type": "application/json",
      //     },
      //   }
      // )

      const response = await api.put(`/api/assistants/${id}`, data, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(email ? { email } : {}),
          "Content-Type": "application/json",
        },
      });
      return response.data as IAssistant;
    } catch (error) {
      console.error(`Error al actualizar asistente con ID ${id}:`, error);
      // Re-lanzar el error
      throw error;
    }
  },

  async deleteAssistant(id: string): Promise<void> {
    // Simulación de llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  },
};
