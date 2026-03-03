import { Pool } from "pg";
import { User } from "../domain/user.entity";
import { CreateUserInput, UserRepository } from "../domain/user.repository";

export class PostgresUserRepository implements UserRepository {
  constructor(private readonly pool: Pool) {}
  private mapRowToUser(row: any): User {
    return {
      id: row.id,
      email: row.email,
      passwordHash: row.password_hash,
      role: row.role,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
  async findByEmail(email: string): Promise<User | null> {
    const result = await this.pool.query(
      `SELECT * FROM users WHERE email = $1 LIMIT 1`,
      [email]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToUser(result.rows[0]);
  }
  async findById(id: string): Promise<User | null> {
    const result = await this.pool.query(
      `SELECT * FROM users WHERE id = $1 LIMIT 1`,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToUser(result.rows[0]);
  }
  async create(data: CreateUserInput): Promise<User> {
    const result = await this.pool.query(
      `INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING *`,
      [
        data.email,
        data.passwordHash,
        data.role ?? "user",
      ]
    );

    return this.mapRowToUser(result.rows[0]);
  }
}