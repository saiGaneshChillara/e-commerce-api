import { Router } from "express";
import { JwtService } from "../../../shared/jwt/jwt.service";
import { ProductController } from "./product.controller";
import { createAuthMiddleware } from "../../../shared/middlewares/auth.middleware";
import { roleMiddleware } from "../../../shared/middlewares/role.middleware";

export function createProductRoutes(
  controller: ProductController,
  jwtService: JwtService,
) {
  const router = Router();

  const authMiddleware = createAuthMiddleware(jwtService);

  router.get("/", (req, res) => controller.list(req, res));

  router.get("/:id", (req, res) => controller.getById(req, res));

  router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    (req, res) => controller.create(req, res)
  );

  router.patch(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    (req, res) => controller.update(req, res)
  );

  return router;
}