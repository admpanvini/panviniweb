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
import { Edit, User2Icon } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import formatFechaArgentina from "@/components/helpers/dataFormat";
import { Loading } from "../../template/Loading";

export default function Administradores() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const userCtx = useAdmin();

  

  // por defecto: pendientes
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<string>("todas");

  const [dataTable, setDataTable] = useState<any[]>([]);
  const [filter, setFilter] = useState("");
  const [limit, setLimit] = useState(30); // paginación local

  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Cargando datos..");

  // ------------------------------------------------------------
  // 1) Traer TODAS las cuentas una vez
  // ------------------------------------------------------------
  useEffect(() => {
    async function getCuentas() {
      setLoading(true)
      setLoadingText("Buscando cuentas..")
      const res = await fetch("/api/admin/getadmins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}), // TRAE TODO
      });
      setLoading(false)
      const data = await res.json();
      console.log(data)
      setDataTable(data);
    }
    getCuentas();
  }, []);

  // Reset de límite cuando cambian filtros
  useEffect(() => {
    setLimit(30);
  }, [estadoSeleccionado, filter]);

  // ------------------------------------------------------------
  // 2) Filtro completo + limit
  // ------------------------------------------------------------
  const filteredData = useMemo(() => {
    let rows = dataTable;
    // Filtro estado
    if (estadoSeleccionado != "todas") {
      rows = rows.filter(r => r.cuenta_estado === estadoSeleccionado);
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
  }, [filter, dataTable, estadoSeleccionado, limit]);

  return (
    <div>
    {loading?
    (
      <Loading type="replace" height="150px" text={loadingText} />
    )
    :(
      <div className="text-[var(--baseOscura-admin)]">
          <h1 className="flex items-center gap-2 text-[2em] ">
            <User2Icon /> Administradores
          </h1>

          {/* FILTROS */}
          <div className="items-center my-3 gap-3">
            
            {/* Estado */}
            Estado:
            <select
              value={estadoSeleccionado}
              onChange={(e) => setEstadoSeleccionado(e.target.value)}
              className="border border-[var(--baseOscura-admin)] rounded-lg px-3 py-2.5 w-full max-w-[150px] mx-2"
            >
              <option value="pendiente">Pendientes</option>
              <option value="activo">Activas</option>
              <option value="eliminado">Eliminadas</option>
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
                    <TableCell className="px-2 py-2">{row.cuenta_tipo}</TableCell>
                    <TableCell className="px-2 py-2">{row.cuenta_estado}</TableCell>
                    <TableCell className="px-2 py-2">{formatFechaArgentina(row.cuenta_conexion, "DMA", true)}</TableCell>
                    <TableCell className="px-4 py-2 flex gap-2 justify-center">
                      <Button
                        className="cursor-pointer rounded-xl bg-[var(--baseOscura-admin)] text-white"
                        onClick={() => router.push(`/admin/administradores/editar?id=${row.id_cuenta}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-4">
                    No hay administradores para mostrar
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
