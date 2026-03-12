import { Router } from "express";
import { JwtService } from "../../../shared/jwt/jwt.service";
import { AddressController } from "../presentation/address.controller";
import { createAuthMiddleware } from "../../../shared/middlewares/auth.middleware";

export function createAddressRoutes(controller: AddressController, jwtService: JwtService) {
  const router = Router();
  const authMiddleware = createAuthMiddleware(jwtService);

  router.post("/", authMiddleware, (req, res) => controller.create(req, res));
  router.get("/", authMiddleware, (req, res) => controller.list(req, res));
  router.patch("/:id", authMiddleware, (req, res) => controller.update(req, res));
  router.delete("/:id", authMiddleware, (req, res) => controller.delete(req, res));

  return router;
}