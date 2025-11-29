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
  { name: "Cerrar sesión", path: "/user/cuenta", icon: CirclePower }
];
const links_admin= [
  { name: "Propiedades", path: "/admin/propiedades", icon: Home },
  { name: "Unidades", path: "/admin/unidades", icon: Building },
  { name: "Cuentas", path: "/admin/cuentas", icon: BookUser },
  { name: "Documentos", path: "/admin/documentos", icon: FileText },
  { name: "Notificaciones", path: "/admin/notificaciones", icon: Bell },
  { name: "Cerrar sesión", path: "/closesession", icon: CirclePower }
];


export default function Sidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const basePath: String= pathname.split('/')[1] || 'user';
  const css_color = basePath === "user" ? "" : "-admin";

  return (
    <aside className={`w-64 bg-gray-900 text-white ${className}`}>
      <Card
        className="h-full border-none shadow-none"
        style={{ background: `var(--colorSidebar${css_color})` }}
      >
        <nav className="flex flex-col gap-1">
          {(basePath=='user'?links_user:links_admin).map(({ name, path, icon: Icon }) => (
            <Link
              key={name}
              href={path}
              className={`flex items-center gap-3 px-4 py-2 rounded transition ${
                pathname === path
                  ? `text-[var(--baseClara${css_color})] font-semibold`
                  : "hover:bg-[rgba(255,255,255,0.1)]"
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
