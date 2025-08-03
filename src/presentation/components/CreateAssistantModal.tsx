import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useModal } from "@/core/hooks/useModal";
import { CreateAssistantData } from "@/core/types/assistant";
import toast from "react-hot-toast";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";

const STEPS = [
  { id: 1, label: 'general' },
  { id: 2, label: 'channels' },
  { id: 3, label: 'prompt' },
  { id: 4, label: 'configuration' },
  { id: 5, label: 'voice' },
];

// Añadimos atributos para autocompletar campos
const AGENTS = [
  {
    id: 'sales',
    title: 'Agente Ventas',
    description: 'Impulsa tus ventas con respuestas persuasivas y personalizadas.',
    promptTemplate: 'Eres un agente de ventas enfocado en cerrar tratos con lenguaje persuasivo.',
    communicationStyle: 'formal',
    emojiUsage: 'low',
    creativity: 70,
    behavior: 'Prioriza destacar beneficios del producto y llamar a la acción.',
  },
  {
    id: 'support',
    title: 'Soporte',
    description: 'Responde consultas técnicas y soporte al cliente de forma clara.',
    promptTemplate: 'Eres un agente de soporte técnico que explica pasos y soluciona problemas.',
    communicationStyle: 'formal',
    emojiUsage: 'none',
    creativity: 40,
    behavior: 'Explica soluciones paso a paso con paciencia.',
  },
  {
    id: 'customer',
    title: 'Atención al Cliente',
    description: 'Atiende clientes con un tono amigable y empático.',
    promptTemplate: 'Eres un agente de atención al cliente que escucha y empatiza.',
    communicationStyle: 'friendly',
    emojiUsage: 'moderate',
    creativity: 50,
    behavior: 'Responde con empatía y resolviendo dudas rápidamente.',
  },
  {
    id: 'custom',
    title: 'Personalizado',
    description: 'Define tu propio prompt para casos especiales.',
    promptTemplate: '',
    communicationStyle: '',
    emojiUsage: '',
    creativity: 50,
    behavior: '',
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
    _id: "",
    name: "",
    prompt: "",
    description: "",
    responseTime: 30,
    isActive: true,
    responseType: 80,
    useEmojis: false,
    useStyles: false,
    voiceResponse: false,
    audioVoice: "",
    audioCount: 0,
    channels: ["whatsapp"],
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
  });
  const [errors, setErrors] = useState<Record<string, string>>({});


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




  useEffect(() => {
    if (assistant && isEditing) setForm((prev) => ({ ...prev, ...assistant }));
  }, [assistant, isEditing]);

  const handleChange = (field: keyof CreateAssistantData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!form.name.trim()) newErrors.name = t("El nombre es obligatorio");
      if (!form.model) newErrors.model = t("Selecciona un modelo");
    }
    if (step === 3 && !form.agentType) {
      newErrors.agentType = t("Selecciona un agente");
    }
    if (step === 3 && form.agentType === 'custom' && !form.agentPrompt.trim()) {
      newErrors.agentPrompt = t("Escribe un prompt personalizado");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const next = () => {
    if (step < STEPS.length) {
      if (!validateStep()) return;
      setStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const back = () => step > 1 && setStep((prev) => prev - 1);

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error(t("El nombre es obligatorio"));
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
            {isEditing ? t("edit_assistant") : t("new_assistant")}
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
                {s.id < step ? <Check size={16} /> : s.id}
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
                  {t("assistant_name")} *
                </label>
                <input
                  type="text"
                  placeholder={t("Ej: Asistente de Ventas") as string}
                  value={form.name}
                  onChange={e => handleChange('name', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-yellow-400"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Model */}
              <div>
                <label className="block mb-1 text-sm font-medium text-white">
                  {t("modelo_ia")} *
                </label>
                <select
                  value={form.model}
                  onChange={e => handleChange('model', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-yellow-400"
                >
                  <option value="">{t("Selecciona modelo")}</option>
                  <option value="gpt-4">GPT-4 (Recomendado)</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="claude">Claude</option>
                </select>
                {errors.model && <p className="mt-1 text-sm text-red-500">{errors.model}</p>}
              </div>

              {/* Welcome */}
              <div>
                <label className="block mb-1 text-sm font-medium text-white">
                  {t("welcome_message")} *
                </label>
                <input
                  type="text"
                  placeholder={t("¡Hola! ¿En qué puedo ayudarte hoy?") as string}
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
                  placeholder={t("Descricion del agente...") as string}
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
                    {t("response_time")} (s)
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={120}
                    value={form.responseTime}
                    onChange={e => handleChange('responseTime', Number(e.target.value))}
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-yellow-400"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-white">
                    {t("status")}
                  </label>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400">{t("inactive")}</span>
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
                    <span className="text-gray-400">{t("active")}</span>
                  </div>
                </div>
              </div>
            </div>
          )}


          {step === 2 && (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {['whatsapp', 'instagram', 'webchat', 'messenger', 'email', 'phone'].map(ch => (
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
                      <span className="text-2xl">{ch === 'whatsapp' ? '💬' : ch === 'instagram' ? '📷' : ch === 'webchat' ? '🌐' : ch === 'messenger' ? '📘' : ch === 'email' ? '📧' : '📞'}</span>
                      <span className="capitalize text-white font-medium">{t(ch)}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-white mb-2">{t("Selecciona un agente")} *</label>
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
                          placeholder={t("Escribe el prompt personalizado aquí...") as string}
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
          {/* Step 3 - Configuration */}
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

          {/* Step 4 - Voice */}
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
                  <label className="block text-sm font-medium text-white mb-2">
                    {t("select_voice")} *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {['carlos', 'sofia', 'maria'].map(v => (
                      <label key={v} className="cursor-pointer">
                        <input type="radio" name="voiceSelection" value={v} className="sr-only peer"
                          checked={form.voiceSelection === v}
                          onChange={() => handleChange('voiceSelection', v)}
                        />
                        <div className="p-4 border-2 rounded-lg text-center peer-checked:border-yellow-400 peer-checked:bg-gray-800 transition-all">
                          <span className="capitalize text-white font-medium">{t(v)}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.voiceSelection && <p className="mt-1 text-sm text-red-500">{errors.voiceSelection}</p>}

                  <div>
                    <label className="block mb-1 text-sm font-medium text-white">
                      {t("voice_tone")} ({form.voiceTemperature}%)
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={form.voiceTemperature}
                      onChange={e => handleChange('voiceTemperature', Number(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </>
              )}
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
