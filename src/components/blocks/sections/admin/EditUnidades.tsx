"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button, Card } from "@tremor/react";

export default function EditarUnidades() {
  const searchParams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const id = searchParams.get("id");
  const [form, setForm] = useState({
    unidad_nombre: "",
    unidad_codigo: "",
    unidad_titular: "",
    unidad_estado: "",
    propiedad_codigo:""
  });

  // Si hay id, cargamos los datos existentes
  useEffect(() => {
    if (!id) return;
    (async () => {
        const res = await fetch("/api/admin/getunidades", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({id_unidad:id}),
        });
        const data = await res.json();
        if(data.lenght==0){return}
        const p=data[0]
        console.log(p)
        setForm({
          unidad_nombre: p.unidad_nombre,
          unidad_codigo: p.unidad_codigo,
          unidad_titular:p.unidad_titular,
          unidad_estado: p.unidad_estado,
          propiedad_codigo:p.unidad_codigo.substr(0,2)
        });;
    })();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    const res = await fetch("/api/admin/saveunidad", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_unidad: id ? Number(id) : null,
        ...form
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setErrorMsg(data.error || "Error al guardar");
      return;
    }

    router.push("/admin/unidades");
  }

  return (
    <Card className="px-6 py-0 max-w-lg mx-auto text-[var(--baseOscura-admin)]">
      <h1 className="flex items-center gap-2 text-[2em]">
        {id ? "Editar Unidad" : "Nueva Unidad"}
      </h1>
      <p className="mb-2">{id ? `Id unidad: #${id}` : "Cree una nueva unidad"}</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        Código de la unidad:
        <input
          type="text"
          placeholder="Dirección"
          value={form.unidad_codigo}
          onChange={(e) =>
            setForm({ ...form, unidad_codigo: e.target.value, propiedad_codigo: e.target.value?.substr(0,2) })
          }
          className="w-full border rounded px-3 py-2"
        />
        Propiedad asociada:<br/>
        <input
          type="text"
          placeholder="Dirección"
          value={form.propiedad_codigo}
          disabled
          className="w-[30%] border rounded px-3 py-2 bg-[#00000010]"
        />
        <input
          type="text"
          placeholder="Dirección"
          value={form.propiedad_codigo}
          disabled
          className="w-[68%] ml-[2%] border rounded px-3 py-2 bg-[#00000010]"
        />
        <br/>
        Nombre de la unidad:
        <input
          type="text"
          placeholder="Nombre"
          value={form.unidad_nombre}
          onChange={(e) => setForm({ ...form, unidad_nombre: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
        Titular de la unidad:
        <input
          type="text"
          placeholder="Código"
          value={form.unidad_titular}
          onChange={(e) =>
            setForm({ ...form, unidad_titular: e.target.value })
          }
          className="w-full border rounded px-3 py-2"
        />
        Estado de la unidad:
        <select
          value={form.unidad_estado}
          onChange={(e) => setForm({ ...form, unidad_estado: e.target.value })}
          className="w-full border rounded px-3 py-3"
        >
          <option value="pendiente">Pendiente</option>
          <option value="activo">Activo</option>
          <option value="eliminado">Eliminado</option>
          <option value="inactivo">Inactivo</option>
        </select>
        {errorMsg && (
          <div className="bg-red-500 text-white px-3 py-2 rounded">
            {errorMsg}
          </div>
        )}
        <Button
          type="submit"
          className="cursor-pointer bg-[var(--baseOscura-admin)] text-white w-full border rounded px-3 py-3"
        >
          Guardar
        </Button>
      </form>
    </Card>
  );
}
