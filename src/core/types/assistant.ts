export interface Assistant {
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
}

export interface CreateAssistantData {
  name: string;
  description: string;
  model: string;
  storeId: string;
}

export interface UpdateAssistantData {
  name?: string;
  description?: string;
  model?: string;
  isActive?: boolean;
} 