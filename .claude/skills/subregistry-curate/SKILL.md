---
name: subregistry-curate
description: Add trusted MCP servers to the curated catalog, ONE researched group at a time (by category or persona). Use when expanding the catalog. Enforces research → verify reachability → draft → validate → commit → seed. Full detail in docs/PLAYBOOK_ADD_SERVERS.md.
---

# Curate: add MCP servers (group by group)

Boundary: approving here = catalog visibility only (`discovered != approved != enabled`).
Secret **names** only, never values. Never bulk-import — one defensible group per pass.
Authoritative procedure + entry schema + backlog: `docs/PLAYBOOK_ADD_SERVERS.md`.

## Loop

1. **Pick a group** from the playbook backlog or a research finding (category, or a persona
   bundle like "full-stack engineer", "PM", "growth").
2. **Avoid duplicates:** `grep '"name": "[a-z]' data/default-curated-servers.json`.
3. **Research each candidate** (WebSearch/WebFetch): official owner, stable remote endpoint
   (prefer `streamable-http`, then `sse`; package/stdio = `requires_connector_runtime`),
   auth model + required secret/config **names**, any security flag.
4. **Verify reachability:** `curl -s -m10 -o /dev/null -w "%{http_code}" <url>` — a live OAuth
   endpoint returns ~401/406/400; `000` = dead → don't add (or mark `candidate`).
5. **Draft** entries in `data/default-curated-servers.json` using the playbook schema
   (server / curation / verification / tags). Pin the version; record the HTTP code in notes.
6. **Validate:** `bun run validate:curated` must return `valid: true`, no errors.
7. **Commit:** `feat(catalog): add <group> servers (<n>)` with provenance.
8. **Publish** to the live registry via `subregistry-deploy` (or `bun run seed:curated` against
   the target DB). Seeding adds catalog records only; it never enables runtime.

## Gates (all must hold for `verified` + `approved`/`public`)

- Reachability confirmed this cycle · official/vendor owner (or stated reason) · no open
  security flag · version pinned · only secret/config names · transport classified.
</content>
