import pool from "../db_connector/pool";

export async function get_user_units(id_cuenta:number) {
  try {
    const query = `
      SELECT 
        c.id_cuenta,
        c.cuenta_titular,
        c.cuenta_tipo,
        c.cuenta_email,
        c.cuenta_telefono,
        c.cuenta_unidad_codigo,
        u.id_unidad,
        u.unidad_nombre,
        u.unidad_titular,
        u.unidad_saldo1,
        u.unidad_saldo2,
        u.unidad_saldo3,
        u.unidad_vto_saldo1,
        u.unidad_vto_saldo2,
        u.unidad_vto_saldo3,
        u.unidad_codigo,
        p.id_propiedad,
        p.propiedad_nombre,
        p.propiedad_datos,
        p.propiedad_codigo,
        p.propiedad_direccion
      FROM cuentas c
      INNER JOIN unidades u 
        ON c.cuenta_unidad_codigo = u.unidad_codigo
      INNER JOIN propiedades p 
        ON LEFT(p.propiedad_codigo, 2) = LEFT(u.unidad_codigo, 2)
      WHERE c.id_cuenta = $1
    `;
    const result = await pool.query(query, [id_cuenta]);
    console.log('✅ Resultados (user units):', result.rows);
    return result.rows[0];  
  } catch (err:any) {
    console.error('❌ Error en query:', err?.message || 'Unknown error');
    return null;
  } 
}
