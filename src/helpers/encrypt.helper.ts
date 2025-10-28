import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
dotenv.config();
const { JWT_SECRET = "", SALT_ROUNDS } = process.env;

export default class Encrypt {
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(Number(SALT_ROUNDS));
    return bcrypt.hashSync(password, salt);
  }

  static async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compareSync(password, hashedPassword);
  }

  static async generateToken(payload: any): Promise<string> {
    return await jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  }

  static async generateRefreshToken(payload: any): Promise<string> {
    return await jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      console.error("Token verification failed:", error);
      return null;
    }
  }
}
