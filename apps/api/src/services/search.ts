import { desc, eq } from "drizzle-orm";
import type { Database } from "../db/client";
import {
  serverPackages,
  serverTags,
  serverVersions,
  servers,
  tags
} from "../db/schema";
import {
  serverResponseSchema,
  type ServerResponse
} from "../schemas/mcp-registry";

export interface SearchOptions {
  query?: string | null;
  limit?: number;
}

export interface SearchResult extends ServerResponse {
  search: {
    score: number;
    matchedFields: string[];
  };
}

export interface SearchResponse {
  servers: SearchResult[];
  metadata: {
    count: number;
    query: string;
  };
}

interface SearchCandidate {
  serverId: number;
  versionId: number;
  name: string;
  title: string | null;
  description: string | null;
  normalizedJson: unknown;
  updatedAt: Date;
  packages: string[];
  tags: string[];
}

const defaultLimit = 20;
const maxLimit = 50;

function normalizeLimit(limit: number | undefined): number {
  if (!limit || Number.isNaN(limit)) {
    return defaultLimit;
  }

  return Math.min(Math.max(Math.trunc(limit), 1), maxLimit);
}

function normalizeQuery(query: string | null | undefined): string {
  return query?.trim().toLowerCase() ?? "";
}

export async function searchServers(
  db: Database,
  options: SearchOptions = {}
): Promise<SearchResponse> {
  const query = normalizeQuery(options.query);

  if (!query) {
    return {
      servers: [],
      metadata: {
        count: 0,
        query: ""
      }
    };
  }

  const candidates = await latestCandidates(db);
  const results = candidates
    .map((candidate) => scoreCandidate(candidate, query))
    .filter((result): result is SearchResult & { updatedAt: Date } => result !== null)
    .sort((left, right) => {
      if (right.search.score !== left.search.score) {
        return right.search.score - left.search.score;
      }

      return right.updatedAt.getTime() - left.updatedAt.getTime();
    })
    .slice(0, normalizeLimit(options.limit))
    .map(({ updatedAt: _updatedAt, ...result }) => result);

  return {
    servers: results,
    metadata: {
      count: results.length,
      query
    }
  };
}

async function latestCandidates(db: Database): Promise<SearchCandidate[]> {
  const rows = await db
    .select({
      serverId: servers.id,
      versionId: serverVersions.id,
      name: servers.name,
      title: servers.title,
      description: servers.description,
      normalizedJson: serverVersions.normalizedJson,
      updatedAt: serverVersions.updatedAt
    })
    .from(serverVersions)
    .innerJoin(servers, eq(servers.id, serverVersions.serverId))
    .where(eq(servers.status, "indexed"))
    .orderBy(desc(serverVersions.updatedAt), desc(serverVersions.id));

  const latestRows = new Map<number, Omit<SearchCandidate, "packages" | "tags">>();

  for (const row of rows) {
    if (!latestRows.has(row.serverId)) {
      latestRows.set(row.serverId, row);
    }
  }

  const candidates: SearchCandidate[] = [];

  for (const row of latestRows.values()) {
    candidates.push({
      ...row,
      packages: await packageIdentifiers(db, row.versionId),
      tags: await tagTerms(db, row.serverId)
    });
  }

  return candidates;
}

async function packageIdentifiers(db: Database, serverVersionId: number) {
  const rows = await db
    .select({
      identifier: serverPackages.identifier
    })
    .from(serverPackages)
    .where(eq(serverPackages.serverVersionId, serverVersionId));

  return rows.map((row) => row.identifier);
}

async function tagTerms(db: Database, serverId: number) {
  const rows = await db
    .select({
      slug: tags.slug,
      name: tags.name
    })
    .from(serverTags)
    .innerJoin(tags, eq(tags.id, serverTags.tagId))
    .where(eq(serverTags.serverId, serverId));

  return rows.flatMap((row) => [row.slug, row.name]);
}

function scoreCandidate(
  candidate: SearchCandidate,
  query: string
): (SearchResult & { updatedAt: Date }) | null {
  const matchedFields = new Set<string>();
  let score = 0;

  if (matches(candidate.name, query)) {
    matchedFields.add("name");
    score += 100;
  }

  if (matches(candidate.title, query)) {
    matchedFields.add("title");
    score += 80;
  }

  if (matches(candidate.description, query)) {
    matchedFields.add("description");
    score += 50;
  }

  if (candidate.packages.some((identifier) => matches(identifier, query))) {
    matchedFields.add("package");
    score += 40;
  }

  if (candidate.tags.some((tag) => matches(tag, query))) {
    matchedFields.add("tag");
    score += 30;
  }

  if (!score) {
    return null;
  }

  const response = serverResponseSchema.parse(candidate.normalizedJson);

  return {
    ...response,
    search: {
      score,
      matchedFields: [...matchedFields]
    },
    updatedAt: candidate.updatedAt
  };
}

function matches(value: string | null | undefined, query: string): boolean {
  return value?.toLowerCase().includes(query) ?? false;
}
