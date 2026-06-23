import { google } from "googleapis";
import { NextResponse } from "next/server";
import getDataFromCookiesToken from "@/utils/helpers/getDataFromCookiesToken";
import { Readable } from "stream";
import { getOAuthClient, loadTokens } from "@/utils/google/google_oauth_client";

export async function POST(req: Request) {
  console.log("Uploaddocuments INIT");

  const form = await req.formData();
  console.log("FORMDATA LOADED");

  try {
    // Paso 1: Control admin
    const datos = await getDataFromCookiesToken();
    if (!datos || datos.cuenta_tipo !== "admin") {
      return NextResponse.json({ error: "Sin permisos" }, { status: 400 });
    }

    // Paso 2: Leer datos form
    const propiedadCodigo = form.get("folder") as string;
    const titulo = form.get("titulo") as string;
    const file = form.get("file") as File;

    if (!propiedadCodigo || !titulo || !file) {
      return NextResponse.json({ error: "Campos incompletos" }, { status: 400 });
    }

    console.log("folder:", propiedadCodigo, "titulo:", titulo, "file:", file?.name);

    // Paso 3: Cargar OAuth tokens
    const tokens = loadTokens();
    const oauth2 = getOAuthClient();
    oauth2.setCredentials(tokens);

    const drive = google.drive({ version: "v3", auth: oauth2 });

    // Paso 4: Buscar carpeta por nombre
    const webSearch = await drive.files.list({
      q: "name='web' and mimeType='application/vnd.google-apps.folder' and trashed=false",
      fields: "files(id)"
    });
    const webId = webSearch.data.files?.[0]?.id;

    if (!webId) {
      throw new Error("No existe la carpeta web dentro de drive — no se puede crear archivo");
    }

    // 2) Buscar SOLO carpeta 'XX' dentro de web
    const codeSearch = await drive.files.list({
      q: `'${webId}' in parents 
          and name='${propiedadCodigo}' 
          and mimeType='application/vnd.google-apps.folder' 
          and trashed=false`,
      fields: "files(id,name)"
    });

    console.log("Carpetas encontradas:", codeSearch.data.files);
    
    let carpetaId;
    
    carpetaId = codeSearch.data.files?.[0]?.id;

    if (!carpetaId) {
      const nueva = await drive.files.create({
        requestBody: {
          name: propiedadCodigo,                       // nombre de la carpeta a crear (por ej. "01")
          parents: [webId],                            // la carpeta padre ES webId
          mimeType: "application/vnd.google-apps.folder",
        },
        fields: "id",                                   // solo queremos el ID
      });
      carpetaId = nueva.data.id;                  // ← ID final de la carpeta creada
      console.log("Se crea una carpeta ",carpetaId," con nombre ",propiedadCodigo)
    }

    console.log("Carpeta destino:", carpetaId);
    
    if (!carpetaId) {
      throw new Error("destinoId es undefined — no se puede crear archivo");
    }
    
    // Paso 5: Convertir archivo a stream
    const buffer = Buffer.from(await file.arrayBuffer());
    // Paso 6: Subir archivo a Drive
    const extension = file.name.split(".").pop();
    const uploaded = await drive.files.create({
      requestBody: {
        name: `${titulo}.${extension}`,
        parents: [carpetaId],
      },
      media: {
        mimeType: file.type,
        body: Readable.from(buffer),
      },
      fields: "id, name, webViewLink",
    });

    console.log("SUBIDA OK:", uploaded?.data);

    return NextResponse.json({
      success: true,
      file: uploaded.data,
    });

  } catch (err: any) {
    console.error("⛔ Error subiendo archivo:", err?.message || err);
    if (err?.message?.includes("invalid_grant")) {
      const oauth2 = getOAuthClient()
      const url = oauth2.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: ["https://www.googleapis.com/auth/drive"]
      })
      console.log("⚠️ Google Drive authorization expired")
      console.log("Authorize again here:")
      console.log(url)
    }
    return NextResponse.json(
      { error: err?.message || "Error interno" },
      { status: 500 }
    );
  }
}
