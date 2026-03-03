import { Pool } from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("Database URL not found in .env");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
