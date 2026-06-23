import pool from "../db_connector/pool";

export async function get_admin_propiedades(activos:boolean=true,id_propiedad?:number) {
  try {
    const filtro_estado=activos?`p.propiedad_estado = 'activo'`:`1=1`
    const filtro_id_propiedad=id_propiedad?`p.id_propiedad=${id_propiedad}`:`1=1`
    const query = `
      WITH 
      unidades_agrupadas AS (
        SELECT 
          LEFT(unidad_codigo, 2) AS prefijo,
          COUNT(id_unidad) AS total_unidades
        FROM unidades
        GROUP BY LEFT(unidad_codigo, 2)
      ),
      cuentas_pendientes AS (
        SELECT 
          LEFT(cuenta_unidad_codigo, 2) AS prefijo,
          COUNT(id_cuenta) AS total_pendientes
        FROM cuentas
        WHERE cuenta_estado = 'pendiente'
        GROUP BY LEFT(cuenta_unidad_codigo, 2)
      ),
      cuentas_total AS (
        SELECT 
          LEFT(cuenta_unidad_codigo, 2) AS prefijo,
          COUNT(id_cuenta) AS total_cuentas
        FROM cuentas
        WHERE cuenta_estado = 'activo'
        GROUP BY LEFT(cuenta_unidad_codigo, 2)
      )
      SELECT 
        p.*,
        COALESCE(u.total_unidades, 0) AS unidades,
        COALESCE(ct.total_cuentas, 0) AS cuentas_total,
        COALESCE(cp.total_pendientes, 0) AS cuentas_pendientes
      FROM propiedades p
      LEFT JOIN unidades_agrupadas u 
        ON u.prefijo = p.propiedad_codigo
      LEFT JOIN cuentas_total ct
        ON ct.prefijo = p.propiedad_codigo
      LEFT JOIN cuentas_pendientes cp
        ON cp.prefijo = p.propiedad_codigo
      WHERE ${filtro_estado}
        AND ${filtro_id_propiedad};
    `;
    const result = await pool.query(query, []);
    //console.log(query)
    return result.rows;  
  } catch (err:any) {
    console.error('❌ Error en query:', err?.message || 'Unknown error');
    return null;
  } 
}
