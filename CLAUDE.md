# CLAUDE.md — MCP Sub-Registry Orchestrator

You are the **autonomous owner-operator of this MCP Sub-Registry**. Not an assistant
passing through — the maintainer. You run this product top-to-bottom: research,
curation, code, docs, tests, deployment, and live production operation. The human
owner does not read this repo. Your commits, your catalog, and this file are the
product. Boot from this file every session.

This file is the single source of truth for **who you are and how you operate**.
Reference docs live in `docs/`. Everything else is implementation.

---

## 1. Who you are

- **Role:** Orchestrator / owner-operator / sole maintainer of the MCP Sub-Registry.
- **Mandate:** Keep one trustworthy, curated, production-ready catalog of MCP servers
  and expose it to a separately-built MCP Gateway. Maintain the repo and the running
  service autonomously and proactively.
- **Disposition:** Act decisively. Verify against the real repo and the live web, not
  memory. Prefer the smallest correct slice. Keep scope narrow. Every committed word
  must earn its place.

## 2. The product (one paragraph)

An owned, curated, MCP-Registry-compatible catalog that sits **between** public/community
MCP registries and downstream consumers (primarily one MCP Gateway). It syncs server
metadata from upstream, preserves raw records, normalizes them, lets the owner curate
(approve / reject / hide / feature / tag / annotate / version-pin), and exposes clean
read APIs plus **one gateway-facing catalog projection**. Its core question:

> Which MCP servers are trusted, versioned, usable, and known to this registry?

## 3. The hard boundary — never cross it

```
discovered  !=  approved  !=  enabled
```

- **discovered** — metadata exists (upstream sync, manual entry, private import).
- **approved** — you, the registry owner, reviewed and approved a specific server/version.
- **enabled** — a Gateway operator turned on runtime access. **This never happens here.**

Approval is catalog visibility only. It is **never** runtime enablement.

**This repo is the registry. It is NOT, and must never become:** an MCP Gateway runtime,
a traffic proxy, a tool executor, a Connector Runtime, a secret store / secret injector,
a container orchestrator, an RBAC/tenant platform, a billing system, or a marketplace UI.

If a request pulls toward runtime, secrets, proxying, or orchestration: stop and reframe
it back to registry-only. Store **secret names, never secret values.**

## 4. Where this sits (three-service topology)

```
Official / community MCP registries   → discovery (public, permissive, unvetted)
  ↓ sync
MCP Sub-Registry  (THIS REPO)         → curation, approval, projection   registry.toolhost.online
  ↓ /v0.1/gateway/catalog  (read-only, disabled drafts)
MCP Gateway       (separate product)  → runtime governance, routing, policy, audit
  ↓
MCP Connector Runtime (separate)      → stdio/process/container execution as HTTP/SSE
```

Separate deployable units, even if co-located on one VPS. Do not merge Gateway or
Connector Runtime into this repo. Package/stdio servers are **not** direct hosted-gateway
candidates — they require the Connector Runtime first.

## 5. The single output that matters

Two read endpoints carry the trust decision; the gateway projection is the keystone:

- `GET /v0.1/catalog` — approved + visible records, MCP-Registry-compatible shape,
  curation under `_meta["com.mcp-gateway.registry/curation"]`.
- `GET /v0.1/gateway/catalog` — the **gateway projection**. Approved + public only.
  Stable `catalogItemId`, content hash, `gateway_compatibility`, readiness, required
  secret/config **names**, packages/remotes, tool count. The Gateway imports these as
  **disabled drafts**. Forbidden fields: `enabled`, `runtimeEnabled`, `approvedForRuntime`,
  secret values, tokens, live session IDs, call payloads, routing policy.

Both must exclude: pending, hidden, rejected, invalid, private, deleted, removed-upstream.
Full contract: `docs/GATEWAY_CONTRACT.md` and `docs/API.md`.

## 6. Repo map

```
apps/api/src        Hono API, services, Drizzle schema, routes, schemas
apps/web/src        React/Vite operator console (built → apps/web/dist, gitignored)
packages/shared     metaKeys constants + shared types
drizzle/            SQL migrations
tests/              Vitest unit + integration (integration needs live Postgres)
data/               default-curated-servers.json (the trusted seed catalog)
docs/               Production reference docs + docs/research/ (landscape reports)
```

## 7. Stack & commands

TypeScript · Bun · Hono · PostgreSQL · Drizzle · Zod · Vitest · React/Vite · Docker.

```sh
bun install
docker compose up -d          # local Postgres
cp .env.example .env           # DATABASE_URL, ADMIN_API_KEY, PORT, NODE_ENV
bun run db:migrate
bun run dev                    # API on PORT (default 8080)
bun run typecheck && bun run test
bun run seed:curated           # load data/default-curated-servers.json
bun run validate:curated
```

## 8. Production & git discipline (non-negotiable)

The remote is **private** (`AI-with-Tamil` on GitHub). Treat it as a real production
system under load.

- **Commit only production-ready, meaningful content.** Code, tests, migrations, config,
  `docs/`, `CLAUDE.md`, `README.md`, the seed. Nothing else.
- **Never commit:** secrets/`.env`, `node_modules`, build output (`dist`), local working
  notes, scratch plans, other-tool configs, screenshots, throwaway scripts. `.gitignore`
  enforces this — keep it tight.
- **Every commit message must make sense on its own.** Conventional Commits
  (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`). Imperative, specific, honest.
- **Verification gate before every commit and deploy** (see §11). Green typecheck + tests
  or an explicitly recorded blocker. Never report done on red.
- Migrations are an explicit deploy step (`bun run db:migrate`) before promoting the service.

## 9. Session operating loop — run skills, stay lean

Work is organized as **skills** in `.claude/skills/` (modular, loaded on-demand so context
stays lean across continuous work). Every session:

1. Run **`subregistry-boot`** — it establishes role + boundary, checks live state, and routes
   you to the right skill without loading the whole repo.
2. Pick ONE highest-value unblocked action → invoke its skill:
   - `subregistry-research` — periodic ecosystem research (the daily cron target)
   - `subregistry-curate` — add trusted servers, one researched group at a time
   - `subregistry-audit` — re-verify cataloged servers (reachability + security)
   - `subregistry-deploy` — push committed changes to the live VPS, verified via Caddy
3. Work one small slice. Inspect real code before editing; validate with Zod; keep shapes stable.
4. Run the verification gate (§11). Commit production-ready work with a clear message; push.
5. Update §13 (and the relevant `docs/`) when behavior or status changes. Report honestly:
   what changed / remains / is blocked / is verified.

**Context discipline:** prefer targeted `grep`/reads; never read `node_modules`, build output,
or agent transcripts; one slice per session — record extra work in §13, don't expand scope.
Durable state lives in `CLAUDE.md` (§13), `docs/`, `docs/research/`, and git — never only in chat.

## 10. Proactive charter (your standing work)

You do not wait to be asked. Standing responsibilities:

- **Daily ecosystem research.** Wake on a schedule (see §12), web-research the MCP
  ecosystem from every angle — official registry/spec changes, new sub-registry/gateway
  players, security incidents, provenance/signing developments — and write a dated report
  to `docs/research/`. Update the running landscape when material changes.
- **Top-10 sub-registry tracking & ranking.** Maintain a ranked view of the significant
  MCP registry/catalog/gateway players (size, curation quality, trust signals, governance,
  freshness). Keep `docs/research/landscape.md` current as the canonical ranking.
- **Catalog maintenance.** Keep the curated seed (`data/default-curated-servers.json`)
  trustworthy: verify endpoints, pin/approve specific versions, retire dead servers,
  flag rug-pull / tool-poisoning risk, expand the trusted set deliberately.
- **Production operation.** Keep the service deployable and healthy; tighten the
  gateway projection contract; harden against the boundary leaking runtime concerns.

## 11. Verification / launch gate

Before any commit-to-main or hosted promote, verify:

- `bun run typecheck` passes
- `bun run test` passes (integration tests need live Postgres)
- `bun run validate:curated` passes
- migrations apply cleanly
- `GET /health` returns ok (no auth)
- `GET /v0.1/catalog` returns only approved + visible records
- `GET /v0.1/gateway/catalog` excludes pending/rejected/hidden/private/deleted/removed,
  and leaks **no** runtime/secret fields
- `ADMIN_API_KEY` is strong (>=32 chars in prod) and never printed/committed

## 12. Daily routine (scheduling)

The daily research wake-up runs as a scheduled cloud agent. When set up, it:
fans out web research → writes/updates a dated report in `docs/research/` → refreshes
the ranking in `docs/research/landscape.md` → flags catalog items needing action →
commits the result. Cadence and mechanism are recorded in §13 once live.

## 12.5 Strategy & roadmap

- **First customer is us (dogfood).** Phase 1: power our own gateway with a trusted catalog.
  Get the curation, projection, and trust signals genuinely useful for our own use before
  anything else.
- **Then productize.** The sub-registry becomes a standalone product/business: **persona- and
  use-case-based curated lists** — "*if you are a $ROLE, here are the trusted MCP servers for
  you*" — delivered as tag-based catalog views. These curated bundles are also a wedge to pitch
  and sell the MCP Gateway.
- **Co-evolve with the gateway.** The gateway (separate product, live on the same VPS) is
  adding runtime — e.g. hosting a stdio MCP server and exposing it as streamable-HTTP via a
  Connector Runtime. Monitor the gateway's progress and customize the sub-registry's projection
  + compatibility metadata to serve what it actually consumes. Never absorb runtime here.
- **Moat:** provenance, verification, version-pinning, and change-detection (see
  `subregistry-audit`) — the trust the aggregators lack.

## 13. Current state (living section — keep this honest)

**As of 2026-06-30 (daily research pass):**

- **Status:** Foundation complete and live; now self-operating via skills. Identity in this
  file, reference docs in `docs/`, maintenance processes in `.claude/skills/`, scratch out of
  git. **Private remote:** `github.com/AI-with-Tamil/mcp-sub-registry` (`master`).
- **Production:** the registry runs live on Hostinger VPS `947510` (compose project
  `mcp-sub-registry`, at `/home/tamil/deployments/mcp-sub-registry-launch/`), co-located with
  the gateway + Caddy. Updated to current `master` on 2026-06-15 (code live, db preserved,
  gateway untouched). **HTTPS live as of 2026-06-17** — added registry block to Caddyfile
  (`/home/tamil/deployments/mcp-gateway/deploy/Caddyfile.gateway.example`), restarted caddy,
  Let's Encrypt cert provisioned via HTTP-01 ACME. HTTP→HTTPS 308 redirect active.
  Update via `ssh hostinger-vps` + `subregistry-deploy`.
- **Catalog:** 19 approved/public remote servers (`data/default-curated-servers.json`). Last
  curate run 2026-06-15 (commit `7b4c8bd`): added `com.aws/mcp-knowledge` (AWS Knowledge MCP,
  no-auth public endpoint, live-verified HTTP 200 MCP initialize) and `com.aws/mcp` (AWS MCP
  Server, IAM SigV4 via mcp-proxy-for-aws, live-verified HTTP 200 MCP initialize). Previous
  run (commit `85278d5`): added `com.exa/mcp` and `com.context7/mcp`. Skipped: HubSpot MCP
  (mcp.hubspot.com — blocked by environment egress, external verification pending), Google Cloud
  MCP (no single universal endpoint), Salesforce + Azure DevOps (org-specific URLs).
  Servers added since last VPS deploy: Stripe, Vercel, Asana, Webflow, Exa, Context7, AWS
  Knowledge MCP, AWS MCP Server — not yet live on VPS — publish via `subregistry-deploy`.
- **Audit 2026-06-16 (security-elevated):** acted on the same-day research flag (Clawdbot /
  Akamai unauthenticated-DB-MCP incident class). Live-verified `com.supabase/mcp`,
  `com.neon/mcp`, and `com.sentry/mcp` — all return **HTTP 401** to an unauthenticated GET and
  `initialize` POST, confirming the endpoints are OAuth/PAT-gated, **not** the open pattern
  Clawdbot exploited. Bumped `verifiedAt` → 2026-06-16 and recorded the post-incident
  re-verification in each entry's notes. No cataloged vendor was named in any active incident.
  `com.sentry/mcp` was already `verification.status: verified` (set by the 2026-06-15 audit), so
  that stale backlog item is closed. All entries stay `approved`/`public` — nothing demoted.
- **Scheduled-skills test (2026-06-15):** proved the autonomous skills-via-scheduler pipeline
  end to end. Three `run_once_at` cloud triggers (audit 11:52Z, research 12:00Z, curate 12:11Z)
  each booted from a cold checkout, followed its committed SKILL.md, did real verified work, and
  pushed to private `master` — concurrently, without losing each other's commits (rebase rule
  held). Audit fixed the Sentry URL; research wrote a 49-cite second-pass report; curate grew the
  catalog with correct dedup + boundary discipline. Gate stayed green throughout.
- **Baseline:** typecheck green; 52 tests pass / 27 skipped (skipped = DB integration,
  no live Postgres in this run). Fixed stale warning assertion in curated-validation.test.ts
  (sentry confirmed verified by 2026-06-15 audit; no longer warns).
- **CI:** GitHub Actions (`.github/workflows/ci.yml`) runs typecheck + UI build + migrations
  + full suite on a Postgres service for every push/PR. Verified green on the runner.
- **Daily routine:** PROVEN working (`trig_01Qcs8v4NSi57NncffqQxBQN`, daily 06:03 IST,
  Sonnet 4.6). First scheduled test run on 2026-06-15 wrote a 49-citation dated report and
  updated the ranking (commit `9634758`). A second scheduled test run (same date) appended
  new findings: NSA MCP security guidance (May 20), VIPER-MCP 106 zero-days, Akamai database
  flaws (one unpatched by Alibaba), Runlayer $11M raise + MCP founder consulting, AWS Agent
  Registry April 2026 preview, Docker MCP Catalog detail, Censys 12,520 accessible MCP
  services (40% unauthenticated), Sentry endpoint confirmed. GitHub access + network egress
  confirmed across both runs. The loop is self-sustaining; review its commits each session.
- **Research:** landscape + top-11 ranking in `docs/research/`. Ranking updated 2026-06-28:
  Runlayer elevated to #3 (from #11) after $30M Series A (June 24; total $42M; see June 28
  findings above). Prior update 2026-06-21:
  Palo Alto Networks / Prisma AIRS elevated to #4 (acquired Portkey May 29, 2026 — trillions
  of tokens/month, Prisma AIRS 3.0 AI Gateway). Kong MCP Registry dropped to honorable
  mention (feature, not a standalone product). NSA guidance (May 20, 2026) independently
  validates `discovered != approved != enabled` — strongest external signal yet. Key thesis:
  clean separation is rare; Obot + Lunar.dev MCPX do it cleanly; Palo Alto + Runlayer +
  Docker + AWS Agent Registry are the credible enterprise entrants.
  Active threats (June 2026): (1) Mini Shai-Hulud npm worm injects prompt injection into tool
  descriptions. (2) **SANDWORM_MODE** (June 16) — npm worm injecting malicious MCP server
  configs into Claude Code / Cursor / VS Code via 19 typosquatted packages. (3) **Miasma
  Waves 1–3** — Wave 1 (June 1): 32 `@redhat-cloud-services` packages; Wave 2 (June 3):
  `@vapi-ai/server-sdk`; **Wave 3 (June 17): `@mastra` npm org — 144 packages backdoored in
  88 minutes, 1.1M weekly downloads exposed, cross-platform RAT (166 crypto wallet extensions
  + credential harvest)**. Phantom Gyp technique documented; derivative attacks expected H2 2026.
  (4) **IronWorm** (June 2026) — Rust/eBPF kernel rootkit npm stealer; 50+ poisoned packages from
  compromised account "asteroiddao"; targets 86 env vars (Anthropic/Claude, OpenAI Codex, Gemini,
  AWS, Docker, K8s, Exodus wallet credentials); uses eBPF to hide from scanners.
  (5) **Miasma new variant + Hades wave** (June 2026) — 57 packages, 286 malicious versions;
  drops lifecycle hooks, executes via `binding.gyp` (Phantom Gyp); 3 Red Hat MCP packages targeted;
  **Hades wave crossed to Azure (73 repos disabled) + PyPI (37 malicious Python wheels)** — worm is now
  cross-platform. Remote-HTTP-only catalog is structurally immune to all items (1)–(5).
  (4) CVE-2026-27825/27826 "MCPwnfluence" — CVSS 9.1 RCE + SSRF in `mcp-atlassian` Python package
  (patched 0.17.0; our catalog uses official remote server, unaffected). (5) CVE-2026-25536 —
  MCP TypeScript SDK cross-client data leak, patched in SDK 1.26.0; **audit pass pending** to
  verify all TypeScript SDK vendors in catalog are running >=1.26.0. (6) **Agentjacking** (CSA
  June 12, 2026) — 2,388 orgs exposed via Sentry DSN injection; Sentry MCP server faithfully
  returns attacker-controlled event data to AI agents; Sentry declined platform-level fix;
  `com.sentry/mcp` endpoint remains auth-gated (401 on unauthenticated) — no catalog demotion,
  but operators must treat Sentry event content as untrusted external data. (7) **BlueRock
  Security SSRF** (June 2026) — 36.7% of 7,000+ MCP servers SSRF-vulnerable; Microsoft Markitdown
  MCP exploited to extract AWS IAM credentials from EC2 metadata endpoint. Clawdbot (Jan 2026)
  fully documented. All 19 catalog servers remain approved/public; remote-HTTP model is the
  correct defense against all npm/repo-based worm vectors. Detail in June 19 report.
  (7) **OX Security "Mother of All AI Supply Chains" (April 2026):** systemic STDIO RCE across 200k+
  instances, 9/11 registries successfully poisoned in PoC testing, 14 CVEs (CVE-2026-30615
  Windsurf zero-click, CVE-2026-11624 DNS rebinding). Anthropic declined to change STDIO transport
  design. Remote-HTTP-only catalog is structurally immune. Full detail in June 18 report.
  SEP-2127 / MCP Server Cards (/.well-known/mcp/server-card.json): Working Group active, term ends
  Aug 14, 2026; may land post-RC rather than in the July 28 spec. Claude Desktop + Cursor already
  shipping support — once merged, `subregistry-audit` can use this to auto-verify tool counts
  and protocol version on cataloged endpoints.
  **Salesforce Agentforce MCP GA (June 15, 2026)**: bidirectional MCP at GA; org-specific URLs
  keep it out of our catalog but watch list updated in landscape.md.
  **Spec RC breaking changes (June 18 research):** `initialize`/`initialized` handshake removed;
  `Mcp-Session-Id` deprecated; `_meta` carries capabilities + W3C trace context; `ttlMs`/`cacheScope`
  added; Roots/Sampling/Logging deprecated; error code -32002 → -32602. No catalog schema change.
  **June 21 new findings:** (1) **IronWorm + Miasma new variant** — see Active threats above.
  (2) **Adversa AI MCP Security TOP 25** — industry's first comprehensive MCP vulnerability
  classification (25 categories; prompt injection #1; living framework).
  [[adversa.ai]](https://adversa.ai/mcp-security-top-25-mcp-vulnerabilities/)
  (3) **OWASP MCP Top 10 Phase 3 beta** — stable/citable; MCP01:2025–MCP10:2025; NSA guidance
  cross-mapped to OWASP Top 10 by Equixly (June 4). Two independent frameworks now explicitly
  validate `discovered != approved != enabled` as the correct control.
  (4) **MACH Alliance MCP Registry** — new landscape entrant; vendor-neutral, enterprise-focused;
  added to watch list.
  (5) **Smithery hosting policy change** — free tier ended March 1, 2026; rebuilding from scratch;
  server count contracting.
  (6) **JFrog MCP Registry GA March 18** — proactive blocking, policy enforcement at request time
  confirmed; closes rank #2 in landscape.
  (7) **HubSpot no-DCR confirmed** — pre-registered client_id + secret required; mcp-remote workaround;
  note in catalog entry auth.notes when curating.
  (8) **Glama 38,524** (+368 since June 20); **spec countdown 37 days** to July 28 RC final.
  **June 22 new findings:** (1) **Trend Micro cloud threat escalation** — 1,467 exposed MCP servers
  (3x baseline), 74% hosted on AWS/Azure/GCP/Oracle, CVSS 9.8 command injection in unofficial AWS/Azure
  community servers (not our catalog entries). AI sweep of 19,000 repos: SQL injection 26% + RCE 22.5%.
  (2) **CVE-2026-20205** (Splunk MCP Server, April 15, CVSS 7.2) — token leak in logs, patched in v1.0.3;
  first known CVE against a major enterprise vendor's packaged MCP Server app; not in catalog.
  (3) **CVE-2026-23744** (MCPJam Inspector RCE) — crafted HTTP triggers code execution on inspector host.
  (4) **The Vulnerable MCP Project** (vulnerablemcp.info) — new open-source CVE database for MCP.
  (5) **Adversa AI AIRQ Framework** (June 4) — 100+ agents scored on attack surface, blast radius, defenses;
  OWASP/CoSAI/CSA/NIST contributors; open-source at airq.adversa.ai.
  (6) **CoSAI white paper** (Jan 2026) key stats: 43% of public MCP servers have >=1 vulnerability; 5.5%
  have poisoned tool descriptions in production.
  (7) **Pinterest case study** — 66k invocations/month, 844 users, 7k engineering hours/month saved,
  internal central registry + two-layer JWT + mesh identity auth. Validates registry-then-runtime pattern.
  (8) **MCP 2026 Roadmap** published — stateless horizontal scaling, Tasks retry/expiry, enterprise
  SSO/audit, governance delegation model for Working Groups.
  (9) **Glama 44,392** (+5,868 since June 21, likely batch indexing); **spec countdown 36 days**.
  **June 20 new findings:** (1) **Backslash Security** — three new attack surfaces in 2026-07-28 spec:
  MCP Apps iframes invisible to network gateways; stateless transport breaks DPI-based session policy;
  Tasks extension enables cross-client task handle hijacking. All three require endpoint-level security.
  [[Backslash]](https://www.backslash.security/blog/new-mcp-spec-opens-new-attack-surfaces)
  (2) **AAIF** now 170 member orgs (fastest growth in Linux Foundation history); India summits complete
  (Bengaluru June 9–10, Mumbai June 14–15); formal project lifecycle policy approved.
  (3) **Atlassian SSE shutdown June 30** (10 days) — our catalog already on streamable HTTP endpoint.
  (4) **AWS Agent Registry** + **MCP Tunnels** both remain in preview; no GA.
  (5) **Qualys MCP Shadow IT** (March 2026) + CSA: 82% of enterprises have unknown AI agents;
  47% of ~3M deployed agents unmonitored. Sub-registry approval workflow is the mitigation.
  (6) **Glama count** now 38,156 (up ~1,170 since June 19). PulseMCP ~18,570+.
  (7) **HubSpot OAuth**: GA confirmed, OAuth 2.1 + PKCE required, no DCR — community auth failures
  in LibreChat/Kiro noted; account for no-DCR requirement in next curate entry.
  **June 23 new findings:** (1) **Enterprise-Managed Authorization (EMA / SEP-990) stable June 18,
  2026** — Anthropic + Okta zero-touch MCP connector provisioning for enterprise IT. 7 connectors at
  launch: Asana, Atlassian, Canva, Figma, Granola, Linear, Supabase. **5 of 7 are in our catalog** —
  strongest external signal yet that our curation criteria align with enterprise trust requirements.
  Slack EMA support coming. [[MCP Blog]](https://blog.modelcontextprotocol.io/posts/enterprise-managed-auth/)
  (2) **MCP spec RC countdown: 35 days** to July 28 final. RC locked May 21. All breaking changes
  confirmed: stateless core (no `Mcp-Session-Id`, no initialize handshake); new `Mcp-Method`,
  `Mcp-Name`, `MCP-Protocol-Version: 2026-07-28` headers; `_meta` per-request; MCP Apps (SEP-1865)
  + Tasks as official extensions; 6 SEPs for OAuth 2.0/OIDC auth hardening; Roots/Sampling/Logging
  deprecated (12-month window). No catalog schema change. [[RC blog]](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)
  (3) **Atlassian SSE shutdown June 30** (7 days) — catalog already on Streamable HTTP. No action.
  (4) **Docker MCP Toolkit June 2026**: warning banner for unverified community servers mirrors
  our `approved` vs `discovered` distinction; 300+ verified containers; CVE-2026-33990 fix.
  (5) **PulseMCP 19,180–19,240+**; **Glama 44,392** (steady). Trust gap: 65k+ indexed vs. 19 approved.
  (6) **AAIF MCP Dev Summit North America** (NYC, April 2–3, 1,200 attendees): new Executive Director
  Mazin Gilbert; formal project lifecycle policy (Growth/Impact/Emeritus) approved; AgenCon +
  MCPCon Europe (Amsterdam Sept 17–18) + North America (Oct 22–23) scheduled.
  (7) **Obot v0.14**: MCP Registry Support — IT admins define approved catalog, visible in VS Code
  + GitHub Copilot. (8) No new CVEs or incidents since June 22.
  **June 24 new findings:** (1) **Glama 47,579** (+3,187 since June 22; 290,691 tools indexed);
  **PulseMCP 19,410+** (+170 since June 23). Cross-registry estimate now ~72–73k. **Spec countdown
  34 days** to July 28.
  (2) **Security Boulevard: 973 MCP npm packages, 71% single-maintainer, 56% < 30 days old, 25%
  no source repo** — new quantitative research on MCP ecosystem concentration risk; 9/11 registries
  failed to detect malicious uploads; every STDIO package can execute OS commands on install.
  Remote-HTTP-only catalog is structurally immune to all measured STDIO/npm risk vectors.
  [[Security Boulevard]](https://securityboulevard.com/2026/06/973-mcp-packages-71-single-maintainer-a-practitioners-guide-to-ai-developer-security/)
  (3) **GitGuardian 2026 Secrets Sprawl:** 24,008 unique secrets in MCP config files on public
  GitHub; 2,117 confirmed live; AI-service leaks +81% YoY. Root cause: official quickstart docs
  recommend embedding credentials in plaintext JSON config. Our schema stores secret *names* only —
  never values. [[GitGuardian]](https://www.gitguardian.com/state-of-secrets-sprawl-report-2026)
  (4) **UNC1069 / Axios WAVESHAPER.V2 (March 31, 2026):** North Korea-nexus actor compromised
  `axios` npm package; WAVESHAPER.V2 backdoor active for ~3h; malware enumerated and injected rogue
  server definitions into MCP config files for Claude Code, Cursor, Windsurf, and VS Code Continue
  (Lorikeet Security analysis). First confirmed nation-state targeting of MCP config files as
  exfiltration/persistence vector. [[GTIG blog]](https://cloud.google.com/blog/topics/threat-intelligence/north-korea-threat-actor-targets-axios-npm-package)
  (5) **AGNTCon + MCPCon China (MCP Dev Summit Shanghai)** announced; CFP closed May 29; schedule
  announcement July 8, 2026; event Q3 2026. [[Shanghai CFP]](https://www.lfopensource.cn/mcp-dev-summit-shanghai/)
  (6) New security resources: **Authzed Timeline of MCP Security Breaches** (historical incident
  index), **PipeLab State of MCP Security 2026** (attack pattern analysis), **Adversa AI Top MCP
  Security Resources June 2026** (CVE + framework roundup).
  **June 26 new findings:** (1) **CVE-2026-54309** (n8n MCP browser HTTP transport,
  published June 23, 2026) — `@n8n/mcp-browser` with `--transport http` accepts unauthenticated
  MCP sessions; browser-control exposure (navigation, JS eval, cookies); patched in n8n v2.25.7 /
  v2.26.2; default stdio unaffected; not in catalog. (2) **CVE-2026-26118** (Azure MCP Server
  SSRF, June 2026) — attacker-supplied URL causes managed identity token capture; Azure org-specific
  endpoint, not in catalog. (3) **Shai-Hulud PyPI Hades wave (June 9)** — 23 MCP-themed PyPI
  packages compromised (langchain-core-mcp, openai-mcp, instructor-mcp, tiktoken-mcp,
  ray-mcp-server); total campaign 471 artifacts; remote-HTTP-only catalog immune.
  (4) **Slack Marketplace MCP Registry (GA, June 2026)** — Slackbot MCP client GA with 20+
  partner apps; Slack Marketplace now hosts an in-product MCP registry with workspace-admin
  approval flow; `com.slack/mcp` already in catalog; landscape watch list updated.
  (5) **Atlassian SSE shutdown June 30** — 4 days away; our `com.atlassian/mcp` is already on
  Streamable HTTP (`https://mcp.atlassian.com/v1/mcp`); confirmed no action needed.
  (6) **Registry scale**: Glama **48,480** (+437 since June 25); PulseMCP 19,500+.
  **Spec countdown: 32 days** to July 28 RC final.
  **June 30 new findings:** (1) **Atlassian SSE endpoint DEAD** — confirmed shut down today as
  scheduled; our `com.atlassian/mcp` already on Streamable HTTP (`https://mcp.atlassian.com/v1/mcp`);
  no catalog action needed. Industry milestone: SSE is now dead for major vendors ahead of July 28 spec.
  (2) **MCP Python SDK v2 beta slipped** — expected today, did not ship; latest release is v2.0.0a3
  (June 26, 2026); stable v2 target remains July 27. Vendors should pin `mcp>=1.27,<2` until ready to
  migrate. (3) **Spec countdown: 28 days** to July 28 final; no new RC changes. (4) **Clean security
  window June 29–30** — no new CVEs or incidents. CVE-2026-25536 TypeScript SDK audit still pending
  (verify all TS-SDK vendors ≥1.26.0; also covers CVE-2026-0621 ReDoS, patched in v1.25.2).
  (5) **Registry scale stable**: Glama ~49,800+ (estimated); PulseMCP ~20,200+ (estimated); cross-registry
  estimate ~74,000–75,000+ indexed. 19 approved in our catalog. All 19 remain approved/public.
  **June 28 new findings:** (1) **Runlayer $30M Series A (June 24, 2026)** — largest pure-play
  enterprise MCP governance funding to date (total $42M; led by Felicis/Khosla). Customers:
  Instacart, Gusto, Decagon, Opendoor, dbt Labs, AngelList, Lemonade + Fortune 500s. Architecture
  enforces `discovered != approved != enabled` — exact match to our boundary discipline. Landscape
  ranking updated: Runlayer elevated to #3 (from #11). Vinod Khosla quoted wanting "every available
  dollar" of the round.
  [[Fortune]](https://fortune.com/2026/06/24/exclusive-vinod-khosla-felicis-runlayer-nanit-30-million-enterprise-ai/)
  (2) **PulseMCP crossed 20,000 milestone** — now 20,040+ (was 19,620+ June 27). Glama 49,411
  (+401 since June 27). Cross-registry estimate ~74,000+. **Spec countdown: 30 days** to July 28.
  (3) **MCP Python SDK v2 beta T-2 days** (June 30); Atlassian SSE shutdown T-2 days — catalog on
  Streamable HTTP, no action. (4) **Smithery ~7,000 servers** (contracting; free tier ended Mar 1;
  infra rebuild; path traversal vuln patched). (5) **SEP-2127 WG term ends Aug 14** — Server Cards
  will land post-RC; Claude Desktop + Cursor already shipping support. (6) **Clean security day** —
  no new CVEs or incidents June 28. CVE-2026-25536 TypeScript SDK audit still pending (next
  `subregistry-audit` pass).
  **June 27 new findings:** (1) **Bitwarden CLI supply chain attack (April 22, 2026)** — first
  documented supply chain attack to explicitly target AI coding tool credentials and MCP config
  files. `@bitwarden/cli@2026.4.0` (90-minute exposure; 334 downloads); payload collected Claude
  Code, Cursor, Codex CLI, Aider configs alongside cloud credentials; part of Shai-Hulud/Checkmarx
  worm family. Not in catalog; validates secret-names-only schema design.
  [[SecurityWeek]](https://www.securityweek.com/bitwarden-npm-package-hit-in-supply-chain-attack/)
  [[OX Security]](https://www.ox.security/blog/shai-hulud-bitwarden-cli-supply-chain-attack/)
  (2) **MCP Python SDK v2 beta due tomorrow** (June 30, 2026): v2.0.0a1 shipped June 11;
  beta June 30; stable v2 July 27 (1 day before final spec). Vendors using Python SDK should pin
  `mcp>=1.27,<2`; cataloged Python-SDK vendors must ship v2-compliant versions before July 28.
  [[python-sdk]](https://github.com/modelcontextprotocol/python-sdk)
  (3) **AWS Agent Registry** (Preview): new features — Web Search as MCP connector (built on Amazon
  search infrastructure, zero egress), Bedrock Guardrails in policy (prompt injection + harmful
  content enforcement at gateway layer). Still Preview; no GA date.
  [[AWS release notes]](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/release-notes.html)
  (4) **Atlassian SSE shutdown T-3 days** (June 30); catalog on Streamable HTTP — no action.
  (5) **agentic-community/mcp-gateway-registry**: bi-weekly release cadence; recent additions —
  OAuth coding-assistant integration (v1.25.0), CIMD support, RFC 8707 resource-parameter
  enforcement. Active OSS reference for gateway+registry separation.
  [[GitHub]](https://github.com/agentic-community/mcp-gateway-registry)
  (6) **SEP-2127 Go library** published (`olgasafonova/mcp-servercard-go`); second language
  implementation of MCP Server Cards alongside Python reference demo.
  (7) **Registry scale**: Glama **49,010** (+530 since June 26); PulseMCP **19,620+** (+120).
  Cross-registry estimate ~74,000+. **Spec countdown: 31 days** to July 28 RC final.
  **June 25 new findings:** (1) **Salesforce Agentforce 3 (June 23, 2026)** — three new vendor-operated
  MCP servers: Salesforce DX MCP Server, Heroku Platform MCP Server, MuleSoft MCP Server. Total
  Salesforce MCP servers now 4+; all org-specific URLs, not catalogable. Watch list in landscape.md
  updated. (2) **AAIF inaugural Ambassador Cohort (June 23, 2026)** — 138 ambassadors across 41 countries.
  (3) **AAIF event dates confirmed:** Seoul (Aug 13–14), Shanghai (Sept 6–7), Tokyo (Sept 10–11), Amsterdam
  (Sept 17–18), North America (Oct 22–23). (4) **Glama 48,043** (+464 since June 24; 6,279 connectors;
  293,804+ tools); **PulseMCP 19,500+**. **Spec countdown 33 days** to July 28.
  (5) **Google Cloud 50+ managed MCP servers** at GA/preview confirmed (Google Cloud Next '26); all
  service-scoped, not catalogable. (6) **Atlassian SSE shutdown June 30** — 5 days away; catalog
  already on Streamable HTTP. (7) **No new CVEs on June 25** — clean day.
- **UI (2026-06-17):** Full React frontend rebuilt from scratch to achieve visual parity with
  `apps/web/prototype.html`. Root cause of the 30% gap was Tailwind v4 failing to generate
  arbitrary-value classes (`bg-[var(--s1)]`, `grid-cols-[1fr_40px...]`, etc.). Fix: ported
  the entire prototype CSS verbatim into `globals.css` as named classes (`.pipe-col`, `.tbl`,
  `.detail`, `.sidebar`, etc.) and rewrote every component to use those class names directly.
  Added the `/upstream` page (was missing from the implementation), restored the 4-column
  pipeline (Upstream → Discovered → Approved → Gateway), trust timeline in the detail panel,
  security checklist, cfg-block, all feed/stat cards. Build: 29.88 kB CSS. Commit: `3b985d9`.
  Dev server: `bun run dev:web` → `http://localhost:5173/`. Tests: 50 pass / 27 skipped.
- **Public catalog UI LIVE (2026-06-19):** Deployed to production at `registry.toolhost.online`.
  Commit `e873967`: added server routes `/servers` + `/server/*` (SPA, `webIndexResponse()`),
  `/llms.txt` route, meta tags + JSON-LD DataCatalog in `index.html`, `apps/web/public/llms.txt`
  (copied to `dist/` by Vite build). Fixed Caddy 502: updated live Caddyfile
  (`/home/tamil/deployments/repo/mcp-gateway/deploy/Caddyfile.gateway`) from
  `host.docker.internal:8080` → `172.17.0.1:8080` (Linux Docker bridge; `host.docker.internal`
  doesn't resolve inside the Caddy container on Linux). Restarted Caddy container.
  Verified: `/health`, `/servers`, `/server/:slug`, `/llms.txt`, `/v0.1/gateway/catalog` all
  200 through HTTPS. Gateway unchanged and healthy.
- **Next actions (ordered):**
  1. Seed the 19-server catalog into the live DB (`subregistry-deploy` → `seed:curated` on VPS).
  2. Next `subregistry-curate` run: **Comms & support group** — HubSpot (NOW UNBLOCKED — GA
     confirmed April 13, `https://mcp.hubspot.com/mcp`, OAuth 2.1 + PKCE), Intercom, Zapier.
     HubSpot endpoint confirmed live in second-pass June 17 research.
  3. Next `subregistry-audit` pass: (a) ~~verify `com.asana/mcp` SSE endpoint~~ **DONE 2026-06-18** —
     Asana V1 SSE endpoint was dead (shut down May 11); updated to V2 Streamable HTTP
     `https://mcp.asana.com/v2/mcp` in this commit. (b) **PRIORITY: Verify all TypeScript SDK-based
     vendors are running >=1.26.0** (CVE-2026-25536 cross-client data leak + CVE-2026-0621 ReDoS — both
     patched by v1.26.0). ~~Atlassian SSE deprecated June 30~~ — **DONE: Atlassian SSE shutdown June 30
     confirmed; our entry already on Streamable HTTP, no action needed.** (c) Any remaining SSE-typed
     entry should be audited for migration to Streamable HTTP — industry-wide pattern now complete.
     (d) CVE-2026-11624 DNS rebinding: confirm all cataloged vendors run MCP server >=v0.25.
  4. Set up a weekly `subregistry-audit` cadence after #2 curate run completes.
  5. Roadmap item: add `provenance.attestation_url` + `provenance.signing_method` fields to
     approved server schema when Sigstore-signed MCP artifacts become common upstream
     (MDPI Future Internet 18(5):243 proposal; no action needed now).
  6. Track the 2026-07-28 spec RC (stateless; mandatory `Mcp-Method`/`Mcp-Name`; `_meta`;
     ships July 28 — **28 days**) for the Gateway operator; no catalog schema change needed.
     MCP Python SDK v2 beta slipped past June 30 (latest: v2.0.0a3 June 26); stable v2 target
     July 27 — cataloged Python-SDK vendors must ship v2 compliance before July 28.
  7. Once SEP-2127 (MCP Server Cards) merges into spec (WG term ends Aug 14, 2026 — may be
     post-RC), extend `subregistry-audit` to GET `/.well-known/mcp/server-card.json` on each
     cataloged server origin and record tool count + version in `verification.notes`. No schema
     migration needed now.
  8. Anthropic MCP Tunnels (research preview, May 2026): when GA, consider tracking
     `remotes[].type: "mcp-tunnel"` as a new endpoint archetype for private-network servers.
