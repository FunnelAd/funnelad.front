import { api } from '@/core/api';
import type { TemplateFormData } from '@/presentation/components/TemplateModal';

export interface Template {
  id: string;
  name: string;
  content: string;
  type: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export const templateService = {
  async getTemplates(): Promise<Template[]> {
    const response = await api.get('/templates');
    return response.data;
  },

  async createTemplate(data: TemplateFormData): Promise<Template> {
    const response = await api.post('/templates', data);
    return response.data;
  },

  async updateTemplate(id: string, data: TemplateFormData): Promise<Template> {
    const response = await api.put(`/templates/${id}`, data);
    return response.data;
  },

  async deleteTemplate(id: string): Promise<void> {
    await api.delete(`/templates/${id}`);
  },
}; 