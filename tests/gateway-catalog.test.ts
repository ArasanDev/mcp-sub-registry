import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type postgres from "postgres";
import { eq } from "drizzle-orm";
import { createApp } from "../apps/api/src/app";
import { createDatabaseConnection, type Database } from "../apps/api/src/db/client";
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

const approvedServer = {
  name: "io.example.gateway-approved",
  title: "Gateway Approved",
  description: "Approved for catalog import only",
  version: "1.0.0",
  packages: [
    {
      registryType: "npm",
      identifier: "@example/gateway-approved",
      version: "1.0.0",
      runtimeHint: "npx",
      environmentVariables: [
        {
          name: "API_TOKEN",
          description: "Token reference required by gateway",
          isRequired: true,
          isSecret: true
        }
      ]
    }
  ],
  remotes: [
    {
      type: "streamable-http",
      url: "https://mcp.example.com/mcp",
      headers: [
        {
          name: "Authorization",
          isRequired: true,
          isSecret: true
        }
      ]
    }
  ]
};

const packageOnlyServer = {
  name: "io.example.gateway-package-only",
  title: "Gateway Package Only",
  description: "Package-based server",
  version: "1.0.0",
  packages: [
    {
      registryType: "npm",
      identifier: "@example/gateway-package-only",
      version: "1.0.0",
      runtimeHint: "npx"
    }
  ]
};

const hostedRemoteServer = {
  name: "io.example.gateway-hosted-remote",
  title: "Gateway Hosted Remote",
  description: "Hosted remote server",
  version: "1.0.0",
  remotes: [
    {
      type: "sse",
      url: "https://sse.example.com/mcp"
    }
  ]
};

const privateApprovedServer = {
  name: "io.example.gateway-private-approved",
  title: "Gateway Private Approved",
  description: "Approved but private server",
  version: "1.0.0",
  remotes: [
    {
      type: "streamable-http",
      url: "https://private.example.com/mcp"
    }
  ]
};

const pendingServer = {
  name: "io.example.gateway-pending",
  description: "Pending server",
  version: "1.0.0"
};

const hiddenServer = {
  name: "io.example.gateway-hidden",
  description: "Hidden server",
  version: "1.0.0"
};

const rejectedServer = {
  name: "io.example.gateway-rejected",
  description: "Rejected server",
  version: "1.0.0"
};

const deletedServer = {
  name: "io.example.gateway-deleted",
  description: "Deleted server",
  version: "1.0.0"
};

describeWithDatabase("gateway catalog projection", () => {
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

    await createManualServer(db, approvedServer);
    await createManualServer(db, packageOnlyServer);
    await createManualServer(db, hostedRemoteServer);
    await createManualServer(db, privateApprovedServer);
    await createManualServer(db, pendingServer);
    await createManualServer(db, hiddenServer);
    await createManualServer(db, rejectedServer);
    await createManualServer(db, deletedServer);
    await updateCuration(db, {
      serverName: approvedServer.name,
      version: approvedServer.version,
      status: "approved",
      visibility: "public",
      qualityLabel: "verified"
    });
    await updateCuration(db, {
      serverName: packageOnlyServer.name,
      version: packageOnlyServer.version,
      status: "approved",
      visibility: "public",
      qualityLabel: "verified"
    });
    await updateCuration(db, {
      serverName: hostedRemoteServer.name,
      version: hostedRemoteServer.version,
      status: "approved",
      visibility: "public",
      qualityLabel: "verified"
    });
    await updateCuration(db, {
      serverName: privateApprovedServer.name,
      version: privateApprovedServer.version,
      status: "approved",
      visibility: "private",
      qualityLabel: "verified"
    });
    await updateCuration(db, {
      serverName: hiddenServer.name,
      version: hiddenServer.version,
      status: "hidden",
      visibility: "private"
    });
    await updateCuration(db, {
      serverName: rejectedServer.name,
      version: rejectedServer.version,
      status: "rejected",
      visibility: "private"
    });
    await updateCuration(db, {
      serverName: deletedServer.name,
      version: deletedServer.version,
      status: "approved",
      visibility: "public"
    });
    await upsertTag(db, { slug: "gateway", name: "Gateway" });
    await assignTagToServer(db, { serverName: approvedServer.name, tagSlug: "gateway" });
    await upsertManualTool(db, approvedServer.name, approvedServer.version, "read_file", {
      description: "Read a file",
      inputSchema: { type: "object" }
    });
    const storedDeletedServer = await db.query.servers.findFirst({
      where: eq(servers.name, deletedServer.name)
    });
    await db
      .update(serverVersions)
      .set({ status: "removed_upstream", upstreamStatus: "deleted" })
      .where(eq(serverVersions.serverId, storedDeletedServer!.id));
  });

  afterAll(async () => {
    await queryClient?.end();
  });

  it("returns only approved public non-deleted records for gateway import", async () => {
    const app = createApp({ db });
    const response = await app.request("/v0.1/gateway/catalog");
    const body = await response.json();
    const names = body.items.map((item: { name: string }) => item.name);
    const itemsByName = new Map(body.items.map((item: { name: string }) => [item.name, item]));

    expect(response.status).toBe(200);
    expect(body.items).toHaveLength(3);
    expect(names).toEqual(
      expect.arrayContaining([
        approvedServer.name,
        packageOnlyServer.name,
        hostedRemoteServer.name
      ])
    );
    for (const name of [
      pendingServer.name,
      hiddenServer.name,
      rejectedServer.name,
      privateApprovedServer.name,
      deletedServer.name
    ]) {
      expect(names).not.toContain(name);
    }
    expect(itemsByName.get(approvedServer.name)).toMatchObject({
      name: approvedServer.name,
      version: approvedServer.version,
      lifecycleStatus: "active",
      tags: ["gateway"],
      qualityLabel: "verified",
      gateway_compatibility: {
        hosted_gateway: false,
        requires_connector_runtime: true,
        supported_transports: ["stdio", "streamable-http"]
      },
      curation: {
        status: "approved",
        visibility: "public"
      }
    });
    expect(itemsByName.get(packageOnlyServer.name)).toMatchObject({
      gateway_compatibility: {
        hosted_gateway: false,
        requires_connector_runtime: true,
        supported_transports: ["stdio"]
      }
    });
    expect(itemsByName.get(hostedRemoteServer.name)).toMatchObject({
      gateway_compatibility: {
        hosted_gateway: true,
        requires_connector_runtime: false,
        supported_transports: ["sse"]
      }
    });
  });

  it("preserves package and remote draft inputs and tools URL", async () => {
    const app = createApp({ db });
    const response = await app.request("/v0.1/gateway/catalog");
    const body = await response.json();
    const item = body.items.find(
      (entry: { name: string }) => entry.name === approvedServer.name
    );

    expect(item).toBeTruthy();
    expect(item.packages[0]).toMatchObject({
      id: "pkg_1",
      registryType: "npm",
      packageName: "@example/gateway-approved",
      version: "1.0.0",
      runtimeHint: "npx"
    });
    expect(item.packages[0].envSchema[0]).toMatchObject({
      name: "API_TOKEN",
      required: true,
      secret: true
    });
    expect(item.remotes[0]).toMatchObject({
      id: "remote_1",
      transport: "streamable_http",
      url: "https://mcp.example.com/mcp",
      hosted: true,
      auth: {
        type: "bearer",
        requiredSecret: "Authorization"
      }
    });
    expect(item.toolsUrl).toBe(
      `/v0.1/servers/${encodeURIComponent(approvedServer.name)}/tools?version=1.0.0`
    );
    expect(item.toolCount).toBe(1);
    expect(item.readiness).toMatchObject({
      status: "needs_secret"
    });
    expect(item.gateway_compatibility).toMatchObject({
      hosted_gateway: false,
      requires_connector_runtime: true
    });
    expect(item.requiredSecrets).toEqual(
      expect.arrayContaining(["API_TOKEN", "Authorization"])
    );
  });

  it("does not expose gateway runtime enablement or secret material", async () => {
    const app = createApp({ db });
    const response = await app.request("/v0.1/gateway/catalog");
    const text = await response.text();
    const body = JSON.parse(text);
    const approved = body.items.find(
      (entry: { name: string }) => entry.name === approvedServer.name
    );

    expect(text).not.toMatch(/"enabled"/);
    expect(text).not.toMatch(
      /runtimeEnabled|approvedForRuntime|gatewayPolicy|routingPolicy|workspacePermissions|sessionId|toolResultPayload|mcpCallPayload|mcpCallResult/
    );
    expect(text).not.toContain("secretValue");
    expect(text).not.toContain("userToken");
    expect(approved.contentHash).toMatch(/^sha256:/);
    expect(approved.catalogItemId).toMatch(/^srv_/);
  });

  it("supports cursor pagination", async () => {
    await createManualServer(db, {
      name: "io.example.gateway-approved-two",
      description: "Second approved server",
      version: "1.0.0"
    });
    await updateCuration(db, {
      serverName: "io.example.gateway-approved-two",
      version: "1.0.0",
      status: "approved",
      visibility: "public"
    });

    const app = createApp({ db });
    const firstResponse = await app.request("/v0.1/gateway/catalog?limit=3");
    const first = await firstResponse.json();
    const secondResponse = await app.request(
      `/v0.1/gateway/catalog?limit=1&cursor=${first.nextCursor}`
    );
    const second = await secondResponse.json();

    expect(first.items).toHaveLength(3);
    expect(first.nextCursor).toBe("3");
    expect(second.items).toHaveLength(1);
    expect(second.items[0].catalogItemId).not.toBe(first.items[0].catalogItemId);
    expect(second.nextCursor).toBeNull();
  });
});
;
