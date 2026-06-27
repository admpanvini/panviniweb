import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { create_user } from "@/utils/db_queries/create_nueva_cuenta";
import { sendAccountRequestedEmail } from "@/utils/email/accountEmails";

const tiposCuentaPermitidos = ["inquilino", "propietario", "inmobiliaria"];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, unidad, email, password , cuenta_tipo} = body;
    const cuentaTipo = String(cuenta_tipo || "");

    if (!name || !unidad || !email || !password) {
      return NextResponse.json(
        { message: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    if (!tiposCuentaPermitidos.includes(cuentaTipo)) {
      return NextResponse.json(
        { message: "Tipo de cuenta invalido" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "La clave debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    const hash = await bcrypt.hash(password, 10);

    const result = await create_user({
      name: String(name).trim(),
      unidad: String(unidad).trim(),
      email: String(email).trim().toLowerCase(),
      password: hash,
      cuenta_tipo: cuentaTipo as "inquilino" | "propietario" | "inmobiliaria"
    });

    if (!result) {
      return NextResponse.json(
        { message: "Error al crear la cuenta" },
        { status: 500 }
      );
    }

    try {
      await sendAccountRequestedEmail({
        to: String(email).trim().toLowerCase(),
        name: String(name).trim(),
        unidad: String(unidad).trim()
      });
    } catch (emailError) {
      console.error("No se pudo enviar email de solicitud de cuenta:", emailError);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error interno:", err);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
