import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "../src/data-source";
import errorHandler from "../src/middleware/errorHandler";
import { userRouter } from "../src/routes/user.routes";
import { authRouter } from "../src/routes/auth.routes";
import { appointmentRouter } from "../src/routes/appointment.routes";
import cookieParser from "cookie-parser";
import { VercelRequest, VercelResponse } from "@vercel/node";

const app = express();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.use(express.static("uploads/"));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", appointmentRouter);

// Error handling
app.use(errorHandler);

// Initialize database once
let isDataSourceInitialized = false;

async function initDataSource() {
  if (!isDataSourceInitialized) {
    try {
      await AppDataSource.initialize();
      isDataSourceInitialized = true;
      console.log("Data Source has been initialized!");
    } catch (error) {
      console.error("Error initializing Data Source:", error);
    }
  }
}

// Vercel handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  await initDataSource();
  app(req, res);
}
