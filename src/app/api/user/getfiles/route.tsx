import getDataFromCookiesToken from "@/utils/helpers/getDataFromCookiesToken";
import { NextResponse } from "next/server";
import { listFiles } from "@/utils/drive_access/drive_acces";

export async function POST(req: Request) {
    try {
        const datos_cuenta=await getDataFromCookiesToken()
        if(!datos_cuenta){
            return NextResponse.json({error:"Debe iniciar sesión para poder consultar la información de la cuenta."}, { status: 400 })
        }
        const body = await req.json()
        const { propiedad_codigo } = body
        console.log("Buscando files para el codigo de la propiedad",propiedad_codigo)
        const files=await listFiles(propiedad_codigo || '');
        // Devolver los datos del usuario + token
        if(!files){
            return NextResponse.json({error:"Error en conexión con base de datos. El usuario no puede ser encontrado"}, { status: 400 })
        }
        return NextResponse.json(files|| [])
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return NextResponse.json({
            error:"Error en la conexión con google drive",
            error_type:"google",
            details: message
        }, { status: 400 })
        return NextResponse.json({error:"Error en la conexión con google drive", "details": error}, { status: 400 })
    }

}
