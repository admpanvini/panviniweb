import pool from "../db_connector/pool";

interface GetNotiParams {
  id_propiedad: string | null;
  activos: boolean;
  eliminados: boolean;
  limit: number;
  offset: number;
}

export async function get_admin_notificaciones({
  id_propiedad,
  activos,
  eliminados,
  limit,
  offset,
}: GetNotiParams) {

  const filtro_prop =
    id_propiedad ? `n.notificacion_id_propiedad = $3` : "1=1";

  let filtro_estado = "1=1";
  if (activos && !eliminados) filtro_estado = "n.notificacion_estado = 'activo'";
  if (!activos && eliminados) filtro_estado = "n.notificacion_estado = 'eliminado'";

  const q = `
    SELECT 
      n.*,
      p.propiedad_nombre
    FROM notificaciones n
    LEFT JOIN propiedades p 
      ON p.id_propiedad = n.notificacion_id_propiedad
    WHERE ${filtro_prop} AND ${filtro_estado}
    ORDER BY n.notificacion_fecha DESC
    LIMIT $1 OFFSET $2
  `;

  const params = id_propiedad
    ? [limit, offset, id_propiedad]
    : [limit, offset];

  const result = await pool.query(q, params);
  console.log('✅ Resultados (admin notifications):', result.rows?.length);
  return result.rows;
}

