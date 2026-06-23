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
import { Bell, Building, CopyPlus, Edit, File, Folder, FolderArchive, Home, House, User } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "../../template/Loading";

export default function Propiedades() {
  const router = useRouter()
  const userCtx = useAdmin();
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Cargando datos..");
  const [dataTable, setDataTable] = useState<any[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    async function getUserData() {
      setLoadingText("Cargando propiedades..")
      try {
        const res = await fetch("/api/admin/getpropiedades", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        const data = await res.json();
        setLoading(false)
        setDataTable(
          data.map((a: any) => ({
            Id: a.id_propiedad,
            codigo: a.propiedad_codigo,
            propiedad: a.propiedad_nombre,
            direccion: a.propiedad_direccion,
            cuentas_pendientes: a.cuentas_pendientes,
            cuentas_totales: a.cuentas_total,
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

  return (
    <div>
      {
      loading ? 
      (
        <Loading type="replace" height="150px" text={loadingText} />
      ) : (
        <div className="text-[var(--baseOscura-admin)]">
          <h1 className="flex items-center gap-2 text-[2em] text-[var(--baseOscura-admin)]">
            <Building />Propiedades
          </h1>

          {/* 🔍 Buscador + Botón */}
          <div className="items-center my-3 gap-3">
            Buscar texto:<input
              type="text"
              placeholder="Filtrar por código, nombre o dirección..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-[var(--baseOscura-admin)] rounded-lg px-3 py-2 w-full max-w-[400px] focus:outline-none focus:ring-1 focus:ring-[var(--baseOscura-admin)] mx-2"
            />

            <Button className="rounded-xl bg-[var(--baseOscura-admin)] text-white px-3 py-2.5 float-right cursor-pointer"
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
                  <TableHeaderCell className="px-4 py-2"></TableHeaderCell>
                  <TableHeaderCell className="px-4 py-2">Propiedad</TableHeaderCell>
                  <TableHeaderCell className="px-4 py-2">Dirección</TableHeaderCell>
                  <TableHeaderCell className="px-4 py-2">Nro de unidades</TableHeaderCell>
                  <TableHeaderCell className="px-4 py-2">Cuentas Activas</TableHeaderCell>
                  <TableHeaderCell className="px-4 py-2">Cuentas Pendientes</TableHeaderCell>
                  <TableHeaderCell className="px-4 py-2 text-center">
                    Acción
                  </TableHeaderCell>
                </TableRow>
              </TableHead>

              <TableBody className="text-[var(--baseOscura-admin)]">
                {filteredData.length > 0 ? (
                  filteredData.map((row, i) => (
                    <TableRow key={i} className="odd:bg-[rgba(0,0,0,.03)] p-0">
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
                        <a title="Ver Unidades" className="cursor-pointer" onClick={() => router.push(`/admin/unidades?propiedad=${row.codigo}`)}>{row.unidades}</a>
                      </TableCell>
                      <TableCell className="px-4 py-1">
                        <a title="Ver cuentas" className="cursor-pointer" onClick={() => router.push(`/admin/cuentas?propiedad=${row.codigo}`)}>{row.cuentas_totales}</a>
                      </TableCell>
                      <TableCell className="px-4 py-1">
                        <a title="Ver cuentas" className="cursor-pointer" onClick={() => router.push(`/admin/cuentas?propiedad=${row.codigo}`)}>{row.cuentas_pendientes}</a>
                      </TableCell>
                      <TableCell className="flex justify-center gap-2 px-4 py-1">
                        <Button title="Documentos" className="cursor-pointer rounded-xl bg-[var(--baseOscura-admin)] text-white " onClick={() => router.push(`/admin/documentos?propiedad=${row.codigo}`)}>
                            <Folder className="w-4 h-4" />
                        </Button>
                        <Button title="Notificaciones" className="cursor-pointer rounded-xl bg-[var(--baseOscura-admin)] text-white " onClick={() => router.push(`/admin/notificaciones?propiedad=${row.Id}`)}>
                            <Bell className="w-4 h-4" />
                        </Button>
                        <Button title="Editar" className="cursor-pointer rounded-xl bg-[var(--baseOscura-admin)] text-white " onClick={() => router.push(`/admin/propiedades/editar?id=${row.Id}`)}>
                            <Edit className="w-4 h-4" />
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
      )}
    </div>        
  );
}
