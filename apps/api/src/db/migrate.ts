import "dotenv/config";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { loadDatabaseConfig } from "../config";

const config = loadDatabaseConfig();
const queryClient = postgres(config.DATABASE_URL, { max: 1 });
const db = drizzle(queryClient, { casing: "snake_case" });

async function waitForDatabase(maxAttempts = 20) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await queryClient`select 1`;
      return;
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
}

try {
  await waitForDatabase();
  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("Database migrations applied");
} finally {
  await queryClient.end();
}
