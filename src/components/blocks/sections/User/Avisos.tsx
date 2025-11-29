"use client";
import { Card, Title, Text } from "@tremor/react";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

interface Notificacion {
  id_notificacion: number;
  notificacion_id_propiedad: number;
  notificacion_estado: string;
  notificacion_titulo: string;
  notificacion: string;
  id_propiedad: number;
  propiedad_nombre: string;
  propiedad_direccion: string;
}

export default function AvisosPageDiv() {
  const [avisos, setAvisos] = useState<Notificacion[]>([]);

  useEffect(() => {
    async function getUserData() {
      try {
        const res = await fetch("/api/user/getnotifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        const data = await res.json();
        setAvisos(data || []); // maneja ambos formatos
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    }
    getUserData();
  }, []);

  return (
    <div>
      <h1 className="flex items-center gap-2 text-[2em] text-[var(--baseOscura)] mb-4">
        <Bell className="w-6 h-6" />
        Tus avisos
      </h1>
      {avisos.length === 0 ? (
        <Card className="bg-[var(--baseSuperClara)] text-[var(--baseOscura)] border border-[var(--baseOscura)]">
          <Title>No tenés avisos</Title>
          <Text>Cuando haya nuevas notificaciones, aparecerán acáAAA.</Text>
        </Card>
      ) : (
        avisos.map((n) => (
          <Card
            key={n.id_notificacion}
            className="mb-4 bg-[var(--baseSuperClara)] text-[var(--baseOscura)] border border-[var(--baseOscura)] rounded-[10px]"
          >
            <Title>{n.notificacion_titulo}</Title>
            <Text className="font-semibold text-sm mb-1 text-[var(--baseOscura)]">
              {n.propiedad_nombre} – {n.propiedad_direccion}
            </Text>
            <Text>{n.notificacion}</Text>
          </Card>
        ))
      )}
    </div>
  );
}