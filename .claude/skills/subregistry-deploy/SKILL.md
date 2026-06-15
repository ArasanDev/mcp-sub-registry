---
name: subregistry-deploy
description: Update the live registry on the production VPS to current master — data-safe, gateway-safe, and verified through the public Caddy URL. Use after committing changes that should go live (code or seed). Full target details in docs/DEPLOY_RUNBOOK.md.
---

# Deploy / update the live registry

Target: existing Hostinger VPS via `ssh hostinger-vps` (user `tamil`). The registry runs as
compose project `mcp-sub-registry` at `/home/tamil/deployments/mcp-sub-registry-launch/`,
behind a shared Caddy that also fronts the **live gateway** — do not disturb the gateway.

⚠ SSH to the VPS and editing the shared Caddyfile may require an explicit permission grant —
if a command is denied, hand the exact command to the owner rather than working around it.

## Pre-flight gates (read-only)

1. Baseline: `ssh hostinger-vps 'docker ps --format "{{.Names}}\t{{.Status}}"'` — note gateway
   + registry + caddy + db status and the current catalog count (`curl -s localhost:8080/v0.1/catalog | grep -oc '"name"'`).
2. **Migration delta** (the only irreversible risk): compare `drizzle/*.sql` checksums local vs
   VPS. Identical → migrations are a no-op, safe. New files → read them for destructive ops first.
3. **Backup the DB:** `docker exec mcp_sub_registry_db pg_dump -U mcp_registry mcp_registry > ~/registry-backup-$(date +%Y%m%d-%H%M%S).sql` — confirm non-zero size.

## Update

4. Overlay current code (tracked files only; preserves `.env`, leaves no junk):
   `git archive --format=tar master | ssh hostinger-vps 'tar -x -C /home/tamil/deployments/mcp-sub-registry-launch'`
5. Verify `.env` still has its 4 keys and new files landed (`CLAUDE.md`, `docs/`).
6. Rebuild **only the api** (db + gateway untouched; the api auto-runs `db:migrate` on start):
   `ssh hostinger-vps 'cd /home/tamil/deployments/mcp-sub-registry-launch && docker compose -f docker-compose.prod.yml up -d --build api'`
7. If the seed changed: `docker exec mcp_sub_registry_api bun run validate:curated && docker exec mcp_sub_registry_api bun run seed:curated`.

## Verify (must be green before declaring done)

8. `localhost:8080/health` = ok; catalog count `>=` baseline; `/v0.1/gateway/catalog` works.
9. **Public URL through Caddy:** `curl -s https://registry.toolhost.online/health` = ok
   (if HTTPS is 000, the Caddy `registry.toolhost.online` block needs auto-HTTPS — owner action).
10. Gateway still `Up … (healthy)`.

## Rules

- Scope every command to the `mcp-sub-registry` project. **Never** run global `docker system prune`
  / image prune — that can take the gateway down. Rollback = re-overlay the prior commit + rebuild.
</content>
