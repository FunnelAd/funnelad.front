import React, { createContext, useContext } from 'react';

interface AppConfig {
  version: string;
  environment: 'development' | 'staging' | 'production';
  buildDate: string;
  companyName: string;
  supportEmail: string;
}

const defaultConfig: AppConfig = {
  version: '1.0.0',
  environment: 'development',
  buildDate: new Date().toISOString(),
  companyName: 'FunnelAd',
  supportEmail: 'support@funnelad.com'
};

const AppConfigContext = createContext<AppConfig>(defaultConfig);

export const useAppConfig = () => useContext(AppConfigContext);

export const AppConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AppConfigContext.Provider value={defaultConfig}>
      {children}
    </AppConfigContext.Provider>
  );
}; 