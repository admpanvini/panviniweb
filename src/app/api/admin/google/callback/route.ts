import { getOAuthClient, loadTokens, saveTokens } from "@/utils/google/google_oauth_client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const oauth2 = getOAuthClient();
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

  const { tokens } = await oauth2.getToken(code);

  const saved = {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token || loadTokens().refresh_token,
  };

  saveTokens(saved);

  return NextResponse.redirect(new URL("/admin/documentos?drive=ok", req.url));
}
