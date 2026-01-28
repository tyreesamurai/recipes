import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { errors } from "@/lib/errors";

if (!process.env.DATABASE_URL) {
  throw errors.ENV_VAR_NOT_FOUND;
}

export const db = drizzle(process.env.DATABASE_URL);
