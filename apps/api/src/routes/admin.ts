import { Hono } from "hono";
import { z } from "zod";
import { adminAuth } from "../middleware/admin-auth";
import type { Database } from "../db/client";
import { exportBackup, importBackup } from "../services/backup";
import {
  assignTagToServer,
  curationUpdateSchema,
  serverTagInputSchema,
  tagInputSchema,
  updateCuration,
  upsertTag
} from "../services/curation-catalog";
import { createManualServer } from "../services/manual-server";
import { getServerPayloads } from "../services/server-payloads";
import { runSync, syncRequestSchema } from "../services/sync";
import {
  getSource,
  sourceInputSchema,
  sourceUpdateSchema,
  updateSource,
  upsertSource
} from "../services/source-admin";
import { ingestServerRecord } from "../services/server-ingest";
import { manualToolInputSchema, upsertManualTool } from "../services/tools";

const importInputSchema = z
  .object({
    sourceName: z.string().min(1).default("manual"),
    sourceType: z.enum(["official", "subregistry", "manual", "other"]).default("manual"),
    sourceBaseUrl: z.string().min(1).nullable().optional().default(null),
    input: z.unknown(),
    upstreamStatus: z.enum(["active", "deprecated", "deleted"]).default("active")
  })
  .passthrough();

export interface AdminRouteDependencies {
  adminApiKey: string;
  db?: Database;
}

export function createAdminRoutes({ adminApiKey, db }: AdminRouteDependencies) {
  const app = new Hono();

  app.use("*", adminAuth(adminApiKey));

  app.post("/servers", async (c) => {
    if (!db) {
      return c.json(
        {
          error: "Database is not configured",
          code: "database_not_configured",
          details: {}
        },
        503
      );
    }

    const body = await c.req.json();
    const result = await createManualServer(db, body);

    return c.json(result.normalizedJson, 201);
  });

  app.post("/imports", async (c) => {
    if (!db) {
      return c.json(
        {
          error: "Database is not configured",
          code: "database_not_configured",
          details: {}
        },
        503
      );
    }

    const body = importInputSchema.parse(await c.req.json());
    const result = await ingestServerRecord(db, body);

    return c.json(result.normalizedJson, 201);
  });

  app.get("/backup", async (c) => {
    if (!db) {
      return c.json(
        {
          error: "Database is not configured",
          code: "database_not_configured",
          details: {}
        },
        503
      );
    }

    return c.json(await exportBackup(db));
  });

  app.post("/backup/import", async (c) => {
    if (!db) {
      return c.json(
        {
          error: "Database is not configured",
          code: "database_not_configured",
          details: {}
        },
        503
      );
    }

    const body = await c.req.json();
    return c.json(await importBackup(db, body));
  });

  app.patch("/curations", async (c) => {
    if (!db) {
      return c.json(
        {
          error: "Database is not configured",
          code: "database_not_configured",
          details: {}
        },
        503
      );
    }

    const body = curationUpdateSchema.parse(await c.req.json());
    const result = await updateCuration(db, body);

    if (!result) {
      return c.json(
        {
          error: "Curation target not found",
          code: "curation_target_not_found",
          details: {}
        },
        404
      );
    }

    return c.json({
      curation: result
    });
  });

  app.post("/tags", async (c) => {
    if (!db) {
      return c.json(
        {
          error: "Database is not configured",
          code: "database_not_configured",
          details: {}
        },
        503
      );
    }

    const body = tagInputSchema.parse(await c.req.json());
    const tag = await upsertTag(db, body);

    return c.json({ tag }, 201);
  });

  app.post("/server-tags", async (c) => {
    if (!db) {
      return c.json(
        {
          error: "Database is not configured",
          code: "database_not_configured",
          details: {}
        },
        503
      );
    }

    const body = serverTagInputSchema.parse(await c.req.json());
    const assigned = await assignTagToServer(db, body);

    if (!assigned) {
      return c.json(
        {
          error: "Server or tag not found",
          code: "server_or_tag_not_found",
          details: {}
        },
        404
      );
    }

    return c.json({
      assigned: true
    });
  });

  app.put("/servers/:name/versions/:version/tools/:toolName", async (c) => {
    if (!db) {
      return c.json(
        {
          error: "Database is not configured",
          code: "database_not_configured",
          details: {}
        },
        503
      );
    }

    const body = manualToolInputSchema.parse(await c.req.json());
    const result = await upsertManualTool(
      db,
      c.req.param("name"),
      c.req.param("version"),
      c.req.param("toolName"),
      body
    );

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

  app.get("/servers/:name/versions/:version/payloads", async (c) => {
    if (!db) {
      return c.json(
        {
          error: "Database is not configured",
          code: "database_not_configured",
          details: {}
        },
        503
      );
    }

    const result = await getServerPayloads(
      db,
      c.req.param("name"),
      c.req.param("version")
    );

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

  app.post("/sources", async (c) => {
    if (!db) {
      return c.json(
        {
          error: "Database is not configured",
          code: "database_not_configured",
          details: {}
        },
        503
      );
    }

    const body = sourceInputSchema.parse(await c.req.json());
    const source = await upsertSource(db, body);

    return c.json({ source }, 201);
  });

  app.patch("/sources/:sourceId", async (c) => {
    if (!db) {
      return c.json(
        {
          error: "Database is not configured",
          code: "database_not_configured",
          details: {}
        },
        503
      );
    }

    const sourceId = Number(c.req.param("sourceId"));

    if (!Number.isInteger(sourceId) || sourceId <= 0) {
      return c.json(
        {
          error: "Invalid source id",
          code: "invalid_source_id",
          details: {}
        },
        400
      );
    }

    const body = sourceUpdateSchema.parse(await c.req.json());
    const source = await updateSource(db, sourceId, body);

    if (!source) {
      return c.json(
        {
          error: "Source not found",
          code: "source_not_found",
          details: {}
        },
        404
      );
    }

    return c.json({ source });
  });

  app.post("/sources/:sourceId/sync", async (c) => {
    if (!db) {
      return c.json(
        {
          error: "Database is not configured",
          code: "database_not_configured",
          details: {}
        },
        503
      );
    }

    const sourceId = Number(c.req.param("sourceId"));

    if (!Number.isInteger(sourceId) || sourceId <= 0) {
      return c.json(
        {
          error: "Invalid source id",
          code: "invalid_source_id",
          details: {}
        },
        400
      );
    }

    const source = await getSource(db, sourceId);

    if (!source) {
      return c.json(
        {
          error: "Source not found",
          code: "source_not_found",
          details: {}
        },
        404
      );
    }

    if (!source.baseUrl) {
      return c.json(
        {
          error: "Source does not have a sync base URL",
          code: "source_not_syncable",
          details: {}
        },
        400
      );
    }

    const body = syncRequestSchema
      .omit({ sourceName: true, baseUrl: true })
      .parse(await c.req.json());
    const result = await runSync(db, {
      ...body,
      sourceName: source.name,
      baseUrl: source.baseUrl
    });

    return c.json({
      sync: result
    });
  });

  app.post("/sync", async (c) => {
    if (!db) {
      return c.json(
        {
          error: "Database is not configured",
          code: "database_not_configured",
          details: {}
        },
        503
      );
    }

    const body = syncRequestSchema.parse(await c.req.json());
    const result = await runSync(db, body);

    return c.json({
      sync: result
    });
  });

  return app;
}
