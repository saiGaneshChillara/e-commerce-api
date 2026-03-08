import { NextFunction, Request, Response } from "express";

export function roleMiddleware(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.role !== role) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next(); 
  };
}