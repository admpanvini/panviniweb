import { getOAuthClient } from "@/utils/google/google_oauth_client";
import { NextResponse } from "next/server";

export async function GET() {
  const oauth2 = getOAuthClient();

  const url = oauth2.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/drive",
    ],
  });

  return NextResponse.redirect(url);
}
