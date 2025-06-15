// Definición de los pasos del onboarding
export const STEPS = [
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
export const AGENT_TYPES = [
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
export const TEXT_CHANNELS = [
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
export const TEXT_CONFIG_OPTIONS = {
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
export const AVAILABLE_VOICES = [
  { name: "Carlos", voice_type: "masculine", id: "21ad5a61dwa65" },
  { name: "María", voice_type: "feminine", id: "32be7c82fgb76" },
  { name: "Alex", voice_type: "neutral", id: "43cf8d93hic87" },
  { name: "Sofía", voice_type: "feminine", id: "54dg9e04jid98" },
  { name: "Diego", voice_type: "masculine", id: "65eh0f15kie09" },
];

// Opciones de configuración para el agente de voz
export const VOICE_CONFIG_OPTIONS = {
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
