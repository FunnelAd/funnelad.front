export interface Trigger {
  id: string;
  name: string;
  description: string;
  model: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  storeId: string;
  storeName: string;
  createdBy: string;
  lastUsed?: string;
  totalConversations?: number;
  successRate?: number;
  phone?: string;
  triggerTemplateId?: string;
  responseTime?: number;
  responseType?: number;
  messageSendType?: string;
  useEmojis?: boolean;
  useStyles?: boolean;
  audioVoice?: string;
  audioCount?: number;
  replyAudioWithAudio?: boolean;
  whatsappNumber?: string;
  whatsappBusinessId?: string;
  metaAppId?: string;
  metaToken?: string;
  webhookUrl?: string;
  webhookToken?: string;
}

export interface CreateTriggerData {
  name: string;
  description: string;
  model: string;
  storeId: string;
  phone?: string;
  welcomeTemplateId?: string;
  isActive: boolean;
  responseTime?: number;
  responseType?: number;
  messageSendType?: string;
  useEmojis?: boolean;
  useStyles?: boolean;
  audioVoice?: string;
  audioCount?: number;
  replyAudioWithAudio?: boolean;
  whatsappNumber?: string;
  whatsappBusinessId?: string;
  metaAppId?: string;
  metaToken?: string;
  webhookUrl?: string;
  webhookToken?: string;
}

export interface UpdateTriggerData {
  name?: string;
  description?: string;
  model?: string;
  isActive?: boolean;
} 