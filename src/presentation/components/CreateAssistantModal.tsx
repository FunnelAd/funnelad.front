import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useModal } from "@/core/hooks/useModal";
import { CreateAssistantData } from "@/core/types/assistant";
import toast from "react-hot-toast";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaGlobe, FaFacebookMessenger, FaEnvelope, FaPhone, FaTelegram } from 'react-icons/fa';
import { IVoice } from "@/core/types/voices";
import VoiceDropdown from "./VoiceDropdown ";
import { ItelegramAccount } from "@/core/types/telegram";
import { IMetaAccount } from "@/core/types/meta";
import { integrationService } from "@/core/services/integrationService";
import { Integration } from "@/core/types/integration";


const STEPS = [
  { id: 1, label: 'general' },
  { id: 2, label: 'channels' },
  { id: 3, label: 'prompt' },
  { id: 4, label: 'configuration' },
  { id: 5, label: 'voice' },
  { id: 6, label: 'integraciones' },
  // { id: 7, label: 'telegram' },
  // { id: 8, label: 'email' },
];

// Añadimos atributos para autocompletar campos
const AGENTS = [
  {
    id: 'sales',
    title: 'Sales Agent',
    description: 'Boost your sales with persuasive and personalized responses.',
    promptTemplate: 'You are a sales agent focused on closing deals using persuasive language.',
    communicationStyle: 'formal',
    emojiUsage: 'low',
    creativity: 70,
    behavior: 'Prioritize highlighting product benefits and calling to action.',
  },
  {
    id: 'support',
    title: 'Support',
    description: 'Answer technical and customer support queries clearly.',
    promptTemplate: 'You are a technical support agent who explains steps and solves problems.',
    communicationStyle: 'formal',
    emojiUsage: 'none',
    creativity: 40,
    behavior: 'Explain solutions step-by-step with patience.',
  },
  {
    id: 'customer',
    title: 'Customer Service',
    description: 'Assist customers with a friendly and empathetic tone.',
    promptTemplate: 'You are a customer service agent who listens and empathizes.',
    communicationStyle: 'friendly',
    emojiUsage: 'moderate',
    creativity: 50,
    behavior: 'Respond with empathy and resolve questions quickly.',
  },
  {
    id: 'repair',
    title: 'Customer Service',
    description: 'Assist customers with a friendly and empathetic tone.',
    promptTemplate: 'You are a customer service agent who listens and empathizes.',
    communicationStyle: 'friendly',
    emojiUsage: 'moderate',
    creativity: 50,
    behavior: 'Respond with empathy and resolve questions quickly.',
  },
  {
    id: 'customeer',
    title: 'Customer Service',
    description: 'Assist customers with a friendly and empathetic tone.',
    promptTemplate: 'You are a customer service agent who listens and empathizes.',
    communicationStyle: 'friendly',
    emojiUsage: 'moderate',
    creativity: 50,
    behavior: 'Respond with empathy and resolve questions quickly.',
  },
  {
    id: 'custom',
    title: 'Custom',
    description: 'Define your own prompt for special cases.',
    promptTemplate: '',
    communicationStyle: '',
    emojiUsage: '',
    creativity: 50,
    behavior: '',
  }
];

const SAMPLE_VOICES: IVoice[] = [
  {
    id: 'carlos-openai',
    name: 'Carlos',
    gender: 'male',
    language: 'Spanish (Spain)',
    provider: 'openai',
    sample_url: 'https://example.com/carlos-sample.mp3'
  },
  {
    id: 'sofia-elevenlabs',
    name: 'Sofia',
    gender: 'female',
    language: 'Spanish (Mexico)',
    provider: 'elevenlabs',
    sample_url: 'https://example.com/sofia-sample.mp3'
  },
  {
    id: 'maria-azure',
    name: 'María',
    gender: 'female',
    language: 'Spanish (Argentina)',
    provider: 'azure',
    sample_url: 'https://example.com/maria-sample.mp3'
  },
  {
    id: 'diego-google',
    name: 'Diego',
    gender: 'male',
    language: 'Spanish (Colombia)',
    provider: 'google',
    sample_url: 'https://example.com/diego-sample.mp3'
  },
  {
    id: 'ana-aws',
    name: 'Ana',
    gender: 'female',
    language: 'Spanish (Peru)',
    provider: 'aws',
    sample_url: 'https://example.com/ana-sample.mp3'
  },
  {
    id: 'alex-openai',
    name: 'Alex',
    gender: 'unknown',
    language: 'Spanish (Chile)',
    provider: 'openai'
  }
];


export default function CreateAssistantModalModern({
  onSave,
  assistant,
  isEditing = false,
}: {
  onSave: (data: CreateAssistantData) => void;
  assistant?: Partial<CreateAssistantData>;
  isEditing?: boolean;
}) {
  const { t } = useTranslation();
  const { hideModal } = useModal();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<CreateAssistantData>({
    name: "",
    prompt: "",
    description: "",
    responseTime: 15,
    isActive: true,
    responseType: 80,
    useEmojis: false,
    useStyles: false,
    voiceResponse: false,
    audioVoice: "",
    audioCount: 0,
    channels: [],
    communicationStyle: "formal",
    emojiUsage: "moderate",
    creativity: 50,
    voiceSelection: "carlos",
    voiceTemperature: 30,
    callDirection: "bidirectional",
    welcomeMessage: "",
    model: "gpt-4",
    phone: "",
    idBusiness: "",
    createBy: "", // Ojo al typo que espera el backend
    welcomeMsg: "",
    welcomeTemplateId: "",
    whatsappNumber: "",
    whatsappBusinessId: "",
    voice: { id: 0, name: "", gender: "" },
    amountAudio: 0,
    idPhoneNumber: "",
    idWppBusinessAccount: "",
    idMetaApp: "",
    tokenMetaPermanent: "",
    webhook: "",
    tokenWebhook: "",
    tokenTelegram: "",
    chatidTelegram: "",
    lastUsed: "",
    webhookToken: "",
    webhookUrl: "",
    metaToken: "",
    metaAppId: "",
    agentType: "sales",
    agentPrompt: AGENTS.find(a => a.id === 'sales')!.promptTemplate,
    behaviorDescription: AGENTS.find(a => a.id === 'sales')!.behavior,
    selectedVoice: null as IVoice | null,
    metaAccount: '',
    telegramBot: '',
    emailNotifications: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Estados para las listas
  const [metaAccounts, setMetaAccounts] = useState<Integration[]>([]);
  const [telegramBots, setTelegramBots] = useState<Integration[]>([]);
  useEffect(() => {
    // Si hay assistant y estamos editando, actualiza el formulario
    if (assistant && isEditing) setForm((prev) => ({ ...prev, ...assistant }));
    fetchIntegrations();
  }, [assistant, isEditing]);



  // Función corregida para fetchIntegrations
  async function fetchIntegrations() {
    try {
      // Reemplaza esta URL por la de tu backend
      const data = await integrationService.getAllIntegrations("685f5b9ad9a068c851b44116");
      // console.log("Integrations data:", data);

      // Filtra y asigna las cuentas según el tipo
      if (Array.isArray(data)) {
        const filteredMeta = data.filter((acc: any) => acc.provider === 'Meta');
        const filteredTelegram = data.filter((acc: any) => acc.provider === 'Telegram');

        // Log de los datos filtrados ANTES de setear el estado
        console.log("Filtered Meta accounts Fetch:", filteredMeta);
        console.log("Filtered Telegram bots Fetch:", filteredTelegram);

        setMetaAccounts(filteredMeta);
        setTelegramBots(filteredTelegram);
      } else {
        console.warn("Data is not an array:", data);
        setMetaAccounts([]);
        setTelegramBots([]);
      }
    } catch (err) {
      console.error("Error loading integrations:", err);
      toast.error('Error loading integrations');
      // Resetea los estados en caso de error
      setMetaAccounts([]);
      setTelegramBots([]);
    }
  }
  // Al cambiar agente, autocompletamos
  const selectAgent = (agentId: string) => {
    const agent = AGENTS.find(a => a.id === agentId)!;
    setForm(prev => ({
      ...prev,
      agentType: agent.id,
      agentPrompt: agent.promptTemplate,
      communicationStyle: agent.communicationStyle,
      emojiUsage: agent.emojiUsage,
      creativity: agent.creativity,
      behaviorDescription: agent.behavior,
    }));
    setErrors(prev => ({ ...prev, agentType: '', agentPrompt: '' }));
  };





  const handleChange = (field: keyof CreateAssistantData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!form.name.trim()) newErrors.name = t("The name is required.");
    }
    if (step === 3 && !form.agentType) {
      newErrors.agentType = t("Select an agent");
    }
    if (step === 3 && form.agentType === 'custom' && !form.agentPrompt.trim()) {
      newErrors.agentPrompt = t("Write a custom prompt");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const next = () => {
    if (step < STEPS.length) {
      if (!validateStep()) return;
      if (form.agentType === 'custom' && step === 3) {
        setStep((prev) => prev + 1);
      }
      else if (form.agentType !== 'custom' && step === 3) {
        // setStep((prev) => prev * 0 + STEPS.length);
        setStep((prev) => prev * 0 + 5);
      }
      else {
        setStep((prev) => prev + 1);
      }
    } else {
      handleSubmit();
    }
  };

  const back = () => step > 1 && setStep((prev) => prev - 1);

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error(t("The name is required."));
      return;
    }
    onSave(form);
    hideModal();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/60" onClick={hideModal} />
      <div className="relative w-full max-w-3xl mx-auto p-8 bg-[#0f1a24] rounded-2xl shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-50">
            {isEditing ? t("edit_assistant") : "new_assistant"}
          </h2>
          <button
            onClick={hideModal}
            className="p-1 rounded-full hover:bg-gray-700 text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((s) => (
            <div key={s.id} className="flex-1 flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200 
                  ${s.id < step
                    ? 'bg-green-500 text-white'
                    : s.id === step
                      ? 'bg-yellow-400 text-gray-900'
                      : 'bg-gray-700 text-gray-400'
                  }`}
              >
                {s.id < step ? <Check size={8} /> : s.id}
              </div>
              {s.id < STEPS.length && (
                <div
                  className={`flex-1 h-px mx-2 transition-colors duration-200 
                    ${s.id < step ? 'bg-green-500' : 'bg-gray-700'}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto pr-4">
          {step === 1 && (
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block mb-1 text-sm font-medium text-white">
                  {("assistant_name")} *
                </label>
                <input
                  type="text"
                  placeholder={t("Ej: Sales Assistant") as string}
                  value={form.name}
                  onChange={e => handleChange('name', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-yellow-400"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Welcome */}
              <div>
                <label className="block mb-1 text-sm font-medium text-white">
                  {("welcome_message")} *
                </label>
                <input
                  type="text"
                  placeholder={t("Hello! How can I help you today?") as string}
                  value={form.welcomeMessage}
                  onChange={e => handleChange('welcomeMessage', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-yellow-400"
                />
                {errors.welcomeMessage && <p className="mt-1 text-sm text-red-500">{errors.welcomeMessage}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block mb-1 text-sm font-medium text-white">
                  {t("description")} *
                </label>
                <input
                  type="text"
                  placeholder={t("Agent description...") as string}
                  value={form.description}
                  onChange={e => handleChange('description', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-yellow-400"
                />
                {errors.welcomeMessage && <p className="mt-1 text-sm text-red-500">{errors.welcomeMessage}</p>}
              </div>

              {/* Time & Active */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-1 text-sm font-medium text-white">
                    {("response_time")} (s) - (min: 15s, max: 120s)
                  </label>
                  <input
                    type="number"
                    min={15}
                    max={120}
                    value={form.responseTime}
                    onChange={e => handleChange('responseTime', Number(e.target.value))}
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-yellow-400"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-white">
                    {("status")}
                  </label>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400">{("inactive")}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={e => handleChange('isActive', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-checked:bg-green-500 rounded-full transition-colors"></div>
                      <div className="absolute left-0.5 top-0.5 w-5 h–5 bg-white peer-checked:translate-x-5 rounded-full transition-transform" />
                    </label>
                    <span className="text-gray-400">{("active")}</span>
                  </div>
                </div>
              </div>
            </div>
          )}


          {step === 2 && (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {['whatsapp', 'telegram'].map(ch => (
                  <label key={ch} className="cursor-pointer">
                    <input
                      type="checkbox"
                      value={ch}
                      checked={form.channels.includes(ch)}
                      onChange={e => {
                        const val = e.target.value;
                        handleChange('channels', form.channels.includes(val)
                          ? form.channels.filter(c => c !== val)
                          : [...form.channels, val]
                        );
                      }}
                      className="sr-only peer"
                    />
                    <div className="p-4 border-2 rounded-lg flex flex-col items-center space-y-2 peer-checked:border-yellow-400 peer-checked:bg-gray-800 transition-all">
                      <span className="text-2xl text-white">
                        {
                          ch === 'whatsapp' ? <FaWhatsapp /> :
                            ch === 'instagram' ? <FaInstagram /> :
                              ch === 'webchat' ? <FaGlobe /> :
                                ch === 'messenger' ? <FaFacebookMessenger /> :
                                  ch === 'email' ? <FaEnvelope /> :
                                    ch === 'telegram' ? <FaTelegram /> :

                                      <FaPhone />
                        }
                      </span>
                      <span className="capitalize text-white font-medium">{t(ch)}</span>
                    </div>

                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-white mb-2">{t("Select an agent")} *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {AGENTS.map(agent => (
                  <label key={agent.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="agentType"
                      value={agent.id}
                      checked={form.agentType === agent.id}
                      onChange={() => selectAgent(agent.id)}
                      className="sr-only peer"
                    />
                    <div className="p-5 border-2 rounded-2xl bg-gray-800 hover:shadow-lg transition-all peer-checked:border-yellow-400 peer-checked:bg-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-1">{agent.title}</h3>
                      <p className="text-sm text-gray-300 mb-2">{agent.description}</p>
                      <div className="text-xs text-gray-400 mb-2">
                        <p>Uso de emojis: <span className="font-medium text-white capitalize">{agent.emojiUsage}</span></p>
                        <p>Estilo de comunicación: <span className="font-medium text-white capitalize">{agent.communicationStyle}</span></p>
                        <p>Comportamiento: <span className="font-medium text-white">{agent.behavior}</span></p>
                      </div>
                      {form.agentType === agent.id && agent.id === 'custom' && (
                        <textarea
                          placeholder={t("Enter your custom prompt here...") as string}
                          value={form.agentPrompt}
                          onChange={e => handleChange('agentPrompt', e.target.value)}
                          className="w-full mt-2 p-3 bg-gray-900 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-yellow-400"
                          rows={4}
                        />
                      )}
                    </div>
                  </label>
                ))}
              </div>
              {errors.agentType && <p className="mt-1 text-sm text-red-500">{errors.agentType}</p>}
              {errors.agentPrompt && <p className="mt-1 text-sm text-red-500">{errors.agentPrompt}</p>}
            </div>
          )}
          {/* Step 4 - Configuration */}
          {step === 4 && (
            <div className="space-y-6">
              <label className="block text-sm font-medium text-white mb-2">
                {t("communication_style")} *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['formal', 'informal', 'friendly'].map(style => (
                  <label key={style} className="cursor-pointer">
                    <input type="radio" name="communicationStyle" value={style} className="sr-only peer"
                      checked={form.communicationStyle === style}
                      onChange={() => handleChange('communicationStyle', style)}
                    />
                    <div className="p-4 border-2 rounded-lg text-center peer-checked:border-yellow-400 peer-checked:bg-gray-800 transition-all">
                      <span className="capitalize text-white font-medium">{t(style)}</span>
                    </div>
                  </label>
                ))}
              </div>
              {errors.communicationStyle && <p className="mt-1 text-sm text-red-500">{errors.communicationStyle}</p>}

              <label className="block text-sm font-medium text-white mb-2">
                {t("emoji_usage")} *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['none', 'low', 'moderate', 'high'].map(level => (
                  <label key={level} className="cursor-pointer">
                    <input type="radio" name="emojiUsage" value={level} className="sr-only peer"
                      checked={form.emojiUsage === level}
                      onChange={() => handleChange('emojiUsage', level)}
                    />
                    <div className="p-4 border-2 rounded-lg text-center peer-checked:border-yellow-400 peer-checked:bg-gray-800 transition-all">
                      <span className="capitalize text-white font-medium">{t(level)}</span>
                    </div>
                  </label>
                ))}
              </div>
              {errors.emojiUsage && <p className="mt-1 text-sm text-red-500">{errors.emojiUsage}</p>}

              <div>
                <label className="block mb-1 text-sm font-medium text-white">
                  {t("creativity")} ({form.creativity}%)
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={form.creativity}
                  onChange={e => handleChange('creativity', Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Step 5 - Voice */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-white">{t("voice_response")}</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.voiceResponse}
                    onChange={e => handleChange('voiceResponse', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-checked:bg-green-500 rounded-full transition-colors"></div>
                  <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white peer-checked:translate-x-5 rounded-full transition-transform" />
                </label>
              </div>

              {form.voiceResponse && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-white mb-3">
                      {t("select_voice")} *
                    </label>
                    <VoiceDropdown
                      voices={SAMPLE_VOICES}
                      selectedVoice={form.selectedVoice}
                      onSelect={(voice) => {
                        handleChange('selectedVoice', voice);
                        // También puedes mantener compatibilidad con el campo anterior
                        handleChange('voiceSelection', voice.name.toLowerCase());
                      }}
                      placeholder="Select a voice for your assistant"
                      className="mb-4"
                    />
                    {errors.voiceSelection && (
                      <p className="mt-1 text-sm text-red-500">{errors.voiceSelection}</p>
                    )}
                  </div>

                  {/* <div>
                    <label className="block mb-1 text-sm font-medium text-white">
                      {t("voice_tone")} ({form.voiceTemperature}%)
                    </label>
                    <div className="px-3 py-2 bg-gray-800 rounded-lg border border-gray-600">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={form.voiceTemperature}
                        onChange={e => handleChange('voiceTemperature', Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Monotono</span>
                        <span>Natural</span>
                        <span>Expresivo</span>
                      </div>
                    </div>
                  </div> */}

                  {/* Información adicional de la voz seleccionada */}
                  {form.selectedVoice && (
                    <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                      <h4 className="text-sm font-medium text-white mb-2">Voice information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Name:</span>
                          <span className="text-white">{form.selectedVoice.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Lenguaje:</span>
                          <span className="text-white">{form.selectedVoice.language}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Provider:</span>
                          <span className="text-white capitalize">{form.selectedVoice.provider}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Gender:</span>
                          <span className="text-white capitalize">{form.selectedVoice.gender}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

            </div>
          )}

          {/* Step 6 - Whatsapp Meta */}

          {step === 6 && (

            <div className="space-y-6">

              {/* Integración con Meta */}
              {Array.isArray(form.channels) && form.channels.includes("whatsapp") && (
                <div>
                  <label className="block mb-1 text-sm font-medium text-white">
                    {t("meta_account")} *
                  </label>
                  {metaAccounts && metaAccounts.length > 0 ? (
                    <select
                      value={form.metaAccount}
                      onChange={e => handleChange('metaAccount', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-yellow-400"
                    >
                      <option value="">{t("Select Meta account")}</option>
                      {metaAccounts.map((account) => (
                        <option key={account._id} value={account._id}>
                          {account.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400">{t("There are no Meta accounts registered.")}</p>
                      <button
                        type="button"
                        onClick={() => window.open('/integrations', '_blank')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                      >
                        {t("Connect Meta account")}
                      </button>
                    </div>
                  )}
                  {errors.metaAccount && <p className="mt-1 text-sm text-red-500">{errors.metaAccount}</p>}
                </div>
              )}
              {/* Integración con Telegram */}

              {Array.isArray(form.channels) && form.channels.includes("telegram") && (

                <div>
                  <label className="block mb-1 text-sm font-medium text-white">
                    {t("telegram_bot")} *
                  </label>
                  {telegramBots && telegramBots.length > 0 ? (
                    <select
                      value={form.telegramBot}
                      onChange={e => handleChange('telegramBot', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-yellow-400"
                    >
                      <option value="">{t("Select Telegram bot")}</option>
                      {telegramBots.map((bot) => (
                        <option key={bot._id} value={bot._id}>
                          {bot.name} -
                          {/* @{bot.username} */}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400">{t("There are no registered Telegram bots.")}</p>
                      <button
                        type="button"
                        onClick={() => window.open('/integrations/telegram/create', '_blank')}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                      >
                        {t("Create Telegram bot")}
                      </button>
                    </div>
                  )}
                  {errors.telegramBot && <p className="mt-1 text-sm text-red-500">{errors.telegramBot}</p>}
                </div>
              )}

              {/* Correo Electrónico */}
              <div>
                <label className="block mb-1 text-sm font-medium text-white">
                  {t("email_notifications")}
                </label>
                <input
                  type="email"
                  placeholder={t("correo@ejemplo.com") as string}
                  value={form.emailNotifications}
                  onChange={e => handleChange('emailNotifications', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-yellow-400"
                />
                <p className="mt-1 text-xs text-gray-400">{t("Optional: Receive email notifications")}</p>
                {errors.emailNotifications && <p className="mt-1 text-sm text-red-500">{errors.emailNotifications}</p>}
              </div>
            </div>



          )}


        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-700">
          <button
            onClick={back}
            disabled={step === 1}
            className="flex items-center space-x-2 text-gray-300 hover:text-gray-100 disabled:opacity-50"
          >
            <ChevronLeft size={18} />
            <span>{t("back")}</span>
          </button>
          <button
            onClick={next}
            className="flex items-center space-x-2 bg-yellow-400 text-gray-900 px-5 py-2 rounded-lg font-medium hover:bg-yellow-300"
          >
            <span>
              {step < STEPS.length ? t("continue") : t("finish")}
            </span>
            {step < STEPS.length ? <ChevronRight size={18} /> : null}
          </button>
        </div>
      </div>
    </div>
  );
}
