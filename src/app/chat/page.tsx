'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message, ContactNote, BotStatus } from '../../core/types/chat';
import { ChatService } from '../../core/services/chatService';

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [botStatus, setBotStatus] = useState<BotStatus>({ 
    isActive: true, 
    platform: 'general', 
    lastChecked: new Date(),
    responseTime: 500 
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatService = useRef<ChatService>();

  // Inicializar servicio de chat
  useEffect(() => {
    chatService.current = ChatService.getInstance();
    const service = chatService.current;

    // Configurar event listeners
    service.on('conversations_loaded', ({ conversations: loadedConversations }: { conversations: Conversation[] }) => {
      setConversations(loadedConversations);
      setSelectedConversation(loadedConversations[0] || null);
      setLoading(false);
    });

    service.on('new_message_received', ({ message, conversation }: { message: Message, conversation: Conversation }) => {
      setConversations(prev => prev.map(conv => 
        conv.id === conversation.id ? conversation : conv
      ));
      
      if (selectedConversation?.id === conversation.id) {
        setSelectedConversation(conversation);
      }
      
      // Mostrar indicador de escritura si es un mensaje del usuario
      if (message.sender !== 'user' && message.sender !== 'bot') {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    });

    service.on('message_sent', ({ message, conversationId }: { message: Message, conversationId: string }) => {
      setConversations(prev => prev.map(conv => {
        if (conv.id === conversationId) {
          return { ...conv, messages: [...conv.messages, message], lastMessage: message };
        }
        return conv;
      }));
    });

    service.on('bot_status_changed', (status: BotStatus) => {
      setBotStatus(status);
    });

    // Inicializar
    service.initialize('current-user');

    return () => {
      service.disconnect();
    };
  }, []);

  // Auto scroll a mensajes nuevos
  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  // Actualizar tiempo actual
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Marcar conversación como leída al seleccionarla
  useEffect(() => {
    if (selectedConversation && chatService.current) {
      chatService.current.markAsRead(selectedConversation.id);
    }
  }, [selectedConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setSidebarOpen(false);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation || !chatService.current) return;

    try {
      await chatService.current.sendMessage(selectedConversation.id, messageInput.trim());
      setMessageInput('');
    } catch (error) {
      console.error('Error enviando mensaje:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (chatService.current) {
      const filtered = query.trim() 
        ? chatService.current.searchConversations(query)
        : chatService.current.getConversations();
      setConversations(filtered);
    }
  };

  const addNote = () => {
    if (!selectedConversation || !chatService.current) return;
    
    const noteText = prompt('Añadir nueva nota:');
    if (noteText && noteText.trim()) {
      try {
        chatService.current.addContactNote(selectedConversation.id, noteText.trim());
        // Actualizar la conversación seleccionada
        const updatedConv = chatService.current.getConversation(selectedConversation.id);
        if (updatedConv) {
          setSelectedConversation(updatedConv);
        }
      } catch (error) {
        console.error('Error añadiendo nota:', error);
      }
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 0) {
      return `${days} día${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} hora${hours > 1 ? 's' : ''}`;
    } else {
      return 'Ahora';
    }
  };

  const getPlatformBadgeColor = (platform: string) => {
    switch (platform) {
      case 'whatsapp': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'instagram': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      case 'telegram': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'email': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'whatsapp': return 'WhatsApp';
      case 'instagram': return 'Instagram';
      case 'telegram': return 'Telegram';
      case 'email': return 'Email';
      case 'webchat': return 'WebChat';
      default: return 'WebChat';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#00212f] to-[#0a2d3f]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#edc746]"></div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-[#00212f] to-[#0a2d3f] text-white font-['Montserrat',sans-serif]">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[rgba(20,103,137,0.1)] backdrop-blur-[10px] border-b border-[rgba(237,203,114,0.2)] px-6 py-5 h-20">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-4">
            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-[#edc746] text-2xl"
            >
              ☰
            </button>
            
            <div className="flex items-center gap-4">
              <div className="w-[45px] h-[45px] bg-gradient-to-br from-[#af8d46] to-[#edc746] rounded-xl flex items-center justify-center relative animate-pulse">
                <span className="text-2xl font-bold text-[#00212f]">F</span>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-[#edcb72] to-[#edc746] rounded-full animate-ping"></div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#edc746] to-[#edcb72] bg-clip-text text-transparent">
                FunnelAd
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className={`flex items-center gap-3 px-4 py-2 rounded-full border text-sm font-semibold ${
              botStatus.isActive 
                ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
            }`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                botStatus.isActive ? 'bg-green-400' : 'bg-orange-400'
              }`}></div>
              {botStatus.isActive ? 'El bot está activo' : 'Reconectando...'}
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-[#af8d46] to-[#edc746] rounded-full flex items-center justify-center font-bold text-[#00212f] cursor-pointer">
              MM
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-screen pt-20">
        {/* Sidebar */}
        <div className={`w-[350px] bg-[rgba(20,103,137,0.1)] border-r border-[rgba(237,203,114,0.2)] flex flex-col ${
          sidebarOpen ? 'fixed inset-y-0 left-0 z-40 pt-20' : 'hidden md:flex'
        }`}>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-[rgba(237,203,114,0.1)]">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-[#edcb72] bg-clip-text text-transparent mb-2">
              Conversaciones
            </h2>
            <p className="text-sm text-white/60">Gestiona todas tus conversaciones activas</p>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-[rgba(237,203,114,0.1)]">
            <input
              type="text"
              placeholder="Buscar conversaciones..."
              className="w-full px-4 py-3 bg-[rgba(0,33,47,0.5)] border border-[rgba(237,203,114,0.2)] rounded-xl text-white text-sm outline-none focus:border-[#edc746] focus:ring-2 focus:ring-[rgba(237,199,70,0.1)] placeholder-white/40"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation)}
                className={`p-4 border-b border-[rgba(237,203,114,0.05)] cursor-pointer transition-all duration-300 hover:bg-[rgba(237,203,114,0.05)] ${
                  selectedConversation?.id === conversation.id 
                    ? 'bg-[rgba(237,203,114,0.1)] border-l-4 border-l-[#edc746]' 
                    : ''
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-white text-sm">
                    {conversation.contactInfo.name}
                  </span>
                  <span className="text-xs text-white/50">
                    {formatRelativeTime(conversation.lastMessage?.timestamp || new Date(conversation.createdAt))}
                  </span>
                </div>
                
                <p className="text-sm text-white/60 truncate mb-2">
                  {conversation.lastMessage?.content || 'Sin mensajes'}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded-lg text-xs font-semibold uppercase border ${getPlatformBadgeColor(conversation.platform)}`}>
                    {getPlatformName(conversation.platform)}
                  </span>
                  {conversation.unreadCount > 0 && (
                    <span className="bg-[#edc746] text-[#00212f] text-xs font-bold px-2 py-1 rounded-full min-w-[18px] text-center">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-5 border-b border-[rgba(237,203,114,0.2)] bg-[rgba(20,103,137,0.05)]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#af8d46] to-[#edc746] rounded-full flex items-center justify-center font-bold text-[#00212f] text-lg">
                    {selectedConversation.contactInfo.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{selectedConversation.contactInfo.name}</h3>
                    <p className="text-sm text-white/60">
                      @{selectedConversation.contactInfo.name.toLowerCase().replace(' ', '.')} • 
                      {selectedConversation.contactInfo.isOnline ? ' En línea' : ' Desconectado'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
                {selectedConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`max-w-[70%] p-3 rounded-2xl text-sm leading-relaxed relative animate-[messageSlide_0.3s_ease-out] ${
                      message.sender === 'user' || message.sender === 'bot'
                        ? 'ml-auto bg-gradient-to-br from-[#af8d46] to-[#edc746] text-[#00212f]'
                        : 'mr-auto bg-[rgba(20,103,137,0.3)] border border-[rgba(237,203,114,0.2)] text-white'
                    }`}
                  >
                    <div>{message.content}</div>
                    <div className={`text-xs mt-1 opacity-70 ${
                      message.sender === 'user' || message.sender === 'bot' 
                        ? 'text-[rgba(0,33,47,0.6)]' 
                        : 'text-white/50'
                    }`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 p-3 bg-[rgba(20,103,137,0.3)] border border-[rgba(237,203,114,0.2)] rounded-2xl max-w-fit">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                    <span className="text-white/60 text-xs">Escribiendo...</span>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-5 bg-[rgba(20,103,137,0.05)] border-t border-[rgba(237,203,114,0.2)]">
                <div className="flex items-center gap-3 bg-[rgba(0,33,47,0.5)] border border-[rgba(237,203,114,0.2)] rounded-3xl p-2">
                  <input
                    type="text"
                    placeholder="Escribir mensaje..."
                    className="flex-1 px-4 py-3 bg-transparent text-white text-sm outline-none placeholder-white/40"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <div className="flex items-center gap-2">
                    <button className="w-9 h-9 rounded-full bg-[rgba(237,203,114,0.1)] text-[#edc746] flex items-center justify-center hover:bg-[rgba(237,203,114,0.2)] hover:scale-110 transition-all">
                      📎
                    </button>
                    <button className="w-9 h-9 rounded-full bg-[rgba(237,203,114,0.1)] text-[#edc746] flex items-center justify-center hover:bg-[rgba(237,203,114,0.2)] hover:scale-110 transition-all">
                      😊
                    </button>
                    <button className="w-9 h-9 rounded-full bg-[rgba(237,203,114,0.1)] text-[#edc746] flex items-center justify-center hover:bg-[rgba(237,203,114,0.2)] hover:scale-110 transition-all">
                      🎤
                    </button>
                    <button
                      onClick={handleSendMessage}
                      className="w-9 h-9 rounded-full bg-gradient-to-br from-[#af8d46] to-[#edc746] text-[#00212f] flex items-center justify-center hover:scale-110 hover:shadow-lg hover:shadow-[rgba(237,199,70,0.3)] transition-all"
                    >
                      ➤
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-white/40">Selecciona una conversación para comenzar a chatear</p>
            </div>
          )}
        </div>

        {/* Right Sidebar - Contact Info */}
        {selectedConversation && (
          <div className="w-[280px] bg-[rgba(20,103,137,0.1)] border-l border-[rgba(237,203,114,0.2)] p-6 overflow-y-auto hidden xl:block">
            {/* Contact Profile */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-[#af8d46] to-[#edc746] rounded-full flex items-center justify-center font-bold text-[#00212f] text-3xl mx-auto mb-4 relative">
                {selectedConversation.contactInfo.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                {selectedConversation.contactInfo.isOnline && (
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-400 border-3 border-[#00212f] rounded-full"></div>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">{selectedConversation.contactInfo.name}</h3>
              <p className="text-sm text-white/60 mb-1">
                @{selectedConversation.contactInfo.name.toLowerCase().replace(' ', '.')}
              </p>
              <p className="text-sm text-white/60 mb-1">{selectedConversation.contactInfo.email}</p>
              <p className="text-sm text-white/60">{selectedConversation.contactInfo.phone}</p>
            </div>

            {/* Contact Info */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-[#edc746] mb-3">Información del Contacto</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-[rgba(237,203,114,0.1)] text-sm">
                  <span className="text-white/60">Hora Local</span>
                  <span className="text-white font-medium">{formatTime(currentTime)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[rgba(237,203,114,0.1)] text-sm">
                  <span className="text-white/60">Contacto</span>
                  <span className="text-white font-medium">
                    {new Intl.DateTimeFormat('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }).format(new Date(selectedConversation.createdAt))}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[rgba(237,203,114,0.1)] text-sm">
                  <span className="text-white/60">Plataforma</span>
                  <span className="text-white font-medium">{getPlatformName(selectedConversation.platform)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[rgba(237,203,114,0.1)] text-sm">
                  <span className="text-white/60">Estado</span>
                  <span className="text-white font-medium">
                    {selectedConversation.contactInfo.isOnline ? 'En línea' : 'Desconectado'}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="bg-[rgba(0,33,47,0.3)] border border-[rgba(237,203,114,0.2)] rounded-xl p-4">
              <h4 className="text-lg font-semibold text-[#edc746] mb-3">
                Notas ({selectedConversation.contactInfo.notes.length})
              </h4>
              
              {selectedConversation.contactInfo.notes.length === 0 ? (
                <p className="text-white/50 text-sm mb-4">
                  Añade notas sobre este contacto para recordar detalles importantes.
                </p>
              ) : (
                <div className="space-y-2 mb-4">
                  {selectedConversation.contactInfo.notes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-[rgba(237,203,114,0.1)] border border-[rgba(237,203,114,0.2)] rounded-lg p-3 text-sm text-white relative"
                    >
                      {note.content}
                      <div className="text-xs text-white/50 mt-2">
                        {new Intl.DateTimeFormat('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        }).format(note.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <button
                onClick={addNote}
                className="w-full py-2.5 bg-gradient-to-br from-[#af8d46] to-[#edc746] border-none rounded-lg text-[#00212f] font-semibold text-sm cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[rgba(237,199,70,0.3)] transition-all"
              >
                + Añadir Nuevo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}