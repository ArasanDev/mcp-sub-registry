# MCP Sub-Registry

This repository is for a standalone MCP Sub-Registry.

The goal is to build an owned, curated, MCP Registry-compatible catalog that can be consumed by an MCP Gateway or other clients. The gateway itself is a separate project.

## What This Builds

The sub-registry will:

- Sync server metadata from upstream MCP registries.
- Store raw and normalized MCP server records.
- Allow registry-owner curation: approve, reject, hide, feature, tag, and annotate.
- Expose MCP Registry-compatible read APIs.
- Provide a simple curated catalog endpoint for downstream consumers.

The initial API target is MCP Registry `v0.1`. New/manual records should target the `2025-12-11` `server.schema.json` shape where practical.

## What This Does Not Build Initially

- MCP Gateway runtime.
- MCP traffic proxying.
- Secret injection.
- Tool call auditing.
- Container hosting.
- Full enterprise tenant/RBAC system.
- Marketplace UI.

## Planned Stack

- TypeScript
- PostgreSQL
- Hono or Fastify
- Drizzle
- Zod
- Vitest
- Bun

Implementation defaults:

- Store flexible MCP fields as PostgreSQL `jsonb`.
- Use `_meta["com.mcp-gateway.registry/curation"]` for registry-owned curation metadata.
- Use Drizzle identity columns for numeric primary keys.
- Use Docker Postgres locally and `DATABASE_URL` for all database environments.

## Key Docs

- [CLAUDE.md](CLAUDE.md) — maintainer identity, boundary, and operating loop
- [Gateway contract](docs/GATEWAY_CONTRACT.md) — the projection contract (keystone)
- [API contract](docs/API.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Data model](docs/DATA_MODEL.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Curated catalog policy + shortlist](docs/CURATED_CATALOG.md)
- [Ecosystem landscape & ranking](docs/research/landscape.md)

## First Milestone

Build a working local sub-registry that can:

1. Store MCP servers and versions.
2. Expose MCP Registry-compatible read endpoints.
3. Add private/manual server entries.
4. Approve or hide entries through admin APIs.
5. Return a curated catalog suitable for an external MCP Gateway.

## Development

## Project Structure

```text
apps/api/src        Backend Hono API, services, DB, schemas
apps/web/src        React/Vite operator UI source
apps/web/dist       Built operator UI served by the API
packages/shared     Shared metadata constants and types
tests/              Unit and integration tests
drizzle/            Database migrations
```

Install dependencies:

```sh
bun install
```

Create local environment:

```sh
cp .env.example .env
```

Start local Postgres:

```sh
docker compose up -d
```

The local database URL is:

```text
postgres://mcp_registry:mcp_registry@127.0.0.1:5432/mcp_registry
```

Generate migrations after schema changes:

```sh
bun run db:generate
```

Apply migrations:

```sh
bun run db:migrate
```

Run checks:

```sh
bun run typecheck
bun run test
bun run lint
```

Run the API locally:

```sh
bun run dev
```

The service listens on `PORT`, defaulting to `8080`.

Operator console:

```text
GET /
```

The browser UI provides catalog/search browsing, API-backed search queries, server detail inspection with raw/normalized payload views, admin-key-backed curation controls, manual server creation, tag workflows, sync trigger, and OpenAPI inspection.

Health check:

```text
GET /health
```

OpenAPI document:

```text
GET /openapi.json
```

Registry read endpoints:

```text
GET /v0.1/servers
GET /v0.1/servers?limit=50&cursor=<cursor>&version=latest
GET /v0.1/servers/:name
GET /v0.1/servers/:name/versions
GET /v0.1/servers/:name/versions/:version
GET /v0.1/catalog
GET /v0.1/catalog?tag=<tag>&featured=true
GET /v0.1/search?q=<query>&limit=100
GET /v0.1/tags
GET /v0.1/sources
GET /v0.1/servers/:name/tools
GET /admin/servers/:name/versions/:version/payloads  # admin only
```

Create a manual server entry:

```sh
curl -X POST http://localhost:8080/admin/servers \
  -H "Authorization: Bearer $ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"io.example/filesystem","version":"1.0.0","description":"Example filesystem MCP server"}'
```

Curate and tag a server:

```sh
curl -X POST http://localhost:8080/admin/tags \
  -H "Authorization: Bearer $ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"slug":"database","name":"Database"}'

curl -X POST http://localhost:8080/admin/server-tags \
  -H "Authorization: Bearer $ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"serverName":"io.example/filesystem","tagSlug":"database"}'

curl -X PATCH http://localhost:8080/admin/curations \
  -H "Authorization: Bearer $ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"serverName":"io.example/filesystem","status":"approved","visibility":"public","featured":true}'
```

Run an upstream sync:

```sh
curl -X POST http://localhost:8080/admin/sync \
  -H "Authorization: Bearer $ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"mode":"latest_only"}'
```
