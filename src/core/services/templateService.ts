import { api } from '@/core/api';
import type { TemplateFormData } from '@/presentation/components/TemplateModal';

export interface Template {
  id?: string;
  name: string;
  messages: [];
  template_type: string;
  isActive: boolean;
  chat_style: number;
  description: string;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  databaseType: "mongodb";
  idCompany: "Funnelad";
  nit?: string;
  

}

export const templateService = {
  
  async getTemplates(): Promise<Template[]> {
    const response = await api.get('api/templates');
    console.log('Templates:', response);
    return response.data;
  },

  async createTemplate(data: TemplateFormData): Promise<Template> {
    const response = await api.post('api/templates', data);
    console.log('Create Template:', response);
    return response.data;
  },

  async updateTemplate(id: string, data: TemplateFormData): Promise<Template> {
    const response = await api.put(`api/templates/${id}`, data);
    return response.data;
  },

  async deleteTemplate(id: string): Promise<void> {
    await api.delete(`/templates/${id}`);
  },
}; 