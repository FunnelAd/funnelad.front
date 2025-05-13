import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, PaperClipIcon } from '@heroicons/react/24/outline';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 120) + 'px';
    }
  }, [message]);

  const handleSubmit = () => {
    if (message.trim() === '') return;
    onSendMessage(message);
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-[#1D3E4E] p-4 bg-[#0B2C3D]">
      <div className="flex items-end space-x-2">
        <button 
          className="p-2 rounded-full text-gray-300 hover:bg-[#1D3E4E]"
        >
          <PaperClipIcon className="w-6 h-6" />
        </button>
        <div className="flex-1 border border-[#1D3E4E] rounded-lg overflow-hidden shadow-md">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje..."
            className="w-full p-3 focus:outline-none resize-none bg-[#0F3A4F] text-white placeholder-gray-400"
            rows={1}
          />
        </div>
        <button 
          onClick={handleSubmit}
          disabled={message.trim() === ''}
          className={`p-3 rounded-full ${
            message.trim() === ''
              ? 'bg-gray-700 text-gray-500'
              : 'bg-[#C9A14A] text-white hover:bg-[#A8842C] shadow-md'
          }`}
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;