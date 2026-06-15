import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type postgres from "postgres";
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
import {
  assignTagToServer,
  upsertTag
} from "../apps/api/src/services/curation-catalog";
import { createManualServer } from "../apps/api/src/services/manual-server";

const describeWithDatabase = process.env.DATABASE_URL ? describe : describe.skip;

const searchServer = {
  name: "io.example.search-postgres",
  title: "Postgres Search",
  description: "Searchable database MCP server",
  version: "1.0.0",
  packages: [
    {
      registryType: "npm",
      identifier: "@example/postgres-search-mcp",
      version: "1.0.0"
    }
  ]
};

const otherServer = {
  name: "io.example.filesystem",
  title: "Filesystem",
  description: "Local file MCP server",
  version: "1.0.0"
};

describeWithDatabase("search API", () => {
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

    await createManualServer(db, searchServer);
    await createManualServer(db, otherServer);
    await upsertTag(db, {
      slug: "database",
      name: "Database"
    });
    await assignTagToServer(db, {
      serverName: searchServer.name,
      tagSlug: "database"
    });
  });

  afterAll(async () => {
    await queryClient?.end();
  });

  it("returns an empty result for an empty query", async () => {
    const app = createApp({ db });

    const response = await app.request("/v0.1/search");
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.servers).toEqual([]);
    expect(result.metadata.count).toBe(0);
  });

  it("finds servers by name, package identifier, and tag", async () => {
    const app = createApp({ db });

    const nameResponse = await app.request("/v0.1/search?q=postgres");
    const nameResult = await nameResponse.json();

    expect(nameResponse.status).toBe(200);
    expect(nameResult.servers[0].server.name).toBe(searchServer.name);
    expect(nameResult.servers[0].search.matchedFields).toContain("name");

    const packageResponse = await app.request("/v0.1/search?q=postgres-search-mcp");
    const packageResult = await packageResponse.json();

    expect(packageResponse.status).toBe(200);
    expect(packageResult.servers[0].server.name).toBe(searchServer.name);
    expect(packageResult.servers[0].search.matchedFields).toContain("package");

    const tagResponse = await app.request("/v0.1/search?q=database");
    const tagResult = await tagResponse.json();

    expect(tagResponse.status).toBe(200);
    expect(tagResult.servers[0].server.name).toBe(searchServer.name);
    expect(tagResult.servers[0].search.matchedFields).toContain("tag");
  });
});
