'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/presentation/components/layout/Sidebar";
import { AuthProvider } from '@/presentation/contexts/AuthContext';
import { useAuth } from '@/presentation/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import Navbar from '@/presentation/components/Navbar';
import { AppConfigProvider } from '@/core/contexts/AppConfigContext';
import { useState } from 'react';

const inter = Inter({ subsets: ["latin"] });

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const isAuthPage = pathname === '/auth';
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  // Si es la página de autenticación, mostrar solo el contenido
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Si el usuario está autenticado, mostrar el layout con sidebar
  if (isAuthenticated) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar onExpandChange={setIsSidebarExpanded} />
        <main 
          className={`
            flex-1 overflow-y-auto transition-all duration-300
            ${isSidebarExpanded ? 'md:pl-64' : 'md:pl-16'}
          `}
        >
          {children}
        </main>
      </div>
    );
  }

  // Si no está autenticado y no es la página de auth, mostrar solo el contenido
  return <>{children}</>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AppConfigProvider>
          <AuthProvider>
            <Navbar />
            <RootLayoutContent>{children}</RootLayoutContent>
          </AuthProvider>
        </AppConfigProvider>
      </body>
    </html>
  );
}
