import { Router } from "express";
import { JwtService } from "../../../shared/jwt/jwt.service";
import { createAuthMiddleware } from "../../../shared/middlewares/auth.middleware";
import { UserController } from "./user.controller";

export function createUserRoutes(controller: UserController, jwtService: JwtService) {
  const router = Router();
  const authMiddleware = createAuthMiddleware(jwtService);

  router.get("/me", authMiddleware, (req, res) => controller.getMyProfile(req, res));
  
  router.patch("/me", authMiddleware, (req, res) => controller.updateProfile(req, res));
  router.patch("/change-password", authMiddleware, (req, res) => controller.changePassword(req, res));

  return router;
}