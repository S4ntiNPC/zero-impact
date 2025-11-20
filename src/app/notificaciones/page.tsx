// src/app/notificaciones/page.tsx
import React from 'react';
import { Bell, Info } from 'lucide-react';

export default function NotificacionesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Encabezado */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-green-900">🔔 Notificaciones</h1>
        <p className="text-gray-600">Mantente al día con tus alertas y recordatorios.</p>
      </div>

      {/* Contenedor de Notificaciones */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
        
        {/* Icono decorativo */}
        <div className="bg-green-50 p-6 rounded-full mb-6 animate-pulse">
          <Bell size={48} className="text-green-600" />
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Estás al día
        </h2>
        
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          Aquí aparecerán futuras notificaciones sobre tus logros, recordatorios de registro y nuevos desafíos disponibles.
        </p>

        <div className="flex items-center gap-2 text-xs text-blue-500 bg-blue-50 px-4 py-2 rounded-lg">
          <Info size={14} />
          <span>Te avisaremos cuando haya novedades.</span>
        </div>

      </div>

    </div>
  );
}