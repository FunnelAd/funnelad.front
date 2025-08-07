import { api } from "@/core/api"; // Importa tu instancia de Axios
import { IPrompt } from "@/core/types/prompt";

export const getPromptsByCompany = async (
  companyId: string
): Promise<IPrompt[]> => {
  try {
    const response = await api.get(`/prompts/company`, {
      params: { companyId },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch prompts:", error);
    throw new Error("No se pudieron obtener los prompts.");
  }
};

export const createPrompt = async (
  promptData: Partial<IPrompt>
): Promise<IPrompt> => {
  try {
    const response = await api.post("/prompts", promptData);
    return response.data;
  } catch (error) {
    console.error("Failed to create prompt:", error);
    throw new Error("No se pudo crear el prompt.");
  }
};

export const updatePrompt = async (
  id: string,
  promptData: Partial<IPrompt>
): Promise<IPrompt> => {
  try {
    const response = await api.put(`/prompts/${id}`, promptData);
    return response.data;
  } catch (error) {
    console.error("Failed to update prompt:", error);
    throw new Error("No se pudo actualizar el prompt.");
  }
};

export const deletePrompt = async (id: string): Promise<void> => {
  try {
    await api.delete(`/prompts/${id}`);
  } catch (error) {
    console.error("Failed to delete prompt:", error);
    throw new Error("No se pudo eliminar el prompt.");
  }
};
