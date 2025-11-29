import { NextResponse } from 'next/server'
import { getCuentaByEmail } from '@/utils/login'
import { checkPasswords} from '@/utils/helpers/checkPasswords';
import jwt from "jsonwebtoken"
import { cookies } from 'next/headers';

// Handler de método POST en la ruta /api/login (o donde esté este archivo)
export async function POST(req: Request) {
  try {
    // Se obtiene el body de la request como JSON
    const body = await req.json();
    const { email, unidad_codigo, clave } = body;

    // Validaciones básicas de campos obligatorios
    if (!email) { 
      return NextResponse.json({ error: 'No se ha ingresado el email' }, { status: 400 })
    }
    if (!unidad_codigo) {
      return NextResponse.json({ error: 'No se ha ingresado el código de unidad.' }, { status: 400 })
    }
    if (!clave) { 
      return NextResponse.json({ error: 'No se ha ingresado la clave' }, { status: 400 })
    }

    // Buscar la cuenta en la base de datos usando email + unidad
    const data_from_db = await getCuentaByEmail({ email, unidad_codigo })
    const data = data_from_db[0]; // asumo que devuelve un array y tomo la primera
    if (!data) {
      return NextResponse.json(
        { error: 'El usuario y su código asociado no se encuentran registrado.' },
        { status: 400 }
      )
    }

    // Comparar la clave ingresada con la almacenada en la DB (hash)
    const checkPassword: Boolean = await checkPasswords(clave, data.cuenta_clave)
    if (!checkPassword) {
      return NextResponse.json({ error: 'Error en la clave.' }, { status: 400 })
    }

    // Generar un JWT con el id_cuenta como payload
    const token = await jwt.sign(
      { id_cuenta: data.id_cuenta , cuenta_tipo:data.cuenta_tipo},
      process.env.JWT_SECRET!, // la clave secreta del JWT
      { expiresIn: "30d" }     // expira en 30 días
    )

    // Guardar el token en cookie segura
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // solo HTTPS en prod
      maxAge: 60 * 60 * 24 * 30, // 30 días
      path: "/",
    });

    // Devolver los datos del usuario + token
    const { cuenta_clave, ...safeData } = data;// antes de devolver la respuesta
    return NextResponse.json({ ...safeData , token})

  } catch (err: any) {
    // Si ocurre un error inesperado, devolverlo con status 500
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
