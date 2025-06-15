'use client';

import React, { useState, useEffect } from 'react';
import { chatService, Conversation, Message } from '@/core/services/chatService';
import ConversationList from '@/presentation/components/chat/ConversationList';
import MessageList from '@/presentation/components/chat/MessageList';
import MessageInput from '@/presentation/components/chat/MessageInput';
import { TokenService } from '@/core/api';
import { n8nService } from '@/core/services/n8nService';

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected] = useState(true); // Simulamos que estamos conectados
  const currentUser = TokenService.getEmail() || 'usuario@ejemplo.com';

  // Simulación de conversaciones
  useEffect(() => {

    loadData();
  }, [currentUser]);

  const loadData = async () => {
    try {
      const data = await chatService.getConversations('F4$TEST1001');
      console.log('Conversations loaded:', data);
      if (data.length > 0) {
        setConversations(data);
        setSelectedConversation(data[0]);
      }
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Error al cargar las conversaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation) return;

    const newMessage: Message = {
      sessionid: selectedConversation.sessionid || '',
      content: content,
      type: 'text', // Asumimos que es un mensaje de texto
      sender: currentUser,
      businessid: selectedConversation.businessid || '',
      timestamp: new Date(),
      isRead: false,
    };

    console.log('Sending message:', newMessage);
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
    // Respuesta Agente

  //  try {
  //     await chatService.addNewConversation( content);
  //   } catch (err) {
  //     console.error('Error sending message:', err);
  //     setError('Error al enviar el mensaje');
  //     return;
  //   }

    try {
      await chatService.addMessage(newMessage);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Error al enviar el mensaje');
      return;
    }

    const response = await n8nService.sendMessageAgentAI(newMessage)
    console.log(response)

    const autoResponse: Message = {
      sessionid: selectedConversation.sessionid || '',
      content: response.content,
      sender: response.sender || 'Agente AI',
      timestamp: response.timestamp || new Date(),
      isRead: false,
      businessid: selectedConversation.businessid || '',
      type: 'text', // Asumimos que es un mensaje de texto
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
  };
  




  const handleAddNewMessage = async () => {

    // const payload: Conversation = {
    //   messages: [],
    //   // participants: [currentUser],
    //   createdAt: new Date().toISOString(),

    // };

    // try {
    //   await chatService.addNewConversation(payload);
    // } catch (err) {
    //   console.error('Error sending message:', err);
    //   setError('Error al enviar el mensaje');
    //   return;
    // }

    

    
    // const newMessageAgent: N8N = {
    //   id: "11111",
    //   name: "Carlos",
    //   messages: content,

    // }

    // const response = await n8nService.sendMessageAgentAI(newMessageAgent)
    // console.log(response)

    // const autoResponse: Message = {
    //   id: (Date.now() + 1).toString(),
    //   content: response.output,
    //   sender: selectedConversation.participants.find(p => p !== currentUser) || '',
    //   timestamp: new Date(),
    //   isRead: false,
    // };

    // setSelectedConversation(prev => {
    //   if (!prev) return null;
    //   return {
    //     ...prev,
    //     messages: [...(prev.messages || []), autoResponse],
    //     lastMessage: autoResponse
    //   };
    // });

    // setConversations(prev =>
    //   prev.map(conv =>
    //     conv.id === selectedConversation.id
    //       ? { ...conv, lastMessage: autoResponse }
    //       : conv
    //   )
    // );
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
            onAddNewConversation={handleAddNewMessage}

          />

          {selectedConversation ? (
            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b border-[#1D3E4E] bg-[#0B2C3D]">
                <h2 className="text-xl font-semibold text-white">
                  {selectedConversation.nameUser}
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