import { describe, expect, it } from "vitest";
import { computeReadiness, versionMetaKey } from "../apps/api/src/services/readiness";
import type { ServerResponse } from "../apps/api/src/schemas/mcp-registry";

function response(server: ServerResponse["server"], status = "active"): ServerResponse {
  return {
    server,
    _meta: {
      [versionMetaKey]: {
        status,
        source: "manual",
        updatedAt: "2026-05-05T00:00:00.000Z",
        isLatest: true
      }
    }
  };
}

describe("computeReadiness", () => {
  it("marks open remote servers as remote_only", () => {
    expect(
      computeReadiness(
        response({
          name: "io.example.remote",
          description: "Remote",
          version: "1.0.0",
          remotes: [{ type: "streamable-http", url: "https://example.com/mcp" }]
        })
      )
    ).toMatchObject({
      status: "remote_only",
      installType: "remote",
      hasRemote: true
    });
  });

  it("detects required secrets", () => {
    expect(
      computeReadiness(
        response({
          name: "io.example.secret",
          description: "Secret",
          version: "1.0.0",
          packages: [
            {
              registryType: "npm",
              identifier: "@example/secret",
              environmentVariables: [
                {
                  name: "API_TOKEN",
                  isRequired: true,
                  isSecret: true
                }
              ]
            }
          ]
        })
      )
    ).toMatchObject({
      status: "needs_secret",
      requiredSecrets: ["API_TOKEN"]
    });
  });

  it("detects required remote variables", () => {
    expect(
      computeReadiness(
        response({
          name: "io.example.config",
          description: "Config",
          version: "1.0.0",
          remotes: [
            {
              type: "streamable-http",
              url: "https://{tenant}.example.com/mcp",
              variables: {
                tenant: {
                  isRequired: true
                }
              }
            }
          ]
        })
      )
    ).toMatchObject({
      status: "needs_config",
      requiredConfig: ["tenant"]
    });
  });

  it("marks package-only servers", () => {
    expect(
      computeReadiness(
        response({
          name: "io.example.package",
          description: "Package",
          version: "1.0.0",
          packages: [
            {
              registryType: "npm",
              identifier: "@example/package"
            }
          ]
        })
      )
    ).toMatchObject({
      status: "package_only",
      installType: "package"
    });
  });

  it("lifecycle status takes precedence", () => {
    expect(
      computeReadiness(
        response(
          {
            name: "io.example.deleted",
            description: "Deleted",
            version: "1.0.0",
            remotes: [{ type: "streamable-http", url: "https://example.com/mcp" }]
          },
          "deleted"
        )
      )
    ).toMatchObject({
      status: "deleted"
    });
  });
});
