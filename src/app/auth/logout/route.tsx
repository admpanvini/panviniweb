import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  (await cookies()).set("token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  // usar el host de la request como base
  return NextResponse.redirect(new URL("/auth", request.url));
}