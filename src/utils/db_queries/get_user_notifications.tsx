import pool from "../db_connector/pool";

export async function get_user_notifications(id_cuenta:number) {
  try {
    const query = `
      SELECT 
        n.*
      FROM cuentas c
      INNER JOIN propiedades p 
        ON LEFT(p.propiedad_codigo, 2) = LEFT(c.cuenta_unidad_codigo, 2)
      INNER JOIN notificaciones n 
        ON p.id_propiedad=n.notificacion_id_propiedad
      WHERE c.id_cuenta = $1
      AND n.notificacion_estado='activo'
      ORDER BY n.id_notificacion DESC
      LIMIT 10;
    `;
    const result = await pool.query(query, [id_cuenta]);
    console.log('✅ Resultados (user notifications):', result.rows);
    return result.rows;  
  } catch (err:any) {
    console.error('❌ Error en query:', err?.message || 'Unknown error');
    return null;
  } 
}
