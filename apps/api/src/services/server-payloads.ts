import { and, desc, eq } from "drizzle-orm";
import type { Database } from "../db/client";
import { serverVersions, servers } from "../db/schema";

export interface ServerPayloads {
  serverName: string;
  version: string;
  rawJson: unknown;
  normalizedJson: unknown;
}

export async function getServerPayloads(
  db: Database,
  name: string,
  version: string
): Promise<ServerPayloads | null> {
  const requestedVersion = version === "latest" ? null : version;

  const conditions = [
    eq(servers.name, name),
    eq(servers.status, "indexed"),
    eq(serverVersions.status, "indexed")
  ];

  if (requestedVersion) {
    conditions.push(eq(serverVersions.version, requestedVersion));
  }

  const baseQuery = db
    .select({
      serverName: servers.name,
      version: serverVersions.version,
      rawJson: serverVersions.rawJson,
      normalizedJson: serverVersions.normalizedJson
    })
    .from(serverVersions)
    .innerJoin(servers, eq(servers.id, serverVersions.serverId))
    .where(and(...conditions));

  const rows = requestedVersion
    ? await baseQuery.limit(1)
    : await baseQuery.orderBy(desc(serverVersions.updatedAt), desc(serverVersions.id)).limit(1);
  const [row] = rows;
  if (!row) {
    return null;
  }

  return {
    serverName: row.serverName,
    version: row.version,
    rawJson: row.rawJson,
    normalizedJson: row.normalizedJson
  };
}
