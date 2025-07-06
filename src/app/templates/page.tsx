"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "@/i18n";
import ProtectedRoute from "@/presentation/components/ProtectedRoute";
import TemplateModal from "@/presentation/components/TemplateModal";
import CreateWhatsAppTemplateModal from "@/presentation/components/CreateWhatsAppTemplateModal";
import type { TemplateFormData } from "@/presentation/components/TemplateModal";
import type {WhatsAppTemplate} from "@/presentation/components/CreateWhatsAppTemplateModal"
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

type TabType = 'simple' | 'whatsapp';



export default function TemplatesPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('simple');
  const [simpleTemplates, setSimpleTemplates] = useState<Template[]>([]);
  const [whatsappTemplates, setWhatsappTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateModalWppOpen, setIsCreateModalWppOpen] = useState(false);

  
  const [editingTemplate, setEditingTemplate] = useState<
    Template | undefined
  >();

  useEffect(() => {
    if (activeTab === 'simple') {
      loadSimpleTemplates();
    } else {
      loadWhatsappTemplates();
    }
  }, [activeTab]);

  const loadSimpleTemplates = async () => {
    try {
      setIsLoading(true);
      const data = await templateService.getTemplates(); // Consulta actual
      setSimpleTemplates(data);
    } catch (error) {
      console.error("Error loading simple templates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadWhatsappTemplates = async () => {
    try {
      setIsLoading(true);
      // Aquí debes implementar el método específico para plantillas WhatsApp
      const data = await templateService.getWhatsappTemplates(); // Nueva consulta
      setWhatsappTemplates(data);
    } catch (error) {
      console.error("Error loading whatsapp templates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentTemplates = () => {
    return activeTab === 'simple' ? simpleTemplates : whatsappTemplates;
  };

  const setCurrentTemplates = (templates: Template[]) => {
    if (activeTab === 'simple') {
      setSimpleTemplates(templates);
    } else {
      setWhatsappTemplates(templates);
    }
  };

  const handleCreateTemplate = () => {
    console.log(activeTab)
    if (activeTab === 'simple') {
      setEditingTemplate(undefined);
      setIsCreateModalOpen(true);
    }
    else {
      setEditingTemplate(undefined);
      setIsCreateModalWppOpen(true);
    }
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setIsCreateModalOpen(true);
  };

  const handleSaveTemplate = async (formData: TemplateFormData) => {
    try {
      if (editingTemplate) {
        console.log(editingTemplate);
        if (activeTab === 'simple') {
          await templateService.updateTemplate(editingTemplate._id, formData);
        } else {
          // await templateService.updateWhatsappTemplate(editingTemplate._id, formData);
        }
      } else {
        if (activeTab === 'simple') {
          await templateService.createTemplate(formData);
        } else {
         // await templateService.createWhatsappTemplate(formData);
        }
      }

      // Recargar la lista correspondiente
      if (activeTab === 'simple') {
        await loadSimpleTemplates();
      } else {
        await loadWhatsappTemplates();
      }
    } catch (error) {
      console.error("Error saving template:", error);
    }
  };

  const handleSaveTemplateWhatsapp = async (formData: WhatsAppTemplate) => {
    try {
      if (editingTemplate) {
        console.log(editingTemplate);
        if (activeTab === 'simple') {
          //await templateService.updateTemplate(editingTemplate._id, formData);
        } else {
          //await templateService.updateWhatsappTemplate(editingTemplate._id, formData);
        }
      } else {
        if (activeTab === 'simple') {
        //  await templateService.createTemplate(formData);
        } else {
        //  await templateService.createWhatsappTemplate(formData);
        }
      }

      // Recargar la lista correspondiente
      if (activeTab === 'simple') {
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
        if (activeTab === 'simple') {
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

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const currentTemplates = getCurrentTemplates();

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            {t("templates")}
          </h1>
          <button
            onClick={handleCreateTemplate}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#C9A14A] to-[#A8842C] hover:from-[#A8842C] hover:to-[#C9A14A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C9A14A]"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            {t("create_template")}
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => handleTabChange('simple')}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'simple'
                  ? 'border-[#C9A14A] text-[#C9A14A]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {t("simple_templates") || "Plantillas Sencillas"}
            </button>
            <button
              onClick={() => handleTabChange('whatsapp')}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'whatsapp'
                  ? 'border-[#C9A14A] text-[#C9A14A]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {t("whatsapp_templates") || "Plantillas WhatsApp"}
            </button>
          </nav>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A14A]"></div>
          </div>
        ) : currentTemplates.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {activeTab === 'simple'
                ? (t("no_simple_templates") || t("no_templates"))
                : (t("no_whatsapp_templates") || t("no_templates"))
              }
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === 'simple'
                ? (t("create_first_simple_template") || t("create_first_template"))
                : (t("create_first_whatsapp_template") || t("create_first_template"))
              }
            </p>
            <div className="mt-6">
              <button
                onClick={handleCreateTemplate}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#C9A14A] to-[#A8842C] hover:from-[#A8842C] hover:to-[#C9A14A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C9A14A]"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                {t("create_template")}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t("name")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t("type")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t("status")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t("created_at")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t("updated_at")}
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">{t("actions")}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentTemplates.map((template) => (
                  <tr key={template._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {template.name}
                      </div>
                    </td>
             
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${template.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {template.isActive ? t("active") : t("inactive")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(template.createdAt)}
                    </td>
              
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditTemplate(template)}
                        className="text-[#C9A14A] hover:text-[#A8842C] mr-4"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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

       <CreateWhatsAppTemplateModal
          isOpen={isCreateModalWppOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingTemplate(undefined);
          }}
          onSave={handleSaveTemplateWhatsapp}
          // template={editingTemplate}
          // isEditing={!!editingTemplate}
        />


      </div>
    </ProtectedRoute>
  );
}