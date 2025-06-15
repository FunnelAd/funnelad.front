"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/presentation/components/layout/Sidebar";
import { AuthProvider } from "@/presentation/contexts/AuthContext";
import { AppConfigProvider } from "@/core/contexts/AppConfigContext";
import { ThemeProvider } from "@/core/contexts/ThemeContext";
import { useState, Suspense } from "react"; // Import Suspense
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/auth";
  const isOnboardingPage = pathname === "/register";
  // const [isSidebarExpanded, setIsSidebarExpanded] = useState(false); // Estado no utilizado

  if (isAuthPage || isOnboardingPage) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="flex h-screen">
        <Sidebar /* onExpandChange={setIsSidebarExpanded} */ />{" "}
        {/* Prop no utilizada actualmente para ajustar el padding del main */}
        <main
          className="flex-1 overflow-y-auto w-full md:pl-16 pl-0" // Considerar hacer este padding dinámico según el estado real del sidebar
        >
          {children}
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
              <Suspense
                fallback={
                  <div className="w-full h-screen flex justify-center items-center">
                    Cargando...
                  </div>
                }
              >
                {" "}
                {/* Suspense Boundary */}
                <RootLayoutContent>{children}</RootLayoutContent>
              </Suspense>
            </AuthProvider>
          </AppConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
