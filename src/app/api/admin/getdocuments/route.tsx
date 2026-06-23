import { listFiles } from "@/utils/drive_access/drive_acces";
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
    const files=await listFiles()
    return NextResponse.json(files || {});
    } catch (err) {
      let message = "Error desconocido";
      err instanceof Error? message = err.message:message = String(err);
      return NextResponse.json({error: "Error interno del servidor",error_type: 'google',details: message},{ status: 500 });
  }
}

