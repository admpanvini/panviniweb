"use client";

import { useEffect, useState } from "react";
import { Button, Card } from "@tremor/react";

interface AdminNotificacionInput {
  notificacion_titulo: string;
  notificacion: string;
  notificacion_seccion: number;
  propiedades: string[];      // ej: ["01","02"]
}

export default function EditarNotificaciones() {
  const [form, setForm] = useState<AdminNotificacionInput>({
    notificacion_titulo: "",
    notificacion: "",
    notificacion_seccion: 0,
    propiedades: []
  });
  const [propiedades, setPropiedades] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  // -------------------------------------------------------------------
  // 1) Cargar propiedades
  // -------------------------------------------------------------------
  useEffect(() => {
    async function getProps() {
      const res = await fetch("/api/admin/getpropiedades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setPropiedades(data);
    }
    getProps();
  }, []);

  async function handleSubmit(e:React.FormEvent){
    e.preventDefault();
    setErrorMsg("");

    const res = await fetch("/api/admin/savenotificacion", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify(form)
    });

    if(!res.ok){
      const d = await res.json();
      setErrorMsg(d.error || "Error");
      return;
    }

    location.href="/admin/notificaciones";
  }

  function toggleProp(cod:string){
    setForm(f=>({
      ...f,
      propiedades: f.propiedades.includes(cod)
        ? f.propiedades.filter(x=>x!==cod)
        : [...f.propiedades, cod]
    }));
  }

  return (
    <Card className="app-panel mx-auto max-w-5xl text-[var(--baseOscura-admin)]">
      <h1 className="text-[2em]">Nueva Notificación</h1>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-4">

        Título:
        <input
          className="app-input"
          value={form.notificacion_titulo}
          onChange={e=>setForm({...form,notificacion_titulo:e.target.value})}
        />

        Detalle:
        <textarea
          className="app-input"
          value={form.notificacion}
          onChange={e=>setForm({...form,notificacion:e.target.value})}
        />

        Sección:
        <select
          className="app-input"
          value={form.notificacion_seccion}
          onChange={e=>setForm({...form,notificacion_seccion:Number(e.target.value)})}
        >
          <option value={0}>Sin acción</option>
          <option value={5}>Ver Expensas y vencimientos</option>
          <option value={4}>Ver Teléfonos útiles</option>
          <option value={3}>Ver Documentos</option>
        </select>

        Propiedades:
        <div className="flex flex-wrap gap-2">
          <a className="app-button cursor-pointer"
              onClick={()=>{form.propiedades.length>0?setForm({...form,propiedades:[]}):setForm({...form,propiedades:propiedades.map(p=>p.id_propiedad)})}}>
              Todas las propiedades
          </a>
          {propiedades.sort((a,b)=>a.propiedad_nombre.trim().localeCompare(b.propiedad_nombre.trim())).map(p=>(
            <label key={p.id_propiedad} className={`flex items-center gap-2 border p-2 rounded cursor-pointer ${form.propiedades.includes(p.id_propiedad)?"bg-[var(--baseOscura-admin)] text-white":""}`}>
              <input
                type="checkbox"
                className="accent-[var(--baseClara-admin)] focus:ring-2 focus:ring-transparent"
                checked={form.propiedades.includes(p.id_propiedad)}
                onChange={()=>toggleProp(p.id_propiedad)}
              />
              {p.propiedad_nombre}
            </label>
          ))}
        </div>

        {errorMsg && (
          <div className="bg-red-500 text-white px-3 py-2 rounded">
            {errorMsg}
          </div>
        )}

        <Button
          type="submit"
          className="app-button w-full cursor-pointer"
        >
          Guardar
        </Button>
      </form>
    </Card>
  );
}
