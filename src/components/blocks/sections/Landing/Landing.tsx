"use client"
import { useState } from "react";

export default function Landing_login({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<"login" | "signin" | "recover">("login");
  const goTo = (section:"login" | "signin" | "recover")=>{ setView(section)}
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/loginwall.png')" }}>
      
      {/* Overlay con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#000]/80 to-[#333]/80"></div>
      
      {/* Card de login */}
      <div className="relative z-10 w-full max-w-md bg-[#000]/70 rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <center className="mb-5">
        <img src="/logo.png" alt="logo" className="w-23 h-10"/>
        </center>
        {children}
      </div>
    </div>
  );
}
