import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();
const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT, MODE } =
  process.env;

const isDev = MODE === "development";
const entityPath = isDev ? "src/entity/**/*.ts" : __dirname + "/entity/**/*.js";
const migrationPath = isDev
  ? "src/migration/**/*.ts"
  : __dirname + "/migration/**/*.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST || "db.ifjyrvygbmccilimdojs.supabase.co",
  port: Number(DB_PORT) || 5432,
  username: DB_USER || "postgres",
  password: DB_PASSWORD || "vb2SxfcTg55)MFx",
  database: DB_DATABASE || "postgres",

  synchronize: false,
  logging: false,
  entities: [entityPath],
  migrations: [migrationPath],
});
