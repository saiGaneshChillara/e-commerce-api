import { User, UserWithPassword } from "./user.entity";

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  role?: "user" | "admin";
}

export interface UpdateProfileInput {
  name?: string;
  phoneNumber?: string;
}

export interface UserRepository {
  findByEmail(email: string): Promise<UserWithPassword | null>;
  findById(id: string): Promise<User | null>;

  create(data: CreateUserInput): Promise<UserWithPassword>;

  updateProfile(userId: string, data: UpdateProfileInput): Promise<User>;

  updatePassword(userId: string, passwordHash: string): Promise<void>;
}