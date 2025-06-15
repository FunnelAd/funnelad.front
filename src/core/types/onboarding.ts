export interface OnBoardingData {
  businessName: string;
  fullName: string;
  email: string;
  whatsapp: string;
  agentTypes: string[];
  textChannels: string[];
  textConfig: {
    useEmojis: boolean;
    textStyle: string;
    modelTemperature: number;
  };
  voiceConfig: {
    voiceType: string;
    voiceId: string;
    speechRate: string;
    callHandling: string;
    temperature: number;
  };
}
