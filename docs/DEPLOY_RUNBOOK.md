# Deploy Runbook — Private Hosted Preview

Concrete, gated plan to take this Sub-Registry live at `registry.toolhost.online` on a
Hostinger VPS with managed Postgres. Companion to [DEPLOYMENT.md](./DEPLOYMENT.md) (which
covers the container, env, backup/restore, and launch gate). Execution is **gated**: the
orchestrator pauses for owner go-ahead at each step marked **[GATE]**.

## Target shape

```
registry.toolhost.online            (private; public read endpoints only if intended)
  → edge reverse proxy (Caddy/Traefik, TLS)        on the VPS
    → mcp-sub-registry container (Hono API, :8080)  on the VPS
      → managed Postgres (Neon) via DATABASE_URL
```

One code path for all environments: the app depends only on `DATABASE_URL`,
`ADMIN_API_KEY`, `PORT`, `NODE_ENV`. No host-specific code. Keep `:8080` private behind the
VPS firewall; only the proxy is exposed.

## Prerequisites (owner-provided / one-time)

- [ ] **[GATE]** Hostinger account reachable from the orchestrator's VPS tools (confirm an
      existing VPS or authorize provisioning a new one).
- [ ] Domain `toolhost.online` DNS controllable (A record `registry` → VPS IP).
- [ ] **[GATE]** Managed Postgres: provision a Neon project/branch → obtain `DATABASE_URL`
      (`...sslmode=require`). Neon chosen for branchable managed Postgres; any managed
      Postgres works via the same URL.
- [ ] Generate a strong `ADMIN_API_KEY` (≥32 chars) — stored only in the VPS env / secret
      store, never in git, never printed.

## Steps

1. **Provision VPS** — **[GATE]** create/select a Hostinger VPS (Docker-capable), record IP.
2. **DNS** — point `registry.toolhost.online` A record at the VPS IP; wait for propagation.
3. **Secrets on host** — write `/opt/mcp-sub-registry/.env` with `NODE_ENV=production`,
   `PORT=8080`, `DATABASE_URL=<neon>`, `ADMIN_API_KEY=<strong>`. `chmod 600`.
4. **Deliver code** — clone the private repo onto the VPS (deploy key / GitHub App), or ship
   the built image. Source of truth is `origin/master`.
5. **Migrate** — explicit step before serving:
   `docker run --rm -e DATABASE_URL ... mcp-sub-registry bun run db:migrate`.
6. **Start service** — `docker compose -f docker-compose.prod.yml up -d --build`
   (publishes `:8080` on the host for the proxy hop; firewall keeps it private).
7. **Edge proxy + TLS** — Caddy/Traefik terminates HTTPS for `registry.toolhost.online`,
   proxies to `127.0.0.1:8080`.
8. **Seed** — **[GATE]** `bun run validate:curated` then `bun run seed:curated` to load the
   approved remote catalog (`data/default-curated-servers.json`).
9. **Verify (launch gate, from DEPLOYMENT.md / CLAUDE.md §11):**
   - `curl https://registry.toolhost.online/health` → ok
   - `GET /v0.1/catalog` returns only approved+visible
   - `GET /v0.1/gateway/catalog` excludes pending/rejected/hidden/private/deleted/removed
     and leaks no runtime/secret fields
   - migrations applied; `ADMIN_API_KEY` strong and unprinted
10. **Backup** — confirm `GET /admin/backup` exports; record restore procedure.

## Firewall

- Expose only 80/443 (proxy) publicly. Keep `8080` and Postgres private.
- If the proxy runs in a container on the same VPS, publish `8080` on the host interface
  (loopback-only bind is insufficient for the container→host hop) and rely on the firewall.

## Rollback

- App: redeploy previous image tag / previous `origin/master` commit.
- DB: restore from `GET /admin/backup` export or Neon branch point-in-time.

## Open decisions to confirm before execution

1. **[GATE]** New Hostinger VPS or existing one?
2. **[GATE]** Neon for managed Postgres (recommended) or another provider?
3. Public exposure: keep fully private during buildout (`subregistry.toolhost.online`,
   IP-allowlisted) or expose read-only catalog endpoints from day one?
4. CI gate on the remote (typecheck + test on push) before enabling auto-deploy.
</content>
