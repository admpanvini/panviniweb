import pool from "../db_connector/pool";

type GetCuentaInput = {
  email: string;
  unidad_codigo: string;
};

type SaveTokenInput = {
  id_cuenta: number;
  token_hash: string;
  expires_at: Date;
};

type ResetPasswordInput = {
  id_password_reset_token: number;
  id_cuenta: number;
  cuenta_clave: string;
};

export async function ensurePasswordResetTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id_password_reset_token BIGSERIAL PRIMARY KEY,
      id_cuenta INTEGER NOT NULL REFERENCES cuentas(id_cuenta) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      used_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS password_reset_tokens_token_hash_idx
    ON password_reset_tokens(token_hash);
  `);
}

export async function getCuentaForPasswordReset({ email, unidad_codigo }: GetCuentaInput) {
  const query = `
    SELECT
      id_cuenta,
      cuenta_titular,
      cuenta_email,
      cuenta_estado,
      cuenta_unidad_codigo
    FROM cuentas
    WHERE LOWER(cuenta_email)=LOWER($1)
      AND cuenta_unidad_codigo=$2
    LIMIT 1;
  `;

  const result = await pool.query(query, [email, unidad_codigo]);

  return result.rows[0] || null;
}

export async function savePasswordResetToken({ id_cuenta, token_hash, expires_at }: SaveTokenInput) {
  await ensurePasswordResetTable();

  await pool.query(`
    UPDATE password_reset_tokens
    SET used_at=NOW()
    WHERE id_cuenta=$1
      AND used_at IS NULL;
  `, [id_cuenta]);

  const query = `
    INSERT INTO password_reset_tokens (
      id_cuenta,
      token_hash,
      expires_at
    ) VALUES ($1,$2,$3)
    RETURNING *;
  `;

  const result = await pool.query(query, [id_cuenta, token_hash, expires_at]);

  return result.rows[0];
}

export async function getValidPasswordResetToken(token_hash: string) {
  await ensurePasswordResetTable();

  const query = `
    SELECT
      prt.id_password_reset_token,
      prt.id_cuenta,
      prt.expires_at,
      c.cuenta_email
    FROM password_reset_tokens prt
    INNER JOIN cuentas c ON c.id_cuenta=prt.id_cuenta
    WHERE prt.token_hash=$1
      AND prt.used_at IS NULL
      AND prt.expires_at > NOW()
    LIMIT 1;
  `;

  const result = await pool.query(query, [token_hash]);

  return result.rows[0] || null;
}

export async function resetPasswordByToken({
  id_password_reset_token,
  id_cuenta,
  cuenta_clave
}: ResetPasswordInput) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const tokenUpdate = await client.query(`
      UPDATE password_reset_tokens
      SET used_at=NOW()
      WHERE id_password_reset_token=$1
        AND id_cuenta=$2
        AND used_at IS NULL
      RETURNING id_cuenta;
    `, [id_password_reset_token, id_cuenta]);

    if (!tokenUpdate.rows[0]) {
      throw new Error("El token ya fue utilizado");
    }

    const cuentaUpdate = await client.query(`
      UPDATE cuentas
      SET cuenta_clave=$1
      WHERE id_cuenta=$2
      RETURNING id_cuenta;
    `, [cuenta_clave, id_cuenta]);

    await client.query("COMMIT");

    return cuentaUpdate.rows[0];

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
