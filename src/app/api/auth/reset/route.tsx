import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import {
  getValidPasswordResetToken,
  resetPasswordByToken
} from "@/utils/db_queries/password_reset";

function getTokenHash(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function getErrorMessage(err: unknown) {
  return err instanceof Error ? err.message : "Error desconocido";
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = String(url.searchParams.get("token") || "");

    if (!token) {
      return NextResponse.json(
        { error: "El link no es valido" },
        { status: 400 }
      );
    }

    const tokenData = await getValidPasswordResetToken(getTokenHash(token));

    if (!tokenData) {
      return NextResponse.json(
        { error: "El link no es valido o ya vencio" },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true });

  } catch (err: unknown) {
    console.error("Error validando token:", getErrorMessage(err));

    return NextResponse.json(
      { error: "No se pudo validar el link" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = String(body.token || "");
    const password = String(body.password || "");
    const repeat = String(body.repeat || "");

    if (!token || !password || !repeat) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La clave debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    if (password !== repeat) {
      return NextResponse.json(
        { error: "Las claves no coinciden" },
        { status: 400 }
      );
    }

    const tokenData = await getValidPasswordResetToken(getTokenHash(token));

    if (!tokenData) {
      return NextResponse.json(
        { error: "El link no es valido o ya vencio" },
        { status: 400 }
      );
    }

    const hash = await bcrypt.hash(password, 10);

    await resetPasswordByToken({
      id_password_reset_token: tokenData.id_password_reset_token,
      id_cuenta: tokenData.id_cuenta,
      cuenta_clave: hash
    });

    return NextResponse.json({ ok: true });

  } catch (err: unknown) {
    console.error("Error reseteando clave:", getErrorMessage(err));

    return NextResponse.json(
      { error: "No se pudo actualizar la clave" },
      { status: 500 }
    );
  }
}
