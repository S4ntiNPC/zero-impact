// src/components/TipsSection.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Lightbulb, Sparkles, Loader2 } from 'lucide-react';

interface Tip {
  title: string;
  description: string;
  category: string;
}

export default function TipsSection() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAiTips = async () => {
      try {
        const res = await fetch('/api/ai-tips');
        const data = await res.json();
        if (data.tips) {
          setTips(data.tips);
        }
      } catch (error) {
        console.error("Error cargando consejos IA", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAiTips();
  }, []);

  // Función para asignar colores según la categoría (Estética)
  const getColors = (category: string = '', index: number) => {
    // El primer consejo (urgente) siempre destaca más
    if (index === 0) return 'bg-purple-100 text-purple-900 border-purple-200';
    
    const cat = category.toLowerCase();
    if (cat.includes('energ')) return 'bg-yellow-50 text-yellow-800 border-yellow-200';
    if (cat.includes('trans')) return 'bg-blue-50 text-blue-800 border-blue-200';
    if (cat.includes('alim') || cat.includes('comi')) return 'bg-red-50 text-red-800 border-red-200';
    if (cat.includes('cons') || cat.includes('ropa')) return 'bg-slate-100 text-slate-800 border-slate-200';
    
    return 'bg-green-50 text-green-800 border-green-200';
  };

  // Función para definir el TAMAÑO de la tarjeta según la urgencia
  const getSizeClasses = (index: number) => {
    switch (index) {
      case 0: return 'md:col-span-2 md:row-span-2 min-h-[200px]'; // GIGANTE (Urgente)
      case 1: return 'md:col-span-2'; // ANCHO
      default: return 'md:col-span-1'; // NORMAL
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-100 mt-8 flex flex-col items-center justify-center text-center min-h-[200px]">
         <Loader2 className="animate-spin text-green-600 mb-2" size={32} />
         <p className="text-gray-500">Nuestra IA está analizando tus hábitos...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100 mt-8 relative overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Lightbulb size={100} />
      </div>

      <div className="mb-6 flex items-center gap-2">
        <Sparkles className="text-purple-600" size={24} />
        <div>
           <h3 className="text-xl font-bold text-gray-800">Consejos Inteligentes</h3>
           <p className="text-sm text-gray-500">Personalizados para ti por IA según tu historial.</p>
        </div>
      </div>
      
      {/* GRID MÁGICO: Se adapta según la importancia */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-min">
        
        {tips.map((tip, index) => (
          <div 
            key={index} 
            className={`
              p-6 rounded-2xl border transition hover:shadow-md flex flex-col justify-center
              ${getSizeClasses(index)} 
              ${getColors(tip.category, index)}
            `}
          >
            {index === 0 && (
              <span className="bg-white/80 text-xs font-bold px-2 py-1 rounded-md w-fit mb-2 shadow-sm">
                ⚡ Prioridad Alta
              </span>
            )}
            <h4 className={`font-bold mb-2 ${index === 0 ? 'text-2xl' : 'text-lg'}`}>
              {tip.title}
            </h4>
            <p className={`opacity-90 ${index === 0 ? 'text-base' : 'text-sm'}`}>
              {tip.description}
            </p>
          </div>
        ))}

      </div>
    </div>
  );
}