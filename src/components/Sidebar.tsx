// src/components/Sidebar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Leaf, Trophy, Lightbulb, BookOpen, Bell, Menu, X 
} from 'lucide-react';
// Componentes de Clerk
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Para saber en qué página estamos

  // Función para cerrar el menú al hacer clic en un enlace (solo en móvil)
  const closeMenu = () => setIsOpen(false);

  // Clase base para los enlaces
  const linkClass = (path: string) => `
    flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium
    ${pathname === path 
      ? 'bg-green-100 text-green-800' // Estilo activo
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'} // Estilo inactivo
  `;

  return (
    <>
      {/* --- BOTÓN HAMBURGUESA (Solo visible en Móvil) --- */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md text-green-800 hover:bg-gray-50 border border-gray-100"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* --- FONDO OSCURO (Overlay) --- */}
      {/* Se muestra solo cuando el menú está abierto en móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={closeMenu}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed top-0 left-0 z-40 h-screen w-64 
        bg-[#fcf8f2] border-r border-stone-200 
        flex flex-col
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
      `}>
        
        {/* Logo */}
        <div className="p-8 pb-4 pt-10 md:pt-8">
          <div className="text-6xl font-bold text-green-800 font-mono text-center mb-2 select-none">Z</div>
          <h2 className="text-xs font-bold text-center text-green-700 tracking-widest uppercase">Zero-Impact</h2>
        </div>

        {/* Menú de Navegación */}
        <nav className="flex-1 px-4 space-y-2 mt-2 overflow-y-auto">
          
          <div className="text-xs font-bold text-gray-400 uppercase px-4 mb-2 mt-4">Principal</div>
          
          <Link href="/" onClick={closeMenu} className={linkClass('/')}>
            <LayoutDashboard size={20} /> Mi Huella
          </Link>
          <Link href="/notificaciones" onClick={closeMenu} className={linkClass('/notificaciones')}>
            <Bell size={20} /> Notificaciones
          </Link>

          <div className="border-t border-stone-200 my-4 mx-4"></div>

          <div className="text-xs font-bold text-gray-400 uppercase px-4 mb-2">Herramientas</div>

          <Link href="/actividades" onClick={closeMenu} className={linkClass('/actividades')}>
            <Leaf size={20} /> Actividades
          </Link>
          <Link href="/consejos" onClick={closeMenu} className={linkClass('/consejos')}>
            <Lightbulb size={20} /> Consejos
          </Link>
          <Link href="/insignias" onClick={closeMenu} className={linkClass('/insignias')}>
            <Trophy size={20} /> Insignias
          </Link>
          <Link href="/educacion" onClick={closeMenu} className={linkClass('/educacion')}>
            <BookOpen size={20} /> Educación
          </Link>
        </nav>

        {/* Footer: Login / Usuario */}
        <div className="p-6 mt-auto bg-[#fcf8f2]">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="w-full bg-emerald-800 text-white py-3 rounded-xl font-bold hover:bg-emerald-900 transition shadow-sm">
                Iniciar Sesión
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <div className="bg-emerald-50/50 rounded-2xl p-3 flex items-center gap-3 border border-emerald-100">
              <UserButton afterSignOutUrl="/" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-emerald-900">Mi Cuenta</span>
                <span className="text-[10px] text-emerald-600">Gestionar perfil</span>
              </div>
            </div>
          </SignedIn>
        </div>

      </aside>
    </>
  );
}