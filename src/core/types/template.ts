export type TemplateMessageType = 'text' | 'image' | 'audio' | 'video' | 'file';
export type ChatStyle = 'whatsapp' | 'messenger' | 'instagram';



export interface TemplateMessage {
    id: string;
    type: TemplateMessageType;
    content: string; // texto o url del archivo
    fileName?: string;
    mimeType?: string;
}



export interface Template {
    id: string;
    name: string;
    messages: TemplateMessage[];
    template_type: string;
    isActive: boolean;
    chatStyle: ChatStyle;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
}
