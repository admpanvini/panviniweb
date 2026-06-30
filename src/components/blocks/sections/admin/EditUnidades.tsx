"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button, Card } from "@tremor/react";
import { Loading } from "../../template/Loading";

export default function EditarUnidades() {
  const searchParams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const id = searchParams.get("id");
  const [propiedades, setPropiedades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Cargando datos..");


  const [form, setForm] = useState({
    unidad_nombre: "",
    unidad_codigo: "",
    unidad_titular: "",
    unidad_estado: "",
    propiedad_codigo:"",
    propiedad_nombre:""
  });

  // Si hay id, cargamos los datos existentes
  async function getUnidades(){
    if (!id) return;
    setLoading(true)
    setLoadingText("Cargando la unidad..")
    const res = await fetch("/api/admin/getunidades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({id_unidad:id}),
    });
    const data = await res.json();
    if(data.length==0){return}
    const p=data[0]
    console.log(p)
    setForm({
      unidad_nombre: p.unidad_nombre,
      unidad_codigo: p.unidad_codigo,
      unidad_titular:p.unidad_titular,
      unidad_estado: p.unidad_estado,
      propiedad_codigo:p.unidad_codigo.substr(0,2),
      propiedad_nombre:""
    });
    setLoading(false)
  }

    // -------------------------------------------------------------------
  // Cargar propiedades
  // -------------------------------------------------------------------
  useEffect(() => {
    async function getProps() {
      setLoading(true)
      setLoadingText("Cargando las propiedades..")
      const res = await fetch("/api/admin/getpropiedades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setLoading(false)
      setPropiedades(data);
      getUnidades()
    }
    getProps();
  }, []);

  // Cuando cambia el código de unidad O cuando llegan las propiedades
  useEffect(() => {
    if (!form.unidad_codigo || propiedades.length === 0) return;
    const codigoProp = form.unidad_codigo.substring(0, 2);
    const prop = propiedades.find(
      (p) => p.propiedad_codigo === codigoProp
    );
    setForm((prev) => ({
      ...prev,
      propiedad_codigo: codigoProp,
      propiedad_nombre: prop ? prop.propiedad_nombre : "",
    }));
  }, [form.unidad_codigo, propiedades]);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true)
    setLoadingText("Guardando cambios de la unidad..")
    const res = await fetch("/api/admin/saveunidad", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_unidad: id ? Number(id) : null,
        ...form
      }),
    });

    setLoading(false)
    if (!res.ok) {
      const data = await res.json();
      setErrorMsg(data.error || "Error al guardar");
      return;
    }
    router.push("/admin/unidades?propiedad="+form.propiedad_codigo);
  }

  return (
    <Card className="app-panel mx-auto max-w-5xl text-[var(--baseOscura-admin)]">
      {
        loading?
        (
          <Loading type="replace" height="150px" text={loadingText} />
        ):(
          <div>
            <h1 className="flex items-center gap-2 text-[2em]">
              {id ? "Editar Unidad" : "Nueva Unidad"}
            </h1>
            <p className="mb-2">{id ? `Id unidad: #${id}` : "Cree una nueva unidad"}</p>
            <form onSubmit={handleSubmit} className="max-w-4xl space-y-4">
              Código de la unidad:
              <input
                type="text"
                placeholder="Dirección"
                value={form.unidad_codigo}
                onChange={(e) =>
                  setForm({ ...form, unidad_codigo: e.target.value, propiedad_codigo: e.target.value?.substr(0,2) })
                }
                className="app-input"
              />
              Propiedad asociada:<br/>
              <input
                type="text"
                placeholder="Dirección"
                value={form.propiedad_codigo}
                disabled
                className="app-input inline-block w-[30%] bg-[#00000010]"
              />
              <input
                type="text"
                placeholder="Dirección"
                value={form.propiedad_nombre}
                disabled
                className="app-input ml-[2%] inline-block w-[68%] bg-[#00000010]"
              />
              <br/>
              Nombre de la unidad:
              <input
                type="text"
                placeholder="Nombre"
                value={form.unidad_nombre}
                onChange={(e) => setForm({ ...form, unidad_nombre: e.target.value })}
                className="app-input"
              />
              Titular de la unidad:
              <input
                type="text"
                placeholder="Código"
                value={form.unidad_titular}
                onChange={(e) =>
                  setForm({ ...form, unidad_titular: e.target.value })
                }
                className="app-input"
              />
              Estado de la unidad:
              <select
                value={form.unidad_estado}
                onChange={(e) => setForm({ ...form, unidad_estado: e.target.value })}
                className="app-input"
              >
                <option value="pendiente">Pendiente</option>
                <option value="activo">Activo</option>
                <option value="eliminado">Eliminado</option>
                <option value="inactivo">Inactivo</option>
              </select>
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
