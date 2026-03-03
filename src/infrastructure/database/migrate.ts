import fs from "fs";
import path from "path";
import { Pool } from "pg";

export async function runMigrations(pool: Pool) {
  const migrationsPath = path.join(__dirname, "migrations");

  const createMigrationsTableQuery = `
    CREATE TABLE IF NOT EXISTS migrations (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    executed_at TIMESTAMP DEFAULT NOW()
  );`;

  await pool.query(createMigrationsTableQuery);

  const files = fs.readdirSync(migrationsPath).sort();

  console.log("Found files: ", files);

  const res = await pool.query("SELECT name FROM migrations");
  const executedSet = new Set(res.rows.map(r => r.name));

  for (const file of files) {
    if (executedSet.has(file)) continue;

    const filePath = path.join(migrationsPath, file);
    const sql = fs.readFileSync(filePath, "utf-8");

    console.log(`Running migration: $${file}`);

    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      await client.query(sql);
      await client.query("INSERT INTO migrations (name) VALUES ($1)", [file]);
      await client.query("COMMIT");

      console.log(`Finished migration: ${file}`);
    } catch (error) {
      await client.query("ROLLBACK");
      console.error(`Error running migration: ${file}`);
      throw error;
    } finally {
      client.release();
    }
  }
}