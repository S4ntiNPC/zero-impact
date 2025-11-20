// src/utils/badgeSystem.ts

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  instruction: string; // NUEVO: Texto que explica cómo ganarla
  // La función recibe el tipo de actividad actual y el total histórico
  criteria: (activityType: string, totalActivities: number) => boolean;
}

export const AVAILABLE_BADGES: Badge[] = [
  {
    id: 'badge_first_step',
    name: 'Primer Paso',
    description: 'Todo gran cambio comienza con una pequeña acción.',
    icon: '🌱',
    instruction: 'Registra tu primera actividad.',
    criteria: (type, count) => count >= 1,
  },
  {
    id: 'badge_tracker_pro',
    name: 'Compromiso Total',
    description: 'La constancia es la clave del éxito.',
    icon: '⭐',
    instruction: 'Registra 5 actividades en total.',
    criteria: (type, count) => count >= 5,
  },
  {
    id: 'badge_eco_traveler',
    name: 'Viajero Eco',
    description: 'Moverse sin dejar huella es posible.',
    icon: '🚌',
    instruction: 'Registra un viaje en Autobús o Bicicleta.',
    // CORRECCIÓN: Ahora buscamos los IDs nuevos de tu calculadora
    criteria: (type) => ['trans_bus', 'trans_bike'].includes(type),
  },
  {
    id: 'badge_veggie_power',
    name: 'Poder Verde',
    description: 'Una dieta basada en plantas ayuda al planeta.',
    icon: '🥗',
    instruction: 'Registra una comida vegana o verduras.',
    // NUEVA INSIGNIA: Se activa con verduras o comida vegana
    criteria: (type) => ['food_veggie', 'food_vegan_meal'].includes(type),
  },
  {
    id: 'badge_circular_fashion',
    name: 'Moda Circular',
    description: 'Darle una segunda vida a la ropa reduce residuos.',
    icon: '👕',
    instruction: 'Registra una compra de ropa de segunda mano.',
    // NUEVA INSIGNIA: Se activa con ropa usada
    criteria: (type) => type === 'cons_clothes_used',
  },
  {
    id: 'badge_saver',
    name: 'Ahorrador',
    description: 'Cuidar la energía es cuidar el futuro.',
    icon: '💡',
    instruction: 'Registra el uso de focos ahorradores (LED).',
    // NUEVA INSIGNIA: Se activa con focos
    criteria: (type) => type === 'energy_light',
  },
  {
    id: 'badge_legend',
    name: 'Leyenda Zero',
    description: 'Eres un experto en reducir tu huella.',
    icon: '👑',
    instruction: 'Registra 20 actividades en total.',
    // NUEVA INSIGNIA: Nivel difícil
    criteria: (type, count) => count >= 20,
  }
];

export const checkNewBadges = (
  currentBadges: string[],
  activityType: string,
  totalActivities: number
): string[] => {
  const newEarned: string[] = [];

  AVAILABLE_BADGES.forEach((badge) => {
    // Si NO la tiene Y cumple el criterio...
    if (!currentBadges.includes(badge.id) && badge.criteria(activityType, totalActivities)) {
      newEarned.push(badge.id);
    }
  });

  return newEarned;
};