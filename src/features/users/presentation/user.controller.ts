import { Request, Response } from "express";
import { UserService } from "../application/user.service";

export class UserController {
  constructor(private userService: UserService) {}

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user!.id;

      const user = await this.userService.updateProfile(userId, req.body);

      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const userId = req.user!.id;

      const { currentPassword, newPassword } = req.body;

      await this.userService.changePassword(userId, currentPassword, newPassword);

      res.json({ message: "Password updated succesfully" });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  async getMyProfile(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const user = await this.userService.getUser(userId);
      res.json(user);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}