import { api } from '@/core/api';

export interface Message {
  id?: string;
  content: string;
  sender: string;
  timestamp: Date;
  isRead: boolean;
}

export interface Conversation {
  id?: string;
  participants: string[];
  messages: Message[];
  createdAt: string;
  updatedAt?: string;
  lastMessage?: Message;
}

export const chatService = {


  async getConversations(): Promise<Conversation[]> {
    const response = await api.get('api/conversations');
    console.log('Conversations:', response);
    return response.data as Conversation[];
  },

  async getConversation(id: string): Promise<Conversation> {
    const response = await api.get(`api/conversations/${id}`);
    return response.data;
  },

  async addNewConversation(converstaions: Conversation): Promise<Conversation> {
    const response = await api.post('api/conversations', { converstaions });
    return response.data as Conversation;
  },

  async sendMessage(conversationId: string, content: string): Promise<Message> {
    const response = await api.post(`api/conversations/${conversationId}/messages`, { content });
    return response.data;
  },

  async markAsRead(conversationId: string, messageId: string): Promise<void> {
    await api.put(`api/conversations/${conversationId}/messages/${messageId}/read`);
  }
};