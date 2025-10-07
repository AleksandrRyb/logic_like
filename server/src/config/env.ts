import dotenv from "dotenv";
import { DEFAULT_LOG_LEVEL } from "./constants";

dotenv.config();

export const env = {
	port: Number(process.env.PORT),
	nodeEnv: process.env.NODE_ENV,
	databaseUrl: process.env.DATABASE_URL,
	logLevel: process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL,
};
