
"use client";

import { useState, useEffect, FC } from 'react';
import { Toaster, toast } from "sonner";
import { metaService } from "@/core/services/metaService";
import { FaFacebookMessenger } from 'react-icons/fa';

// --- Componente para la tarjeta de integración de Meta ---
const MetaIntegrationCard: FC<{ connected: boolean }> = ({ connected }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = () => {
    setIsLoading(true);
    // TODO: Get businessId from user session
    const businessId = 'business-1';
    metaService.initiateAuth(businessId);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full max-w-2xl mx-auto">
      <div className="p-5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <h3 className="text-lg font-semibold">Meta Integration (WhatsApp & Instagram)</h3>
        <p className="text-sm opacity-90">Connect your Meta account to manage WhatsApp and Instagram messages.</p>
      </div>
      <div className="p-6 flex items-center justify-between">
        <div>
          <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${connected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {connected ? 'Connected' : 'Not Connected'}
          </span>
        </div>
        <button
          onClick={handleConnect}
          disabled={connected || isLoading}
          className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaFacebookMessenger className="h-5 w-5 mr-2" />
          <span>{isLoading ? 'Redirecting...' : (connected ? 'Reconnect' : 'Connect with Meta')}</span>
        </button>
      </div>
    </div>
  );
};

// --- Componente Principal de la Página ---
export default function MetaOnboardingPage() {
  const [metaConnected, setMetaConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check Meta integration status on page load
    const checkMetaStatus = async () => {
      // TODO: Get businessId from user session
      const businessId = 'business-1'; 
      try {
        const status = await metaService.getIntegrationStatus(businessId);
        setMetaConnected(status.connected);
      } catch (error) {
        toast.error("Could not verify Meta integration status.");
      }
      setLoading(false);
    };

    checkMetaStatus();

    // Check for callback status from OAuth redirect
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('meta_status') === 'success') {
      toast.success('Meta integration connected successfully!');
      setMetaConnected(true);
      // Clean the URL for a better user experience
      window.history.replaceState({}, document.title, "/integrations/meta-onboarding");
    }
  }, []);

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
        <Toaster richColors position="top-right" />
        <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Connect to Meta
            </h2>
            <MetaIntegrationCard connected={metaConnected} />
        </div>
    </div>
  );
}
