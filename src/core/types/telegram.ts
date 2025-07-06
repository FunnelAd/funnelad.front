import { TemplateFormData } from "@/presentation/components/TemplateModal";

export interface N8N {
    id?: string;
    sender: string;
    content: string;
    context?: [];
    templates?: [TemplateFormData];
    isActive?: boolean;
    chat_style?: number;
    description?: string;
    prompt?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;

}

export interface connectTelegramWebhookResponse {
    ok: boolean,
    result?: boolean
    description: string
    error_code?: number
}