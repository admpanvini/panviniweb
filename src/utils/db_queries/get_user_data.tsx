import pool from "../db_connector/pool";

export async function get_user_data(id_cuenta:number) {
  try {
    const query = `
      SELECT 
        c.id_cuenta,
        c.cuenta_titular,
        c.cuenta_tipo,
        c.cuenta_unidad_codigo
      FROM cuentas c
      WHERE c.id_cuenta = $1
      AND c.cuenta_unidad_codigo='admin'
    `;
    const result = await pool.query(query, [id_cuenta]);
    console.log('✅ Resultados (user data):', result.rows);
    return result.rows;  
  } catch (err:any) {
    console.error('❌ Error en query:', err?.message || 'Unknown error');
    return null;
  } 
}
