# API Contract

## Public API

### GET /health

Returns:

```json
{
  "status": "ok"
}
```

### GET /v0.1/servers

Query parameters:

- `cursor`
- `limit`
- `search`
- `updated_since`
- `include_deleted`
- `version`, including `latest`

Returns `ServerList`:

```json
{
  "servers": [
    {
      "server": {},
      "_meta": {}
    }
  ],
  "metadata": {
    "count": 1,
    "nextCursor": null
  }
}
```

### GET /v0.1/servers/:name

Returns the latest indexed server version by default.

### GET /v0.1/servers/:name/versions

Returns all known versions for a server, newest first where sortable.

### GET /v0.1/servers/:name/versions/:version

Returns one server version. `latest` is allowed.

### GET /v0.1/catalog

Returns approved and visible entries only.

Each response item must include curation metadata:

```json
{
  "server": {},
  "_meta": {
    "com.mcp-gateway.registry/curation": {
      "status": "approved",
      "visibility": "public",
      "featured": false,
      "tags": []
    }
  }
}
```

### GET /v0.1/gateway/catalog

Returns a read-only Gateway-optimized projection of approved public catalog
records. This endpoint is for Gateway import into disabled connector drafts.
It does not grant runtime access.

Query parameters:

- `cursor`
- `limit`

Returns:

```json
{
  "generatedAt": "2026-05-06T00:00:00.000Z",
  "nextCursor": null,
  "items": [
    {
      "catalogItemId": "srv_...",
      "name": "io.example/server",
      "version": "1.0.0",
      "isLatest": true,
      "title": "Example Server",
      "description": "Example MCP server",
      "lifecycleStatus": "active",
      "updatedAt": "2026-05-06T00:00:00.000Z",
      "contentHash": "sha256:...",
      "tags": ["example"],
      "qualityLabel": "verified",
      "readiness": {
        "status": "needs_secret",
        "requiredSecrets": ["API_TOKEN"],
        "requiredConfig": []
      },
      "requiredSecrets": ["API_TOKEN"],
      "requiredConfig": [],
      "packages": [],
      "remotes": [],
      "toolsUrl": "/v0.1/servers/io.example%2Fserver/tools?version=1.0.0",
      "toolCount": 0,
      "provenance": {
        "source": "manual",
        "sourceNames": ["manual"],
        "isOfficial": false,
        "updatedAt": "2026-05-06T00:00:00.000Z"
      },
      "verification": {
        "status": "verified",
        "ownership": "official_vendor",
        "sourceUrl": "https://vendor.example/docs/mcp",
        "verifiedAt": "2026-05-07T00:00:00.000Z",
        "notes": "Endpoint verified from public vendor documentation."
      },
      "curation": {
        "status": "approved",
        "visibility": "public"
      },
      "_meta": {}
    }
  ]
}
```

Filtering rules:

- Includes only reviewed `approved` records with `visibility: public`.
- Excludes pending, hidden, rejected, unreviewed, private, deleted, and removed records.
- Does not include Gateway runtime state.

Security boundary:

- Sub-Registry approval means catalog visibility only.
- Gateway must import items as disabled connector drafts.
- Gateway operator must still map secrets/config, approve commands, assign views/routes, and explicitly enable runtime access.
- `discovered != approved != enabled`.

Forbidden fields:

- `enabled`
- `runtimeEnabled`
- `approvedForRuntime`
- runtime secret values
- user/workspace tokens
- Gateway routing policy
- workspace permissions
- live session IDs
- MCP call payloads/results

## Default Curated Seed

The project includes a handpicked developer-productivity remote catalog seed:

```text
data/default-curated-servers.json
```

Run:

```text
bun run seed:curated
```

Validate before seeding:

```text
bun run validate:curated
```

The seed creates approved public Sub-Registry catalog records only. It does not
enable Gateway runtime access.

### GET /v0.1/search

Query parameters:

- `q`
- `limit`

Uses server-side Postgres search over indexed records. The operator UI uses this endpoint for query-backed search and filters the visible rows by the returned matches.

Returns `SearchResponse` with scored matches and matched fields.

### GET /v0.1/health

Returns:

```json
{
  "status": "healthy"
}
```

### GET /v0.1/ping

Returns:

```json
{
  "pong": true
}
```

### GET /v0.1/version

Returns API version and build metadata.

## Registry Metadata

Public read responses may include registry-owned metadata:

```text
_meta["com.mcp-gateway.registry/server"]
_meta["com.mcp-gateway.registry/server-version"]
_meta["com.mcp-gateway.registry/curation"]
_meta["com.mcp-gateway.registry/readiness"]
```

Publisher-owned and upstream metadata must be preserved in their original namespaces.

Gateway readiness is computed from metadata only. It can report `ready`,
`needs_secret`, `needs_config`, `package_only`, `remote_only`, `unknown`,
`deprecated`, or `deleted`. The gateway must still validate runtime connection
and inject actual secrets outside this registry.

### GET /v0.1/tags

Returns known tags.

### GET /v0.1/sources

Returns source metadata. Do not expose credentials.

### GET /v0.1/servers/:name/tools

Returns tools known for the latest version unless a `version` query parameter is passed.

## Admin API

Admin endpoints use one API key in v1:

```text
Authorization: Bearer <ADMIN_API_KEY>
```

### GET /admin/servers/:name/versions/:version/payloads

Returns the stored `raw_json` and `normalized_json` for an indexed server version. This is admin-only inspection data for the operator console.

### POST /admin/sources

Creates a registry source.

Request:

```json
{
  "name": "official",
  "type": "official",
  "baseUrl": "https://registry.modelcontextprotocol.io",
  "enabled": true
}
```

### POST /admin/sources/:sourceId/sync

Starts or runs a sync.

Request:

```json
{
  "mode": "full_etl"
}
```

Allowed modes:

- `full_etl`
- `incremental`
- `latest_only`

### PATCH /admin/sources/:sourceId

Updates a registry source. The request may include any non-empty subset of:

```json
{
  "name": "official",
  "type": "official",
  "baseUrl": "https://registry.modelcontextprotocol.io",
  "enabled": true
}
```

### POST /admin/servers

Adds a manual server record.

Request body should be a `server.json` object or wrapper:

```json
{
  "server": {}
}
```

### GET /admin/backup

Exports a logical backup document for local recovery. The backup includes
sources, server versions, curations, tags, tag assignments, and tool metadata.

### POST /admin/backup/import

Imports a logical backup document exported by `GET /admin/backup`.

Returns:

```json
{
  "imported": {
    "sources": 1,
    "serverVersions": 1,
    "curations": 1,
    "tags": 1,
    "serverTags": 1,
    "tools": 1
  }
}
```

### PATCH /admin/curations

Updates version-level curation for a server. The current implementation accepts
`serverName` and optional `version` in the request body instead of path
parameters.

Request:

```json
{
  "serverName": "io.github.example/server",
  "version": "1.0.0",
  "status": "approved",
  "visibility": "public",
  "featured": false,
  "qualityLabel": "verified",
  "notes": "Reviewed for gateway catalog"
}
```

### POST /admin/tags

Creates a tag.

### POST /admin/server-tags

Attaches a tag to a server.

Request:

```json
{
  "serverName": "io.github.example/server",
  "tagSlug": "communication"
}
```

### PUT /admin/servers/:name/versions/:version/tools/:toolName

Creates or updates manual tool metadata for a specific server version.

Request:

```json
{
  "description": "Read a file",
  "inputSchema": {
    "type": "object",
    "properties": {
      "path": {
        "type": "string"
      }
    },
    "required": ["path"]
  },
  "outputSchema": {
    "type": "object"
  }
}
```

The tool is stored with `source: "manual"` and appears in
`GET /v0.1/servers/:name/tools?version=:version`.

### POST /admin/sync

Runs a sync by explicit source/base URL. Prefer
`POST /admin/sources/:sourceId/sync` from the UI when the source already exists.

## Error Shape

Use a consistent error object:

```json
{
  "error": "Human readable message",
  "code": "machine_code",
  "details": {}
}
```
