"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@tremor/react";

export default function EditarDocumento() {
  const router = useRouter();

  const [propiedades, setPropiedades] = useState<any[]>([]);
  const [propiedadCodigo, setPropiedadCodigo] = useState<string>("");
  const [titulo, setTitulo] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [reconnectUrl, setReconnectUrl] = useState("/api/admin/google");
  const [showReconnect, setShowReconnect] = useState(false);

  // 1) TRAER PROPIEDADES
  useEffect(() => {
    async function getProps() {
      const res = await fetch("/api/admin/getpropiedades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      console.log(data)
      setPropiedades(data);
    }
    getProps();
  }, []);

  // 2) ENVIAR FORMULARIO
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setShowReconnect(false);

    if (!propiedadCodigo || !file || !titulo) {
      setErrorMsg("Complete todos los campos.");
      return;
    }

    setLoading(true);

    const form = new FormData();
    form.append("folder", propiedadCodigo);
    form.append("file", file);
    form.append("titulo", titulo);
                                         
    const res = await fetch("/api/admin/uploaddocuments", {
      method: "POST",
      body: form,
    });

    setLoading(false);
    const data = await res.json();

    if (!res.ok) {
      if (data?.error_type === "google") {
        setReconnectUrl(data.reconnect_url || "/api/admin/google");
        setShowReconnect(true);
      }
      setErrorMsg(data?.error || "Error al subir archivo");
      return;
    }

    router.push("/admin/documentos"); // volver al listado
  }

  return (
    <Card className="app-panel mx-auto max-w-5xl text-[var(--baseOscura-admin)]">

      <h1 className="flex items-center gap-2 text-[2em]">
        Nuevo Documento
      </h1>

      <form onSubmit={handleSubmit} className="mt-4 max-w-4xl space-y-4">

        {/* Propiedad */}
        Propiedad:
        <select
          value={propiedadCodigo}
          onChange={(e) => setPropiedadCodigo(e.target.value)}
          className="app-input"
        >
          <option value="">Seleccione propiedad</option>
          {propiedades.map((p: any) => (
            <option key={p.propiedad_codigo} value={p.propiedad_codigo}>
              {p.propiedad_nombre} ({p.propiedad_codigo})
            </option>
          ))}
        </select>

        {/* Titulo */}
        Título del documento:
        <input
          type="text"
          placeholder="Ej: Expensas Marzo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="app-input"
        />

        {/* Archivo */}
        Archivo (PDF / PNG / JPG):
        <input
          type="file"
          accept="application/pdf,image/png,image/jpeg"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="app-input"
        />

        <Button
          type="submit"
          disabled={loading}
          className="app-button w-full cursor-pointer"
        >
          {loading ? "Subiendo..." : "Guardar documento"}
        </Button>

        {errorMsg && (
          <div className="text-[#a62942] text-sm italic mt-2 px-3 py-2 rounded">
            Atención: {errorMsg}
            {showReconnect && (
              <Button
                type="button"
                className="app-button ml-2 cursor-pointer"
                onClick={() => { window.location.href = reconnectUrl; }}
              >
                Reestablecer conexión
              </Button>
            )}
          </div>
        )}
      </form>
    </Card>
  );
}
