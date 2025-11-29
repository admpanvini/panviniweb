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
import { Edit, User, File, Bell, User2Icon, Trash, Eye, FileArchiveIcon } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import formatFechaArgentina from "@/components/helpers/dataFormat";
import Documentos from '@/components/blocks/sections/admin/Documentos';
import PdfModal from "../../template/ModalPdf";

export default function Cuentas() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propiedadFromQuery = searchParams.get("propiedad");

  const userCtx = useAdmin();

  const [propiedades, setPropiedades] = useState<any[]>([]);
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState<string | null>(null);

  

  //Modal variables
  const [open, setOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const [dataTable, setDataTable] = useState<any[]>([]);
  const [filter, setFilter] = useState("");
  const [limit, setLimit] = useState(30); // paginación local

  // ------------------------------------------------------------
  // 1) Traer propiedades
  // ------------------------------------------------------------
  useEffect(() => {
    async function getProps() {
      const res = await fetch("/api/admin/getpropiedades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      await setPropiedades(data);
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
    const res = await fetch("/api/admin/getdocuments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}), // TRAE TODO
    });

    const data = await res.json();
    const data_prop = data?.map((a:any, i:any) => ({
    ...a,
    propiedad: propiedades.find( s => s.propiedad_codigo==a.folder)?.propiedad_nombre || '-'
    }));
    console.log(data_prop,propiedades)
    setDataTable(data_prop);
  }

  useEffect(() => {
    if (propiedades.length === 0) return; // aún no cargó
    getCuentas();
  }, [propiedades]);

  // Reset de límite cuando cambian filtros
  useEffect(() => {
    setLimit(30);
  }, [ propiedadSeleccionada, filter]);

  // ------------------------------------------------------------
  // 4) Filtro completo + limit
  // ------------------------------------------------------------
  const filteredData = useMemo(() => {
    let rows = dataTable;

    // Filtro por propiedad
    if (propiedadSeleccionada) {
        console.log(propiedadSeleccionada)
      rows = rows.filter(r => r.folder.substring(0, 2) === propiedadSeleccionada);
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
  }, [filter, dataTable, propiedadSeleccionada,  limit]);

  if (!userCtx || !userCtx.adminData)
    return <div className="text-[var(--baseOscura-admin)]">Cargando Datos...</div>;

  return (
    <div className="text-[var(--baseOscura-admin)]">

      <h1 className="flex items-center gap-2 text-[2em] ">
        <FileArchiveIcon /> Documentos
      </h1>
      <PdfModal url={pdfUrl} open={open} onClose={() => setOpen(false)} />
      {/* FILTROS */}
      <div className="items-center my-3 gap-3">
        
        {/* Propiedad */}
        Propiedad:
        <select
          value={propiedadSeleccionada || ""}
          onChange={(e) => setPropiedadSeleccionada(e.target.value || null)}
          className="border border-[var(--baseOscura-admin)] rounded-lg px-3 py-2.5 w-full max-w-[200px] mr-2"
        >
          <option value="">Filtro por propiedad</option>
          {propiedades.map((p: any) => (
            <option key={p.propiedad_codigo} value={p.propiedad_codigo}>
              {p.propiedad_nombre} ({p.propiedad_codigo})
            </option>
          ))}
        </select>

        
        {/* Buscador */}
        Buscar:
        <input
          type="text"
          placeholder="Buscar..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-[var(--baseOscura-admin)] rounded-lg px-3 py-2 w-full max-w-[250px]"
        />

        <Button
          className="rounded-xl bg-[var(--baseOscura-admin)] text-white px-3 py-2.5 float-right cursor-pointer"
          onClick={() => router.push("/admin/documentos/crear")}
        >
          Nuevo documento
        </Button>
      </div>

      {/* Tabla */}
      <Table className="text-sm leading-tight rounded-lg overflow-hidden border border-[var(--baseMedia-admin)] mt-5">
        <TableHead style={{ background: "var(--colorTableHeader-admin)" }}>
          <TableRow>
            <TableHeaderCell className="px-1 py-2 text-white">Propiedad</TableHeaderCell>
            <TableHeaderCell className="px-1 py-2 text-white">Tipo</TableHeaderCell>
            <TableHeaderCell className="px-1 py-2 text-white">Nombre</TableHeaderCell>
            <TableHeaderCell className="px-1 py-2 text-white">Creación</TableHeaderCell>
            <TableHeaderCell className="px-1 py-2 text-white">Acción</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody className="bg-[var(--baseSuperClara-admin)]">
          {filteredData.length ? (
            filteredData.map((row: any, i) => (
              <TableRow key={i} className="odd:bg-[rgba(0,0,0,.03)]">
                <TableCell className="px-1 py-2">{row.folder} - {row.propiedad}</TableCell>
                <TableCell className="px-1 py-2">{row.mimeType.replace("application/","").replace("image/","").toUpperCase()}</TableCell>
                <TableCell className="px-1 py-2">{row.name}</TableCell>
                <TableCell className="px-1 py-2">{formatFechaArgentina(row.createdTime, "DMA", true)}</TableCell>
                <TableCell className="px-1 py-2 flex gap-2 justify-center">
                   <Button
                    className="cursor-pointer rounded-xl bg-[var(--baseOscura-admin)] text-white"
                    onClick={() => {
                        setPdfUrl(row.webViewLink);
                        setOpen(true);
                        }}>
                        <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    className="cursor-pointer rounded-xl bg-[var(--baseOscura-admin)] text-white"
                    onClick={() => router.push(`/admin/cuentas/editar?id=${row.id_cuenta}`)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={11} className="text-center py-4">
                Cargando documentos.. (puede tomar algunos segundos)
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
  );
}
