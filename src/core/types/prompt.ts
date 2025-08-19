

export interface IPrompt {
  _id: string;
  description: string;
  content: string;
  category: 'core' | 'personality' | 'industry' | 'channel'| null;
  isActive: boolean;
  createdBy: string;
  idBusiness: string;
  createdAt: string;
  updatedAt: string;
  tags: string[]; // Optional tags for categorization
}

export type PromptFormData = {
  description: string;
  content: string;
  category: 'core' | 'personality' | 'industry' | 'channel' | null;
  tags?: string[]; // Keeping tags as optional if they are used elsewhere
};