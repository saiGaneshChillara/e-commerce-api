import { User } from "./user.entity";

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  role?: "user" | "admin";
}

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(data: CreateUserInput): Promise<User>;
}