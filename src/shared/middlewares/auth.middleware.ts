import { NextFunction, Request, Response } from "express";
import { JwtService } from "../jwt/jwt.service";

export function createAuthMiddleware(jwtService: JwtService) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Authorizatin header missing" });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const token = parts[1];

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    try {
      const payload = jwtService.verify(token);
      req.user = payload;
      
      next();
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
}