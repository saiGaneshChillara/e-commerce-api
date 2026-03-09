import { Request, Response } from "express";
import { ProductService } from "../application/product.service";

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  async create(req: Request, res: Response) {
    try {
      const product = await this.productService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await this.productService.listProducts({
        page,
        limit,
      });

      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const product = await this.productService.getProduct(req.params.id as string);
      res.json(product);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const product = await this.productService.updateProduct(req.params.id as string, req.body);
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}