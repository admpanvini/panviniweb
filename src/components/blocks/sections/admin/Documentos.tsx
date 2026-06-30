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
import { Trash, Eye, FileArchiveIcon } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import formatFechaArgentina from "@/components/helpers/dataFormat";
import PdfModal from "../../template/ModalPdf";
import { Loading } from "../../template/Loading";
import ConfirmModal from "../../template/ModalNotificacion";

export default function Cuentas() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propiedadFromQuery = searchParams.get("propiedad");
  const [errorText,setErrorText]=useState('')
  const [reconnectUrl,setReconnectUrl]=useState('/api/admin/google')

  const userCtx = useAdmin();

  const [propiedades, setPropiedades] = useState<any[]>([]);
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState<string | null>(null);

  

  //Modal variables
  const [open, setOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const [dataTable, setDataTable] = useState<any[]>([]);
  const [filter, setFilter] = useState("");
  const [limit, setLimit] = useState(30); // paginación local

  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Cargando datos..");

  const [modal, setModal] = useState<{ open: boolean; id: number | null; titulo: string | null }>({
    open: false,
    id: null,
    titulo:''
  });
  

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
    }
    if(propiedades.length>0){
        router.replace("/admin/documentos", { scroll: false });
        getDocumentos();
    }
  }, [propiedadFromQuery,propiedades, router]);

  // ------------------------------------------------------------
  // 3) Traer TODOS los documentos de una vez
  // ------------------------------------------------------------
  async function getDocumentos() {
    setLoading(true)
    setLoadingText("Buscando documentos..")
    const res = await fetch("/api/admin/getdocuments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}), // TRAE SIEMPRE TODO Y FILTRA LOCAL
    });
    const data = await res.json();
    setLoading(false)
    if (!res.ok) {
      if (data?.error_type === 'google') {
        setErrorText(data.details || data.error || 'La conexión con google drive ha caducado.');
        setReconnectUrl(data.reconnect_url || '/api/admin/google');
      }
      return;
    }
    setErrorText('');
    const data_prop = data?.map((a:any, i:any) => ({
    ...a,
    propiedad: propiedades.find( s => s.propiedad_codigo==a.folder)?.propiedad_nombre || '-'
    }));
    console.log(data_prop,propiedades)
    setDataTable(data_prop);
  }


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
  
  // -------------------------------------------------------------------
  // 5) Toggle: Eliminar
  // -------------------------------------------------------------------
  async function toggle(id: number) {
    setLoading(true)
    setLoadingText("Eliminando el documento indicado..")
    setModal({ ...modal,open: false})
    const res = await fetch("/api/admin/deletedocument", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
    });
    const data = await res.json();
    setModal({ open: false, id: null, titulo:''});
    if (!res.ok) {
      if (data?.error_type === 'google') {
        setErrorText(data.error || 'La conexión con google drive ha caducado.');
        setReconnectUrl(data.reconnect_url || '/api/admin/google');
      }
      setLoading(false)
      return;
    }
    await getDocumentos();
  }

  return (
    <div>
      { loading?
      (
        <Loading type="replace" height="150px" text={loadingText} />
      ):
      (
        <div className="space-y-5 text-[var(--baseOscura-admin)]">
          {errorText && (
            <div className="app-panel">
              <Button
                className="app-button cursor-pointer mb-4"
                onClick={() => { window.location.href = reconnectUrl; }}
              >
                Reestablecer conexión
              </Button>
              <br />
              La conexión con google drive ha caducado. <br /><br />
              <p className="text-xs break-all">Detalle : {errorText}</p>
            </div>
          )}
          <div className={`${errorText!=''?'hidden':''}`}>
          <h1 className="app-title">
            <FileArchiveIcon /> Documentos
            </h1>
            <PdfModal url={pdfUrl} open={open} onClose={() => setOpen(false)} />
            {/* FILTROS */}
            <div className="filter-bar my-4">
              
              {/* Propiedad */}
              <span className="filter-label">Propiedad</span>
              <select
                value={propiedadSeleccionada || ""}
                onChange={(e) => setPropiedadSeleccionada(e.target.value || null)}
                className="app-input max-w-[220px]"
              >
                <option value="">Filtro por propiedad</option>
                {propiedades.map((p: any) => (
                  <option key={p.propiedad_codigo} value={p.propiedad_codigo}>
                    {p.propiedad_nombre} ({p.propiedad_codigo})
                  </option>
                ))}
              </select>

              
              {/* Buscador */}
              <span className="filter-label">Buscar</span>
              <input
                type="text"
                placeholder="Buscar..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="app-input max-w-[260px]"
              />

              <Button
                className="app-button cursor-pointer"
                onClick={() => router.push("/admin/documentos/crear")}
              >
                Nuevo documento
              </Button>
            </div>

            {/* Tabla */}
            <Table className="app-table">
              <TableHead className="app-table-head">
                <TableRow>
                  <TableHeaderCell className="px-4 py-2 text-white">Propiedad</TableHeaderCell>
                  <TableHeaderCell className="px-4 py-2 text-white">Tipo</TableHeaderCell>
                  <TableHeaderCell className="px-4 py-2 text-white">Nombre</TableHeaderCell>
                  <TableHeaderCell className="px-4 py-2 text-white">Creación</TableHeaderCell>
                  <TableHeaderCell className="px-4 py-2 text-white text-center">Acción</TableHeaderCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredData.length ? (
                  filteredData.map((row: any, i) => (
                    <TableRow key={i} className="app-table-row">
                      <TableCell className="px-2 py-2">{row.folder} - {row.propiedad}</TableCell>
                      <TableCell className="px-2 py-2">{row.mimeType.replace("application/","").replace("image/","").toUpperCase()}</TableCell>
                      <TableCell className="px-2 py-2">{row.name}</TableCell>
                      <TableCell className="px-2 py-2">{formatFechaArgentina(row.createdTime, "DMA", true)}</TableCell>
                      <TableCell className="px-2 py-2 flex justify-center">
                        <Button
                          className="app-button !px-3 !py-2 cursor-pointer"
                          onClick={() => {
                              setPdfUrl(row.webViewLink);
                              setOpen(true);
                              }}>
                              <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          className="app-button !px-3 !py-2 cursor-pointer"
                          onClick={() => setModal({ open: true, id: row.id , titulo:row.name })}
                        >  <Trash className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-4">
                      Sin documentos disponibles
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Cargar más */}
            {filteredData.length >= limit && (
              <div className="flex justify-center my-4">
                <Button
                  className="app-button cursor-pointer"
                  onClick={() => setLimit(limit + 30)}
                >
                  Cargar más
                </Button>
              </div>
            )}

            {/* MODAL */}
            <ConfirmModal
              open={modal.open}
              text={
                <>
                  <div className="flex items-center gap-2">
                    <Trash className="w-13 h-13"/>
                    <p className="">¿Estas seguro de eliminar este documento?</p>
                  </div>
                  <p className="text-[var(--appOscura)] text-[14px] my-3">Documento <b>"{modal.titulo}"</b></p>
                </>
              }
              onCancel={() => setModal({ open: false, id: null , titulo:''})}
              onConfirm={() => modal.id && toggle(modal.id)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
