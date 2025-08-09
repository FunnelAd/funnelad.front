
export function initFacebookSdk({ version = 'v16.0' } = {}) {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject('No disponible en servidor');
      return;
    }
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "1355829762191593",
        cookie: true,
        xfbml: true,
        version,
      });
      resolve(window.FB);
    };
    if (!window.FB) {
      const script = document.createElement('script');
      script.src = `https://connect.facebook.net/en_US/sdk.js`;
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    } else {
      resolve(window.FB);
    }
  });
}
