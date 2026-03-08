import jwt, { SignOptions } from "jsonwebtoken";

export interface JwtPayload {
  id: string;
  role: string;
}

export class JwtService {
  private readonly secret: string;
  private readonly signOptions: SignOptions;

  constructor(secret: string, expiresIn: string | number = "7d") {

    if (!secret) {
      throw new Error("JWT secret is required");
    }

    this.secret = secret;
    this.signOptions = {
      expiresIn: expiresIn as SignOptions["expiresIn"],
    };
  }

  sign(payload: JwtPayload): string {
    return jwt.sign(payload, this.secret, this.signOptions);
  }

  verify(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.secret) as JwtPayload;
    } catch (error) {
      throw new Error("Invalid or exired token");
    }
  }
}