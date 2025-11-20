// src/app/educacion/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { BookOpen, Video, Download, ExternalLink, Search, Sparkles, Youtube, FileText } from 'lucide-react';

export default function EducacionPage() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [category, setCategory] = useState('General');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLearning = async () => {
      try {
        const res = await fetch('/api/ai-learning');
        const data = await res.json();
        if (data.resources) {
          setRecommendations(data.resources);
          setCategory(data.category);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLearning();
  }, []);

  // Función para generar el link de búsqueda seguro
  const getLink = (res: any) => {
    if (res.type === 'video') return `https://www.youtube.com/results?search_query=${encodeURIComponent(res.query || res.title)}`;
    return `https://www.google.com/search?q=${encodeURIComponent(res.query || res.title)}`;
  };

  const getIcon = (type: string) => {
    if (type.includes('video')) return <Youtube className="text-red-500" />;
    if (type.includes('book')) return <BookOpen className="text-blue-500" />;
    return <FileText className="text-green-500" />;
  };

  return (
    <div className="space-y-8">
      
      {/* Encabezado */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-green-900">📚 Centro de Aprendizaje</h1>
        <p className="text-gray-600">Recursos verificados para entender y combatir el cambio climático.</p>
      </div>

      {/* SECCIÓN DINÁMICA CON IA */}
      <section>
        <div className="flex items-center gap-2 mb-4">
           <Sparkles className="text-purple-600" size={24} />
           <h2 className="text-xl font-bold text-gray-800">
             {loading ? 'Analizando tus intereses...' : `Seleccionados para ti: ${category}`}
           </h2>
        </div>

        {loading ? (
           <div className="grid md:grid-cols-1 gap-4">
             <div className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>
             <div className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>
           </div>
        ) : (
          <div className="grid md:grid-cols-1 gap-4">
            {recommendations.map((item, idx) => (
              <a 
                key={idx}
                href={getLink(item)}
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white p-6 rounded-xl shadow-sm border border-purple-100 hover:shadow-md hover:border-purple-300 transition flex justify-between items-center group"
              >
                <div className="flex gap-4 items-start">
                   <div className="bg-purple-50 p-3 rounded-lg mt-1">
                      {getIcon(item.type)}
                   </div>
                   <div>
                     <h3 className="font-bold text-slate-800 text-lg group-hover:text-purple-700 transition flex items-center gap-2">
                       {item.title}
                       <ExternalLink size={14} className="opacity-40" />
                     </h3>
                     <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                     <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md mt-2 inline-block uppercase">
                        {item.type === 'video' ? 'Ver Documental' : 'Leer Artículo'}
                     </span>
                   </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* SECCIÓN ESTÁTICA (Biblioteca General) */}
      <section className="pt-8 border-t border-gray-200">
        <h2 className="text-lg font-bold text-gray-500 mb-4 uppercase tracking-widest">
          Biblioteca General
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <a href="https://www.nationalgeographic.es/medio-ambiente" target="_blank" className="bg-blue-50 p-5 rounded-xl border border-blue-100 hover:scale-105 transition">
            <div className="flex justify-between items-start mb-2">
              <BookOpen size={24} className="text-blue-500" />
            </div>
            <h3 className="font-bold text-slate-800 mb-1">National Geographic</h3>
            <p className="text-xs text-slate-500">Artículos sobre naturaleza.</p>
          </a>
          <a href="https://www.un.org/es/actnow" target="_blank" className="bg-green-50 p-5 rounded-xl border border-green-100 hover:scale-105 transition">
            <div className="flex justify-between items-start mb-2">
              <Download size={24} className="text-green-500" />
            </div>
            <h3 className="font-bold text-slate-800 mb-1">Guía ONU</h3>
            <p className="text-xs text-slate-500">Descarga la guía oficial.</p>
          </a>
          <a href="https://www.youtube.com/results?search_query=eco+tips+ahorro+energia" target="_blank" className="bg-red-50 p-5 rounded-xl border border-red-100 hover:scale-105 transition">
            <div className="flex justify-between items-start mb-2">
              <Youtube size={24} className="text-red-500" />
            </div>
            <h3 className="font-bold text-slate-800 mb-1">YouTube Shorts</h3>
            <p className="text-xs text-slate-500">Tips rápidos en video.</p>
          </a>
        </div>
      </section>
    </div>
  );
}