/* Simple migration runner for Campus Connect.
 * - Applies all .sql files in ./migrations in alphabetical order
 * - Tracks applied migrations in schema_migrations table
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const config = require('../src/config');

async function runMigrations() {
  const pool = new Pool({ connectionString: config.db.connectionString });
  const client = await pool.connect();

  try {
    await client.query(
      'CREATE TABLE IF NOT EXISTS schema_migrations (id SERIAL PRIMARY KEY, name TEXT UNIQUE NOT NULL, run_on TIMESTAMPTZ NOT NULL DEFAULT NOW())'
    );

    const applied = await client.query('SELECT name FROM schema_migrations');
    const appliedSet = new Set(applied.rows.map((r) => r.name));

    const migrationsDir = path.join(__dirname, '..', 'migrations');
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    // eslint-disable-next-line no-restricted-syntax
    for (const file of files) {
      if (appliedSet.has(file)) {
        // eslint-disable-next-line no-continue
        continue;
      }

      // eslint-disable-next-line no-console
      console.log(`Running migration: ${file}`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

      try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
        await client.query('COMMIT');
      } catch (err) {
        await client.query('ROLLBACK');
        // eslint-disable-next-line no-console
        console.error(`Migration failed: ${file}`, err);
        process.exitCode = 1;
        break;
      }
    }
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Migrations complete');
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Migration runner error', err);
    process.exit(1);
  });

