import { NextResponse } from "next/server";
import pool from "@/utils/db_connector/pool";
import getDataFromCookiesToken from "@/utils/helpers/getDataFromCookiesToken";

export async function POST(req: Request) {
  const user = await getDataFromCookiesToken();
  if (!user || user.cuenta_tipo !== "admin") {
    return NextResponse.json({ error: "Sin permisos" }, { status: 400 });
  }
  const { id_unidad } = await req.json();
  if (!id_unidad) {
    return NextResponse.json({ error: "Falta id" }, { status: 400 });
  }
  const q = `
    UPDATE UNIDADES
    SET unidad_estado =
      CASE 
        WHEN unidad_estado='activo' THEN 'eliminado'
        ELSE 'activo'
      END
    WHERE id_unidad=$1
    RETURNING *;
  `;
  console.log(q)
  const r = await pool.query(q, [id_unidad]);
  return NextResponse.json(r.rows[0]);
}
