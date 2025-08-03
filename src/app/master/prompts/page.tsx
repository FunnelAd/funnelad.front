"use client";

import React, { useState, FC, useEffect } from "react";
import { useModal } from "@/core/hooks/useModal"; // Ajusta la ruta a tu hook de modales
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/solid";
import Dropdown, { Option } from "@/presentation/components/ui/Dropdown"; // Asumiendo que tienes un Dropdown reutilizable

// --- Tipos y Datos de Ejemplo ---
type Prompt = {
  id: string;
  type: "Fallback" | "Error" | "Welcome";
  content: string;
};

const mockPrompts: Prompt[] = [
  { id: "1", type: "Welcome", content: "Hola, ¿cómo puedo ayudarte hoy?" },
  {
    id: "2",
    type: "Fallback",
    content: "Lo siento, no entendí eso. ¿Puedes reformularlo?",
  },
  {
    id: "3",
    type: "Error",
    content:
      "Parece que hubo un problema. Por favor, intenta de nuevo más tarde.",
  },
];

const mockAssistant = {
  id: "assistant-123",
  name: "Agente de Soporte IA",
};

// --- Modales (Plantillas) ---
const PromptForm: FC<{
  onSave: (data: any) => void;
  initialData?: Prompt | null;
}> = ({ onSave, initialData }) => {
  const promptOptions: Option[] = [
    { value: "Fallback", label: "Fallback" },
    { value: "Error", label: "Error" },
    { value: "Welcome", label: "Welcome" },
  ];

  const findOption = (options: Option[], value: string) =>
    options.find((opt) => opt.value === value) || null;

  const [selectedType, setSelectedType] = useState<Option | null>(
    initialData ? findOption(promptOptions, initialData.type) : null
  );
  const [content, setContent] = useState(initialData?.content || "");

  const handleSubmit = () => {
    if (selectedType && content) {
      onSave({ type: selectedType.value, content });
    } else {
      alert("Por favor, selecciona un tipo y escribe un contenido.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl w-full max-w-md">
      <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
        {initialData ? "Editar" : "Crear"} Prompt
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tipo de Prompt
          </label>
          <Dropdown
            options={promptOptions}
            onSelect={(option) => setSelectedType(option)}
            value={selectedType}
            placeholder="Selecciona un tipo..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contenido
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe el contenido del prompt..."
            rows={4}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
      <div className="flex justify-center pt-8">
        <button
          onClick={handleSubmit}
          className="px-5 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

// --- Componente Principal ---
export default function PromptsManager() {
  const { showModal, hideModal } = useModal();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPrompts(mockPrompts);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleCreatePrompt = () => {
    showModal(
      <PromptForm
        onSave={(newPromptData) => {
          const newPrompt: Prompt = {
            ...newPromptData,
            id: Date.now().toString(),
          };
          setPrompts((prev) => [...prev, newPrompt]);
          hideModal();
        }}
      />
    );
  };

  const handleEditPrompt = (prompt: Prompt) => {
    showModal(
      <PromptForm
        initialData={prompt}
        onSave={(updatedData) => {
          setPrompts((prev) =>
            prev.map((p) => (p.id === prompt.id ? { ...p, ...updatedData } : p))
          );
          hideModal();
        }}
      />
    );
  };

  const handleDeletePrompt = (id: string) => {
    // Reemplazamos window.confirm por una lógica de modal si es necesario
    if (confirm("¿Estás seguro de que quieres eliminar este prompt?")) {
      setPrompts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Prompts para {mockAssistant.name}
          </h2>
          <button
            className="inline-flex items-center bg-blue-600 text-white px-3 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors w-full md:w-auto justify-center text-sm font-medium"
            onClick={handleCreatePrompt}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            <span>Nuevo Prompt</span>
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-10">Cargando prompts...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
              <div
                key={prompt.id}
                className="bg-white rounded-lg shadow p-5 flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3">
                    {prompt.type}
                  </span>
                  <p className="text-gray-600 text-sm">{prompt.content}</p>
                </div>
                <div className="flex justify-end items-center mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleEditPrompt(prompt)}
                      className="text-gray-400 hover:text-indigo-600"
                      title="Editar"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeletePrompt(prompt.id)}
                      className="text-gray-400 hover:text-red-600"
                      title="Eliminar"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
