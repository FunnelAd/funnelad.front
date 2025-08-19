"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "@/i18n";
import TemplateModal from "@/presentation/components/TemplateModal";
import type { TemplateFormData } from "@/presentation/components/TemplateModal";
import type { WhatsAppTemplate } from "@/presentation/components/CreateWhatsAppTemplateModal";
import {
  templateService,
  type Template,
} from "@/core/services/templateService";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

export default function TemplatesPage() {
  const { t } = useTranslation();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("simple"); // 'simple' o 'whatsapp'
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<
    Template | undefined
  >();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await templateService.getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error("Error loading templates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSimpleTemplates = async () => {
    // Implementar lógica para cargar templates simples
    await loadTemplates();
  };

  const loadWhatsappTemplates = async () => {
    // Implementar lógica para cargar templates de WhatsApp
    await loadTemplates();
  };

  const getCurrentTemplates = () => {
    return templates;
  };

  const setCurrentTemplates = (newTemplates: Template[]) => {
    setTemplates(newTemplates);
  };

  const handleCreateTemplate = () => {
    setEditingTemplate(undefined);
    setIsCreateModalOpen(true);
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setIsCreateModalOpen(true);
  };

  const handleSaveTemplate = async (formData: TemplateFormData) => {
    try {
      if (editingTemplate) {
        console.log(editingTemplate);
        if (activeTab === "simple") {
          await templateService.updateTemplate(editingTemplate._id, formData);
        } else {
          // await templateService.updateWhatsappTemplate(editingTemplate._id, formData);
        }
      } else {
        if (activeTab === "simple") {
          await templateService.createTemplate(formData);
        } else {
          // await templateService.createWhatsappTemplate(formData);
        }
      }

      // Recargar la lista correspondiente
      if (activeTab === "simple") {
        await loadSimpleTemplates();
      } else {
        await loadWhatsappTemplates();
      }
      await loadTemplates();
    } catch (error) {
      console.error("Error saving template:", error);
    }
  };

  const handleSaveTemplateWhatsapp = async (formData: WhatsAppTemplate) => {
    try {
      if (editingTemplate) {
        console.log(editingTemplate);
        if (activeTab === "simple") {
          //await templateService.updateTemplate(editingTemplate._id, formData);
        } else {
          //await templateService.updateWhatsappTemplate(editingTemplate._id, formData);
        }
      } else {
        if (activeTab === "simple") {
          //  await templateService.createTemplate(formData);
        } else {
          //  await templateService.createWhatsappTemplate(formData);
        }
      }

      // Recargar la lista correspondiente
      if (activeTab === "simple") {
        await loadSimpleTemplates();
      } else {
        await loadWhatsappTemplates();
      }
    } catch (error) {
      console.error("Error saving template:", error);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (window.confirm(t("confirm_delete_template"))) {
      try {
        if (activeTab === "simple") {
          await templateService.deleteTemplate(id);
        } else {
          // await templateService.deleteWhatsappTemplate(id);
        }

        const currentTemplates = getCurrentTemplates();
        setCurrentTemplates(currentTemplates.filter((t) => t._id !== id));
      } catch (error) {
        console.error("Error deleting template:", error);
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "welcome":
        return t("welcome_message");
      case "farewell":
        return t("farewell_message");
      case "custom":
        return t("custom_message");
      default:
        return type;
    }
  };

  const getTemplateIcon = (name: string, type?: string) => {
    if (name.toLowerCase().includes('bienvenida') || type === 'welcome') return '👋';
    if (name.toLowerCase().includes('despedida') || type === 'farewell') return '👋';
    if (name.toLowerCase().includes('whatsapp')) return '📱';
    if (name.toLowerCase().includes('email')) return '📧';
    if (name.toLowerCase().includes('sms')) return '💬';
    return '📄';
  };

  const getUsageCount = () => {
    return Math.floor(Math.random() * 100) + 1;
  };

  const getSuccessRate = () => {
    return Math.floor(Math.random() * 30) + 70;
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
              onClick={handleCreateTemplate}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl text-[#00212f] font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #af8d46 0%, #edc746 100%)',
                boxShadow: '0 4px 20px rgba(237, 199, 70, 0.3)'
              }}
            >
              <PlusIcon className="h-5 w-5" />
              {t("create_template")}
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
          {t("templates")}
        </h1>
        <p className="text-xl mb-12 max-w-2xl" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Gestiona tus plantillas de mensajes para automatizar y personalizar la comunicación con tus clientes de manera eficiente.
        </p>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 p-1 rounded-2xl w-fit" style={{
          background: 'rgba(20, 103, 137, 0.2)',
          border: '1px solid rgba(237, 203, 114, 0.3)'
        }}>
          {['simple', 'whatsapp'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab 
                  ? 'text-[#00212f]' 
                  : 'text-white hover:text-yellow-400'
              }`}
              style={{
                background: activeTab === tab 
                  ? 'linear-gradient(135deg, #af8d46 0%, #edc746 100%)'
                  : 'transparent'
              }}
            >
              {tab === 'simple' ? 'Templates Simples' : 'Templates WhatsApp'}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-20 mx-auto max-w-md rounded-3xl" style={{
            background: 'rgba(20, 103, 137, 0.05)',
            border: '2px dashed rgba(237, 203, 114, 0.3)'
          }}>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-4xl" style={{
              background: 'linear-gradient(135deg, #af8d46 0%, #edc746 100%)',
              color: '#00212f'
            }}>
              📄
            </div>
            <h2 className="text-2xl font-bold mb-3 text-white">¡Crea tu primera plantilla!</h2>
            <p className="mb-8" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Las plantillas te ayudarán a estandarizar y automatizar tus mensajes. 
              Configura plantillas para diferentes tipos de comunicación.
            </p>
            <button
              onClick={handleCreateTemplate}
              className="flex items-center gap-3 px-8 py-4 mx-auto rounded-2xl text-[#00212f] font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #af8d46 0%, #edc746 100%)',
                boxShadow: '0 4px 20px rgba(237, 199, 70, 0.3)'
              }}
            >
              <PlusIcon className="h-5 w-5" />
              {t("create_template")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {templates.map((template) => (
              <div
                key={template._id}
                className={`relative rounded-3xl p-8 transition-all duration-400 hover:-translate-y-2 hover:shadow-2xl overflow-hidden ${
                  template.isActive ? 'border-2' : 'border'
                }`}
                style={{
                  background: template.isActive 
                    ? 'rgba(237, 203, 114, 0.1)' 
                    : 'rgba(20, 103, 137, 0.1)',
                  backdropFilter: 'blur(15px)',
                  borderColor: template.isActive 
                    ? '#edc746' 
                    : 'rgba(237, 203, 114, 0.2)',
                  boxShadow: template.isActive 
                    ? '0 0 30px rgba(237, 199, 70, 0.2)' 
                    : 'none'
                }}
              >
                {/* Top gradient line */}
                <div 
                  className="absolute top-0 left-0 right-0 transition-transform duration-300"
                  style={{
                    height: template.isActive ? '6px' : '4px',
                    background: 'linear-gradient(90deg, #af8d46 0%, #edc746 100%)',
                    transform: 'scaleX(1)'
                  }}
                ></div>

                {/* Card Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2 text-white">
                      {template.name}
                    </h3>
                    <p className="text-base leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {template.content ? template.content.substring(0, 100) + '...' : 'Plantilla de mensaje personalizada'}
                    </p>
                  </div>
                  <div 
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                      template.isActive
                        ? 'text-green-400 border-green-400/30 bg-green-400/20'
                        : 'text-gray-400 border-gray-400/30 bg-gray-400/20'
                    }`}
                    style={{ border: '1px solid' }}
                  >
                    <div 
                      className={`w-2 h-2 rounded-full ${template.isActive ? 'bg-green-400' : 'bg-gray-400'}`}
                      style={{ animation: 'pulse 2s ease-in-out infinite' }}
                    ></div>
                    {template.isActive ? t("active") : t("inactive")}
                  </div>
                </div>

                {/* Template Icon */}
                <div className="relative w-15 h-15 mb-5 rounded-2xl flex items-center justify-center text-2xl" style={{
                  background: 'linear-gradient(135deg, #af8d46 0%, #edc746 100%)',
                  color: '#00212f'
                }}>
                  {getTemplateIcon(template.name)}
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full opacity-80" style={{
                    background: 'linear-gradient(45deg, #edcb72, #edc746)'
                  }}></div>
                </div>

                {/* Template Type */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="px-3 py-1.5 rounded-lg text-xs font-semibold text-yellow-400" style={{
                    background: 'rgba(20, 103, 137, 0.3)',
                    border: '1px solid rgba(237, 203, 114, 0.3)'
                  }}>
                    {activeTab === 'simple' ? 'Simple' : 'WhatsApp'}
                  </div>
                  <div className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    {getUsageCount()} usos
                  </div>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 rounded-xl" style={{
                    background: 'rgba(0, 33, 47, 0.5)',
                    border: '1px solid rgba(237, 203, 114, 0.1)'
                  }}>
                    <div className="text-xl font-bold text-yellow-400 mb-1">
                      {getSuccessRate()}%
                    </div>
                    <div className="text-xs uppercase tracking-wider" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      Eficacia
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-xl" style={{
                    background: 'rgba(0, 33, 47, 0.5)',
                    border: '1px solid rgba(237, 203, 114, 0.1)'
                  }}>
                    <div className="text-xl font-bold text-yellow-400 mb-1">
                      {template.content ? template.content.length : 0}
                    </div>
                    <div className="text-xs uppercase tracking-wider" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      Caracteres
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-xl" style={{
                    background: 'rgba(0, 33, 47, 0.5)',
                    border: '1px solid rgba(237, 203, 114, 0.1)'
                  }}>
                    <div className="text-xl font-bold text-yellow-400 mb-1">
                      {getUsageCount()}
                    </div>
                    <div className="text-xs uppercase tracking-wider" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      Usos
                    </div>
                  </div>
                </div>

                {/* Dates Info */}
                <div className="flex justify-between mb-5 text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  <span>Creado: {formatDate(template.createdAt)}</span>
                  <span>
                    Actualizado: {template.updatedAt ? formatDate(template.updatedAt) : 'N/A'}
                  </span>
                </div>

                {/* Usage Rate */}
                <div className="flex items-center justify-center gap-2 p-3 rounded-xl mb-5" style={{
                  background: 'rgba(76, 175, 80, 0.1)',
                  border: '1px solid rgba(76, 175, 80, 0.2)'
                }}>
                  <span>📊</span>
                  <span className="text-lg font-bold text-green-400">
                    {getUsageCount()}
                  </span>
                  <span className="text-white">mensajes enviados</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEditTemplate(template)}
                    className="flex-1 p-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
                    style={{
                      background: 'linear-gradient(135deg, #146789 0%, #00212f 100%)',
                      border: '1px solid #146789',
                      color: '#ffffff'
                    }}
                  >
                    Editar
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
                    Previsualizar
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template._id)}
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

      <TemplateModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingTemplate(undefined);
        }}
        onSave={handleSaveTemplate}
        template={editingTemplate}
        isEditing={!!editingTemplate}
      />

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