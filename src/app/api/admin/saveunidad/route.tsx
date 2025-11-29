import { NextResponse } from "next/server";
import getDataFromCookiesToken from "@/utils/helpers/getDataFromCookiesToken";
import { save_unidad } from "@/utils/db_queries/save_admin_unidades";

export async function POST(req: Request) {
  try {
    const user = await getDataFromCookiesToken();
    if (!user || user.cuenta_tipo !== "admin") {
      return NextResponse.json({ error: "Sin permisos" }, { status: 400 });
    }

    const body = await req.json();
    const {
      unidad_nombre,
      unidad_codigo,
      unidad_titular,
      unidad_estado,
      propiedad_codigo,
    } = body;

    // === VALIDACIONES ===
    if (!unidad_codigo || unidad_codigo.length !== 6) {
      return NextResponse.json(
        { error: "El código de la unidad debe tener 6 caracteres" },
        { status: 400 }
      );
    }

    if (!unidad_nombre || unidad_nombre.trim() === "") {
      return NextResponse.json(
        { error: "El nombre de la unidad no puede estar vacío" },
        { status: 400 }
      );
    }

    if (!unidad_titular || unidad_titular.trim() === "") {
      return NextResponse.json(
        { error: "El titular de la unidad no puede estar vacío" },
        { status: 400 }
      );
    }

    const estadosValidos = ["pendiente", "activo", "eliminado", "inactivo"];
    if (!estadosValidos.includes(unidad_estado)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }

    if (!propiedad_codigo || propiedad_codigo.length !== 2) {
      return NextResponse.json(
        { error: "El código de propiedad debe tener 2 caracteres" },
        { status: 400 }
      );
    }

    // Guardar en DB
    const result = await save_unidad(body);
    return NextResponse.json(result ?? { ok: true });

  } catch (err) {
    console.error("❌ Error en saveunidad:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
