import { NextFunction, Request, Response } from "express";
import Encrypt from "../helpers/encrypt.helper";

export const authentification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const decode = Encrypt.verifyToken(token);
  if (!decode) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.headers["user"] = decode;
  next();
};
