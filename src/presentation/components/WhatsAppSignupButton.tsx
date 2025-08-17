// app/components/WhatsAppSignupButton.tsx
'use client';
import { useEffect } from 'react';

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

export default function WhatsAppSignupButton() {
  useEffect(() => {
    // Cargar SDK si no está presente
    if (typeof window === 'undefined') return;
    if (window.FB) return;

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: false,
        version: 'v18.0', // actualizar según la versión que uses
      });
    };

    const id = 'facebook-jssdk';
    if (!document.getElementById(id)) {
      const js = document.createElement('script');
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      js.async = true;
      js.defer = true;
      js.crossOrigin = 'anonymous';
      document.body.appendChild(js);
    }
  }, []);

  // Listener opcional para recibir mensajes postMessage (embedded signup puede usar postMessage).
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      // Por seguridad valida e.origin si lo deseas
      console.log('postMessage recibido', e.data);
      // La doc indica que puedes recibir información del flow vía postMessage.
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const launchWhatsAppSignup = () => {
    if (!window.FB) {
      console.error('FB SDK no cargado');
      return;
    }

    const options = {
      config_id: process.env.NEXT_PUBLIC_WA_CONFIG_ID,
      response_type: 'code',
      override_default_response_type: true,
      extras: {
        setup: {
          solutionID: process.env.NEXT_PUBLIC_SOLUTION_ID || undefined,
        },
        sessionInfoVersion: '3',
      },
    };

    window.FB.login((response: any) => {
      // En la práctica, con response_type:'code' el flujo puede devolver postMessage,
      // y la respuesta en callback puede no contener el 'code' directo — por eso intercambias server-side.
      console.log('FB.login callback', response);
      // Si recibes response.authResponse?.code aquí, puedes POSTearlo a tu API servidor.
      // Si no, escucha postMessage o implementa callback server-side.
    }, options);
  };

  return (
    <button onClick={launchWhatsAppSignup} className="px-4 py-2 bg-green-600 text-white rounded">
      Iniciar Embedded Signup (WhatsApp)
    </button>
  );
}
