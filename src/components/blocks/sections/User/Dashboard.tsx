import {
  Card,
  Text,
  Metric,
  Button
} from "@tremor/react";
import { Building, FileText, HomeIcon, LocateIcon, LocationEditIcon, MapPin } from "lucide-react";
import DynamicTable from "@/components/base/DynamicTable";
import formatFechaArgentina from "@/components/helpers/dataFormat";
import { useUser } from "./UserContext";
import Link from "next/link";



export default function Dashboard() {
  const userCtx = useUser();
  if (!userCtx || !userCtx.userData) return <p>Cargando datos...</p>;
  const { userData, setUserData } = userCtx;

  const data = [
    { fecha: "#1", monto: `${userData.unidad_saldo_1}`, vto: formatFechaArgentina(userData.unidad_vto_saldo_1)},
    { fecha: "#2", monto: `${userData.unidad_saldo_2}`, vto: formatFechaArgentina(userData.unidad_vto_saldo_2) }
  ];


  return (
    <div>
        <h1 className="flex items-center gap-2 text-[2em] text-[var(--baseOscura)]">
        Hola, {userData.cuenta_titular}
        </h1>
        <h2 className="flex items-center gap-2 text-[1.1em] text-[var(--baseOscura)] mb-[10px]">
        <Building className="w-6 h-6" />
        {userData.propiedad_nombre}
        <MapPin className="w-6 h-6" />
        {userData.propiedad_direccion}
        <HomeIcon className="w-6 h-6" />
        {userData.unidad_titular}
        </h2>
        <Link href="/user/documentos">
          <Button className="rounded-xl bg-[var(--baseOscura)] text-white">Ver expensa {formatFechaArgentina(userData.unidad_vto_saldo_1,"Mes")}</Button>
        </Link>
        <div className="grid grid-cols-1 gap-6">
        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-[10px] hidden">
            <Card className="bg-[var(--baseSuperClara)] text-[var(--baseOscura)] rounded-[10px] border-[1px] border-[var(--baseOscura)]">
            <Text className="text-[.7em] mb-[-10px]">Primer vencimiento</Text>
            <Metric className="text-[3em]">${userData.unidad_saldo_1}</Metric>
            <Text className="text-[.7em] mt-[-10px]">{formatFechaArgentina(userData.unidad_vto_saldo_1)}</Text>
            </Card>

            <Card className="bg-[var(--baseSuperClara)] text-[var(--baseOscura)] rounded-[10px] border-[1px] border-[var(--baseOscura)]">
            <Text className="text-[.7em] mb-[-10px]">Segundo vencimiento</Text>
            <Metric className="text-[3em]">${userData.unidad_saldo_2}</Metric>
            <Text className="text-[.7em] mt-[-10px]">{formatFechaArgentina(userData.unidad_vto_saldo_2)}</Text>
            </Card>

        </div>
        {/* Tabla */}
        <Card className=" text-black rounded-[10px] p-0 mt-[10px] ">
            <DynamicTable data={data}></DynamicTable>    
        </Card>
        </div>
    </div>
    
  );
}
