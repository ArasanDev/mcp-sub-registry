import { describe, expect, it } from "vitest";
import { loadAdminConfig, loadConfig, loadDatabaseConfig } from "../apps/api/src/config";

describe("loadConfig", () => {
  it("uses development defaults", () => {
    expect(loadConfig({})).toEqual({
      NODE_ENV: "development",
      PORT: 8080
    });
  });

  it("parses a configured port", () => {
    expect(loadConfig({ PORT: "9090", NODE_ENV: "test" })).toEqual({
      NODE_ENV: "test",
      PORT: 9090
    });
  });

  it("rejects invalid ports", () => {
    expect(() => loadConfig({ PORT: "70000" })).toThrow();
  });
});

describe("loadDatabaseConfig", () => {
  it("requires DATABASE_URL", () => {
    expect(() => loadDatabaseConfig({})).toThrow();
  });

  it("loads DATABASE_URL", () => {
    expect(
      loadDatabaseConfig({
        DATABASE_URL:
          "postgres://mcp_registry:mcp_registry@127.0.0.1:5432/mcp_registry"
      })
    ).toEqual({
      DATABASE_URL:
        "postgres://mcp_registry:mcp_registry@127.0.0.1:5432/mcp_registry"
    });
  });
});

describe("loadAdminConfig", () => {
  it("allows short admin keys outside production", () => {
    expect(
      loadAdminConfig({
        NODE_ENV: "development",
        ADMIN_API_KEY: "secret"
      })
    ).toEqual({
      ADMIN_API_KEY: "secret"
    });
  });

  it("rejects short admin keys in production", () => {
    expect(() =>
      loadAdminConfig({
        NODE_ENV: "production",
        ADMIN_API_KEY: "short"
      })
    ).toThrow();
  });
});
