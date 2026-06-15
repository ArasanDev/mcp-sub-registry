# Architecture

## Intent

This service is a standalone MCP Sub-Registry. It stores MCP server metadata, preserves upstream records, applies owner curation, and exposes MCP Registry-compatible read APIs.

The MCP Gateway is a separate project. This repo should not run MCP tools, proxy MCP traffic, inject secrets, or enforce runtime permissions.

## Stack

Default stack:

- TypeScript
- PostgreSQL
- Hono
- Drizzle
- Zod
- Vitest

Use Hono unless a concrete implementation issue appears.

## Service Shape

Single deployable HTTP service for v1, with source separated by app/package:

```text
apps/api
  HTTP API
    routes/registry
    routes/admin
    routes/health
  Services
    registry-read
    curation-catalog
    search
    sync
    readiness
  Database
    Drizzle schema
    PostgreSQL migrations

apps/web
  React/Vite operator UI
  Built assets served by apps/api

packages/shared
  Stable cross-app constants and types
```

Do not split into multiple services until there is operational pressure.

## Data Flow

Manual entry flow:

```text
admin submits server.json
  -> validate with Zod/schema
  -> upsert server/version/package/remote rows
  -> store raw_json and normalized_json
  -> create pending or approved curation
```

Catalog flow:

```text
client requests /v0.1/catalog
  -> load approved visible server versions
  -> merge curation metadata into _meta
  -> return ServerList-compatible shape
```

Search and inspector flow:

```text
operator types query
  -> GET /v0.1/search?q=...
  -> filter the visible rows by the matched server names
operator opens a version inspector
  -> GET /admin/servers/:name/versions/:version/payloads
  -> display stored raw_json and normalized_json separately
```

Sync flow:

```text
sync source
  -> fetch paginated /v0.1/servers
  -> validate ServerResponse records
  -> preserve upstream _meta
  -> upsert records idempotently
  -> process status deleted as removed_upstream
  -> record sync_runs
```

## Compatibility

Read API should stay close to MCP Registry `v0.1`.

Server responses follow:

```json
{
  "server": {},
  "_meta": {}
}
```

List responses follow:

```json
{
  "servers": [],
  "metadata": {
    "count": 0,
    "nextCursor": null
  }
}
```

Sub-registry curation metadata goes under:

```text
_meta["com.mcp-gateway.registry/curation"]
```

## Boundaries

Allowed in this repo:

- Registry sync.
- Server/version/package/remote/tool metadata.
- Curation and tags.
- Search.
- Catalog output for consumers.

Not allowed in v1:

- Gateway runtime.
- MCP transport proxying.
- Secret storage.
- User/team runtime authorization.
- Container orchestration.
- Public marketplace UI.
