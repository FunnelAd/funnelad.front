"use client";

import React, { useState, useEffect } from "react";
import { IAssistant, CreateAssistantData } from "@/core/types/assistant";
import { assistantService } from "@/core/services/assistantService";
import CreateAssistantModal from "@/presentation/components/CreateAssistantModal";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { useModal } from "@/core/hooks/useModal";

export default function AssistantsPage() {
  const [assistants, setAssistants] = useState<IAssistant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { showModal } = useModal();

  useEffect(() => {
    loadAssistants();
  }, []);

  const loadAssistants = async () => {
    try {
      const data = await assistantService.getAssistants();
      setAssistants(data);
    } catch (error) {
      console.error("Error loading assistants:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAssistant = () => {
    console.log("Creating new assistant");
    showModal(
      <CreateAssistantModal onSave={handleSaveAssistant} isEditing={false} />
    );
  };
  const handleEditAssistant = (assistant: IAssistant) => {
    showModal(
      <CreateAssistantModal
        onSave={handleSaveAssistant}
        assistant={assistant}
        isEditing={true}
      />
    );
  };

  const handleSaveAssistant = async (formData: CreateAssistantData) => {
    try {
      if (formData._id) {
        await assistantService.updateAssistant(formData._id, formData);
      } else {
        await assistantService.createAssistant(formData);
      }
      await loadAssistants();
    } catch (error) {
      console.error("Error saving assistant:", error);
    }
  };

  const handleDeleteAssistant = async (id: string) => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar este asistente?")
    ) {
      try {
        await assistantService.deleteAssistant(id);
        setAssistants(assistants.filter((a) => a._id !== id));
      } catch (error) {
        console.error("Error deleting assistant:", error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Asistentes</h1>
        <button
          onClick={handleCreateAssistant}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Crear Asistente
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : assistants.length === 0 ? (
        <div className="text-center py-12">
          <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No hay asistentes
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza creando tu primer asistente para mejorar la atención a tus
            clientes.
          </p>
          <div className="mt-6">
            <button
              onClick={handleCreateAssistant}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Crear Asistente
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {assistants.map((assistant) => (
              <li key={assistant._id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-blue-600 truncate">
                        {assistant.name}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            assistant.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {assistant.isActive ? "Activo" : "Inactivo"}
                        </p>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex space-x-2">
                      <button
                        onClick={() => handleEditAssistant(assistant)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAssistant(assistant._id || "")}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {assistant.description}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>Creado el {formatDate(assistant.createdAt)}</p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Modelo: {assistant.model}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        Último uso:{" "}
                        {assistant.lastUsed
                          ? formatDate(assistant.lastUsed)
                          : "Nunca"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Conversaciones: {assistant.totalConversations || 0}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>Tasa de éxito: {assistant.successRate || 0}%</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
