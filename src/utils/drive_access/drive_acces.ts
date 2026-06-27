import { google } from "googleapis";
import fs from "fs";
import { getOAuthClient, loadTokens } from "../google/google_oauth_client";

export async function listFiles(folder?: string) {

  // 1) Obtener todas las carpetas del Drive
  // a) Busco la carpeta web
  try{
    // Cargar OAuth tokens en cada request, porque el admin puede reautorizar Drive
    // sin reiniciar el server.
    const tokens = loadTokens();
    const oauth2 = getOAuthClient();
    oauth2.setCredentials(tokens);
    const drive = google.drive({ version: "v3", auth: oauth2 });

    const webSearch = await drive.files.list({
        q: "name='web' and mimeType = 'application/vnd.google-apps.folder' and trashed = false",
        fields: "files(id, name)"
      });
      
    console.log("Buscando la carpeta web--->",webSearch.data.files)
    const webId = webSearch.data.files?.[0]?.id;

    if (!webId) {
        throw new Error("No existe la carpeta web dentro de drive — no se puede crear archivo");
    }

    // b) Buscar SOLO carpeta 'XX' dentro de web
    const allFoldersRes = await drive.files.list({
      q: `'${webId}' in parents 
          and mimeType='application/vnd.google-apps.folder' 
          and trashed=false`,
      fields: "files(id,name)"
    });

    const allFolders = allFoldersRes.data.files || [];

    // 👉 Si se especifica una carpeta
    if (folder) {
      const found = allFolders.find((f) => f.name === folder);
      if (!found) return [];
      if (!found?.id) return [];
      let files = await getFilesFromFolder(drive, found.id);
      files = files.map((x: any) => ({ ...x, folder }))
      return files;
    }

    // 👉 Si NO se especifica carpeta: recorrer todas
    let allFiles: any[] = [];
    for (const f of allFolders) {
      if (!f.id) continue;
      let files = await getFilesFromFolder(drive, f.id);
      files = files.map((x: any) => ({ ...x, folder: f.name }))
      allFiles.push(...files);
    }

    return allFiles.filter( a => a.folder!= "web");
  }catch(err:any){
    if (err?.message?.includes("invalid_grant")) {
      const oauth2 = getOAuthClient();

      const url = oauth2.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: ["https://www.googleapis.com/auth/drive"]
      });

      console.log("⚠️ Google Drive authorization expired");
      console.log("Authorize again hereAAAAAA:");
      console.log(url);

      throw new Error(`${url}`);
    }

    throw err;
  }  
}


// --- Helper: Obtener archivos dentro de una carpeta ---
async function getFilesFromFolder(drive: any, folderId: string) {
  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: "files(id, name, mimeType, webViewLink, createdTime)",
    orderBy: "createdTime desc"
  });

  return res.data.files || [];
}

