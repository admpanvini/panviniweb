"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button, Card } from "@tremor/react";
import { Loading } from "../../template/Loading";

export default function EditarPropiedad() {
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Cargando datos..");
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [form, setForm] = useState({
    propiedad_nombre: "",
    propiedad_direccion: "",
    propiedad_codigo: "",
    propiedad_datos: [] as Array<{ nombre: string; dato: string; tipo: string }>
  });

  // --- Convertir texto BD → array ---
  function parseDatos(texto: string) {
    if (!texto) return [];
    return texto.split("||").map((item) => {
      const [nombre, dato, tipo] = item.split("//");
      return { nombre: nombre || "", dato: dato || "", tipo: tipo || "" };
    });
  }

  // --- Convertir array → texto BD ---
  function stringifyDatos(arr: Array<{ nombre: string; dato: string; tipo: string }>) {
    return arr
      .map((c) => `${c.nombre}//${c.dato}//${c.tipo}`)
      .join("||");
  }

  // Cargar datos si hay id
  useEffect(() => {
    setLoading(false)
    if (!id) return;
    (async () => {
      setLoading(true)
      setLoadingText("Buscando datos de la propiedad..")
      const res = await fetch("/api/admin/getpropiedades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_propiedad: id }),
      });
      setLoading(false)
      const data = await res.json();
      if (!data || !data.length) return;
      const p = data[0];
      setForm({
        propiedad_nombre: p.propiedad_nombre || "",
        propiedad_direccion: p.propiedad_direccion || "",
        propiedad_codigo: p.propiedad_codigo || "",
        propiedad_datos: parseDatos(p.propiedad_datos || "")
      });
    })();
  }, [id]);

  // --- Submit ---
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    const payload = {
      id_propiedad: id ? Number(id) : null,
      ...form,
      propiedad_datos: stringifyDatos(form.propiedad_datos)
    };
    setLoading(true)
    setLoadingText("Guardando datos de la propiedad..")
    const res = await fetch("/api/admin/savepropiedad", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false)
    if (!res.ok) {
      const data = await res.json();
      if (data.error) {
        setErrorMsg(data.error || "Error al guardar");
        return;
      }
    }
    router.push("/admin/propiedades");
  }

  // --- Agregar contacto ---
  function addContacto() {
    setForm({
      ...form,
      propiedad_datos: [...form.propiedad_datos, { nombre: "", dato: "", tipo: "phone" }]
    });
  }

  // --- Editar contacto ---
  function updateContacto(index: number, key: string, value: string) {
    const nuevo = [...form.propiedad_datos];
    nuevo[index] = { ...nuevo[index], [key]: value };
    setForm({ ...form, propiedad_datos: nuevo });
  }

  // --- Eliminar contacto ---
  function removeContacto(index: number) {
    const nuevo = [...form.propiedad_datos];
    nuevo.splice(index, 1);
    setForm({ ...form, propiedad_datos: nuevo });
  }

  return (
    <Card className="app-panel mx-auto max-w-5xl text-[var(--baseOscura-admin)]">
      {
        loading?(
          <Loading type="replace" height="150px" text={loadingText} />
        ):(
        <div>
          <h1 className="flex items-center gap-2 text-[2em]">
            {id ? "Editar propiedad" : "Nueva propiedad"}
          </h1>
          <form onSubmit={handleSubmit} className="max-w-4xl space-y-4">
            {/* Campos normales */}
            <input
              type="text"
              placeholder="Nombre"
              value={form.propiedad_nombre}
              onChange={(e) => setForm({ ...form, propiedad_nombre: e.target.value })}
              className="app-input"
            />

            <input
              type="text"
              placeholder="Dirección"
              value={form.propiedad_direccion}
              onChange={(e) =>
                setForm({ ...form, propiedad_direccion: e.target.value })
              }
              className="app-input"
            />

            <input
              type="text"
              placeholder="Código"
              value={form.propiedad_codigo}
              onChange={(e) =>
                setForm({ ...form, propiedad_codigo: e.target.value })
              }
              className="app-input"
            />

            {/* --- Contactos dinámicos --- */}
            <h2 className="text-xl mt-4">Datos de contacto</h2>

            {form.propiedad_datos.map((c, i) => (
              <div key={i} className="p-3 rounded space-y-2 bg-white/70 shadow text-dark">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={c.nombre}
                  onChange={(e) => updateContacto(i, "nombre", e.target.value)}
                  className="app-input"
                />

                <input
                  type="text"
                  placeholder="Dato (tel/email/etc)"
                  value={c.dato}
                  onChange={(e) => updateContacto(i, "dato", e.target.value)}
                  className="app-input"
                />

                <select
                  value={c.tipo}
                  onChange={(e) => updateContacto(i, "tipo", e.target.value)}
                  className="app-input"
                >
                  <option value="phone">Teléfono</option>
                  <option value="wa">WhatsApp</option>
                  <option value="email">Email</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeContacto(i)}
                  className="bg-red-200 text-dark text-[.6em] px-2 py-1 rounded cursor-pointer"
                >
                  Eliminar
                </button>
              </div>
            ))}

            <Button
              type="button"
              onClick={addContacto}
              className="text-dark w-[50%]  rounded bg-[var(--baseClara-admin)]"
            >
              Agregar contacto
            </Button>

            {errorMsg && (
              <div className="text-[#a62942] text-sm italic mt-2 px-3 py-2 rounded">
                Atención: {errorMsg}
              </div>
            )}

            <Button
              type="submit"
              className="app-button w-full cursor-pointer"
            >
              Guardar
            </Button>
          </form>
        </div>
      )}
    </Card>
  );
}
