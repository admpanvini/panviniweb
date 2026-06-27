"use client";
import { useState } from "react";
import { Loading } from "../../template/Loading";

export default function RecoverPasswordForm() {
  const [email, setEmail] = useState("");
  const [unidad_codigo, setUnidadCodigo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !unidad_codigo) {
      setError("Debe ingresar email y unidad");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/recover", {
        method: "POST",
        body: JSON.stringify({ email, unidad_codigo }),
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "No se pudo enviar el email");
        setLoading(false);
        return;
      }

      setSuccess(true);

    } catch {
      setError("Error de conexion");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center text-white space-y-4">
        <p>Si los datos son correctos, te enviamos un email para cargar una nueva clave.</p>
        <a
          href="/auth"
          className="inline-block bg-[#9099f5] px-4 py-2 rounded-lg"
        >
          Volver al inicio
        </a>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-3 text-[var(--baseSuperClara)] border-[var(--baseClara)] focus:ring-[var(--baseClara)]">
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border focus:ring-2 outline-none placeholder:text-[var(--baseClara)]"
        />
        <input
          type="text"
          placeholder="Unidad"
          value={unidad_codigo}
          onChange={(e) => setUnidadCodigo(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border focus:ring-2 outline-none placeholder:text-[var(--baseClara)]"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--baseClara)] text-white py-2 rounded-lg font-semibold cursor-pointer hover:bg-[var(--baseOscura)] transition disabled:opacity-80"
        >
          {loading ? <Loading type="inline" text="Enviando..." color="#f8fffc" /> : "Enviar link"}
        </button>

        {error && (
          <p className="text-red-400 text-center text-sm">{error}</p>
        )}
      </form>

      <div className="mt-4 text-center text-sm text-gray-300">
        <a href="/auth" className="text-[#9099f5] hover:underline">
          Volver al inicio
        </a>
      </div>
    </div>
  );
}
