// src/components/BadgeGallery.tsx
'use client';

import { useEffect, useState } from 'react';
import { AVAILABLE_BADGES } from '@/utils/badgeSystem';
import { Info, Lock } from 'lucide-react'; // Importamos iconos

export default function BadgeGallery({ refreshTrigger }: { refreshTrigger: number }) {
  const [userBadges, setUserBadges] = useState<string[]>([]);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await fetch('/api/activities');
        const data = await res.json();
        if (data.badges) {
          setUserBadges(data.badges);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchBadges();
  }, [refreshTrigger]);

  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-stone-100">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-emerald-900">🏆 Salón de la Fama</h3>
        <p className="text-gray-500">Colecciona todas las medallas reduciendo tu huella.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {AVAILABLE_BADGES.map((badge) => {
          const isUnlocked = userBadges.includes(badge.id);
          
          return (
            <div 
              key={badge.id} 
              className={`relative group flex flex-col items-center text-center p-6 rounded-2xl border-2 transition-all duration-300 ${
                isUnlocked 
                  ? 'border-yellow-400 bg-gradient-to-b from-yellow-50 to-white shadow-md' 
                  : 'border-gray-200 bg-gray-50 opacity-70'
              }`}
            >
              {/* Icono Principal */}
              <div className={`text-5xl mb-3 transition-transform duration-300 ${isUnlocked ? 'group-hover:scale-110' : 'grayscale blur-[1px]'}`}>
                {badge.icon}
              </div>

              {/* Nombre */}
              <h4 className={`font-bold text-lg mb-1 ${isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                {badge.name}
              </h4>

              {/* Estado (Desbloqueado / Candado) */}
              {isUnlocked ? (
                <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">
                  ¡Desbloqueado!
                </span>
              ) : (
                <div className="flex items-center gap-1 text-gray-400 mt-1">
                  <Lock size={14} />
                  <span className="text-xs font-medium">Bloqueado</span>
                </div>
              )}

              {/* SECCIÓN DE INFORMACIÓN (Tooltip) */}
              {/* Esta sección muestra las instrucciones */}
              <div className="mt-4 w-full pt-4 border-t border-dashed border-gray-200">
                 <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Info size={14} className="text-blue-400" />
                    <span>Misión:</span>
                 </div>
                 <p className="text-xs font-medium text-gray-600 mt-1">
                   {badge.instruction}
                 </p>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}