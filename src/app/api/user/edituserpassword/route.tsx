import { NextResponse } from "next/server";
import pool from "@/utils/db_connector/pool";
import getDataFromCookiesToken from "@/utils/helpers/getDataFromCookiesToken";
import bcrypt from "bcrypt";
import { checkPasswords } from "@/utils/helpers/checkPasswords";

export async function POST(req: Request) {
  
  try {
    const user = await getDataFromCookiesToken();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 400 });
    }

    const { clave_actual, clave_nueva_1, clave_nueva_2 } = await req.json();

    if (!clave_actual || !clave_nueva_1 || !clave_nueva_2) {
      return NextResponse.json({ error: "Los datos que has enviado están incorrectos. Por favor revisa que completaste todos los campos." }, { status: 400 });
    }

    if (clave_nueva_1 !== clave_nueva_2) {
      return NextResponse.json({ error: "Las nuevas claves no coinciden" }, { status: 400 });
    }

    // 🔹 obtener clave actual
    const qUser = `SELECT cuenta_clave FROM cuentas WHERE id_cuenta=$1`;
    const rUser = await pool.query(qUser, [user.id_cuenta]);

    const hash = rUser.rows[0]?.cuenta_clave;
    const valid = await checkPasswords(clave_actual,hash)
    if (!valid) {
      return NextResponse.json({ error: "Clave actual incorrecta" }, { status: 400 });
    }

    // 🔹 actualizar
    const newHash = await bcrypt.hash(clave_nueva_1, 10);

    const qUpdate = `
      UPDATE cuentas
      SET cuenta_clave = $1
      WHERE id_cuenta = $2
      RETURNING id_cuenta;
    `;

    await pool.query(qUpdate, [newHash, user.id_cuenta]);

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}