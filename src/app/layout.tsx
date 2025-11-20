// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'; // Importante para el Login
import "./globals.css";
import Sidebar from "@/components/Sidebar"; // <--- ¡Esta es la línea que faltaba!

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zero-Impact App",
  description: "Mide y reduce tu huella de carbono",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* Envolvemos todo en ClerkProvider para que la autenticación funcione */
    <ClerkProvider>
      <html lang="es">
        <body className={`${inter.className} bg-gray-50 text-slate-900`}>
          <div className="flex min-h-screen relative">
            
            {/* Sidebar Responsivo */}
            <Sidebar />

            {/* Contenido Principal con margen adaptativo */}
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