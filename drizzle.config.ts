import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { errors } from "@/lib/errors";
import { logger } from "@/lib/logger";

if (!process.env.DATABASE_URL) {
  logger.fatal("database env variable not found");
  throw errors.ENV_VAR_NOT_FOUND;
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
