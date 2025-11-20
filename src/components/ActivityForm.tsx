// src/components/ActivityForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { EMISSION_FACTORS } from '@/utils/carbonCalculator';
import { 
  Car, Bus, Bike, Plane, CarFront, 
  Beef, Ham, Drumstick, Fish, Carrot, Leaf, 
  ShowerHead, Laptop, Tv, Wind, Lightbulb, 
  PlusCircle, Save, Calendar, Edit3, X, Clock,
  Shirt, ShoppingBag, Smartphone, Monitor, Coffee 
} from 'lucide-react';

const IconMap: Record<string, any> = {
  Car, Bus, Bike, Plane, CarFront, 
  Beef, Ham, Drumstick, Fish, Carrot, Leaf, 
  ShowerHead, Laptop, Tv, Wind, Lightbulb,
  Shirt, ShoppingBag, Smartphone, Monitor, Coffee
};

interface Props {
  onActivityAdded: () => void;
  activityToEdit?: any;
  onCancelEdit?: () => void;
}

export default function ActivityForm({ onActivityAdded, activityToEdit, onCancelEdit }: Props) {
  const [customName, setCustomName] = useState('');
  const [selectedFactorId, setSelectedFactorId] = useState(EMISSION_FACTORS[0].id);
  const [value, setValue] = useState('');
  
  // Estados para manejo de Fecha/Hora
  const [includeTime, setIncludeTime] = useState(false); // Por defecto desactivado (Solo Fecha)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); // Formato YYYY-MM-DD
  
  const [loading, setLoading] = useState(false);

  // Obtenemos categorías para agrupar
  const categories = Array.from(new Set(EMISSION_FACTORS.map(f => f.category)));

  // EFECTO: Cargar datos al Editar
  useEffect(() => {
    if (activityToEdit) {
      setCustomName(activityToEdit.name || '');
      setSelectedFactorId(activityToEdit.type);
      setValue(activityToEdit.value);
      
      if (activityToEdit.date) {
        const d = new Date(activityToEdit.date);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        
        // Si estamos editando, activamos la hora para máxima precisión
        setIncludeTime(true);
        setDate(d.toISOString().slice(0, 16)); // Formato YYYY-MM-DDTHH:mm
      }
    } else {
      // Si es nuevo, reseteamos a fecha de hoy (solo fecha)
      setIncludeTime(false);
      setDate(new Date().toISOString().slice(0, 10));
    }
  }, [activityToEdit]);

  const selectedFactor = EMISSION_FACTORS.find(f => f.id === selectedFactorId) || EMISSION_FACTORS[0];

  // Maneja el cambio del Checkbox de Hora
  const handleToggleTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    const wantsTime = e.target.checked;
    setIncludeTime(wantsTime);

    if (wantsTime) {
      // De Fecha -> Fecha y Hora: Agregamos la hora actual
      const now = new Date();
      const timeString = now.toTimeString().slice(0, 5); // "HH:mm"
      setDate(`${date}T${timeString}`);
    } else {
      // De Fecha y Hora -> Fecha: Cortamos la hora
      setDate(date.split('T')[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const finalName = customName.trim() === '' ? selectedFactor.label : customName;
    
    // Si no incluyó hora, agregamos T12:00:00 para evitar problemas de zona horaria (que se regrese un día)
    const finalDate = includeTime ? date : `${date}T12:00:00`;

    const bodyData = { 
      type: selectedFactorId,
      customName: finalName,
      value,
      date: finalDate
    };

    try {
      let res;
      if (activityToEdit) {
        res = await fetch(`/api/activities/${activityToEdit._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyData),
        });
      } else {
        res = await fetch('/api/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyData),
        });
      }

      if (res.ok) {
        resetForm();
        onActivityAdded();
        if (activityToEdit && onCancelEdit) onCancelEdit();
        alert(activityToEdit ? '✅ Actividad actualizada' : '✅ Actividad agendada');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCustomName('');
    setValue('');
    setIncludeTime(false);
    setDate(new Date().toISOString().slice(0, 10));
  };

  return (
    <div className={`p-6 rounded-xl shadow-lg border transition-colors duration-300 ${activityToEdit ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-green-100'}`}>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {activityToEdit ? <Edit3 className="text-yellow-600" /> : <PlusCircle className="text-green-600" />}
          <h3 className={`text-xl font-bold ${activityToEdit ? 'text-yellow-800' : 'text-green-800'}`}>
            {activityToEdit ? 'Editar Actividad' : 'Nueva Actividad'}
          </h3>
        </div>
        {activityToEdit && (
          <button onClick={onCancelEdit} className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1">
            <X size={16} /> Cancelar
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 1. Nombre */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Ej: Viaje a la universidad..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-black"
          />
        </div>

        {/* 2. Fecha y Hora (INTERRUPTOR NUEVO) */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Calendar size={16} className="text-green-600"/> Fecha
            </label>
            
            {/* Checkbox para activar hora */}
            <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-500 hover:text-green-700 transition">
              <input 
                type="checkbox" 
                checked={includeTime} 
                onChange={handleToggleTime}
                className="accent-green-600 w-4 h-4 rounded cursor-pointer"
              />
              <span className="flex items-center gap-1">
                <Clock size={14} /> Incluir hora específica
              </span>
            </label>
          </div>

          {/* Input que cambia de tipo dinámicamente */}
          <input 
            type={includeTime ? "datetime-local" : "date"}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-black font-mono"
          />
        </div>

        {/* 3. Tipo y Cantidad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Tipo</label>
            <div className="relative">
              <select 
                value={selectedFactorId}
                onChange={(e) => setSelectedFactorId(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none appearance-none bg-white text-black cursor-pointer"
              >
                {categories.map((category) => (
                  <optgroup key={category} label={category} className="font-bold text-gray-900">
                    {EMISSION_FACTORS
                      .filter((f) => f.category === category)
                      .map((f) => (
                        <option key={f.id} value={f.id} className="text-gray-700 font-normal">
                          {f.label} ({f.unit})
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
              <div className="absolute left-3 top-3.5 text-gray-500 pointer-events-none">
                {IconMap[selectedFactor.icon] ? 
                  (() => { const Icon = IconMap[selectedFactor.icon]; return <Icon size={20} /> })() 
                  : <Leaf size={20} />
                }
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Cantidad ({selectedFactor.unit})</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="0"
                required min="0" step="0.1"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-black font-mono"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full font-bold py-4 px-4 rounded-xl transition duration-200 flex justify-center items-center gap-2 shadow-md disabled:opacity-70 text-white ${activityToEdit ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
        >
          {loading ? 'Procesando...' : <><Save size={20} /> {activityToEdit ? 'Actualizar Actividad' : 'Agendar Actividad'}</>}
        </button>
      </form>
    </div>
  );
}