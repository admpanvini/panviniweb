"use client";

import React, { useState, useEffect } from "react";
import { Loading } from "./Loading";

interface PdfModalProps {
  url: string | null;
  open: boolean;
  onClose: () => void;
  appType?:("user"|"admin");
}

export default function PdfModal({ url, open, onClose,appType = "admin" }: PdfModalProps) {
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Descargando archivo...");

  // Cada vez que abras el modal → arrancar loading en true
  useEffect(() => {
    if (open) {
      setLoading(true);
    }
  }, [open]);

  if (!open || !url) return null;

  const convertToPreview = (link: string) => {
    const match = link.match(/\/d\/(.*?)\//);
    return match ? `https://drive.google.com/file/d/${match[1]}/preview` : link;
  };

  const previewUrl = convertToPreview(url);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px]  flex items-center justify-center z-50">
      <div className={`bg-[var(--baseClara${appType=="user"?"":"-admin"})] w-full h-full md:w-[50%] md:h-[90%] border-[.5px] border-[#3c3c3c] rounded-lg overflow-hidden relative shadow-xl`}>

        <div className="absolute top-3 right-3 flex gap-2 z-10">
          <a
            href={url}
            target="_blank"
            className={`bg-[var(--baseOscura${appType=="user"?"":"-admin"})] text-white px-3 py-1 rounded border-[.5px]`}
          >
            Descargar
          </a>

          <button
            onClick={onClose}
            className={`bg-[var(--baseClara${appType=="user"?"":"-admin"})] text-white px-3 py-1 rounded border-[.5px] cursor-pointer`}
          >
            X
          </button>
        </div>

        {/* Loading mientras carga el iframe */}
        {loading && (
          <Loading type="replace" height="150px" text={loadingText} appType={appType} />
        )}

        <iframe
          key={previewUrl}               // fuerza recarga si cambia URL
          onLoad={() => setLoading(false)}
          src={previewUrl}
          className={`w-full h-full border-0 ${loading ? "hidden" : ""}`}
          allow="autoplay"
        />
      </div>
    </div>
  );
}
