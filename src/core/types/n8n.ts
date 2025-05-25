import { TemplateFormData } from "@/presentation/components/TemplateModal";

export interface N8N {
    id?: string;
    name: string;
    messages: [];
    context: string;
    templates: [TemplateFormData];
    isActive: boolean;
    chat_style: number;
    description: string;
    createdAt: string;
    updatedAt?: string;
    createdBy: string;

}

export interface N8NResponse {
    id: string;
    name: string;
    messages: [];
}