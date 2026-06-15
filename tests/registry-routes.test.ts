import { describe, expect, it } from "vitest";
import { createApp } from "../apps/api/src/app";

describe("registry routes", () => {
  it("requires a database for server listing", async () => {
    const app = createApp();

    const response = await app.request("/v0.1/servers");

    expect(response.status).toBe(503);
  });

  it("requires a database for server detail", async () => {
    const app = createApp();

    const response = await app.request("/v0.1/servers/io.example.missing");

    expect(response.status).toBe(503);
  });

  it("requires a database for search", async () => {
    const app = createApp();

    const response = await app.request("/v0.1/search?q=database");

    expect(response.status).toBe(503);
  });
});
