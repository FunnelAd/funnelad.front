import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import '@/i18n';
import { v4 as uuidv4 } from 'uuid';
import { FaWhatsapp, FaFacebookMessenger, FaInstagram } from 'react-icons/fa';
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import JSZip from 'jszip';
export type TemplateMessageType = 'text' | 'image' | 'audio' | 'video' | 'file';
export type ChatStyle = 'whatsapp' | 'messenger' | 'instagram';

export interface TemplateMessage {
  id: string;
  type: TemplateMessageType;
  content: string; // texto o url del archivo
  fileName?: string;
  mimeType?: string;
}

interface Template {
  id: string;
  name: string;
  messages: TemplateMessage[];
  template_type: string;
  isActive: boolean;
  chatStyle: ChatStyle;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: TemplateFormData) => void;
  template?: Template;
  isEditing?: boolean;
}

export interface TemplateFormData {
  id?: string;
  name: string;
  messages: TemplateMessage[];
  template_type: string;
  isActive: boolean;
}

const CHAT_STYLES = [
  { key: 'whatsapp', label: 'WhatsApp', icon: <FaWhatsapp className="text-[#25D366] text-2xl" /> },
  { key: 'messenger', label: 'Messenger', icon: <FaFacebookMessenger className="text-[#0084FF] text-2xl" /> },
  { key: 'instagram', label: 'Instagram', icon: <FaInstagram className="text-[#C13584] text-2xl" /> },
];

// Estilos visuales para cada chat
const CHAT_STYLE_CLASSES = {
  whatsapp: {
    bg: 'bg-[#222E35]',
    bubbleMe: 'bg-[#005C4B] text-white',
    bubbleOther: 'bg-[#202C33] text-white',
    name: 'text-[#25D366] font-semibold',
    font: 'font-whatsapp',
  },
  messenger: {
    bg: 'bg-[#F0F2F5]',
    bubbleMe: 'bg-[#0084FF] text-white',
    bubbleOther: 'bg-[#E4E6EB] text-gray-900',
    name: 'text-[#0084FF] font-semibold',
    font: 'font-messenger',
  },
  instagram: {
    bg: 'bg-white',
    bubbleMe: 'text-white',
    bubbleOther: 'bg-white text-gray-900',
    name: 'text-[#C13584] font-semibold',
    font: 'font-instagram',
  },
};

interface DraggableMessageProps {
  msg: TemplateMessage;
  onEdit: () => void;
  onDelete: () => void;
  isEditing: boolean;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  editValue: string;
  setEditValue: React.Dispatch<React.SetStateAction<string>>;
  children: React.ReactNode;
}

function DraggableMessage({ msg, onEdit, onDelete, isEditing, onSaveEdit, onCancelEdit, editValue, setEditValue, children }: DraggableMessageProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: msg.id });
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.7 : 1,
        zIndex: isDragging ? 50 : 'auto',
        justifyContent: 'flex-end',
        display: 'flex',
      }}
      className="w-full mb-2"
    >
      <div className="w-full flex flex-col items-end group">
        {/* Botones encima de la burbuja, alineados a la derecha, solo en hover */}
        <div className="flex gap-2 mb-1 justify-end w-full pr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
          <button {...attributes} {...listeners} className="cursor-grab text-gray-500 hover:text-[#C9A14A] text-2xl p-2 rounded-lg bg-white/90 shadow-md" title="Arrastrar" style={{ minWidth: 40, minHeight: 40 }}>
            ≡
          </button>
          <button onClick={onEdit} className="bg-white/90 rounded-lg p-2 text-2xl text-[#C9A14A] shadow-md hover:bg-[#F5F6FA]" title="Editar" style={{ minWidth: 40, minHeight: 40 }}>
            ✎
          </button>
          <button onClick={onDelete} className="bg-white/90 rounded-lg p-2 text-2xl text-red-500 shadow-md hover:bg-[#F5F6FA]" title="Eliminar" style={{ minWidth: 40, minHeight: 40 }}>
            ✕
          </button>
        </div>
        {/* Renderizado normal o edición */}
        {isEditing ? (
          <div className={`relative max-w-[60vw] px-4 py-2 rounded-2xl bg-white/90 text-right`}>
            <textarea
              className="w-full rounded border p-1 text-gray-900"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              rows={3}
              style={{ whiteSpace: 'pre-line' }}
            />
            <div className="flex gap-2 mt-2 justify-end">
              <button onClick={onSaveEdit} className="px-2 py-1 rounded bg-[#C9A14A] text-white text-xs">Guardar</button>
              <button onClick={onCancelEdit} className="px-2 py-1 rounded bg-gray-300 text-gray-700 text-xs">Cancelar</button>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-end">{children}</div>
        )}
      </div>
    </div>
  );
}

export default function TemplateModal({ isOpen, onClose, onSave, template, isEditing = false }: TemplateModalProps) {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<TemplateFormData>({
    name: '',
    messages: [],
    template_type: 'soporte',
    isActive: true,
  });
  const [inputValue, setInputValue] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [attachedPreview, setAttachedPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [chatStyle, setChatStyle] = useState<ChatStyle>('whatsapp');
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [imageWidths, setImageWidths] = useState<Record<string, number>>({});
  const imageRefs = useRef<Record<string, HTMLImageElement | null>>({});

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setInputValue('');
      setAttachedFile(null);
      setAttachedPreview(null);
      setShowEmojiPicker(false);
      setChatStyle('whatsapp');
      return;
    }
    if (template && isEditing) {
      setForm({
        id: template.id,
        name: template.name,
        messages: template.messages || [],
        template_type: template.template_type,
        isActive: template.isActive,
      });
      setChatStyle('whatsapp');
      setInputValue('');
      setAttachedFile(null);
      setAttachedPreview(null);
      setShowEmojiPicker(false);
    } else {
      setForm({
        name: '',
        messages: [],
        template_type: 'welcome',
        isActive: true,
      });
      setChatStyle('whatsapp');
      setInputValue('');
      setAttachedFile(null);
      setAttachedPreview(null);
      setShowEmojiPicker(false);
    }
  }, [isOpen, template, isEditing]);

  // Auto-resize del textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 6 * 24; // 6 líneas de 24px aprox
      textareaRef.current.style.height = Math.min(scrollHeight, maxHeight) + 'px';
    }
  }, [inputValue]);

  const handleChange = (field: string, value: string | boolean | TemplateMessage[] | ChatStyle) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log(form)
    onSave(form);
    onClose();
  };

  // Adjuntar archivo y previsualizar
  const handleAttachFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file)
      setAttachedFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        console.log(ev.target?.result)





        setAttachedPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Enviar mensaje
  const handleSendMessage = async () => {

 

    if (!inputValue && !attachedFile) return;
    let type: TemplateMessageType = 'text';
    let content = inputValue;
    let fileName = undefined;
    let mimeType = undefined;
    // Si hay archivo adjunto, el mensaje es el archivo y la descripción

    if (attachedFile) {
      fileName = attachedFile.name;
      mimeType = attachedFile.type;
      if (attachedFile.type.startsWith('image/')) type = 'image';
      else if (attachedFile.type.startsWith('audio/')) type = 'audio';
      else if (attachedFile.type.startsWith('video/')) type = 'video';
      else type = 'file';
      // WhatsApp: la descripción es el texto del input
      console.log(attachedPreview)

      

      content = JSON.stringify({
        url: attachedPreview || '',
        description: inputValue || '',
      });
    }
    setForm((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          id: uuidv4(),
          type,
          content,
          fileName,
          mimeType,
        },
      ],
    }));
    setInputValue('');
    setAttachedFile(null);
    setAttachedPreview(null);
    setShowEmojiPicker(false);
  };

  // Eliminar mensaje
  const handleDeleteMessage = (id: string) => {
    setForm((prev) => ({
      ...prev,
      messages: prev.messages.filter((msg) => msg.id !== id),
    }));
  };

  // Insertar emoji en el input
  const handleAddEmoji = (emoji: string) => {
    setInputValue((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Drag & drop handlers
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId !== overId) {
      const oldIndex = form.messages.findIndex(m => m.id === activeId);
      const newIndex = form.messages.findIndex(m => m.id === overId);
      setForm(prev => ({
        ...prev,
        messages: arrayMove(prev.messages, oldIndex, newIndex),
      }));
    }
  };

  // Edit handlers
  const handleEditMsg = (msg: TemplateMessage) => {
    setEditingMsgId(msg.id);
    if (msg.type === 'text') setEditValue(msg.content);
    else {
      try {
        const parsed = JSON.parse(msg.content);
        setEditValue(parsed.description || '');
      } catch {
        setEditValue('');
      }
    }
  };
  const handleSaveEditMsg = (msg: TemplateMessage) => {
    setForm(prev => ({
      ...prev,
      messages: prev.messages.map(m => {
        if (m.id !== msg.id) return m;
        if (m.type === 'text') return { ...m, content: editValue };
        // archivos: solo cambia la descripción
        try {
          const parsed = JSON.parse(m.content);
          return { ...m, content: JSON.stringify({ ...parsed, description: editValue }) };
        } catch {
          return m;
        }
      }),
    }));
    setEditingMsgId(null);
    setEditValue('');
  };
  const handleCancelEditMsg = () => {
    setEditingMsgId(null);
    setEditValue('');
  };

  // Limitar el drag & drop solo al eje vertical
  const sensors = useSensors(
    useSensor(PointerSensor, {
      lockAxis: 'y',
    })
  );

  // Handler para guardar el ancho de la imagen al cargar
  const handleImageLoad = (msgId: string, e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const el = e.currentTarget;
    setImageWidths(prev => ({ ...prev, [msgId]: el.width }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4">
      <div
        ref={modalRef}
        className="bg-white/95 backdrop-blur-sm rounded-xl w-full h-full max-w-[1100px] max-h-[90vh] min-w-[340px] min-h-[400px] overflow-hidden shadow-2xl flex items-center justify-center"
        style={{ boxSizing: 'border-box' }}
      >
        <div className="p-4 md:p-6 w-full h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 md:mb-6 flex-shrink-0">
            <h2 className="text-3xl font-bold text-[#0B2C3D] tracking-tight flex items-center gap-3">
              <span className="inline-block w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A14A] to-[#A8842C] flex items-center justify-center">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" fill="#fff" />
                  <path d="M7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7z" fill="#fff" />
                </svg>
              </span>
              {isEditing ? t('edit_template') : t('new_template')}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Layout en dos columnas (responsive) */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 h-full min-h-0 flex-1">
            {/* Columna izquierda: Configuración (más angosta) */}
            <div className="md:w-1/4 w-full max-w-xs flex-shrink-0">
              <form className="space-y-4 mb-4 md:mb-0">
                <div>
                  <label className="block text-[#0B2C3D] font-semibold mb-1">{t('template_name')}</label>
                  <input
                    className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]"
                    value={form.name}
                    onChange={e => handleChange('name', e.target.value)}
                    placeholder={t('template_name_placeholder')}
                  />
                </div>
                <div>
                  <label className="block text-[#0B2C3D] font-semibold mb-1">{t('template_type')}</label>
                  <select
                    className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]"
                    value={form.template_type}
                    onChange={e => handleChange('template_type', e.target.value)}
                  >
                    <option value="soporte">{t('Soporte')}</option>
                    <option value="ventas">{t('Ventas')}</option>
                    <option value="marketing">{t('Marketing')}</option>
                    <option value="Otro">{t('Otros')}</option>
                  </select>
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-[#0B2C3D] font-semibold">{t('status')}</label>
                  <select
                    className="rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]"
                    value={form.isActive ? 'active' : 'inactive'}
                    onChange={e => handleChange('isActive', e.target.value === 'active')}
                  >
                    <option value="active">{t('active')}</option>
                    <option value="inactive">{t('inactive')}</option>
                  </select>
                </div>
              </form>
            </div>

            {/* Columna derecha: Chat expandido */}
            <div className="flex-1 flex flex-col h-full min-h-0">
              {/* Selector de estilo de chat solo visual */}
              <div className="flex justify-center gap-4 mb-2 flex-shrink-0">
                {CHAT_STYLES.map(style => (
                  <button
                    key={style.key}
                    type="button"
                    className={`flex flex-col items-center px-2 py-1 rounded-lg border-2 font-semibold transition-colors duration-150 ${chatStyle === style.key ? 'border-[#C9A14A] bg-[#F5F6FA]' : 'border-gray-200 bg-white hover:border-[#C9A14A]'}`}
                    onClick={() => setChatStyle(style.key as ChatStyle)}
                  >
                    {style.icon}
                    <span className="text-xs mt-1">{style.label}</span>
                  </button>
                ))}
              </div>
              {/* Chat UI expandido */}
              <div
                className={`${CHAT_STYLE_CLASSES[chatStyle].bg} rounded-lg p-4 flex-1 min-h-0 max-h-full overflow-y-auto flex flex-col gap-2 mb-2 ${CHAT_STYLE_CLASSES[chatStyle].font}`}
                style={
                  chatStyle === 'whatsapp'
                    ? {
                      backgroundImage: "url('/assets/wa-bg-tile.png')",
                      backgroundRepeat: 'repeat',
                      backgroundSize: 'auto',
                    }
                    : {}
                }
              >
                {/* Mensajes de la plantilla */}
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors} modifiers={[restrictToVerticalAxis]}>
                  <SortableContext items={form.messages.map(m => m.id)} strategy={verticalListSortingStrategy}>
                    {form.messages.length === 0 && (
                      <div className="text-center text-gray-400 mt-20">{t('no_messages')}</div>
                    )}
                    {form.messages.map((msg) => (
                      <DraggableMessage
                        key={msg.id}
                        msg={msg}
                        onEdit={() => handleEditMsg(msg)}
                        onDelete={() => handleDeleteMessage(msg.id)}
                        isEditing={editingMsgId === msg.id}
                        onSaveEdit={() => handleSaveEditMsg(msg)}
                        onCancelEdit={handleCancelEditMsg}
                        editValue={editValue}
                        setEditValue={setEditValue}
                      >
                        {/* Renderizado original del mensaje */}
                        <div
                          className={`relative max-w-[60vw] px-4 py-2 rounded-2xl ${CHAT_STYLE_CLASSES[chatStyle].bubbleMe} text-right`}
                          style={chatStyle === 'instagram'
                            ? { background: 'linear-gradient(90deg, #405DE6 0%, #5851DB 50%, #833AB4 100%)', boxShadow: 'none', maxWidth: '60vw' }
                            : { maxWidth: '60vw' }}>
                          <div className={`text-xs mb-1 ${CHAT_STYLE_CLASSES[chatStyle].name}`}>Tú</div>
                          {msg.type === 'text' && (
                            <span
                              style={{
                                whiteSpace: 'pre-line',
                                wordBreak: 'break-word',
                                display: 'block',
                                maxWidth: '100%',
                              }}
                            >
                              {msg.content}
                            </span>
                          )}
                          {msg.type !== 'text' && (() => {
                            try {
                              const parsed = JSON.parse(msg.content);
                              if (msg.type === 'image') {
                                return (
                                  <div className="flex flex-col items-end w-full">
                                    <img
                                      ref={el => { imageRefs.current[msg.id] = el; }}
                                      src={parsed.url}
                                      alt={msg.fileName || 'Imagen'}
                                      className="rounded-lg max-w-full max-h-40"
                                      style={{ display: 'block', marginLeft: 'auto' }}
                                      onLoad={e => handleImageLoad(msg.id, e)}
                                    />
                                    {parsed.description ? (
                                      <div
                                        className="mt-1 text-sm text-white/90 text-left"
                                        style={{
                                          whiteSpace: 'pre-line',
                                          wordBreak: 'break-word',
                                          width: '100%',
                                          maxWidth: imageWidths[msg.id] ? imageWidths[msg.id] : '100%',
                                        }}
                                      >
                                        {parsed.description}
                                      </div>
                                    ) : null}
                                  </div>
                                );
                              }
                              if (msg.type === 'video') {
                                return (
                                  <div className="flex flex-col items-end w-full">
                                    <video controls src={parsed.url} className="w-full max-h-40 rounded-lg" style={{ display: 'block', marginLeft: 'auto' }} />
                                    {parsed.description ? (
                                      <div
                                        className="mt-1 text-sm text-white/90 text-left"
                                        style={{
                                          whiteSpace: 'pre-line',
                                          wordBreak: 'break-word',
                                          width: '100%',
                                          maxWidth: '100%',
                                        }}
                                      >
                                        {parsed.description}
                                      </div>
                                    ) : null}
                                  </div>
                                );
                              }
                              if (msg.type === 'audio') {
                                return <audio controls src={parsed.url} className="w-full" />;
                              }
                              if (msg.type === 'file') {
                                return (
                                  <a href={parsed.url} target="_blank" rel="noopener noreferrer" className="underline">
                                    {msg.fileName || 'Archivo'}
                                  </a>
                                );
                              }
                              return null;
                            } catch {
                              return null;
                            }
                          })()}
                        </div>
                      </DraggableMessage>
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
              {/* Input de mensaje tipo WhatsApp/Messenger/Instagram */}
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white shadow border border-gray-200 mt-2 flex-shrink-0">
                {/* Emoji picker */}
                <button type="button" onClick={() => setShowEmojiPicker((v) => !v)} className="text-2xl px-1 hover:bg-gray-100 rounded">
                  😊
                </button>
                {/* Aquí puedes renderizar el picker de emojis real si lo tienes */}
                {showEmojiPicker && (
                  <div className="absolute bottom-16 left-0 z-50">
                    {/* Emoji picker real aquí, por ahora solo algunos emojis de ejemplo */}
                    <div className="bg-white border rounded shadow p-2 flex flex-wrap gap-1">
                      {["😀", "😂", "😍", "👍", "🙏", "🎉", "😎", "😢", "🔥", "❤️"].map(e => (
                        <button key={e} className="text-2xl" onClick={() => handleAddEmoji(e)}>{e}</button>
                      ))}
                    </div>
                  </div>
                )}
                {/* Input de texto */}
                <textarea
                  ref={textareaRef}
                  className="flex-1 border-none outline-none bg-transparent text-gray-900 px-2 min-h-[48px] max-h-40 overflow-y-auto"
                  placeholder={t('write_message') || 'Escribe un mensaje...'}
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  rows={2}
                />
                {/* Adjuntar archivo */}
                <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xl px-1 hover:bg-gray-100 rounded" title="Adjuntar archivo">
                  📎
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                  onChange={handleAttachFile}
                />
                {/* Micrófono (solo visual, no graba audio real) */}
                <button type="button" className="text-xl px-1 hover:bg-gray-100 rounded" title="Audio">
                  🎤
                </button>
                {/* Botón enviar */}
                <button type="button" onClick={handleSendMessage} className="text-xl px-1 hover:bg-gray-100 rounded text-[#C9A14A]">
                  ➤
                </button>
              </div>
              {/* Previsualización de archivo adjunto */}
              {attachedPreview && (
                <div className="mt-2 flex items-center gap-2 bg-gray-100 p-2 rounded flex-shrink-0">
                  <span className="text-xs text-gray-700">Adjunto:</span>
                  {attachedFile?.type.startsWith('image/') && <img src={attachedPreview} alt="preview" className="h-10 rounded" />}
                  {attachedFile?.type.startsWith('audio/') && <audio controls src={attachedPreview} className="h-8" />}
                  {attachedFile?.type.startsWith('video/') && <video controls src={attachedPreview} className="h-10" />}
                  {!attachedFile?.type.startsWith('image/') && !attachedFile?.type.startsWith('audio/') && !attachedFile?.type.startsWith('video/') && (
                    <span className="text-xs">{attachedFile?.name}</span>
                  )}
                  <button onClick={() => { setAttachedFile(null); setAttachedPreview(null); }} className="ml-2 text-red-500 text-xs">✕</button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-gray-200 flex-shrink-0">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-[#C9A14A] to-[#A8842C] hover:from-[#A8842C] hover:to-[#C9A14A] text-white px-6 py-2 rounded-lg font-semibold"
            >
              {t('save_template')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tipografía personalizada (puedes agregar en tu CSS global)
// .font-whatsapp { font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif; }
// .font-messenger { font-family: 'Helvetica Neue', 'Arial', sans-serif; }
// .font-instagram { font-family: 'Segoe UI', 'Arial', sans-serif; } 