import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "@/i18n";
import { Assistant } from "@/core/types/assistants/assistant";

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
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: any) => void;
  assistant?: Assistant;
  isEditing?: boolean;
}

export default function CreateAssistantModal({
  isOpen,
  onClose,
  onSave,
  assistant,
  isEditing = false,
}: CreateAssistantModalProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("general");
  const [form, setForm] = useState<any>({
    name: "",
    phone: "",
    welcomeMsg: "",
    timeResponse: 30,
    assistensResponseP: 80,
    typeSendMsg: { id: 1, name: "por_partes" },
    emotesUse: false,
    stylesUse: false,
    voice: { id: 0, name: "", gender: "" },
    amountAudio: 0,
    voiceResponse: false,
    idPhoneNumber: "",
    idWppBusinessAccount: "",
    idMetaApp: "",
    tokenMetaPermanent: "",
    webhook: "",
    tokenWebhook: "",
    prompt: "",
    active: true,
  });
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (assistant && isEditing) {
        // Mapear el asistente existente al formulario del modal
        setForm({
          name: assistant.name || "",
          phone: assistant.phone || "",
          welcomeMsg: assistant.welcomeMsg || "",
          timeResponse: assistant.timeResponse || 30,
          assistensResponseP: assistant.assistensResponseP || 80,
          typeSendMsg: assistant.typeSendMsg || { id: 1, name: "por_partes" },
          emotesUse: assistant.emotesUse ?? false,
          stylesUse: assistant.stylesUse ?? false,
          voice: assistant.voice || { id: 0, name: "", gender: "" }, // Asegúrate de que gender tenga un valor por defecto si falta
          amountAudio: assistant.amountAudio || 0,
          voiceResponse: assistant.voiceResponse ?? false,
          idPhoneNumber: assistant.idPhoneNumber || "",
          idWppBusinessAccount: assistant.idWppBusinessAccount || "",
          idMetaApp: assistant.idMetaApp || "",
          tokenMetaPermanent: assistant.tokenMetaPermanent || "",
          webhook: assistant.webhook || "",
          tokenWebhook: assistant.tokenWebhook || "",
          prompt: assistant.prompt || "",
          active: assistant.active ?? true,
        });
      } else {
        // Resetear el formulario para la creación
        setForm({
          name: "",
          phone: "",
          welcomeMsg: "",
          timeResponse: 30,
          assistensResponseP: 80,
          typeSendMsg: { id: 1, name: "por_partes" },
          emotesUse: false,
          stylesUse: false,
          voice: { id: 0, name: "", gender: "unknown" }, // *** IMPORTANTE: Valor por defecto para gender ***
          amountAudio: 0,
          voiceResponse: false,
          idPhoneNumber: "", // *** IMPORTANTE: Valor por defecto para required fields ***
          idWppBusinessAccount: "", // *** IMPORTANTE ***
          idMetaApp: "",
          tokenMetaPermanent: "", // *** IMPORTANTE ***
          webhook: "",
          tokenWebhook: "",
          prompt: "",
          active: true,
        });
      }
    }
  }, [assistant, isEditing, isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleChange = (field: string, value: any) => {
    // Changed type to any to accommodate nested objects
    if (field === "typeSendMsg") {
      setForm((prev: any) => ({
        ...prev,
        typeSendMsg: { id: value === "por_partes" ? 1 : 2, name: value },
      }));
    } else if (field === "voice") {
      // Assuming 'value' for voice will be just the 'name' for simplicity,
      // you might need to adjust this based on how you handle voice selection (e.g., id, gender).
      setForm((prev: any) => ({ ...prev, voice: { ...prev.voice, name: value } }));
    } else {
      setForm((prev: any) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = () => {
    onSave(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-white/95 backdrop-blur-sm rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >
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
              onClick={onClose}
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
            <div className="flex items-center gap-2 ml-auto">
              <label className="block text-[#0B2C3D] font-semibold mb-1">
                {t("status")}
              </label>
              <select
                className="w-full rounded-lg p-1 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]"
                value={form.active ? "active" : "inactive"}
                onChange={(e) =>
                  handleChange("active", e.target.value === "active")
                }
              >
                <option value="active">{t("active")}</option>
                <option value="inactive">{t("inactive")}</option>
              </select>
            </div>
          </div>

          {/* Content */}
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
                      value={form.welcomeMsg}
                      onChange={(e) =>
                        handleChange("welcomeMsg", e.target.value)
                      }
                    >
                      <option value="">{t("welcome_message")}</option>
                      {WELCOME_TEMPLATES.map((tpl) => (
                        <option key={tpl.id} value={tpl.content}>
                          {" "}
                          {/* Changed to tpl.content */}
                          {tpl.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* New fields: idCompany, nit, createBy, model */}
                  <div>
                    <label className="block text-[#0B2C3D] font-semibold mb-1">
                      {t("ID Company")}
                    </label>
                    <input
                      className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]"
                      value={form.idCompany}
                      onChange={(e) =>
                        handleChange("idCompany", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-[#0B2C3D] font-semibold mb-1">
                      {t("NIT")}
                    </label>
                    <input
                      className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]"
                      value={form.nit}
                      onChange={(e) => handleChange("nit", e.target.value)}
                    />
                  </div>
                  {/* <div>
                    <label className="block text-[#0B2C3D] font-semibold mb-1">
                      {t("created By")}
                    </label>
                    <input
                      className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]"
                      value={form.createBy}
                      onChange={(e) => handleChange("createBy", e.target.value)}
                    />
                  </div> */}
                  {/* <div>
                    <label className="block text-[#0B2C3D] font-semibold mb-1">
                      {t("model")}
                    </label>
                    <input
                      className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]"
                      value={form.model}
                      onChange={(e) => handleChange("model", e.target.value)}
                    />
                  </div> */}
                </div>
              </div>

              {/* IA */}
              <div>
                <h3 className="text-xl font-bold text-[#C9A14A] mb-4">
                  {t("assistant_response")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[#0B2C3D] font-semibold mb-1">
                      {t("response_time")}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={300}
                      className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]"
                      value={form.timeResponse}
                      onChange={(e) =>
                        handleChange("timeResponse", Number(e.target.value))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-[#0B2C3D] font-semibold mb-1">
                      {t("assistant_response")}
                    </label>
                    <div className="flex items-center gap-4">
                      <span className="text-[#0B2C3D]">{t("text")}</span>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={form.assistensResponseP}
                        onChange={(e) =>
                          handleChange(
                            "assistensResponseP",
                            Number(e.target.value)
                          )
                        }
                        className="accent-[#C9A14A]"
                      />
                      <span className="text-[#0B2C3D]">{t("audio")}</span>
                      <span className="ml-2 text-[#C9A14D] font-bold">
                        {form.assistensResponseP}% {t("text")} /{" "}
                        {100 - form.assistensResponseP}% {t("audio")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Texto */}
              <div>
                <h3 className="text-xl font-bold text-[#C9A14A] mb-4">
                  {t("text")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[#0B2C3D] font-semibold mb-1">
                      {t("message_send_type")}
                    </label>
                    <select
                      className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]"
                      value={form.typeSendMsg.name} // Accessing the name property
                      onChange={(e) =>
                        handleChange("typeSendMsg", e.target.value)
                      }
                    >
                      <option value="por_partes">{t("by_parts")}</option>
                      <option value="completo">{t("complete")}</option>
                    </select>
                  </div>
                  <div className="flex gap-8 items-center mt-8 md:mt-0 md:flex-col">
                    <div className="flex gap-4 items-center">
                      <label className="text-[#0B2C3D] font-semibold">
                        {t("use_emojis")}
                      </label>
                      <input
                        type="checkbox"
                        checked={form.emotesUse}
                        onChange={(e) =>
                          handleChange("emotesUse", e.target.checked)
                        }
                        className="accent-[#C9A14A] w-5 h-5"
                      />
                    </div>
                    <div className="flex gap-4 items-center">
                      <label className="text-[#0B2C3D] font-semibold">
                        {t("use_styles")}
                      </label>
                      <input
                        type="checkbox"
                        checked={form.stylesUse}
                        onChange={(e) =>
                          handleChange("stylesUse", e.target.checked)
                        }
                        className="accent-[#C9A14A] w-5 h-5"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* --- SECCIÓN PARA EL ENTRENAMIENTO (PROMPT) --- */}
              <div className="mt-4">
                <label
                  htmlFor="prompt"
                  className="block text-sm font-medium text-[#0B2C3D] font-semibold"
                >
                  Entrenamiento
                </label>

                <div className="mt-1">
                  <textarea
                    id="prompt"
                    name="prompt"
                    rows={5} // Ajusta la altura como necesites
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                    placeholder="Ej: Eres un asistente amigable y experto en ventas. Tu objetivo es guiar al cliente hacia la compra del producto X..."
                    value={form.prompt}
                    onChange={(e) => handleChange("prompt", e.target.value)}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Define la personalidad y las instrucciones base de tu
                  asistente. Esto es clave para su comportamiento.
                </p>
              </div>

              {/* Audio */}
              <div>
                <h3 className="text-xl font-bold text-[#C9A14A] mb-4">
                  {t("audio")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[#0B2C3D] font-semibold mb-1">
                      {t("audio_voice")}
                    </label>
                    <select
                      className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]"
                      value={form.voice.name} // Accessing the name property
                      onChange={(e) => handleChange("voice", e.target.value)}
                    >
                      <option value="">{t("audio_voice")}</option>
                      <option value="voz1">Voz 1</option>
                      <option value="voz2">Voz 2</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#0B2C3D] font-semibold mb-1">
                      {t("voice_name")}
                    </label>
                    <input
                      className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]"
                      value={form.voiceName || ""}
                      onChange={(e) =>
                        handleChange("voiceName", e.target.value)
                      }
                      placeholder={t("Alice (default)")}
                    />
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
                      value={form.amountAudio}
                      onChange={(e) =>
                        handleChange("amountAudio", Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="flex items-center gap-4 mt-8 md:mt-0">
                    <label className="text-[#0B2C3D] font-semibold">
                      {t("reply_audio_with_audio")}
                    </label>
                    <input
                      type="checkbox"
                      checked={form.voiceResponse}
                      onChange={(e) =>
                        handleChange("voiceResponse", e.target.checked)
                      }
                      className="accent-[#C9A14A] w-5 h-5"
                    />
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
                    value={form.idPhoneNumber}
                    onChange={(e) =>
                      handleChange("idPhoneNumber", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-[#0B2C3D] font-semibold mb-1">
                    {t("whatsapp_business_id")}
                  </label>
                  <input
                    className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]"
                    value={form.idWppBusinessAccount}
                    onChange={(e) =>
                      handleChange("idWppBusinessAccount", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-[#0B2C3D] font-semibold mb-1">
                    {t("meta_app_id")}
                  </label>
                  <input
                    className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]"
                    value={form.idMetaApp}
                    onChange={(e) => handleChange("idMetaApp", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[#0B2C3D] font-semibold mb-1">
                    {t("meta_token")}
                  </label>
                  <input
                    className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]"
                    value={form.tokenMetaPermanent}
                    onChange={(e) =>
                      handleChange("tokenMetaPermanent", e.target.value)
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[#0B2C3D] font-semibold mb-1">
                    {t("webhook_config")}
                  </label>
                  <input
                    className="w-full rounded-lg p-2 mb-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]"
                    value={form.webhook}
                    onChange={(e) => handleChange("webhook", e.target.value)}
                    placeholder={t("webhook_url")}
                  />
                  <input
                    className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]"
                    value={form.tokenWebhook}
                    onChange={(e) =>
                      handleChange("tokenWebhook", e.target.value)
                    }
                    placeholder={t("webhook_token")}
                  />
                </div>
              </div>
            </form>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
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
      </div>
    </div>
  );
}
