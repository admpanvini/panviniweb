"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button, Card } from "@tremor/react";
import { Loading } from "../../template/Loading";

export default function EditarCuentas() {
  const [errorMsg, setErrorMsg] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Cargando datos..");
  const [propiedades, setPropiedades] = useState<any[]>([]);

  // por defecto: pendientes
  const [form, setForm] = useState({
    cuenta_titular: "",
    cuenta_email: "",
    cuenta_estado: "pendiente",
    cuenta_unidad_codigo:"",
    propiedad_codigo:"",
    cuenta_tipo:"pendientes",
    propiedad_nombre:"",
    cuenta_clave:"",
    cuenta_clave_2:""
  });

  function normalizarTipoCuenta(tipo:string) {
    if (tipo === "pendientes") return "inquilino";
    if (tipo === "activas") return "propietario";
    if (tipo === "eliminadas") return "inmobiliaria";
    return tipo;
  }

  function tipoCuentaParaForm(tipo:string) {
    if (tipo === "inquilino") return "pendientes";
    if (tipo === "propietario") return "activas";
    if (tipo === "inmobiliaria") return "eliminadas";
    return tipo;
  }

  // Si hay id, cargamos los datos existentes
  async function getCuenta(){
    if (!id) return;
      setLoading(true)
      setLoadingText("Buscando datos de cuenta a modificar..")
      const res = await fetch("/api/admin/getcuentas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({id_cuenta:id}),
      });
      setLoading(false)
      const data = await res.json();
      if(data.length==0){return}
      const p=data[0]
      console.log(p)
      setForm({
          cuenta_titular: p.cuenta_titular,
          cuenta_email: p.cuenta_email,
          cuenta_estado: p.cuenta_estado,
          cuenta_unidad_codigo:p.cuenta_unidad_codigo,
          propiedad_codigo: p.cuenta_unidad_codigo.substr(0,2),
          cuenta_tipo:tipoCuentaParaForm(p.cuenta_tipo),
          propiedad_nombre:'',
          cuenta_clave:'',
          cuenta_clave_2:''
      });
  }

  // -------------------------------------------------------------------
  // Cargar propiedades
  // -------------------------------------------------------------------
  useEffect(() => {
    setLoading(true)
    setLoadingText("Buscando propiedades..")
    async function getProps() {
      const res = await fetch("/api/admin/getpropiedades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setPropiedades(data);
      setLoading(false)
      getCuenta()
    }
    getProps();
  }, []);

  // Cuando cambia el código de unidad O cuando llegan las propiedades
  useEffect(() => {
    if (!form.cuenta_unidad_codigo || propiedades.length === 0) return;

    const codigoProp = form.cuenta_unidad_codigo.substring(0, 2);

    const prop = propiedades.find(
      (p) => p.propiedad_codigo === codigoProp
    );

    setForm((prev) => ({
      ...prev,
      propiedad_codigo: codigoProp,
      propiedad_nombre: prop ? prop.propiedad_nombre : "",
    }));
  }, [form.cuenta_unidad_codigo, propiedades]);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    if (!id && form.cuenta_clave !== form.cuenta_clave_2) {
      setErrorMsg("Las claves no coinciden");
      return;
    }
    setLoading(true)
    setLoadingText("Gurdando los datos de la cuenta...")
    const payload = {
      id_cuenta: id ? Number(id) : null,
      ...form,
      cuenta_tipo: normalizarTipoCuenta(form.cuenta_tipo)
    };
    const res = await fetch("/api/admin/savecuenta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }); 
    setLoading(false)
    if (!res.ok) {
      const data = await res.json();
      setErrorMsg(data.error || "Error al guardar");
      return;
    }
    router.push("/admin/cuentas");
  }

  return (
    <Card className="app-panel mx-auto max-w-5xl text-[var(--baseOscura-admin)]">
      { loading?
      (
        <Loading type="replace" height="150px" text={loadingText} />
      ):(
        <div>
          <h1 className="flex items-center gap-2 text-[2em]">
            {id ? "Editar Cuenta" : "Nueva Cuenta"}
          </h1>
          <p className="mb-2">{id ? `Id Cuenta: #${id}` : "Cree una nueva propiedad"}</p>
          <form onSubmit={handleSubmit} className="max-w-4xl space-y-4">
            Titular:
            <input
              type="text"
              placeholder="Nombre"
              value={form.cuenta_titular}
              onChange={(e) => setForm({ ...form, cuenta_titular: e.target.value })}
              className="app-input"
            />
            Código de unidad:
            <input
              type="text"
              placeholder="Dirección"
              value={form.cuenta_unidad_codigo}
              onChange={(e) => setForm({ ...form, cuenta_unidad_codigo: e.target.value, propiedad_codigo: e.target.value?.substring(0,2) || ""})}
              className="app-input"
            />
            Unidad asociada:<br/>
            <input
              type="text"
              placeholder="Dirección"
              value={form.propiedad_codigo}
              disabled
              className="app-input bg-[#00000010]"
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
            Email de cuenta:
            <input
              type="text"
              placeholder="Dirección"
              value={form.cuenta_email}
              onChange={(e) => setForm({ ...form, cuenta_email: e.target.value })}
              className="app-input"
            />
            Estado de la cuenta:
            <select
              value={form.cuenta_estado}
              onChange={(e) => setForm({ ...form, cuenta_estado: e.target.value })}
              className="app-input"
            >
              <option value="pendiente">Pendiente</option>
              <option value="activo">Activo</option>
              <option value="eliminado">Eliminado</option>
              <option value="inactivo">Inactivo</option>
            </select>
            Tipo de cuenta:
            <select
              value={form.cuenta_tipo}
              onChange={(e) => setForm({ ...form, cuenta_tipo: e.target.value })}
              className="app-input"
            >
              <option value="pendientes">Inquilino</option>
              <option value="activas">Dueño</option>
              <option value="eliminadas">Inmobiliaria</option>
            </select>
            {!id && (
              <>
                Clave inicial:
                <input
                  type="password"
                  placeholder="Clave inicial"
                  value={form.cuenta_clave}
                  onChange={(e) => setForm({ ...form, cuenta_clave: e.target.value })}
                  className="app-input"
                />
                Repetir clave inicial:
                <input
                  type="password"
                  placeholder="Repetir clave inicial"
                  value={form.cuenta_clave_2}
                  onChange={(e) => setForm({ ...form, cuenta_clave_2: e.target.value })}
                  className="app-input"
                />
              </>
            )}
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
        </div>
      )}
    </Card>
  );
}
