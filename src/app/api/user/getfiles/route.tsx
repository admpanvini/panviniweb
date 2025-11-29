import getDataFromCookiesToken from "@/utils/helpers/getDataFromCookiesToken";
import { NextResponse } from "next/server";
import { listFiles } from "@/utils/drive_access/drive_acces";

export async function POST(req: Request) {
    const datos_cuenta=await getDataFromCookiesToken()
    if(!datos_cuenta){
        return NextResponse.json({error:"Debe iniciar sesión para poder consultar la información de la cuenta."}, { status: 400 })
    }
    const {id_cuenta}=datos_cuenta
    const files=await listFiles('01');
    // Devolver los datos del usuario + token
    if(!files){
        return NextResponse.json({error:"Error en conexión con base de datos. El usuario no puede ser encontrado"}, { status: 400 })
    }
    return NextResponse.json(files|| [])
}
