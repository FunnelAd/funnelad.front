'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/presentation/components/layout/Sidebar";
import { AuthProvider } from '@/presentation/contexts/AuthContext';
import { AppConfigProvider } from '@/core/contexts/AppConfigContext';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/presentation/components/Navbar';

const inter = Inter({ subsets: ["latin"] });

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/auth';
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <div className="flex h-screen bg-gray-100">
        <Sidebar onExpandChange={setIsSidebarExpanded} />
        <main 
          className="flex-1 overflow-y-auto w-full md:pl-16 pl-0"
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
        <AppConfigProvider>
          <AuthProvider>
            <RootLayoutContent>{children}</RootLayoutContent>
          </AuthProvider>
        </AppConfigProvider>
      </body>
    </html>
  );
}
