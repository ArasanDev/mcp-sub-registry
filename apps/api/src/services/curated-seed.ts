import { readFile } from "node:fs/promises";
import { z } from "zod";
import type { Database } from "../db/client";
import { jsonValueSchema, serverDetailSchema } from "../schemas/mcp-registry";
import { assignTagToServer, updateCuration, upsertTag } from "./curation-catalog";
import { ingestServerRecord } from "./server-ingest";
import { upsertSource } from "./source-admin";

const curatedSeedSchema = z.object({
  source: z.object({
    name: z.string().min(1),
    type: z.enum(["official", "subregistry", "manual", "other"]),
    baseUrl: z.string().url().nullable(),
    enabled: z.boolean()
  }),
  servers: z.array(
    z.object({
      server: serverDetailSchema,
      curation: z.object({
        status: z.enum(["pending", "approved", "rejected", "hidden"]).default("approved"),
        visibility: z.enum(["public", "private", "unlisted"]).default("public"),
        featured: z.boolean().optional(),
        qualityLabel: z.string().nullable().optional(),
        notes: z.string().nullable().optional(),
        meta: z.record(z.string(), jsonValueSchema).optional()
      }),
      tags: z.array(z.string().min(1)).default([])
    })
  )
});

export type CuratedSeed = z.infer<typeof curatedSeedSchema>;
export const curatedSeedDocumentSchema = curatedSeedSchema;

export interface CuratedSeedResult {
  sourceName: string;
  servers: number;
  approved: number;
  tags: number;
}

export async function loadCuratedSeed(path = "data/default-curated-servers.json") {
  return curatedSeedSchema.parse(JSON.parse(await readFile(path, "utf8")));
}

export async function applyCuratedSeed(
  db: Database,
  seed: CuratedSeed
): Promise<CuratedSeedResult> {
  await upsertSource(db, seed.source);

  let approved = 0;
  const tagSlugs = new Set<string>();

  for (const entry of seed.servers) {
    await ingestServerRecord(db, {
      sourceName: seed.source.name,
      sourceType: seed.source.type,
      sourceBaseUrl: seed.source.baseUrl,
      input: entry.server,
      upstreamStatus: "active"
    });

    await updateCuration(db, {
      serverName: entry.server.name,
      version: entry.server.version,
      ...entry.curation
    });

    if (entry.curation.status === "approved" && entry.curation.visibility === "public") {
      approved += 1;
    }

    for (const slug of entry.tags) {
      tagSlugs.add(slug);
      await upsertTag(db, {
        slug,
        name: titleize(slug)
      });
      await assignTagToServer(db, {
        serverName: entry.server.name,
        tagSlug: slug
      });
    }
  }

  return {
    sourceName: seed.source.name,
    servers: seed.servers.length,
    approved,
    tags: tagSlugs.size
  };
}

function titleize(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
