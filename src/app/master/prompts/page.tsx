"use client";

import { useModal } from "@/core/hooks/useModal";
import { useState, FC, useEffect } from "react";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/solid";
import { PromptForm } from "@/presentation/components/features/PromptForm"; // Ajusta esta ruta

// --- Tipos y Datos de Ejemplo ---
type Prompt = {
  id: string;
  type: string;
  content: string;
  isActive: boolean;
};

const mockPrompts: Prompt[] = [
  {
    id: "1",
    type: "greeting",
    content: "Hola, ¿cómo puedo ayudarte hoy?",
    isActive: true,
  },
  {
    id: "2",
    type: "fallback",
    content: "Lo siento, no entendí eso. ¿Puedes reformularlo?",
    isActive: true,
  },
  {
    id: "3",
    type: "goodbye",
    content: "¡Gracias por contactarnos! Que tengas un buen día.",
    isActive: false,
  },
];

const mockAssistant = {
  id: "assistant-123",
  name: "Agente de Soporte IA",
};

// --- Componente de Interruptor (Toggle) ---
const ToggleSwitch: FC<{
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}> = ({ enabled, onChange }) => {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`${
        enabled ? "bg-blue-600" : "bg-gray-200"
      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
    >
      <span
        aria-hidden="true"
        className={`${
          enabled ? "translate-x-5" : "translate-x-0"
        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  );
};

// --- Componente Principal ---
export default function PromptsPage() {
  const { showModal, hideModal } = useModal();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setPrompts(mockPrompts);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleToggleStatus = (promptId: string) => {
    setPrompts((prev) =>
      prev.map((p) => (p.id === promptId ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const handleCreatePrompt = () => {
    showModal(
      <PromptForm
        onSave={(newPromptData) => {
          const newPrompt = {
            ...newPromptData,
            id: Date.now().toString(),
            isActive: true,
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
        onSave={(updatedPrompt) => {
          setPrompts((prev) =>
            prev.map((p) => (p.id === updatedPrompt.id ? updatedPrompt : p))
          );
          hideModal();
        }}
      />
    );
  };

  const handleDeletePrompt = (id: string) => {
    setPrompts((prev) => prev.filter((p) => p.id !== id));
  };

  const filteredPrompts = prompts.filter(
    (p) =>
      p.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Prompts para {mockAssistant.name}
        </h2>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-200 bg-white">
            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar por tipo o contenido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <button
              className="inline-flex items-center bg-blue-600 text-white px-3 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors w-full md:w-auto justify-center text-sm font-medium"
              onClick={handleCreatePrompt}
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              <span>Nuevo Prompt</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-slate-100">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                  >
                    Tipo
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                  >
                    Contenido
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                  >
                    Estado
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10">
                      Cargando prompts...
                    </td>
                  </tr>
                ) : (
                  filteredPrompts.map((prompt) => (
                    <tr key={prompt.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {prompt.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-500 truncate max-w-lg">
                          {prompt.content}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <ToggleSwitch
                          enabled={prompt.isActive}
                          onChange={() => handleToggleStatus(prompt.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                        <div className="flex items-center justify-center space-x-4">
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
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
