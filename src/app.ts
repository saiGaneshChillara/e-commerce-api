import express from "express";
import { runMigrations } from "./infrastructure/database/migrate";
import { PostgresUserRepository } from "./features/users/infrastructure/user.repository.pg";
import { getPool } from "./infrastructure/database/pool";
import { JwtService } from "./shared/jwt/jwt.service";
import { AuthService } from "./features/auth/application/auth.service";
import { AuthController } from "./features/auth/auth.controller";
import { createAuthRoutes } from "./features/auth/auth.routes";
import { PostgresProductRepository } from "./features/products/infrastructure/postgres-product.respository";
import { ProductService } from "./features/products/application/product.service";
import { ProductController } from "./features/products/presentation/product.controller";
import { createProductRoutes } from "./features/products/presentation/product.routes";
import { UserService } from "./features/users/application/user.service";
import { UserController } from "./features/users/presentation/user.controller";
import { createUserRoutes } from "./features/users/presentation/user.routes";

export async function createApp() {
  const pool = getPool();
  await runMigrations(pool);

  const app = express();
  app.use(express.json());

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is required");
  }

  const expiresIn = process.env.JWT_EXPIRES_IN ?? "1d";

  // dependency wiring

  // repositories
  const userRepository = new PostgresUserRepository(pool);
  const productRepository = new PostgresProductRepository(pool);
  
  // services
  const jwtService = new JwtService(process.env.JWT_SECRET!, expiresIn);
  const authService = new AuthService(userRepository, jwtService);
  const productService = new ProductService(productRepository);
  const userService = new UserService(userRepository);

  // controllers
  const authController = new AuthController(authService);
  const productController = new ProductController(productService);
  const userController = new UserController(userService);

  app.use("/auth", createAuthRoutes(authController));
  app.use("/products", createProductRoutes(productController, jwtService));
  app.use("/users", createUserRoutes(userController, jwtService));
 

  return app;
}