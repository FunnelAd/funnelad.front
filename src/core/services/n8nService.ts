import { api } from '@/core/api';
import { N8N } from '../types/n8n';
import { Message } from '../types/chat';


export const n8nService = {
  
  async sendMessageAgentAI(data: N8N): Promise<Message> {
    const response = await api.post('api/n8n/sendMessageAgent', data);
    console.log('response N8N Message:', response);
    return  response.data as Message;
  },

  

  async sendTemplateAgentAI(data: N8N): Promise<Message> {
    const response = await api.post('api/n8n/sendTemplateAgent', data);
    console.log('response N8N Message:', response);
    return  response.data as Message;
  },



  
}; 