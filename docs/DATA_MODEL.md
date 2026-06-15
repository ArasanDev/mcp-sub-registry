# Data Model

## Principles

- Preserve upstream data exactly in `raw_json`.
- Store a validated/enriched copy in `normalized_json`.
- Keep curation separate from upstream facts.
- Use JSONB for flexible schema sections.
- Prefer explicit version approvals over floating latest behavior.
- Use Docker Postgres for local development.
- Support Neon or other managed Postgres later through `DATABASE_URL`; do not add Neon-specific code paths.

## Tables

### registry_sources

Tracks upstream or manual sources.

- `id`: identity primary key.
- `name`: unique source name.
- `type`: `official`, `subregistry`, `manual`, `other`.
- `base_url`: nullable for manual.
- `enabled`: boolean.
- `last_synced_at`: timestamp nullable.
- `created_at`, `updated_at`.

### servers

Canonical server identity.

- `id`: identity primary key.
- `name`: unique MCP server name.
- `title`.
- `description`.
- `website_url`.
- `repository_url`.
- `license`.
- `status`: `indexed`, `invalid`, `removed_upstream`.
- `created_at`, `updated_at`.

### server_versions

Specific source-backed server version.

- `id`: identity primary key.
- `server_id`.
- `source_id`.
- `version`.
- `raw_json`: JSONB.
- `normalized_json`: JSONB.
- `upstream_status`: `active`, `deprecated`, `deleted`, nullable.
- `status`: `indexed`, `removed_upstream`, `invalid`.
- `published_at`, `upstream_updated_at`.
- `created_at`, `updated_at`.

The operator inspector exposes `raw_json` and `normalized_json` separately through the admin API. Public read responses and search results use the validated normalized shape.

Unique constraint:

```text
server_id + source_id + version
```

### server_packages

Package entries from `server.packages`.

- `id`: identity primary key.
- `server_version_id`.
- `registry_type`.
- `identifier`.
- `version`.
- `transport`: JSONB.
- `runtime_hint`.
- `registry_base_url`.
- `file_sha256`.
- `package_arguments`: JSONB.
- `runtime_arguments`: JSONB.
- `environment_variables`: JSONB.
- `package_json`: JSONB full package object.

### server_remotes

Remote transport entries from `server.remotes`.

- `id`: identity primary key.
- `server_version_id`.
- `transport_type`: `streamable-http` or `sse`.
- `url`.
- `headers`: JSONB.
- `variables`: JSONB.
- `remote_json`: JSONB full remote object.

### server_tools

Tool metadata when discovered or imported.

- `id`: identity primary key.
- `server_version_id`.
- `name`.
- `description`.
- `input_schema`: JSONB.
- `output_schema`: JSONB.
- `source`: `manual`, `discovered`, `upstream`.
- `discovered_at`.

### curations

Registry-owner decision.

- `id`: identity primary key.
- `server_id`.
- `server_version_id`: nullable for server-level curation.
- `status`: `pending`, `approved`, `rejected`, `hidden`.
- `visibility`: `public`, `private`, `unlisted`.
- `featured`: boolean.
- `quality_label`.
- `notes`.
- `meta`: JSONB used to build `_meta["com.mcp-gateway.registry/curation"]`.
- `created_at`, `updated_at`.

### tags

- `id`: identity primary key.
- `slug`: unique.
- `name`.
- `created_at`, `updated_at`.

### server_tags

Join table.

- `server_id`.
- `tag_id`.

### sync_runs

Tracks source sync attempts.

- `id`: identity primary key.
- `source_id`.
- `mode`: `full_etl`, `incremental`, `latest_only`.
- `status`: `running`, `succeeded`, `failed`.
- `started_at`, `finished_at`.
- `cursor`.
- `updated_since`.
- `servers_seen`.
- `versions_seen`.
- `error`.

## Drizzle Rules

Use:

```ts
integer().primaryKey().generatedAlwaysAsIdentity()
```

Do not use `serial` for new primary keys.

## Runtime Database

Local default:

```text
postgres://mcp_registry:mcp_registry@127.0.0.1:5432/mcp_registry
```

Hosted preview/staging can use Neon:

```text
postgresql://user:password@host.neon.tech/dbname?sslmode=require
```

The application should only depend on `DATABASE_URL`.
