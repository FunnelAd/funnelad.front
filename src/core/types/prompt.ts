export type PromptFormData = {
  type: string;
  content: string;
  tags: string[];
};

export interface IPrompt {
  onSave: (data: PromptFormData) => void;
  initialData?: Partial<PromptFormData> | null;
}
