import pool from "../db_connector/pool";

export async function get_cuentas({
  activos = false,
  pendientes = false,
  propiedad_codigo,
  unidad_codigo,
  id_cuenta
}: {
  activos?: boolean;
  pendientes?: boolean;
  propiedad_codigo?: string;
  unidad_codigo?: string;
  id_cuenta?:number
}) {
  try {
    const params: any[] = [];
    let where = [];

    // Estado
    if (activos) where.push(`c.cuenta_estado = 'activo'`);
    if (pendientes) where.push(`c.cuenta_estado = 'pendiente'`);
    if (!activos && !pendientes) where.push(`1=1`);

    // Filtro propiedad (primeras 2 letras)
    if (propiedad_codigo) {
      params.push(propiedad_codigo + "%");
      where.push(`c.cuenta_unidad_codigo LIKE $${params.length}`);
    }

    if (id_cuenta){
      where.push(`c.id_cuenta=${id_cuenta}`)
    }

    // Filtro unidad exacta
    if (unidad_codigo) {
      params.push(unidad_codigo);
      where.push(`c.cuenta_unidad_codigo = $${params.length}`);
    }

    const query = `
      SELECT 
        c.*,u.unidad_nombre,p.propiedad_nombre
      FROM cuentas c
      INNER JOIN unidades u ON u.unidad_codigo=c.cuenta_unidad_codigo
      INNER JOIN propiedades p ON p.propiedad_codigo=LEFT(c.cuenta_unidad_codigo,2)
      WHERE ${where.join(" AND ")}
      ORDER BY c.id_cuenta DESC
    `;
    console.log("Query--",query)
    const result = await pool.query(query, params);
    console.log("Responses: ",result.rows.length)
    return result.rows;

  } catch (err: any) {
    console.error("❌ Error en get_cuentas:", err.message);
    return null;
  }
}

