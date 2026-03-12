import { Pool } from "pg";
import { Address } from "../domain/address.entity";
import { AddressRepository, CreateAddressInput, UpdateAddressInput } from "../domain/address.repository";

export class PostgresAddressRepository implements AddressRepository {
  constructor(private readonly pool: Pool) { }

  private mapRow(row: any): Address {
    return {
      id: row.id,
      userId: row.user_id,
      line1: row.line1,
      line2: row.line2,
      city: row.city,
      state: row.state,
      postalCode: row.postal_code,
      country: row.country,
      isDefault: row.is_default,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  async create(userId: string, data: CreateAddressInput): Promise<Address> {
    const result = await this.pool.query(
      `INSERT INTO addresses (user_id,line1,line2,city,state,postal_code,country,is_default) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [
        userId,
        data.line1,
        data.line2 ?? null,
        data.city,
        data.state ?? null,
        data.postalCode,
        data.country,
        data.isDefault ?? false
      ]
    );

    return this.mapRow(result.rows[0]);
  }
  async findByUser(userId: string): Promise<Address[]> {
    const result = await this.pool.query(
      `SELECT * FROM addresses WHERE user_id = $1 ORDER By created_at DESC`,
      [userId]
    );

    return result.rows.map((r) => this.mapRow(r));
  }
  async findById(id: string): Promise<Address | null> {
    const result = await this.pool.query(
      `SELECT * FROM addresses WHERE id = $1 LIMIT 1`,
      [id]
    );

    if (result.rowCount === 0) {
      return null;
    }

    return this.mapRow(result.rows[0]);
  }
  async update(addressId: string, userId: string, data: UpdateAddressInput): Promise<Address> {
    const result = await this.pool.query(
      `UPDATE addresses
      SET line1 = COALESCE($1,line1),
          line2 = COALESCE($2,line2),
          city = COALESCE($3,city),
          state = COALESCE($4,state),
          postal_code = COALESCE($5,postal_code),
          country = COALESCE($6,country),
          is_default = COALESCE($7,is_default),
          updated_at = NOW()
        WHERE id = $8 AND user_id = $9
        RETURNING *`,
      [
        data.line1 ?? null,
        data.line2 ?? null,
        data.city ?? null,
        data.state ?? null,
        data.postalCode ?? null,
        data.country ?? null,
        data.isDefault ?? null,
        addressId,
        userId
      ]
    );

    if (result.rowCount === 0) {
      throw new Error("Address not found");
    }

    return this.mapRow(result.rows[0]);
  }
  async delete(addressId: string, userId: string): Promise<void> {
    await this.pool.query(
      `DELETE FROM addresses WHERE id = $1 AND user_id = $2`,
      [addressId, userId]
    );
  }
  async clearDefault(userId: string): Promise<void> {
    await this.pool.query(
      `UPDATE addresses SET is_default = false WHERE user_id = $1`,
      [userId]
    );
  }
}