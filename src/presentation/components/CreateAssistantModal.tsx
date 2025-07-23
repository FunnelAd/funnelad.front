import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "@/i18n";
import { Assistant } from "@/core/types/assistants/assistant";
import { telegramServices } from "@/core/services/telegramServices";
import { voicesService } from "@/core/services/voicesService";
import { IVoice } from "@/core/types/voices";
import VoiceSearchCombobox from "./VoiceSearchCombobox"; // Asegúrate que la ruta sea correcta
import toast from "react-hot-toast";

const TABS = [
  { key: "general", label: "general" },
  { key: "integrations", label: "integrations" },
];

const initialFormState = {
  name: "",
  phone: "",
  welcomeMsg: "",
  timeResponse: 30,
  assistensResponseP: 80,
  emotesUse: false,
  stylesUse: false,
  voice: { id: 0, name: "", gender: "unknown", provider: "" },
  amountAudio: 0,
  voiceResponse: false,
  autoTranscribe: false,
  idPhoneNumber: "",
  idWppBusinessAccount: "",
  idMetaApp: "",
  appSecretMeta: "",
  tokenMetaPermanent: "",
  webhook: "",
  tokenWebhook: "",
  tokenTelegram: "",
  chatidTelegram: "",
  prompt: "",
  active: true,
  trainingType: "predefined",
  selectedModel: "",
  audioEnabled: false,
};

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
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<any>(initialFormState);
  const modalRef = useRef<HTMLDivElement>(null);

  const [availableVoices, setAvailableVoices] = useState<IVoice[]>([]);
  const [loadingVoices, setLoadingVoices] = useState(false);
  const [testingVoice, setTestingVoice] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string>("all");

  const predefinedModels = [
    {
      id: "sales_assistant",
      name: "Asistente de Ventas",
      description: "Especializado en convertir leads y cerrar ventas",
      prompt:
        "Eres un asistente experto en ventas con más de 10 años de experiencia. Tu objetivo principal es ayudar a los clientes a encontrar el producto perfecto para sus necesidades y guiarlos hacia la compra. Eres persuasivo pero no agresivo, empático y siempre enfocado en el beneficio del cliente.",
    },
    {
      id: "customer_support",
      name: "Soporte al Cliente",
      description: "Resuelve problemas y brinda asistencia técnica",
      prompt:
        "Eres un especialista en atención al cliente altamente capacitado. Tu misión es resolver cualquier problema, duda o consulta que tengan los usuarios de manera rápida y efectiva. Eres paciente, comprensivo y siempre buscas la mejor solución para cada situación.",
    },
    {
      id: "appointment_scheduler",
      name: "Agendador de Citas",
      description: "Gestiona y programa citas de manera eficiente",
      prompt:
        "Eres un asistente especializado en la gestión y programación de citas. Tu trabajo es ayudar a los clientes a encontrar el horario perfecto, confirmar disponibilidad y asegurar que toda la información necesaria esté completa para cada cita.",
    },
    {
      id: "lead_qualifier",
      name: "Calificador de Leads",
      description: "Identifica y califica prospectos potenciales",
      prompt:
        "Eres un experto en calificación de leads con gran habilidad para identificar oportunidades de negocio. Tu objetivo es hacer las preguntas correctas para entender las necesidades del prospecto y determinar su nivel de interés y capacidad de compra.",
    },
    {
      id: "product_advisor",
      name: "Asesor de Productos",
      description: "Proporciona información detallada sobre productos",
      prompt:
        "Eres un consultor experto en productos con conocimiento profundo de todas las características, beneficios y casos de uso. Tu misión es educar a los clientes sobre los productos disponibles y ayudarles a tomar decisiones informadas.",
    },
  ];

  useEffect(() => {
    const loadVoices = async () => {
      setLoadingVoices(true);
      try {
        const voices = await voicesService.getAvailableVoices();
        setAvailableVoices(voices);
      } catch (error) {
        console.error("Error loading voices:", error);
      } finally {
        setLoadingVoices(false);
      }
    };

    if (isOpen) {
      if (isEditing && assistant) {
        const assistantData = { ...initialFormState, ...assistant };
        const modelFromPrompt = predefinedModels.find(
          (m) => m.prompt === assistant.prompt
        );

        assistantData.selectedModel = modelFromPrompt?.id || "";
        assistantData.trainingType = modelFromPrompt ? "predefined" : "custom";

        setForm(assistantData);
      } else {
        setForm(initialFormState);
      }
      loadVoices();
    }
  }, [assistant, isEditing, isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
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

  const onConnectTelegram = async () => {
    if (form.tokenTelegram) {
      setIsLoading(true);
      const toastId = toast.loading("Enviando datos...");
      try {
        const res = await telegramServices.connectTelegramWebhook(
          form.tokenTelegram
        );
        // console.log("respuesta: ", res)
        if (res.ok === true)
          toast.success("Datos enviados con éxito", { id: toastId });
        else toast.error("Ocurrió un error", { id: toastId });
      } catch (error) {
        console.log(error);
        toast.error("Ocurrió un error", { id: toastId });
      }

      setIsLoading(false);
    } else {
      // toast.success('Operación exitosa');
      toast.error("Token no valido");
      // toast.loading('Cargando...');
    }
  };

  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const modelId = e.target.value;
    const selectedModel = predefinedModels.find(
      (model) => model.id === modelId
    );
    handleChange("selectedModel", modelId);
    handleChange("prompt", selectedModel?.prompt || "");
  };

  const handleSubmit = () => {
    console.log(form);

    // 1. Nombre
    if (!form.name.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }
    // 2. Teléfono (ej. mínimo 7 dígitos, solo números y opcional + prefijo)
    const phoneRegex = /^\+?\d{7,15}$/;
    if (!phoneRegex.test(form.phone)) {
      toast.error("Ingresa un teléfono válido (solo números, 7–15 dígitos)");
      return;
    }
    // 3. Prompt
    if (!form.prompt.trim()) {
      toast.error("El prompt es obligatorio");
      return;
    }

    onSave(form);
    onClose();
  };

  const handleTestVoice = async (voiceId: string) => {
    // if (!voiceId) return;
    // setTestingVoice(voiceId);
    // try {
    //   const sampleUrl = await voicesService.testVoice(voiceId);
    //   console.log("Voice sample URL:", sampleUrl);
    //   alert("Reproduciendo muestra de voz...");
    // } catch (error) {
    //   console.error("Error testing voice:", error);
    // } finally {
    //   setTestingVoice(null);
    // }
  };

  if (!isOpen) return null;

  const filteredVoices =
    selectedProvider === "all"
      ? availableVoices
      : availableVoices.filter(
          (voice) =>
            voice.provider.toLowerCase() === selectedProvider.toLowerCase()
        );

  const selectedModelData = predefinedModels.find(
    (m) => m.id === form.selectedModel
  );

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
                      id="name"
                      type="text"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      required
                      minLength={2}
                      pattern="[A-Za-zÀ-ÿ\s]+"
                      title="Solo letras y espacios, mínimo 2 caracteres"
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  {/* Este campo no estaba en la versión anterior, se ha restaurado */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      required
                      pattern="^\+?\d{7,15}$"
                      title="Solo números, opcional +, 7-15 dígitos"
                      className="w-full border px-3 py-2 rounded"
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
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tipo de entrenamiento
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="trainingType"
                        value="predefined"
                        checked={form.trainingType === "predefined"}
                        onChange={(e) =>
                          handleChange("trainingType", e.target.value)
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 font-medium">
                        Modelos Predeterminados
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="trainingType"
                        value="custom"
                        checked={form.trainingType === "custom"}
                        onChange={(e) =>
                          handleChange("trainingType", e.target.value)
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 font-medium">
                        Entrenamiento Personalizado
                      </span>
                    </label>
                  </div>
                </div>
                {form.trainingType === "predefined" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Seleccionar modelo
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                        value={form.selectedModel}
                        onChange={handleModelChange}
                      >
                        <option value="">
                          Selecciona un modelo predeterminado
                        </option>
                        {predefinedModels.map((model) => (
                          <option key={model.id} value={model.id}>
                            {model.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {selectedModelData && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">
                          {selectedModelData.name}
                        </h4>
                        <p className="text-sm text-blue-700 mb-3">
                          {selectedModelData.description}
                        </p>
                        <div className="bg-white rounded p-3 border border-blue-200">
                          <p className="text-xs font-medium text-gray-600 mb-1">
                            Vista previa del prompt:
                          </p>
                          <p className="text-sm text-gray-800 line-clamp-3">
                            {selectedModelData.prompt}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {form.trainingType === "custom" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instrucciones y personalidad del asistente
                    </label>
                    <textarea
                      id="prompt"
                      name="prompt"
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 resize-y"
                      placeholder="Ej: Eres un asistente amigable y experto en ventas..."
                      value={form.prompt}
                      onChange={(e) => {
                        handleChange("prompt", e.target.value);
                        handleChange("selectedModel", ""); // Desseleccionar modelo si se personaliza el prompt
                      }}
                    />
                  </div>
                )}
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

                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    id="audioEnabled"
                    checked={form.audioEnabled}
                    onChange={(e) =>
                      handleChange("audioEnabled", e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="audioEnabled"
                    className="text-sm font-medium text-gray-700"
                  >
                    Activar audio (opcional)
                  </label>
                </div>
                {form.audioEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("audio_voice")}
                      </label>
                      {loadingVoices ? (
                        <div className="flex items-center justify-center p-4 border border-gray-300 rounded-lg bg-white">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                          <span className="ml-2 text-gray-600">
                            Cargando voces...
                          </span>
                        </div>
                      ) : (
                        <VoiceSearchCombobox
                          voices={filteredVoices}
                          selectedValue={form.voice}
                          onSelect={(selectedVoice) =>
                            handleChange("voice", selectedVoice)
                          }
                        />
                      )}
                    </div>
                    {form.voice?.id ? (
                      <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">
                          Voz seleccionada
                        </h4>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                form.voice.gender === "male"
                                  ? "bg-blue-400"
                                  : form.voice.gender === "female"
                                  ? "bg-pink-400"
                                  : "bg-gray-400"
                              }`}
                            />
                            <span className="font-medium text-blue-900">
                              {form.voice.name}
                            </span>
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                              {form.voice.provider}
                            </span>
                          </div>
                          <button
                            onClick={() => handleTestVoice(form.voice.id)}
                            disabled={testingVoice === form.voice.id}
                            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
                          >
                            {testingVoice === form.voice.id
                              ? "Probando..."
                              : "Probar voz"}
                          </button>
                        </div>
                      </div>
                    ) : null}
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
                      <p className="mt-1 text-xs text-gray-500">
                        Número máximo de mensajes de audio por conversación
                      </p>
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
                )}
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

              <h5 className="text-md font-semibold text-gray-600 mb-4 flex items-center gap-3 border-b pb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.386 1.026A.5.5 0 0 1 12 1.5v13a.5.5 0 0 1-.614.474l-4.524-2.093-4.524 2.093A.5.5 0 0 1 1.5 14.5v-13a.5.5 0 0 1 .614-.474l4.524 2.093zM2 2.252v11.13l3.927-1.825a.5.5 0 0 1 .446 0l4.244 1.964V2.252l-3.927 1.825a.5.5 0 0 1-.446 0z" />
                </svg>
                Meta
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("whatsapp_number")}
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={form.tokenMetaPermanent}
                    onChange={(e) =>
                      handleChange("tokenMetaPermanent", e.target.value)
                    }
                    placeholder="Token permanente de Meta"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    App Secret
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={form.appSecret}
                    onChange={(e) => handleChange("appSecret", e.target.value)}
                    placeholder="App Secret de tu aplicación Meta"
                  />
                </div>
              </div>

              <br />

              <h5 className="text-md font-semibold text-gray-600 mb-4 flex items-center gap-3 border-b pb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.16.123-1.475-.517-2.043-1.177-2.152-1.224-.21-4.224.45-5.5.94z" />
                </svg>
                Telegram
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                <div className="flex items-end gap-2">
                  <div className="flex-grow">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("token_telegram")}
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      value={form.tokenTelegram}
                      onChange={(e) =>
                        handleChange("tokenTelegram", e.target.value)
                      }
                      placeholder="123456:ABC-DEF..."
                    />
                  </div>
                  <button
                    onClick={onConnectTelegram}
                    disabled={isLoading || !form.tokenTelegram}
                    className={`
            px-4 py-2 h-10 border border-gray-300 rounded-lg text-gray-700 
            hover:bg-gray-50 whitespace-nowrap
            ${isLoading ? "cursor-not-allowed opacity-50" : ""}
          `}
                  >
                    {isLoading ? (
                      // Spinner SVG usando Tailwind animate-spin
                      <svg
                        className="animate-spin h-5 w-5 mx-auto"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                    ) : (
                      t("connect")
                    )}
                  </button>
                </div>
              </div>

              <h5 className="text-md font-semibold text-gray-600 mb-4 flex items-center gap-3 border-b pb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M4.182 1.223a.5.5 0 0 1 .536.078l.25.292c.16.188.243.44.195.688l-.226 1.13a.5.5 0 0 1-.588.42l-1.147-.23a.5.5 0 0 0-.533.262l-.25.5a.5.5 0 0 0 .042.585l1.002 1.114a.5.5 0 0 0 .633.102l1.1-.44a.5.5 0 0 1 .6-.053l.25.292a.5.5 0 0 0 .693-.117l.95-1.329a.5.5 0 0 0-.053-.6l-1.1-.917a.5.5 0 0 1-.078-.536l.25-.417a.5.5 0 0 0-.117-.693l-1.05-.7a.5.5 0 0 0-.585.042l-.5.25a.5.5 0 0 1-.65-.106L5.35 1.429a.5.5 0 0 0-.262-.533l-1.042-.521a.5.5 0 0 1-.42.588l1.13.226c.248.048.5-.034.688-.195zm7.364 1.342a.5.5 0 0 1 .6.053l1.1.917c.16.133.19.358.078.536l-.25.417a.5.5 0 0 0 .117.693l1.05.7a.5.5 0 0 0 .585-.042l.5-.25a.5.5 0 0 1 .65.106l.586.976a.5.5 0 0 0 .262.533l1.042.521a.5.5 0 0 1-.42-.588l-1.13-.226a.5.5 0 0 0-.688.195l-.25.292a.5.5 0 0 1-.536.078l-1.147-.573a.5.5 0 0 0-.533.262l-.25.5a.5.5 0 0 0 .042.585l1.002 1.114a.5.5 0 0 0 .633.102l1.1-.44a.5.5 0 0 1 .6-.053l.25.292a.5.5 0 0 0 .693-.117l.95-1.329a.5.5 0 0 0-.053-.6l-1.1-.917a.5.5 0 0 1-.078-.536l.25-.417a.5.5 0 0 0-.117-.693l-1.05-.7a.5.5 0 0 0-.585.042l-.5.25a.5.5 0 0 1-.65-.106l-.586-.976a.5.5 0 0 0-.262-.533l-1.042-.521a.5.5 0 0 1 .588.42l.226 1.13a.5.5 0 0 0 .42.588zM4.62 8.153a.5.5 0 0 1 .536.078l.25.292c.16.188.243.44.195.688l-.226 1.13a.5.5 0 0 1-.588.42l-1.147-.23a.5.5 0 0 0-.533.262l-.25.5a.5.5 0 0 0 .042.585l1.002 1.114a.5.5 0 0 0 .633.102l1.1-.44a.5.5 0 0 1 .6-.053l.25.292a.5.5 0 0 0 .693-.117l.95-1.329a.5.5 0 0 0-.053-.6l-1.1-.917a.5.5 0 0 1-.078-.536l.25-.417a.5.5 0 0 0-.117-.693l-1.05-.7a.5.5 0 0 0-.585.042l-.5.25a.5.5 0 0 1-.65-.106l-.586-.976a.5.5 0 0 0-.262-.533l-1.042-.521a.5.5 0 0 1-.42.588l1.13.226c.248.048.5-.034.688-.195z" />
                </svg>
                Configuración de Webhook
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL del Webhook
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={form.tokenWebhook}
                    onChange={(e) =>
                      handleChange("tokenWebhook", e.target.value)
                    }
                    placeholder={t("webhook_token")}
                  />
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
              {isEditing ? t("save_changes") : t("save_assistant")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
