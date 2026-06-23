import pool from "../db_connector/pool";

interface AdminNotificacionInput {
  notificacion_titulo: string;
  notificacion: string;
  notificacion_seccion: number;
  propiedades: string[]; // ej: ["01","02"]
}


export async function save_admin_notificacion({
  notificacion_titulo,
  notificacion,
  notificacion_seccion,
  propiedades,
}: AdminNotificacionInput) {
  const inserted = [];

  for (const prop of propiedades) {
    const q = `
      INSERT INTO notificaciones(
        notificacion_titulo,
        notificacion,
        notificacion_id_propiedad,
        notificacion_estado,
        notificacion_seccion,
        notificacion_fecha
      ) VALUES ($1,$2,$3,'activo',$4, NOW())
      RETURNING *;
    `;

    const p = [
      notificacion_titulo,
      notificacion,
      prop,
      notificacion_seccion,
    ];

    const r = await pool.query(q, p);
    inserted.push(r.rows[0]);
  }

  return inserted;
}
