import { NextResponse } from "next/server";
import getDataFromCookiesToken from "@/utils/helpers/getDataFromCookiesToken";
import { save_cuenta } from "@/utils/db_queries/save_admin_cuentas";

export async function POST(req: Request) {
  try {
    
    // === VALIDAR SESIÓN DE ADMIN ===
    const user = await getDataFromCookiesToken();
    if (!user || user.cuenta_tipo !== "admin") {
      return NextResponse.json({ error: "Sin permisos" }, { status: 400 });
    }

    // === OBTENER PARAMETROS ===
    const body = await req.json();
    const {
      cuenta_titular,
      cuenta_email,
      cuenta_estado,
      cuenta_unidad_codigo,
      propiedad_codigo,
      cuenta_tipo
    } = body;

    // === VALIDACIONES ===

    if (!cuenta_titular || cuenta_titular.trim() === "") {
      return NextResponse.json({ error: "El titular no puede estar vacío" }, { status: 400 });
    }

    if (!cuenta_email || !/^\S+@\S+\.\S+$/.test(cuenta_email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    const estadosValidos = ["activo", "pendiente", "eliminado", "inactivo"];
    if (!estadosValidos.includes(cuenta_estado)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }

    if (!cuenta_unidad_codigo) {
      return NextResponse.json({ error: "Debe existir un código de unidad" }, { status: 400 });
    }
    if (cuenta_unidad_codigo!="admin" && cuenta_unidad_codigo.length < 6) {
      return NextResponse.json({ error: "Código de unidad debe tener al menos 6 caracteres" }, { status: 400 });
    }

    if (!propiedad_codigo || propiedad_codigo.length !== 2) {
      return NextResponse.json({ error: "Propiedad asociada debe ser de 2 dígitos" }, { status: 400 });
    }

    const tiposValidos = ["admin", "inquilino", "propietario", "inmobiliaria"];
    if (!tiposValidos.includes(cuenta_tipo)) {
      return NextResponse.json({ error: "Tipo de cuenta inválido" }, { status: 400 });
    }

    // === GUARDAR ===
    const result = await save_cuenta(body);
    return NextResponse.json(result, { status: 200 });

  } catch (err) {
    console.error("❌ Error en savecuenta:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
