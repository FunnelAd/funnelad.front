"use client";

import { useState, useEffect } from "react";
import {
  Assistant,
  CreateAssistantData,
  UpdateAssistantData,
} from "@/core/types/assistants/assistant";
import { assistantService } from "@/core/services/assistantService";
import CreateAssistantModal from "@/presentation/components/CreateAssistantModal";
import { useAuth } from "@/presentation/contexts/AuthContext";

import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export default function AssistantsPage() {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAssistant, setEditingAssistant] = useState<
    Assistant | undefined
  >();

  const { user } = useAuth();

  useEffect(() => {
    loadAssistants();
  }, []);

  const loadAssistants = async () => {
    setIsLoading(true);
    try {
      const data = await assistantService.getAssistants();
      setAssistants(data);
    } catch (error) {
      console.error("Error loading assistants:", error);
      // Handle the error appropriately, e.g., show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAssistant = () => {
    setEditingAssistant(undefined);
    setIsCreateModalOpen(true);
  };

  const handleEditAssistant = (assistant: Assistant) => {
    setEditingAssistant(assistant);
    setIsCreateModalOpen(true);
  };

  const currentStore = {
    id: "store_abc123",
    name: "Mi Tienda Principal",
    nit: "900123456-7",
  };

  const handleSaveAssistant = async (formData: CreateAssistantData) => {
    setIsLoading(true);
    try {
      // Mapeo cuidadoso de formData del modal a CreateAssistantData
      const completeData: CreateAssistantData = {
        // Campos fijos desde el contexto del usuario/tienda
        businessid: currentStore.id, // Requerido
        nit: currentStore.nit, // Requerido
        createBy: user?.email || "unknown_creator", // Requerido: Asegúrate de que user.email exista

        // Campos generales y de respuesta
        name: formData.name, // Requerido
        phone: formData.phone, // Requerido
        active: formData.active ?? true, // Requerido, pero puede tener un default
        welcomeMsg: formData.welcomeMsg || "", // Puede ser opcional, pero aquí aseguramos un string vacío si es null/undefined

        timeResponse: Number(formData.timeResponse), // Requerido (Number)
        assistensResponseP: Number(formData.assistensResponseP), // Requerido (Number)

        emotesUse: formData.emotesUse ?? false, // Requerido (Boolean)
        stylesUse: formData.stylesUse ?? false, // Requerido (Boolean)

        prompt: formData.prompt || "", // Opcional en el esquema, aquí aseguramos string vacío

        // Campos de audio
        voice: formData.voice || { id: 0, name: "Default", gender: "unknown" }, // Requerido (Object): ***Asegúrate de que gender siempre tenga un valor***
        amountAudio: Number(formData.amountAudio), // Requerido (Number)
        voiceResponse: formData.voiceResponse ?? false, // Requerido (Boolean)

        idPhoneNumber: formData.idPhoneNumber || "",
        idWppBusinessAccount: formData.idWppBusinessAccount || "",
        idMetaApp: formData.idMetaApp || "", // Opcional
        tokenMetaPermanent: formData.tokenMetaPermanent || "", // Requerido
        tokenTelegram: formData.tokenTelegram || "",

        webhook: formData.webhook || "", // Opcional
        tokenWebhook: formData.tokenWebhook || "", // Opcional
        templates: formData.templates || [],
        triggers: formData.triggers || [],
      };

      console.log(
        "Enviando objeto final al backend para crear:",
        JSON.stringify(completeData, null, 2)
      );

      await assistantService.createAssistant(completeData);
      await loadAssistants(); // Recargar la lista
      setIsCreateModalOpen(false); // Cerrar el modal
    } catch (error) {
      console.error("Error al crear el asistente:", error);
      // Aquí es donde puedes mostrar el error de Mongoose al usuario
      // Por ejemplo, si tu AppError tiene un mensaje de error legible:
      alert(`Error al crear asistente: ${error || "Error desconocido"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAssistant = async (
    id: string,
    formData: UpdateAssistantData
  ) => {
    setIsLoading(true);
    try {
      const updateData: UpdateAssistantData = {
        name: formData.name,
        phone: formData.phone,
        active: formData.active ?? true,
        welcomeMsg: formData.welcomeMsg || "",

        timeResponse: Number(formData.timeResponse),
        assistensResponseP: Number(formData.assistensResponseP),

        emotesUse: formData.emotesUse ?? false,
        stylesUse: formData.stylesUse ?? false,

        prompt: formData.prompt || "",

        voice: formData.voice || { id: 0, name: "", gender: "unknown" }, // ***Asegura gender aquí también***
        amountAudio: Number(formData.amountAudio),
        voiceResponse: formData.voiceResponse ?? false,

        idPhoneNumber: formData.idPhoneNumber || "", // ***Requerido por Mongoose, asegúrate de enviar***
        idWppBusinessAccount: formData.idWppBusinessAccount || "", // ***Requerido por Mongoose, asegúrate de enviar***
        idMetaApp: formData.idMetaApp || "", // Opcional
        tokenMetaPermanent: formData.tokenMetaPermanent || "", // ***Requerido por Mongoose, asegúrate de enviar***
        webhook: formData.webhook || "", // Opcional
        tokenWebhook: formData.tokenWebhook || "", // Opcional

        // Campos estadísticos (mantener si se modifican, o si son requeridos y vienen en la data)
        // totalConversations: formData.totalConversations || 0,
        // successRate: formData.successRate || 0,

        templates: formData.templates || [],
        triggers: formData.triggers || [],

        // idCompany, nit, createBy NO se envían en la actualización si son campos fijos.
        // Si el backend los requiere, tu AssistantSchema debería tenerlos como no requeridos
        // para updates o tu lógica de update en el backend debería ignorarlos si no se proporcionan.
      };

      console.log(
        "Enviando objeto final al backend para actualizar:",
        JSON.stringify(updateData, null, 2)
      );
      await assistantService.updateAssistant(id, updateData);
      await loadAssistants();
      setIsCreateModalOpen(false);
      setEditingAssistant(undefined);
    } catch (error: any) {
      console.error("Error al actualizar el asistente:", error);
      alert(
        `Error al actualizar asistente: ${error.message || "Error desconocido"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAssistant = async (id: string) => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar este asistente?")
    ) {
      setIsLoading(true);
      try {
        await assistantService.deleteAssistant(id);
        // If delete is successful, update the local state
        setAssistants(assistants.filter((a) => a._id !== id));
      } catch (error) {
        console.error("Error deleting assistant:", error);
        // Handle the error here, e.g., show an error message to the user
      } finally {
        setIsLoading(false);
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
                            assistant.active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {assistant.active ? "Activo" : "Inactivo"}
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
                        onClick={() => handleDeleteAssistant(assistant._id!)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>Creado el {formatDate(assistant.createdAt!)}</p>
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

      <CreateAssistantModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingAssistant(undefined);
        }}
        onSave={(formData) => {
          if (editingAssistant) {
            // llamamos a tu update, pasando el _id del asistente
            handleUpdateAssistant(editingAssistant._id!, formData);
          } else {
            // creamos uno nuevo
            handleSaveAssistant(formData);
          }
        }}
        assistant={editingAssistant}
        isEditing={!!editingAssistant}
      />
    </div>
  );
}
