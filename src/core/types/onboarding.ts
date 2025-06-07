export interface OnBoardingData {
  businessName: string;
  fullName: string;
  email: string;
  whatsapp: string;
  agentTypes: string[];
  textChannels: string[];
  textConfig: {
    useEmojis: string;
    textStyle: string;
    modelTemperature: string;
  };
  voiceConfig: {
    voiceType: string;
    voiceId: string;
    speechRate: string;
    callHandling: string;
    temperature: number;
  };
}
