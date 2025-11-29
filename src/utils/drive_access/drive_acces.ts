import { google } from "googleapis";
import fs from "fs";
import { getOAuthClient, loadTokens } from "../google/google_oauth_client";

// Cargar OAuth tokens
const tokens = loadTokens();
const oauth2 = getOAuthClient();
oauth2.setCredentials(tokens);
const drive = google.drive({ version: "v3", auth: oauth2 });

export async function listFiles(folder?: string) {

  // 1) Obtener todas las carpetas del Drive
  // a) Busco la carpeta web
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
    let files = await getFilesFromFolder(found.id);
    files = files.map(x => ({ ...x, folder }))
    return files;
  }

  // 👉 Si NO se especifica carpeta: recorrer todas
  let allFiles: any[] = [];
  for (const f of allFolders) {
    if (!f.id) continue;
    let files = await getFilesFromFolder(f.id);
    files = files.map(x => ({ ...x, folder: f.name }))
    allFiles.push(...files);
  }

  return allFiles.filter( a => a.folder!= "web");
}


// --- Helper: Obtener archivos dentro de una carpeta ---
async function getFilesFromFolder(folderId: string) {
  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: "files(id, name, mimeType, webViewLink, createdTime)",
    orderBy: "createdTime desc"
  });

  return res.data.files || [];
}

