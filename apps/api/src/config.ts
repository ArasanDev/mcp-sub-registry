import { z } from "zod";

const environmentSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(8080)
});

const databaseSchema = z.object({
  DATABASE_URL: z.string().url()
});

const adminSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    ADMIN_API_KEY: z.string().min(1)
  })
  .refine(
    (value) =>
      value.NODE_ENV !== "production" || value.ADMIN_API_KEY.length >= 32,
    {
      message: "ADMIN_API_KEY must be at least 32 characters in production",
      path: ["ADMIN_API_KEY"]
    }
  )
  .transform((value) => ({
    ADMIN_API_KEY: value.ADMIN_API_KEY
  }));

export type Config = z.infer<typeof environmentSchema>;
export type DatabaseConfig = z.infer<typeof databaseSchema>;
export type AdminConfig = z.infer<typeof adminSchema>;

export function loadConfig(environment: NodeJS.ProcessEnv = process.env): Config {
  return environmentSchema.parse(environment);
}

export function loadDatabaseConfig(
  environment: NodeJS.ProcessEnv = process.env
): DatabaseConfig {
  return databaseSchema.parse(environment);
}

export function loadAdminConfig(
  environment: NodeJS.ProcessEnv = process.env
): AdminConfig {
  return adminSchema.parse(environment);
}
