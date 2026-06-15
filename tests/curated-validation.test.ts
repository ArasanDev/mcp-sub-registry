import { describe, expect, it } from "vitest";
import { loadCuratedSeed } from "../apps/api/src/services/curated-seed";
import { validateCuratedSeed } from "../apps/api/src/services/curated-validation";

describe("curated seed validation", () => {
  it("validates the default curated seed with actionable warnings", async () => {
    const seed = await loadCuratedSeed();
    const result = validateCuratedSeed(seed);
    // Derive counts from the seed so the test survives catalog growth.
    // Invariant: every default-curated record is approved, public, and remote-only.
    const count = seed.servers.length;

    expect(result.valid).toBe(true);
    expect(result.summary).toMatchObject({
      servers: count,
      approvedPublic: count,
      remoteServers: count,
      packageServers: 0
    });
    // All catalog entries are verified; audit on 2026-06-15 cleared the sentry warning.
    expect(result.warnings).toEqual([]);
  });

  it("rejects approved public records without verification", () => {
    const result = validateCuratedSeed({
      source: {
        name: "test",
        type: "manual",
        baseUrl: null,
        enabled: true
      },
      servers: [
        {
          server: {
            name: "io.example/missing-verification",
            description: "Missing verification",
            version: "1.0.0",
            remotes: [{ type: "streamable-http", url: "https://example.com/mcp" }]
          },
          curation: {
            status: "approved",
            visibility: "public"
          },
          tags: ["test"]
        }
      ]
    });

    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain("approved public records must include");
  });
});
