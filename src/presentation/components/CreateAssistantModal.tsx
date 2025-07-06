import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "@/i18n";
import { Assistant } from "@/core/types/assistants/assistant";
import { telegramServices } from "@/core/services/telegramServices";
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
    tokenTelegram: "",
    chatidTelegram: "",
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
          tokenTelegram: assistant.tokenTelegram || "",
          chatidTelegram: assistant.chatidTelegram || "",
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
          chatidTelegram: "",
          tokenTelegram: "",
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
  const onConnectTelegram = () => {
   
    if (form.tokenTelegram){
      console.log(form.tokenTelegram)
      telegramServices.connectTelegramWebhook(form.tokenTelegram)
    }
  };


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
      setForm((prev: any) => ({
        ...prev,
        voice: { ...prev.voice, name: value },
      }));
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200"
      >
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <span className="inline-block w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
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
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
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

          {/* Tabs and Status */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex border-b border-gray-200">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-6 py-3 -mb-px border-b-2 transition-all duration-200 font-medium text-sm uppercase tracking-wide focus:outline-none ${
                    activeTab === tab.key
                      ? "border-blue-500 text-blue-600 bg-blue-50/50"
                      : "border-transparent text-gray-500 hover:text-blue-500 hover:border-blue-300"
                  }`}
                >
                  {t(tab.label)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">
                {t("status")}
              </label>
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700"
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
            <div className="space-y-8">
              {/* General Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {t("general")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("assistant_name")}
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Nombre del asistente"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("Mensaje De Bienvenida")}
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                      value={form.welcomeMsg}
                      onChange={(e) =>
                        handleChange("welcomeMsg", e.target.value)
                      }
                      placeholder="Mensaje de bienvenida para los usuarios"
                    />
                  </div>
                </div>
              </div>

              {/* AI Response Configuration */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  {t("assistant_response")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("response_time")}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={300}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                      value={form.timeResponse}
                      onChange={(e) =>
                        handleChange("timeResponse", Number(e.target.value))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Proporción de respuesta
                    </label>
                    <div className="space-y-2">
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
                        className="w-full accent-blue-500"
                      />
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{t("text")}</span>
                        <span className="font-semibold text-blue-600">
                          {form.assistensResponseP}% {t("text")} /{" "}
                          {100 - form.assistensResponseP}% {t("audio")}
                        </span>
                        <span>{t("audio")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Configuration */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h7"
                    />
                  </svg>
                  {t("text")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("message_send_type")}
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                      value={form.typeSendMsg.name}
                      onChange={(e) =>
                        handleChange("typeSendMsg", e.target.value)
                      }
                    >
                      <option value="por_partes">{t("by_parts")}</option>
                      <option value="completo">{t("complete")}</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="emotesUse"
                        checked={form.emotesUse}
                        onChange={(e) =>
                          handleChange("emotesUse", e.target.checked)
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor="emotesUse"
                        className="text-sm text-gray-700 font-medium"
                      >
                        {t("use_emojis")}
                      </label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="stylesUse"
                        checked={form.stylesUse}
                        onChange={(e) =>
                          handleChange("stylesUse", e.target.checked)
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor="stylesUse"
                        className="text-sm text-gray-700 font-medium"
                      >
                        {t("use_styles")}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Training (Prompt) Section */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Entrenamiento
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instrucciones y personalidad del asistente
                  </label>
                  <textarea
                    id="prompt"
                    name="prompt"
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 resize-y"
                    placeholder="Ej: Eres un asistente amigable y experto en ventas. Tu objetivo es guiar al cliente hacia la compra del producto X..."
                    value={form.prompt}
                    onChange={(e) => handleChange("prompt", e.target.value)}
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Define la personalidad y las instrucciones base de tu
                    asistente. Esto es clave para su comportamiento.
                  </p>
                </div>
              </div>

              {/* Audio Configuration */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                  {t("audio")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("audio_voice")}
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                      value={form.voice.name}
                      onChange={(e) => handleChange("voice", e.target.value)}
                    >
                      <option value="">{t("audio_voice")}</option>
                      <option value="voz1">Voz 1</option>
                      <option value="voz2">Voz 2</option>
                    </select>
                  </div>
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("voice_name")}
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                      value={form.voiceName || ""}
                      onChange={(e) =>
                        handleChange("voiceName", e.target.value)
                      }
                      placeholder={t("Alice (default)")}
                    />
                  </div> */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("audio_count")}
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                      value={form.amountAudio}
                      onChange={(e) =>
                        handleChange("amountAudio", Number(e.target.value))
                      }
                    />
                  </div>
                  {/* <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="voiceResponse"
                      checked={form.voiceResponse}
                      onChange={(e) =>
                        handleChange("voiceResponse", e.target.checked)
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="voiceResponse" className="text-sm text-gray-700 font-medium">
                      {t("reply_audio_with_audio")}
                    </label>
                  </div> */}
                </div>
              </div>
            </div>
          )}

          {activeTab === "integrations" && (
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                Integraciones
              </h3>

              <h5 className="text-md font-semibold text-gray-600 mb-6 flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                Meta
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("whatsapp_number")}
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                    value={form.idPhoneNumber}
                    onChange={(e) =>
                      handleChange("idPhoneNumber", e.target.value)
                    }
                    placeholder="ID del número de WhatsApp"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("whatsapp_business_id")}
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                    value={form.idWppBusinessAccount}
                    onChange={(e) =>
                      handleChange("idWppBusinessAccount", e.target.value)
                    }
                    placeholder="ID de la cuenta de negocio"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("meta_app_id")}
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                    value={form.idMetaApp}
                    onChange={(e) => handleChange("idMetaApp", e.target.value)}
                    placeholder="ID de la aplicación Meta"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("meta_token")}
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                    value={form.tokenMetaPermanent}
                    onChange={(e) =>
                      handleChange("tokenMetaPermanent", e.target.value)
                    }
                    placeholder="Token permanente de Meta"
                  />
                </div>

                <h5 className="text-md font-semibold text-gray-600 mb-6 flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  Telegram
                </h5>
                <br />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("token_telegram")}
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                    value={form.tokenTelegram}
                    onChange={(e) =>
                      handleChange("tokenTelegram", e.target.value)
                    }
                    placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                  />
                </div>
            <button
              onClick={onConnectTelegram}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              {t("connnect")}
            </button>
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("chatid_telegram")} (Opcional)
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                    value={form.chatidTelegram}
                    onChange={(e) =>
                      handleChange("chatidTelegram", e.target.value)
                    }
                    placeholder="ID"
                  />
                </div> */}
<br />
          
                <div className="md:col-span-2 space-y-4">
                  <h4 className="font-medium text-gray-800">
                    Configuración de Webhook
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL del Webhook
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                      value={form.webhook}
                      onChange={(e) => handleChange("webhook", e.target.value)}
                      placeholder={t("webhook_url")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Token del Webhook
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                      value={form.tokenWebhook}
                      onChange={(e) =>
                        handleChange("tokenWebhook", e.target.value)
                      }
                      placeholder={t("webhook_token")}
                    />
                  </div>
                </div>
              </div>
            </div>
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
