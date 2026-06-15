import { and, desc, eq } from "drizzle-orm";
import type { Database } from "../db/client";
import { curations, registrySources, servers, serverTags, serverVersions, tags } from "../db/schema";
import {
  serverResponseSchema,
  type JsonValue,
  type ServerList,
  type ServerResponse
} from "../schemas/mcp-registry";
import { withReadiness } from "./readiness";
import { metaKeys } from "../../../../packages/shared/src";

export interface ListServersOptions {
  limit?: number;
  cursor?: string | null;
  version?: string | null;
  search?: string | null;
  updatedSince?: string | null;
  includeDeleted?: boolean;
}

export interface ServerVersionSummary {
  version: string;
  updatedAt: string;
}

interface VersionRow {
  id: number;
  serverId: number;
  serverName: string;
  serverTitle: string | null;
  serverDescription: string | null;
  sourceName: string;
  sourceBaseUrl: string | null;
  version: string;
  normalizedJson: unknown;
  upstreamStatus: "active" | "deprecated" | "deleted" | null;
  status: "indexed" | "removed_upstream" | "invalid";
  publishedAt: Date | null;
  upstreamUpdatedAt: Date | null;
  updatedAt: Date;
}

const defaultLimit = 50;
const maxLimit = 100;

function normalizeLimit(limit: number | undefined): number {
  if (!limit || Number.isNaN(limit)) {
    return defaultLimit;
  }

  return Math.min(Math.max(Math.trunc(limit), 1), maxLimit);
}

function parseCursor(cursor: string | null | undefined): number | null {
  if (!cursor) {
    return null;
  }

  const parsed = Number(cursor);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function parseResponse(value: unknown): ServerResponse {
  return serverResponseSchema.parse(value);
}

function parseUpdatedSince(updatedSince: string | null | undefined): Date | null {
  if (!updatedSince) {
    return null;
  }

  const parsed = new Date(updatedSince);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

async function readableVersionRows(
  db: Database,
  includeDeleted = false
): Promise<VersionRow[]> {
  return db
    .select({
      id: serverVersions.id,
      serverId: serverVersions.serverId,
      serverName: servers.name,
      serverTitle: servers.title,
      serverDescription: servers.description,
      sourceName: registrySources.name,
      sourceBaseUrl: registrySources.baseUrl,
      version: serverVersions.version,
      normalizedJson: serverVersions.normalizedJson,
      upstreamStatus: serverVersions.upstreamStatus,
      status: serverVersions.status,
      publishedAt: serverVersions.publishedAt,
      upstreamUpdatedAt: serverVersions.upstreamUpdatedAt,
      updatedAt: serverVersions.updatedAt
    })
    .from(serverVersions)
    .innerJoin(servers, eq(servers.id, serverVersions.serverId))
    .innerJoin(registrySources, eq(registrySources.id, serverVersions.sourceId))
    .orderBy(desc(serverVersions.updatedAt), desc(serverVersions.id));
}

export async function listServers(
  db: Database,
  options: ListServersOptions = {}
): Promise<ServerList> {
  const limit = normalizeLimit(options.limit);
  const updatedSince = parseUpdatedSince(options.updatedSince);
  const rows = filterRows(await readableVersionRows(db, options.includeDeleted), {
    search: options.search,
    updatedSince,
    version: options.version,
    includeDeleted: options.includeDeleted
  });

  if (options.version && options.version !== "latest") {
    return pageRows(db, rows, limit, parseCursor(options.cursor), rows);
  }

  if (options.version !== "latest") {
    return pageRows(db, rows, limit, parseCursor(options.cursor), rows);
  }

  const latestRows = new Map<number, VersionRow>();

  for (const row of rows) {
    if (!latestRows.has(row.serverId)) {
      latestRows.set(row.serverId, row);
    }
  }

  return pageRows(db, [...latestRows.values()], limit, parseCursor(options.cursor), rows);
}

function filterRows(
  rows: VersionRow[],
  options: {
    search?: string | null;
    updatedSince: Date | null;
    version?: string | null;
    includeDeleted?: boolean;
  }
) {
  const search = options.search?.trim().toLowerCase();

  return rows.filter((row) => {
    if (!options.includeDeleted && row.status !== "indexed") {
      return false;
    }

    if (options.version && options.version !== "latest" && row.version !== options.version) {
      return false;
    }

    if (options.updatedSince) {
      const effectiveUpdatedAt = row.upstreamUpdatedAt ?? row.updatedAt;

      if (effectiveUpdatedAt <= options.updatedSince) {
        return false;
      }
    }

    if (search) {
      const haystack = [
        row.serverName,
        row.serverTitle,
        row.serverDescription
      ].join(" ").toLowerCase();

      if (!haystack.includes(search)) {
        return false;
      }
    }

    return true;
  });
}

async function pageRows(
  db: Database,
  rows: VersionRow[],
  limit: number,
  cursor: number | null,
  allRows: VersionRow[]
): Promise<ServerList> {
  const startIndex = cursor
    ? Math.max(
        rows.findIndex((row) => row.id === cursor) + 1,
        0
      )
    : 0;
  const page = rows.slice(startIndex, startIndex + limit);
  const hasNextPage = startIndex + limit < rows.length;

  return {
    servers: await Promise.all(
      page.map((row) => enrichResponse(db, row, latestVersionIds(allRows)))
    ),
    metadata: {
      count: page.length,
      nextCursor: hasNextPage ? String(page[page.length - 1]?.id) : null
    }
  };
}

function latestVersionIds(rows: VersionRow[]) {
  const latestByServer = new Map<number, number>();

  for (const row of rows) {
    if (!latestByServer.has(row.serverId)) {
      latestByServer.set(row.serverId, row.id);
    }
  }

  return latestByServer;
}

async function enrichResponse(db: Database, row: VersionRow, latestByServer: Map<number, number>) {
  const response = parseResponse(row.normalizedJson);
  const existingMeta = isRecord(response._meta) ? response._meta : {};
  const status = row.status === "removed_upstream"
    ? "deleted"
    : row.upstreamStatus ?? "active";
  const curation = await curationForVersion(db, row.serverId, row.id);
  const tagRows = await tagsForServer(db, row.serverId);

  return withReadiness({
    ...response,
    _meta: {
      ...existingMeta,
      [metaKeys.server]: {
        sourceNames: [row.sourceName],
        isOfficial: row.sourceName === "official"
      },
      [metaKeys.serverVersion]: {
        source: row.sourceBaseUrl ?? row.sourceName,
        status,
        publishedAt: row.publishedAt?.toISOString() ?? null,
        updatedAt: (row.upstreamUpdatedAt ?? row.updatedAt).toISOString(),
        isLatest: latestByServer.get(row.serverId) === row.id
      },
      [metaKeys.curation]: {
        status: curation?.status ?? "pending",
        visibility: curation?.visibility ?? "private",
        featured: curation?.featured ?? false,
        tags: tagRows.map((tag) => tag.slug),
        qualityLabel: curation?.qualityLabel ?? null,
        notes: curation?.notes ?? null,
        meta: isRecord(curation?.meta) ? curation?.meta : {},
        curatedAt: curation?.updatedAt.toISOString() ?? null
      }
    }
  } satisfies ServerResponse);
}

export async function getServer(
  db: Database,
  name: string,
  version?: string | null
): Promise<ServerResponse | null> {
  const requestedVersion = version && version !== "latest" ? version : null;
  const serverRows = (await readableVersionRows(db)).filter((row) => {
    if (row.serverName !== name || row.status !== "indexed") {
      return false;
    }

    return requestedVersion ? row.version === requestedVersion : true;
  });
  const allServerRows = (await readableVersionRows(db)).filter(
    (row) => row.serverName === name && row.status === "indexed"
  );
  const [row] = serverRows;

  return row ? enrichResponse(db, row, latestVersionIds(allServerRows)) : null;
}

export async function listServerVersions(
  db: Database,
  name: string
): Promise<ServerVersionSummary[] | null> {
  const rows = await db
    .select({
      serverId: servers.id,
      version: serverVersions.version,
      updatedAt: serverVersions.updatedAt
    })
    .from(serverVersions)
    .innerJoin(servers, eq(servers.id, serverVersions.serverId))
    .where(
      and(
        eq(servers.name, name),
        eq(servers.status, "indexed"),
        eq(serverVersions.status, "indexed")
      )
    )
    .orderBy(desc(serverVersions.updatedAt), desc(serverVersions.id));

  if (!rows.length) {
    return null;
  }

  return rows.map((row) => ({
    version: row.version,
    updatedAt: row.updatedAt.toISOString()
  }));
}

function isRecord(value: unknown): value is Record<string, JsonValue> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function curationForVersion(db: Database, serverId: number, serverVersionId: number) {
  return db.query.curations.findFirst({
    where: and(
      eq(curations.serverId, serverId),
      eq(curations.serverVersionId, serverVersionId)
    )
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
