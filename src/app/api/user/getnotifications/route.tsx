import getDataFromCookiesToken from "@/utils/helpers/getDataFromCookiesToken";
import { supabase } from "@/utils/db_connector/supabase";
import { NextResponse } from "next/server";
import { get_user_notifications } from "@/utils/db_queries/get_user_notifications";
import { listFiles } from "@/utils/drive_access/drive_acces";

export async function POST(req: Request) {
    const datos_cuenta=await getDataFromCookiesToken()
    if(!datos_cuenta){
        return NextResponse.json({error:"Debe iniciar sesión para poder consultar la información de la cuenta."}, { status: 400 })
    }
    const {id_cuenta}=datos_cuenta
    const data=await get_user_notifications(id_cuenta) 
    const files=await listFiles('01');
    console.log("FILESS",files)
    // Devolver los datos del usuario + token
    if(!data){
        return NextResponse.json({error:"Error en conexión con base de datos. El usuario no puede ser encontrado"}, { status: 400 })
    }
    return NextResponse.json(data || [])
}
