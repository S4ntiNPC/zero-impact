// src/components/Sidebar.tsx
import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Leaf, Trophy, Lightbulb, BookOpen, Bell } from 'lucide-react';
// 1. Importar componentes de Clerk
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-[#fcf8f2] border-r border-stone-200 flex flex-col fixed left-0 top-0 overflow-y-auto z-10">
      {/* Logo */}
      <div className="p-8 pb-4">
        <div className="text-6xl font-bold text-green-800 font-mono text-center mb-2">Z</div>
        <h2 className="text-xs font-bold text-center text-green-700 tracking-widest uppercase">Zero-Impact</h2>
      </div>

      {/* Menú */}
      <nav className="flex-1 px-4 space-y-2 mt-6">
        {/* ... tus enlaces de siempre ... */}
        <div className="text-xs font-bold text-gray-400 uppercase px-4 mb-2">Principal</div>
        <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-100 hover:text-green-800 rounded-xl transition-colors font-medium">
          <LayoutDashboard size={20} /> Mi Huella
        </Link>
        <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-100 hover:text-green-800 rounded-xl transition-colors font-medium">
          <Bell size={20} /> Notificaciones
        </Link>

        <div className="border-t border-stone-200 my-4 mx-4"></div>
        <div className="text-xs font-bold text-gray-400 uppercase px-4 mb-2">Herramientas</div>

        <Link href="/actividades" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-100 hover:text-green-800 rounded-xl transition-colors font-medium">
          <Leaf size={20} /> Actividades
        </Link>
        <Link href="/consejos" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-100 hover:text-green-800 rounded-xl transition-colors font-medium">
          <Lightbulb size={20} /> Consejos
        </Link>
        <Link href="/insignias" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-100 hover:text-green-800 rounded-xl transition-colors font-medium">
          <Trophy size={20} /> Insignias
        </Link>
        <Link href="/educacion" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-100 hover:text-green-800 rounded-xl transition-colors font-medium">
          <BookOpen size={20} /> Educación
        </Link>
      </nav>

      {/* Footer del Sidebar: LOGIN / PERFIL */}
      <div className="p-6 mt-auto">
        
        {/* Si NO está logueado, muestra botón de Entrar */}
        <SignedOut>
          <SignInButton mode="modal">
            <button className="w-full bg-green-800 text-white py-3 rounded-xl font-bold hover:bg-green-900 transition shadow-lg">
              Iniciar Sesión
            </button>
          </SignInButton>
        </SignedOut>

        {/* Si YA está logueado, muestra su foto y nombre */}
        <SignedIn>
          <div className="bg-green-100 rounded-2xl p-4 flex items-center gap-3 border border-green-200">
            <UserButton afterSignOutUrl="/" />
            <div className="text-xs text-green-800 font-bold">
              Mi Cuenta
            </div>
          </div>
        </SignedIn>
        
      </div>
    </aside>
  );
}