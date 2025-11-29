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

    if (!propiedadCodigo || !file || !titulo) {
      alert("Complete todos los campos.");
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

    if (!res.ok) {
      alert("Error al subir archivo");
      return;
    }

    router.push("/admin/documentos"); // volver al listado
  }

  return (
    <Card className="px-6 py-0 max-w-lg mx-auto text-[var(--baseOscura-admin)]">

      <h1 className="flex items-center gap-2 text-[2em]">
        Nuevo Documento
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">

        {/* Propiedad */}
        Propiedad:
        <select
          value={propiedadCodigo}
          onChange={(e) => setPropiedadCodigo(e.target.value)}
          className="w-full border rounded px-3 py-2"
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
          className="w-full border rounded px-3 py-2"
        />

        {/* Archivo */}
        Archivo (PDF / PNG / JPG):
        <input
          type="file"
          accept="application/pdf,image/png,image/jpeg"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full border rounded px-3 py-2"
        />

        <Button
          type="submit"
          disabled={loading}
          className="cursor-pointer bg-[var(--baseOscura-admin)] text-white rounded-xl w-full"
        >
          {loading ? "Subiendo..." : "Guardar documento"}
        </Button>
      </form>
    </Card>
  );
}
