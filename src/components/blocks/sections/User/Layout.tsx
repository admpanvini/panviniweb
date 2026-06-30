"use client";

import { useState } from "react";

import { UserProvider, useUser } from "./UserContext";
import Navbar from "@/components/base/Navbar";
import Sidebar from "@/components/base/Sidebar";

function LayoutBase({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userData }  = useUser() || {};
  console.log("Data del usuario",userData)
  return (
      <div className="app-shell theme-user">
        <Navbar onMenuClick={() => setSidebarOpen(true)} userName={userData?.cuenta_titular || '-'}/>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Desktop - Siempre fijo si está en pantalla grande*/}
          <Sidebar className="hidden md:flex" />

          {/* Overlay siempre montado, pero con opacidad */}
          <div
            className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden ${
              sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar Mobile - Hace transición si está en el movil */}
          <div
            className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 md:hidden ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <Sidebar className="w-64 h-full" onNavigate={() => setSidebarOpen(false)} />
          </div>

          {/* Main - AQUI VA EL PAGE.TSX*/}
          <main className="app-main">
            <div className="app-page">
              {children}
            </div>
          </main>
        </div>
      </div>
  );
}

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <LayoutBase>
        {children}
      </LayoutBase>
    </UserProvider>
);}
