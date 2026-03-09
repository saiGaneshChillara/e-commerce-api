import { Product } from "./product.entity";

export interface CreateProductInput {
  name: string;
  description?: string;
  price: string;
  stock?: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedProducts {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductRepository {
  create(data: CreateProductInput): Promise<Product>;

  findById(id: string): Promise<Product | null>;

  findAll(params: PaginationParams): Promise<PaginatedProducts>;

  updateStock(productId: string, stock: number): Promise<void>;

  updateProduct(id: string, data: Partial<CreateProductInput>): Promise<Product>
}