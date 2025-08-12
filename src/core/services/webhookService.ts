// services/webhookService.ts
import { WebhookPayload, Message, Conversation } from '../types/chat';

export class WebhookService {
  private static instance: WebhookService;
  private eventListeners: Map<string, Function[]> = new Map();
  private websocket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  static getInstance(): WebhookService {
    if (!WebhookService.instance) {
      WebhookService.instance = new WebhookService();
    }
    return WebhookService.instance;
  }

  // Inicializar conexión WebSocket para recibir mensajes en tiempo real
  initializeWebSocket(userId: string) {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080';
    
    try {
      this.websocket = new WebSocket(`${wsUrl}/chat/${userId}`);
      
      this.websocket.onopen = () => {
        console.log('WebSocket conectado');
        this.reconnectAttempts = 0;
        this.emit('connection_status', { connected: true });
      };

      this.websocket.onmessage = (event) => {
        try {
          const payload: WebhookPayload = JSON.parse(event.data);
          this.handleWebhookMessage(payload);
        } catch (error) {
          console.error('Error al procesar mensaje WebSocket:', error);
        }
      };

      this.websocket.onclose = () => {
        console.log('WebSocket desconectado');
        this.emit('connection_status', { connected: false });
        this.attemptReconnect(userId);
      };

      this.websocket.onerror = (error) => {
        console.error('Error de WebSocket:', error);
        this.emit('connection_error', { error });
      };
    } catch (error) {
      console.error('Error al inicializar WebSocket:', error);
    }
  }

  private attemptReconnect(userId: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Intentando reconectar... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.initializeWebSocket(userId);
      }, 3000 * this.reconnectAttempts);
    }
  }

  // Manejar mensajes de webhook
  private handleWebhookMessage(payload: WebhookPayload) {
    const message: Message = {
      id: payload.messageId,
      content: payload.content,
      sender: payload.sender,
      timestamp: new Date(payload.timestamp),
      isRead: false,
      platform: payload.platform,
      messageType: payload.messageType as any,
      metadata: payload.metadata
    };

    this.emit('new_message', { message, conversationId: payload.conversationId });
  }

  // Registrar webhook para WhatsApp
  async registerWhatsAppWebhook(phoneNumberId: string, accessToken: string, webhookUrl: string) {
    try {
      const response = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          webhooks: {
            url: webhookUrl,
            fields: ['messages', 'message_deliveries', 'message_reads'],
          }
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Error registrando webhook de WhatsApp:', error);
      throw error;
    }
  }

  // Registrar webhook para Instagram
  async registerInstagramWebhook(pageId: string, accessToken: string, webhookUrl: string) {
    try {
      const response = await fetch(`https://graph.facebook.com/v18.0/${pageId}/subscriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          object: 'instagram',
          callback_url: webhookUrl,
          fields: ['messages', 'messaging_postbacks', 'messaging_optins'],
          verify_token: process.env.INSTAGRAM_VERIFY_TOKEN
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Error registrando webhook de Instagram:', error);
      throw error;
    }
  }

  // Configurar webhook para Telegram
  async setTelegramWebhook(botToken: string, webhookUrl: string) {
    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: webhookUrl,
          allowed_updates: ['message', 'callback_query'],
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Error configurando webhook de Telegram:', error);
      throw error;
    }
  }

  // Enviar mensaje a WhatsApp
  async sendWhatsAppMessage(phoneNumberId: string, accessToken: string, to: string, message: string) {
    try {
      const response = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body: message }
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Error enviando mensaje de WhatsApp:', error);
      throw error;
    }
  }

  // Enviar mensaje a Instagram
  async sendInstagramMessage(pageId: string, accessToken: string, recipientId: string, message: string) {
    try {
      const response = await fetch(`https://graph.facebook.com/v18.0/${pageId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient: { id: recipientId },
          message: { text: message }
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Error enviando mensaje de Instagram:', error);
      throw error;
    }
  }

  // Enviar mensaje a Telegram
  async sendTelegramMessage(botToken: string, chatId: string, message: string) {
    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Error enviando mensaje de Telegram:', error);
      throw error;
    }
  }

  // Enviar email
  async sendEmail(to: string, subject: string, content: string, from?: string) {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject,
          content,
          from: from || process.env.DEFAULT_FROM_EMAIL
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Error enviando email:', error);
      throw error;
    }
  }

  // Sistema de eventos
  on(event: string, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)?.push(callback);
  }

  off(event: string, callback: Function) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  disconnect() {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }
}