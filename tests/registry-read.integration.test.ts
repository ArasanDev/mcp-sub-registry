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

const describeWithDatabase = process.env.DATABASE_URL ? describe : describe.skip;

const alphaV1 = {
  name: "io.example.alpha",
  title: "Alpha",
  description: "Alpha server",
  version: "1.0.0"
};

const alphaV2 = {
  ...alphaV1,
  description: "Alpha server v2",
  version: "2.0.0"
};

const betaV1 = {
  name: "io.example.beta",
  title: "Beta",
  description: "Beta server",
  version: "1.0.0"
};

const deletedGamma = {
  name: "io.example.gamma",
  title: "Gamma",
  description: "Deleted gamma server",
  version: "1.0.0"
};

describeWithDatabase("registry read API", () => {
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

    await createManualServer(db, alphaV1);
    await createManualServer(db, betaV1);
    await createManualServer(db, alphaV2);
    await createManualServer(db, deletedGamma);

    const storedDeletedServer = await db.query.servers.findFirst({
      where: eq(servers.name, deletedGamma.name)
    });

    await db
      .update(servers)
      .set({ status: "removed_upstream" })
      .where(eq(servers.name, deletedGamma.name));
    await db
      .update(serverVersions)
      .set({
        status: "removed_upstream",
        upstreamStatus: "deleted"
      })
      .where(eq(serverVersions.serverId, storedDeletedServer!.id));
  });

  afterAll(async () => {
    await queryClient?.end();
  });

  it("lists server records with cursor pagination", async () => {
    const app = createApp({ db });

    const firstResponse = await app.request("/v0.1/servers?limit=1");
    expect(firstResponse.status).toBe(200);

    const firstPage = await firstResponse.json();
    expect(firstPage.servers).toHaveLength(1);
    expect(firstPage.metadata.count).toBe(1);
    expect(firstPage.metadata.nextCursor).toBeTruthy();

    const secondResponse = await app.request(
      `/v0.1/servers?limit=1&cursor=${firstPage.metadata.nextCursor}`
    );
    const secondPage = await secondResponse.json();

    expect(secondResponse.status).toBe(200);
    expect(secondPage.servers).toHaveLength(1);
    expect(secondPage.servers[0].server.name).not.toBe(
      firstPage.servers[0].server.name
    );
  });

  it("lists only latest records when requested", async () => {
    const app = createApp({ db });

    const response = await app.request("/v0.1/servers?version=latest");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(
      body.servers.map((entry: { server: { name: string } }) => entry.server.name)
    ).toEqual(
      expect.arrayContaining(["io.example.alpha", "io.example.beta"])
    );
    expect(
      body.servers.some(
        (entry: { server: { name: string } }) => entry.server.name === deletedGamma.name
      )
    ).toBe(false);
    expect(
      body.servers.every(
        (entry: { _meta: Record<string, { isLatest?: boolean }> }) =>
          entry._meta["com.mcp-gateway.registry/server-version"].isLatest === true
      )
    ).toBe(true);
  });

  it("filters list results by explicit version", async () => {
    const app = createApp({ db });

    const response = await app.request("/v0.1/servers?version=1.0.0");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(
      body.servers.every(
        (entry: { server: { version: string } }) => entry.server.version === "1.0.0"
      )
    ).toBe(true);
    expect(
      body.servers.map(
        (entry: { server: { name: string; version: string } }) =>
          `${entry.server.name}@${entry.server.version}`
      )
    ).toEqual(
      expect.arrayContaining([
        "io.example.alpha@1.0.0",
        "io.example.beta@1.0.0"
      ])
    );
  });

  it("includes deleted rows only when requested", async () => {
    const app = createApp({ db });

    const defaultResponse = await app.request("/v0.1/servers?version=latest");
    const defaultBody = await defaultResponse.json();

    expect(defaultResponse.status).toBe(200);
    expect(
      defaultBody.servers.some(
        (entry: { server: { name: string } }) => entry.server.name === deletedGamma.name
      )
    ).toBe(false);

    const deletedResponse = await app.request(
      "/v0.1/servers?version=latest&include_deleted=true"
    );
    const deletedBody = await deletedResponse.json();
    const deletedEntry = deletedBody.servers.find(
      (entry: { server: { name: string } }) => entry.server.name === deletedGamma.name
    )!;

    expect(deletedResponse.status).toBe(200);
    expect(deletedEntry).toBeTruthy();
    expect(
      deletedEntry._meta["com.mcp-gateway.registry/server-version"]
    ).toMatchObject({
      status: "deleted",
      isLatest: true
    });
  });

  it("filters list results by search and updated_since", async () => {
    const app = createApp({ db });

    const searchResponse = await app.request("/v0.1/servers?search=beta");
    const searchBody = await searchResponse.json();

    expect(searchResponse.status).toBe(200);
    expect(searchBody.servers).toHaveLength(1);
    expect(searchBody.servers[0].server.name).toBe("io.example.beta");

    const futureResponse = await app.request(
      `/v0.1/servers?updated_since=${encodeURIComponent("2999-01-01T00:00:00.000Z")}`
    );
    const futureBody = await futureResponse.json();

    expect(futureResponse.status).toBe(200);
    expect(futureBody.servers).toHaveLength(0);
  });

  it("adds registry-owned enrichment metadata", async () => {
    const app = createApp({ db });

    const response = await app.request("/v0.1/servers/io.example.alpha");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body._meta["com.mcp-gateway.registry/server"]).toMatchObject({
      sourceNames: ["manual"],
      isOfficial: false
    });
    expect(body._meta["com.mcp-gateway.registry/server-version"]).toMatchObject({
      source: "manual",
      status: "active",
      isLatest: true
    });
    expect(body._meta["com.mcp-gateway.registry/readiness"]).toMatchObject({
      status: "unknown",
      installType: "unknown"
    });
  });

  it("returns latest, listed versions, and a specific version", async () => {
    const app = createApp({ db });

    const latestResponse = await app.request("/v0.1/servers/io.example.alpha");
    const latest = await latestResponse.json();

    expect(latestResponse.status).toBe(200);
    expect(latest.server.version).toBe("2.0.0");

    const versionsResponse = await app.request(
      "/v0.1/servers/io.example.alpha/versions"
    );
    const versions = await versionsResponse.json();

    expect(versionsResponse.status).toBe(200);
    expect(versions.versions.map((entry: { version: string }) => entry.version)).toEqual([
      "2.0.0",
      "1.0.0"
    ]);

    const v1Response = await app.request(
      "/v0.1/servers/io.example.alpha/versions/1.0.0"
    );
    const v1 = await v1Response.json();

    expect(v1Response.status).toBe(200);
    expect(v1.server.version).toBe("1.0.0");
  });

  it("returns 404 for missing servers", async () => {
    const app = createApp({ db });

    const response = await app.request("/v0.1/servers/io.example.missing");

    expect(response.status).toBe(404);
  });

  it("serves versioned utility endpoints", async () => {
    const app = createApp({ db });

    const health = await app.request("/v0.1/health");
    const ping = await app.request("/v0.1/ping");
    const version = await app.request("/v0.1/version");

    expect(health.status).toBe(200);
    expect(await health.json()).toEqual({ status: "healthy" });
    expect(ping.status).toBe(200);
    expect(await ping.json()).toEqual({ pong: true });
    expect(version.status).toBe(200);
    expect(await version.json()).toMatchObject({
      name: "mcp-sub-registry",
      apiVersion: "v0.1"
    });
  });

  it("lists tags, sources, and server tools", async () => {
    const app = createApp({ adminApiKey: "secret", db });

    const tagResponse = await app.request("/admin/tags", {
      method: "POST",
      headers: {
        Authorization: "Bearer secret"
      },
      body: JSON.stringify({
        slug: "filesystem",
        name: "Filesystem"
      })
    });
    expect(tagResponse.status).toBe(201);

    const sourceResponse = await app.request("/admin/sources", {
      method: "POST",
      headers: {
        Authorization: "Bearer secret"
      },
      body: JSON.stringify({
        name: "partner",
        type: "subregistry",
        baseUrl: "https://registry.partner.example"
      })
    });
    expect(sourceResponse.status).toBe(201);
    const sourceBody = await sourceResponse.json();

    const patchResponse = await app.request(
      `/admin/sources/${sourceBody.source.id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: "Bearer secret"
        },
        body: JSON.stringify({
          name: "partner-prod",
          type: "other",
          baseUrl: "https://registry.partner-prod.example",
          enabled: false
        })
      }
    );
    expect(patchResponse.status).toBe(200);
    await db.insert(syncRuns).values([
      {
        sourceId: sourceBody.source.id,
        mode: "full_etl",
        status: "succeeded",
        startedAt: new Date("2026-05-01T00:00:00.000Z"),
        finishedAt: new Date("2026-05-01T00:01:00.000Z"),
        serversSeen: 1,
        versionsSeen: 1
      },
      {
        sourceId: sourceBody.source.id,
        mode: "incremental",
        status: "failed",
        startedAt: new Date("2026-05-02T00:00:00.000Z"),
        finishedAt: new Date("2026-05-02T00:00:30.000Z"),
        serversSeen: 0,
        versionsSeen: 0,
        error: "upstream unavailable"
      }
    ]);

    const storedServer = await db.query.servers.findFirst({
      where: (table, { eq }) => eq(table.name, alphaV2.name)
    });
    const storedVersion = await db.query.serverVersions.findFirst({
      where: (table, { and, eq }) =>
        and(eq(table.serverId, storedServer!.id), eq(table.version, "2.0.0"))
    });
    await db.insert(serverTools).values({
      serverVersionId: storedVersion!.id,
      name: "read_file",
      description: "Read a file",
      inputSchema: {
        type: "object"
      },
      source: "manual"
    });

    const tagsResponse = await app.request("/v0.1/tags");
    const tagsBody = await tagsResponse.json();
    expect(tagsResponse.status).toBe(200);
    expect(tagsBody.tags.map((tag: { slug: string }) => tag.slug)).toContain(
      "filesystem"
    );

    const sourcesResponse = await app.request("/v0.1/sources");
    const sourcesBody = await sourcesResponse.json();
    expect(sourcesResponse.status).toBe(200);
    expect(sourcesBody.sources.map((source: { name: string }) => source.name)).toEqual(
      expect.arrayContaining(["manual", "partner-prod"])
    );
    const partnerSource = sourcesBody.sources.find(
      (source: { id: number }) => source.id === sourceBody.source.id
    );
    expect(partnerSource).toMatchObject({
      name: "partner-prod",
      type: "other",
      baseUrl: "https://registry.partner-prod.example",
      enabled: false,
      lastSyncRun: {
        mode: "incremental",
        status: "failed",
        serversSeen: 0,
        versionsSeen: 0,
        error: "upstream unavailable"
      }
    });
    expect(partnerSource.recentSyncRuns.map((run: { mode: string }) => run.mode)).toEqual([
      "incremental",
      "full_etl"
    ]);

    const toolsResponse = await app.request("/v0.1/servers/io.example.alpha/tools");
    const toolsBody = await toolsResponse.json();
    expect(toolsResponse.status).toBe(200);
    expect(toolsBody).toMatchObject({
      serverName: "io.example.alpha",
      version: "2.0.0",
      metadata: {
        count: 1
      }
    });
    expect(toolsBody.tools[0]).toMatchObject({
      name: "read_file",
      source: "manual"
    });
  });
});
