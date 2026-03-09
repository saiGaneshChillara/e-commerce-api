export interface Product {
  id: string;
  
  name: string;
  description?: string;

  price: string;

  stock: number;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}