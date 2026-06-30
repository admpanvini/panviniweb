import {
  Card,
  Text,
  Metric,
  Button
} from "@tremor/react";
import { Building, FileText, HomeIcon, Key, LocateIcon, LocationEditIcon, MapPin } from "lucide-react";
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
    <div className="space-y-5">
        <div className="app-panel">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="app-title">
                Hola, {userData.cuenta_titular}
              </h1>
            </div>
            <Link href="/user/documentos">
              <Button className="app-button">Ver expensa {formatFechaArgentina(userData.unidad_vto_saldo_1,"Mes")}</Button>
            </Link>
          </div>
        </div>
        <div className="property-summary">
          <div className="property-item">
            <span className="property-icon"><Building className="w-5 h-5" /></span>
            <div><div className="property-label">Inmueble</div><div className="property-value">{userData.propiedad_nombre}</div></div>
          </div>
          <div className="property-item">
            <span className="property-icon"><MapPin className="w-5 h-5" /></span>
            <div><div className="property-label">Direccion</div><div className="property-value">{userData.propiedad_direccion}</div></div>
          </div>
          <div className="property-item">
            <span className="property-icon"><HomeIcon className="w-5 h-5" /></span>
            <div><div className="property-label">Unidad</div><div className="property-value">{userData.unidad_nombre}</div></div>
          </div>
          <div className="property-item">
            <span className="property-icon"><Key className="w-5 h-5" /></span>
            <div><div className="property-label">Titular</div><div className="property-value">{userData.unidad_titular}</div></div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="app-panel text-[var(--baseOscura)]">
            <Text className="text-xs font-semibold uppercase tracking-wide text-[var(--surfaceMuted)]">Primer vencimiento</Text>
            <Metric className="mt-2 text-4xl font-bold text-[var(--baseOscura)]">${userData.unidad_saldo_1}</Metric>
            <Text className="mt-2 text-sm text-[var(--surfaceMuted)]">{formatFechaArgentina(userData.unidad_vto_saldo_1)}</Text>
            </Card>

            <Card className="app-panel text-[var(--baseOscura)]">
            <Text className="text-xs font-semibold uppercase tracking-wide text-[var(--surfaceMuted)]">Segundo vencimiento</Text>
            <Metric className="mt-2 text-4xl font-bold text-[var(--baseOscura)]">${userData.unidad_saldo_2}</Metric>
            <Text className="mt-2 text-sm text-[var(--surfaceMuted)]">{formatFechaArgentina(userData.unidad_vto_saldo_2)}</Text>
            </Card>
        </div>

        <Card className="rounded-2xl border-0 bg-transparent p-0 shadow-none">
            <DynamicTable data={data}></DynamicTable>
        </Card>
    </div>
    
  );
}
