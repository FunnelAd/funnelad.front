"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/presentation/layouts/Sidebar";
import { AuthProvider } from "@/core/contexts/AuthContext";
import { AppConfigProvider } from "@/core/contexts/AppConfigContext";
import { ThemeProvider } from "@/core/contexts/ThemeContext";
import { Suspense } from "react"; // Import Suspense
import { usePathname } from "next/navigation";
import { ModalProvider } from "@/core/providers/ModalProviders";
import { GlobalModal } from "@/presentation/components/ui/GlobalModal";

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
          <Toaster position="top-right"
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
                  {" "}
                  {/* Suspense Boundary */}
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
