// src/infrastructure/database/pool.ts
import { Pool } from "pg";

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error("Database URL not found in .env");
    }
    pool = new Pool({
      connectionString: url,
      // you can add: ssl: { rejectUnauthorized: false } for some cloud providers
    });
  }
  return pool;
}