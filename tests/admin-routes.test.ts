import { describe, expect, it } from "vitest";
import { createApp } from "../apps/api/src/app";

describe("admin routes", () => {
  it("rejects missing admin auth", async () => {
    const app = createApp({ adminApiKey: "secret" });

    const response = await app.request("/admin/servers", {
      method: "POST",
      body: JSON.stringify({})
    });

    expect(response.status).toBe(401);
  });

  it("rejects invalid admin auth", async () => {
    const app = createApp({ adminApiKey: "secret" });

    const response = await app.request("/admin/servers", {
      method: "POST",
      headers: {
        Authorization: "Bearer wrong"
      },
      body: JSON.stringify({})
    });

    expect(response.status).toBe(401);
  });

  it("requires a database for manual server creation", async () => {
    const app = createApp({ adminApiKey: "secret" });

    const response = await app.request("/admin/servers", {
      method: "POST",
      headers: {
        Authorization: "Bearer secret"
      },
      body: JSON.stringify({})
    });

    expect(response.status).toBe(503);
  });

  it("rejects missing admin auth for import creation", async () => {
    const app = createApp({ adminApiKey: "secret" });

    const response = await app.request("/admin/imports", {
      method: "POST",
      body: JSON.stringify({
        input: {}
      })
    });

    expect(response.status).toBe(401);
  });

  it("requires a database for import creation", async () => {
    const app = createApp({ adminApiKey: "secret" });

    const response = await app.request("/admin/imports", {
      method: "POST",
      headers: {
        Authorization: "Bearer secret"
      },
      body: JSON.stringify({
        sourceName: "modelcontextprotocol",
        sourceType: "official",
        input: {}
      })
    });

    expect(response.status).toBe(503);
  });

  it("rejects missing admin auth for curation updates", async () => {
    const app = createApp({ adminApiKey: "secret" });

    const response = await app.request("/admin/curations", {
      method: "PATCH",
      body: JSON.stringify({})
    });

    expect(response.status).toBe(401);
  });

  it("rejects missing admin auth for tag creation", async () => {
    const app = createApp({ adminApiKey: "secret" });

    const response = await app.request("/admin/tags", {
      method: "POST",
      body: JSON.stringify({})
    });

    expect(response.status).toBe(401);
  });

  it("rejects missing admin auth for sync", async () => {
    const app = createApp({ adminApiKey: "secret" });

    const response = await app.request("/admin/sync", {
      method: "POST",
      body: JSON.stringify({})
    });

    expect(response.status).toBe(401);
  });

  it("rejects missing admin auth for source creation", async () => {
    const app = createApp({ adminApiKey: "secret" });

    const response = await app.request("/admin/sources", {
      method: "POST",
      body: JSON.stringify({})
    });

    expect(response.status).toBe(401);
  });

  it("rejects missing admin auth for backup export", async () => {
    const app = createApp({ adminApiKey: "secret" });

    const response = await app.request("/admin/backup");

    expect(response.status).toBe(401);
  });

  it("rejects missing admin auth for backup import", async () => {
    const app = createApp({ adminApiKey: "secret" });

    const response = await app.request("/admin/backup/import", {
      method: "POST",
      body: JSON.stringify({})
    });

    expect(response.status).toBe(401);
  });

  it("rejects missing admin auth for payload inspection", async () => {
    const app = createApp({ adminApiKey: "secret" });

    const response = await app.request("/admin/servers/example/versions/1.0.0/payloads");

    expect(response.status).toBe(401);
  });

  it("requires a database for payload inspection", async () => {
    const app = createApp({ adminApiKey: "secret" });

    const response = await app.request("/admin/servers/example/versions/1.0.0/payloads", {
      headers: {
        Authorization: "Bearer secret"
      }
    });

    expect(response.status).toBe(503);
  });

  it("rejects missing admin auth for source updates", async () => {
    const app = createApp({ adminApiKey: "secret" });

    const response = await app.request("/admin/sources/1", {
      method: "PATCH",
      body: JSON.stringify({})
    });

    expect(response.status).toBe(401);
  });

  it("requires a database for sync", async () => {
    const app = createApp({ adminApiKey: "secret" });

    const response = await app.request("/admin/sync", {
      method: "POST",
      headers: {
        Authorization: "Bearer secret"
      },
      body: JSON.stringify({})
    });

    expect(response.status).toBe(503);
  });

  it("requires a database for source creation", async () => {
    const app = createApp({ adminApiKey: "secret" });

    const response = await app.request("/admin/sources", {
      method: "POST",
      headers: {
        Authorization: "Bearer secret"
      },
      body: JSON.stringify({})
    });

    expect(response.status).toBe(503);
  });

  it("requires a database for source updates", async () => {
    const app = createApp({ adminApiKey: "secret" });

    const response = await app.request("/admin/sources/1", {
      method: "PATCH",
      headers: {
        Authorization: "Bearer secret"
      },
      body: JSON.stringify({
        enabled: false
      })
    });

    expect(response.status).toBe(503);
  });

  it("requires a database for backup export", async () => {
    const app = createApp({ adminApiKey: "secret" });

    const response = await app.request("/admin/backup", {
      headers: {
        Authorization: "Bearer secret"
      }
    });

    expect(response.status).toBe(503);
  });

  it("requires a database for backup import", async () => {
    const app = createApp({ adminApiKey: "secret" });

    const response = await app.request("/admin/backup/import", {
      method: "POST",
      headers: {
        Authorization: "Bearer secret"
      },
      body: JSON.stringify({})
    });

    expect(response.status).toBe(503);
  });
});
