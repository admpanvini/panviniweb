import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { create_user } from "@/utils/db_queries/create_nueva_cuenta";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, unidad, email, password , cuenta_tipo} = body;

    if (!name || !unidad || !email || !password) {
      return NextResponse.json(
        { message: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const hash = await bcrypt.hash(password, 10);

    const result = await create_user({
      name,
      unidad,
      email,
      password: hash,
      cuenta_tipo
    });

    if (!result) {
      return NextResponse.json(
        { message: "Error al crear la cuenta" },
        { status: 500 }
      );
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