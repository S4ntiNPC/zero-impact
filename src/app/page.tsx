// src/app/page.tsx
'use client';

import Dashboard from '@/components/Dashboard';
// 1. Importamos el hook de Clerk para obtener datos del usuario
import { useUser } from '@clerk/nextjs';

export default function Home() {
  
  // 2. Obtenemos el objeto 'user' y el estado de carga 'isLoaded'
  const { user, isLoaded } = useUser();

  // Lógica para la fecha actual
  const fechaActual = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const fechaFormateada = fechaActual.charAt(0).toUpperCase() + fechaActual.slice(1);

  return (
    <main className="min-h-screen py-4 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Encabezado: Bienvenida y Fecha */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              {/* 3. Lógica dinámica: Si cargó y hay usuario, muestra su nombre. Si no, "Usuario" */}
              Hola, {isLoaded && user ? user.firstName : 'Usuario'} 
            </h1>
            <p className="text-gray-500 mt-1">Aquí está tu resumen de impacto ambiental de hoy.</p>
          </div>
          <div className="hidden md:block text-right">
             <span className="bg-emerald-100 text-emerald-800 text-sm font-bold px-4 py-2 rounded-full capitalize">
               {fechaFormateada}
             </span>
          </div>
        </div>

        {/* Sección Principal: Solo el Dashboard Visual */}
        <section>
           <Dashboard refreshTrigger={0} />
        </section>

        {/* Pie de página discreto */}
        <footer className="text-center text-slate-300 text-xs mt-12 pb-6">
          <p>© 2025 Proyecto Zero-Impact</p>
        </footer>

      </div>
    </main>
  );
}