import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "./env";

export const pool = new Pool({ connectionString: env.databaseUrl });
export const db = drizzle(pool);


