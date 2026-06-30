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
      <div className="auth-message">
        <p>Si los datos son correctos, te enviamos un email para cargar una nueva clave.</p>
        <a
          href="/auth"
          className="auth-button inline-block"
        >
          Volver al inicio
        </a>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-field"
        />
        <input
          type="text"
          placeholder="Unidad"
          value={unidad_codigo}
          onChange={(e) => setUnidadCodigo(e.target.value)}
          className="auth-field"
        />

        <button
          type="submit"
          disabled={loading}
          className="auth-button cursor-pointer"
        >
          {loading ? <Loading type="inline" text="Enviando..." color="#f8fffc" /> : "Enviar link"}
        </button>

        {error && (
          <p className="auth-error">{error}</p>
        )}
      </form>

      <div className="auth-helper">
        <a href="/auth" className="auth-link">
          Volver al inicio
        </a>
      </div>
    </div>
  );
}
