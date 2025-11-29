import { get_admin_propiedades } from "@/utils/db_queries/get_admin_propiedades";
import getDataFromCookiesToken from "@/utils/helpers/getDataFromCookiesToken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("Buscando propiedades...")
    const datos_cuenta = await getDataFromCookiesToken();
    const {seeAll,id_propiedad}:{seeAll?:boolean,id_propiedad?:number} = await req.json(); 
    const seeAll_var=seeAll?seeAll:true
    if (!datos_cuenta || datos_cuenta.cuenta_tipo!='admin') {
      console.log("No hay permisos")
      return NextResponse.json(
        { error: "Debe iniciar sesión como admin para poder consultar la información en este endpoint." },
        { status: 400 }
      );
    }
    const propiedades=await get_admin_propiedades(seeAll_var,id_propiedad)
    return NextResponse.json(propiedades || []);
  } catch (err) {
    console.error("Error interno:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

