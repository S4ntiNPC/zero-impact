// src/app/consejos/page.tsx
import TipsSection from '@/components/TipsSection';

export default function ConsejosPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-green-900">💡 Recomendaciones</h1>
      <p className="text-gray-600">
        Analizamos tus datos con Inteligencia Artificial para decirte dónde puedes mejorar.
      </p>
      
      {/* Aquí se carga el componente inteligente */}
      <TipsSection />
    </div>
  );
}