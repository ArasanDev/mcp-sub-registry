import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type postgres from "postgres";
import { createApp } from "../apps/api/src/app";
import { curationMetaKey } from "../apps/api/src/services/curation-catalog";
import { gatewayCompatibilityMetaKey } from "../apps/api/src/services/gateway-compatibility";
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

const describeWithDatabase = process.env.DATABASE_URL ? describe : describe.skip;

const approvedServer = {
  name: "io.example.catalog-approved",
  title: "Catalog Approved",
  description: "Approved catalog server",
  version: "1.0.0",
  remotes: [
    {
      type: "streamable-http",
      url: "https://catalog.example.com/mcp"
    }
  ]
};

const pendingServer = {
  name: "io.example.catalog-pending",
  title: "Catalog Pending",
  description: "Pending catalog server",
  version: "1.0.0"
};

describeWithDatabase("curation catalog", () => {
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
    await createManualServer(db, pendingServer);
  });

  afterAll(async () => {
    await queryClient?.end();
  });

  it("updates curation, assigns tags, and returns injected catalog metadata", async () => {
    const app = createApp({ adminApiKey: "secret", db });

    const tagResponse = await app.request("/admin/tags", {
      method: "POST",
      headers: {
        Authorization: "Bearer secret"
      },
      body: JSON.stringify({
        slug: "database",
        name: "Database"
      })
    });
    expect(tagResponse.status).toBe(201);

    const assignResponse = await app.request("/admin/server-tags", {
      method: "POST",
      headers: {
        Authorization: "Bearer secret"
      },
      body: JSON.stringify({
        serverName: approvedServer.name,
        tagSlug: "database"
      })
    });
    expect(assignResponse.status).toBe(200);

    const curationResponse = await app.request("/admin/curations", {
      method: "PATCH",
      headers: {
        Authorization: "Bearer secret"
      },
      body: JSON.stringify({
        serverName: approvedServer.name,
        status: "approved",
        visibility: "public",
        featured: true,
        notes: "Verified by registry owner"
      })
    });
    expect(curationResponse.status).toBe(200);

    const catalogResponse = await app.request("/v0.1/catalog?tag=database");
    const catalog = await catalogResponse.json();
    const pendingResponse = await app.request(
      `/v0.1/servers/${encodeURIComponent(pendingServer.name)}`
    );
    const pending = await pendingResponse.json();

    expect(catalogResponse.status).toBe(200);
    expect(catalog.servers).toHaveLength(1);
    expect(catalog.servers[0].server.name).toBe(approvedServer.name);
    expect(catalog.servers[0]._meta[curationMetaKey]).toMatchObject({
      status: "approved",
      visibility: "public",
      featured: true,
      tags: ["database"],
      notes: "Verified by registry owner"
    });
    expect(catalog.servers[0]._meta[gatewayCompatibilityMetaKey]).toMatchObject({
      hosted_gateway: true,
      requires_connector_runtime: false,
      supported_transports: ["streamable-http"]
    });
    expect(catalog.servers[0]._meta["com.mcp-gateway.registry/server"]).toMatchObject({
      sourceNames: ["manual"],
      isOfficial: false,
      tags: ["database"]
    });
    expect(
      catalog.servers[0]._meta["com.mcp-gateway.registry/server-version"]
    ).toMatchObject({
      source: "manual",
      status: "active",
      isLatest: true
    });
    expect(catalog.servers[0]._meta["com.mcp-gateway.registry/readiness"]).toMatchObject({
      status: "remote_only"
    });
    expect(pendingResponse.status).toBe(200);
    expect(pending._meta[curationMetaKey]).toMatchObject({
      status: "pending",
      visibility: "private"
    });
  });

  it("excludes pending private servers from the public catalog", async () => {
    const app = createApp({ db });

    const response = await app.request("/v0.1/catalog");
    const catalog = await response.json();

    expect(response.status).toBe(200);
    expect(catalog.servers).toHaveLength(0);
  });
});
