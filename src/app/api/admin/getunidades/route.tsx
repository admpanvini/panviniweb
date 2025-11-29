import { get_admin_unidades } from "@/utils/db_queries/get_admin_unidades";
import getDataFromCookiesToken from "@/utils/helpers/getDataFromCookiesToken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("Buscando propiedades...")
    const datos_cuenta = await getDataFromCookiesToken();
    console.log(req)
    const {id_unidad,unidad_codigo,propiedad_codigo}:{id_unidad?:number,unidad_codigo?:string,propiedad_codigo?:string} = await req.json(); 
    if (!datos_cuenta || datos_cuenta.cuenta_tipo!='admin') {
      console.log("No hay permisos")
      return NextResponse.json(
        { error: "Debe iniciar sesión como admin para poder consultar la información en este endpoint." },
        { status: 400 }
      );
    }
    const propiedades = await get_admin_unidades(true,propiedad_codigo,unidad_codigo,id_unidad);
    //console.log(propiedades.length)
    return NextResponse.json(propiedades || []);
  } catch (err) {
    console.error("Error interno:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

