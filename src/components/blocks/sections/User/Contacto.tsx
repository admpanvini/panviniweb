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
import { Building, FileText, HomeIcon, LocateIcon, LocationEditIcon, Mail, MapPin, Phone } from "lucide-react";
import DynamicTable from "@/components/base/DynamicTable";
import formatFechaArgentina from "@/components/helpers/dataFormat";
import { useUser } from "./UserContext";
import { useEffect, useState } from "react";
import { Loading } from "../../template/Loading";



export default function Contacto() {
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Cargando datos de cuenta..");
  const userCtx = useUser();
  const userData = userCtx?.userData;

  const data = [
    { fecha: "#1", monto: `${userData?.unidad_saldo_1}`, vto: formatFechaArgentina(userData?.unidad_vto_saldo_1)},
    { fecha: "#2", monto: `${userData?.unidad_saldo_1}`, vto: formatFechaArgentina(userData?.unidad_vto_saldo_2) }
  ];
  const contactData=[
    {label:'Reclamos (Telefono - LUN a VIE de 8hs a 14hs)',type:"phone",value:"0341-4263491"},
    {label:'Reclamos (Email)',type:"email",value:"admpanvini@hotmail.com"},
    {label:'Cobranzas (Telefono - LUN a VIE de 16hs a 18hs)',type:"phone",value:"0341 152-560100"},
    {label:'Cobranzas (Email)',type:"email",value:"cobranzaspanvini@gmail.com"},
    {label:'Administración (LUN a VIE de 8:30 a 11:30)',type:"-",value:"Laprida 936 4°A"},
  ]
  useEffect(()=>{
    console.log("AAAAAAAAA",userData)
    if (userCtx?.userData){
      console.log("bbbbbbbbbbb")
      setLoading(false)
    }
  },[userData])



  return (
    <div>
      {loading ? 
      (
        <Loading type="replace" height="150px" text={loadingText} appType="user" />

      ):
      (<div>
          <h1 className="flex items-center gap-2 text-[2em] text-[var(--baseOscura)] mb-4">
          <Mail className="w-6 h-6" />
          Contactanos
          </h1>
          {contactData.map((v,i)=>{
            const {label,value,type} = v
            const isMobile = typeof window !== "undefined" && window.innerWidth < 768

            return (
              <div key={i} className="flex justify-between text-sm border-b border-[var(--baseClara)] py-1">
                
                <div>
                  <div className="font-medium text-[var(--baseOscura)] font-semibold">{label}</div>
                  <div className="text-[var(--baseOscura)] italic">{value}</div>
                </div>

                <div className="flex items-center gap-2">

                  {type==="phone" && isMobile && (
                    <a
                      href={`tel:${value}`}
                      className="px-3 py-1 text-sm bg-[var(--baseOscura)] text-white rounded hover:bg-[var(--baseClara)]"
                    >
                      Llamar
                    </a>
                  )}

                  {type==="wa" && (
                    <a
                      href={`https://wa.me/${value}`}
                      target="_blank"
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Enviar WhatsApp
                    </a>
                  )}

                  {type==="email" && (
                    <a
                      href={`mailto:${value}`}
                      className="px-3 py-1 text-sm bg-[var(--baseOscura)] text-white rounded hover:bg-[var(--baseClara)]"
                    >
                      Escribir Email
                    </a>
                  )}

                </div>

              </div>
            )
          })}
          <hr />
      </div>)}
    </div>
  );
}
