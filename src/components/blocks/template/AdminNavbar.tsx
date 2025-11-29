"use client";

import { usePathname } from "next/navigation";
import { User, LogOut, Menu} from "lucide-react";
import Link from "next/link";

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();

  // Fondo del navbar
  //const bgColor = pathname === "/cuenta" ? "#FFA896" : "var(--color-navbar)";

  // Texto/iconos negros cuando el fondo es #932727ff
  const textColor = pathname === "/cuenta" ? "text-[var(--baseSuperClara)] font-semibold" : "text-white";

  return (
    <header className="w-full shadow-md bg-[#932727]">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Botón hamburguesa en mobile */}
        <button className={`md:hidden`} onClick={onMenuClick}>
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo */}
        <span className="text-lg font-semibold tracking-wide">
          <img src="/logo.png" alt="logo" className="w-23 h-10" />
        </span>

        {/* Acciones derecha */}
        <div className="flex gap-3">
          {/* Perfil */}
          <button
            className={`flex items-center gap-2 px-2 py-1 rounded ${textColor}`}
          >
            <User className="w-4 h-4" />
            <span className="hidden md:inline">
              <Link
              href={`/cuenta`}
              >
               Perfil
              </Link>             
             </span>
          </button>

          {/* Cerrar */}
          <a href="/auth/logout"
            className={`flex items-center gap-2 px-2 py-1 rounded text-white`}
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Cerrar</span>
          </a>
        </div>
      </div>
    </header>
  );
}
