"use client";

import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableCell,
  TableBody,
} from "@tremor/react";

import { useAdmin } from "./AdminContext";
import { Edit, User, File, Bell, User2Icon } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import formatFechaArgentina from "@/components/helpers/dataFormat";
import { Loading } from "../../template/Loading";

export default function Cuentas() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propiedadFromQuery = searchParams.get("propiedad");

  const userCtx = useAdmin();

  const [propiedades, setPropiedades] = useState<any[]>([]);
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState<string | null>(null);

  // por defecto: pendientes
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<string>("todas");

  const [dataTable, setDataTable] = useState<any[]>([]);
  const [filter, setFilter] = useState("");
  const [limit, setLimit] = useState(30); // paginación local

  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Cargando datos..");

  // ------------------------------------------------------------
  // 1) Traer propiedades
  // ------------------------------------------------------------
  useEffect(() => {
    async function getProps() {
      setLoading(true)
      setLoadingText("Buscando propiedades..")
      const res = await fetch("/api/admin/getpropiedades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      setLoading(false)
      const data = await res.json();
      setPropiedades(data);
      getCuentas();
    }
    getProps();
  }, []);

  // ------------------------------------------------------------
  // 2) Si vino por query → setear
  // ------------------------------------------------------------
  useEffect(() => {
    if (propiedadFromQuery) {
      setPropiedadSeleccionada(propiedadFromQuery);
      router.replace("/admin/cuentas", { scroll: false });
    }
  }, [propiedadFromQuery, router]);

  // ------------------------------------------------------------
  // 3) Traer TODAS las cuentas una vez
  // ------------------------------------------------------------
  async function getCuentas() {
    setLoading(true)
    setLoadingText("Descargando cuentas..")
    const res = await fetch("/api/admin/getcuentas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}), // TRAE TODO
    });
    setLoading(false)
    const data = await res.json();
    console.log(data)
    setDataTable(data);
  }

  // Reset de límite cuando cambian filtros
  useEffect(() => {
    setLimit(30);
  }, [estadoSeleccionado, propiedadSeleccionada, filter]);

  // ------------------------------------------------------------
  // 4) Filtro completo + limit
  // ------------------------------------------------------------
  const filteredData = useMemo(() => {
    let rows = dataTable;

    // Filtro estado
    if (estadoSeleccionado === "pendientes") {
      rows = rows.filter(r => r.cuenta_estado === "pendiente");
    } else if (estadoSeleccionado === "activas") {
      rows = rows.filter(r => r.cuenta_estado === "activo");
    } else if (estadoSeleccionado === "eliminadas") {
      rows = rows.filter(r => r.cuenta_estado === "eliminado");
    }

    // Filtro por propiedad
    if (propiedadSeleccionada) {
      rows = rows.filter(r => r.cuenta_unidad_codigo.substring(0, 2) === propiedadSeleccionada);
    }

    // Filtro por texto
    const term = filter.toLowerCase();
    if (term) {
      rows = rows.filter(row =>
        Object.values(row).some(val =>
          String(val).toLowerCase().includes(term)
        )
      );
    }

    return rows.slice(0, limit);
  }, [filter, dataTable, propiedadSeleccionada, estadoSeleccionado, limit]);

  return (
    <div>
    {loading?
    (
      <Loading type="replace" height="150px" text={loadingText} />
    )
    :(
      <div className="text-[var(--baseOscura-admin)]">
          <h1 className="flex items-center gap-2 text-[2em] ">
            <User2Icon /> Cuentas
          </h1>

          {/* FILTROS */}
          <div className="items-center my-3 gap-3">
            
            {/* Propiedad */}
            Propiedad:
            <select
              value={propiedadSeleccionada || ""}
              onChange={(e) => setPropiedadSeleccionada(e.target.value || null)}
              className="border border-[var(--baseOscura-admin)] rounded-lg px-3 py-2.5 w-full max-w-[200px] mx-2"
            >
              <option value="">Filtro por propiedad</option>
              <option value="admin">Admin</option>
              {propiedades.map((p: any) => (
                <option key={p.propiedad_codigo} value={p.propiedad_codigo}>
                  {p.propiedad_nombre} ({p.propiedad_codigo})
                </option>
              ))}
            </select>

            {/* Estado */}
            Estado:
            <select
              value={estadoSeleccionado}
              onChange={(e) => setEstadoSeleccionado(e.target.value)}
              className="border border-[var(--baseOscura-admin)] rounded-lg px-3 py-2.5 w-full max-w-[150px] mx-2"
            >
              <option value="pendientes">Pendientes</option>
              <option value="activas">Activas</option>
              <option value="eliminadas">Eliminadas</option>
              <option value="todas">Todas</option>
            </select>

            {/* Buscador */}
            Buscar:
            <input
              type="text"
              placeholder="Buscar..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-[var(--baseOscura-admin)] rounded-lg px-3 py-2 w-full max-w-[250px] mx-2"
            />

            <Button
              className="rounded-xl bg-[var(--baseOscura-admin)] text-white px-3 py-2.5 float-right cursor-pointer"
              onClick={() => router.push("/admin/cuentas/crear")}
            >
              Nueva cuenta
            </Button>
          </div>

          {/* Tabla */}
          Total cuentas : { dataTable.filter((r:any) => r.cuenta_estado === "pendiente" || r.cuenta_estado === "activo").length } - Pendientes: { dataTable.filter((r:any) => r.cuenta_estado === "pendiente").length } - Activas: { dataTable.filter((r:any) => r.cuenta_estado === "activo").length } 
          <Table className="rounded-lg overflow-hidden text-sm border border-[var(--baseMedia-admin)]">
            <TableHead 
              className="text-white"
              style={{ background: "var(--colorTableHeader-admin)" }}>
              <TableRow>
                <TableHeaderCell className="px-4 py-2">ID</TableHeaderCell>
                <TableHeaderCell className="px-4 py-2">Email</TableHeaderCell>
                <TableHeaderCell className="px-4 py-2">Usuario</TableHeaderCell>
                <TableHeaderCell className="px-4 py-2">Codigo</TableHeaderCell>
                <TableHeaderCell className="px-4 py-2">Unidad</TableHeaderCell>
                <TableHeaderCell className="px-4 py-2">Prop</TableHeaderCell>
                <TableHeaderCell className="px-4 py-2">Tipo</TableHeaderCell>
                <TableHeaderCell className="px-4 py-2">Estado</TableHeaderCell>
                <TableHeaderCell className="px-4 py-2">Ultima conexión</TableHeaderCell>
                <TableHeaderCell className="text-center px-4 py-2">Acciones</TableHeaderCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredData.length ? (
                filteredData.map((row: any, i) => (
                  <TableRow key={i} className="odd:bg-[rgba(0,0,0,.03)]">
                    <TableCell className="px-2 py-2">{row.id_cuenta}</TableCell>
                    <TableCell className="px-2 py-2" style={{maxWidth:"100px"}}>{row.cuenta_titular}</TableCell>
                    <TableCell className="px-2 py-2">{row.cuenta_email}</TableCell>
                    <TableCell className="px-2 py-2">{row.cuenta_unidad_codigo}</TableCell>
                    <TableCell className="px-2 py-2">{row.unidad_nombre}</TableCell>
                    <TableCell className="px-2 py-2">{row.propiedad_nombre}</TableCell>
                    <TableCell className="px-2 py-2">{row.cuenta_tipo}</TableCell>
                    <TableCell className="px-2 py-2">{row.cuenta_estado}</TableCell>
                    <TableCell className="px-2 py-2">{formatFechaArgentina(row.cuenta_conexion, "DMA", true)}</TableCell>
                    <TableCell className="px-4 py-2 flex gap-2 justify-center">
                      <Button
                        className="cursor-pointer rounded-xl bg-[var(--baseOscura-admin)] text-white"
                        onClick={() => router.push(`/admin/cuentas/editar?id=${row.id_cuenta}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-4">
                    Cargando cuentas.. (puede tomar algunos segundos)
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Cargar más */}
          {filteredData.length >= limit && (
            <div className="flex justify-center my-4">
              <Button
                className="cursor-pointer rounded-xl bg-[var(--baseOscura-admin)] text-white"
                onClick={() => setLimit(limit + 30)}
              >
                Cargar más
              </Button>
            </div>
          )}
      </div>
    )}
    </div>
  );
}
