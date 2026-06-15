import { and, eq } from "drizzle-orm";
import type { Database } from "../db/client";
import {
  curations,
  registrySources,
  serverPackages,
  serverRemotes,
  servers,
  serverVersions
} from "../db/schema";
import type { JsonValue, ServerDetail } from "../schemas/mcp-registry";
import {
  normalizeServerRecord,
  type NormalizedServerRecord
} from "./normalize-server";

export interface IngestServerInput {
  sourceName: string;
  sourceType: "official" | "subregistry" | "manual" | "other";
  sourceBaseUrl?: string | null;
  input: unknown;
  upstreamStatus?: "active" | "deprecated" | "deleted";
}

function stringField(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function jsonArrayField(value: unknown): JsonValue[] | null {
  return Array.isArray(value) ? (value as JsonValue[]) : null;
}

function jsonField(value: unknown): JsonValue | null {
  return value === undefined ? null : (value as JsonValue);
}

function versionStatus(upstreamStatus: IngestServerInput["upstreamStatus"]) {
  return upstreamStatus === "deleted" ? "removed_upstream" : "indexed";
}

function serverStatus(upstreamStatus: IngestServerInput["upstreamStatus"]) {
  return upstreamStatus === "deleted" ? "removed_upstream" : "indexed";
}

export async function ingestServerRecord(
  db: Database,
  input: IngestServerInput
): Promise<NormalizedServerRecord> {
  const normalizedRecord = normalizeServerRecord(input.input);
  const server = normalizedRecord.normalizedJson.server;
  const upstreamStatus = input.upstreamStatus ?? "active";

  await db.transaction(async (tx) => {
    const [source] = await tx
      .insert(registrySources)
      .values({
        name: input.sourceName,
        type: input.sourceType,
        baseUrl: input.sourceBaseUrl ?? null
      })
      .onConflictDoUpdate({
        target: registrySources.name,
        set: {
          type: input.sourceType,
          baseUrl: input.sourceBaseUrl ?? null,
          enabled: true,
          updatedAt: new Date()
        }
      })
      .returning();

    const [storedServer] = await tx
      .insert(servers)
      .values({
        name: server.name,
        title: server.title ?? null,
        description: server.description,
        websiteUrl: stringField(server.websiteUrl),
        repositoryUrl: stringField(server.repositoryUrl),
        license: stringField(server.license),
        status: serverStatus(upstreamStatus)
      })
      .onConflictDoUpdate({
        target: servers.name,
        set: {
          title: server.title ?? null,
          description: server.description,
          websiteUrl: stringField(server.websiteUrl),
          repositoryUrl: stringField(server.repositoryUrl),
          license: stringField(server.license),
          status: serverStatus(upstreamStatus),
          updatedAt: new Date()
        }
      })
      .returning();

    const [storedVersion] = await tx
      .insert(serverVersions)
      .values({
        serverId: storedServer.id,
        sourceId: source.id,
        version: server.version,
        rawJson: normalizedRecord.rawJson,
        normalizedJson: normalizedRecord.normalizedJson,
        upstreamStatus,
        status: versionStatus(upstreamStatus)
      })
      .onConflictDoUpdate({
        target: [
          serverVersions.serverId,
          serverVersions.sourceId,
          serverVersions.version
        ],
        set: {
          rawJson: normalizedRecord.rawJson,
          normalizedJson: normalizedRecord.normalizedJson,
          upstreamStatus,
          status: versionStatus(upstreamStatus),
          updatedAt: new Date()
        }
      })
      .returning();

    await tx
      .delete(serverPackages)
      .where(eq(serverPackages.serverVersionId, storedVersion.id));
    await tx
      .delete(serverRemotes)
      .where(eq(serverRemotes.serverVersionId, storedVersion.id));

    await insertPackages(tx, storedVersion.id, server);
    await insertRemotes(tx, storedVersion.id, server);

    const existingCuration = await tx.query.curations.findFirst({
      where: and(
        eq(curations.serverId, storedServer.id),
        eq(curations.serverVersionId, storedVersion.id)
      )
    });

    if (!existingCuration && upstreamStatus !== "deleted") {
      await tx.insert(curations).values({
        serverId: storedServer.id,
        serverVersionId: storedVersion.id,
        status: "pending",
        visibility: "private",
        meta: {}
      });
    }
  });

  return normalizedRecord;
}

async function insertPackages(
  tx: Parameters<Parameters<Database["transaction"]>[0]>[0],
  serverVersionId: number,
  server: ServerDetail
) {
  if (!server.packages?.length) {
    return;
  }

  await tx.insert(serverPackages).values(
    server.packages.map((serverPackage) => ({
      serverVersionId,
      registryType: serverPackage.registryType,
      identifier: serverPackage.identifier,
      version: serverPackage.version ?? null,
      transport: jsonField(serverPackage.transport),
      runtimeHint: stringField(serverPackage.runtimeHint),
      registryBaseUrl: stringField(serverPackage.registryBaseUrl),
      fileSha256: stringField(serverPackage.fileSha256),
      packageArguments: jsonArrayField(serverPackage.packageArguments),
      runtimeArguments: jsonArrayField(serverPackage.runtimeArguments),
      environmentVariables: jsonArrayField(serverPackage.environmentVariables),
      packageJson: serverPackage
    }))
  );
}

async function insertRemotes(
  tx: Parameters<Parameters<Database["transaction"]>[0]>[0],
  serverVersionId: number,
  server: ServerDetail
) {
  if (!server.remotes?.length) {
    return;
  }

  await tx.insert(serverRemotes).values(
    server.remotes.map((remote) => ({
      serverVersionId,
      transportType: remote.type,
      url: remote.url,
      headers: jsonField(remote.headers),
      variables: jsonField(remote.variables),
      remoteJson: remote
    }))
  );
}
