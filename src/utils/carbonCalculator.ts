// src/utils/carbonCalculator.ts

// Definimos la estructura de nuestros factores de emisión
export interface EmissionFactor {
  id: string;
  label: string;
  factor: number; // kg CO2eq
  unit: string;
  // Agregamos 'Consumo' a las categorías permitidas
  category: 'Transporte' | 'Alimentación' | 'Energía' | 'Consumo'; 
  icon: string;
}

// BASE DE DATOS DE FACTORES AMPLITADA
export const EMISSION_FACTORS: EmissionFactor[] = [
  // --- TRANSPORTE ---
  { id: 'trans_car_gas', label: 'Auto Gasolina', factor: 0.192, unit: 'km', category: 'Transporte', icon: 'Car' },
  { id: 'trans_bus', label: 'Autobús Urbano', factor: 0.10, unit: 'km', category: 'Transporte', icon: 'Bus' },
  { id: 'trans_bike', label: 'Bicicleta / Caminar', factor: 0, unit: 'km', category: 'Transporte', icon: 'Bike' },
  { id: 'trans_flight', label: 'Vuelo Avión (Nacional)', factor: 0.25, unit: 'km', category: 'Transporte', icon: 'Plane' },
  { id: 'trans_uber', label: 'Taxi / App', factor: 0.21, unit: 'km', category: 'Transporte', icon: 'CarFront' },

  // --- ALIMENTACIÓN ---
  { id: 'food_beef', label: 'Carne de Res', factor: 60.0, unit: 'kg', category: 'Alimentación', icon: 'Beef' },
  { id: 'food_pork', label: 'Carne de Cerdo', factor: 7.0, unit: 'kg', category: 'Alimentación', icon: 'Ham' },
  { id: 'food_chicken', label: 'Pollo', factor: 6.0, unit: 'kg', category: 'Alimentación', icon: 'Drumstick' },
  { id: 'food_fish', label: 'Pescado', factor: 5.0, unit: 'kg', category: 'Alimentación', icon: 'Fish' },
  { id: 'food_veggie', label: 'Verduras / Frutas', factor: 0.5, unit: 'kg', category: 'Alimentación', icon: 'Carrot' },
  { id: 'food_vegan_meal', label: 'Comida Vegana', factor: 0.7, unit: 'plato', category: 'Alimentación', icon: 'Leaf' },

  // --- ENERGÍA ---
  { id: 'energy_shower', label: 'Ducha Agua Caliente', factor: 0.2, unit: 'min', category: 'Energía', icon: 'ShowerHead' },
  { id: 'energy_pc', label: 'Uso de Laptop/PC', factor: 0.05, unit: 'horas', category: 'Energía', icon: 'Laptop' },
  { id: 'energy_tv', label: 'Ver Televisión', factor: 0.08, unit: 'horas', category: 'Energía', icon: 'Tv' },
  { id: 'energy_ac', label: 'Aire Acondicionado', factor: 0.5, unit: 'horas', category: 'Energía', icon: 'Wind' },
  { id: 'energy_light', label: 'Foco Incandescente', factor: 0.06, unit: 'horas', category: 'Energía', icon: 'Lightbulb' },

  // --- CONSUMO (NUEVA CATEGORÍA) ---
  // Ropa Nueva: Alto impacto por producción, tintes y transporte
  { id: 'cons_clothes_new', label: 'Prenda de Ropa Nueva', factor: 15.0, unit: 'unidad', category: 'Consumo', icon: 'Shirt' },
  // Ropa Usada: Impacto casi nulo (solo transporte local), fomenta economía circular
  { id: 'cons_clothes_used', label: 'Prenda Segunda Mano', factor: 0.5, unit: 'unidad', category: 'Consumo', icon: 'ShoppingBag' },
  // Tecnología
  { id: 'cons_smartphone', label: 'Smartphone Nuevo', factor: 70.0, unit: 'unidad', category: 'Consumo', icon: 'Smartphone' },
  { id: 'cons_laptop_new', label: 'Laptop Nueva', factor: 250.0, unit: 'unidad', category: 'Consumo', icon: 'Monitor' },
  // Desechables
  { id: 'cons_bottle', label: 'Botella Plástico', factor: 0.08, unit: 'unidad', category: 'Consumo', icon: 'Coffee' },
];

export const calculateFootprint = (factorId: string, value: number) => {
  const activity = EMISSION_FACTORS.find(f => f.id === factorId);
  
  if (!activity) {
    return { totalCo2: 0, category: 'Otros', unit: 'kg CO2eq' };
  }

  const totalCo2 = value * activity.factor;

  return {
    totalCo2: parseFloat(totalCo2.toFixed(2)),
    category: activity.category,
    unit: 'kg CO2eq'
  };
};