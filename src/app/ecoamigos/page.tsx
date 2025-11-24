// src/app/ecoamigos/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Copy, Check } from 'lucide-react';

export default function EcoAmigosPage() {
  const [myCode, setMyCode] = useState('Cargando...');
  const [friends, setFriends] = useState<any[]>([]);
  const [inputCode, setInputCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchData = async () => {
    const res = await fetch('/api/friends');
    const data = await res.json();
    if (data.myCode) {
      setMyCode(data.myCode);
      setFriends(data.friends);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/friends', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: inputCode.toUpperCase() }),
    });
    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      alert(`✅ ¡${data.friendName} agregado! Ahora verás su gráfica en tu Dashboard.`);
      setInputCode('');
      fetchData();
    } else {
      alert('❌ ' + data.error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(myCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-green-900">🤝 EcoAmigos</h1>
        <p className="text-gray-600">Conecta con otros y compite sanamente por reducir su huella.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* TARJETA 1: MI CÓDIGO */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-green-100 text-center">
          <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={32} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Tu Código de Amigo</h2>
          <p className="text-sm text-gray-500 mb-6">Comparte este código para que otros comparen su huella contigo.</p>
          
          <div 
            onClick={copyToClipboard}
            className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:bg-gray-200 transition flex items-center justify-center gap-3 group"
          >
            <span className="text-2xl font-mono font-bold text-gray-700 tracking-widest">{myCode}</span>
            {copied ? <Check className="text-green-600" /> : <Copy size={20} className="text-gray-400 group-hover:text-gray-600" />}
          </div>
          {copied && <p className="text-xs text-green-600 mt-2 font-bold">¡Copiado!</p>}
        </div>

        {/* TARJETA 2: AGREGAR AMIGO */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <UserPlus size={24} className="text-blue-600" /> Agregar un Amigo
          </h2>
          <form onSubmit={handleAddFriend} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Ingresa su código</label>
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="Ej: JUAN-123"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono"
              />
            </div>
            <button 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-md disabled:opacity-50"
            >
              {loading ? 'Buscando...' : 'Conectar'}
            </button>
          </form>

          {/* LISTA DE AMIGOS */}
          <div className="mt-8">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Tus Conexiones ({friends.length})</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {friends.length === 0 && <p className="text-sm text-gray-400 italic">Aún no tienes amigos agregados.</p>}
              {friends.map((f) => (
                <div key={f.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs">
                    {f.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{f.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}