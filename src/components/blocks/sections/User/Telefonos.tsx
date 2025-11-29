"use client";
import {
  Card,
  Text,
  Metric,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Button,
} from "@tremor/react";
import { Building, FileText, HomeIcon, LocateIcon, LocationEditIcon, MapPin, Phone } from "lucide-react";
import DynamicTable from "@/components/base/DynamicTable";
import formatFechaArgentina from "@/components/helpers/dataFormat";
import { useUser } from "./UserContext";



export default function Telefonos() {
  const userCtx = useUser();
  if (!userCtx || !userCtx.userData) return <p>Cargando datos...</p>;
  const { userData, setUserData } = userCtx;

  const data = [
    { fecha: "#1", monto: `${userData.unidad_saldo_1}`, vto: formatFechaArgentina(userData.unidad_vto_saldo_1)},
    { fecha: "#2", monto: `${userData.unidad_saldo_1}`, vto: formatFechaArgentina(userData.unidad_vto_saldo_2) }
  ];


  return (
    <div>
        <h1 className="flex items-center gap-2 text-[2em] text-[var(--baseOscura)] mb-4">
        <Phone className="w-6 h-6" />
        Teléfonos útiles
        </h1>
        <h2 className="flex items-center gap-2 text-[1.1em] text-[var(--baseOscura)] mb-[10px]">
        <Building className="w-6 h-6" />
        {userData.propiedad_nombre}
        <MapPin className="w-6 h-6" />
        {userData.propiedad_direccion}
        <HomeIcon className="w-6 h-6" />
        </h2>
        <div className="text-[var(--baseOscura)] mt-10" dangerouslySetInnerHTML={{ __html: userData.propiedad_datos || ''}} />
        <hr />
    </div>
    
  );
}
