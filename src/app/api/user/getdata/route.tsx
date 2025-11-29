import { supabase } from "@/utils/db_connector/supabase";
import { get_user_units } from "@/utils/db_queries/get_user_units";
import getDataFromCookiesToken from "@/utils/helpers/getDataFromCookiesToken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const datos_cuenta = await getDataFromCookiesToken();
    if (!datos_cuenta) {
      return NextResponse.json(
        { error: "Debe iniciar sesión para poder consultar la información de la cuenta." },
        { status: 400 }
      );
    }
    const { id_cuenta } = datos_cuenta;
    const datos_cliente=await get_user_units(id_cuenta)
    return NextResponse.json(datos_cliente || {});
  } catch (err) {
    console.error("Error interno:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

