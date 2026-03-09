import { Pool } from "pg";
import { Product } from "../domain/product.entity";
import { CreateProductInput, PaginatedProducts, PaginationParams, ProductRepository } from "../domain/product.repository";

export class PostgresProductRepository implements ProductRepository {
  constructor(private readonly pool: Pool) {}

  private mapRowToProduct(row: any): Product {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price,
      stock: row.stock,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
  async create(data: CreateProductInput): Promise<Product> {
    const result = await this.pool.query(
      `INSERT INTO products (name, description, price, stock)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [
        data.name,
        data.description ?? null,
        data.price,
        data.stock ?? 0
      ]
    );

    return this.mapRowToProduct(result.rows[0]);
  }
  async findById(id: string): Promise<Product | null> {
    const result = await this.pool.query(
      `SELECT * FROM products WHERE id = $1 LIMIT 1`,
      [id]
    );

    if (result.rows.length === 0) return null;

    return this.mapRowToProduct(result.rows[0]);
  }
  async findAll({ page, limit }: PaginationParams): Promise<PaginatedProducts> {
    const offset = (page - 1) * limit;

    const productResult = await this.pool.query(
      `SELECT * FROM products WHERE is_active = true ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await this.pool.query(`SELECT COUNT(*) FROM products WHERE is_active = true`);

    return {
      data: productResult.rows.map(this.mapRowToProduct),
      total: Number(countResult.rows[0].count),
      page,
      limit,
    };
  }
  async updateStock(productId: string, stock: number): Promise<void> {
    await this.pool.query(
      `UPDATE products SET stock = $1, updated_at = NOW() WHERE id = $2`,
      [stock, productId]
    );
  }
  async updateProduct(id: string, data: Partial<CreateProductInput>): Promise<Product> {
    const result = await this.pool.query(
      `UPDATE products SET name = COALESCE($1, name), description = COALESCE($2, description), price = COALESCE($3, price), updated_at = NOW() WHERE id = $4 RETURNING *`,
      [
        data.name ?? null,
        data.description ?? null,
        data.price ?? null,
        id
      ]
    );

    return this.mapRowToProduct(result.rows[0]);
  }
}