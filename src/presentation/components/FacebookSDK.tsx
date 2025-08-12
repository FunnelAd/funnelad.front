// facebookSDK.ts (componente client)
'use client';
import { useEffect } from 'react';

export default function FacebookSDKLoader() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // cast a any para evitar comprobaciones de typings en la asignación
    (window as any).fbAsyncInit = function () {
      (window as any).FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: false,
        version: 'v18.0',
      });
    };

    // inyectar el script sólo si no existe
    if (!document.getElementById('facebook-jssdk')) {
      const js = document.createElement('script');
      js.id = 'facebook-jssdk';
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      js.async = true;
      js.defer = true;
      document.body.appendChild(js);
    }
  }, []);

  return null;
}
