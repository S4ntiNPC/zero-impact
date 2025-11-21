// src/app/insignias/page.tsx
'use client';
import BadgeGallery from '@/components/BadgeGallery';

export default function InsigniasPage() {
  // En esta página forzamos la recarga al entrar (trigger 0 o 1 funciona igual visualmente)
  return (
    <div className="space-y-6">
      <BadgeGallery refreshTrigger={0} />
    </div>
  );
}