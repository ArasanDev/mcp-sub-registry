import { Hono } from "hono";
import type { Database } from "../db/client";
import { getCatalog, listTags } from "../services/curation-catalog";
import { getGatewayCatalog, getGatewayCatalogItem } from "../services/gateway-catalog";
import { getServer, listServers, listServerVersions } from "../services/registry-read";
import { searchServers } from "../services/search";
import { listSources } from "../services/source-admin";
import { listServerTools } from "../services/tools";

export interface RegistryRouteDependencies {
  db?: Database;
}

function databaseUnavailable() {
  return {
    error: "Database is not configured",
    code: "database_not_configured",
    details: {}
  };
}

export function createRegistryRoutes({ db }: RegistryRouteDependencies) {
  const app = new Hono();

  app.get("/catalog", async (c) => {
    if (!db) {
      return c.json(databaseUnavailable(), 503);
    }

    const result = await getCatalog(db, {
      tag: c.req.query("tag"),
      featured: c.req.query("featured") === "true" ? true : null
    });

    return c.json(result);
  });

  app.get("/gateway/catalog", async (c) => {
    if (!db) {
      return c.json(databaseUnavailable(), 503);
    }

    const result = await getGatewayCatalog(db, {
      limit: Number(c.req.query("limit")),
      cursor: c.req.query("cursor")
    });

    return c.json(result);
  });

  app.get("/gateway/catalog/:catalogItemId", async (c) => {
    if (!db) {
      return c.json(databaseUnavailable(), 503);
    }

    const item = await getGatewayCatalogItem(db, c.req.param("catalogItemId"));
    if (!item) {
      return c.json({ error: "not_found" }, 404);
    }

    return c.json(item);
  });

  app.get("/health", (c) => c.json({ status: "healthy" }));

  app.get("/ping", (c) => c.json({ pong: true }));

  app.get("/version", (c) =>
    c.json({
      name: "mcp-sub-registry",
      apiVersion: "v0.1",
      build: {
        commit: process.env.GIT_COMMIT ?? null,
        timestamp: process.env.BUILD_TIMESTAMP ?? null
      }
    })
  );

  app.get("/search", async (c) => {
    if (!db) {
      return c.json(databaseUnavailable(), 503);
    }

    const result = await searchServers(db, {
      query: c.req.query("q"),
      limit: Number(c.req.query("limit"))
    });

    return c.json(result);
  });

  app.get("/tags", async (c) => {
    if (!db) {
      return c.json(databaseUnavailable(), 503);
    }

    const tags = await listTags(db);

    return c.json({
      tags,
      metadata: {
        count: tags.length
      }
    });
  });

  app.get("/sources", async (c) => {
    if (!db) {
      return c.json(databaseUnavailable(), 503);
    }

    const sources = await listSources(db);

    return c.json({
      sources,
      metadata: {
        count: sources.length
      }
    });
  });

  app.get("/servers", async (c) => {
    if (!db) {
      return c.json(databaseUnavailable(), 503);
    }

    const limit = Number(c.req.query("limit"));
    const result = await listServers(db, {
      limit,
      cursor: c.req.query("cursor"),
      version: c.req.query("version"),
      search: c.req.query("search"),
      updatedSince: c.req.query("updated_since"),
      includeDeleted: c.req.query("include_deleted") === "true"
    });

    return c.json(result);
  });

  app.get("/servers/:name", async (c) => {
    if (!db) {
      return c.json(databaseUnavailable(), 503);
    }

    const result = await getServer(db, c.req.param("name"), c.req.query("version"));

    if (!result) {
      return c.json(
        {
          error: "Server not found",
          code: "server_not_found",
          details: {}
        },
        404
      );
    }

    return c.json(result);
  });

  app.get("/servers/:name/versions", async (c) => {
    if (!db) {
      return c.json(databaseUnavailable(), 503);
    }

    const versions = await listServerVersions(db, c.req.param("name"));

    if (!versions) {
      return c.json(
        {
          error: "Server not found",
          code: "server_not_found",
          details: {}
        },
        404
      );
    }

    return c.json({
      versions,
      metadata: {
        count: versions.length
      }
    });
  });

  app.get("/servers/:name/tools", async (c) => {
    if (!db) {
      return c.json(databaseUnavailable(), 503);
    }

    const result = await listServerTools(
      db,
      c.req.param("name"),
      c.req.query("version")
    );

    if (!result) {
      return c.json(
        {
          error: "Server not found",
          code: "server_not_found",
          details: {}
        },
        404
      );
    }

    return c.json(result);
  });

  app.get("/servers/:name/versions/:version", async (c) => {
    if (!db) {
      return c.json(databaseUnavailable(), 503);
    }

    const result = await getServer(db, c.req.param("name"), c.req.param("version"));

    if (!result) {
      return c.json(
        {
          error: "Server version not found",
          code: "server_version_not_found",
          details: {}
        },
        404
      );
    }

    return c.json(result);
  });

  return app;
}
