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
import { Bell, Building, CopyPlus, Edit, File, House, User } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function Propiedades() {
  const router = useRouter()
  const userCtx = useAdmin();
  const [dataTable, setDataTable] = useState<any[]>([]);
  const [filter, setFilter] = useState("");
  

  useEffect(() => {
    async function getUserData() {
      try {
        const res = await fetch("/api/admin/getpropiedades", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        const data = await res.json();
        setDataTable(
          data.map((a: any) => ({
            Id: a.id_propiedad,
            codigo: a.propiedad_codigo,
            propiedad: a.propiedad_nombre,
            direccion: a.propiedad_direccion,
            cuentas: a.cuentas_pendientes,
            unidades: a.unidades
          }))
        );
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    }
    getUserData();
  }, []);

  // 🧠 useMemo SIEMPRE se ejecuta
  const filteredData = useMemo(() => {
    const term = filter.toLowerCase();
    if (!term) return dataTable;
    return dataTable.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(term)
      )
    );
  }, [filter, dataTable]);

  // ⬇️ Ahora el return condicional se hace DESPUÉS
  if (!userCtx || !userCtx.adminData)
    return (
      <div className="text-[var(--baseOscura-admin)] text-center">
        Cargando datos de administrador...
      </div>
    );

  const { adminData } = userCtx;
  
  return (
    <div>
      <h1 className="flex items-center gap-2 text-[2em] text-[var(--baseOscura-admin)]">
        <Building />Propiedades
      </h1>

      {/* 🔍 Buscador + Botón */}
      <div className="flex justify-between items-center my-3">
        <input
          type="text"
          placeholder="Filtrar por código, nombre o dirección..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-[var(--baseOscura-admin)] rounded-lg px-3 py-2 w-full max-w-[400px] focus:outline-none focus:ring-1 focus:ring-[var(--baseOscura-admin)] text-[var(--baseOscura-admin)]"
        />

        <Button className="!flex !flex-row !items-center !gap-2 rounded-xl bg-[var(--baseOscura-admin)] text-white ml-3 cursor-pointer"
        onClick={() => router.push(`/admin/propiedades/editar`)}>
          Nueva propiedad
        </Button>
      </div>

      {/* 🧾 Tabla */}
        <Table className="rounded-lg overflow-hidden text-sm border border-[var(--baseMedia-admin)]">
          <TableHead
            className="text-white"
            style={{ background: "var(--colorTableHeader-admin)" }}
          >
            <TableRow>
              <TableHeaderCell className="px-4 py-2">Id</TableHeaderCell>
              <TableHeaderCell className="px-4 py-2">Código</TableHeaderCell>
              <TableHeaderCell className="px-4 py-2">Propiedad</TableHeaderCell>
              <TableHeaderCell className="px-4 py-2">Dirección</TableHeaderCell>
              <TableHeaderCell className="px-4 py-2">Cuentas Pendientes</TableHeaderCell>
              <TableHeaderCell className="px-4 py-2">Propiedades</TableHeaderCell>
              <TableHeaderCell className="px-4 py-2 text-center">
                Acción
              </TableHeaderCell>
            </TableRow>
          </TableHead>

          <TableBody className="bg-[var(--baseSuperClara-admin)] text-[var(--baseOscura-admin)]">
            {filteredData.length > 0 ? (
              filteredData.map((row, i) => (
                <TableRow key={i} className="odd:bg-[rgba(0,0,0,.03)] p-0">
                  <TableCell className="px-4 py-1">
                    {row.Id}
                  </TableCell>
                  <TableCell className="px-4 py-1">
                    {row.codigo}
                  </TableCell>
                  <TableCell className="px-4 py-1">
                    {row.propiedad}
                  </TableCell>
                  <TableCell className="px-4 py-1">
                    {row.direccion}
                  </TableCell>
                  <TableCell className="px-4 py-1">
                    {row.cuentas}
                  </TableCell>
                  <TableCell className="px-4 py-1">
                    {row.unidades}
                  </TableCell>
                  <TableCell className="flex justify-center gap-2 px-4 py-1">
                    <Button title="Editar" className="cursor-pointer rounded-xl bg-[var(--baseOscura-admin)] text-white " onClick={() => router.push(`/admin/propiedades/editar?id=${row.Id}`)}>
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button title="Editar" className="cursor-pointer rounded-xl bg-[var(--baseOscura-admin)] text-white " onClick={() => router.push(`/admin/unidades?propiedad=${row.codigo}`)}>
                      <House className="w-4 h-4" />
                    </Button>
                    <Button title="Ver cuentas" className="rounded-xl bg-[var(--baseOscura-admin)] text-white" >
                      <User className="w-4 h-4" />
                    </Button>
                    <Button title="Archivos" className="rounded-xl bg-[var(--baseOscura-admin)] text-white" >
                      <File className="w-4 h-4" />
                    </Button>
                    <Button title="Avisos" className="rounded-xl bg-[var(--baseOscura-admin)] text-white" >
                      <Bell className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Aún sin datos..
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      
    </div>
  );
}
