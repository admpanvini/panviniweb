import { NextResponse } from "next/server";
import pool from "@/utils/db_connector/pool";
import getDataFromCookiesToken from "@/utils/helpers/getDataFromCookiesToken";

export async function POST(req: Request) {
  try {
    const user = await getDataFromCookiesToken();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 400 });
    }

    const { nombre, telefono } = await req.json();

    if (!nombre || !telefono) {
      return NextResponse.json({ error: "Los datos que has enviado están incorrectos. Por favor revisa que completaste todos los campos." }, { status: 400 });
    }

    const q = `
      UPDATE cuentas
      SET cuenta_titular = $1,
          cuenta_telefono = $2
      WHERE id_cuenta = $3
      RETURNING *;
    `;

    const r = await pool.query(q, [nombre, telefono, user.id_cuenta]);

    return NextResponse.json(r.rows[0]);

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}