import { describe, expect, it } from "vitest";
import { serverDetailSchema, serverListSchema } from "../apps/api/src/schemas/mcp-registry";
import { normalizeServerRecord } from "../apps/api/src/services/normalize-server";

const server = {
  name: "io.github.example/slack-mcp",
  title: "Slack MCP",
  description: "Slack MCP server",
  version: "1.2.0",
  packages: [
    {
      registryType: "npm",
      identifier: "@example/slack-mcp",
      version: "1.2.0",
      packageArguments: [{ name: "workspace", isRequired: true }],
      runtimeArguments: [{ name: "--stdio" }],
      environmentVariables: [
        {
          name: "SLACK_TOKEN",
          description: "Slack token",
          isRequired: true,
          isSecret: true
        }
      ]
    }
  ],
  remotes: [
    {
      type: "streamable-http",
      url: "https://{workspace}.example.com/mcp",
      variables: {
        workspace: {
          description: "Workspace slug",
          isRequired: true
        }
      }
    }
  ],
  _meta: {
    "io.modelcontextprotocol.registry/official": {
      status: "active"
    }
  },
  unknownFutureField: {
    preserved: true
  }
};

describe("serverDetailSchema", () => {
  it("accepts a valid server detail", () => {
    expect(serverDetailSchema.parse(server).name).toBe(server.name);
  });

  it("rejects missing required fields", () => {
    expect(() => serverDetailSchema.parse({ description: "Missing name" })).toThrow();
  });
});

describe("serverListSchema", () => {
  it("accepts ServerList responses", () => {
    const parsed = serverListSchema.parse({
      servers: [{ server, _meta: {} }],
      metadata: {
        count: 1,
        nextCursor: null
      }
    });

    expect(parsed.metadata.count).toBe(1);
  });
});

describe("normalizeServerRecord", () => {
  it("normalizes bare server records into ServerResponse shape", () => {
    const normalized = normalizeServerRecord(server);

    expect(normalized.rawJson).toBe(server);
    expect(normalized.normalizedJson.server.name).toBe(server.name);
    expect(normalized.normalizedJson._meta).toEqual(server._meta);
  });

  it("normalizes wrapped ServerResponse records", () => {
    const wrapped = {
      server,
      _meta: {
        "com.example.subregistry/custom": {
          rating: 5
        }
      }
    };

    const normalized = normalizeServerRecord(wrapped);

    expect(normalized.rawJson).toBe(wrapped);
    expect(normalized.normalizedJson._meta).toEqual(wrapped._meta);
  });

  it("preserves package and remote flexible metadata", () => {
    const normalized = normalizeServerRecord(server);

    expect(normalized.normalizedJson.server.packages?.[0]?.environmentVariables).toEqual(
      server.packages[0].environmentVariables
    );
    expect(normalized.normalizedJson.server.remotes?.[0]?.variables).toEqual(
      server.remotes[0].variables
    );
    expect(normalized.normalizedJson.server.unknownFutureField).toEqual({
      preserved: true
    });
  });
});
