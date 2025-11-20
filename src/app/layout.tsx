// src/app/layout.tsx
import type { Metadata, Viewport } from "next"; // 1. Importamos Viewport
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zero-Impact App",
  description: "Mide y reduce tu huella de carbono",
};

// 2. ESTO ES LO QUE FALTABA: Configuración para móviles
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Opcional: evita que el usuario haga zoom y rompa el diseño
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body className={`${inter.className} bg-gray-50 text-slate-900`}>
          <div className="flex min-h-screen relative">
            
            {/* Sidebar (Menú) */}
            <Sidebar />

            {/* Contenido Principal */}
            <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 w-full max-w-[100vw] overflow-x-hidden">
              <div className="max-w-6xl mx-auto mt-12 md:mt-0">
                {children}
              </div>
            </main>
            
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}