import { describe, expect, it } from "vitest";
import { createApp } from "../apps/api/src/app";

describe("operator UI", () => {
  it("serves the root console", async () => {
    const app = createApp();

    const response = await app.request("/");
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/html");
    expect(body).toContain('<div id="root"></div>');
    expect(body).toContain("/assets/");
  });

  it("does not serve legacy UI assets", async () => {
    const app = createApp();

    const response = await app.request("/ui/app.css");
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.code).toBe("not_found");
  });
});
