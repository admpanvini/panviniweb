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
} from "lucide-react";

const links = [
  { name: "Expensas", path: "/admin", icon: FileText },
  { name: "Avisos", path: "/admin/avisos", icon: Bell },
  //{ name: "Expensas", path: "/expensas", icon: FileText },
  { name: "Teléfonos Útiles", path: "/admin/telefonos", icon: Phone },
  { name: "Documentos", path: "/admin/documentos", icon: Folder },
  { name: "Contacto", path: "/admin/contacto", icon: Mail },
  { name: "Tu cuenta", path: "/admin/cuenta", icon: User },
];

export default function Sidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside className={`w-64 bg-gray-900 text-white ${className}`}>
      <Card
        className="h-full border-none shadow-none bg-[#9f3131]"
      >
        <nav className="flex flex-col gap-1">
          {links.map(({ name, path, icon: Icon }) => (
            <Link
              key={name}
              href={path}
              className={`flex items-center gap-3 px-4 py-2 rounded transition ${
                pathname === path
                  ? "text-[var(--baseClara)] font-semibold"
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
