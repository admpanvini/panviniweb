"use client";

import { Card } from "@tremor/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// 👉 importamos los íconos que quieras usar
import {
  Home,
  Bell,
  FileText,
  Phone,
  Folder,
  Mail,
  User,
  Building,
  User2Icon,
  BookUser,
  BotOff,
  CirclePower,
} from "lucide-react";

const links_user= [
  { name: "Inicio", path: "/user", icon: FileText },
  { name: "Avisos", path: "/user/avisos", icon: Bell },
  //{ name: "Expensas", path: "/expensas", icon: FileText },
  { name: "Teléfonos Útiles", path: "/user/telefonos", icon: Phone },
  { name: "Documentos", path: "/user/documentos", icon: Folder },
  { name: "Contacto", path: "/user/contacto", icon: Mail },
  { name: "Tu cuenta", path: "/user/cuenta", icon: User },
  { name: "Cerrar sesión", path: "/auth/logout", icon: CirclePower }
];
const links_admin= [
  { name: "Propiedades", path: "/admin/propiedades", icon: Home },
  { name: "Unidades", path: "/admin/unidades", icon: Building },
  { name: "Cuentas", path: "/admin/cuentas", icon: BookUser },
  { name: "Administradores", path: "/admin/administradores", icon: BookUser },
  { name: "Tu cuenta", path: "/admin/cuenta", icon: User },
  { name: "Documentos", path: "/admin/documentos", icon: FileText },
  { name: "Notificaciones", path: "/admin/notificaciones", icon: Bell },
  { name: "Cerrar sesión", path: "/auth/logout", icon: CirclePower }
];


export default function Sidebar({ className = "", onNavigate }: { className?: string, onNavigate?: () => void }) {
  const pathname = usePathname();
  const basePath: String= pathname.split('/')[1] || 'user';
  const css_color = basePath === "user" ? "" : "-admin";
  const themeClass = basePath === "user" ? "theme-user" : "theme-admin";

  return (
    <aside className={`w-64 p-3 text-white ${themeClass} ${className}`}>
      <Card
        className="h-full border-none rounded-[26px] shadow-[0_24px_60px_rgba(28,39,73,.22)]"
        style={{ background: `var(--colorSidebar${css_color})` }}
      >
        <nav className="flex flex-col gap-2 pt-2">
          {(basePath=='user'?links_user:links_admin).map(({ name, path, icon: Icon }) => (
            <Link
              key={name}
              href={path}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition duration-200 ${
                pathname === path
                  ? `bg-white text-[var(--baseOscura${css_color})] font-semibold shadow-[0_12px_30px_rgba(0,0,0,.14)]`
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={18} /> {/* 👈 acá va el ícono */}
              {name}
            </Link>
          ))}
        </nav>
      </Card>
    </aside>
  );
}
