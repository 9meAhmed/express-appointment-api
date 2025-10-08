import { Request, Response } from "express";
import { userRepository } from "../repository";
export class UserController {
  static async getAllUsers(req: Request, res: Response) {
    const users = await userRepository.findAll();
    res.json(users);
  }

  static async createUser(req: Request, res: Response) {
    const user = await userRepository.createUser(req.body);
    res.status(201).json(user);
  }

  static async updateUser(req: Request, res: Response) {
    const userId = Number(req.params.id);
    const user = await userRepository.updateUser(userId, req.body);
    res.status(200).json(user);
  }

  static async deleteUser(req: Request, res: Response) {
    const userId = Number(req.params.id);
    const isDeleted = await userRepository.delete(userId);
    if (!isDeleted) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json(null);
    }
  }
}
