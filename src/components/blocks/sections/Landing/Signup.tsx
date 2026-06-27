"use client";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Loading } from "../../template/Loading";

export default function SignUpForm() {
  const [form, setForm] = useState({
    name: "",
    unidad: "",
    email: "",
    password: "",
    repeat: "",
    cuenta_tipo: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  

  const validate = () => {
    if (!form.name) return "El nombre es obligatorio";
    if (!form.cuenta_tipo) return "El tipo de cuenta es obligatorio";
    if (!form.unidad) return "La unidad es obligatoria";
    if (!form.email.includes("@")) return "Email inválido";
    if (form.password.length < 6) return "La clave debe tener al menos 6 caracteres";
    if (form.password !== form.repeat) return "Las claves no coinciden";
    return "";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const err = validate();
    if (err) return setError(err);

    try {
      setLoading(true);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Error al registrarse");
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError("Error de conexión");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center text-white space-y-4">
        <p>Tu cuenta fue creada y quedo pendiente de aprobacion.</p>
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          onChange={handleChange}
          placeholder="Nombre"
          className="w-full px-4 py-2 rounded-lg border focus:ring-2 outline-none placeholder:text-[var(--baseClara)]"
        />
        <select
          name="cuenta_tipo"
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-[#FFF] focus:ring-2 outline-none"
          style={{ color: form.cuenta_tipo == "" ? "var(--baseClara)" : "#FFF" }}
        >
          <option value="" className={`text-[var(--baseOscura)]`}>Elegir tipo de cuenta</option>
          <option value="inquilino" className={`text-[var(--baseOscura)]`}>Inquilino</option>
          <option value="propietario" className={`text-[var(--baseOscura)]`}>Propietario</option>
          <option value="inmobiliaria" className={`text-[var(--baseOscura)]`}>Inmobiliaria</option>
        </select>

        <input
          name="unidad"
          onChange={handleChange}
          placeholder="Unidad"
          autoComplete="false"
          className="w-full px-4 py-2 rounded-lg border focus:ring-2 outline-none placeholder:text-[var(--baseClara)]"
        />

        <input
          name="email"
          onChange={handleChange}
          placeholder="Email"
          className="w-full px-4 py-2 rounded-lg border focus:ring-2 outline-none placeholder:text-[var(--baseClara)]"
        />

        <input
          type="password"
          name="password"
          onChange={handleChange}
          placeholder="Clave"
          className="w-full px-4 py-2 rounded-lg border focus:ring-2 outline-none placeholder:text-[var(--baseClara)]"
        />

        <input
          type="password"
          name="repeat"
          onChange={handleChange}
          placeholder="Repetir clave"
          className="w-full px-4 py-2 rounded-lg border focus:ring-2 outline-none placeholder:text-[var(--baseClara)]" 
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--baseClara)] text-white py-2 rounded-lg font-semibold cursor-pointer hover:bg-[var(--baseOscura)] transition disabled:opacity-80"
        >
          { loading ? <Loading type="inline" text="Registrando..." color="#f8fffc" /> : "Registrarse"}
        </button>

        {error && (
          <p className="text-red-400 text-center  text-sm">{error}</p>
        )}
      </form>

      <div className="mt-4 text-center text-sm text-gray-300">
        <p>
          ¿Ya tenés cuenta?{" "}
          <a href="/auth" className="text-[#9099f5] hover:underline">
            Iniciá sesión
          </a>
        </p>
      </div>
    </div>
  );
}
