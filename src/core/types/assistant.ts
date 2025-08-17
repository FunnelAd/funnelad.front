import { Integration } from "./integration";
import { IVoice } from "./voices";

export interface IAssistant {
  _id?: string;
  name: string;
  phone: string;
  description: string;
  agentPrompt: string;
  agentType: string;
  idBusiness?: string;
  createBy?: string; // Ojo al typo que espera el backend
  welcomeMsg?: string;
  welcomeTemplateId: string;
  isActive: boolean;
  useEmojis: boolean;
  useStyles: boolean;
  audioVoice: string;
  audioCount: number;
  responseTime: number;
  responseType: number;
  whatsappNumber: string;
  whatsappBusinessId: string;
  templates?: Array<{ idTemplate: string; active: boolean }>;
  triggers?: Array<{ idTriggers: string; active: boolean }>;
  voice?: { id: number; name: string; gender: string };
  amountAudio?: number;
  voiceResponse: boolean;
  idPhoneNumber: string;
  idWppBusinessAccount: string;
  idMetaApp: string;
  tokenMetaPermanent: string;
  webhook: string;
  tokenWebhook: string;
  tokenTelegram: string;
  chatidTelegram?: string;
  totalConversations: string;
  successRate: string;
  model?: string;
  lastUsed?: string;
  createdAt: string;
  updatedAt?: string;
  updatedBy?: string;
  prompt: string;
  webhookToken: string;
  webhookUrl: string;
  metaToken: string;
  metaAppId: string;
  channels: string[];
  communicationStyle: string;
  emojiUsage?: string;
  creativity: number;
  voiceSelection: string;
  voiceTemperature: number;
  callDirection: string;
  welcomeMessage: string;
  behaviorDescription: string;
  selectedVoice: IVoice | null;
  metaAccount:string,
  telegramBot: string,
  emailNotifications: string,
  integrationAccount?: Integration
}

export type CreateAssistantData = Omit<
  IAssistant,
  | "createdAt"
  | "updatedAt"
  | "updatedBy"
  | "totalConversations"
  | "successRate"
>;

export type UpdateAssistantData = Partial<CreateAssistantData>;
