"use client";

import { usePathname } from "next/navigation";
import { User, LogOut, Menu} from "lucide-react";
import Link from "next/link";
import Logo from "./Logo";

export default function Navbar({ onMenuClick , userName }: { onMenuClick: () => void , userName:String }) {
  const pathname = usePathname();
  const basePath: string= pathname.split('/')[1] || '';
  const themeClass = basePath === "user" ? "theme-user" : "theme-admin";

  return (
    <header className={`w-full px-3 pt-3 ${themeClass}`}>
      <div className="mx-auto flex items-center justify-between rounded-[24px] border border-white/70 bg-white/80 px-4 py-3 shadow-[0_12px_35px_rgba(28,39,73,.10)] backdrop-blur-xl">
        {/* Botón hamburguesa en mobile */}
        <button className="rounded-xl bg-[var(--appSuperClara)] p-2 text-[var(--appOscura)] md:hidden" onClick={onMenuClick}>
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo */}
        <span className="flex items-center text-[var(--appOscura)]">
          <Logo className="h-10 w-24" />
        </span>

        {/* Acciones derecha */}
        <div className="flex gap-2">
          {/* Perfil */}
          <button
            className="flex items-center gap-2 rounded-2xl bg-[var(--appSuperClara)] px-3 py-2 text-[var(--appOscura)]"
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
            className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-[var(--appOscura)] shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Cerrar</span>
          </a>
        </div>
      </div>
    </header>
  );
}
