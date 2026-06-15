import { describe, expect, it } from "vitest";
import { createApp } from "../apps/api/src/app";

describe("GET /health", () => {
  it("returns service health", async () => {
    const app = createApp();

    const response = await app.request("/health");

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ status: "ok" });
  });
});
