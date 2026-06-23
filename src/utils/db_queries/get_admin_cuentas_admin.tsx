import pool from "../db_connector/pool";

export async function get_cuentas_admin({
  activos = false,
  pendientes = false,
  id_cuenta
}: {
  activos?: boolean;
  pendientes?: boolean;
  id_cuenta?:number
}) {
  try {
    const params: any[] = [];
    let where = ['c.cuenta_tipo = \'admin\''];

    // Estado
    if (activos) where.push(`c.cuenta_estado = 'activo'`);
    if (pendientes) where.push(`c.cuenta_estado = 'pendiente'`);
    if (!activos && !pendientes) where.push(`1=1`);

    if (id_cuenta){
      where.push(`c.id_cuenta=${id_cuenta}`)
    }

    const query = `
      SELECT 
        c.*
      FROM cuentas c
      WHERE ${where.join(" AND ")}
      ORDER BY c.id_cuenta DESC
    `;
    const result = await pool.query(query, params);
    console.log("Responses: ",result.rows.length)
    return result.rows;
  } catch (err: any) {
    console.error("❌ Error en get_cuentas:", err.message);
    return null;
  }
}

