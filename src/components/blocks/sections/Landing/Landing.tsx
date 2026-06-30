"use client"
import Logo from "@/components/base/Logo";
import { useState } from "react";

export default function Landing_login({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<"login" | "signin" | "recover">("login");
  const goTo = (section:"login" | "signin" | "recover")=>{ setView(section)}
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center px-4 py-8"
      style={{ backgroundImage: "url('/images/loginwall.png')" }}>
      
      {/* Overlay con gradiente */}
      <div className="auth-overlay absolute inset-0"></div>
      <div className="auth-glow absolute inset-0"></div>
      
      {/* Card de login */}
      <div className="auth-card">
        <div className="absolute left-6 right-6 top-0 h-1.5 rounded-b-full bg-[var(--authClara)]"></div>
        {/* Logo */}
        <center className="mb-5">
        <span className="inline-flex text-[var(--authClara)] drop-shadow-[0_14px_24px_rgba(0,0,0,.35)]">
          <Logo className="h-10 w-24" />
        </span>
        </center>
        <div className="mb-5 text-center">
          <p className="text-sm font-semibold text-white/85">Administracion online</p>
          <p className="mt-1 text-xs text-white/60">Ingresa con tu email, unidad y clave</p>
        </div>
        {children}
      </div>
    </div>
  );
}
