import { google } from "googleapis";
import { NextResponse } from "next/server";
import { getOAuthClient, loadTokens } from "@/utils/google/google_oauth_client";

export async function POST(req: Request) {

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
}