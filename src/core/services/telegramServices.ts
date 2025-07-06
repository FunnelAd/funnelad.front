import {
  connectTelegramWebhookResponse,
  
} from "../types/telegram";
import { api } from "../api"; // Asumo que 'api' es tu instancia de Axios o un wrapper similar

export const telegramServices = {
    /**
   * Crea un nuevo asistente en el backend.
   * @param data Los datos del nuevo asistente.
   * @returns Una promesa que resuelve al asistente creado.
   */
  async connectTelegramWebhook(token: string): Promise<connectTelegramWebhookResponse> {
// https://api.telegram.org/bot7616107595:AAHI1OYwd2TCvPX5IyGseg6ky1Myx5yzYfA/setWebhook?url=https://googlen8ndev.myftp.biz/webhook-test/api/assistant-hook&allowed_updates=message&max_connections=40

    try {
      const response = await api.get(`api/n8n/telegram/createWebhook/${token}`);
      return response.data as connectTelegramWebhookResponse;
    } catch (error) {
      console.error("Error al crear asistente:", error);
      // Re-lanzar el error
      throw error;
    }
  },
};
