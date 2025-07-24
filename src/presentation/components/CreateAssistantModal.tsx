import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "@/i18n";
import { useModal } from "@/core/hooks/useModal";
import { Assistant } from "@/core/types/assistant";

// Simulación de plantillas de bienvenida
const WELCOME_TEMPLATES = [
  {
    id: "1",
    name: "Bienvenida estándar",
    content: "¡Hola! ¿En qué puedo ayudarte hoy?",
  },
  {
    id: "2",
    name: "Bienvenida formal",
    content: "Bienvenido a nuestro servicio, ¿cómo puedo asistirle?",
  },
];

const TABS = [
  { key: "general", label: "general" },
  { key: "integrations", label: "integrations" },
];

interface CreateAssistantModalProps {
  //isOpen: boolean;
  // onClose: () => void;
  onSave: (formData: CreateAssistantFormData) => void;
  assistant?: Assistant;
  isEditing?: boolean;
}

export interface CreateAssistantFormData {
  id?: string;
  name: string;
  phone: string;
  welcomeTemplateId: string;
  isActive: boolean;
  responseTime: number;
  responseType: number;
  messageSendType: string;
  useEmojis: boolean;
  useStyles: boolean;
  audioVoice: string;
  audioCount: number;
  replyAudioWithAudio: boolean;
  whatsappNumber: string;
  whatsappBusinessId: string;
  metaAppId: string;
  metaToken: string;
  webhookUrl: string;
  webhookToken: string;
}

// onClose, onSave,

export default function CreateAssistantModal({
  onSave,
  assistant,
  isEditing = false,
}: CreateAssistantModalProps) {
  const { t } = useTranslation();
  const { hideModal } = useModal();
  const [activeTab, setActiveTab] = useState("general");
  const [form, setForm] = useState<CreateAssistantFormData>({
    name: "",
    phone: "",
    welcomeTemplateId: "",
    isActive: true,
    responseTime: 30,
    responseType: 80,
    messageSendType: "por_partes",
    useEmojis: false,
    useStyles: false,
    audioVoice: "",
    audioCount: 0,
    replyAudioWithAudio: false,
    whatsappNumber: "",
    whatsappBusinessId: "",
    metaAppId: "",
    metaToken: "",
    webhookUrl: "",
    webhookToken: "",
  });

  useEffect(() => {
    if (assistant && isEditing) {
      setForm({
        id: assistant.id,
        name: assistant.name,
        phone: assistant.phone || "",
        welcomeTemplateId: assistant.welcomeTemplateId || "",
        isActive: assistant.isActive,
        responseTime: assistant.responseTime || 30,
        responseType: assistant.responseType || 80,
        messageSendType: assistant.messageSendType || "por_partes",
        useEmojis: assistant.useEmojis || false,
        useStyles: assistant.useStyles || false,
        audioVoice: assistant.audioVoice || "",
        audioCount: assistant.audioCount || 0,
        replyAudioWithAudio: assistant.replyAudioWithAudio || false,
        whatsappNumber: assistant.whatsappNumber || "",
        whatsappBusinessId: assistant.whatsappBusinessId || "",
        metaAppId: assistant.metaAppId || "",
        metaToken: assistant.metaToken || "",
        webhookUrl: assistant.webhookUrl || "",
        webhookToken: assistant.webhookToken || "",
      });
    } else {
      // Reset form when opening for creation
      setForm({
        name: "",
        phone: "",
        welcomeTemplateId: "",
        isActive: true,
        responseTime: 30,
        responseType: 80,
        messageSendType: "por_partes",
        useEmojis: false,
        useStyles: false,
        audioVoice: "",
        audioCount: 0,
        replyAudioWithAudio: false,
        whatsappNumber: "",
        whatsappBusinessId: "",
        metaAppId: "",
        metaToken: "",
        webhookUrl: "",
        webhookToken: "",
      });
    }
  }, [assistant, isEditing]);

  // useEffect(() => {
  //   const handleEscape = (event: KeyboardEvent) => {
  //     if (event.key === 'Escape') {
  //       onClose();
  //     }
  //   };

  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
  //       onClose();
  //     }
  //   };

  //   if (isOpen) {
  //     document.addEventListener('keydown', handleEscape);
  //     document.addEventListener('mousedown', handleClickOutside);
  //   }

  //   return () => {
  //     document.removeEventListener('keydown', handleEscape);
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, [isOpen, onClose]);

  const handleChange = (field: string, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(form);
    hideModal();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#0B2C3D] tracking-tight flex items-center gap-3">
          <span className="inline-block w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A14A] to-[#A8842C] flex items-center justify-center">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                d="M3 12c0-2.21 1.79-4 4-4h2V6a3 3 0 1 1 6 0v2h2a4 4 0 1 1 0 8h-2v2a3 3 0 1 1-6 0v-2H7a4 4 0 0 1-4-4Z"
                fill="#fff"
              />
            </svg>
          </span>
          {isEditing ? t("edit_assistant") : t("new_assistant")}
        </h2>
        <button
          onClick={hideModal}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#C9A14A]/30 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-2 -mb-px border-b-2 transition-colors duration-200 font-semibold text-lg focus:outline-none ${
              activeTab === tab.key
                ? "border-[#C9A14A] text-[#C9A14A]"
                : "border-transparent text-gray-500 hover:text-[#C9A14A]"
            }`}
          >
            {t(tab.label)}
          </button>
        ))}
      </div>

      {/* Content (Formularios) */}
      {activeTab === "general" && (
        <form className="space-y-8">
          {/* General */}
          <div>
            <h3 className="text-xl font-bold text-[#C9A14A] mb-4">
              {t("general")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[#0B2C3D] font-semibold mb-1">
                  {t("assistant_name")}
                </label>
                <input
                  className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[#0B2C3D] font-semibold mb-1">
                  {t("phone")}
                </label>
                <input
                  className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[#0B2C3D] font-semibold mb-1">
                  {t("welcome_message")}
                </label>
                <select
                  className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]"
                  value={form.welcomeTemplateId}
                  onChange={(e) =>
                    handleChange("welcomeTemplateId", e.target.value)
                  }
                >
                  <option value="">{t("select_welcome_message")}</option>
                  {WELCOME_TEMPLATES.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* IA */}
          <div>
            <h3 className="text-xl font-bold text-[#C9A14A] mb-4">
              {t("assistant_response")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <label className="block text-[#0B2C3D] font-semibold mb-1">
                  {t("status")}
                </label>
                <select
                  className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]"
                  value={form.isActive ? "active" : "inactive"}
                  onChange={(e) =>
                    handleChange("isActive", e.target.value === "active")
                  }
                >
                  <option value="active">{t("active")}</option>
                  <option value="inactive">{t("inactive")}</option>
                </select>
              </div>
              <div>
                <label className="block text-[#0B2C3D] font-semibold mb-1">
                  {t("response_time")}
                </label>
                <input
                  type="number"
                  min={1}
                  max={300}
                  className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]"
                  value={form.responseTime}
                  onChange={(e) =>
                    handleChange("responseTime", Number(e.target.value))
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[#0B2C3D] font-semibold mb-1">
                  {t("response_type_label")}
                </label>
                <div className="flex items-center gap-4">
                  <span className="text-[#0B2C3D]">{t("text")}</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={form.responseType}
                    onChange={(e) =>
                      handleChange("responseType", Number(e.target.value))
                    }
                    className="w-full accent-[#C9A14A]"
                  />
                  <span className="text-[#0B2C3D]">{t("audio")}</span>
                </div>
                <p className="text-center text-sm text-gray-500 mt-1">
                  {form.responseType}% {t("text")} / {100 - form.responseType}%{" "}
                  {t("audio")}
                </p>
              </div>
            </div>
          </div>

          {/* Texto */}
          <div>
            <h3 className="text-xl font-bold text-[#C9A14A] mb-4">
              {t("text_style")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <label className="block text-[#0B2C3D] font-semibold mb-1">
                  {t("message_send_type")}
                </label>
                <select
                  className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]"
                  value={form.messageSendType}
                  onChange={(e) =>
                    handleChange("messageSendType", e.target.value)
                  }
                >
                  <option value="por_partes">{t("by_parts")}</option>
                  <option value="completo">{t("complete")}</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <input
                  id="useEmojis"
                  type="checkbox"
                  checked={form.useEmojis}
                  onChange={(e) => handleChange("useEmojis", e.target.checked)}
                  className="accent-[#C9A14A] w-5 h-5 rounded"
                />
                <label
                  htmlFor="useEmojis"
                  className="text-[#0B2C3D] font-semibold"
                >
                  {t("use_emojis")}
                </label>
              </div>
              <div className="flex items-center gap-4">
                <input
                  id="useStyles"
                  type="checkbox"
                  checked={form.useStyles}
                  onChange={(e) => handleChange("useStyles", e.target.checked)}
                  className="accent-[#C9A14A] w-5 h-5 rounded"
                />
                <label
                  htmlFor="useStyles"
                  className="text-[#0B2C3D] font-semibold"
                >
                  {t("use_styles")}
                </label>
              </div>
            </div>
          </div>

          {/* Audio */}
          <div>
            <h3 className="text-xl font-bold text-[#C9A14A] mb-4">
              {t("audio")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <label className="block text-[#0B2C3D] font-semibold mb-1">
                  {t("audio_voice")}
                </label>
                <select
                  className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]"
                  value={form.audioVoice}
                  onChange={(e) => handleChange("audioVoice", e.target.value)}
                >
                  <option value="">{t("select_voice")}</option>
                  <option value="voz1">Voz 1</option>
                  <option value="voz2">Voz 2</option>
                </select>
              </div>
              <div>
                <label className="block text-[#0B2C3D] font-semibold mb-1">
                  {t("audio_count")}
                </label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]"
                  value={form.audioCount}
                  onChange={(e) =>
                    handleChange("audioCount", Number(e.target.value))
                  }
                />
              </div>
              <div className="flex items-center gap-4">
                <input
                  id="replyAudioWithAudio"
                  type="checkbox"
                  checked={form.replyAudioWithAudio}
                  onChange={(e) =>
                    handleChange("replyAudioWithAudio", e.target.checked)
                  }
                  className="accent-[#C9A14A] w-5 h-5 rounded"
                />
                <label
                  htmlFor="replyAudioWithAudio"
                  className="text-[#0B2C3D] font-semibold"
                >
                  {t("reply_audio_with_audio")}
                </label>
              </div>
            </div>
          </div>
        </form>
      )}

      {activeTab === "integrations" && (
        <form className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[#0B2C3D] font-semibold mb-1">
                {t("whatsapp_number")}
              </label>
              <input
                className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]"
                value={form.whatsappNumber}
                onChange={(e) => handleChange("whatsappNumber", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[#0B2C3D] font-semibold mb-1">
                {t("whatsapp_business_id")}
              </label>
              <input
                className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]"
                value={form.whatsappBusinessId}
                onChange={(e) =>
                  handleChange("whatsappBusinessId", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-[#0B2C3D] font-semibold mb-1">
                {t("meta_app_id")}
              </label>
              <input
                className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]"
                value={form.metaAppId}
                onChange={(e) => handleChange("metaAppId", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[#0B2C3D] font-semibold mb-1">
                {t("meta_token")}
              </label>
              <input
                className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]"
                value={form.metaToken}
                onChange={(e) => handleChange("metaToken", e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[#0B2C3D] font-semibold mb-1">
                {t("webhook_config")}
              </label>
              <input
                className="w-full rounded-lg p-2 mb-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]"
                value={form.webhookUrl}
                onChange={(e) => handleChange("webhookUrl", e.target.value)}
                placeholder={t("webhook_url")}
              />
              <input
                className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]"
                value={form.webhookToken}
                onChange={(e) => handleChange("webhookToken", e.target.value)}
                placeholder={t("webhook_token")}
              />
            </div>
          </div>
        </form>
      )}

      {/* Footer */}
      <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-gray-200">
        <button
          onClick={hideModal}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          {t("cancel")}
        </button>
        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-[#C9A14A] to-[#A8842C] hover:from-[#A8842C] hover:to-[#C9A14A] text-white px-6 py-2 rounded-lg font-semibold"
        >
          {t("save_assistant")}
        </button>
      </div>
    </div>
  );
}
