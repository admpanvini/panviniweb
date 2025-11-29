import { google } from "googleapis";
import fs from "fs";
import path from "path";

const TOKEN_PATH = path.join(process.cwd(), "tokens/google_oauth.json");

export function getOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI!;
  console.log(clientId, clientSecret, redirectUri)
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

export function loadTokens() {
  try {
    return JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
  } catch {
    return {};
  }
}

export function saveTokens(tokens: any) {
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
}

export const TOKEN_FILE = TOKEN_PATH;
