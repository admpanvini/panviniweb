import { NextResponse } from "next/server";
import getDataFromCookiesToken from "@/utils/helpers/getDataFromCookiesToken";
import { save_propiedad } from "@/utils/db_queries/save_admin_propiedades";


export async function POST(req: Request) {
  try {
    const user = await getDataFromCookiesToken();
    if (!user || user.cuenta_tipo !== "admin") {
      return NextResponse.json({ error: "Sin permisos" }, { status: 400 });
    }

    const body = await req.json();
    const { 
    id_propiedad,
    propiedad_nombre,
    propiedad_direccion,
    propiedad_codigo,
    propiedad_estado,
    propiedad_datos
    } = body;

    if (!propiedad_nombre || propiedad_nombre.trim() === "") {
      return NextResponse.json(
        { error: "El nombre de la propiedad no puede estar vacío" },
        { status: 400 }
      );
    }

    if (!propiedad_direccion || propiedad_direccion.trim() === "") {
      return NextResponse.json(
        { error: "La dirección no puede estar vacía" },
        { status: 400 }
      );
    }

    if (!propiedad_codigo || propiedad_codigo.length !== 2) {
      return NextResponse.json(
        { error: "El código de propiedad debe tener exactamente 2 caracteres" },
        { status: 400 }
      );
    }

    const estadosValidos = ["activo", "eliminado"];
    if (propiedad_estado && !estadosValidos.includes(propiedad_estado)) {
      return NextResponse.json(
        { error: "Estado inválido" },
        { status: 400 }
      );
    }
    
    const result = await save_propiedad({
      id_propiedad,
      propiedad_nombre,
      propiedad_direccion,
      propiedad_codigo,
      propiedad_estado,
      propiedad_datos
    });

    if(result.error){ // Si hay un error generado dentro del save propiedad.
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json(result ?? { ok: true });
  } catch (err) {
    console.error("❌ Error en savepropiedad:", err);
    return NextResponse.json({ error: "Error interno" },{ status: 500 });
  }
}