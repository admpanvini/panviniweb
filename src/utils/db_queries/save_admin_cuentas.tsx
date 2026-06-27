import pool from "../db_connector/pool";

export async function get_cuenta_by_id(id_cuenta: number) {
  try {
    const query = `
      SELECT
        id_cuenta,
        cuenta_titular,
        cuenta_email,
        cuenta_estado,
        cuenta_unidad_codigo,
        cuenta_tipo
      FROM cuentas
      WHERE id_cuenta=$1
      LIMIT 1;
    `;

    const r = await pool.query(query, [id_cuenta]);
    return r.rows[0] || null;

  } catch (err: any) {
    console.error("âŒ Error en get_cuenta_by_id:", err.message);
    return null;
  }
}

export async function save_cuenta({
  id_cuenta,
  cuenta_titular,
  cuenta_email,
  cuenta_estado,
  cuenta_unidad_codigo,
  propiedad_codigo,
  cuenta_tipo,
  cuenta_clave
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
        cuenta_tipo,
        cuenta_clave,
        cuenta_telefono,
        cuenta_token,
        cuenta_conexion
      ) VALUES ($1,$2,$3,$4,$5,$6,0,'',NOW())
      RETURNING *;
    `;
    const params = [
      cuenta_titular,
      cuenta_email,
      cuenta_estado,
      cuenta_unidad_codigo,
      cuenta_tipo,
      cuenta_clave
    ];

    const r = await pool.query(query, params);
    return r.rows[0];

  } catch (err: any) {
    console.error("❌ Error en save_cuenta:", err.message);
    return null;
  }
}
