# Gateway Contract for the MCP Sub-Registry

The boundary and projection contract between this Sub-Registry and the separately-built
MCP Gateway. See `CLAUDE.md` §3–§5 for the operating summary; this is the full reference.

## Product Boundary

The Sub-Registry is a separate product from the Gateway.

```text
Official MCP Registry = public/community metadata and discovery
MCP Sub-Registry = curated catalog metadata and approval context
MCP Gateway = runtime governance, routing, identity, policy, audit, observability
MCP Connector Runtime = stdio/process/container execution exposed as HTTP/SSE MCP
```

Non-negotiable:

```text
discovered != approved != enabled
```

Definitions:

- `discovered`: metadata exists in an upstream registry, manual entry, or private import.
- `approved`: the Sub-Registry owner has reviewed and approved a server/version for an environment/use case.
- `enabled`: a Gateway operator has explicitly exposed the backend in Gateway runtime config, views, and policy.

Approval must never imply Gateway runtime enablement.

## Three-Service Topology

The intended VPS deployment may place these services on the same machine, but they remain separate deployable units:

```text
gateway.toolhost.online
  -> MCP Gateway

registry.toolhost.online
  -> MCP Sub-Registry

runtime.toolhost.online or a private internal hostname
  -> MCP Runtime Host / Connector Runtime
```

Rules:

- Gateway owns runtime access for remote endpoints.
- Sub-Registry owns discovery, import, curation, and projection.
- Runtime Host owns local stdio process execution and exposure as Streamable HTTP.
- Do not merge Gateway and Sub-Registry into one control plane.
- Do not implement Runtime Host inside the Sub-Registry repo.

## What This Repo Owns

The Sub-Registry owns:

- source registry records
- raw upstream `server.json`
- normalized server/version/package/remote metadata
- manual/private server entries
- curation status
- approval metadata
- owner/team/risk/tags
- environment eligibility
- gateway compatibility classification
- Gateway catalog projection
- deployment guidance that keeps these services separate on the same VPS

The Sub-Registry must not own:

- Gateway runtime sessions
- MCP traffic proxying
- tool call execution
- upstream secret values
- Gateway bearer tokens
- per-request policy decisions
- Gateway audit/traces/capture
- Connector Runtime process/container execution

## Why This Exists

The official MCP Registry is intentionally permissive and public. Its moderation policy removes illegal content, malware, spam, and broken servers, but does not guarantee server quality, lack of vulnerabilities, uniqueness, or enterprise suitability.

This repo exists so a registry owner can answer:

- Do we trust this MCP server?
- Which version is approved?
- Which environment can use it?
- Who owns it?
- What risk class is it?
- Does it expose read-only, write, admin, or external-side-effect tools?
- Does it use public, internal, private, or regulated data?
- Can the production Gateway consume it directly?
- Does it need Connector Runtime first?

## Gateway Compatibility

Each curated server should classify whether it is usable by the hosted Gateway.

Remote Streamable HTTP/SSE servers can be Gateway candidates:

```json
{
  "gateway_compatibility": {
    "hosted_gateway": true,
    "requires_connector_runtime": false,
    "supported_transports": ["streamable-http"],
    "reason": "Approved remote Streamable HTTP MCP endpoint"
  }
}
```

Package, stdio, process, and container servers are not direct production Gateway candidates:

```json
{
  "gateway_compatibility": {
    "hosted_gateway": false,
    "requires_connector_runtime": true,
    "supported_transports": ["stdio"],
    "reason": "Package server must be exposed through Connector Runtime before Gateway can consume it in production"
  }
}
```

Do not implement package/process execution here. That belongs to Connector Runtime.
If runtime-host-exposed servers are later surfaced to the Gateway, they should arrive through an explicit import/projection step rather than by collapsing execution into the registry.

## Gateway Projection Contract

The Gateway consumes this endpoint:

```http
GET /v0.1/gateway/catalog
```

It should return only records that are:

```text
approved + visible + eligible for Gateway planning
```

It must not return Gateway runtime state.

Forbidden projection fields:

- `enabled`
- `runtimeEnabled`
- `approvedForRuntime`
- secret values
- Gateway bearer tokens
- user/workspace tokens
- Gateway routing policy as live authority
- live MCP session IDs
- MCP call payloads/results

The Gateway imports projection records as disabled drafts. Runtime enablement happens only in Gateway config.

## Recommended Projection Semantics

Projection items should carry enough information for Gateway planning:

- stable catalog item ID
- server name/version
- title/description
- lifecycle status
- source/provenance
- curation status and visibility
- tags and risk/quality label
- packages and remotes metadata
- readiness:
  - ready
  - needs_secret
  - needs_config
  - requires_connector_runtime
- required secret names, not values
- required config names, not values
- tool metadata URL/count when available
- verification metadata

The current `GET /v0.1/gateway/catalog` endpoint already has the right general direction. Future work should add explicit `gateway_compatibility`, risk/action/data classes, and stronger disabled-draft semantics for Gateway imports.

## First Gateway Integration Flow

The Gateway-side flow should be:

```text
1. Sub-Registry discovers/imports server metadata.
2. Registry owner reviews and approves a specific server version.
3. Sub-Registry exposes the approved record in /v0.1/gateway/catalog.
4. Gateway imports it as a disabled backend draft.
5. Gateway validates and plans the config change.
6. Gateway operator maps secrets, views, and policy.
7. Gateway operator explicitly enables runtime access.
8. Gateway reloads and enforces runtime policy.
```

The Sub-Registry should never push live runtime access into Gateway.

## First User Launch Target

For the first user, the Sub-Registry should launch as a private local or VPS service used by the Gateway operator.

The immediate useful production path is:

```text
Sub-Registry API/UI -> curated approved catalog -> Gateway catalog import/plan -> Gateway runtime config
```

Do not launch it as a public marketplace.

Do not merge it into `gateway.toolhost.online`.

Preferred first hosted shape:

```text
Hostinger VPS or managed app host
PostgreSQL database
HTTP service
private admin key
public read-only catalog endpoints only if intentionally exposed
```

Suggested hostname later:

```text
registry.toolhost.online
```

or, if kept private during buildout:

```text
subregistry.toolhost.online
```

Keep it separate from:

```text
gateway.toolhost.online
```

## Launch Gate

Before any hosted launch, verify:

- `bun run typecheck`
- `bun run test`
- database migrations apply cleanly
- `/health` returns ok
- admin API key is strong and not printed
- `GET /v0.1/catalog` returns only approved visible records
- `GET /v0.1/gateway/catalog` excludes pending, rejected, hidden, private, deleted, and removed-upstream records
- curated seed validation passes
- backup/export workflow is known

## Next Build Priority

The Gateway currently needs the Sub-Registry to be stronger in these areas:

1. Real operator review queue.
2. Complete detail page for versions, packages, remotes, tools, and raw/normalized JSON.
3. Explicit Gateway compatibility metadata.
4. Stronger Gateway projection contract tests.
5. Launch plan for private hosted preview.

Those should come before public marketplace or multi-tenant enterprise scope.
