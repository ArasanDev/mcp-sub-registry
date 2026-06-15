import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { loadDatabaseConfig } from "../config";
import * as schema from "./schema";

export function createDatabaseConnection(
  environment: NodeJS.ProcessEnv = process.env
) {
  const config = loadDatabaseConfig(environment);
  const queryClient = postgres(config.DATABASE_URL, {
    max: 10
  });

  return {
    db: drizzle(queryClient, { schema, casing: "snake_case" }),
    queryClient
  };
}

export function createDatabaseClient(environment: NodeJS.ProcessEnv = process.env) {
  return createDatabaseConnection(environment).db;
}

export type Database = ReturnType<typeof createDatabaseClient>;
