import { Product } from "../domain/product.entity";
import { CreateProductInput, PaginatedProducts, PaginationParams, ProductRepository } from "../domain/product.repository";

export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async createProduct(data: CreateProductInput): Promise<Product> {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error("Product name is requried");
    }

    const price = Number(data.price);

    if (isNaN(price) || price < 0) {
      throw new Error("Price must be a non negative number");
    }

    if (data.stock !== undefined && data.stock < 0) {
      throw new Error("Stock must be a non negative number");
    }

    return this.productRepository.create(data);
  }

  async getProduct(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  }

  async listProducts(params: PaginationParams): Promise<PaginatedProducts> {
    const page = params.page || 1;
    const limit = params.limit || 10;

    if (page <= 0) {
      throw new Error("Page must be greater than 0");
    }

    if (limit <= 0 || limit > 100) {
      throw new Error("Limit must be between 0 and 100");
    }

    return this.productRepository.findAll({ page, limit });
  }

  async updateProduct(id: string, data: Partial<CreateProductInput>): Promise<Product> {
    if (data.price !== undefined) {
      const price = Number(data.price);

      if (isNaN(price) || price < 0) {
        throw new Error("Price must be a non negative number");
      }
    }

    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new Error("Product not found");
    }

    return this.productRepository.updateProduct(id, data);
  }
}