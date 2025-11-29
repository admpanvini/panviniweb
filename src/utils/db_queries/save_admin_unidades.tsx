import pool from "../db_connector/pool";

export async function save_unidad({
  id_unidad,
  unidad_nombre,
  unidad_codigo,
  unidad_titular,
  unidad_estado,
  propiedad_codigo
}: any) {
  try {
    // UPDATE
    if (id_unidad) {
      const q = `
        UPDATE unidades
        SET 
          unidad_nombre=$1,
          unidad_codigo=$2,
          unidad_titular=$3,
          unidad_estado=$4
        WHERE id_unidad=$5
        RETURNING *;
      `;
      const p = [
        unidad_nombre,
        unidad_codigo,
        unidad_titular,
        unidad_estado,
        id_unidad
      ];
      const r = await pool.query(q, p);
      return r.rows[0];
    }

    // INSERT
    const q = `
      INSERT INTO unidades (
        unidad_nombre,
        unidad_codigo,
        unidad_titular,
        unidad_estado
      ) VALUES ($1,$2,$3,$4)
      RETURNING *;
    `;

    const p = [
      unidad_nombre,
      unidad_codigo,
      unidad_titular,
      unidad_estado
    ];

    const r = await pool.query(q, p);
    return r.rows[0];

  } catch (err: any) {
    console.error("❌ Error en save_unidad:", err.message);
    return null;
  }
}
