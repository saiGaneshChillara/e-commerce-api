import { Router } from "express";
import { AuthController } from "./auth.controller";

export function createAuthRoutes(authController: AuthController) {
  const router = Router();

  router.post("/register", (req, res) => authController.register(req, res));
  router.post("/login", (req, res) => authController.login(req, res));

  return router;
}