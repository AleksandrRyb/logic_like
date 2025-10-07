import { defineConfig } from "drizzle-kit";
import * as path from "node:path";

export default defineConfig({
  schema: path.resolve(__dirname, "./src/db/schema.ts"),
  out: path.resolve(__dirname, "./drizzle"),
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/logic_like",
  },
  verbose: true,
});


