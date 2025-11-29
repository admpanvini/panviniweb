"use client";

import React from "react";

interface PdfModalProps {
  url: string | null;     // link original: /view?usp=sharing
  open: boolean;          // mostrar/ocultar modal
  onClose: () => void;    // callback para cerrar
}

export default function PdfModal({ url, open, onClose }: PdfModalProps) {
  if (!open || !url) return null;

  // Convertir link a formato preview
  const convertToPreview = (link: string) => {
    const match = link.match(/\/d\/(.*?)\//);
    if (!match) return link;
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  };

  const previewUrl = convertToPreview(url);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] h-[90%] rounded-lg overflow-hidden relative shadow-xl">

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
        >
          Cerrar
        </button>

        {/* PDF embebido */}
        <iframe
          src={previewUrl}
          className="w-full h-full border-0"
          allow="autoplay"
        ></iframe>
      </div>
    </div>
  );
}
