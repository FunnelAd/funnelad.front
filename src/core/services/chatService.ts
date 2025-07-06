import { api } from "@/core/api";

export interface Message {
  sessionid: string;
  content: string;
  sender: string;
  type: string;
  timestamp: Date;
  businessid: string;
  isRead: boolean;
}

export interface Conversation {
  id?: string;
  sessionid: string;
  nameUser: string;
  businessid: string;
  businessName: string;
  messages: Message[];
  createdAt: string;
  updatedAt?: string;
  lastMessage?: Message;
}

export const chatService = {
  async getConversation(sessionid: string): Promise<Conversation[]> {
    const response = await api.get(`api/conversations/${sessionid}`);
    console.log("Conversations:", response);
    return response.data as Conversation[];
  },

  async getConversations(id: string): Promise<Conversation[]> {
    const response = await api.get(`api/conversations/business/${id}`);
    return response.data as Conversation[];
  },

  async addNewConversation(converstaions: Conversation): Promise<Conversation> {
    const response = await api.post("api/conversations", { converstaions });
    return response.data as Conversation;
  },

  async addMessage(message: Message): Promise<Conversation> {
    console.log("Adding message:", message);
    const response = await api.post("api/conversations/add-message", message);
    return response.data as Conversation;
  },

  async sendMessage(conversationId: string, content: string): Promise<Message> {
    const response = await api.post("api/conversations/add-message", {
      content,
    });
    return response.data as Message;
  },

  async markAsRead(conversationId: string, messageId: string): Promise<void> {
    await api.put(
      `api/conversations/${conversationId}/messages/${messageId}/read`
    );
  },
};
