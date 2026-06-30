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
import { Building, FileText, HomeIcon, Key, LocateIcon, LocationEditIcon, MapPin, Phone } from "lucide-react";
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
    <div className="space-y-5">
        <h1 className="app-title mb-4">
        <Phone className="w-6 h-6" />
        Teléfonos útiles
        </h1>
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
        {userData.propiedad_datos?.split("||").map((v,i)=>{
          const [label,value,type] = v.split("//")
          const isMobile = typeof window !== "undefined" && window.innerWidth < 768

          return (
            <div key={i} className="contact-card">
              
              <div>
                <div className="font-medium text-[var(--baseOscura)] font-semibold">{label}</div>
                <div className="text-[var(--baseOscura)] italic">{value}</div>
              </div>

              <div className="flex items-center gap-2">

                {type==="phone" && isMobile && (
                  <a
                    href={`tel:${value}`}
                    className="app-button"
                  >
                    Llamar
                  </a>
                )}

                {type==="wa" && (
                  <a
                    href={`https://wa.me/${value}`}
                    target="_blank"
                    className="app-button"
                  >
                    Enviar WhatsApp
                  </a>
                )}

                {type==="email" && (
                  <a
                    href={`mailto:${value}`}
                    className="app-button"
                  >
                    Escribir Email
                  </a>
                )}

              </div>

            </div>
          )
        })}
    </div>
    
  );
}
