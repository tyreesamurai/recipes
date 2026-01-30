import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { errors } from "@/lib/errors";
import { logger } from "@/lib/logger";

if (!process.env.DATABASE_URL) {
  logger.fatal("database env variable not found");
  throw errors.ENV_VAR_NOT_FOUND;
}

export const db = drizzle(process.env.DATABASE_URL);
