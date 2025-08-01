"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

// Definición de los pasos del onboarding
const STEPS = [
  {
    id: "welcome",
    title: "Es hora de dar vida a tu negocio",
    description:
      "Bienvenido a FunnelAd, donde transformamos tu presencia digital",
  },
  {
    id: "info",
    title: "Información general",
    description: "Cuéntanos sobre ti y tu negocio",
  },
  {
    id: "agent",
    title: "¿Qué tipo de agente deseas?",
    description:
      "Selecciona el tipo de asistente que mejor se adapte a tus necesidades",
  },
  {
    id: "text-channels",
    title: "Canales de comunicación",
    description: "Selecciona los canales donde operará tu agente de texto",
  },
  {
    id: "text-config",
    title: "Configuración del agente de texto",
    description: "Personaliza el comportamiento de tu asistente de texto",
  },
  {
    id: "voice-config",
    title: "Configuración del agente de voz",
    description: "Personaliza el comportamiento de tu asistente de voz",
  },
  {
    id: "confirmation",
    title: "Confirmación",
    description: "¡Todo listo para comenzar!",
  },
];

// Tipos de agentes disponibles
const AGENT_TYPES = [
  {
    id: "text",
    name: "AGENTE DE TEXTO",
    description: "Apto para responder mensajes en canales de texto.",
    icon: "/images/onboarding/text-agent-icon.svg",
    bgColor: "bg-[#002639]",
  },
  {
    id: "voice",
    name: "AGENTE DE VOZ",
    description: "Apto para generar y recibir llamadas",
    icon: "/images/onboarding/voice-agent-icon.svg",
    bgColor: "bg-[#1D5A7A]",
  },
];

// Canales de comunicación para el agente de texto
const TEXT_CHANNELS = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: "/images/onboarding/whatsapp-icon.svg",
    description: "Mensajería instantánea más popular",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "/images/onboarding/instagram-icon.svg",
    description: "Mensajes directos en Instagram",
  },
  {
    id: "webchat",
    name: "Webchat",
    icon: "/images/onboarding/webchat-icon.svg",
    description: "Chat en tu sitio web",
  },
  {
    id: "messenger",
    name: "Messenger",
    icon: "/images/onboarding/messenger-icon.svg",
    description: "Chat de Facebook",
  },
  {
    id: "email",
    name: "Email",
    icon: "/images/onboarding/email-icon.svg",
    description: "Comunicación por correo electrónico",
  },
];

// Opciones de configuración para el agente de texto
const TEXT_CONFIG_OPTIONS = {
  useEmojis: [
    {
      id: "none",
      name: "Sin emojis",
      description: "Comunicación formal sin emojis",
    },
    { id: "few", name: "Pocos emojis", description: "Uso ocasional de emojis" },
    {
      id: "moderate",
      name: "Uso moderado",
      description: "Balance entre formal y casual",
    },
    {
      id: "many",
      name: "Muchos emojis",
      description: "Comunicación casual y expresiva",
    },
  ],
  textStyle: [
    {
      id: "formal",
      name: "Formal",
      description: "Lenguaje profesional y estructurado",
    },
    {
      id: "casual",
      name: "Casual",
      description: "Lenguaje amigable y cercano",
    },
    {
      id: "technical",
      name: "Técnico",
      description: "Enfocado en detalles técnicos",
    },
    {
      id: "sales",
      name: "Ventas",
      description: "Orientado a conversiones y ventas",
    },
  ],
  modelTemperature: [
    {
      id: "0.2",
      name: "Baja",
      description: "Respuestas más predecibles y conservadoras",
    },
    {
      id: "0.5",
      name: "Media",
      description: "Balance entre creatividad y precisión",
    },
    {
      id: "0.8",
      name: "Alta",
      description: "Respuestas más creativas y variadas",
    },
  ],
};

// Voces disponibles para el agente de voz
const AVAILABLE_VOICES = [
  { name: "Carlos", voice_type: "masculine", id: "21ad5a61dwa65" },
  { name: "María", voice_type: "feminine", id: "32be7c82fgb76" },
  { name: "Alex", voice_type: "neutral", id: "43cf8d93hic87" },
  { name: "Sofía", voice_type: "feminine", id: "54dg9e04jid98" },
  { name: "Diego", voice_type: "masculine", id: "65eh0f15kie09" },
];

// Opciones de configuración para el agente de voz
const VOICE_CONFIG_OPTIONS = {
  voiceType: [
    {
      id: "male",
      name: "Voz masculina",
      description: "Tono grave y profesional",
    },
    {
      id: "female",
      name: "Voz femenina",
      description: "Tono cálido y amigable",
    },
    {
      id: "neutral",
      name: "Voz neutral",
      description: "Tono balanceado y versátil",
    },
  ],
  speechRate: [
    { id: "slow", name: "Lenta", description: "Habla pausada y clara" },
    { id: "medium", name: "Media", description: "Velocidad de habla estándar" },
    { id: "fast", name: "Rápida", description: "Habla ágil y dinámica" },
  ],
  callHandling: [
    {
      id: "inbound",
      name: "Recibir llamadas",
      description: "Solo responde llamadas entrantes",
    },
    {
      id: "outbound",
      name: "Realizar llamadas",
      description: "Solo realiza llamadas salientes",
    },
    {
      id: "both",
      name: "Ambas direcciones",
      description: "Recibe y realiza llamadas",
    },
  ],
};

const OnboardingForm: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  // Modificamos el estado para incluir todos los nuevos campos
  const [formData, setFormData] = useState({
    // Información general
    businessName: "",
    fullName: "",
    email: "",
    whatsapp: "",

    // Tipo de agente
    agentTypes: [] as string[],

    // Canales de texto
    textChannels: [] as string[],

    // Configuración del agente de texto
    textConfig: {
      useEmojis: "moderate",
      textStyle: "casual",
      modelTemperature: "0.5",
    },

    // Configuración del agente de voz
    voiceConfig: {
      voiceType: "female",
      voiceId: "",
      speechRate: "medium",
      callHandling: "both",
      temperature: 50, // Valor inicial del slider (50%)
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  // Determinar qué pasos mostrar según los agentes seleccionados
  const getVisibleSteps = () => {
    // Pasos básicos que siempre se muestran
    const visibleSteps = [STEPS[0], STEPS[1], STEPS[2]];

    // Pasos adicionales según los agentes seleccionados
    if (formData.agentTypes.includes("text")) {
      visibleSteps.push(STEPS[3]); // Canales de texto
      visibleSteps.push(STEPS[4]); // Configuración de texto
    }

    if (formData.agentTypes.includes("voice")) {
      visibleSteps.push(STEPS[5]); // Configuración de voz
    }

    // Añadir el paso de confirmación al final
    visibleSteps.push(STEPS[6]); // Paso de confirmación (índice 6)

    return visibleSteps;
  };

  // Obtener el índice real del paso actual en el array de pasos visibles
  const getVisibleStepIndex = () => {
    const visibleSteps = getVisibleSteps();
    const currentStepId = STEPS[currentStep].id;
    return visibleSteps.findIndex((step) => step.id === currentStepId);
  };

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Seleccionar tipo de agente
  const handleAgentSelect = (agentId: string) => {
    setFormData((prev) => {
      const currentAgentTypes = [...prev.agentTypes];

      // Si ya está seleccionado, lo quitamos; si no, lo añadimos
      if (currentAgentTypes.includes(agentId)) {
        return {
          ...prev,
          agentTypes: currentAgentTypes.filter((id) => id !== agentId),
        };
      } else {
        return {
          ...prev,
          agentTypes: [...currentAgentTypes, agentId],
        };
      }
    });

    if (errors.agentType) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.agentType;
        return newErrors;
      });
    }
  };

  // Seleccionar canales de texto
  const handleTextChannelSelect = (channelId: string) => {
    setFormData((prev) => {
      const currentChannels = [...prev.textChannels];

      if (currentChannels.includes(channelId)) {
        return {
          ...prev,
          textChannels: currentChannels.filter((id) => id !== channelId),
        };
      } else {
        return {
          ...prev,
          textChannels: [...currentChannels, channelId],
        };
      }
    });

    if (errors.textChannels) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.textChannels;
        return newErrors;
      });
    }
  };

  // Manejar cambios en la configuración del agente de texto
  const handleTextConfigChange = (option: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      textConfig: {
        ...prev.textConfig,
        [option]: value,
      },
    }));
  };

  // Manejar cambios en la configuración del agente de voz
  const handleVoiceConfigChange = (option: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      voiceConfig: {
        ...prev.voiceConfig,
        [option]: value,
      },
    }));
  };

  // Actualizamos la validación para verificar todos los pasos
  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      // Validación de información general
      if (!formData.businessName.trim())
        newErrors.businessName = "El nombre del negocio es requerido";
      if (!formData.fullName.trim())
        newErrors.fullName = "Tu nombre es requerido";
      if (!formData.email.trim()) {
        newErrors.email = "El correo electrónico es requerido";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "El correo electrónico no es válido";
      }
      if (!formData.whatsapp.trim())
        newErrors.whatsapp = "El teléfono de WhatsApp es requerido";
    } else if (currentStep === 2) {
      // Validación de tipo de agente
      if (formData.agentTypes.length === 0) {
        newErrors.agentType = "Debes seleccionar al menos un tipo de agente";
      }
    } else if (currentStep === 3 && formData.agentTypes.includes("text")) {
      // Validación de canales de texto
      if (formData.textChannels.length === 0) {
        newErrors.textChannels =
          "Debes seleccionar al menos un canal de comunicación";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Avanzar al siguiente paso
  const handleNext = () => {
    setDirection("right");
    if (currentStep === 0 || validateStep()) {
      const visibleSteps = getVisibleSteps();
      const currentVisibleIndex = getVisibleStepIndex();

      if (currentVisibleIndex < visibleSteps.length - 1) {
        // Encontrar el índice real del siguiente paso visible en STEPS
        const nextStepId = visibleSteps[currentVisibleIndex + 1].id;
        const nextStepIndex = STEPS.findIndex((step) => step.id === nextStepId);
        setCurrentStep(nextStepIndex);
      } else {
        // Solo llamar a handleSubmit si estamos en el último paso visible
        handleSubmit();
      }
    }
  };

  // Retroceder al paso anterior
  const handlePrevious = () => {
    setDirection("left");
    const visibleSteps = getVisibleSteps();
    const currentVisibleIndex = getVisibleStepIndex();

    if (currentVisibleIndex > 0) {
      // Encontrar el índice real del paso anterior visible en STEPS
      const prevStepId = visibleSteps[currentVisibleIndex - 1].id;
      const prevStepIndex = STEPS.findIndex((step) => step.id === prevStepId);
      setCurrentStep(prevStepIndex);
    }
  };

  // Enviar el formulario
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrors({}); // Limpiamos errores antes de enviar

    try {
      const response = await fetch(
        "http://localhost:3001/api/onboarding/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error en el envío del formulario");
      }

      const result = await response.json();
      console.log("✅ Respuesta del servidor:", result);

      alert("¡Formulario enviado exitosamente!");
      router.push("/gracias"); // o a donde quieras redirigir
    } catch (error: any) {
      console.error("❌ Error al enviar el formulario:", error);
      alert(error.message || "Error en el envío del formulario");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Variantes de animación para el carrusel
  const slideVariants = {
    enterRight: {
      x: 1000,
      opacity: 0,
    },
    enterLeft: {
      x: -1000,
      opacity: 0,
    },
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
    exitLeft: {
      x: -1000,
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
    exitRight: {
      x: 1000,
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  // Renderizar el paso actual
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col md:flex-row items-center justify-between gap-8 h-full"
          >
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Es hora de dar <span className="text-[#C9A14A]">vida</span> a tu
                negocio
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                FunnelAd te ayuda a automatizar tus ventas y atención al cliente
                con inteligencia artificial.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="px-8 py-4 bg-[#C9A14A] text-white font-medium rounded-md hover:bg-[#B8912A] transition-colors duration-300 flex items-center text-lg"
              >
                CONTINUAR
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </motion.button>
            </div>
            <div className="md:w-1/2">
              <motion.div
                initial={{ scale: 0.9, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#C9A14A]/30 to-transparent rounded-xl blur-xl animate-pulse"></div>
                <Image
                  src="/images/onboarding/welcome-illustration.png"
                  alt="FunnelAd - Automatiza tu negocio con IA"
                  width={600}
                  height={500}
                  className="w-full h-auto relative z-10"
                  priority
                />
              </motion.div>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="flex flex-col md:flex-row items-center gap-8 h-full"
          >
            <div className="md:w-2/5">
              <motion.div
                initial={{ scale: 0.9, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-400/30 to-transparent rounded-xl blur-xl animate-pulse"></div>
                <Image
                  src="/images/onboarding/business-info-illustration.png"
                  alt="Información de negocio"
                  width={400}
                  height={400}
                  className="w-full h-auto rounded-xl relative z-10"
                />
              </motion.div>
            </div>

            <div className="md:w-3/5">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Información general
              </h2>

              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label
                    htmlFor="businessName"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Nombre de negocio/empresa
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.businessName
                        ? "border-red-500"
                        : "border-[#C9A14A]"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-[#C9A14A] text-white bg-gray-700/80 backdrop-blur-sm`}
                  />
                  {errors.businessName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.businessName}
                    </p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Tu nombre
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.fullName ? "border-red-500" : "border-[#C9A14A]"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-[#C9A14A] text-white bg-gray-700/80 backdrop-blur-sm`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.fullName}
                    </p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.email ? "border-red-500" : "border-[#C9A14A]"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-[#C9A14A] text-white bg-gray-700/80 backdrop-blur-sm`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label
                    htmlFor="whatsapp"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Teléfono WhatsApp
                  </label>
                  <input
                    type="tel"
                    id="whatsapp"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.whatsapp ? "border-red-500" : "border-[#C9A14A]"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-[#C9A14A] text-white bg-gray-700/80 backdrop-blur-sm`}
                  />
                  {errors.whatsapp && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.whatsapp}
                    </p>
                  )}
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm text-gray-400 mt-2"
                >
                  El correo electrónico y el teléfono de WhatsApp son
                  fundamentales para enviarte notificaciones importantes sobre
                  tu agente.
                </motion.p>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="flex flex-col items-center h-full"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
              ¿Qué tipo de agente deseas?
            </h2>
            <p className="text-lg text-gray-300 mb-8 text-center max-w-2xl">
              Selecciona el tipo de asistente que mejor se adapte a tus
              necesidades. Puedes elegir uno o ambos.
            </p>

            {errors.agentType && (
              <p className="mb-4 text-red-500 font-medium">
                {errors.agentType}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
              {AGENT_TYPES.map((agent) => (
                <motion.div
                  key={agent.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAgentSelect(agent.id)}
                  className={`rounded-2xl p-8 cursor-pointer transition-all duration-300 h-full flex flex-col items-center ${
                    formData.agentTypes.includes(agent.id)
                      ? "bg-[#2A7DA1] ring-4 ring-[#C9A14A]"
                      : "bg-[#002639]"
                  }`}
                >
                  <div className="w-20 h-20 flex items-center justify-center rounded-full bg-white/10 mb-6">
                    <Image
                      src={agent.icon}
                      alt={agent.name}
                      width={48}
                      height={48}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {agent.name}
                  </h3>
                  <p className="text-gray-300 text-center">
                    {agent.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 3: // Canales de texto
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="flex flex-col items-center h-full"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
              Canales de comunicación
            </h2>
            <p className="text-lg text-gray-300 mb-8 text-center max-w-2xl">
              Selecciona los canales donde operará tu agente de texto
            </p>

            {errors.textChannels && (
              <p className="mb-4 text-red-500 font-medium">
                {errors.textChannels}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
              {TEXT_CHANNELS.map((channel) => (
                <motion.div
                  key={channel.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTextChannelSelect(channel.id)}
                  className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                    formData.textChannels.includes(channel.id)
                      ? "bg-[#C9A14A] text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10">
                      <Image
                        src={channel.icon}
                        alt={channel.name}
                        width={32}
                        height={32}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{channel.name}</h3>
                      <p className="text-sm opacity-80">
                        {channel.description}
                      </p>
                    </div>
                    {formData.textChannels.includes(channel.id) && (
                      <CheckCircleIcon className="w-6 h-6 ml-auto text-white" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 4: // Configuración del agente de texto
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="flex flex-col items-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4 text-center">
              Configuración del agente de texto
            </h2>
            <p className="text-sm md:text-base text-gray-300 mb-4 text-center max-w-2xl">
              Personaliza el comportamiento de tu asistente de texto
            </p>

            <div className="w-full max-w-4xl space-y-4 md:space-y-6">
              {/* Uso de emojis */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2 md:mb-3">
                  Uso de emojis
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                  {TEXT_CONFIG_OPTIONS.useEmojis.map((option) => (
                    <motion.div
                      key={option.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() =>
                        handleTextConfigChange("useEmojis", option.id)
                      }
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                        formData.textConfig.useEmojis === option.id
                          ? "bg-[#C9A14A] text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      <h4 className="font-bold text-sm">{option.name}</h4>
                      <p className="text-xs mt-1 opacity-80 hidden md:block">
                        {option.description}
                      </p>
                      {formData.textConfig.useEmojis === option.id && (
                        <CheckCircleIcon className="w-4 h-4 mt-1 text-white" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Estilo de texto */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2 md:mb-3">
                  Estilo de comunicación
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                  {TEXT_CONFIG_OPTIONS.textStyle.map((option) => (
                    <motion.div
                      key={option.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() =>
                        handleTextConfigChange("textStyle", option.id)
                      }
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                        formData.textConfig.textStyle === option.id
                          ? "bg-[#C9A14A] text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      <h4 className="font-bold text-sm">{option.name}</h4>
                      <p className="text-xs mt-1 opacity-80 hidden md:block">
                        {option.description}
                      </p>
                      {formData.textConfig.textStyle === option.id && (
                        <CheckCircleIcon className="w-4 h-4 mt-1 text-white" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Temperatura del modelo */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2 md:mb-3">
                  Creatividad de respuestas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
                  {TEXT_CONFIG_OPTIONS.modelTemperature.map((option) => (
                    <motion.div
                      key={option.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() =>
                        handleTextConfigChange("modelTemperature", option.id)
                      }
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                        formData.textConfig.modelTemperature === option.id
                          ? "bg-[#C9A14A] text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      <h4 className="font-bold text-sm">{option.name}</h4>
                      <p className="text-xs mt-1 opacity-80 hidden md:block">
                        {option.description}
                      </p>
                      {formData.textConfig.modelTemperature === option.id && (
                        <CheckCircleIcon className="w-4 h-4 mt-1 text-white" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 5: // Configuración del agente de voz
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="flex flex-col items-center h-full"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
              Configuración del agente de voz
            </h2>
            <p className="text-lg text-gray-300 mb-8 text-center max-w-2xl">
              Personaliza el comportamiento de tu asistente de voz
            </p>

            <div className="w-full max-w-4xl space-y-8">
              {/* Tipo de voz */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Tipo de voz
                </h3>
                <div className="relative w-full max-w-md">
                  <select
                    value={formData.voiceConfig.voiceId || ""}
                    onChange={(e) =>
                      handleVoiceConfigChange("voiceId", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-[#C9A14A] rounded-md focus:outline-none focus:ring-2 focus:ring-[#C9A14A] text-white bg-gray-700/80 backdrop-blur-sm appearance-none"
                  >
                    <option value="" disabled>
                      Selecciona una voz
                    </option>
                    {AVAILABLE_VOICES.map((voice) => (
                      <option key={voice.id} value={voice.id}>
                        {voice.name} (
                        {voice.voice_type === "masculine"
                          ? "Masculina"
                          : voice.voice_type === "feminine"
                          ? "Femenina"
                          : "Neutral"}
                        )
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-[#C9A14A]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Velocidad de habla */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Velocidad de habla
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {VOICE_CONFIG_OPTIONS.speechRate.map((option) => (
                    <motion.div
                      key={option.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        handleVoiceConfigChange("speechRate", option.id)
                      }
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                        formData.voiceConfig.speechRate === option.id
                          ? "bg-[#C9A14A] text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      <h4 className="font-bold">{option.name}</h4>
                      <p className="text-sm mt-1 opacity-80">
                        {option.description}
                      </p>
                      {formData.voiceConfig.speechRate === option.id && (
                        <CheckCircleIcon className="w-5 h-5 mt-2 text-white" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Manejo de llamadas */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Manejo de llamadas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {VOICE_CONFIG_OPTIONS.callHandling.map((option) => (
                    <motion.div
                      key={option.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        handleVoiceConfigChange("callHandling", option.id)
                      }
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                        formData.voiceConfig.callHandling === option.id
                          ? "bg-[#C9A14A] text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      <h4 className="font-bold">{option.name}</h4>
                      <p className="text-sm mt-1 opacity-80">
                        {option.description}
                      </p>
                      {formData.voiceConfig.callHandling === option.id && (
                        <CheckCircleIcon className="w-5 h-5 mt-2 text-white" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Temperatura del agente */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Temperatura del agente
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Formal</span>
                    <span>{formData.voiceConfig.temperature}%</span>
                    <span>Informal</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.voiceConfig.temperature}
                    onChange={(e) =>
                      handleVoiceConfigChange("temperature", e.target.value)
                    }
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#C9A14A]"
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    {formData.voiceConfig.temperature < 30
                      ? "Comunicación más formal y profesional"
                      : formData.voiceConfig.temperature < 70
                      ? "Balance entre formalidad y cercanía"
                      : "Comunicación más cercana e informal"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 6: // Confirmación
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="flex flex-col items-center h-full"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircleIcon className="w-14 h-14 text-white" />
              </motion.div>

              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                ¡Felicidades! Tus agentes están listos
              </h2>

              <div className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                <p className="mb-4">
                  Hemos configurado tus agentes para{" "}
                  <span className="text-[#C9A14A] font-semibold">
                    {formData.businessName}
                  </span>
                  .
                </p>

                <ul className="space-y-2 text-left mx-auto max-w-md">
                  {formData.agentTypes.includes("text") && (
                    <li className="flex items-center">
                      <span className="mr-2">•</span> Agente de texto para
                      responder mensajes
                    </li>
                  )}
                  {formData.agentTypes.includes("voice") && (
                    <li className="flex items-center">
                      <span className="mr-2">•</span> Agente de voz para
                      llamadas
                    </li>
                  )}
                </ul>

                <p className="mt-6">
                  Te enviaremos un correo a{" "}
                  <span className="text-[#C9A14A] font-semibold">
                    {formData.email}
                  </span>{" "}
                  con los detalles.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-4 bg-[#C9A14A] text-white font-medium rounded-md hover:bg-[#B8912A] transition-colors duration-300 flex items-center text-lg mx-auto"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    PROCESANDO...
                  </>
                ) : (
                  "COMENZAR A USAR FUNNELAD"
                )}
              </motion.button>
            </div>
          </motion.div>
        );

      default:
        return <div>Paso no encontrado</div>;
    }
  };

  // Indicadores de progreso
  const renderProgressIndicators = () => {
    return (
      <div className="flex justify-center space-x-2 mb-8">
        {STEPS.map((step, index) => (
          <motion.div
            key={step.id}
            className={`h-2 rounded-full ${
              currentStep === index ? "bg-[#C9A14A] w-8" : "bg-gray-600 w-4"
            } transition-all duration-300`}
            initial={false}
            animate={{
              width: currentStep === index ? 32 : 16,
              backgroundColor:
                currentStep === index
                  ? "#C9A14A"
                  : currentStep > index
                  ? "#8B7535"
                  : "#4B5563",
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001524] to-[#003049] text-white overflow-x-hidden">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        {/* Logo */}
        <div className="mb-6">
          <Image
            src="/images/logo.svg"
            alt="FunnelAd"
            width={150}
            height={40}
            className="h-10 w-auto"
          />
        </div>

        {/* Indicador de progreso */}
        <div className="mb-6">
          <div className="flex justify-center items-center space-x-2">
            {getVisibleSteps().map((step, index) => (
              <div
                key={step.id}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index <= getVisibleStepIndex()
                    ? "bg-[#C9A14A]"
                    : "bg-gray-600"
                } ${index === getVisibleStepIndex() ? "w-8" : "w-4"}`}
              />
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <div className="text-sm text-gray-400">
              Paso {getVisibleStepIndex() + 1} de {getVisibleSteps().length}
            </div>
          </div>
        </div>

        {/* Contenido principal con altura ajustable y scroll */}
        <div
          className="relative bg-[#001F2E]/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 mb-6 overflow-x-hidden"
          style={{
            minHeight: "400px",
            maxHeight: "calc(100vh - 250px)",
            overflowY: "auto",
          }}
        >
          <AnimatePresence initial={false} mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial={direction === "right" ? "enterRight" : "enterLeft"}
              animate="center"
              exit={direction === "right" ? "exitLeft" : "exitRight"}
              className="w-full"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Botones de navegación */}
        <div className="flex justify-between items-center">
          {getVisibleStepIndex() > 0 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrevious}
              className="px-6 py-3 bg-gray-700 text-white font-medium rounded-md hover:bg-gray-600 transition-colors duration-300 flex items-center"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              ATRÁS
            </motion.button>
          ) : (
            <div></div> // Espacio vacío para mantener el layout
          )}

          {getVisibleStepIndex() < getVisibleSteps().length - 1 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="px-6 py-3 bg-[#C9A14A] text-white font-medium rounded-md hover:bg-[#B8912A] transition-colors duration-300 flex items-center"
            >
              CONTINUAR
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;
