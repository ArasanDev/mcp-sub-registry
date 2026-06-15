import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { Hono } from "hono";
import type { Database } from "./db/client";
import { openApiDocument } from "./openapi";
import { createAdminRoutes } from "./routes/admin";
import { healthRoutes } from "./routes/health";
import { createRegistryRoutes } from "./routes/registry";

export interface AppDependencies {
  adminApiKey?: string;
  db?: Database;
}

const builtUiRoot = "apps/web/dist";

async function fileResponse(path: string, contentType: string) {
  try {
    return new Response(await readFile(path), {
      headers: {
        "Content-Type": contentType
      }
    });
  } catch (error) {
    return new Response("Not found", { status: 404 });
  }
}

async function webIndexResponse() {
  const builtIndex = `${builtUiRoot}/index.html`;

  return fileResponse(builtIndex, "text/html; charset=utf-8");
}

export function createApp(dependencies: AppDependencies = {}) {
  const app = new Hono();

  app.onError((error, c) => {
    if (error.name === "ZodError" || error instanceof SyntaxError) {
      return c.json(
        {
          error: "Invalid request",
          code: "invalid_request",
          details: {
            message: error.message
          }
        },
        400
      );
    }

    return c.json(
      {
        error: "Internal server error",
        code: "internal_server_error",
        details: {}
      },
      500
    );
  });

  app.notFound((c) =>
    c.json(
      {
        error: "Not found",
        code: "not_found",
        details: {}
      },
      404
    )
  );

  app.get("/", () => webIndexResponse());
  app.get("/assets/*", (c) => {
    const assetPath = `${builtUiRoot}/${c.req.path.replace("/assets/", "assets/")}`;

    if (!existsSync(assetPath)) {
      return c.json(
        {
          error: "UI asset not found",
          code: "ui_asset_not_found",
          details: {}
        },
        404
      );
    }

    const contentType = assetPath.endsWith(".css")
      ? "text/css; charset=utf-8"
      : assetPath.endsWith(".js") || assetPath.endsWith(".mjs")
        ? "text/javascript; charset=utf-8"
        : "application/octet-stream";

    return fileResponse(assetPath, contentType);
  });
  app.route("/", healthRoutes);
  app.get("/openapi.json", (c) => c.json(openApiDocument));
  app.route("/v0.1", createRegistryRoutes({ db: dependencies.db }));

  if (dependencies.adminApiKey) {
    app.route(
      "/admin",
      createAdminRoutes({
        adminApiKey: dependencies.adminApiKey,
        db: dependencies.db
      })
    );
  }

  return app;
}

export type App = ReturnType<typeof createApp>;
