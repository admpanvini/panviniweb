import pool from "../db_connector/pool";

export async function save_propiedad({
  id_propiedad,
  propiedad_nombre,
  propiedad_direccion,
  propiedad_codigo,
  propiedad_estado = "activo"
}: any) {
  try {
    // UPDATE
    console.log("HHAYY PROPIEDAD?? -->",id_propiedad)
    if (id_propiedad) {
      const q = `
        UPDATE propiedades
        SET 
          propiedad_nombre=$1,
          propiedad_direccion=$2,
          propiedad_codigo=$3,
          propiedad_estado=$4
        WHERE id_propiedad=$5
        RETURNING *;
      `;
      const p = [
        propiedad_nombre,
        propiedad_direccion,
        propiedad_codigo,
        propiedad_estado,
        id_propiedad
      ];
      const r = await pool.query(q, p);
      return r.rows[0];
    }

    // INSERT
    const q = `
      INSERT INTO propiedades (
        propiedad_nombre,
        propiedad_direccion,
        propiedad_codigo,
        propiedad_estado
      ) VALUES ($1,$2,$3,$4)
      RETURNING *;
    `;

    const p = [
      propiedad_nombre,
      propiedad_direccion,
      propiedad_codigo,
      propiedad_estado
    ];

    const r = await pool.query(q, p);
    return r.rows[0];

  } catch (err: any) {
    console.error("❌ Error en save_propiedad:", err.message);
    return null;
  }
}
