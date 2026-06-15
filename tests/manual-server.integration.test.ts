import { describe, expect, it, beforeAll, beforeEach, afterAll } from "vitest";
import type postgres from "postgres";
import { eq } from "drizzle-orm";
import { createDatabaseConnection, type Database } from "../apps/api/src/db/client";
import { createApp } from "../apps/api/src/app";
import {
  curations,
  registrySources,
  serverPackages,
  serverRemotes,
  servers,
  serverTags,
  serverTools,
  serverVersions,
  syncRuns,
  tags
} from "../apps/api/src/db/schema";
import { createManualServer } from "../apps/api/src/services/manual-server";
import { updateCuration, upsertTag, assignTagToServer } from "../apps/api/src/services/curation-catalog";
import { upsertManualTool } from "../apps/api/src/services/tools";

const describeWithDatabase = process.env.DATABASE_URL ? describe : describe.skip;

const manualServer = {
  name: "io.github.example/manual-mcp",
  title: "Manual MCP",
  description: "Manual MCP server",
  version: "1.0.0",
  packages: [
    {
      registryType: "npm",
      identifier: "@example/manual-mcp",
      version: "1.0.0",
      environmentVariables: [
        {
          name: "API_TOKEN",
          isRequired: true,
          isSecret: true
        }
      ]
    }
  ],
  remotes: [
    {
      type: "streamable-http",
      url: "https://{tenant}.example.com/mcp",
      variables: {
        tenant: {
          isRequired: true
        }
      }
    }
  ],
  _meta: {
    "com.example/source": {
      imported: true
    }
  }
};

describeWithDatabase("createManualServer", () => {
  let db: Database;
  let queryClient: postgres.Sql;

  beforeAll(() => {
    const connection = createDatabaseConnection({
      DATABASE_URL: process.env.DATABASE_URL
    });
    db = connection.db;
    queryClient = connection.queryClient;
  });

  beforeEach(async () => {
    await db.delete(curations);
    await db.delete(serverPackages);
    await db.delete(serverRemotes);
    await db.delete(serverTools);
    await db.delete(serverTags);
    await db.delete(tags);
    await db.delete(syncRuns);
    await db.delete(serverVersions);
    await db.delete(servers);
    await db.delete(registrySources);
  });

  afterAll(async () => {
    await queryClient?.end();
  });

  it("stores a manual server with version metadata and pending curation", async () => {
    const result = await createManualServer(db, manualServer);

    expect(result.normalizedJson.server.name).toBe(manualServer.name);
    expect(result.normalizedJson._meta).toEqual(manualServer._meta);

    const storedServer = await db.query.servers.findFirst({
      where: eq(servers.name, manualServer.name)
    });
    expect(storedServer?.description).toBe(manualServer.description);

    const storedVersion = await db.query.serverVersions.findFirst({
      where: eq(serverVersions.serverId, storedServer!.id)
    });
    expect(storedVersion?.version).toBe(manualServer.version);
    expect(storedVersion?.rawJson).toEqual(manualServer);

    const storedPackage = await db.query.serverPackages.findFirst({
      where: eq(serverPackages.serverVersionId, storedVersion!.id)
    });
    expect(storedPackage?.environmentVariables).toEqual(
      manualServer.packages[0].environmentVariables
    );

    const storedRemote = await db.query.serverRemotes.findFirst({
      where: eq(serverRemotes.serverVersionId, storedVersion!.id)
    });
    expect(storedRemote?.variables).toEqual(manualServer.remotes[0].variables);

    const storedCuration = await db.query.curations.findFirst({
      where: eq(curations.serverVersionId, storedVersion!.id)
    });
    expect(storedCuration?.status).toBe("pending");
    expect(storedCuration?.visibility).toBe("private");
  });

  it("imports a server through the admin API without duplicating records", async () => {
    const app = createApp({ adminApiKey: "secret", db });

    const payload = {
      sourceName: "modelcontextprotocol",
      sourceType: "official",
      sourceBaseUrl: "https://registry.modelcontextprotocol.io",
      input: manualServer,
      upstreamStatus: "active" as const
    };

    const firstResponse = await app.request("/admin/imports", {
      method: "POST",
      headers: {
        Authorization: "Bearer secret",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const firstBody = await firstResponse.json();

    expect(firstResponse.status).toBe(201);
    expect(firstBody.server.name).toBe(manualServer.name);

    const secondResponse = await app.request("/admin/imports", {
      method: "POST",
      headers: {
        Authorization: "Bearer secret",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    expect(secondResponse.status).toBe(201);

    const storedServer = await db.query.servers.findFirst({
      where: eq(servers.name, manualServer.name)
    });
    const storedVersion = await db.query.serverVersions.findFirst({
      where: eq(serverVersions.serverId, storedServer!.id)
    });
    const storedCuration = await db.query.curations.findFirst({
      where: eq(curations.serverVersionId, storedVersion!.id)
    });
    const sourceRows = await db
      .select()
      .from(registrySources)
      .where(eq(registrySources.name, payload.sourceName));

    expect(sourceRows).toHaveLength(1);
    expect(sourceRows[0].type).toBe("official");
    expect(storedVersion?.rawJson).toEqual(manualServer);
    expect(storedCuration?.status).toBe("pending");
    expect(storedCuration?.visibility).toBe("private");
  });

  it("upserts manual tool metadata through the admin API", async () => {
    await createManualServer(db, manualServer);
    const app = createApp({ adminApiKey: "secret", db });

    const response = await app.request(
      `/admin/servers/${encodeURIComponent(manualServer.name)}/versions/${manualServer.version}/tools/read_file`,
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer secret",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          description: "Read a file from the private server",
          inputSchema: {
            type: "object",
            properties: {
              path: {
                type: "string"
              }
            },
            required: ["path"]
          }
        })
      }
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.tool).toMatchObject({
      name: "read_file",
      source: "manual",
      description: "Read a file from the private server"
    });

    const toolsResponse = await app.request(
      `/v0.1/servers/${encodeURIComponent(manualServer.name)}/tools?version=${manualServer.version}`
    );
    const toolsBody = await toolsResponse.json();

    expect(toolsResponse.status).toBe(200);
    expect(toolsBody.metadata.count).toBe(1);
    expect(toolsBody.tools[0]).toMatchObject({
      name: "read_file",
      source: "manual"
    });
  });

  it("inspects stored raw and normalized payloads through the admin API", async () => {
    await createManualServer(db, manualServer);
    const app = createApp({ adminApiKey: "secret", db });

    const response = await app.request(
      `/admin/servers/${encodeURIComponent(manualServer.name)}/versions/${manualServer.version}/payloads`,
      {
        headers: {
          Authorization: "Bearer secret"
        }
      }
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.serverName).toBe(manualServer.name);
    expect(body.version).toBe(manualServer.version);
    expect(body.rawJson).toEqual(manualServer);
    expect(body.normalizedJson.server.name).toBe(manualServer.name);
    expect(body.normalizedJson.server.version).toBe(manualServer.version);
  });

  it("exports and imports a logical backup", async () => {
    await createManualServer(db, manualServer);
    await updateCuration(db, {
      serverName: manualServer.name,
      version: manualServer.version,
      status: "approved",
      visibility: "public",
      featured: true,
      qualityLabel: "verified",
      notes: "Backup test"
    });
    await upsertTag(db, { slug: "private", name: "Private" });
    await assignTagToServer(db, { serverName: manualServer.name, tagSlug: "private" });
    await upsertManualTool(db, manualServer.name, manualServer.version, "read_file", {
      description: "Read a file",
      inputSchema: { type: "object" }
    });

    const app = createApp({ adminApiKey: "secret", db });
    const exportResponse = await app.request("/admin/backup", {
      headers: {
        Authorization: "Bearer secret"
      }
    });
    const backup = await exportResponse.json();

    expect(exportResponse.status).toBe(200);
    expect(backup.serverVersions).toHaveLength(1);
    expect(backup.curations).toHaveLength(1);
    expect(backup.tags).toHaveLength(1);
    expect(backup.tools).toHaveLength(1);

    await db.delete(curations);
    await db.delete(serverPackages);
    await db.delete(serverRemotes);
    await db.delete(serverTools);
    await db.delete(serverTags);
    await db.delete(tags);
    await db.delete(syncRuns);
    await db.delete(serverVersions);
    await db.delete(servers);
    await db.delete(registrySources);

    const importResponse = await app.request("/admin/backup/import", {
      method: "POST",
      headers: {
        Authorization: "Bearer secret",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(backup)
    });
    const importBody = await importResponse.json();

    expect(importResponse.status).toBe(200);
    expect(importBody.imported).toMatchObject({
      serverVersions: 1,
      curations: 1,
      tags: 1,
      serverTags: 1,
      tools: 1
    });

    const catalogResponse = await app.request("/v0.1/catalog");
    const catalogBody = await catalogResponse.json();

    expect(catalogResponse.status).toBe(200);
    expect(catalogBody.metadata.count).toBe(1);
    expect(catalogBody.servers[0]._meta["com.mcp-gateway.registry/curation"]).toMatchObject({
      status: "approved",
      visibility: "public",
      tags: ["private"]
    });

    const toolsResponse = await app.request(
      `/v0.1/servers/${encodeURIComponent(manualServer.name)}/tools?version=${manualServer.version}`
    );
    const toolsBody = await toolsResponse.json();

    expect(toolsResponse.status).toBe(200);
    expect(toolsBody.tools[0]).toMatchObject({
      name: "read_file",
      source: "manual"
    });
  });
});
