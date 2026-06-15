# Playbook — Autonomously Adding MCP Servers

How the orchestrator (or the daily routine) expands the curated catalog **group by group,
research-first**. Follow this exactly; it encodes the trust bar that is the product's whole
value. Boundary reminder: **`discovered != approved != enabled`** — approving a server here
grants *catalog visibility only*, never gateway runtime enablement. Store **secret names,
never values**.

## Operating principle

Never bulk-import. Add one **coherent group** at a time, each researched and verified, so
every entry can be defended. Quality and provenance beat volume — the aggregators already
own volume (see `research/landscape.md`); we own trust.

## Grouping — two axes

1. **By category** (what it does): payments, dev-tools, data/db, design, comms, project-mgmt,
   web/cms, observability, search, docs/knowledge, cloud/devops, security.
2. **By persona / use-case** (who it's for) — this powers the product pitch
   ("*if you are a $ROLE, here are your trusted MCP servers*"). Examples:
   - **Full-stack engineer:** GitHub, Vercel, Neon, Sentry, Linear, DeepWiki.
   - **Product/PM:** Linear, Notion, Figma, Asana, Atlassian.
   - **Growth/commerce:** Stripe, Webflow, Slack, Notion.
   Maintain these as tag-based views (`/v0.1/catalog?tag=...`); curate tags so a persona is a
   tag query.

## Per-group workflow

1. **Pick the group** from the backlog (below) or from a daily-research finding.
2. **Research** each candidate (WebSearch/WebFetch). For each, establish:
   - Official owner (prefer official/vendor-maintained over community).
   - Stable **remote** endpoint URL (prefer `streamable-http`; `sse` is secondary; package/
     stdio servers are allowed but flagged `requires_connector_runtime`).
   - Auth model + the **names** of required secrets/config (never values).
   - Any security signal: recent incident, rug-pull/tool-poisoning report, ownership change.
3. **Verify reachability** — `curl -s -m10 -o /dev/null -w "%{http_code}" <url>`.
   A live OAuth endpoint typically returns `401`/`406`/`400` (a response = live). `000` =
   dead → do not add (or mark `candidate`, not `verified`).
4. **Draft entries** in `data/default-curated-servers.json` using the schema below.
5. **Validate** — `bun run validate:curated` must return `valid: true` with no errors.
6. **Commit** — `feat(catalog): add <group> servers (<n>)` with a one-line provenance note.
7. **Publish to the live registry** — see "Seeding production".

## Entry schema (copy this shape)

```json
{
  "server": {
    "name": "com.vendor/mcp",
    "title": "Vendor MCP",
    "description": "One concrete sentence on what it provides.",
    "version": "remote-YYYY-MM",
    "remotes": [
      { "type": "streamable-http", "url": "https://mcp.vendor.com/mcp",
        "headers": [ { "name": "Authorization", "description": "Vendor OAuth token reference.",
                       "isRequired": true, "isSecret": true } ] }
    ],
    "packages": []
  },
  "curation": {
    "status": "approved", "visibility": "public", "qualityLabel": "curated",
    "notes": "Short provenance + verification note.",
    "meta": { "verification": {
      "status": "verified", "ownership": "official_vendor",
      "sourceUrl": "https://…", "verifiedAt": "YYYY-MM-DDT00:00:00.000Z",
      "notes": "Reachability confirmed (HTTP <code>). Re-verify vs vendor docs." } }
  },
  "tags": ["category", "persona-tag", "remote", "oauth"]
}
```

## Quality / trust gates (all must hold for `verified` + `approved`/`public`)

- Endpoint reachability confirmed this cycle (record the HTTP code in notes).
- Official/vendor ownership, or a clearly-stated reason if community.
- No open security flag (postmark-mcp-class malicious, CVE, rug-pull). If flagged → `pending`
  or `rejected`, never `approved`.
- Version **pinned** (`remote-YYYY-MM` or a real semver) — avoid floating `latest` approvals.
- Only secret/config **names** appear; no values, tokens, or workspace data.
- Transport classified: remote `streamable-http`/`sse` → hosted-gateway candidate;
  package/stdio → `requires_connector_runtime` (gateway-compatibility computes this).

## Seeding production

The seed file is the source of truth; the live registry DB is loaded from it.

```sh
# locally, or on the VPS deploy dir
bun run validate:curated
bun run seed:curated      # idempotent upsert of approved/public records into the DB
```

On the VPS the API container has `data/` baked in; run `seed:curated` inside it after a
deploy that changed the seed. Seeding adds catalog records only — it never enables runtime.

## Backlog (ordered next groups)

1. **Search & knowledge:** Exa, Brave Search, Perplexity, Context7 (verify endpoints).
2. **Cloud/devops:** AWS, Google Cloud, Azure, HubSpot, Salesforce (first-party hosted).
3. **Comms & support:** Intercom, PayPal (commerce), Zapier (8k-app bridge).
4. **Data & analytics:** Hugging Face, Snowflake, MongoDB, Postgres-class.
5. **Design & content:** Canva, Figma (have), Webflow (have).

Pull the current verified count and existing names first (`grep '"name": "[a-z]' data/...`)
to avoid duplicates. Re-verify every endpoint each time — vendors move/retire them.
</content>
