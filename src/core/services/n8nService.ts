import { api } from '@/core/api';
import { N8N, N8NResponse } from '../types/n8n';


export const n8nService = {
  
  // async getTemplates(): Promise<N8N[]> {
  //   const response = await api.get('api/templates');
  //   console.log('Templates:', response);
  //   return response.data;
  // },
  
  // async updateTemplate(id: string, data: N8N): Promise<N8NResponse> {
  //   const response = await api.put(`api/templates/${id}`, data);
  //   return response.data;
  // },

  // async deleteTemplate(id: string): Promise<void> {
  //   await api.delete(`api/templates/${id}`);
  // },

  async sendMessageAgentAI(data: N8N): Promise<N8NResponse> {
    const response = await api.post('api/n8n/sendMessageAgent', data);
    console.log('response N8N Message:', response);
    return  response.data as N8NResponse;
  },

}; 