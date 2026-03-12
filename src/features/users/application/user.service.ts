import bcrypt from "bcrypt";
import { UpdateProfileInput, UserRepository } from "../domain/user.repository";
import { User, UserWithPassword } from "../domain/user.entity";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async updateProfile(userId: string, data: UpdateProfileInput): Promise<User> {
    if (data.phoneNumber) {
      if (!data.phoneNumber.startsWith("+")) {
        throw new Error("Phone number must be in international format");
      }
    }

    return this.userRepository.updateProfile(userId, data);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const dbUser = await this.userRepository.findByEmail(user.email);

    if (!dbUser) {
      throw new Error("User not found");
    }

    const valid = await bcrypt.compare(currentPassword, dbUser.passwordHash);

    if (!valid) {
      throw new Error("Current password is incorrect");
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    await this.userRepository.updatePassword(userId, newHash);
  }

  async getUser(userId: string): Promise<User | null> {
    const user = await this.userRepository.findById(userId);

    return user;
  }
}