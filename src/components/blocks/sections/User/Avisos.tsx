"use client";
import { Card, Title, Text } from "@tremor/react";
import { Bell, Building, HomeIcon, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Loading } from "../../template/Loading";
import { useUser } from "./UserContext";

interface Notificacion {
  id_notificacion: number;
  notificacion_id_propiedad: number;
  notificacion_estado: string;
  notificacion_titulo: string;
  notificacion_seccion: string;
  notificacion: string;
  id_propiedad: number;
  propiedad_nombre: string;
  propiedad_direccion: string;
}

export default function AvisosPageDiv() {
  const [avisos, setAvisos] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Cargando datos de cuenta..");
  const userCtx = useUser();
  const userData = userCtx?.userData;

  function getAvisoLink(seccion:string) {
    switch (String(seccion)) {
      case "3":
        return "/user/documentos";
      case "4":
        return "/user/telefonos";
      case "5":
        return "/user";
      default:
        return "/user/avisos";
    }
  }

  function getAvisoTexto(seccion:string) {
    switch (String(seccion)) {
      case "3":
        return "Ir a documentos";
      case "4":
        return "Ir a lista de contactos útiles";
      case "5":
        return "Ir a expensas y vencimientos";
      default:
        return "";
    }
  }

  useEffect(() => {
    async function getUserData() {
      try {
        console.log("AAAAAAAAAAAAAAAA")
        setLoadingText('Cargando avisos..')
        const res = await fetch("/api/user/getnotifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        const data = await res.json();
        console.log(data)
        setAvisos(data || []); // maneja ambos formatos
        setLoading(false)
      } catch (error) {
        console.error("Error fetching user data", error);
        setLoading(false)
      }
    }
    getUserData();
  }, []);

  return (
    <div>
    {
          loading || !userCtx?.userData? 
          (
            <Loading type="replace" height="150px" text={loadingText} appType="user" />
          ) : (
    <div>
      <h1 className="flex items-center gap-2 text-[2em] text-[var(--baseOscura)] mb-4">
        <Bell className="w-6 h-6" />
        Tus avisos
      </h1>
      <h2 className="flex items-center gap-2 text-[1.1em] text-[var(--baseOscura)] mb-[10px]">
        <Building className="w-6 h-6" />
        {userData?.propiedad_nombre}
        <MapPin className="w-6 h-6" />
        {userData?.propiedad_direccion}
        <HomeIcon className="w-6 h-6" />
        {userData?.unidad_nombre}
      </h2>
      {avisos.length === 0 ? (
        <Card className="bg-[var(--baseSuperClara)] text-[var(--baseOscura)] border border-[var(--baseOscura)]">
          <Title>No tenés avisos</Title>
          <Text>Cuando haya nuevas notificaciones, aparecerán acáAAA.</Text>
        </Card>
      ) : (
        avisos.map((n) => (
          <Card
            key={n.id_notificacion}
            className="mb-4 bg-[var(--baseSuperClara)] text-[var(--baseOscura)] rounded-[10px]"
          >
            <Title>{n.notificacion_titulo}</Title>
            <Text className="text-[.8em]">{n.notificacion}</Text>
            <Link href={getAvisoLink(n.notificacion_seccion)}>
                  <button
                    className={`px-3 mt-[10px] py-1 text-sm bg-[var(--baseOscura)] text-white rounded cursor-pointer ${n.notificacion_seccion=="0" ? "hidden":""}`}
                  >
                    {getAvisoTexto(n.notificacion_seccion)}
                    <span className="hidden">
                    {
                      (() => {
                        switch (n.notificacion_seccion) {
                          case "3":
                            return "Ir a documentos";
                          case "4":
                            return "Ir a lista de contactos útiles";
                          case "5":
                            return "Ir a de expensas y vencimientos";
                          default:
                            return n.notificacion_seccion=="0" ? "":n.notificacion_seccion
                        }
                      })()
                    }
                    </span>
                  </button>
              </Link>
          </Card>
        ))
      )}
    </div>
    )}
    </div>
  );
}
