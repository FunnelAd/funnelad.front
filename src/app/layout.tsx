"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Script from 'next/script';
import Sidebar from "@/presentation/layouts/Sidebar";
import { AuthProvider } from "@/core/contexts/AuthContext";
import { AppConfigProvider } from "@/core/contexts/AppConfigContext";
import { ThemeProvider } from "@/core/contexts/ThemeContext";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { ModalProvider } from "@/core/providers/ModalProviders";
import { GlobalModal } from "@/presentation/components/ui/GlobalModal";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/auth";
  const isOnboardingPage = pathname === "/register";

  if (isAuthPage || isOnboardingPage) {
    return <>{children}</>;
  }

  return (
    <>
      {/* ✅ Script movido FUERA del div y del head incorrecto */}
      <Script
        src="https://connect.facebook.net/en_US/sdk.js"
        strategy="afterInteractive"
        onLoad={() => console.log('Facebook SDK cargado — window.FB disponible')}
        crossOrigin="anonymous"
      />
      
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto w-full md:pl-16 pl-0">
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              success: {
                style: {
                  background: "green",
                  color: "white",
                },
              },
              error: {
                style: {
                  background: "red",
                  color: "white",
                },
              },
            }}
          />
        </main>
      </div>
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ThemeProvider>
          <AppConfigProvider>
            <AuthProvider>
              <ModalProvider>
                <Suspense
                  fallback={
                    <div className="w-full h-screen flex justify-center items-center">
                      Cargando...
                    </div>
                  }
                >
                  <RootLayoutContent>{children}</RootLayoutContent>
                </Suspense>
                <GlobalModal />
              </ModalProvider>
            </AuthProvider>
          </AppConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}