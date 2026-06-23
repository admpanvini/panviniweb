import pool from "../db_connector/pool";

export async function get_unit_accounts(id_cuenta:number) {
  try {
    const query = `
      SELECT 
        c.id_cuenta,
        c.cuenta_titular,
        c.cuenta_tipo,
        c.cuenta_email,
        c.cuenta_telefono,
        c.cuenta_unidad_codigo
      FROM cuentas c
      WHERE c.cuenta_unidad_codigo IN (SELECT cuenta_unidad_codigo FROM cuentas WHERE id_cuenta = $1)
    `;
    const result = await pool.query(query, [id_cuenta]);
    console.log('✅ Resultados (unit accounts):', result.rows);
    return result.rows;  
  } catch (err:any) {
    console.error('❌ Error en query:', err?.message || 'Unknown error');
    return null;
  } 
}
