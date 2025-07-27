"use client";

import { useEffect, useState } from "react";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useModal } from "@/core/hooks/useModal";
import { PromptForm } from "@/presentation/components/features/PromptForm"; // Ajusta esta ruta según la estructura de tu proyecto

const mockPrompts = [
  { id: "1", type: "greeting", content: "Hola, ¿cómo puedo ayudarte hoy?" },
  {
    id: "2",
    type: "fallback",
    content: "Lo siento, no entendí eso. ¿Puedes reformularlo?",
  },
];

const mockAssistant = {
  id: "assistant-123",
  name: "Agente de Soporte IA",
};

export default function PromptsPage() {
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(true);

  const { showModal, hideModal } = useModal();

  useEffect(() => {
    // Simula la carga inicial
    setSelectedAssistant(mockAssistant);
    setTimeout(() => {
      setPrompts(mockPrompts);
      setIsLoadingPrompts(false);
    }, 800);
  }, []);

  const handleCreatePrompt = () => {
    showModal(
      <PromptForm
        onSave={(newPrompt) => {
          setPrompts((prev) => [...prev, newPrompt]);
          hideModal();
        }}
      />
    );
  };

  const handleEditPrompt = (prompt) => {
    showModal(
      <PromptForm
        initialData={prompt}
        onSave={(updatedPrompt) => {
          setPrompts((prev) =>
            prev.map((p) => (p.id === updatedPrompt.id ? updatedPrompt : p))
          );
          hideModal();
        }}
      />
    );
  };

  const handleDeletePrompt = (id) => {
    setPrompts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="p-6">
      {selectedAssistant && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800">
            Prompts Predeterminados para {selectedAssistant.name}
          </h2>
          <button
            onClick={handleCreatePrompt}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nuevo Prompt
          </button>

          {isLoadingPrompts ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : prompts.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">
              Este asistente no tiene prompts configurados.
            </p>
          ) : (
            <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {prompts.map((prompt) => (
                  <li key={prompt.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {prompt.type}
                          </p>
                          <p className="mt-1 text-sm text-gray-500 truncate max-w-xl">
                            {prompt.content}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditPrompt(prompt)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeletePrompt(prompt.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
