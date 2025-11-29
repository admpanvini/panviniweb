"use client";
import Navbar from "@/components/base/Navbar";
import Sidebar from "@/components/base/Sidebar";
import { useState } from "react";
import { AdminProvider, useAdmin } from "./AdminContext";

function LayoutBase({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { adminData }  = useAdmin() || {};
  console.log("Data del usuario",adminData)
  return (
    <div className="h-screen flex flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(true)} userName={adminData?.cuenta_titular || '-'}/>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Desktop */}
        <Sidebar className="hidden md:flex" />

        {/* Overlay siempre montado, pero con opacidad */}
        <div
          className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden ${
            sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar Mobile siempre montado */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 md:hidden ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar className="w-64 h-full" />
        </div>

        {/* Main */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <LayoutBase>
        {children}
      </LayoutBase>
    </AdminProvider>
);}
