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
import { applyCuratedSeed, loadCuratedSeed } from "../apps/api/src/services/curated-seed";

const describeWithDatabase = process.env.DATABASE_URL ? describe : describe.skip;

describeWithDatabase("default curated remote seed", () => {
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

  it("seeds the handpicked remote catalog as approved public records", async () => {
    const result = await applyCuratedSeed(db, await loadCuratedSeed());

    expect(result).toMatchObject({
      sourceName: "default-curated-remote",
      servers: 11,
      approved: 11
    });

    const app = createApp({ db });
    const catalogResponse = await app.request("/v0.1/catalog");
    const catalog = await catalogResponse.json();

    expect(catalogResponse.status).toBe(200);
    expect(catalog.metadata.count).toBe(11);
    expect(catalog.servers.every((row: { server: { remotes: unknown[]; packages: unknown[] } }) =>
      row.server.remotes.length === 1 && row.server.packages.length === 0
    )).toBe(true);

    const gatewayResponse = await app.request("/v0.1/gateway/catalog?limit=20");
    const gateway = await gatewayResponse.json();
    const gatewayText = JSON.stringify(gateway);

    expect(gatewayResponse.status).toBe(200);
    expect(gateway.items).toHaveLength(11);
    expect(gateway.items.map((item: { name: string }) => item.name)).toEqual(
      expect.arrayContaining([
        "com.deepwiki/mcp",
        "com.github/mcp",
        "com.slack/mcp",
        "com.notion/mcp",
        "com.cloudflare/mcp",
        "com.sentry/mcp",
        "com.linear/mcp",
        "com.figma/mcp",
        "com.neon/mcp",
        "com.supabase/mcp",
        "com.atlassian/mcp"
      ])
    );
    expect(gateway.items.every((item: { curation: { status: string; visibility: string } }) =>
      item.curation.status === "approved" && item.curation.visibility === "public"
    )).toBe(true);
    expect(
      gateway.items.every(
        (item: {
          gatewayCompatibility: {
            hosted_gateway: boolean;
            requires_connector_runtime: boolean;
            supported_transports: string[];
          };
        }) =>
          item.gatewayCompatibility.hosted_gateway === true &&
          item.gatewayCompatibility.requires_connector_runtime === false &&
          item.gatewayCompatibility.supported_transports.includes("streamable-http")
      )
    ).toBe(true);
    expect(gateway.items.every((item: { remotes: unknown[]; packages: unknown[] }) =>
      item.remotes.length === 1 && item.packages.length === 0
    )).toBe(true);
    expect(gateway.items.every((item: { verification: { status: string; ownership: string } | null }) =>
      item.verification?.status && item.verification?.ownership
    )).toBe(true);
    expect(gatewayText).not.toMatch(/"enabled"/);
    expect(gatewayText).not.toMatch(/runtimeEnabled|approvedForRuntime|secretValue|gatewayPolicy|routingPolicy|sessionId|mcpCallPayload|mcpCallResult/);
  });
});
