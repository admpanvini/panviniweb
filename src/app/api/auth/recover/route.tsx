import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendEmail } from "@/utils/email/sendEmail";
import { buildEmailTemplate } from "@/utils/email/emailTemplate";
import {
  getCuentaForPasswordReset,
  savePasswordResetToken
} from "@/utils/db_queries/password_reset";

const genericResponse = {
  ok: true,
  message: "Si los datos son correctos, enviamos un email para recuperar la clave."
};

function getTokenHash(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function getResetMinutes() {
  return Number(process.env.PASSWORD_RESET_TOKEN_MINUTES || 30);
}

function getBaseUrl() {
  return (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");
}

function getErrorMessage(err: unknown) {
  return err instanceof Error ? err.message : "Error desconocido";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim();
    const unidad_codigo = String(body.unidad_codigo || body.unidad || "").trim();

    if (!email || !unidad_codigo) {
      return NextResponse.json(
        { message: "Debe ingresar email y unidad" },
        { status: 400 }
      );
    }

    const cuenta = await getCuentaForPasswordReset({ email, unidad_codigo });

    if (!cuenta || cuenta.cuenta_estado === "eliminado") {
      return NextResponse.json(genericResponse);
    }

    const token = crypto.randomBytes(32).toString("hex");
    const token_hash = getTokenHash(token);
    const minutes = getResetMinutes();
    const expires_at = new Date(Date.now() + minutes * 60 * 1000);
    const resetUrl = `${getBaseUrl()}/auth/reset?token=${token}`;

    await savePasswordResetToken({
      id_cuenta: cuenta.id_cuenta,
      token_hash,
      expires_at
    });

    const emailTemplate = buildEmailTemplate({
      title: "Recuperar clave",
      preheader: `El link vence en ${minutes} minutos.`,
      paragraphs: [
        `Hola ${cuenta.cuenta_titular}.`,
        "Recibimos una solicitud para cargar una nueva clave.",
        `El link vence en ${minutes} minutos. Si no pediste este cambio, podes ignorar este email y tu clave anterior seguira igual.`
      ],
      button: {
        text: "Cargar nueva clave",
        url: resetUrl
      }
    });

    await sendEmail({
      to: cuenta.cuenta_email,
      subject: "Recuperar clave",
      text: emailTemplate.text,
      html: emailTemplate.html
    });

    return NextResponse.json(genericResponse);

  } catch (err: unknown) {
    console.error("Error en recuperar clave:", getErrorMessage(err));

    return NextResponse.json(
      { message: "No se pudo enviar el email de recuperacion" },
      { status: 500 }
    );
  }
}
