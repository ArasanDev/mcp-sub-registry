export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "MCP Sub-Registry API",
    version: "0.1.0"
  },
  paths: {
    "/health": {
      get: {
        summary: "Health check"
      }
    },
    "/v0.1/servers": {
      get: {
        summary: "List MCP servers",
        parameters: [
          { name: "cursor", in: "query" },
          { name: "limit", in: "query" },
          { name: "search", in: "query" },
          { name: "updated_since", in: "query" },
          { name: "include_deleted", in: "query" },
          { name: "version", in: "query" }
        ]
      }
    },
    "/v0.1/servers/{name}": {
      get: {
        summary: "Get latest MCP server by name"
      }
    },
    "/v0.1/servers/{name}/versions": {
      get: {
        summary: "List server versions"
      }
    },
    "/v0.1/servers/{name}/versions/{version}": {
      get: {
        summary: "Get server version"
      }
    },
    "/v0.1/servers/{name}/tools": {
      get: {
        summary: "List known tools for a server version"
      }
    },
    "/v0.1/catalog": {
      get: {
        summary: "List approved public curated servers"
      }
    },
    "/v0.1/gateway/catalog": {
      get: {
        summary: "List approved public servers as disabled Gateway connector draft inputs"
      }
    },
    "/v0.1/search": {
      get: {
        summary: "Search indexed servers"
      }
    },
    "/v0.1/tags": {
      get: {
        summary: "List tags"
      }
    },
    "/v0.1/sources": {
      get: {
        summary: "List registry sources"
      }
    },
    "/v0.1/health": {
      get: {
        summary: "Versioned health check"
      }
    },
    "/v0.1/ping": {
      get: {
        summary: "Ping"
      }
    },
    "/v0.1/version": {
      get: {
        summary: "API version"
      }
    },
    "/admin/sources": {
      post: {
        summary: "Create or update registry source"
      }
    },
    "/admin/sources/{sourceId}": {
      patch: {
        summary: "Update registry source"
      }
    },
    "/admin/sources/{sourceId}/sync": {
      post: {
        summary: "Trigger source sync"
      }
    },
    "/admin/servers": {
      post: {
        summary: "Create manual server"
      }
    },
    "/admin/imports": {
      post: {
        summary: "Import a server record into the sub-registry"
      }
    },
    "/admin/backup": {
      get: {
        summary: "Export logical registry backup"
      }
    },
    "/admin/backup/import": {
      post: {
        summary: "Import logical registry backup"
      }
    },
    "/admin/curations": {
      patch: {
        summary: "Update curation"
      }
    },
    "/admin/tags": {
      post: {
        summary: "Create or update tag"
      }
    },
    "/admin/server-tags": {
      post: {
        summary: "Assign tag to server"
      }
    },
    "/admin/servers/{name}/versions/{version}/tools/{toolName}": {
      put: {
        summary: "Create or update manual tool metadata"
      }
    },
    "/admin/servers/{name}/versions/{version}/payloads": {
      get: {
        summary: "Inspect stored raw and normalized payloads for a server version"
      }
    },
    "/admin/sync": {
      post: {
        summary: "Trigger upstream sync"
      }
    }
  }
} as const;
