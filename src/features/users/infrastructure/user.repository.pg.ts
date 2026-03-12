import { Pool } from "pg";
import { User, UserWithPassword } from "../domain/user.entity";
import { CreateUserInput, UpdateProfileInput, UserRepository } from "../domain/user.repository";

export class PostgresUserRepository implements UserRepository {
  constructor(private readonly pool: Pool) {}

  private mapRowToUser(row: any): User {
    return {
      id: row.id,
      email: row.email,
      role: row.role,
      name: row.name ?? "",
      phoneNumber: row.phone_number ?? "",
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapRowToUserWithPassword(row: any): UserWithPassword {
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      phoneNumber: row.phone_number,
      role: row.role,
      passwordHash: row.password_hash,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  async updateProfile(userId: string, data: UpdateProfileInput): Promise<User> {
    const result = await this.pool.query(
      `UPDATE users SET name = COALESCE($1, name), phone_number = COALESCE($2, phone_number), updated_at = NOW() WHERE id = $3 RETURNING *`,
      [
        data.name ?? null,
        data.phoneNumber ?? null,
        userId
      ]
    );

    return this.mapRowToUser(result.rows[0]);
  }
  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await this.pool.query(
      `UPDATE users
      SET password_hash = $1,
        updated_at = NOW()
      WHERE id = $2`,
      [passwordHash, userId]
    );
  }
  async findByEmail(email: string): Promise<UserWithPassword | null> {
    const result = await this.pool.query(
      `SELECT * FROM users WHERE email = $1 LIMIT 1`,
      [email]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToUserWithPassword(result.rows[0]);
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
  async create(data: CreateUserInput): Promise<UserWithPassword> {
    const result = await this.pool.query(
      `INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING *`,
      [
        data.email,
        data.passwordHash,
        data.role ?? "user",
      ]
    );

    return this.mapRowToUserWithPassword(result.rows[0]);
  }
}