import React, { useRef, useEffect, useState } from 'react';
import { Message } from '@/core/services/chatService';

interface MessageListProps {
  messages: Message[];
  currentUser: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages: propMessages, currentUser }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // Simulación de mensajes para demostración
  useEffect(() => {
    // Si hay mensajes proporcionados, usarlos
    if (propMessages && propMessages.length > 0) {
      setMessages(propMessages);
      return;
    }

    // De lo contrario, usar mensajes de demostración
    const demoMessages: Message[] = [
    
    ];

    // Simular carga de mensajes con un pequeño retraso
    const timer = setTimeout(() => {
      setMessages(demoMessages);
    }, 800);

    return () => clearTimeout(timer);
  }, [propMessages, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-[#0B2C3D] text-white">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C9A14A] mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando mensajes...</p>
          </div>
        </div>
      ) : (
        messages.map((message, index) => (
          <div
            key={message.id || index}
            className={`mb-4 flex ${
              message.sender === currentUser ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
                message.sender === currentUser
                  ? 'bg-[#C9A14A] text-white rounded-br-none'
                  : 'bg-[#1D3E4E] text-white rounded-bl-none'
              }`}
            >
              <p>{message.content}</p>
              <div
                className={`text-xs mt-1 ${
                  message.sender === currentUser ? 'text-gray-200' : 'text-gray-400'
                }`}
              >
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                {message.isRead && message.sender === currentUser && (
                  <span className="ml-2">✓</span>
                )}
              </div>
            </div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;