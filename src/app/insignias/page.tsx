// src/app/insignias/page.tsx
'use client';
import BadgeGallery from '@/components/BadgeGallery';

export default function InsigniasPage() {
  // En esta página forzamos la recarga al entrar (trigger 0 o 1 funciona igual visualmente)
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-green-900">🏆 Salón de la Fama</h1>
      <p className="text-gray-600">Colecciona todas las medallas reduciendo tu huella.</p>
      <BadgeGallery refreshTrigger={0} />
    </div>
  );
}