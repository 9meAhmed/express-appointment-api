import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import errorHandler from "./middleware/errorHandler";
// import { userRouter } from "./routes/user.routes";
// import { authRouter } from "./routes/auth.routes";
// import { appointmentRouter } from "./routes/appointment.routes";
import cookieParser from "cookie-parser";
import { VercelRequest, VercelResponse } from "@vercel/node";

const app = express();

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

// app.use("/api", authRouter);
// app.use("/api", userRouter);
// app.use("/api", appointmentRouter);

app.use(errorHandler);

let isDataSourceInitialized = false;
let areRoutesMounted = false;

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await initDataSource();

  if (!areRoutesMounted) {
    const { authRouter } = await import("./routes/auth.routes");
    const { userRouter } = await import("./routes/user.routes");
    const { appointmentRouter } = await import("./routes/appointment.routes");

    app.use("/api", authRouter);
    app.use("/api", userRouter);
    app.use("/api", appointmentRouter);

    areRoutesMounted = true;
  }
  app(req, res);
}
