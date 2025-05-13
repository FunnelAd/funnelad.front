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
      {
        id: '1',
        content: '¡Hola! ¿Cómo puedo ayudarte hoy?',
        sender: 'asistente@funnelad.com',
        timestamp: new Date(Date.now() - 3600000),
        isRead: true,
      },
      {
        id: '2',
        content: 'Necesito información sobre los planes de suscripción',
        sender: currentUser,
        timestamp: new Date(Date.now() - 3500000),
        isRead: true,
      },
      {
        id: '3',
        content: 'Claro, tenemos varios planes disponibles. ¿Estás interesado en el plan básico, profesional o empresarial?',
        sender: 'asistente@funnelad.com',
        timestamp: new Date(Date.now() - 3400000),
        isRead: true,
      },
      {
        id: '4',
        content: 'Me interesa el plan empresarial. ¿Qué características incluye?',
        sender: currentUser,
        timestamp: new Date(Date.now() - 3300000),
        isRead: true,
      },
      {
        id: '5',
        content: 'El plan empresarial incluye todas las características premium, soporte 24/7, integraciones ilimitadas y hasta 50 usuarios. ¿Te gustaría una demostración personalizada?',
        sender: 'asistente@funnelad.com',
        timestamp: new Date(Date.now() - 3200000),
        isRead: true,
      },
      {
        id: '6',
        content: 'Sí, me encantaría programar una demostración para la próxima semana.',
        sender: currentUser,
        timestamp: new Date(Date.now() - 3100000),
        isRead: true,
      },
      {
        id: '7',
        content: 'Perfecto, he agendado una demostración para el próximo martes a las 10:00 AM. Te enviaré un correo con los detalles de la reunión. ¿Hay algo más en lo que pueda ayudarte?',
        sender: 'asistente@funnelad.com',
        timestamp: new Date(Date.now() - 3000000),
        isRead: false,
      }
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