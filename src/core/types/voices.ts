export interface IVoice {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'unknown';
  language: string;
  provider: string;
  sample_url?: string;
}

export type CreateVoiceData = Omit<
  IVoice,
  | "_id"
  | "createdAt"
  | "updatedAt"
  | "updatedBy"
>;

export type UpdateVoiceData = Partial<CreateVoiceData>;
