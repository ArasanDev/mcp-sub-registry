import { eq } from "drizzle-orm";
import { z } from "zod";
import type { Database } from "../db/client";
import { registrySources, syncRuns } from "../db/schema";
import { fetchServerPage, officialRegistryBaseUrl } from "./registry-client";
import { ingestServerRecord } from "./server-ingest";

export const syncRequestSchema = z.object({
  mode: z.enum(["full_etl", "incremental", "latest_only"]).default("full_etl"),
  sourceName: z.string().min(1).default("official"),
  baseUrl: z.string().url().default(officialRegistryBaseUrl),
  updatedSince: z.string().datetime().optional(),
  limit: z.number().int().positive().max(100).default(100),
  maxPages: z.number().int().positive().max(1000).default(100)
});

export type SyncRequest = z.infer<typeof syncRequestSchema>;

export interface RunSyncOptions extends SyncRequest {
  fetchFn?: typeof fetch;
}

export interface SyncResult {
  mode: "full_etl" | "incremental" | "latest_only";
  sourceName: string;
  serversSeen: number;
  versionsSeen: number;
  cursor: string | null;
}

export async function runSync(
  db: Database,
  options: RunSyncOptions
): Promise<SyncResult> {
  const [source] = await db
    .insert(registrySources)
    .values({
      name: options.sourceName,
      type: options.sourceName === "official" ? "official" : "subregistry",
      baseUrl: options.baseUrl
    })
    .onConflictDoUpdate({
      target: registrySources.name,
      set: {
        baseUrl: options.baseUrl,
        enabled: true,
        updatedAt: new Date()
      }
    })
    .returning();

  const [syncRun] = await db
    .insert(syncRuns)
    .values({
      sourceId: source.id,
      mode: options.mode,
      status: "running",
      updatedSince: options.updatedSince ? new Date(options.updatedSince) : null
    })
    .returning();

  let cursor: string | null = null;
  let serversSeen = 0;

  try {
    for (let page = 0; page < options.maxPages; page += 1) {
      const upstreamPage = await fetchServerPage({
        baseUrl: options.baseUrl,
        cursor,
        limit: options.limit,
        updatedSince: options.mode === "incremental" ? options.updatedSince : null,
        includeDeleted: options.mode === "incremental",
        latestOnly: options.mode === "latest_only",
        fetchFn: options.fetchFn
      });

      for (const serverRecord of upstreamPage.servers) {
        await ingestServerRecord(db, {
          sourceName: options.sourceName,
          sourceType: options.sourceName === "official" ? "official" : "subregistry",
          sourceBaseUrl: options.baseUrl,
          input: serverRecord,
          upstreamStatus: upstreamStatus(serverRecord)
        });
      }

      serversSeen += upstreamPage.servers.length;
      cursor = upstreamPage.nextCursor;

      if (!cursor) {
        break;
      }
    }

    await db
      .update(syncRuns)
      .set({
        status: "succeeded",
        finishedAt: new Date(),
        cursor,
        serversSeen,
        versionsSeen: serversSeen
      })
      .where(eq(syncRuns.id, syncRun.id));

    await db
      .update(registrySources)
      .set({
        lastSyncedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(registrySources.id, source.id));

    return {
      mode: options.mode,
      sourceName: options.sourceName,
      serversSeen,
      versionsSeen: serversSeen,
      cursor
    };
  } catch (error) {
    await db
      .update(syncRuns)
      .set({
        status: "failed",
        finishedAt: new Date(),
        cursor,
        serversSeen,
        versionsSeen: serversSeen,
        error: error instanceof Error ? error.message : String(error)
      })
      .where(eq(syncRuns.id, syncRun.id));

    throw error;
  }
}

function upstreamStatus(input: unknown): "active" | "deprecated" | "deleted" {
  if (!isObject(input)) {
    return "active";
  }

  const server = isObject(input.server) ? input.server : input;
  const explicitStatus = stringValue(server.status) ?? stringValue(input.status);

  if (explicitStatus === "deleted" || explicitStatus === "deprecated") {
    return explicitStatus;
  }

  const meta = isObject(input._meta) ? input._meta : {};

  for (const value of Object.values(meta)) {
    if (!isObject(value)) {
      continue;
    }

    const status = stringValue(value.status);

    if (status === "deleted" || status === "deprecated") {
      return status;
    }
  }

  return "active";
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value : null;
}
