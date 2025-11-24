// src/app/actividades/page.tsx
'use client';

import { useState, useEffect } from 'react';
import ActivityForm from '@/components/ActivityForm';
import { EMISSION_FACTORS } from '@/utils/carbonCalculator';
import { Pencil, Trash2 } from 'lucide-react'; // Importamos iconos nuevos

export default function ActividadesPage() {
  const [history, setHistory] = useState<any[]>([]);
  
  // Estado para saber qué actividad estamos editando (si hay alguna)
  const [activityToEdit, setActivityToEdit] = useState<any>(null);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/activities');
      const data = await res.json();
      if (data.success) {
        setHistory(data.activities);
      }
    } catch (error) {
      console.error("Error cargando historial", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Función para Eliminar
  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta actividad? Se recalculará tu huella.')) return;

    try {
      const res = await fetch(`/api/activities/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchHistory(); // Recargar lista
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Función para poner una actividad en el formulario
  const handleEdit = (activity: any) => {
    setActivityToEdit(activity);
    // Hacemos scroll suave hacia arriba para ver el formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getDisplayName = (act: any) => {
    if (act.name && act.name !== act.type) return act.name;
    const match = EMISSION_FACTORS.find((f) => f.id === act.type);
    return match ? match.label : act.type;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-green-900"> Registro de Actividades</h1>
        <p className="text-gray-600">Registra, edita o elimina tus acciones para mantener tu huella al día.</p>
      </div>

      {/* 1. Formulario (Le pasamos el estado de edición) */}
      <ActivityForm 
        onActivityAdded={() => {
          fetchHistory();
          setActivityToEdit(null); // Limpiar edición al terminar
        }} 
        activityToEdit={activityToEdit}
        onCancelEdit={() => setActivityToEdit(null)}
      />

      {/* 2. Historial con Botones de Acción */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
        <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">Historial Reciente</h3>
        <div className="space-y-3">
          {history.length === 0 ? (
             <p className="text-gray-400 text-sm text-center py-4">No hay registros aún.</p>
          ) : (
             history.map((act) => (
               <div key={act._id} className="flex justify-between items-center text-sm p-3 hover:bg-stone-50 rounded-lg transition group border border-transparent hover:border-gray-100">
                 
                 {/* Info Izquierda */}
                 <div className="flex items-center gap-3">
                    <span className="text-2xl bg-gray-100 p-2 rounded-full">
                      {act.category === 'Transporte' ? '🚗' : 
                       act.category === 'Alimentación' ? '🥩' : 
                       act.category === 'Consumo' ? '🛍️' :
                       act.category === 'Energía' ? '⚡' : '🌿'}
                    </span>
                    <div>
                      <p className="font-bold text-gray-800 capitalize text-base">
                        {getDisplayName(act)}
                      </p>
                      <div className="flex gap-2 text-xs text-gray-500">
                        <span>{new Date(act.date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                        <span>•</span>
                        <span>{act.value} {act.type.includes('time') || act.type.includes('energy') || act.type.includes('shower') ? 'min/hr' : 'ud/kg/km'}</span>
                      </div>
                    </div>
                 </div>

                 {/* Info Derecha y Botones */}
                 <div className="flex items-center gap-4">
                   <div className="text-right hidden sm:block">
                     <span className="font-bold text-green-700 block">+{act.carbonAmount} kg</span>
                     <span className="text-xs text-gray-400">CO2eq</span>
                   </div>

                   {/* Botones de Acción (Solo visibles al pasar mouse en PC, o siempre en móvil) */}
                   <div className="flex gap-1 pl-2 border-l border-gray-200">
                     <button 
                        onClick={() => handleEdit(act)}
                        className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
                        title="Editar"
                     >
                       <Pencil size={16} />
                     </button>
                     <button 
                        onClick={() => handleDelete(act._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Eliminar"
                     >
                       <Trash2 size={16} />
                     </button>
                   </div>
                 </div>

               </div>
             ))
          )}
        </div>
      </div>
    </div>
  );
}