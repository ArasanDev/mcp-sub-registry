import { describe, expect, it } from "vitest";
import { createApp } from "../apps/api/src/app";

describe("API hardening", () => {
  it("returns JSON for unknown routes", async () => {
    const app = createApp();

    const response = await app.request("/missing");
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({
      error: "Not found",
      code: "not_found",
      details: {}
    });
  });

  it("returns JSON for validation errors", async () => {
    const app = createApp({ adminApiKey: "secret", db: {} as never });

    const response = await app.request("/admin/servers", {
      method: "POST",
      headers: {
        Authorization: "Bearer secret"
      },
      body: "{"
    });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.code).toBe("invalid_request");
  });

  it("returns OpenAPI JSON", async () => {
    const app = createApp();

    const response = await app.request("/openapi.json");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.openapi).toBe("3.1.0");
    expect(body.paths["/v0.1/servers"]).toBeTruthy();
    expect(body.paths["/admin/sync"]).toBeTruthy();
  });
});
