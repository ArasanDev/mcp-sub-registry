import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import type { Database } from "../db/client";
import {
  curations,
  registrySources,
  serverTags,
  serverVersions,
  servers,
  tags
} from "../db/schema";
import {
  metaSchema,
  serverListSchema,
  serverResponseSchema,
  type JsonValue,
  type ServerList,
  type ServerResponse
} from "../schemas/mcp-registry";
import { withGatewayCompatibility } from "./gateway-compatibility";
import { withReadiness } from "./readiness";
import { metaKeys } from "../../../../packages/shared/src";

export const curationMetaKey = metaKeys.curation;

export const curationUpdateSchema = z.object({
  serverName: z.string().min(1),
  version: z.string().min(1).optional(),
  status: z.enum(["pending", "approved", "rejected", "hidden"]).optional(),
  visibility: z.enum(["public", "private", "unlisted"]).optional(),
  featured: z.boolean().optional(),
  qualityLabel: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  meta: metaSchema.optional()
});

export const tagInputSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1)
});

export const serverTagInputSchema = z.object({
  serverName: z.string().min(1),
  tagSlug: z.string().min(1)
});

export type CurationUpdateInput = z.infer<typeof curationUpdateSchema>;
export type TagInput = z.infer<typeof tagInputSchema>;
export type ServerTagInput = z.infer<typeof serverTagInputSchema>;

interface CurationTarget {
  serverId: number;
  serverVersionId: number;
}

async function findCurationTarget(
  db: Database,
  serverName: string,
  version?: string
): Promise<CurationTarget | null> {
  const whereClause = version
    ? and(
        eq(servers.name, serverName),
        eq(servers.status, "indexed"),
        eq(serverVersions.status, "indexed"),
        eq(serverVersions.version, version)
      )
    : and(
        eq(servers.name, serverName),
        eq(servers.status, "indexed"),
        eq(serverVersions.status, "indexed")
      );

  const [row] = await db
    .select({
      serverId: servers.id,
      serverVersionId: serverVersions.id
    })
    .from(serverVersions)
    .innerJoin(servers, eq(servers.id, serverVersions.serverId))
    .where(whereClause)
    .orderBy(desc(serverVersions.updatedAt), desc(serverVersions.id))
    .limit(1);

  return row ?? null;
}

export async function updateCuration(
  db: Database,
  input: CurationUpdateInput
): Promise<Record<string, JsonValue> | null> {
  const target = await findCurationTarget(db, input.serverName, input.version);

  if (!target) {
    return null;
  }

  const existing = await db.query.curations.findFirst({
    where: and(
      eq(curations.serverId, target.serverId),
      eq(curations.serverVersionId, target.serverVersionId)
    )
  });

  const values = {
    status: input.status ?? existing?.status ?? "pending",
    visibility: input.visibility ?? existing?.visibility ?? "private",
    featured: input.featured ?? existing?.featured ?? false,
    qualityLabel:
      input.qualityLabel !== undefined ? input.qualityLabel : existing?.qualityLabel ?? null,
    notes: input.notes !== undefined ? input.notes : existing?.notes ?? null,
    meta: input.meta ?? (existing?.meta as Record<string, JsonValue> | undefined) ?? {},
    updatedAt: new Date()
  };

  const [stored] = existing
    ? await db
        .update(curations)
        .set(values)
        .where(eq(curations.id, existing.id))
        .returning()
    : await db
        .insert(curations)
        .values({
          serverId: target.serverId,
          serverVersionId: target.serverVersionId,
          ...values
        })
        .returning();

  return curationPayload({
    status: stored.status,
    visibility: stored.visibility,
    featured: stored.featured,
    qualityLabel: stored.qualityLabel,
    notes: stored.notes,
    tags: [],
    meta: stored.meta as Record<string, JsonValue>,
    curatedAt: stored.updatedAt.toISOString()
  });
}

export async function upsertTag(db: Database, input: TagInput) {
  const [stored] = await db
    .insert(tags)
    .values({
      slug: input.slug,
      name: input.name
    })
    .onConflictDoUpdate({
      target: tags.slug,
      set: {
        name: input.name,
        updatedAt: new Date()
      }
    })
    .returning();

  return stored;
}

export async function listTags(db: Database) {
  const rows = await db.select().from(tags).orderBy(tags.slug);

  return rows.map((tag) => ({
    id: tag.id,
    slug: tag.slug,
    name: tag.name,
    createdAt: tag.createdAt.toISOString(),
    updatedAt: tag.updatedAt.toISOString()
  }));
}

export async function assignTagToServer(
  db: Database,
  input: ServerTagInput
): Promise<boolean> {
  const storedServer = await db.query.servers.findFirst({
    where: eq(servers.name, input.serverName)
  });

  const storedTag = await db.query.tags.findFirst({
    where: eq(tags.slug, input.tagSlug)
  });

  if (!storedServer || !storedTag) {
    return false;
  }

  await db
    .insert(serverTags)
    .values({
      serverId: storedServer.id,
      tagId: storedTag.id
    })
    .onConflictDoNothing();

  return true;
}

interface CatalogOptions {
  tag?: string | null;
  featured?: boolean | null;
}

interface CatalogCurationRow {
  serverId: number;
  serverVersionId: number;
  sourceName: string;
  sourceBaseUrl: string | null;
  normalizedJson: unknown;
  versionStatus: "indexed" | "removed_upstream" | "invalid";
  upstreamStatus: "active" | "deprecated" | "deleted" | null;
  publishedAt: Date | null;
  upstreamUpdatedAt: Date | null;
  status: "pending" | "approved" | "rejected" | "hidden";
  visibility: "public" | "private" | "unlisted";
  featured: boolean;
  qualityLabel: string | null;
  notes: string | null;
  meta: unknown;
  updatedAt: Date;
}

export async function getCatalog(
  db: Database,
  options: CatalogOptions = {}
): Promise<ServerList> {
  const rows = await db
    .select({
      serverId: servers.id,
      serverVersionId: serverVersions.id,
      sourceName: registrySources.name,
      sourceBaseUrl: registrySources.baseUrl,
      normalizedJson: serverVersions.normalizedJson,
      versionStatus: serverVersions.status,
      upstreamStatus: serverVersions.upstreamStatus,
      publishedAt: serverVersions.publishedAt,
      upstreamUpdatedAt: serverVersions.upstreamUpdatedAt,
      status: curations.status,
      visibility: curations.visibility,
      featured: curations.featured,
      qualityLabel: curations.qualityLabel,
      notes: curations.notes,
      meta: curations.meta,
      updatedAt: curations.updatedAt
    })
    .from(curations)
    .innerJoin(serverVersions, eq(serverVersions.id, curations.serverVersionId))
    .innerJoin(servers, eq(servers.id, curations.serverId))
    .innerJoin(registrySources, eq(registrySources.id, serverVersions.sourceId))
    .where(
      and(
        eq(servers.status, "indexed"),
        eq(serverVersions.status, "indexed"),
        eq(curations.status, "approved"),
        eq(curations.visibility, "public")
      )
    )
    .orderBy(desc(curations.featured), desc(curations.updatedAt));

  const filteredRows = options.featured === true
    ? rows.filter((row) => row.featured)
    : rows;
  const catalogServers: ServerResponse[] = [];

  for (const row of filteredRows) {
    const tagRows = await tagsForServer(db, row.serverId);
    const tagSlugs = tagRows.map((tag) => tag.slug);

    if (options.tag && !tagSlugs.includes(options.tag)) {
      continue;
    }

    catalogServers.push(
      injectCuration(row, tagSlugs, await isLatestVersion(db, row.serverId, row.serverVersionId))
    );
  }

  return serverListSchema.parse({
    servers: catalogServers,
    metadata: {
      count: catalogServers.length,
      nextCursor: null
    }
  });
}

async function tagsForServer(db: Database, serverId: number) {
  return db
    .select({
      slug: tags.slug,
      name: tags.name
    })
    .from(serverTags)
    .innerJoin(tags, eq(tags.id, serverTags.tagId))
    .where(eq(serverTags.serverId, serverId));
}

async function isLatestVersion(
  db: Database,
  serverId: number,
  serverVersionId: number
) {
  const [latest] = await db
    .select({
      id: serverVersions.id
    })
    .from(serverVersions)
    .where(eq(serverVersions.serverId, serverId))
    .orderBy(desc(serverVersions.updatedAt), desc(serverVersions.id))
    .limit(1);

  return latest?.id === serverVersionId;
}

function injectCuration(
  row: CatalogCurationRow,
  tagSlugs: string[],
  isLatest: boolean
): ServerResponse {
  const response = serverResponseSchema.parse(row.normalizedJson);
  const lifecycleStatus = row.versionStatus === "removed_upstream"
    ? "deleted"
    : row.upstreamStatus ?? "active";
  const meta = {
    ...response._meta,
    [metaKeys.server]: {
      sourceNames: [row.sourceName],
      isOfficial: row.sourceName === "official",
      qualityLabel: row.qualityLabel,
      tags: tagSlugs
    },
    [metaKeys.serverVersion]: {
      source: row.sourceBaseUrl ?? row.sourceName,
      status: lifecycleStatus,
      publishedAt: row.publishedAt?.toISOString() ?? null,
      updatedAt: (row.upstreamUpdatedAt ?? row.updatedAt).toISOString(),
      isLatest
    },
    [curationMetaKey]: curationPayload({
      status: row.status,
      visibility: row.visibility,
      featured: row.featured,
      qualityLabel: row.qualityLabel,
      notes: row.notes,
      tags: tagSlugs,
      meta: row.meta as Record<string, JsonValue>,
      curatedAt: row.updatedAt.toISOString()
    })
  };

  const enriched = withReadiness({
    ...response,
    _meta: meta
  });

  return withGatewayCompatibility(enriched);
}

function curationPayload(input: {
  status: string;
  visibility: string;
  featured: boolean;
  qualityLabel: string | null;
  notes: string | null;
  tags: string[];
  meta: Record<string, JsonValue>;
  curatedAt: string;
}): Record<string, JsonValue> {
  return {
    status: input.status,
    visibility: input.visibility,
    featured: input.featured,
    tags: input.tags,
    qualityLabel: input.qualityLabel,
    notes: input.notes,
    meta: input.meta,
    curatedAt: input.curatedAt
  };
}
