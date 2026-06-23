import { NextResponse } from "next/server";
import pool from "@/utils/db_connector/pool";
import getDataFromCookiesToken from "@/utils/helpers/getDataFromCookiesToken";

export async function POST(req: Request) {
  const user = await getDataFromCookiesToken();
  console.log("B")
  if (!user || user.cuenta_tipo !== "admin") {
    return NextResponse.json({ error: "Sin permisos" }, { status: 400 });
  }
  console.log("A")

  const { id_notificacion } = await req.json();
  if (!id_notificacion) {
    return NextResponse.json({ error: "Falta id" }, { status: 400 });
  }
  console.log("C")
  const q = `
    UPDATE notificaciones
    SET notificacion_estado =
      CASE 
        WHEN notificacion_estado='activo' THEN 'eliminado'
        ELSE 'activo'
      END
    WHERE id_notificacion=$1
    RETURNING *;
  `;
  console.log(q)
  const r = await pool.query(q, [id_notificacion]);

  return NextResponse.json(r.rows[0]);
}
