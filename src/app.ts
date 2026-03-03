import express from "express";
import { runMigrations } from "./infrastructure/database/migrate";
import { PostgresUserRepository } from "./features/users/infrastructure/user.repository.pg";
import { pool } from "./infrastructure/database/pool";
import { JwtService } from "./shared/jwt/jwt.service";
import { AuthService } from "./features/auth/application/auth.service";
import { AuthController } from "./features/auth/auth.controller";
import { createAuthRoutes } from "./features/auth/auth.routes";

export async function createApp() {
  await runMigrations(pool);

  const app = express();
  app.use(express.json());

  // dependency wiring
  const userRepository = new PostgresUserRepository(pool);
  const jwtService = new JwtService();
  const authService = new AuthService(userRepository, jwtService);
  const authController = new AuthController(authService);

  app.use("/auth", createAuthRoutes(authController));

  return app;
}