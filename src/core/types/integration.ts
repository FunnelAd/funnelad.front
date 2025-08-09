export type IntegrationType = "WABA" | "Telegram" | "Email";

export interface Integration {
  _id: string;
  name: string;
  provider: IntegrationType;
  description: string;
  status: "Active" | "Inactive" | "Error";
  createdAt: string;
  lastSync: string;
  config: {
    apiKey?: string;
    urlBotTelegram?: string;
    botToken?: string;
    smtpServer?: string;
    email?: string;
    appID?: string;
    metaIDBusiness?: string;
    accessToken?: string;
    appSecret?: string;
  };
  stats: {
    totalRequests: number;
    successRate: number;
    lastError?: string;
  };
};



export type CreateIntegrationData = Omit<
  Integration,
  | "_id"
  | "createdAt"
  | "updatedAt"
  | "updatedBy"
>;

export type UpdateIntegrationData = Partial<CreateIntegrationData>;