import { eq } from "drizzle-orm";
import { z } from "zod";
import type { Database } from "../db/client";
import {
  curations,
  registrySources,
  serverTags,
  serverTools,
  serverVersions,
  servers,
  tags
} from "../db/schema";
import { jsonValueSchema } from "../schemas/mcp-registry";
import { assignTagToServer, updateCuration, upsertTag } from "./curation-catalog";
import { ingestServerRecord } from "./server-ingest";
import { upsertSource } from "./source-admin";
import { upsertManualTool } from "./tools";

const backupSourceSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["official", "subregistry", "manual", "other"]),
  baseUrl: z.string().url().nullable(),
  enabled: z.boolean()
});

const backupServerVersionSchema = z.object({
  sourceName: z.string().min(1),
  sourceType: z.enum(["official", "subregistry", "manual", "other"]),
  sourceBaseUrl: z.string().url().nullable(),
  rawJson: z.unknown(),
  upstreamStatus: z.enum(["active", "deprecated", "deleted"]).nullable()
});

const backupCurationSchema = z.object({
  serverName: z.string().min(1),
  version: z.string().min(1).nullable(),
  status: z.enum(["pending", "approved", "rejected", "hidden"]),
  visibility: z.enum(["public", "private", "unlisted"]),
  featured: z.boolean(),
  qualityLabel: z.string().nullable(),
  notes: z.string().nullable(),
  meta: z.record(z.string(), jsonValueSchema)
});

const backupTagSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1)
});

const backupServerTagSchema = z.object({
  serverName: z.string().min(1),
  tagSlug: z.string().min(1)
});

const backupToolSchema = z.object({
  serverName: z.string().min(1),
  version: z.string().min(1),
  name: z.string().min(1),
  description: z.string().nullable(),
  inputSchema: jsonValueSchema.optional(),
  outputSchema: jsonValueSchema.optional()
});

export const backupDocumentSchema = z.object({
  format: z.literal("mcp-sub-registry-backup"),
  version: z.literal(1),
  exportedAt: z.string(),
  sources: z.array(backupSourceSchema).default([]),
  serverVersions: z.array(backupServerVersionSchema).default([]),
  curations: z.array(backupCurationSchema).default([]),
  tags: z.array(backupTagSchema).default([]),
  serverTags: z.array(backupServerTagSchema).default([]),
  tools: z.array(backupToolSchema).default([])
});

export type BackupDocument = z.infer<typeof backupDocumentSchema>;

export async function exportBackup(db: Database): Promise<BackupDocument> {
  const sourceRows = await db.select().from(registrySources);
  const versionRows = await db
    .select({
      serverName: servers.name,
      version: serverVersions.version,
      sourceName: registrySources.name,
      sourceType: registrySources.type,
      sourceBaseUrl: registrySources.baseUrl,
      rawJson: serverVersions.rawJson,
      upstreamStatus: serverVersions.upstreamStatus
    })
    .from(serverVersions)
    .innerJoin(servers, eq(servers.id, serverVersions.serverId))
    .innerJoin(registrySources, eq(registrySources.id, serverVersions.sourceId));
  const curationRows = await db
    .select({
      serverName: servers.name,
      version: serverVersions.version,
      status: curations.status,
      visibility: curations.visibility,
      featured: curations.featured,
      qualityLabel: curations.qualityLabel,
      notes: curations.notes,
      meta: curations.meta
    })
    .from(curations)
    .innerJoin(servers, eq(servers.id, curations.serverId))
    .leftJoin(serverVersions, eq(serverVersions.id, curations.serverVersionId));
  const tagRows = await db.select().from(tags);
  const serverTagRows = await db
    .select({
      serverName: servers.name,
      tagSlug: tags.slug
    })
    .from(serverTags)
    .innerJoin(servers, eq(servers.id, serverTags.serverId))
    .innerJoin(tags, eq(tags.id, serverTags.tagId));
  const toolRows = await db
    .select({
      serverName: servers.name,
      version: serverVersions.version,
      name: serverTools.name,
      description: serverTools.description,
      inputSchema: serverTools.inputSchema,
      outputSchema: serverTools.outputSchema
    })
    .from(serverTools)
    .innerJoin(serverVersions, eq(serverVersions.id, serverTools.serverVersionId))
    .innerJoin(servers, eq(servers.id, serverVersions.serverId));

  return backupDocumentSchema.parse({
    format: "mcp-sub-registry-backup",
    version: 1,
    exportedAt: new Date().toISOString(),
    sources: sourceRows.map((source) => ({
      name: source.name,
      type: source.type,
      baseUrl: source.baseUrl,
      enabled: source.enabled
    })),
    serverVersions: versionRows.map((row) => ({
      sourceName: row.sourceName,
      sourceType: row.sourceType,
      sourceBaseUrl: row.sourceBaseUrl,
      rawJson: row.rawJson,
      upstreamStatus: row.upstreamStatus ?? "active"
    })),
    curations: curationRows.map((row) => ({
      serverName: row.serverName,
      version: row.version ?? null,
      status: row.status,
      visibility: row.visibility,
      featured: row.featured,
      qualityLabel: row.qualityLabel,
      notes: row.notes,
      meta: row.meta
    })),
    tags: tagRows.map((tag) => ({
      slug: tag.slug,
      name: tag.name
    })),
    serverTags: serverTagRows,
    tools: toolRows.map((tool) => ({
      serverName: tool.serverName,
      version: tool.version,
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema ?? undefined,
      outputSchema: tool.outputSchema ?? undefined
    }))
  });
}

export async function importBackup(db: Database, input: unknown) {
  const backup = backupDocumentSchema.parse(input);
  let sourcesImported = 0;
  let serverVersionsImported = 0;
  let curationsImported = 0;
  let tagsImported = 0;
  let serverTagsImported = 0;
  let toolsImported = 0;

  for (const source of backup.sources) {
    await upsertSource(db, source);
    sourcesImported += 1;
  }

  for (const row of backup.serverVersions) {
    await ingestServerRecord(db, {
      sourceName: row.sourceName,
      sourceType: row.sourceType,
      sourceBaseUrl: row.sourceBaseUrl,
      input: row.rawJson,
      upstreamStatus: row.upstreamStatus ?? "active"
    });
    serverVersionsImported += 1;
  }

  for (const tag of backup.tags) {
    await upsertTag(db, tag);
    tagsImported += 1;
  }

  for (const curation of backup.curations) {
    await updateCuration(db, {
      serverName: curation.serverName,
      version: curation.version ?? undefined,
      status: curation.status,
      visibility: curation.visibility,
      featured: curation.featured,
      qualityLabel: curation.qualityLabel,
      notes: curation.notes,
      meta: curation.meta
    });
    curationsImported += 1;
  }

  for (const serverTag of backup.serverTags) {
    if (await assignTagToServer(db, serverTag)) {
      serverTagsImported += 1;
    }
  }

  for (const tool of backup.tools) {
    if (
      await upsertManualTool(db, tool.serverName, tool.version, tool.name, {
        description: tool.description,
        inputSchema: tool.inputSchema,
        outputSchema: tool.outputSchema
      })
    ) {
      toolsImported += 1;
    }
  }

  return {
    imported: {
      sources: sourcesImported,
      serverVersions: serverVersionsImported,
      curations: curationsImported,
      tags: tagsImported,
      serverTags: serverTagsImported,
      tools: toolsImported
    }
  };
}
