"use client";
import { Card, Title, Text, Button } from "@tremor/react";
import { Bell, Building, Eye, FileSpreadsheet, HomeIcon, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { Loading } from "../../template/Loading";
import { useUser } from "./UserContext";
import PdfModal from "../../template/ModalPdf";


interface File {
  id: string;
  name: string;
  webViewLink:string
}

export default function DocumentosPageDiv() {
  const userCtx = useUser();
  const userData = userCtx?.userData;
  //Page variables
  const [avisos, setAvisos] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Cargando datos..");
  //Modal variables
  const [open, setOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!userData) return
    async function getFiles() {
      try {
        setLoadingText("Cargando documentos..")
        const res = await fetch("/api/user/getfiles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            propiedad_codigo: userData?.unidad_codigo?.substring(0,2)
          })
        })

        const data = await res.json()
        setAvisos(data || [])
        setLoading(false)

      } catch (error) {
        console.error("Error fetching files", error)
      }
    }

    getFiles()
  }, [userData])

  return (
    <div>
    {
    loading || !userData ? 
    (
      <Loading type="replace" height="150px" text={loadingText} appType="user" />
    ) : ( 
    <div>
      <h1 className="flex items-center gap-2 text-[2em] text-[var(--baseOscura)] mb-4">
        <FileSpreadsheet className="w-6 h-6" />
        Documentos asociados a tu propiedad
      </h1>
      <h2 className="flex items-center gap-2 text-[1.1em] text-[var(--baseOscura)] mb-[10px]">
        <Building className="w-6 h-6" />
        {userData?.propiedad_nombre}
        <MapPin className="w-6 h-6" />
        {userData?.propiedad_direccion}
        <HomeIcon className="w-6 h-6" />
        {userData?.unidad_nombre}
      </h2>

      <PdfModal url={pdfUrl} open={open} onClose={() => setOpen(false)} appType="user"/>  
      {avisos.length === 0 ? (
        <Card className="text-[var(--baseOscura)]">
          <Title>No se han encontrado documentos para tu propiedad</Title>
        </Card>
      ) : (
        avisos.map((n,i) => (
          <Card
            key={i}
            className="mb-4 bg-[var(--baseSuperClara)] text-[var(--baseOscura)] rounded-[10px]"
          >  <Button
                className="cursor-pointer rounded-xl bg-[var(--baseOscura)] text-white float-right mt-[-10px]"
                onClick={() => {
                    setPdfUrl(n.webViewLink);
                    setOpen(true);
                    }}>
                    Abrir documento
              </Button>
              <Title>{n.name?.replaceAll('pdf','')}</Title>
          </Card>
        ))
      )}
    </div>
    )}
    </div>
  );
}