import { Request, Response } from "express";
import { userRepository } from "../repository";
import Encrypt from "../helpers/encrypt.helper";
import { UserResponseDto } from "../dto/response/user.dto";

export class AuthController {
  static async registerUser(req: Request, res: Response) {
    const user = await userRepository.createUser(req.body);
    res.status(201).json(user);
  }

  static async loginUser(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await userRepository.findByEmail(email);

    if (!user || !(await Encrypt.comparePassword(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = await Encrypt.generateToken({ id: user.id });
    const refreshToken = await Encrypt.generateRefreshToken({ id: user.id });
    res
      .status(200)
      .json({ user: new UserResponseDto(user), token, refreshToken });
  }

  static async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    try {
      const payload = await Encrypt.verifyToken(refreshToken);
      const newToken = await Encrypt.generateToken({ id: payload.id });
      const newRefreshToken = await Encrypt.generateRefreshToken({
        id: payload.id,
      });
      res.status(200).json({ token: newToken, refreshToken: newRefreshToken });
    } catch (error) {
      res.status(401).json({ message: "Invalid refresh token" });
    }
  }
}
