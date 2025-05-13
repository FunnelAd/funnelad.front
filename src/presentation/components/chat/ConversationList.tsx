import React, { useState, useEffect } from 'react';
import { Conversation } from '@/core/services/chatService';

interface ConversationListProps {
  conversations: Conversation[];
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversationId?: string;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  onSelectConversation,
  selectedConversationId
}) => {
  return (
    <div className="w-1/4 border-r border-[#1D3E4E] h-full overflow-y-auto bg-[#0B2C3D]">
      <div className="p-4 border-b border-[#1D3E4E]">
        <h2 className="text-xl font-semibold text-white">Conversaciones</h2>
      </div>
      <div>
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`p-4 border-b border-[#1D3E4E] cursor-pointer hover:bg-[#1D3E4E] ${
              selectedConversationId === conversation.id ? 'bg-[#1D3E4E] border-l-4 border-l-[#C9A14A]' : ''
            }`}
            onClick={() => onSelectConversation(conversation)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-white">
                  {conversation.participants.join(', ')}
                </h3>
                {conversation.lastMessage && (
                  <p className="text-sm text-gray-400 truncate">
                    {conversation.lastMessage.content}
                  </p>
                )}
              </div>
              {conversation.lastMessage && (
                <div className="text-xs text-gray-400">
                  {new Date(conversation.lastMessage.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;