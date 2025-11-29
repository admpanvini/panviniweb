import { Pool } from 'pg';

declare global {
  // Evita crear múltiples pools en hot reload (modo dev)
  var cachedPool: Pool | undefined;
}

const pool =
  global.cachedPool ||
  new Pool({
    host: 'aws-1-us-east-2.pooler.supabase.com',
    port: 5432,
    user: 'postgres.rjmbajtztmrhmdlpsumq',
    password: process.env.SUPABASE_DB_PASS,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000,
  });

pool.on('error', (err) => {
  if (!err.message.includes('db_termination'))
    console.error('Error del pool:', err.message);
});

// Guarda el pool globalmente (Next.js reinicia módulos en dev)
if (process.env.NODE_ENV !== 'production') global.cachedPool = pool;

export default pool;
