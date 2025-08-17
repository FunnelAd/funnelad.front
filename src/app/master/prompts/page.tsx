"use client";
import React, { useState, FC, useEffect, KeyboardEvent } from "react";
import { useModal } from "@/core/hooks/useModal";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import Dropdown, { Option } from "@/presentation/components/ui/Dropdown";
import { Toaster, toast } from "sonner";
import {
  getPromptsByCompany,
  createPrompt,
  updatePrompt,
  deletePrompt,
} from "@/core/services/promptsService";
import { IPrompt } from "@/core/types/prompt"; // Asegúrate de que la ruta sea correcta

type Prompt = IPrompt & { _id: string };

const mockAssistant = {
  id: "assistant-123",
  name: "Agente de Soporte IA",
};

const PromptForm: FC<{
  onSave: (data: Partial<IPrompt>) => void;
  initialData?: Prompt | null;
}> = ({ onSave, initialData }) => {
  const promptOptions: Option[] = [
    { value: "Fallback", label: "Fallback" },
    { value: "Error", label: "Error" },
    { value: "Welcome", label: "Welcome" },
    { value: "Custom", label: "Personalizado" },
  ];

  const findOption = (options: Option[], value: string) =>
    options.find((opt) => opt.value === value) || null;

  const [selectedType, setSelectedType] = useState<Option | null>(
    initialData ? findOption(promptOptions, initialData.type) : null
  );
  const [content, setContent] = useState(initialData?.content || "");
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [currentTag, setCurrentTag] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleTagInput = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentTag.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) {
        setTags((prev) => [...prev, currentTag.trim()]);
      }
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    if (selectedType && content) {
      onSave({ type: selectedType.value, content, tags });
    } else {
      toast.error("Por favor, selecciona un tipo y escribe un contenido.");
    }
  };

  return (
    <div
      className={`p-6 bg-white rounded-lg shadow-xl w-full max-w-lg transition-all duration-300 ease-out ${
        isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
      }`}
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
        {initialData ? "Editar" : "Crear"} Prompt
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tipo de Prompt <span className="text-red-500">*</span>
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
            Contenido <span className="text-red-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe el contenido del prompt..."
            rows={4}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Etiquetas (presiona Enter para agregar)
          </label>
          <div className="mt-1 flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-teal-100 text-teal-800"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="text-teal-600 hover:text-teal-800"
                >
                  <XMarkIcon className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleTagInput}
              placeholder="Añadir etiqueta..."
              className="flex-grow bg-transparent border-none focus:ring-0 text-sm"
            />
          </div>
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

const DeleteConfirmationModal: FC<{
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ onConfirm, onCancel }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-xl w-full max-w-sm">
      <div className="flex flex-col items-center text-center">
        <div className="bg-red-100 p-3 rounded-full">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          ¿Eliminar Prompt?
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Esta acción no se puede deshacer. El prompt se perderá
          permanentemente.
        </p>
        <div className="mt-6 flex justify-center gap-4 w-full">
          <button
            onClick={onCancel}
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Componente Principal ---
export default function PromptsManager() {
  const { showModal, hideModal } = useModal();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- DATOS DE PRUEBA PARA LA ASOCIACIÓN ---
  const MOCK_COMPANY_ID = "60d21b4667d0d8992e610c85"; // Un ObjectId de ejemplo
  const MOCK_USER_ID = "60d21b4667d0d8992e610c86"; // Un ObjectId de ejemplo

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        setIsLoading(true);
        const data = await getPromptsByCompany(MOCK_COMPANY_ID);
        setPrompts(data as Prompt[]);
      } catch (error) {
        toast.error((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrompts();
  }, []);

  const handleCreatePrompt = () => {
    showModal(
      <PromptForm
        onSave={async (newPromptData) => {
          try {
            const dataToSave = {
              ...newPromptData,
              idCompany: MOCK_COMPANY_ID,
              createdBy: MOCK_USER_ID,
            };
            const newPrompt = await createPrompt(dataToSave);
            setPrompts((prev) => [...prev, newPrompt as Prompt]);
            hideModal();
            toast.success("Prompt creado exitosamente.");
          } catch (error) {
            toast.error((error as Error).message);
          }
        }}
      />
    );
  };

  const handleEditPrompt = (prompt: Prompt) => {
    showModal(
      <PromptForm
        initialData={prompt}
        onSave={async (updatedData) => {
          try {
            const updatedPrompt = await updatePrompt(prompt._id, updatedData);
            setPrompts((prev) =>
              prev.map((p) =>
                p._id === prompt._id ? (updatedPrompt as Prompt) : p
              )
            );
            hideModal();
            toast.success("Prompt actualizado correctamente.");
          } catch (error) {
            toast.error((error as Error).message);
          }
        }}
      />
    );
  };

  const handleDeletePrompt = (id: string) => {
    showModal(
      <DeleteConfirmationModal
        onCancel={hideModal}
        onConfirm={async () => {
          try {
            await deletePrompt(id);
            setPrompts((prev) => prev.filter((p) => p._id !== id));
            hideModal();
            toast.success("Prompt eliminado.");
          } catch (error) {
            toast.error((error as Error).message);
          }
        }}
      />
    );
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <Toaster richColors position="bottom-right" />
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
                key={prompt._id}
                className="bg-white rounded-lg shadow p-5 flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3">
                    {prompt.type}
                  </span>
                  <p className="text-gray-600 text-sm mb-4">{prompt.content}</p>
                  <div className="flex flex-wrap gap-2">
                    {prompt.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block bg-teal-100 text-teal-800 text-xs font-medium px-2 py-1 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
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
                      onClick={() => handleDeletePrompt(prompt._id)}
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
