export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  status: 'sending' | 'sent' | 'error' | 'received' | 'read';
  attachments?: ChatAttachment[];
}

export interface ChatAttachment {
  id: string;
  type: 'image' | 'audio' | 'video' | 'file';
  url: string;
  fileName?: string;
  mimeType?: string;
  size?: number;
}

export interface ChatSession {
  id: string;
  name: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChatSessionData {
  name: string;
  isActive: boolean;
}

export interface UpdateChatSessionData {
  name?: string;
  isActive?: boolean;
}

export interface Message {
  sessionid: string;
  content: string;
  sender: string;
  type: string; // e.g., 'text', 'image', etc.
  timestamp: Date;
  businessid: string;
  isRead: boolean;
}