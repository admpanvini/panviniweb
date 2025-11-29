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
import { Bell, Building, CopyPlus, Edit, File, Home, House, Trash, User } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Unidades() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propiedadFromQuery = searchParams.get("propiedad"); // si viene por query
  const userCtx = useAdmin();

  const [propiedades, setPropiedades] = useState<any[]>([]);
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState<string | null>(null);
  const [dataTable, setDataTable] = useState<any[]>([]);
  const [filter, setFilter] = useState("");

  // 🔹 1. Cargar propiedades
  useEffect(() => {
    async function getPropiedades() {
      const res = await fetch("/api/admin/getpropiedades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setPropiedades(data);
    }
    getPropiedades();
  }, []);

  // 🔹 2. Si vino por query, setear y luego limpiar
  useEffect(() => {
    if (propiedadFromQuery) {
      setPropiedadSeleccionada(propiedadFromQuery);
      router.replace("/admin/unidades", { scroll: false }); // limpia el query
    }
  }, [propiedadFromQuery, router]);

  // 🔹 3. Traer unidades cuando cambia la propiedad
  useEffect(() => {
    if (!propiedadSeleccionada) return; // aún no seleccionada
    async function getUnidades() {
      try {
        setDataTable([]);
        const res = await fetch("/api/admin/getunidades", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propiedad_codigo: propiedadSeleccionada }),
        });
        const data = await res.json();
        console.log("Nuevas unidades",data)
        setDataTable(data);
      } catch (error) {
        console.error("Error fetching unidades:", error);
      }
    }
    getUnidades();
  }, [propiedadSeleccionada]);

  // 🧠 Filtro local de texto
  const filteredData = useMemo(() => {
    const term = filter.toLowerCase();
    if (!term) return dataTable;
    return dataTable.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(term)
      )
    );
  }, [filter, dataTable]);

  if (!userCtx || !userCtx.adminData)
    return (
      <div className="text-[var(--baseOscura-admin)] text-center">
        Cargando datos de administrador...
      </div>
    );

  const { adminData } = userCtx;

  return (
    <div className="text-[var(--baseOscura-admin)]">
      <h1 className="flex items-center gap-2 text-[2em] ">
        <Home /> Unidades
      </h1>
      {/* Botón nuevo */}
      <Button
        className="rounded-xl bg-[var(--baseOscura-admin)] text-white px-3 py-2.5 float-right cursor-pointer"
        onClick={() => router.push("/admin/unidades/editar")}
      >
        Nueva unidad
      </Button>

      {/* 🔍 Filtros y selector de propiedad */}
      <div className="flex flex-wrap items-center my-0 gap-3">
        {/* Select Propiedad */}
        Propiedad:<select
          value={propiedadSeleccionada || ""}
          onChange={(e) =>
            setPropiedadSeleccionada(e.target.value || null)
          }
          className="border border-[var(--baseOscura-admin)] rounded-lg px-3 py-2.5 text-[var(--baseOscura-admin)] w-full max-w-[250px]"
        >
          <option value="">Seleccionar propiedad...</option>
          {propiedades.map((p: any) => (
            <option key={p.propiedad_codigo} value={p.propiedad_codigo}>
              {p.propiedad_nombre} ({p.propiedad_codigo})
            </option>
          ))}
        </select>
        {/* Input de búsqueda */}
        Buscar:
        <input
          type="text"
          placeholder="Filtrar por nombre o código..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-[var(--baseOscura-admin)] rounded-lg px-3 py-2 w-full max-w-[300px] text-[var(--baseOscura-admin)] "
        />

        
      </div>

      {/* ⚠️ Si no hay propiedad seleccionada */}
      {!propiedadSeleccionada ? (
        <div className="text-center text-[var(--baseOscura-admin)] py-10">
          Seleccioná una propiedad para ver sus unidades.
        </div>
      ) : (
        // 🧾 Tabla de unidades
        <Table className="rounded-lg overflow-hidden text-sm border border-[var(--baseMedia-admin)] mt-5">
          <TableHead
            className="text-white"
            style={{ background: "var(--colorTableHeader-admin)" }}
          >
            <TableRow>
              <TableHeaderCell className="px-4 py-2">ID</TableHeaderCell>
              <TableHeaderCell className="px-4 py-2">Código</TableHeaderCell>
              <TableHeaderCell className="px-4 py-2">Nombre</TableHeaderCell>
              <TableHeaderCell className="px-4 py-2">Titular</TableHeaderCell>
              <TableHeaderCell className="px-4 py-2">Pendientes</TableHeaderCell>
              <TableHeaderCell className="px-4 py-2">Vencimiento</TableHeaderCell>
              <TableHeaderCell className="px-4 py-2">Saldo</TableHeaderCell>
              <TableHeaderCell className="text-center">Acción</TableHeaderCell>
            </TableRow>
          </TableHead>

          <TableBody className="bg-[var(--baseSuperClara-admin)] text-[var(--baseOscura-admin)]">
            {filteredData.length > 0 ? (
              filteredData.map((row, i) => (
                <TableRow key={i} className="odd:bg-[rgba(0,0,0,.03)]">
                  <TableCell className="px-4 py-2">{row.id_unidad}</TableCell>
                  <TableCell className="px-4 py-2">{row.unidad_codigo}</TableCell>
                  <TableCell className="px-4 py-2">{row.unidad_nombre}</TableCell>
                  <TableCell className="px-4 py-2">{row.unidad_titular}</TableCell>
                  <TableCell className="px-4 py-2">{row.pending_accounts}</TableCell>
                  <TableCell className="px-4 py-2">{row.unidad_vto_saldo1}</TableCell>
                  <TableCell className="px-4 py-2">{row.unidad_saldo1}</TableCell>
                  <TableCell className="px-4 py-2">
                    <Button
                      title="Editar"
                      className="rounded-xl bg-[var(--baseOscura-admin)] text-white cursor-pointer"
                      onClick={() =>
                        router.push(`/admin/unidades/editar?id=${row.id_unidad}`)
                      }
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button className="rounded-xl bg-[var(--baseOscura-admin)] text-white">
                      <User className="w-4 h-4" />
                    </Button>
                    <Button className="rounded-xl bg-[var(--baseOscura-admin)] text-white">
                      <Trash className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No se encontraron unidades.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
