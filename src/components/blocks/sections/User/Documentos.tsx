"use client";
import { Card, Title, Text, Button } from "@tremor/react";
import { Bell, FileSpreadsheet } from "lucide-react";
import { useEffect, useState } from "react";

interface File {
  id: string;
  name: string;
  webViewLink:string
}

export default function DocumentosPageDiv() {
  const [avisos, setAvisos] = useState<File[]>([]);

  useEffect(() => {
    async function getUserData() {
      try {
        const res = await fetch("/api/user/getfiles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        const data = await res.json();
        console.log(data)
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
        <FileSpreadsheet className="w-6 h-6" />
        Documentos asociados a tu propiedad
      </h1>
      {avisos.length === 0 ? (
        <Card className="text-[var(--baseOscura)]">
          <Title>Cargando documentos...</Title>
        </Card>
      ) : (
        avisos.map((n,i) => (
          <Card
            key={i}
            className="mb-4 bg-[var(--baseSuperClara)] text-[var(--baseOscura)] border border-[var(--baseOscura)] rounded-[10px]"
          >
            <Title>{n.name?.replaceAll('pdf','')}</Title>
            <Text className="font-semibold text-sm mb-1 text-[var(--baseOscura)]">
              
              <br />
              <a href={n.webViewLink} target="_blank" className="rounded-xl bg-[var(--baseOscura)] text-white p-2">Ver Documento</a>
            </Text>
          </Card>
        ))
      )}
    </div>
  );
}