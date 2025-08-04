// components/FacebookSDK.tsx
"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    FB: any;
  }
}


const FacebookSDK = () => {
  useEffect(() => {
    // Verifica si ya se ha cargado
    if (window.FB) return;

    // Crea el script
    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID, // Tu App ID
        autoLogAppEvents: true,
        xfbml: true,
        version: "v19.0", // o la versión más reciente
      });
    };

    document.body.appendChild(script);
  }, []);

  return null;
};

export default FacebookSDK;
