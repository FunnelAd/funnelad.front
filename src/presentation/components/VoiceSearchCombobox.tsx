import { useState, useRef, useEffect } from "react";
import { IVoice } from "@/core/types/voices";

interface VoiceSearchComboboxProps {
  voices: IVoice[];
  selectedValue: IVoice;
  onSelect: (voice: IVoice) => void;
  placeholder?: string;
}

export default function VoiceSearchCombobox({
  voices,
  selectedValue,
  onSelect,
  placeholder = "Busca y selecciona una voz...",
}: VoiceSearchComboboxProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const comboboxRef = useRef<HTMLDivElement>(null);

  const filteredVoices = query
    ? voices.filter((voice) =>
        voice.name.toLowerCase().includes(query.toLowerCase())
      )
    : voices;

  const handleSelect = (voice: IVoice) => {
    onSelect(voice);
    setQuery("");
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        comboboxRef.current &&
        !comboboxRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={comboboxRef}>
      <input
        type="text"
        value={query || selectedValue?.name || ""}
        onChange={(e) => {
          setQuery(e.target.value);
          if (!isOpen) setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
      />

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredVoices.length > 0 ? (
            filteredVoices.map((voice) => (
              <div
                key={voice.id}
                onClick={() => handleSelect(voice)}
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-blue-50"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      voice.gender === "male"
                        ? "bg-blue-400"
                        : voice.gender === "female"
                        ? "bg-pink-400"
                        : "bg-gray-400"
                    }`}
                  />
                  <span className="font-medium text-gray-800">{voice.name}</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {voice.provider}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 text-sm text-gray-500">No se encontraron voces.</div>
          )}
        </div>
      )}
    </div>
  );
}