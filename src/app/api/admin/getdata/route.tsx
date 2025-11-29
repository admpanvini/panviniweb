import { get_admin_data } from "@/utils/db_queries/get_admin_data";
import getDataFromCookiesToken from "@/utils/helpers/getDataFromCookiesToken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const datos_cuenta = await getDataFromCookiesToken();
    if (!datos_cuenta || datos_cuenta.cuenta_tipo!='admin') {
      return NextResponse.json(
        { error: "Debe iniciar sesión como admin para poder consultar la información en este endpoint." },
        { status: 400 }
      );
    }
    const { id_cuenta } = datos_cuenta;
    const datos_cliente=await get_admin_data(id_cuenta)
    return NextResponse.json(datos_cliente || {});
  } catch (err) {
    console.error("Error interno:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

