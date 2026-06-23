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
import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ConfirmModal from "../../template/ModalNotificacion";
import { Loading } from "../../template/Loading";

export default function Unidades() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propiedadFromQuery = searchParams.get("propiedad"); // si viene por query
  const userCtx = useAdmin();

  const [propiedades, setPropiedades] = useState<any[]>([]);
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState<string | null>(null);
  const [dataTable, setDataTable] = useState<any[]>([]);
  const [filter, setFilter] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [unidadToDelete, setUnidadToDelete] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Cargando datos..");

  const openDeleteModal = (id: number) => {
    setUnidadToDelete(id);
    setOpenModal(true);
  };

  // 🔹 1. Cargar propiedades
  useEffect(() => {
    async function getPropiedades() {
      setLoading(true)
      setLoadingText("Cargando las propiedades..")
      const res = await fetch("/api/admin/getpropiedades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setPropiedades(data);
      setLoading(false)
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
  const getUnidades = useCallback(async () => {
    if (!propiedadSeleccionada) return;
    try {
      setDataTable([]);
      setLoading(true)
      setLoadingText("Cargando las unidades asociadas a la propiedad seleccionada")
      const res = await fetch("/api/admin/getunidades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propiedad_codigo: propiedadSeleccionada }),
      });
      const data = await res.json();
      setDataTable(data);
    } catch (error) {
      console.error("Error fetching unidades:", error);
    }
    setLoading(false)
  }, [propiedadSeleccionada]);

  useEffect(() => {
    getUnidades();
  }, [getUnidades]);

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


  const handleConfirmDelete = async () => {
    if (!unidadToDelete) return;
    setOpenModal(false);
    setLoading(true)
    setLoadingText("Eliminando la unidad indicada")
    await fetch("/api/admin/uploadunidad", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_unidad: unidadToDelete }),
    });
    setLoading(false)
    await getUnidades();  // ⬅️ refresca la tabla automáticamente
    setUnidadToDelete(null);
  };

  return (
    <div>
      {
      loading?
      (
        <Loading type="replace" height="150px" text={loadingText} />
      ):
      (
        <div className="text-[var(--baseOscura-admin)]">
          <h1 className="flex items-center gap-2 text-[2em] ">
            <Home /> Unidades
          </h1>
          {/* 🔍 Filtros y selector de propiedad */}
          <div className="items-center my-3 gap-3">
            {/* Botón nuevo */}
            {/* Select Propiedad */}
            Filtrar propiedad:<select
              value={propiedadSeleccionada || ""}
              onChange={(e) =>
                setPropiedadSeleccionada(e.target.value || null)
              }
              className="border border-[var(--baseOscura-admin)] rounded-lg px-3 py-2.5 text-[var(--baseOscura-admin)] w-full max-w-[250px] mx-2"
            >
              <option value="">Seleccionar propiedad...</option>
              {propiedades.map((p: any) => (
                <option key={p.propiedad_codigo} value={p.propiedad_codigo}>
                  {p.propiedad_nombre} ({p.propiedad_codigo})
                </option>
              ))}
            </select>
            {/* Input de búsqueda */}
            Buscar texto:
            <input
              type="text"
              placeholder="Filtrar por nombre o código..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-[var(--baseOscura-admin)] rounded-lg px-3 py-2 w-full max-w-[300px] text-[var(--baseOscura-admin)] mx-2"
            />
            <Button
              className="rounded-xl bg-[var(--baseOscura-admin)] text-white px-3 py-2.5 float-right cursor-pointer"
              onClick={() => router.push("/admin/unidades/editar")}
            >
              Nueva unidad
            </Button>
            
          </div>

          {/* ⚠️ Si no hay propiedad seleccionada */}
          {!propiedadSeleccionada ? (
            <div className="text-center text-[var(--baseOscura-admin)] py-10">
              Seleccioná una propiedad para ver sus unidades.
            </div>
          ) : 
          (
            // 🧾 Tabla de unidades
            <Table className="rounded-lg overflow-hidden text-sm border border-[var(--baseMedia-admin)]">
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

              <TableBody className="text-[var(--baseOscura-admin)]">
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
                      <TableCell className="px-4 py-2 min-w-35  text-center">
                        <Button
                          title="Editar"
                          className="rounded-xl bg-[var(--baseOscura-admin)] text-white cursor-pointer"
                          onClick={() =>
                            router.push(`/admin/unidades/editar?id=${row.id_unidad}`)
                          }
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          title="Eliminar"
                          className="rounded-xl bg-[var(--baseOscura-admin)] text-white cursor-pointer"
                          onClick={() => openDeleteModal(row.id_unidad)}>
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
          {/* 🔥 MODAL DE CONFIRMACIÓN */}
          <ConfirmModal
            open={openModal}
            text="¿Seguro que querés cambiar el estado de esta unidad?"
            onConfirm={handleConfirmDelete}
            onCancel={() => setOpenModal(false)}
          />
        </div>
      )}
    </div>
  );
}
