import bcrypt from "bcrypt";
import { UserRepository } from "../../users/domain/user.repository";
import { JwtService } from "../../../shared/jwt/jwt.service";

// Input DTOs
export interface RegisterInput {
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// Output DTOs
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: string;
  };
  token: string;
}

export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  private SALT_ROUNDS = 10;

  async register(data: RegisterInput): Promise<AuthResponse> {
    const { email, password } = data;

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const passwordHash = await bcrypt.hash(password, this.SALT_ROUNDS);

    const user = await this.userRepository.create({
      email,
      passwordHash,
      role: "user",
    });

    const safeUser = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    let token = this.jwtService.sign({
      id: safeUser.id,
      role: safeUser.role,
    });

    return {
      user: safeUser,
      token,
    };

  }

  async login(data: LoginInput): Promise<AuthResponse> {
    const { email, password } = data;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    let token = this.jwtService.sign({
      id: safeUser.id,
      role: safeUser.role,
    });

    return {
      user: safeUser,
      token,
    }
  }
}