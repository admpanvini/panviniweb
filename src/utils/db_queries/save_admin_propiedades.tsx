import pool from "../db_connector/pool";

export async function save_propiedad({
  id_propiedad,
  propiedad_nombre,
  propiedad_direccion,
  propiedad_codigo,
  propiedad_estado = "activo",
  propiedad_datos=""
}: any) {
  try {
    // UPDATE
    console.log("propiedad_datos",propiedad_datos,"propiedad_datos")
    if (id_propiedad) {
      const q = `
        UPDATE propiedades
        SET 
          propiedad_nombre=$1,
          propiedad_direccion=$2,
          propiedad_codigo=$3,
          propiedad_estado=$4,
          propiedad_datos=$5
        WHERE id_propiedad=$6
        RETURNING *;
      `;
      const p = [
        propiedad_nombre,
        propiedad_direccion,
        propiedad_codigo,
        propiedad_estado,
        propiedad_datos,
        id_propiedad
      ];
      const r = await pool.query(q, p);
      return r.rows[0];
    }

    //Chequeo si no existe una propiedad con ese código
    const ch = `
      SELECT * FROM propiedades WHERE propiedad_codigo=$1 and propiedad_estado='activo';
    `;
    const chr = await pool.query(ch, [propiedad_codigo]);
    console.log(ch,chr)
    if (chr.rows.length > 0) {
      throw new Error(`El código de la propiedad está actualmente en uso. Código: ${propiedad_codigo}: Propiedad : ${chr.rows[0]?.propiedad_nombre || '-'}`);
    }
    // INSERT
    const q = `
      INSERT INTO propiedades (
        propiedad_nombre,
        propiedad_direccion,
        propiedad_codigo,
        propiedad_estado,
        propiedad_datos
      ) VALUES ($1,$2,$3,$4,$5)
      RETURNING *;
    `;
    console.log("Query-->",q)
    const p = [
      propiedad_nombre,
      propiedad_direccion,
      propiedad_codigo,
      propiedad_estado,
      propiedad_datos
    ];

    const r = await pool.query(q, p);
    return r.rows[0];

  } catch (err: any) {
    console.error("❌ Error en save_propiedad:", err.message);
    return {error:err.message};
  }
}
