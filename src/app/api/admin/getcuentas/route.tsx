import { NextResponse } from "next/server";
import getDataFromCookiesToken from "@/utils/helpers/getDataFromCookiesToken";
import { get_cuentas } from "@/utils/db_queries/get_admin_cuentas";

export async function POST(req: Request) {
  try {
    const { activos, pendientes, propiedad_codigo, unidad_codigo , id_cuenta } = await req.json();
    const user = await getDataFromCookiesToken();

    if (!user || user.cuenta_tipo !== "admin") {
      return NextResponse.json({ error: "Sin permisos" }, { status: 400 });
    }

    const cuentas = await get_cuentas({
      id_cuenta,
      activos,
      pendientes,
      propiedad_codigo,
      unidad_codigo
    });
    //console.log("Cuentas--->",cuentas)
    return NextResponse.json(cuentas || []);

  } catch (err) {
    console.error("Error interno:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
