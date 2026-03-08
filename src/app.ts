import express from "express";
import { runMigrations } from "./infrastructure/database/migrate";
import { PostgresUserRepository } from "./features/users/infrastructure/user.repository.pg";
import { pool } from "./infrastructure/database/pool";
import { JwtService } from "./shared/jwt/jwt.service";
import { AuthService } from "./features/auth/application/auth.service";
import { AuthController } from "./features/auth/auth.controller";
import { createAuthRoutes } from "./features/auth/auth.routes";
import { SignOptions } from "jsonwebtoken";
import { createAuthMiddleware } from "./shared/middlewares/auth.middleware";

export async function createApp() {
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
  
  // services
  const jwtService = new JwtService(process.env.JWT_SECRET!, expiresIn);
  const authService = new AuthService(userRepository, jwtService);

  // controllers
  const authController = new AuthController(authService);

  // middlewares
  const authMiddleware = createAuthMiddleware(jwtService);

  app.use("/auth", createAuthRoutes(authController));
  app.get("/protected", authMiddleware, (req, res) => {
    res.json({
      message: "You are authenticated",
      user: req.user,
    });
  });

  return app;
}