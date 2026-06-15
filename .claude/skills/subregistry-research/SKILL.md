---
name: subregistry-research
description: Run the periodic MCP ecosystem research pass (daily cron target or on demand). Web-research the registry / sub-registry / gateway / security landscape for what changed, write a dated cited report, refresh the canonical ranking, flag catalog servers needing action, and commit. This is what the scheduled cloud routine invokes.
---

# MCP ecosystem research pass

Goal: keep the sub-registry's view of the world current and cited. Quality over volume.
Stay strictly within the registry boundary (never drift into gateway runtime / proxying / secrets).

## Steps

1. **Orient (lean):** read `CLAUDE.md` §1–§5, then `docs/research/landscape.md` and the most
   recent `docs/research/*.md` to see what's already known.
2. **Research what's NEW/CHANGED** since the last report. Use WebSearch + WebFetch; cite every
   external claim with its source URL. Cover all angles:
   - Official MCP Registry & spec: GA/preview status, API + `server.json` schema version,
     new endpoints/semantics, spec RC changes.
   - Players: new/changed sub-registries, catalogs, gateways (Glama, PulseMCP, Smithery,
     mcp.so, Docker MCP Catalog, JFrog, Obot, Lunar.dev MCPX, TrueFoundry, Kong, Runlayer,
     MintMCP, Microsoft, AWS, and new entrants).
   - Security: malicious servers, tool poisoning, rug pulls, CVEs, provenance/signing.
3. **Write** a dated report `docs/research/<YYYY-MM-DD>-mcp-ecosystem-update.md` — what changed
   and why it matters to a curated sub-registry. If the field materially shifted, update
   `docs/research/landscape.md` (bump `Last updated`, adjust the top-10 table + watch list).
4. **Catalog hooks:** check `data/default-curated-servers.json` against findings; flag any
   server with a dead endpoint, ownership change, or security concern. If action is warranted,
   note it and consider `subregistry-curate` (add) or `subregistry-audit` (re-verify).
5. **Commit** only meaningful changes: `docs(research): <date> MCP ecosystem update`. Push to
   `origin master`. No empty/noise commits.

## Notes

- Determine today's date from the environment, not memory.
- Keep claims honest and sourced; flag anything unverified.
- This skill's prior output is the best template — read the latest report before writing.
</content>
