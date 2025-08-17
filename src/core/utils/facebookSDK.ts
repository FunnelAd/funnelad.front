// core/utils/facebookSDK.ts
declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

let fbLoadingPromise: Promise<any> | null = null;

export function initFacebookSdk(): Promise<any> {
  if (fbLoadingPromise) return fbLoadingPromise; // Evita recargarlo

  fbLoadingPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      return reject(new Error("Running on server"));
    }

    if (window.FB) return resolve(window.FB);

    window.fbAsyncInit = () => {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "1355829762191593",
        autoLogAppEvents: true,
        xfbml: true,
        version: process.env.NEXT_PUBLIC_FACEBOOK_SDK_VERSION || "v23.0",
      });
      resolve(window.FB);
    };

    const scriptId = "facebook-jssdk";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      script.onerror = (e) => reject(e);
      document.body.appendChild(script);
    }
  });

  return fbLoadingPromise;
}
