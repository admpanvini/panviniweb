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
      <div className="auth-message">
        <p>Tu cuenta fue creada y quedo pendiente de aprobacion.</p>
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          onChange={handleChange}
          placeholder="Nombre"
          className="auth-field"
        />
        <select
          name="cuenta_tipo"
          onChange={handleChange}
          className="auth-field"
        >
          <option value="">Elegir tipo de cuenta</option>
          <option value="inquilino">Inquilino</option>
          <option value="propietario">Propietario</option>
          <option value="inmobiliaria">Inmobiliaria</option>
        </select>

        <input
          name="unidad"
          onChange={handleChange}
          placeholder="Unidad"
          autoComplete="false"
          className="auth-field"
        />

        <input
          name="email"
          onChange={handleChange}
          placeholder="Email"
          className="auth-field"
        />

        <input
          type="password"
          name="password"
          onChange={handleChange}
          placeholder="Clave"
          className="auth-field"
        />

        <input
          type="password"
          name="repeat"
          onChange={handleChange}
          placeholder="Repetir clave"
          className="auth-field" 
        />

        <button
          type="submit"
          disabled={loading}
          className="auth-button cursor-pointer"
        >
          { loading ? <Loading type="inline" text="Registrando..." color="#f8fffc" /> : "Registrarse"}
        </button>

        {error && (
          <p className="auth-error">{error}</p>
        )}
      </form>

      <div className="auth-helper">
        <p>
          ¿Ya tenés cuenta?{" "}
          <a href="/auth" className="auth-link">
            Iniciá sesión
          </a>
        </p>
      </div>
    </div>
  );
}
