import { NextFunction, Request, Response } from "express";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error occurred:", err.stack);
  res.status(500).json({
    status: 500,
    message: "Internal Server Error",
    error: err.message,
  });
};

export default errorHandler;
