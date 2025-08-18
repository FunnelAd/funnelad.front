// types/chat.ts
export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  isRead: boolean;
  platform?: 'whatsapp' | 'instagram' | 'telegram' | 'email' | 'webchat';
  messageType?: 'text' | 'image' | 'video' | 'audio' | 'file';
  metadata?: {
    phoneNumber?: string;
    instagramUserId?: string;
    telegramUserId?: string;
    email?: string;
    attachments?: Attachment[];
  };
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}

export interface Conversation {
  id: string;
  businessId: string; // Identificador único del negocio
  participants: string[];
  messages: Message[];
  createdAt: string;
  lastMessage?: Message;
  platform: 'whatsapp' | 'instagram' | 'telegram' | 'email' | 'webchat';
  unreadCount: number;
  contactInfo: ContactInfo;
}

export interface ContactInfo {
  name: string;
  avatar?: string;
  phone?: string;
  email?: string;
  instagramHandle?: string;
  telegramUsername?: string;
  isOnline: boolean;
  lastSeen?: Date;
  timezone?: string;
  notes: ContactNote[];
}

export interface ContactNote {
  id: string;
  content: string;
  createdAt: Date;
  createdBy: string;
}

export interface WebhookPayload {
  platform: 'whatsapp' | 'instagram' | 'telegram' | 'email';
  messageId: string;
  conversationId: string;
  sender: string;
  content: string;
  timestamp: string;
  messageType: string;
  metadata?: any;
}

export interface BotStatus {
  isActive: boolean;
  platform: string;
  lastChecked: Date;
  responseTime: number;
}