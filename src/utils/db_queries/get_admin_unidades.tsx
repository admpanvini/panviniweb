import pool from "../db_connector/pool";

export async function get_admin_unidades(activos:boolean=true,propiedad_codigo?:string, unidad_codigo?:string, id_unidad?:number) {
  try {
    const filtro_estado=activos?`u.unidad_estado = 'activo'`:`1=1`
    const filtro_codigo_propiedad=propiedad_codigo?`LEFT(u.unidad_codigo,2)='${propiedad_codigo}'`:`1=1`
    const filtro_id_unidad=id_unidad?`u.id_unidad=${id_unidad}`:"1=1"
    const filtro_unidad_codigo=unidad_codigo?`u.unidad_codigo=${unidad_codigo}`:"1=1"
    const query = `
      WITH 
      cuentas_pendientes AS (
        SELECT 
          cuenta_unidad_codigo AS prefijo,
          COUNT(id_cuenta) AS total_pendientes
        FROM cuentas
        WHERE cuenta_estado = 'pendiente'
        GROUP BY cuenta_unidad_codigo
      )
      SELECT 
        u.*,coalesce(cp.total_pendientes,0) as pending_accounts
      FROM unidades u
      LEFT JOIN cuentas_pendientes cp ON cp.prefijo=u.unidad_codigo
      WHERE ${filtro_estado} and ${filtro_codigo_propiedad} and ${filtro_id_unidad} and ${filtro_unidad_codigo}
      
    `;
    console.log(query)
    const result = await pool.query(query, []);
    console.log('✅ Resultados:', result.rows.length);
    return result.rows;  
  } catch (err:any) {
    console.error('❌ Error en query:', err?.message || 'Unknown error');
    return null;
  } 
}
