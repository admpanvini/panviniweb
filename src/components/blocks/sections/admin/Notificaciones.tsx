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

import { Bell, Trash, RotateCcw, CircleCheck, CircleX } from "lucide-react";
import { useAdmin } from "./AdminContext";
import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ConfirmModal from "../../template/ModalNotificacion";
import { Loading } from "../../template/Loading";

interface NotificacionRow {
  id_notificacion: number;
  notificacion_titulo: string;
  notificacion: string;
  notificacion_id_propiedad: string;
  notificacion_estado: string;
  notificacion_seccion: number;
  notificacion_fecha: string;
  propiedad_nombre: string | null;
}

export default function Notificaciones() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propiedadFromQuery = searchParams.get("propiedad");
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Cargando datos..");

  const userCtx = useAdmin();

  const [propiedades, setPropiedades] = useState<any[]>([]);
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState<string | null>(null);

  const [estadoSeleccionado, setEstadoSeleccionado] = useState<string>("activo");

  const [dataTable, setDataTable] = useState<NotificacionRow[]>([]);
  const [filter, setFilter] = useState("");
  const [limit] = useState(100); // SIEMPRE traemos 100 por vez
  const [offset, setOffset] = useState(0);

  const actions:any={
    0:"Sin acción",
    5:"Ver Expensas y vencimientos",
    4:"Ver Teléfonos útiles",
    3:"Ver Documentos"
  }

  const [modal, setModal] = useState<{ open: boolean; id: number | null; titulo: string | null }>({
    open: false,
    id: null,
    titulo:''
  });

  // -------------------------------------------------------------------
  // 1) Cargar propiedades
  // -------------------------------------------------------------------
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
      loadNotificaciones(true);
    }
    getProps();
  }, []);

  // -------------------------------------------------------------------
  // 2) Si vino del query
  // -------------------------------------------------------------------
  useEffect(() => {
    if (propiedadFromQuery) {
      setTimeout(() => {
        setPropiedadSeleccionada(propiedadFromQuery);  
      }, 1000);
      router.replace("/admin/notificaciones", { scroll: false });
    }
  }, [propiedadFromQuery, router]);

  // -------------------------------------------------------------------
  // 3) Cargar primeras 100
  // -------------------------------------------------------------------
  async function loadNotificaciones(reset = false) {
    setLoading(true)
    setLoadingText("Buscando notificaciones..")
    const body = {
      id_propiedad: propiedadSeleccionada || null,
      activos: estadoSeleccionado === "activo",
      eliminados: estadoSeleccionado === "eliminado",
      limit,
      offset: reset ? 0 : offset,
    };
    const res = await fetch("/api/admin/getnotificaciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(false)
    const newData: NotificacionRow[] = await res.json();

    if (reset) {
      setDataTable(newData);
      setOffset(limit);
    } else {
      setDataTable((prev) => [...prev, ...newData]);
      setOffset((prev) => prev + limit);
    }
  }

  // cargar al inicio o al cambiar filtros
  useEffect(() => {
    if(propiedades.length==0) return
    loadNotificaciones(true);
  }, [propiedadSeleccionada, estadoSeleccionado]);

  // -------------------------------------------------------------------
  // 4) Filtro local por texto entre las cargadas
  // -------------------------------------------------------------------
  const filteredData = useMemo(() => {
    const t = filter.toLowerCase();
    if (!t) return dataTable;
    return dataTable.filter((row) =>
      Object.values(row).some((val) => String(val).toLowerCase().includes(t))
    );
  }, [filter, dataTable]);

  // -------------------------------------------------------------------
  // 5) Toggle estado
  // -------------------------------------------------------------------
  async function toggle(id: number) {
    setLoading(true)
    setLoadingText("Guardando los cambios en notificaciones..")
    setModal({ ...modal,open: false})
    await fetch("/api/admin/uploadnotificacion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_notificacion: id }),
    });
    setModal({ open: false, id: null, titulo:''});
    loadNotificaciones(true);
    setLoading(false)
  }



  return (
    <div>
    {loading?
    (
      <Loading type="replace" height="150px" text={loadingText} />
    ):(<div className="text-[var(--baseOscura-admin)]">
      
      <h1 className="flex items-center gap-2 text-[2em] ">
        <Bell /> Notificaciones
      </h1>      

      {/* FILTROS */}
      <div className="items-center my-3 gap-3">

        Propiedad:
        <select
          value={propiedadSeleccionada || ""}
          onChange={(e) => setPropiedadSeleccionada(e.target.value || null)}
          className="border border-[var(--baseOscura-admin)] rounded-lg px-3 py-2.5 max-w-[200px] mx-2"
        >
          <option value="">Todas</option>
          {propiedades.map((p: any) => (
            <option key={p.id_propiedad} value={p.id_propiedad}>
              {p.propiedad_nombre} ({p.propiedad_codigo})
            </option>
          ))}
        </select>

        Estado:
        <select
          value={estadoSeleccionado}
          onChange={(e) => setEstadoSeleccionado(e.target.value)}
          className="border border-[var(--baseOscura-admin)] rounded-lg px-3 py-2.5 max-w-[150px] mx-2"
        >
          <option value="activo">Activas</option>
          <option value="eliminado">Eliminadas</option>
        </select>

        Buscar:
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Buscar..."
          className="border border-[var(--baseOscura-admin)] rounded-lg px-3 py-2 max-w-[250px] mx-2"
        />
        {/* Botón crear */}
        <Button className="!flex !flex-row !items-center !gap-2 rounded-xl bg-[var(--baseOscura-admin)] text-white py-3 cursor-pointer float-right"
        onClick={() => router.push("/admin/notificaciones/editar")}>
          Nueva notificación
        </Button>

      </div>

      {/* TABLA */}
      <Table className="rounded-lg overflow-hidden text-sm border border-[var(--baseMedia-admin)]">
        <TableHead style={{ background: "var(--colorTableHeader-admin)" }}>
          <TableRow>
            <TableHeaderCell className="px-4 py-2 text-white"></TableHeaderCell>
            <TableHeaderCell className="px-4 py-2 text-white">Título</TableHeaderCell>
            <TableHeaderCell className="px-4 py-2 text-white">Propiedad</TableHeaderCell>
            <TableHeaderCell className="px-4 py-2 text-white">Botón</TableHeaderCell>
            <TableHeaderCell className="px-4 py-2 text-center text-white">Acción</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody className="text-[var(--baseOscura-admin)]">
          {filteredData.length ? (
            filteredData.map((row, i) => (
              <TableRow key={i} className="odd:bg-[rgba(0,0,0,.03)]">
                <TableCell className="px-4 py-2">
                {row.notificacion_estado === "activo" ? (
                <CircleCheck />
                ) : (
                  <CircleX />
                )}</TableCell>
                <TableCell className="px-4 py-2">{row.notificacion_titulo}</TableCell>
                <TableCell className="px-4 py-2 min-w-70">{row.propiedad_nombre}</TableCell>
                <TableCell className="px-4 py-2 min-w-50">{actions[row.notificacion_seccion]}</TableCell>
                

                <TableCell className="px-4 py-2 flex justify-center">
                  <Button
                    className="rounded-xl bg-[var(--baseOscura-admin)] text-white cursor-pointer"
                    onClick={() => setModal({ open: true, id: row.id_notificacion , titulo:row.notificacion_titulo })}
                  >
                    {row.notificacion_estado === "activo" ? (
                      <Trash className="w-4 h-4" />
                    ) : (
                      <RotateCcw className="w-4 h-4" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                No hay notificaciones...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* CARGAR MÁS */}
      {filteredData.length >= limit && (
        <div className="flex justify-center my-4">
          <Button
            className="rounded-xl bg-[var(--baseOscura-admin)] text-white cursor-pointer"
            onClick={() => loadNotificaciones(false)}
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
              <p className="">¿Estas seguro de cambiar el estado de la notificación?</p>
            </div>
            <p className="text-black text-[14px] my-3">"{modal.titulo}".</p>
          </>
        }
        onCancel={() => setModal({ open: false, id: null , titulo:''})}
        onConfirm={() => modal.id && toggle(modal.id)}
      />
    </div>)}
    </div>
  );
}
