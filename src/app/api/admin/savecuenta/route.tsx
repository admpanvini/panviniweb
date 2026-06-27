import { NextResponse } from "next/server";
import getDataFromCookiesToken from "@/utils/helpers/getDataFromCookiesToken";
import { get_cuenta_by_id, save_cuenta } from "@/utils/db_queries/save_admin_cuentas";
import { sendAccountApprovedEmail } from "@/utils/email/accountEmails";
import bcrypt from "bcryptjs";

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
      cuenta_unidad_codigo: cuenta_unidad_codigo_body,
      propiedad_codigo: propiedad_codigo_body,
      cuenta_tipo,
      cuenta_clave,
      id_cuenta
    } = body;
    let cuenta_unidad_codigo = cuenta_unidad_codigo_body;
    let propiedad_codigo = propiedad_codigo_body;

    // === VALIDACIONES ===
    if (cuenta_tipo === "admin") {
      cuenta_unidad_codigo = "admin";
      propiedad_codigo = "ad";
      body.cuenta_unidad_codigo = cuenta_unidad_codigo;
      body.propiedad_codigo = propiedad_codigo;
    }

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
    const cuentaAnterior = id_cuenta ? await get_cuenta_by_id(Number(id_cuenta)) : null;

    if (!id_cuenta) {
      if (!cuenta_clave || cuenta_clave.length < 6) {
        return NextResponse.json({ error: "Debe ingresar una clave inicial de al menos 6 caracteres" }, { status: 400 });
      }
      body.cuenta_clave = await bcrypt.hash(cuenta_clave, 10);
    }

    const result = await save_cuenta(body);

    if (
      result &&
      result.cuenta_estado === "activo" &&
      cuentaAnterior?.cuenta_estado !== "activo"
    ) {
      try {
        await sendAccountApprovedEmail({
          to: result.cuenta_email,
          name: result.cuenta_titular,
          unidad: result.cuenta_unidad_codigo
        });
      } catch (emailError) {
        console.error("No se pudo enviar email de aprobacion de cuenta:", emailError);
      }
    }

    return NextResponse.json(result, { status: 200 });

  } catch (err) {
    console.error("❌ Error en savecuenta:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
