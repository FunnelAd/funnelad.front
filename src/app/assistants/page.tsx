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

  const getAssistantIcon = (name: string) => {
    if (name.toLowerCase().includes('ventas') || name.toLowerCase().includes('sales')) return '🚀';
    if (name.toLowerCase().includes('soporte') || name.toLowerCase().includes('support')) return '🛠️';
    if (name.toLowerCase().includes('marketing')) return '📢';
    return '🤖';
  };

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #00212f 0%, #0a2d3f 100%)',
      color: '#ffffff',
      fontFamily: 'Montserrat, sans-serif'
    }}>
      {/* Header */}
      <div className="sticky top-0 z-50" style={{
        background: 'rgba(20, 103, 137, 0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(237, 203, 114, 0.2)',
        padding: '20px 0'
      }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold text-[#00212f]" 
                   style={{
                     background: 'linear-gradient(135deg, #af8d46 0%, #edc746 100%)',
                     animation: 'breathe 3s ease-in-out infinite'
                   }}>
                F
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full" 
                     style={{
                       background: 'linear-gradient(45deg, #edcb72, #edc746)',
                       animation: 'pulse 2s ease-in-out infinite alternate'
                     }}></div>
              </div>
              <div className="text-3xl font-bold" style={{
                background: 'linear-gradient(135deg, #edc746 0%, #edcb72 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                FunnelAd
              </div>
            </div>
            <button
              onClick={handleCreateAssistant}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl text-[#00212f] font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #af8d46 0%, #edc746 100%)',
                boxShadow: '0 4px 20px rgba(237, 199, 70, 0.3)'
              }}
            >
              <PlusIcon className="h-5 w-5" />
              Crear Asistente
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-5xl font-bold mb-4" style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #edcb72 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Asistentes
        </h1>
        <p className="text-xl mb-12 max-w-2xl" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Gestiona y configura tus asistentes de IA para automatizar las conversaciones con tus clientes de manera inteligente y personalizada.
        </p>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
          </div>
        ) : assistants.length === 0 ? (
          <div className="text-center py-20 mx-auto max-w-md rounded-3xl" style={{
            background: 'rgba(20, 103, 137, 0.05)',
            border: '2px dashed rgba(237, 203, 114, 0.3)'
          }}>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-4xl" style={{
              background: 'linear-gradient(135deg, #af8d46 0%, #edc746 100%)',
              color: '#00212f'
            }}>
              🤖
            </div>
            <h2 className="text-2xl font-bold mb-3 text-white">¡Crea tu primer asistente!</h2>
            <p className="mb-8" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Los asistentes de IA te ayudarán a automatizar las conversaciones con tus clientes. 
              Configura uno especializado en ventas, soporte o marketing.
            </p>
            <button
              onClick={handleCreateAssistant}
              className="flex items-center gap-3 px-8 py-4 mx-auto rounded-2xl text-[#00212f] font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #af8d46 0%, #edc746 100%)',
                boxShadow: '0 4px 20px rgba(237, 199, 70, 0.3)'
              }}
            >
              <PlusIcon className="h-5 w-5" />
              Crear mi primer asistente
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {assistants.map((assistant) => (
              <div
                key={assistant._id}
                className={`relative rounded-3xl p-8 transition-all duration-400 hover:-translate-y-2 hover:shadow-2xl overflow-hidden ${
                  assistant.isActive ? 'border-2' : 'border'
                }`}
                style={{
                  background: assistant.isActive 
                    ? 'rgba(237, 203, 114, 0.1)' 
                    : 'rgba(20, 103, 137, 0.1)',
                  backdropFilter: 'blur(15px)',
                  borderColor: assistant.isActive 
                    ? '#edc746' 
                    : 'rgba(237, 203, 114, 0.2)',
                  boxShadow: assistant.isActive 
                    ? '0 0 30px rgba(237, 199, 70, 0.2)' 
                    : 'none'
                }}
              >
                {/* Top gradient line */}
                <div 
                  className="absolute top-0 left-0 right-0 transition-transform duration-300"
                  style={{
                    height: assistant.isActive ? '6px' : '4px',
                    background: 'linear-gradient(90deg, #af8d46 0%, #edc746 100%)',
                    transform: 'scaleX(1)'
                  }}
                ></div>

                {/* Card Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2 text-white">
                      {assistant.name}
                    </h3>
                    <p className="text-base leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {assistant.description}
                    </p>
                  </div>
                  <div 
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                      assistant.isActive
                        ? 'text-green-400 border-green-400/30 bg-green-400/20'
                        : 'text-gray-400 border-gray-400/30 bg-gray-400/20'
                    }`}
                    style={{ border: '1px solid' }}
                  >
                    <div 
                      className={`w-2 h-2 rounded-full ${assistant.isActive ? 'bg-green-400' : 'bg-gray-400'}`}
                      style={{ animation: 'pulse 2s ease-in-out infinite' }}
                    ></div>
                    {assistant.isActive ? 'Activo' : 'Inactivo'}
                  </div>
                </div>

                {/* Assistant Icon */}
                <div className="relative w-15 h-15 mb-5 rounded-2xl flex items-center justify-center text-2xl" style={{
                  background: 'linear-gradient(135deg, #af8d46 0%, #edc746 100%)',
                  color: '#00212f'
                }}>
                  {getAssistantIcon(assistant.name)}
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full opacity-80" style={{
                    background: 'linear-gradient(45deg, #edcb72, #edc746)'
                  }}></div>
                </div>

                {/* Model Info */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="px-3 py-1.5 rounded-lg text-xs font-semibold text-yellow-400" style={{
                    background: 'rgba(20, 103, 137, 0.3)',
                    border: '1px solid rgba(237, 203, 114, 0.3)'
                  }}>
                    {assistant.model}
                  </div>
                  <div className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    {assistant.totalConversations || 0} conversaciones
                  </div>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 rounded-xl" style={{
                    background: 'rgba(0, 33, 47, 0.5)',
                    border: '1px solid rgba(237, 203, 114, 0.1)'
                  }}>
                    <div className="text-xl font-bold text-yellow-400 mb-1">
                      {assistant.successRate || 0}%
                    </div>
                    <div className="text-xs uppercase tracking-wider" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      Tasa de Éxito
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-xl" style={{
                    background: 'rgba(0, 33, 47, 0.5)',
                    border: '1px solid rgba(237, 203, 114, 0.1)'
                  }}>
                    <div className="text-xl font-bold text-yellow-400 mb-1">2.1s</div>
                    <div className="text-xs uppercase tracking-wider" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      Tiempo Resp.
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-xl" style={{
                    background: 'rgba(0, 33, 47, 0.5)',
                    border: '1px solid rgba(237, 203, 114, 0.1)'
                  }}>
                    <div className="text-xl font-bold text-yellow-400 mb-1">
                      {assistant.totalConversations || 0}
                    </div>
                    <div className="text-xs uppercase tracking-wider" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      Conversaciones
                    </div>
                  </div>
                </div>

                {/* Dates Info */}
                <div className="flex justify-between mb-5 text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  <span>Creado: {formatDate(assistant.createdAt)}</span>
                  <span>
                    Último uso: {assistant.lastUsed ? formatDate(assistant.lastUsed) : 'Nunca'}
                  </span>
                </div>

                {/* Success Rate */}
                <div className="flex items-center justify-center gap-2 p-3 rounded-xl mb-5" style={{
                  background: 'rgba(76, 175, 80, 0.1)',
                  border: '1px solid rgba(76, 175, 80, 0.2)'
                }}>
                  <span>📈</span>
                  <span className="text-lg font-bold text-green-400">
                    {assistant.successRate || 0}%
                  </span>
                  <span className="text-white">Tasa de éxito</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEditAssistant(assistant)}
                    className="flex-1 p-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
                    style={{
                      background: 'linear-gradient(135deg, #146789 0%, #00212f 100%)',
                      border: '1px solid #146789',
                      color: '#ffffff'
                    }}
                  >
                    Configurar
                  </button>
                  <button
                    className="flex-1 p-3 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:text-[#00212f] hover:-translate-y-0.5"
                    style={{
                      background: 'rgba(20, 103, 137, 0.1)',
                      border: '1px solid rgba(237, 203, 114, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #af8d46 0%, #edc746 100%)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(20, 103, 137, 0.1)';
                    }}
                  >
                    Ver Métricas
                  </button>
                  <button
                    onClick={() => handleDeleteAssistant(assistant._id || "")}
                    className="p-3 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:text-red-500 hover:-translate-y-0.5"
                    style={{
                      background: 'rgba(20, 103, 137, 0.1)',
                      border: '1px solid rgba(237, 203, 114, 0.3)'
                    }}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes pulse {
          0% { opacity: 0.7; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}