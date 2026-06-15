---
name: subregistry-audit
description: Periodically re-verify cataloged MCP servers — endpoint reachability and security posture — and flag dead or risky entries for owner action. Use on a cadence (e.g. weekly) or when research surfaces an incident affecting a cataloged vendor.
---

# Audit the curated catalog

Keep trust honest: endpoints move/retire and servers can be compromised (rug pulls,
tool poisoning). This skill re-checks what's already approved.

## Steps

1. **Enumerate** current servers + endpoints from `data/default-curated-servers.json`
   (`grep -E '"name"|"url"'`).
2. **Reachability:** for each remote URL,
   `curl -s -m10 -o /dev/null -w "%{http_code}" <url>`. Live auth-gated = ~401/406/400.
   `000`/`404`/`410` = investigate; likely dead or moved.
3. **Security cross-check:** scan the latest `docs/research/*.md` and a quick web search for any
   incident, CVE, ownership change, or rug-pull affecting a cataloged vendor.
4. **Triage findings:**
   - Dead/moved endpoint → update the URL (re-verify) or set curation `status` away from
     `approved` (`pending`/`rejected`) and note why.
   - Security flag → demote to `pending`/`rejected` immediately; approval is visibility, so
     pulling it removes it from `/v0.1/catalog` and the gateway projection.
   - Stale `verifiedAt` (older than the audit window) → re-verify and bump.
5. **Validate + commit:** `bun run validate:curated` → `valid: true`; commit
   `chore(catalog): audit <date> — <summary>`; push.
6. **Publish** if anything changed: `subregistry-deploy` (or `seed:curated` on the target).
7. Record notable findings in `CLAUDE.md` §13 and, if ecosystem-wide, in a research note.

## Principle

When in doubt, demote. A curated catalog's value is that an approved entry is trustworthy —
better to drop a questionable server than to keep a risky one visible.
</content>
