import { Message } from './chatService';

export interface SocketMessage {
  type: 'message' | 'typing' | 'read';
  // payload: "";
}

export class SocketService {
  private socket: WebSocket | null = null;
  private messageListeners: ((message: Message) => void)[] = [];
  private connectionListeners: ((connected: boolean) => void)[] = [];

  connect(userId: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const wsUrl = apiUrl.replace(/^http/, 'ws');
    
    this.socket = new WebSocket(`${wsUrl}/ws?userId=${userId}`);
    
    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.notifyConnectionListeners(true);
    };
    
    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      this.notifyConnectionListeners(false);
      
      // Intentar reconectar después de 5 segundos
      setTimeout(() => this.connect(userId), 5000);
    };
    
    this.socket.onmessage = (event) => {
      try {
        const data: SocketMessage = JSON.parse(event.data);
        
        if (data.type === 'message') {
          // this.notifyMessageListeners(data.payload);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
  
  sendMessage(message: SocketMessage) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }
  
  onMessage(listener: (message: Message) => void) {
    this.messageListeners.push(listener);
    return () => {
      this.messageListeners = this.messageListeners.filter(l => l !== listener);
    };
  }
  
  onConnectionChange(listener: (connected: boolean) => void) {
    this.connectionListeners.push(listener);
    return () => {
      this.connectionListeners = this.connectionListeners.filter(l => l !== listener);
    };
  }
  
  private notifyMessageListeners(message: Message) {
    this.messageListeners.forEach(listener => listener(message));
  }
  
  private notifyConnectionListeners(connected: boolean) {
    this.connectionListeners.forEach(listener => listener(connected));
  }
}

export const socketService = new SocketService();