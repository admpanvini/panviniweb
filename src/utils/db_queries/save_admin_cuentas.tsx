import pool from "../db_connector/pool";

export async function save_cuenta({
  id_cuenta,
  cuenta_titular,
  cuenta_email,
  cuenta_estado,
  cuenta_unidad_codigo,
  propiedad_codigo,
  cuenta_tipo
}: any) {

  try {
    if (id_cuenta) {
      // UPDATE
      const query = `
        UPDATE cuentas
        SET 
          cuenta_titular=$1,
          cuenta_email=$2,
          cuenta_estado=$3,
          cuenta_unidad_codigo=$4,
          cuenta_tipo=$5
        WHERE id_cuenta=$6
        RETURNING *;
      `;
      const params = [
        cuenta_titular,
        cuenta_email,
        cuenta_estado,
        cuenta_unidad_codigo,
        cuenta_tipo,
        id_cuenta
      ];
      const r = await pool.query(query, params);
      return r.rows[0];
    }

    // INSERT
    const query = `
      INSERT INTO cuentas (
        cuenta_titular,
        cuenta_email,
        cuenta_estado,
        cuenta_unidad_codigo,
        cuenta_tipo
      ) VALUES ($1,$2,$3,$4,$5)
      RETURNING *;
    `;
    const params = [
      cuenta_titular,
      cuenta_email,
      cuenta_estado,
      cuenta_unidad_codigo,
      cuenta_tipo
    ];

    const r = await pool.query(query, params);
    return r.rows[0];

  } catch (err: any) {
    console.error("❌ Error en save_cuenta:", err.message);
    return null;
  }
}
