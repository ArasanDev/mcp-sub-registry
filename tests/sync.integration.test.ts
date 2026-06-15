import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type postgres from "postgres";
import { eq } from "drizzle-orm";
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
import { runSync } from "../apps/api/src/services/sync";

const describeWithDatabase = process.env.DATABASE_URL ? describe : describe.skip;

const activeServer = {
  name: "io.example.upstream-active",
  title: "Upstream Active",
  description: "Active upstream server",
  version: "1.0.0",
  packages: [
    {
      registryType: "npm",
      identifier: "@example/upstream-active",
      version: "1.0.0"
    }
  ]
};

const deletedServer = {
  server: {
    name: "io.example.upstream-deleted",
    title: "Upstream Deleted",
    description: "Deleted upstream server",
    version: "1.0.0",
    status: "deleted"
  },
  _meta: {}
};

describeWithDatabase("upstream sync", () => {
  let db: Database;
  let queryClient: postgres.Sql;
  let requestedUrls: string[];

  beforeAll(() => {
    const connection = createDatabaseConnection({
      DATABASE_URL: process.env.DATABASE_URL
    });
    db = connection.db;
    queryClient = connection.queryClient;
  });

  beforeEach(async () => {
    requestedUrls = [];
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

  it("imports upstream records idempotently", async () => {
    const fetchFn = fakeFetch([[activeServer]], requestedUrls);

    const firstResult = await runSync(db, {
      mode: "full_etl",
      sourceName: "official",
      baseUrl: "https://registry.example.test",
      limit: 100,
      maxPages: 10,
      fetchFn
    });

    const secondResult = await runSync(db, {
      mode: "full_etl",
      sourceName: "official",
      baseUrl: "https://registry.example.test",
      limit: 100,
      maxPages: 10,
      fetchFn
    });

    expect(firstResult.serversSeen).toBe(1);
    expect(secondResult.serversSeen).toBe(1);

    const storedServers = await db.select().from(servers);
    const storedVersions = await db.select().from(serverVersions);

    expect(storedServers).toHaveLength(1);
    expect(storedVersions).toHaveLength(1);
    expect(storedVersions[0].rawJson).toEqual(activeServer);
  });

  it("sends incremental params and marks deleted upstream records removed", async () => {
    const fetchFn = fakeFetch([[deletedServer]], requestedUrls);

    await runSync(db, {
      mode: "incremental",
      sourceName: "official",
      baseUrl: "https://registry.example.test",
      updatedSince: "2026-05-01T00:00:00.000Z",
      limit: 100,
      maxPages: 10,
      fetchFn
    });

    expect(requestedUrls[0]).toContain("updated_since=2026-05-01T00%3A00%3A00.000Z");
    expect(requestedUrls[0]).toContain("include_deleted=true");

    const storedServer = await db.query.servers.findFirst({
      where: eq(servers.name, deletedServer.server.name)
    });
    const storedVersion = await db.query.serverVersions.findFirst({
      where: eq(serverVersions.serverId, storedServer!.id)
    });

    expect(storedServer?.status).toBe("removed_upstream");
    expect(storedVersion?.status).toBe("removed_upstream");
    expect(storedVersion?.upstreamStatus).toBe("deleted");
  });

  it("sends latest-only version param", async () => {
    const fetchFn = fakeFetch([[activeServer]], requestedUrls);

    await runSync(db, {
      mode: "latest_only",
      sourceName: "official",
      baseUrl: "https://registry.example.test",
      limit: 100,
      maxPages: 10,
      fetchFn
    });

    expect(requestedUrls[0]).toContain("version=latest");
  });
});

function fakeFetch(pages: unknown[][], requestedUrls: string[]): typeof fetch {
  return (async (input: URL | RequestInfo) => {
    const url = String(input);
    requestedUrls.push(url);
    const page = pages[Math.min(requestedUrls.length - 1, pages.length - 1)] ?? [];

    return new Response(
      JSON.stringify({
        servers: page,
        metadata: {
          count: page.length,
          nextCursor: null
        }
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }) as typeof fetch;
}
