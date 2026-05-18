export const metaKeys = {
  curation: "com.mcp-gateway.registry/curation",
  server: "com.mcp-gateway.registry/server",
  serverVersion: "com.mcp-gateway.registry/server-version",
  readiness: "com.mcp-gateway.registry/readiness",
  gatewayCompatibility: "com.mcp-gateway.registry/gateway-compatibility",
  official: "io.modelcontextprotocol.registry/official"
} as const;

export type MetaKey = (typeof metaKeys)[keyof typeof metaKeys];
