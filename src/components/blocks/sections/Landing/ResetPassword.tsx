"use client";
import { useEffect, useState } from "react";
import { Loading } from "../../template/Loading";

export default function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkToken = async () => {
      if (!token) {
        setError("El link no es valido");
        setChecking(false);
        return;
      }

      try {
        const res = await fetch(`/api/auth/reset?token=${encodeURIComponent(token)}`);

        if (!mounted) return;

        if (!res.ok) {
          const data = await res.json();
          setError(data?.error || "El link no es valido o ya vencio");
          setTokenValid(false);
          setChecking(false);
          return;
        }

        setTokenValid(true);
        setChecking(false);

      } catch {
        if (!mounted) return;

        setError("No se pudo validar el link");
        setTokenValid(false);
        setChecking(false);
      }
    };

    checkToken();

    return () => {
      mounted = false;
    };
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("La clave debe tener al menos 6 caracteres");
      return;
    }

    if (password !== repeat) {
      setError("Las claves no coinciden");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/reset", {
        method: "POST",
        body: JSON.stringify({ token, password, repeat }),
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "No se pudo actualizar la clave");
        setLoading(false);
        return;
      }

      setSuccess(true);

    } catch {
      setError("Error de conexion");
      setLoading(false);
    }
  };

  if (checking) {
    return <Loading type="replace" text="Validando link..." height="120px" color="#f8fffc" />;
  }

  if (!tokenValid) {
    return (
      <div className="text-center text-white space-y-4">
        <p>{error || "El link no es valido o ya vencio"}</p>
        <a
          href="/auth/recover"
          className="inline-block bg-[#9099f5] px-4 py-2 rounded-lg"
        >
          Pedir nuevo link
        </a>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center text-white space-y-4">
        <p>Tu clave fue actualizada correctamente.</p>
        <a
          href="/auth"
          className="inline-block bg-[#9099f5] px-4 py-2 rounded-lg"
        >
          Iniciar sesion
        </a>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-3 text-[var(--baseSuperClara)] border-[var(--baseClara)] focus:ring-[var(--baseClara)]">
        <input
          type="password"
          placeholder="Nueva clave"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border focus:ring-2 outline-none placeholder:text-[var(--baseClara)]"
        />
        <input
          type="password"
          placeholder="Repetir nueva clave"
          value={repeat}
          onChange={(e) => setRepeat(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border focus:ring-2 outline-none placeholder:text-[var(--baseClara)]"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--baseClara)] text-white py-2 rounded-lg font-semibold cursor-pointer hover:bg-[var(--baseOscura)] transition disabled:opacity-80"
        >
          {loading ? <Loading type="inline" text="Guardando..." color="#f8fffc" /> : "Guardar nueva clave"}
        </button>

        {error && (
          <p className="text-red-400 text-center text-sm">{error}</p>
        )}
      </form>
    </div>
  );
}
