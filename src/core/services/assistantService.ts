import {
  Assistant,
  CreateAssistantData,
  UpdateAssistantData,
} from "../types/assistants/assistant";
import { api } from "../api"; // Asumo que 'api' es tu instancia de Axios o un wrapper similar

export const assistantService = {
  /**
   * Obtiene todos los asistentes del backend.
   * @returns Una promesa que resuelve a un array de asistentes.
   */
  async getAssistants(): Promise<Assistant[]> {
    try {
      const response = await api.get("/api/assistants/getAll");
      return response.data as Assistant[];
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
  async createAssistant(data: CreateAssistantData): Promise<Assistant> {
    console.log(
      "Enviando estos datos al backend para crear:",
      JSON.stringify(data, null, 2)
    );

    try {
      const response = await api.post("/api/assistants/create", data);
      return response.data as Assistant;
    } catch (error) {
      console.error("Error al crear asistente:", error);
      // Re-lanzar el error
      throw error;
    }
  },

  /**
   * Actualiza un asistente existente en el backend.
   * @param id El ID del asistente a actualizar.
   * @param data Los datos a actualizar del asistente.
   * @returns Una promesa que resuelve al asistente actualizado.
   */
  async updateAssistant(
    id: string,
    data: UpdateAssistantData
  ): Promise<Assistant> {
    console.log(
      `Enviando estos datos al backend para actualizar el asistente ${id}:`,
      JSON.stringify(data, null, 2)
    );
    try {
      const response = await api.put(`/api/assistants/${id}`, data);
      return response.data as Assistant;
    } catch (error) {
      console.error(`Error al actualizar asistente con ID ${id}:`, error);
      // Re-lanzar el error
      throw error;
    }
  },

  /**
   * Elimina un asistente del backend.
   * @param id El ID del asistente a eliminar.
   * @returns Una promesa que resuelve cuando la eliminación es exitosa.
   */
  async deleteAssistant(id: string): Promise<void> {
    console.log(`Solicitando eliminación del asistente con ID: ${id}`);
    try {
      // Endpoint DELETE /api/assistants/delete/:id (basado en tu última confirmación de ruta)
      await api.delete(`/api/assistants/delete/${id}`);
      // No devuelve data, solo esperamos que la operación sea exitosa
      console.log(`Asistente con ID ${id} eliminado exitosamente.`);
    } catch (error) {
      console.error(`Error al eliminar asistente con ID ${id}:`, error);
      // Re-lanzar el error
      throw error;
    }
  },
};
