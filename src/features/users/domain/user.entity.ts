export type UserRole = "user" | "admin";

export interface User {
  id: string;
  email: string;

  name?: string;
  phoneNumber?: string;

  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithPassword extends User {
  passwordHash: string;
}