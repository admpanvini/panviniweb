"use client"
import { useState } from "react";

export default function Landing_login({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<"login" | "signin" | "recover">("login");
  const goTo = (section:"login" | "signin" | "recover")=>{ setView(section)}
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://mediaim.expedia.com/destination/1/34edd77bd8d23ed8a598873c1093be18.jpg')" }}>
      
      {/* Overlay con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#9099f5]/80 to-[#8c00ff]/80"></div>
      
      {/* Card de login */}
      <div className="relative z-10 w-full max-w-md bg-white/70 rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <center className="mb-5">
        <img src="/logo.png" alt="logo" className="w-23 h-10" style={{filter:'invert(1)'}} />
        </center>
        {children}
      </div>
    </div>
  );
}
