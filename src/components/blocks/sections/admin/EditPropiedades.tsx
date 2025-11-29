"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button, Card } from "@tremor/react";

export default function EditarPropiedad() {
  const [errorMsg, setErrorMsg] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const [form, setForm] = useState({
    propiedad_nombre: "",
    propiedad_direccion: "",
    propiedad_codigo: "",
  });

  // Si hay id, cargamos los datos existentes
  useEffect(() => {
    if (!id) return;
    (async () => {
        const res = await fetch("/api/admin/getpropiedades", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({id_propiedad:id}),
        });
        const data = await res.json();
        if(data.lenght==0){return}
        const p=data[0]
        console.log(p)
        setForm({
            propiedad_nombre: p.propiedad_nombre || "",
            propiedad_direccion: p.propiedad_direccion || "",
            propiedad_codigo: p.propiedad_codigo || "",
        });
    })();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    alert(id ? Number(id) : null)
    const res = await fetch("/api/admin/savepropiedad", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_propiedad: id ? Number(id) : null, ...form }),
    });

    if (!res.ok) {
      const data = await res.json();
      setErrorMsg(data.error || "Error al guardar");
      return;
    }

    router.push("/admin/propiedades");
  }

  return (
    <Card className="px-6 py-0 max-w-lg mx-auto text-[var(--baseOscura-admin)]">
      <h1 className="flex items-center gap-2 text-[2em]">
        {id ? "Editar propiedad" : "Nueva propiedad"}
      </h1>
      <p className="mb-2">{id ? `Id propiedad a editar: ${id}` : "Cree una nueva propiedad"}</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        Nombre de propiedad:
        <input
          type="text"
          placeholder="Nombre"
          value={form.propiedad_nombre}
          onChange={(e) => setForm({ ...form, propiedad_nombre: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
        Dirección de la propiedad:
        <input
          type="text"
          placeholder="Dirección"
          value={form.propiedad_direccion}
          onChange={(e) =>
            setForm({ ...form, propiedad_direccion: e.target.value })
          }
          className="w-full border rounded px-3 py-2"
        />
        Código identificador de la propiedad:
        <input
          type="text"
          placeholder="Código"
          value={form.propiedad_codigo}
          onChange={(e) =>
            setForm({ ...form, propiedad_codigo: e.target.value })
          }
          className="w-full border rounded px-3 py-2"
        />
        {errorMsg && (
          <div className="bg-red-500 text-white mt-2 px-3 py-2 rounded">
            {errorMsg}
          </div>
        )}
        <Button
          type="submit"
          className="cursor-pointer bg-[var(--baseOscura-admin)] w-full text-white mt-2 px-3 py-2 rounded"
        >
          Guardar
        </Button>
      </form>
    </Card>
  );
}
