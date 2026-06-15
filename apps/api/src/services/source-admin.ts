import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import type { Database } from "../db/client";
import { registrySources, syncRuns } from "../db/schema";

const sourceTypeSchema = z.enum(["official", "subregistry", "manual", "other"]);

const sourceFieldsSchema = z.object({
  name: z.string().min(1),
  type: sourceTypeSchema,
  baseUrl: z.string().url().nullable().optional(),
  enabled: z.boolean()
});

export const sourceInputSchema = sourceFieldsSchema.extend({
  type: sourceTypeSchema.default("subregistry"),
  enabled: z.boolean().default(true)
});

export type SourceInput = z.infer<typeof sourceInputSchema>;

export const sourceUpdateSchema = sourceFieldsSchema
  .partial()
  .refine((input) => Object.keys(input).length > 0, {
    message: "At least one source field must be provided"
  });

export type SourceUpdate = z.infer<typeof sourceUpdateSchema>;

function summarizeSyncRun(run: typeof syncRuns.$inferSelect) {
  return {
    id: run.id,
    mode: run.mode,
    status: run.status,
    startedAt: run.startedAt.toISOString(),
    finishedAt: run.finishedAt?.toISOString() ?? null,
    cursor: run.cursor,
    serversSeen: run.serversSeen,
    versionsSeen: run.versionsSeen,
    error: run.error
  };
}

export async function upsertSource(db: Database, input: SourceInput) {
  const [source] = await db
    .insert(registrySources)
    .values({
      name: input.name,
      type: input.type,
      baseUrl: input.baseUrl ?? null,
      enabled: input.enabled
    })
    .onConflictDoUpdate({
      target: registrySources.name,
      set: {
        type: input.type,
        baseUrl: input.baseUrl ?? null,
        enabled: input.enabled,
        updatedAt: new Date()
      }
    })
    .returning();

  return source;
}

export async function listSources(db: Database) {
  const sources = await db.select().from(registrySources).orderBy(registrySources.name);
  const runs = await db
    .select()
    .from(syncRuns)
    .orderBy(desc(syncRuns.startedAt), desc(syncRuns.id));

  return sources.map((source) => ({
    id: source.id,
    name: source.name,
    type: source.type,
    baseUrl: source.baseUrl,
    enabled: source.enabled,
    lastSyncedAt: source.lastSyncedAt?.toISOString() ?? null,
    createdAt: source.createdAt.toISOString(),
    updatedAt: source.updatedAt.toISOString(),
    lastSyncRun:
      runs.filter((run) => run.sourceId === source.id).map(summarizeSyncRun)[0] ??
      null,
    recentSyncRuns: runs
      .filter((run) => run.sourceId === source.id)
      .slice(0, 5)
      .map(summarizeSyncRun)
  }));
}

export async function getSource(db: Database, sourceId: number) {
  return db.query.registrySources.findFirst({
    where: eq(registrySources.id, sourceId)
  });
}

export async function updateSource(
  db: Database,
  sourceId: number,
  input: SourceUpdate
) {
  const [source] = await db
    .update(registrySources)
    .set({
      ...input,
      baseUrl: input.baseUrl === undefined ? undefined : input.baseUrl,
      updatedAt: new Date()
    })
    .where(eq(registrySources.id, sourceId))
    .returning();

  return source ?? null;
}
