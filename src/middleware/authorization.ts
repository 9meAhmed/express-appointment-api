import { NextFunction, Request, Response } from "express";
import { userRepository } from "../repository";

export const authorization = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.headers["user"] as any;
    const userData = await userRepository.findById(user.id);

    if (userData && !roles.includes(userData.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
