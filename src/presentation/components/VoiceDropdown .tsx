import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Volume2, Play } from 'lucide-react';
import { IVoice } from '@/core/types/voices';

interface VoiceDropdownProps {
  voices: IVoice[];
  selectedVoice?: IVoice | null;
  onSelect: (voice: IVoice) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const VoiceDropdown: React.FC<VoiceDropdownProps> = ({
  voices,
  selectedVoice,
  onSelect,
  placeholder = "Selecciona una voz",
  className = "",
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Calcular posición del dropdown
  const calculatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 320; // Altura máxima estimada del dropdown
      
      let top = rect.bottom + window.scrollY + 8;
      
      // Si no hay espacio suficiente abajo, mostrar arriba
      if (rect.bottom + dropdownHeight > viewportHeight) {
        top = rect.top + window.scrollY - dropdownHeight - 8;
      }
      
      setDropdownPosition({
        top: Math.max(10, top), // Mínimo 10px del top
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  // Cerrar dropdown al hacer click fuera y manejar eventos
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleScroll = (event: Event) => {
      if (isOpen) {
        // Solo actualizar posición, no prevenir el scroll
        calculatePosition();
      }
    };

    const handleResize = () => {
      if (isOpen) {
        calculatePosition();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleResize);
      calculatePosition();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  // Filtrar voces por búsqueda
  const filteredVoices = voices.filter(voice =>
    voice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voice.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voice.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Obtener color del pill según el proveedor
  const getProviderColor = (provider: string) => {
    const colors: Record<string, string> = {
      'openai': 'bg-green-500/20 text-green-400 border-green-500/30',
      'elevenlabs': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'azure': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'google': 'bg-red-500/20 text-red-400 border-red-500/30',
      'aws': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    };
    return colors[provider.toLowerCase()] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  // Obtener color del pill según el género
  const getGenderColor = (gender: string) => {
    const colors: Record<string, string> = {
      'male': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'female': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'unknown': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return colors[gender.toLowerCase()] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  // Obtener icono según el género
  const getGenderIcon = (gender: string) => {
    switch (gender.toLowerCase()) {
      case 'male': return '♂';
      case 'female': return '♀';
      default: return '◦';
    }
  };

  const handleVoiceSelect = (voice: IVoice) => {
    onSelect(voice);
    setIsOpen(false);
    setSearchTerm('');
  };

  const playVoiceSample = (e: React.MouseEvent, sampleUrl?: string) => {
    e.stopPropagation();
    if (sampleUrl) {
      const audio = new Audio(sampleUrl);
      audio.play().catch(console.error);
    }
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        calculatePosition();
      }
    }
  };

  // Componente del dropdown que se renderiza en un portal
  const DropdownContent = () => (
    <div 
      ref={dropdownRef}
      className="fixed bg-gray-800 border border-gray-600 rounded-lg shadow-2xl z-[9999] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        width: `${dropdownPosition.width}px`,
        maxHeight: '320px',
      }}
    >
      {/* Search Input */}
      <div className="p-3 border-b border-gray-600 bg-gray-800 sticky top-0 z-10">
        <input
          type="text"
          placeholder="Buscar voces..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-md border border-gray-500 focus:outline-none focus:border-yellow-400 text-sm"
          autoFocus
        />
      </div>

      {/* Voice List */}
      <div className="overflow-y-auto voice-dropdown-scroll" style={{ maxHeight: '240px' }}>
        {filteredVoices.length > 0 ? (
          filteredVoices.map((voice) => (
            <div
              key={voice.id}
              onClick={() => handleVoiceSelect(voice)}
              className={`
                px-4 py-3 cursor-pointer hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0
                ${selectedVoice?.id === voice.id ? 'bg-gray-700 border-l-4 border-l-yellow-400' : ''}
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Volume2 size={16} className="text-gray-400" />
                    <span className="font-medium text-white">{voice.name}</span>
                    {voice.sample_url && (
                      <button
                        onClick={(e) => playVoiceSample(e, voice.sample_url)}
                        className="p-1 rounded-full hover:bg-gray-600 text-gray-400 hover:text-white transition-colors"
                        title="Reproducir muestra"
                      >
                        <Play size={14} />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`
                      px-2 py-0.5 text-xs rounded-full border font-medium
                      ${getProviderColor(voice.provider)}
                    `}>
                      {voice.provider.toUpperCase()}
                    </span>
                    <span className={`
                      px-2 py-0.5 text-xs rounded-full border flex items-center space-x-1
                      ${getGenderColor(voice.gender)}
                    `}>
                      <span>{getGenderIcon(voice.gender)}</span>
                      <span className="capitalize">{voice.gender}</span>
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-400">
                    {voice.language}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-6 text-center text-gray-400">
            No se encontraron voces
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        className={`
          w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 
          focus:outline-none focus:border-yellow-400 transition-colors
          flex items-center justify-between
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-500'}
          ${isOpen ? 'border-yellow-400 ring-1 ring-yellow-400/20' : ''}
        `}
      >
        <div className="flex items-center space-x-3">
          <Volume2 size={18} className="text-gray-400" />
          {selectedVoice ? (
            <div className="flex items-center space-x-2">
              <span className="font-medium">{selectedVoice.name}</span>
              <div className="flex items-center space-x-1">
                <span className={`
                  px-2 py-0.5 text-xs rounded-full border
                  ${getProviderColor(selectedVoice.provider)}
                `}>
                  {selectedVoice.provider}
                </span>
                <span className={`
                  px-2 py-0.5 text-xs rounded-full border flex items-center space-x-1
                  ${getGenderColor(selectedVoice.gender)}
                `}>
                  <span>{getGenderIcon(selectedVoice.gender)}</span>
                  <span className="capitalize">{selectedVoice.gender}</span>
                </span>
              </div>
            </div>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        <ChevronDown 
          size={18} 
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Portal */}
      {isOpen && typeof window !== 'undefined' && createPortal(
        <DropdownContent />,
        document.body
      )}
    </div>
  );
};

export default VoiceDropdown;