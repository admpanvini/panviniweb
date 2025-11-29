"use client";

import { usePathname } from "next/navigation";
import { User, LogOut, Menu} from "lucide-react";
import Link from "next/link";

export default function Navbar({ onMenuClick , userName }: { onMenuClick: () => void , userName:String }) {
  const pathname = usePathname();
  const basePath: string= pathname.split('/')[1] || '';
  const css_color = basePath === "user" ? "" : "-admin";

  return (
    <header className="w-full shadow-md" style={{ background: (`var(--colorNavbar${css_color})`)}}>
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
            className={`flex items-center gap-2 px-2 py-1 rounded text-white`}
          >
            <User className="w-4 h-4" />
            <span className="hidden md:inline">
              <Link
              href={`/${basePath}/cuenta`}
              >
               {userName}
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
