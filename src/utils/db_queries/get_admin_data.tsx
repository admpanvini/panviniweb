import pool from "../db_connector/pool";

export async function get_admin_data(id_cuenta:number) {
  try {
    const query = `
      SELECT 
        c.id_cuenta,
        c.cuenta_titular,
        c.cuenta_tipo,
        c.cuenta_unidad_codigo,
        c.cuenta_email,
        c.cuenta_telefono
      FROM cuentas c
      WHERE c.id_cuenta = $1
      AND c.cuenta_unidad_codigo='admin'
    `;
    const result = await pool.query(query, [id_cuenta]);
    console.log('✅ Resultados (admin data ):', result.rows);
    return result.rows[0];  
  } catch (err:any) {
    console.error('❌ Error en query:', err?.message || 'Unknown error');
    return null;
  } 
}
