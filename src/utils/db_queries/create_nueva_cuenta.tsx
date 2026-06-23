import pool from "../db_connector/pool";

export async function create_user({
  name,
  unidad,
  email,
  password,
  cuenta_tipo
}: {
  name: string;
  unidad: string;
  email: string;
  password: string;
  cuenta_tipo: 'inquilino' | 'propietario' | 'inmobiliaria' | 'admin';
}) {
  try {
    const query = `
      INSERT INTO cuentas (
        id_cuenta,
        cuenta_titular,
        cuenta_tipo,
        cuenta_unidad_codigo,
        cuenta_estado,
        cuenta_telefono,
        cuenta_email,
        cuenta_clave,
        cuenta_token,
        cuenta_conexion
      )
      VALUES (
        nextval('cuentas_id_cuenta_seq'),
        $1,
        $5,
        $2,
        'pendiente',
        0,
        $3,
        $4,
        '',
        NOW()
      )
      RETURNING id_cuenta
    `;

    const result = await pool.query(query, [
      name,
      unidad,
      email,
      password,
      cuenta_tipo 
    ]);

    return result.rows[0];
  } catch (err: any) {
    console.error("❌ Error en create_user:", err?.message);
    return null;
  }
}