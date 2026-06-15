import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import type { Database } from "../db/client";
import { serverTools, serverVersions, servers } from "../db/schema";
import { jsonValueSchema } from "../schemas/mcp-registry";

export const manualToolInputSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  inputSchema: jsonValueSchema.optional(),
  outputSchema: jsonValueSchema.optional()
});

export type ManualToolInput = z.infer<typeof manualToolInputSchema>;

export async function listServerTools(
  db: Database,
  serverName: string,
  version?: string | null
) {
  const versionRows = await db
    .select({
      id: serverVersions.id,
      version: serverVersions.version
    })
    .from(serverVersions)
    .innerJoin(servers, eq(servers.id, serverVersions.serverId))
    .where(eq(servers.name, serverName))
    .orderBy(desc(serverVersions.updatedAt), desc(serverVersions.id));

  if (!versionRows.length) {
    return null;
  }

  const requestedVersion = version && version !== "latest" ? version : null;
  const selectedVersion = requestedVersion
    ? versionRows.find((row) => row.version === requestedVersion)
    : versionRows[0];

  if (!selectedVersion) {
    return null;
  }

  const rows = await db
    .select({
      version: serverVersions.version,
      tool: serverTools
    })
    .from(serverTools)
    .innerJoin(serverVersions, eq(serverVersions.id, serverTools.serverVersionId))
    .innerJoin(servers, eq(servers.id, serverVersions.serverId))
    .where(eq(serverVersions.id, selectedVersion.id))
    .orderBy(desc(serverTools.name));
  const tools = rows
    .map((row) => ({
      name: row.tool.name,
      description: row.tool.description,
      inputSchema: row.tool.inputSchema,
      outputSchema: row.tool.outputSchema,
      source: row.tool.source,
      discoveredAt: row.tool.discoveredAt?.toISOString() ?? null
    }));

  return {
    serverName,
    version: selectedVersion.version,
    tools,
    metadata: {
      count: tools.length
    }
  };
}

export async function upsertManualTool(
  db: Database,
  serverName: string,
  version: string,
  toolName: string,
  input: ManualToolInput
) {
  const [target] = await db
    .select({
      serverVersionId: serverVersions.id,
      version: serverVersions.version
    })
    .from(serverVersions)
    .innerJoin(servers, eq(servers.id, serverVersions.serverId))
    .where(
      and(
        eq(servers.name, serverName),
        eq(serverVersions.version, version),
        eq(servers.status, "indexed"),
        eq(serverVersions.status, "indexed")
      )
    )
    .limit(1);

  if (!target) {
    return null;
  }

  const effectiveName = input.name || toolName;
  const [tool] = await db
    .insert(serverTools)
    .values({
      serverVersionId: target.serverVersionId,
      name: effectiveName,
      description: input.description ?? null,
      inputSchema: input.inputSchema,
      outputSchema: input.outputSchema,
      source: "manual"
    })
    .onConflictDoUpdate({
      target: [serverTools.serverVersionId, serverTools.name],
      set: {
        description: input.description ?? null,
        inputSchema: input.inputSchema,
        outputSchema: input.outputSchema,
        source: "manual",
        updatedAt: new Date()
      }
    })
    .returning();

  return {
    serverName,
    version: target.version,
    tool: {
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
      outputSchema: tool.outputSchema,
      source: tool.source,
      discoveredAt: tool.discoveredAt?.toISOString() ?? null
    }
  };
}

export async function countServerTools(
  db: Database,
  serverName: string,
  version: string
): Promise<number> {
  const rows = await db
    .select({
      id: serverTools.id
    })
    .from(serverTools)
    .innerJoin(serverVersions, eq(serverVersions.id, serverTools.serverVersionId))
    .innerJoin(servers, eq(servers.id, serverVersions.serverId))
    .where(
      and(
        eq(servers.name, serverName),
        eq(serverVersions.version, version),
        eq(servers.status, "indexed"),
        eq(serverVersions.status, "indexed")
      )
    );

  return rows.length;
}
