'use client';

import React, { useState, useEffect } from 'react';
import { Conversation, Message } from '@/core/services/chatService';
import ConversationList from '@/presentation/components/chat/ConversationList';
import MessageList from '@/presentation/components/chat/MessageList';
import MessageInput from '@/presentation/components/chat/MessageInput';
import { TokenService } from '@/core/api';

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected] = useState(true); // Simulamos que estamos conectados
  const currentUser = TokenService.getEmail() || 'usuario@ejemplo.com';

  // Simulación de conversaciones
  useEffect(() => {
    const demoConversations: Conversation[] = [
      {
        id: '1',
        participants: ['asistente@funnelad.com', currentUser],
        messages: [],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        lastMessage: {
          id: '7',
          content: 'Perfecto, he agendado una demostración para el próximo martes a las 10:00 AM. Te enviaré un correo con los detalles de la reunión. ¿Hay algo más en lo que pueda ayudarte?',
          sender: 'asistente@funnelad.com',
          timestamp: new Date(Date.now() - 3000000),
          isRead: false,
        }
      },
      {
        id: '2',
        participants: ['soporte@funnelad.com', currentUser],
        messages: [],
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        lastMessage: {
          id: '1',
          content: 'Tu ticket ha sido resuelto. Por favor, confirma si todo funciona correctamente.',
          sender: 'soporte@funnelad.com',
          timestamp: new Date(Date.now() - 43200000),
          isRead: true,
        }
      },
      {
        id: '3',
        participants: ['ventas@funnelad.com', currentUser],
        messages: [],
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        lastMessage: {
          id: '1',
          content: 'Gracias por tu interés en nuestros servicios. ¿Cuándo podríamos agendar una llamada?',
          sender: 'ventas@funnelad.com',
          timestamp: new Date(Date.now() - 86400000),
          isRead: true,
        }
      }
    ];

    // Simular carga de datos
    setTimeout(() => {
      setConversations(demoConversations);
      setSelectedConversation(demoConversations[0]);
      setLoading(false);
    }, 1000);
  }, [currentUser]);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = (content: string) => {
    if (!selectedConversation) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: currentUser,
      timestamp: new Date(),
      isRead: false,
    };

    // Actualizar la conversación seleccionada
    setSelectedConversation(prev => {
      if (!prev) return null;
      return {
        ...prev,
        messages: [...(prev.messages || []), newMessage],
        lastMessage: newMessage
      };
    });

    // Actualizar la lista de conversaciones
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, lastMessage: newMessage } 
          : conv
      )
    );

    // Simular respuesta automática después de un breve retraso
    setTimeout(() => {
      const autoResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: '¡Gracias por tu mensaje! Te responderemos lo antes posible.',
        sender: selectedConversation.participants.find(p => p !== currentUser) || '',
        timestamp: new Date(),
        isRead: false,
      };

      setSelectedConversation(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...(prev.messages || []), autoResponse],
          lastMessage: autoResponse
        };
      });

      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversation.id 
            ? { ...conv, lastMessage: autoResponse } 
            : conv
        )
      );
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0B2C3D]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C9A14A]"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0B2C3D]">
      <div className="flex flex-col flex-1">
        <header className="bg-[#0B2C3D] shadow-sm p-4 border-b border-[#1D3E4E] flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Chat</h1>
          <div className={`h-3 w-3 rounded-full ${connected ? 'bg-[#C9A14A]' : 'bg-red-500'}`} title={connected ? 'Conectado' : 'Desconectado'}></div>
        </header>
        
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-100 px-4 py-3 rounded relative m-4">
            <span className="block sm:inline">{error}</span>
            <button 
              className="absolute top-0 bottom-0 right-0 px-4 py-3 text-red-100"
              onClick={() => setError(null)}
            >
              <span className="text-xl">&times;</span>
            </button>
          </div>
        )}
        
        <div className="flex flex-1 overflow-hidden">
          <ConversationList 
            conversations={conversations} 
            onSelectConversation={handleSelectConversation}
            selectedConversationId={selectedConversation?.id}
          />
          
          {selectedConversation ? (
            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b border-[#1D3E4E] bg-[#0B2C3D]">
                <h2 className="text-xl font-semibold text-white">
                  {selectedConversation.participants.filter(p => p !== currentUser).join(', ')}
                </h2>
              </div>
              
              <MessageList 
                messages={selectedConversation.messages || []} 
                currentUser={currentUser}
              />
              
              <MessageInput onSendMessage={handleSendMessage} />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-[#0B2C3D]">
              <p className="text-gray-400">Selecciona una conversación para comenzar a chatear</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}