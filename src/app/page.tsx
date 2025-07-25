



'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir después de mostrar la animación por un breve momento
    const redirectTimer = setTimeout(() => {
      router.push('/auth');
    }, 2500); // 2.5 segundos para mostrar la animación

    return () => clearTimeout(redirectTimer);
  }, [router]);

  return (
    <>
      {/* Capa de bloqueo que cubre toda la pantalla y evita que se vean otros elementos */}
      <div 
        className="fixed inset-0 bg-gray-900 z-[9999]" 
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          margin: 0,
          padding: 0
        }}
      />

      {/* Contenido de la animación */}
      <div 
        className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 z-[10000]"
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          margin: 0,
          padding: 0
        }}
      >
        {/* Fondo decorativo */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-tr from-yellow-400/30 via-yellow-200/10 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-400/20 via-blue-200/10 to-transparent rounded-full blur-2xl animate-pulse" />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Logo con animación de pulso */}
          <div className="relative mb-8 animate-bounce">
            <Image
              src="/logo.svg"
              alt="FunnelAd"
              width={80}
              height={80}
              className="drop-shadow-lg"
            />
            <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl animate-ping" />
          </div>

          {/* Animación de automatización/IA */}
          <div className="relative w-64 h-16 mb-8">
            {/* Círculos que representan nodos de IA */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-700 border-2 border-yellow-400/80 rounded-full animate-pulse" />
            <div className="absolute left-1/4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gray-700 border-2 border-yellow-400/80 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-gray-700 border-2 border-yellow-400/80 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            <div className="absolute left-3/4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gray-700 border-2 border-yellow-400/80 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-700 border-2 border-yellow-400/80 rounded-full animate-pulse" style={{ animationDelay: '0.8s' }} />

            {/* Líneas conectoras con animación */}
            <div className="absolute left-6 top-1/2 w-10 h-0.5 bg-gradient-to-r from-yellow-400/80 to-yellow-400/40 transform -translate-y-1/2 animate-pulse" />
            <div className="absolute left-[calc(25%+8px)] top-1/2 w-[calc(25%-16px)] h-0.5 bg-gradient-to-r from-yellow-400/80 to-yellow-400/40 transform -translate-y-1/2 animate-pulse" style={{ animationDelay: '0.3s' }} />
            <div className="absolute left-[calc(50%+10px)] top-1/2 w-[calc(25%-18px)] h-0.5 bg-gradient-to-r from-yellow-400/80 to-yellow-400/40 transform -translate-y-1/2 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute left-[calc(75%+8px)] top-1/2 w-[calc(25%-14px)] h-0.5 bg-gradient-to-r from-yellow-400/80 to-yellow-400/40 transform -translate-y-1/2 animate-pulse" style={{ animationDelay: '0.7s' }} />
          </div>

          {/* Texto con efecto de máquina de escribir */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2 relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">
                FunnelAd
              </span>
              <span className="inline-block w-0.5 h-6 bg-yellow-400 ml-1 animate-blink"></span>
            </h2>
            <p className="text-gray-300 text-sm">Automatizando tu marketing con IA</p>
          </div>

          {/* Indicador de carga */}
          <div className="mt-8 w-48 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 rounded-full animate-loadingBar" 
                style={{ 
                  width: '30%', 
                  backgroundSize: '200% 100%',
                  animation: 'loadingBar 2s infinite linear' 
                }}></div>
          </div>
        </div>

        {/* Estilos para la animación de la barra de carga */}
        <style jsx>{`
          @keyframes loadingBar {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>
      </div>
    </>
  );
}
