"use client";
import { Card, Title, Text, Button } from "@tremor/react";
import { Bell, Building, Eye, FileSpreadsheet, HomeIcon, Key, MapPin } from "lucide-react";
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
  const [errorText, setErrorText] = useState("");
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
        if (!res.ok) {
          setErrorText(data?.error || "No se pudieron cargar los documentos.");
          setAvisos([])
          setLoading(false)
          return;
        }
        setErrorText("")
        setAvisos(data || [])
        setLoading(false)

      } catch (error) {
        console.error("Error fetching files", error)
        setErrorText("No se pudieron cargar los documentos.");
        setLoading(false)
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
    <div className="space-y-5">
      <h1 className="app-title mb-4">
        <FileSpreadsheet className="w-6 h-6" />
        Documentos asociados a tu propiedad
      </h1>
      <div className="property-summary">
        <div className="property-item">
          <span className="property-icon"><Building className="w-5 h-5" /></span>
          <div><div className="property-label">Inmueble</div><div className="property-value">{userData?.propiedad_nombre}</div></div>
        </div>
        <div className="property-item">
          <span className="property-icon"><MapPin className="w-5 h-5" /></span>
          <div><div className="property-label">Direccion</div><div className="property-value">{userData?.propiedad_direccion}</div></div>
        </div>
        <div className="property-item">
          <span className="property-icon"><HomeIcon className="w-5 h-5" /></span>
          <div><div className="property-label">Unidad</div><div className="property-value">{userData?.unidad_nombre}</div></div>
        </div>
        <div className="property-item">
          <span className="property-icon"><Key className="w-5 h-5" /></span>
          <div><div className="property-label">Titular</div><div className="property-value">{userData?.unidad_titular}</div></div>
        </div>
      </div>

      <PdfModal url={pdfUrl} open={open} onClose={() => setOpen(false)} appType="user"/>  
      {errorText ? (
        <Card className="app-panel text-[var(--baseOscura)]">
          <Title>Documentos no disponibles</Title>
          <Text>{errorText}</Text>
        </Card>
      ) : avisos.length === 0 ? (
        <Card className="app-panel text-[var(--baseOscura)]">
          <Title>No se han encontrado documentos para tu propiedad</Title>
        </Card>
      ) : (
        avisos.map((n,i) => (
          <Card
            key={i}
            className="app-panel text-[var(--baseOscura)]"
          >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Title className="text-[var(--baseOscura)]">{n.name?.replaceAll('pdf','')}</Title>
                <Button
                className="app-button cursor-pointer"
                onClick={() => {
                    setPdfUrl(n.webViewLink);
                    setOpen(true);
                    }}>
                    Abrir documento
              </Button>
              </div>
          </Card>
        ))
      )}
    </div>
    )}
    </div>
  );
}
