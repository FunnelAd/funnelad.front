// core/utils/facebookSDK.ts

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

export function initFacebookSdk(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      return reject(new Error("No window object - are you running on server side?"));
    }

    // Si ya está cargado FB
    if (window.FB) {
      return resolve(window.FB);
    }

    // Inicializar cuando SDK cargue
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "1355829762191593", 
        autoLogAppEvents: true,
        xfbml: true,
        version: process.env.NEXT_PUBLIC_FACEBOOK_SDK_VERSION || "v23.0",
      });
      resolve(window.FB);
    };

    // Insertar script si no existe
    if (!document.querySelector('script[src*="connect.facebook.net"]')) {
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      script.onerror = (e) => reject(e);
      document.body.appendChild(script);
    }
  });
}
