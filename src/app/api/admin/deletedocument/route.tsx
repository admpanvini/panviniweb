import { google } from "googleapis";
import { NextResponse } from "next/server";
import { getOAuthClient, loadTokens } from "@/utils/google/google_oauth_client";
import getDataFromCookiesToken from "@/utils/helpers/getDataFromCookiesToken";

export async function POST(req: Request) {

  try {
    const user = await getDataFromCookiesToken();
    if (!user || user.cuenta_tipo !== "admin") {
      return NextResponse.json({ error: "Sin permisos" }, { status: 400 });
    }

    const body = await req.json()
    const { id : fileId } = body
    if (!fileId) {
      return NextResponse.json({ error: "fileId requerido" }, { status: 400 })
    }

    const tokens = loadTokens()
    const oauth2 = getOAuthClient()
    oauth2.setCredentials(tokens)

    const drive = google.drive({ version: "v3", auth: oauth2 })
    console.log("Eliminado...",fileId)
    await drive.files.delete({
      fileId: fileId
    })

    return NextResponse.json({
      success: true
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("invalid_grant")) {
      return NextResponse.json({
        error: "La conexión con Google Drive caducó",
        error_type: "google",
        reconnect_url: "/api/admin/google"
      }, { status: 500 });
    }

    return NextResponse.json({
      error: message || "Error interno"
    }, { status: 500 });
  }
}
