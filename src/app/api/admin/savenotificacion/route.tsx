import { NextResponse } from "next/server";
import getDataFromCookiesToken from "@/utils/helpers/getDataFromCookiesToken";
import { save_admin_notificacion } from "@/utils/db_queries/save_admin_notificacion";

export async function POST(req: Request) {
  try {
    const user = await getDataFromCookiesToken();
    if (!user || user.cuenta_tipo !== "admin") {
      return NextResponse.json({ error: "Sin permisos" }, { status: 400 });
    }

    const body = await req.json();
    const {
      notificacion_titulo,
      notificacion,
      notificacion_seccion,
      propiedades, // array: ["01", "02"]
    } = body;

    if (!notificacion_titulo || !notificacion) {
      return NextResponse.json({ error: "Completar título y detalle" }, { status: 400 });
    }

    if (!Array.isArray(propiedades) || propiedades.length === 0) {
      return NextResponse.json({ error: "Debe seleccionar al menos 1 propiedad" }, { status: 400 });
    }

    const result = await save_admin_notificacion(body);
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
