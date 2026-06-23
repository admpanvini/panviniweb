import { NextResponse } from "next/server";
import getDataFromCookiesToken from "@/utils/helpers/getDataFromCookiesToken";
import { get_admin_notificaciones } from "@/utils/db_queries/get_admin_notificationes";

export async function POST(req: Request) {
  try {
    const user = await getDataFromCookiesToken();
    if (!user || user.cuenta_tipo !== "admin") {
      return NextResponse.json({ error: "Sin permisos" }, { status: 400 });
    }

    const {
      id_propiedad = null,
      activos = true,
      eliminados = false,
      limit = 100,
      offset = 0,
    } = await req.json();

    const data = await get_admin_notificaciones({
      id_propiedad,
      activos,
      eliminados,
      limit,
      offset,
    });

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
