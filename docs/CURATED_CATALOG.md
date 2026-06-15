# Handpicked MCP Server Shortlist

Purpose: manually curate the first servers for the Sub-Registry.

Boundary:

- Sub-Registry approval means catalog visibility only.
- Gateway imports approved records as disabled connector drafts.
- Runtime enablement remains Gateway-owned.
- `discovered != approved != enabled`

## Selection Principles

1. Prefer developer-productivity servers first.
2. Prefer remote HTTPS MCP servers first.
3. Prefer official/vendor-maintained servers when possible.
4. Package/stdio servers are allowed, but they are secondary.
5. Do not include runtime secret values.

## Servers

Add handpicked servers here one by one.

| Priority | Server | Status | Preferred Transport | Endpoint URL | Auth Expectation | Why Include | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P0 | DeepWiki | verified | streamable-http | `https://mcp.deepwiki.com/mcp` | open | Codebase documentation, architecture understanding, source-code links | Public DeepWiki endpoint verified |
| P0 | GitHub | verified | streamable-http | `https://api.githubcopilot.com/mcp/` | oauth or PAT | Official GitHub MCP server for repositories, issues, PRs, and developer workflows | Official remote GitHub MCP endpoint verified |
| P0 | Slack | verified | streamable-http | `https://mcp.slack.com/mcp` | oauth | Developer/team communication and workflow context | Requires Slack app identity; Slack says no SSE/DCR currently |
| P0 | Notion | verified | streamable-http | `https://mcp.notion.com/mcp` | oauth | Docs, notes, team knowledge, planning | Official hosted endpoint verified; legacy SSE also exists |
| P0 | Cloudflare | verified | streamable-http | `https://mcp.cloudflare.com/mcp` | oauth or API token | Cloud/devops workflows, DNS, Workers, infrastructure operations | Cloudflare API MCP endpoint verified |
| P0 | Sentry | candidate | sse or streamable-http | `https://mcp.sentry.dev` | oauth | Error tracking, performance monitoring, production debugging | Production service verified; exact client URL needs final confirmation (`/mcp` vs `/sse`) |
| P0 | Linear | verified | streamable-http | `https://mcp.linear.app/mcp` | oauth or bearer token | Issue/project tracking for engineering workflows | Official endpoint verified |
| P0 | Figma | verified | streamable-http | `https://mcp.figma.com/mcp` | oauth | Design/prototype context for product engineering | Official hosted endpoint verified; client support allowlisted |
| P1 | Neon | verified | streamable-http | `https://mcp.neon.tech/mcp` | oauth or API key | Serverless Postgres management and database workflow | Official managed endpoint verified; SSE legacy endpoint exists |
| P1 | Supabase | verified | streamable-http | `https://mcp.supabase.com/mcp` | oauth or PAT | Database/backend/app platform workflow | Official hosted endpoint verified; supports query params for read-only/project scope/features |
| P1 | Atlassian | verified | streamable-http | `https://mcp.atlassian.com/v1/mcp` | oauth or API token optional | Jira/Confluence collaboration for software and IT teams | `/v1/sse` deprecated after 2026-06-30; use `/v1/mcp` |

## Status Values

- `candidate`: good option, not verified yet.
- `verified`: endpoint/source/auth reviewed.
- `approved_public`: ready for default curated seed.
- `pending`: keep in registry but not Gateway-facing.
- `rejected`: do not include.
- `fallback`: useful, but secondary to remote HTTPS catalog.

## Fields To Verify Before Seeding

For each server, confirm:

- Official/vendor/community ownership.
- Stable MCP endpoint URL or package reference.
- Transport type: `streamable-http`, `sse`, or package/stdio.
- Auth requirement.
- Required secret names only, never values.
- Required config variables.
- Tool list or `toolsUrl` viability.
- License/source URL if available.
- Whether it should be `approved_public` or remain `pending`.

## Seed Target Shape

```json
{
  "name": "vendor.example/server",
  "version": "remote-2026-05",
  "title": "Example MCP Server",
  "description": "What this MCP server provides.",
  "remotes": [
    {
      "type": "streamable-http",
      "url": "https://example.com/mcp"
    }
  ],
  "packages": []
}
```

Default curation for verified seed entries:

```json
{
  "status": "approved",
  "visibility": "public",
  "qualityLabel": "curated"
}
```

Forbidden fields:

- `enabled`
- `runtimeEnabled`
- `approvedForRuntime`
- secret values
- user/workspace tokens
- Gateway routing policy
- workspace permissions
