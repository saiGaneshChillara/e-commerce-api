import "dotenv/config";
import bcrypt from "bcrypt";
import { getPool } from "../pool";


async function seedAdmin() {
  const pool = getPool();
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const existing = await pool.query(`SELECT id FROM users WHERE email = $1`,[email]);

  if (existing.rows.length > 0) {
    console.log("Admin already exists");
    return;
  }

  await pool.query(
    `INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3)`,
    [email, passwordHash, "admin"]
  );

  console.log("Admin user created");
}

seedAdmin()
  .then(() => process.exit())
  .catch((err) => {
  console.error(err);
  process.exit(1);
})