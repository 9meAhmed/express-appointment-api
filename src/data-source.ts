import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "./entity/User";
import { Patient } from "./entity/Patient";
import { Doctor } from "./entity/Doctor";
import { Appointment } from "./entity/Appointment";

dotenv.config();
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, MODE } = process.env;
const isDev = MODE === "development";
export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST || "aws-1-ap-southeast-2.pooler.supabase.com",
  port: Number(DB_PORT) || 5432,
  username: DB_USER || "postgres.ifjyrvygbmccilimdojs",
  password: DB_PASSWORD || "vb2SxfcTg55)MFx",
  database: DB_NAME || "postgres",
  synchronize: false,
  logging: false,
  entities: [User, Patient, Doctor, Appointment],
  migrations: isDev
    ? [__dirname + "/migration/*.js"]
    : [__dirname + "/migration/*.ts"],
});
