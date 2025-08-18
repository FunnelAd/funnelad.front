// services/chatService.ts
import { Conversation, Message, ContactInfo, ContactNote, BotStatus } from '../types/chat';
import { WebhookService } from './webhookService';

export class ChatService {
  private static instance: ChatService;
  private webhookService: WebhookService;
  private conversations: Map<string, Conversation> = new Map();
  private eventListeners: Map<string, Function[]> = new Map();

  constructor() {
    this.webhookService = WebhookService.getInstance();
    this.setupWebhookListeners();
  }

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  private setupWebhookListeners() {
    this.webhookService.on('new_message', ({ message, conversationId }: { message: Message, conversationId: string }) => {
      this.handleNewMessage(message, conversationId);
    });

    this.webhookService.on('connection_status', ({ connected }: { connected: boolean }) => {
      this.emit('bot_status_changed', { isActive: connected, platform: 'general' });
    });
  }

  // Inicializar servicio
  async initialize(userId: string) {
    this.webhookService.initializeWebSocket(userId);
    await this.loadConversations();
  }

  // Cargar conversaciones
  private async loadConversations() {
    try {
      const response = await fetch('/api/conversations');
      const data = await response.json();

      data.conversations?.forEach((conv: Conversation) => {
        this.conversations.set(conv.id, conv);
      });

      this.emit('conversations_loaded', { conversations: Array.from(this.conversations.values()) });
    } catch (error) {
      console.error('Error cargando conversaciones:', error);
      // Cargar datos de demostración
      this.loadDemoData();
    }
  }

  // Datos de demostración
  private loadDemoData() {
    const demoConversations: Conversation[] = [
      {
        id: '1',
        businessId: 'business-1',
        participants: ['Juan Camilo ADMIN'],
        messages: [
          {
            id: '1',
            content: 'Necesito información sobre los planes de suscripción.',
            sender: 'Juan Camilo ADMIN',
            timestamp: new Date(Date.now() - 360000),
            isRead: true,
            platform: 'whatsapp'
          },
          {
            id: '2',
            content: 'Claro, tenemos varios planes disponibles. ¿Estás interesado en el plan básico, profesional o empresarial?',
            sender: 'bot',
            timestamp: new Date(Date.now() - 300000),
            isRead: true,
            platform: 'whatsapp'
          },
          {
            id: '3',
            content: 'Me interesa el empresarial. ¿Qué características incluye?',
            sender: 'Juan Camilo ADMIN',
            timestamp: new Date(Date.now() - 240000),
            isRead: true,
            platform: 'whatsapp'
          },
          {
            id: '4',
            content: 'El plan empresarial incluye todas las características premium, soporte 24/7, integraciones ilimitadas y hasta 50 usuarios. ¿Te gustaría una demostración personalizada?',
            sender: 'bot',
            timestamp: new Date(Date.now() - 180000),
            isRead: true,
            platform: 'whatsapp'
          },
          {
            id: '5',
            content: 'Sí, me gustaría programar una demostración para la semana que viene.',
            sender: 'Juan Camilo ADMIN',
            timestamp: new Date(Date.now() - 60000),
            isRead: true,
            platform: 'whatsapp'
          },
          {
            id: '6',
            content: '¡Perfecto! He agendado una demostración para el próximo martes a las 10:00 AM. Te enviaré un correo con los detalles de la reunión. ¿Hay algo más en que pueda ayudarte?',
            sender: 'bot',
            timestamp: new Date(Date.now() - 30000),
            isRead: false,
            platform: 'whatsapp'
          }
        ],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        platform: 'whatsapp',
        unreadCount: 3,
        contactInfo: {
          name: 'Juan Camilo ADMIN',
          phone: '+57 300 123 4567',
          email: 'juan.camilo@example.com',
          isOnline: true,
          timezone: 'America/Bogota',
          notes: []
        },
        lastMessage: {
          id: '6',
          content: '¡Perfecto! He agendado una demostración para el próximo martes a las 10:00 AM. Te enviaré un correo con los detalles de la reunión. ¿Hay algo más en que pueda ayudarte?',
          sender: 'bot',
          timestamp: new Date(Date.now() - 30000),
          isRead: false,
          platform: 'whatsapp'
        }
      },
      {
        id: '2',
        businessId: 'business-2',
        participants: ['Guest 26867'],
        messages: [
          {
            id: '1',
            content: 'Hola, ¿pueden ayudarme?',
            sender: 'Guest 26867',
            timestamp: new Date(Date.now() - 50400000),
            isRead: true,
            platform: 'webchat'
          },
          {
            id: '2',
            content: '¡Hola! Por supuesto, estoy aquí para ayudarte. ¿En qué puedo asistirte hoy?',
            sender: 'bot',
            timestamp: new Date(Date.now() - 50340000),
            isRead: true,
            platform: 'webchat'
          },
          {
            id: '3',
            content: '¿Qué uso?',
            sender: 'Guest 26867',
            timestamp: new Date(Date.now() - 50280000),
            isRead: true,
            platform: 'webchat'
          }
        ],
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        platform: 'webchat',
        unreadCount: 0,
        contactInfo: {
          name: 'Guest 26867',
          isOnline: false,
          lastSeen: new Date(Date.now() - 50280000),
          notes: []
        },
        lastMessage: {
          id: '3',
          content: '¿Qué uso?',
          sender: 'Guest 26867',
          timestamp: new Date(Date.now() - 50280000),
          isRead: true,
          platform: 'webchat'
        }
      },
      {
        id: '3',
        businessId: 'business-3',
        participants: ['Juan Camilo Silva'],
        messages: [
          {
            id: '1',
            content: 'Hola, me interesa conocer más sobre sus servicios',
            sender: 'Juan Camilo Silva',
            timestamp: new Date(Date.now() - 172800000),
            isRead: true,
            platform: 'instagram'
          },
          {
            id: '2',
            content: '¡Hola Juan Camilo! Gracias por contactarnos. Ofrecemos soluciones completas de marketing digital y automatización. ¿Hay algo específico que te interese?',
            sender: 'bot',
            timestamp: new Date(Date.now() - 172740000),
            isRead: true,
            platform: 'instagram'
          },
          {
            id: '3',
            content: 'genial',
            sender: 'Juan Camilo Silva',
            timestamp: new Date(Date.now() - 172680000),
            isRead: true,
            platform: 'instagram'
          }
        ],
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        platform: 'instagram',
        unreadCount: 0,
        contactInfo: {
          name: 'Juan Camilo Silva',
          instagramHandle: '@juancamilo.silva',
          isOnline: false,
          lastSeen: new Date(Date.now() - 172680000),
          notes: []
        },
        lastMessage: {
          id: '3',
          content: 'genial',
          sender: 'Juan Camilo Silva',
          timestamp: new Date(Date.now() - 172680000),
          isRead: true,
          platform: 'instagram'
        }
      }
    ];

    demoConversations.forEach(conv => {
      this.conversations.set(conv.id, conv);
    });

    this.emit('conversations_loaded', { conversations: demoConversations });
  }

  // Obtener conversaciones
  getConversations(): Conversation[] {
    return Array.from(this.conversations.values()).sort((a, b) => {
      const aTime = a.lastMessage?.timestamp?.getTime() || new Date(a.createdAt).getTime();
      const bTime = b.lastMessage?.timestamp?.getTime() || new Date(b.createdAt).getTime();
      return bTime - aTime;
    });
  }

  // Obtener conversaciones por negocio
  getConversationsByBusiness(businessId: string): Conversation[] {
    return Array.from(this.conversations.values()).filter(conv => conv.businessId === businessId);
  }

  // Obtener conversación por ID
  getConversation(id: string): Conversation | null {
    return this.conversations.get(id) || null;
  }

  // Enviar mensaje
  async sendMessage(conversationId: string, content: string): Promise<Message> {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) {
      throw new Error('Conversación no encontrada');
    }

    const newMessage: Message = {
      id: Date.now().toString(), // The backend will generate a real ID
      content,
      sender: 'user', // This should be the current user's ID or name
      timestamp: new Date(),
      isRead: true,
      platform: conversation.platform
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/chat/addNewMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // TODO: Add auth token to the request
            'email': 'user@example.com' // The backend needs an email in the headers
          },
          body: JSON.stringify({
            sessionid: conversation.id, // The conversation ID is the sessionid
            content: content,
            createBy: 'user@example.com' // This should be the current user's email
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // The message is sent to the backend, which will then send it to WhatsApp.
      // The incoming message will be received via WebSocket.
      // We can optimistically add the message to the UI.
      conversation.messages.push(newMessage);
      conversation.lastMessage = newMessage;
      this.emit('message_sent', { message: newMessage, conversationId });

    } catch (error) {
      console.error('Error enviando mensaje:', error);
      throw error;
    }

    return newMessage;
  }

  // Enviar mensaje a plataforma específica
  private async sendMessageToPlatform(conversation: Conversation, content: string) {
    const config = await this.getPlatformConfig(conversation.platform);
    const recipient = conversation.contactInfo;

    switch (conversation.platform) {
      case 'whatsapp':
        if (
          config.whatsapp &&
          typeof config.whatsapp.phoneNumberId === 'string' &&
          typeof config.whatsapp.accessToken === 'string' &&
          typeof recipient.phone === 'string'
        ) {
          await this.webhookService.sendWhatsAppMessage(
            config.whatsapp.phoneNumberId,
            config.whatsapp.accessToken,
            recipient.phone,
            content
          );
        }
        break;

      case 'instagram':
        if (
          config.instagram &&
          typeof config.instagram.pageId === 'string' &&
          typeof config.instagram.accessToken === 'string' &&
          typeof recipient.instagramHandle === 'string'
        ) {
          await this.webhookService.sendInstagramMessage(
            config.instagram.pageId,
            config.instagram.accessToken,
            recipient.instagramHandle,
            content
          );
        }
        break;

      case 'telegram':
        if (
          config.telegram &&
          typeof config.telegram.botToken === 'string' &&
          typeof recipient.telegramUsername === 'string'
        ) {
          await this.webhookService.sendTelegramMessage(
            config.telegram.botToken,
            recipient.telegramUsername,
            content
          );
        }
        break;

      case 'email':
        if (typeof recipient.email === 'string') {
          await this.webhookService.sendEmail(
            recipient.email,
            'Respuesta de FunnelAd',
            content
          );
        }
        break;
    }
  }

  // Obtener configuración de plataformas
  private async getPlatformConfig(platform: string) {
    // En un entorno real, esto vendría de la base de datos o variables de entorno
    return {
      whatsapp: {
        phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
        accessToken: process.env.WHATSAPP_ACCESS_TOKEN
      },
      instagram: {
        pageId: process.env.INSTAGRAM_PAGE_ID,
        accessToken: process.env.INSTAGRAM_ACCESS_TOKEN
      },
      telegram: {
        botToken: process.env.TELEGRAM_BOT_TOKEN
      }
    };
  }

  // Manejar nuevo mensaje
  private handleNewMessage(message: Message, conversationId: string) {
    let conversation = this.getConversation(conversationId);
    if (!conversation) {
      // El businessId debe venir del contexto de la conversación, no del metadata del mensaje
      // Si no existe, se asigna 'default-business'
      const businessId = (message as any).businessId || 'default-business';
      conversation = {
        id: conversationId,
        businessId,
        participants: [message.sender],
        messages: [message],
        createdAt: new Date().toISOString(),
        lastMessage: message,
        platform: message.platform || 'webchat',
        unreadCount: 1,
        contactInfo: {
          name: message.sender,
          isOnline: true,
          notes: []
        }
      };
      this.conversations.set(conversationId, conversation);
    } else {
      conversation.messages.push(message);
      conversation.lastMessage = message;
      conversation.unreadCount += 1;
    }
    this.emit('new_message_received', { message, conversation });
  }

  // Simular respuesta automática
  private simulateAutoResponse(conversationId: string) {
    const responses = [
      "¡Gracias por tu mensaje! Te responderé lo antes posible.",
      "He recibido tu consulta y estoy procesando la información.",
      "Perfecto, déjame revisar eso para ti.",
      "Entiendo tu solicitud, permíteme un momento para preparar la respuesta.",
      "¡Excelente! Te ayudo con eso enseguida."
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    const autoMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: randomResponse,
      sender: 'bot',
      timestamp: new Date(),
      isRead: false,
      platform: this.conversations.get(conversationId)?.platform || 'webchat'
    };

    const conversation = this.conversations.get(conversationId);
    if (conversation) {
      conversation.messages.push(autoMessage);
      conversation.lastMessage = autoMessage;
      this.emit('new_message_received', { message: autoMessage, conversation });
    }
  }

  // Marcar mensajes como leídos
  markAsRead(conversationId: string) {
    const conversation = this.conversations.get(conversationId);
    if (conversation) {
      conversation.unreadCount = 0;
      conversation.messages.forEach(msg => {
        if (msg.sender !== 'user') {
          msg.isRead = true;
        }
      });
      this.emit('conversation_updated', { conversation });
    }
  }

  // Buscar conversaciones
  searchConversations(query: string): Conversation[] {
    const searchTerm = query.toLowerCase();
    return this.getConversations().filter(conversation => {
      const nameMatch = conversation.contactInfo.name.toLowerCase().includes(searchTerm);
      const messageMatch = conversation.messages.some(msg =>
        msg.content.toLowerCase().includes(searchTerm)
      );
      return nameMatch || messageMatch;
    });
  }

  // Añadir nota a contacto
  addContactNote(conversationId: string, content: string): ContactNote {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) {
      throw new Error('Conversación no encontrada');
    }

    const note: ContactNote = {
      id: Date.now().toString(),
      content,
      createdAt: new Date(),
      createdBy: 'user'
    };

    conversation.contactInfo.notes.push(note);
    this.emit('note_added', { note, conversationId });

    return note;
  }

  // Obtener estado del bot
  getBotStatus(): BotStatus {
    return {
      isActive: true,
      platform: 'general',
      lastChecked: new Date(),
      responseTime: Math.floor(Math.random() * 1000) + 500
    };
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
    this.webhookService.disconnect();
  }
}