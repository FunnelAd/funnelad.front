import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import '@/i18n';
import { PaperAirplaneIcon, PaperClipIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { ChatMessage, ChatAttachment } from '@/core/types/chat';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (content: string, attachments?: File[]) => Promise<void>;
  isLoading?: boolean;
}

export default function ChatInterface({ messages, onSendMessage, isLoading = false }: ChatInterfaceProps) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState<{ file: File; preview: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 120) + 'px';
    }
  }, [inputValue]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' && attachments.length === 0) return;
    
    try {
      await onSendMessage(inputValue, attachments);
      setInputValue('');
      setAttachments([]);
      setAttachmentPreviews([]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments = [...attachments];
    const newPreviews = [...attachmentPreviews];

    Array.from(files).forEach(file => {
      newAttachments.push(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newPreviews.push({ file, preview: e.target.result as string });
            setAttachmentPreviews([...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      } else {
        // For non-image files, just add a placeholder
        newPreviews.push({ file, preview: '' });
      }
    });

    setAttachments(newAttachments);
    setAttachmentPreviews(newPreviews);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    const newAttachments = [...attachments];
    const newPreviews = [...attachmentPreviews];
    newAttachments.splice(index, 1);
    newPreviews.splice(index, 1);
    setAttachments(newAttachments);
    setAttachmentPreviews(newPreviews);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return t('today');
    } else if (date.toDateString() === yesterday.toDateString()) {
      return t('yesterday');
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderAttachment = (attachment: ChatAttachment) => {
    if (attachment.type === 'image') {
      return (
        <div className="mt-2 rounded-lg overflow-hidden">
          <img 
            src={attachment.url} 
            alt={attachment.fileName || 'Image'} 
            className="max-w-xs max-h-60 object-contain"
          />
        </div>
      );
    } else if (attachment.type === 'audio') {
      return (
        <div className="mt-2">
          <audio controls src={attachment.url} className="max-w-xs" />
        </div>
      );
    } else if (attachment.type === 'video') {
      return (
        <div className="mt-2 rounded-lg overflow-hidden">
          <video controls src={attachment.url} className="max-w-xs max-h-60" />
        </div>
      );
    } else {
      return (
        <div className="mt-2 flex items-center p-2 bg-gray-100 rounded-lg">
          <svg className="w-6 h-6 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            {attachment.fileName || 'File'}
          </a>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>{t('no_messages')}</p>
            <p className="text-sm">{t('start_conversation')}</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isFirstMessageOfDay = index === 0 || 
              new Date(message.timestamp).toDateString() !== new Date(messages[index - 1].timestamp).toDateString();
            
            return (
              <div key={message.id}>
                {isFirstMessageOfDay && (
                  <div className="flex justify-center my-4">
                    <div className="bg-gray-200 rounded-full px-3 py-1 text-xs text-gray-600">
                      {formatDate(message.timestamp)}
                    </div>
                  </div>
                )}
                <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${
                      message.sender === 'user' 
                        ? 'bg-gradient-to-r from-[#C9A14A] to-[#A8842C] text-white' 
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    {message.attachments && message.attachments.map((attachment, i) => (
                      <div key={i}>
                        {renderAttachment(attachment)}
                      </div>
                    ))}
                    <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-gray-200' : 'text-gray-500'} text-right`}>
                      {formatTime(message.timestamp)}
                      {message.sender === 'user' && (
                        <span className="ml-1">
                          {message.status === 'sending' && '⌛'}
                          {message.status === 'sent' && '✓'}
                          {message.status === 'received' && '✓✓'}
                          {message.status === 'read' && '✓✓'}
                          {message.status === 'error' && '⚠️'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachment previews */}
      {attachmentPreviews.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-200 flex flex-wrap gap-2">
          {attachmentPreviews.map((item, index) => (
            <div key={index} className="relative">
              {item.file.type.startsWith('image/') ? (
                <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100">
                  <img src={item.preview} alt={item.file.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                  <div className="text-xs text-center p-1 text-gray-600">
                    {item.file.name.split('.').pop()?.toUpperCase()}
                  </div>
                </div>
              )}
              <button 
                onClick={() => removeAttachment(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-end space-x-2">
          <button 
            onClick={handleAttachFile}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
          >
            <PaperClipIcon className="w-6 h-6" />
          </button>
          <div className="flex-1 border border-gray-300 rounded-lg overflow-hidden">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('message_placeholder')}
              className="w-full p-3 focus:outline-none resize-none"
              rows={1}
            />
          </div>
          <button 
            onClick={handleSendMessage}
            disabled={isLoading || (inputValue.trim() === '' && attachments.length === 0)}
            className={`p-3 rounded-full ${
              isLoading || (inputValue.trim() === '' && attachments.length === 0)
                ? 'bg-gray-300 text-gray-500'
                : 'bg-gradient-to-r from-[#C9A14A] to-[#A8842C] text-white'
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <PaperAirplaneIcon className="w-5 h-5" />
            )}
          </button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
        />
      </div>
    </div>
  );
}