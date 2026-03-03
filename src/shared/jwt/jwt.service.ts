import jwt, { SignOptions } from "jsonwebtoken";

export interface JwtPayload {
  id: string;
  role: string;
}

export class JwtService {
  private readonly secret: string;
  private readonly expiresIn: SignOptions["expiresIn"];

  constructor() {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not found in .env");
    }

    this.secret = process.env.JWT_SECRET;
    this.expiresIn = process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"] || "1d";
  }

  sign(payload: JwtPayload): string {
    const options: SignOptions = {
      expiresIn: this.expiresIn,
    };

    return jwt.sign(payload, this.secret, options);
  }

  verify(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.secret) as JwtPayload;
    } catch (error) {
      throw new Error("Invalid or exired token");
    }
  }
}