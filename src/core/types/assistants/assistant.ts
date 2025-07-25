export interface Assistant {
  _id?: string;
  name: string;
  phone: string;
  businessid?: string;
  nit: string;
  createBy?: string; // Ojo al typo que espera el backend
  welcomeMsg?: string;
  timeResponse: number;
  assistensResponseP: number;
  templates: Array<{ idTemplate: string; active: boolean }>;
  triggers: Array<{ idTriggers: string; active: boolean }>;
  emotesUse: boolean;
  stylesUse: boolean;
  voice: { id: number; name: string; gender: string };
  amountAudio: number;
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
  active: boolean;
  model?: string;
  lastUsed?: string;
  createdAt?: string;
  updatedAt?: string;
  updatedBy?: string;
  prompt?: string;
}

export type CreateAssistantData = Omit<
  Assistant,
  | "_id"
  | "createdAt"
  | "updatedAt"
  | "updatedBy"
  | "totalConversations"
  | "successRate"
>;

export type UpdateAssistantData = Partial<CreateAssistantData>;
