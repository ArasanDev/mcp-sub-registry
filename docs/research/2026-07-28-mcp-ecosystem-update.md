# MCP Ecosystem Update — 2026-07-28

**Produced by:** MCP Sub-Registry autonomous research routine
**Covers:** 2026-07-11 EOD → 2026-07-28 (spec final-release day)
**Prior report:** [2026-07-11-mcp-ecosystem-update.md](./2026-07-11-mcp-ecosystem-update.md)

---

## 1. Headline Summary

- **MCP Specification 2026-07-28 FINAL ships TODAY** — countdown reaches zero; stateless
  core, OAuth 2.1 hardening, MCP Apps / Tasks extensions, JSON Schema 2020-12 for tool
  schemas, and a formal deprecation lifecycle are now the canonical protocol.
  [[RC blog]](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)
  [[AAIF migration guide]](https://aaif.io/blog/mcp-2026-07-28-whats-changing-and-how-to-migrate)
  [[The Register]](https://www.theregister.com/devops/2026/07/23/model-context-protocol-prepares-to-break-with-its-stateful-past/5276722)
- **SDK v2 stable releases**: Python `mcp==2.0.0` targeted July 27 (yesterday); TypeScript
  `@modelcontextprotocol/server` / `@modelcontextprotocol/client` v2.0.0 stable targeting
  today alongside spec.
  [[SDK betas blog]](https://blog.modelcontextprotocol.io/posts/sdk-betas-2026-07-28/)
- **Glama crosses 61k**: ~61,399 servers (up from 53,668 on July 11, +7,731 in 17 days);
  MCPToplist cross-registry aggregate reached 76,803 by July 17.
  [[Glama]](https://glama.ai/mcp/servers)
- **Workato Enterprise MCP Registry** (July 16, 2026): new landscape entrant with 60+
  production-ready MCP servers, full lifecycle governance, and strong boundary discipline.
  [[BusinessWire]](https://www.businesswire.com/news/home/20260716488768/en/Workato-Launches-Enterprise-MCP-Registry-Advancing-the-Enterprise-AI-Control-and-Execution-Platform)
- **SEP-2127 Server Cards path corrected**: the working draft settled on `/.well-known/mcp.json`
  (not `/.well-known/mcp/server-card.json` as previously noted). WG ends Aug 14.
  [[SEP-2127 PR]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)
  [[WG meeting July 13]](https://meet.modelcontextprotocol.io/2026/07/mcp-server-card-working-group-t2UdFEqDlwwg)
- **Security**: No new CVEs affecting any of our 19 cataloged servers. New issues (July 14:
  XSS in MCP Appium; mcp-gitlab path traversal) are community/STDIO packages — not in catalog.
- **Catalog status**: All 19 approved/public. No demotions. HubSpot MCP (#1 curate priority)
  fully confirmed — OAuth 2.1 + PKCE only, no private-app-token path.

---

## 2. MCP Specification 2026-07-28 — Final Release Day

Today is the scheduled publication of the 2026-07-28 MCP specification — the largest
revision of the protocol since its launch, locked as an RC on May 21, 2026.

[[RC announcement (May 21)]](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)
[[TechTimes pre-release coverage (July 27)]](https://www.techtimes.com/articles/321671/20260727/ai-tool-protocol-drops-sessions-tomorrow-mcps-largest-spec-change-since-launch.htm)
[[4sysops technical breakdown]](https://4sysops.com/archives/2026-07-28-model-context-protocol-mcp-stateless-multi-round-trip-routable-headers-authorization-hardening/)

### Breaking changes (already known from RC; no new changes after May 21 lock)

| Area | Change |
|---|---|
| **Sessions** | `Mcp-Session-Id` header removed; initialize/initialized handshake removed (SEP-2575) |
| **Headers** | `Mcp-Method`, `Mcp-Name`, `MCP-Protocol-Version: 2026-07-28` now mandatory |
| **Authorization** | Servers are now formal OAuth 2.1 resource servers; six auth-hardening SEPs active |
| **Extensions** | MCP Apps (server HTML in sandboxed iframes); Tasks (async long-running work) |
| **Schemas** | Tool I/O schemas upgraded from JSON Schema subset → full JSON Schema 2020-12 |
| **Multi-round-trip** | Mid-call tool input now supported (tools can prompt the user mid-execution) |
| **Caching** | `ttlMs` / `cacheScope` for client-side tool/list caching |
| **Deprecated** | Roots, Sampling, Logging (12-month removal window) |

### Implications for this catalog

No catalog schema change required. The gateway projection contract
(`GET /v0.1/gateway/catalog`) is stable. All 19 entries use remote Streamable HTTP and are
auth-gated — the structural match to the new stateless, OAuth-native model.

Cataloged Python-SDK vendors that have not yet migrated to `mcp>=2.0.0` remain on v1 and
will receive security patches for ≥6 months. After the 6-month window, priority audit flag.

---

## 3. SDK v2 — Stable Targets Hit July 27–28

| SDK | Package(s) | Stable target | Notes |
|---|---|---|---|
| **Python** | `mcp==2.0.0` | **July 27, 2026** | Was `2.0.0rc1`; targets 1 day before spec |
| **TypeScript** | `@modelcontextprotocol/server` + `@modelcontextprotocol/client` | **July 28, 2026** | New split packages; ESM-only; Node 20+/Bun/Deno |
| **Go** | `v1.7.0-pre.1` → stable | July 28, 2026 | |
| **C#** | `v2.0.0-preview.1` → stable | July 28, 2026 | |

[[SDK betas blog]](https://blog.modelcontextprotocol.io/posts/sdk-betas-2026-07-28/)
[[TypeScript SDK v2 docs]](https://ts.sdk.modelcontextprotocol.io/v2/)

TS v2 is a **package rename** — the monolithic `@modelcontextprotocol/sdk` splits into
two separate packages. Migration: `npm install @modelcontextprotocol/server @modelcontextprotocol/client`.
v1.x remains supported (security patches) for ≥6 months post-stable.

Vendors using Python SDK should now evaluate migration to `mcp>=2.0.0`. The `mcp>=1.27,<2`
pin was a hedge during the beta period — that period ends today.

---

## 4. Registry & Ecosystem Scale

### Scale Snapshot (July 28, 2026)

| Registry | Count | Change since July 11 | Notes |
|---|---|---|---|
| **Glama** | **~61,399** | +7,731 | Steady daily indexing; page title fluctuates July 25–28 between 61,018–61,446 |
| **MCPToplist cross-registry aggregate** | **76,803+** | +3,000+ (vs ~73,800 July 11) | As of July 17 snapshot |
| **PulseMCP** | **22,240+** | +910 | From 21,330 on July 9 |
| **Official MCP Registry** | **~9,652 servers / ~28,959 versioned** | Unchanged | v0.1 frozen; v1 in dev, no GA date |
| **Smithery** | **~7,000** | Contracting | Free tier ended Mar 1; infra rebuild |
| **Anthropic Claude Connectors** | **343** | Stable | Vendor-curated; highest-trust tier |
| **This catalog** | **19 approved** | No change | All remote-HTTP, all auth-gated |

[[Glama registry]](https://glama.ai/mcp/servers)
[[PulseMCP]](https://www.pulsemcp.com/servers)

The trust gap persists: **~76,803+ indexed vs. 19 approved**. That gap is the product.

### Workato Enterprise MCP Registry (New Entrant, July 16, 2026)

Workato launched an **Enterprise MCP Registry** on July 16, 2026, completing a full
platform play: MCP Composer (build) + Registry (discover/govern) + Gateway/Proxy (secure/enforce).

[[BusinessWire announcement]](https://www.businesswire.com/news/home/20260716488768/en/Workato-Launches-Enterprise-MCP-Registry-Advancing-the-Enterprise-AI-Control-and-Execution-Platform)
[[MarTech Series coverage]](https://martechseries.com/predictive-ai/ai-platforms-machine-learning/workato-launches-enterprise-mcp-registry-advancing-the-enterprise-ai-control-and-execution-platform/)

**Key features:**
- 60+ production-ready Enterprise MCP servers at launch (productivity, CRM, engineering, HR,
  finance, customer support, IT ops, marketing)
- Lifecycle management: development → testing → **publishing → versioning →
  decommissioning**; only approved versions visible to agents — explicit `discovered != approved`
- **Verified User Access**: every AI/agent action executes under the requesting user's identity
  and permissions (not a shared service account)
- MCP Gateway enforcement: authentication, authorization, credential management, rate limits,
  data protection policies

**Catalog assessment:** Per-tenant deployment model (customer-specific URLs); not directly
catalogable in our universal registry. Adds to the watch list as a strong enterprise analogue.
Governance philosophy strongly matches our boundary discipline.

**Landscape impact:** Workato is now the fifth enterprise-registry player alongside JFrog,
Runlayer, Obot, and TrueFoundry — all of whom independently arrived at `approved != enabled`
as the baseline control. This convergence is the strongest external validation yet.

---

## 5. SEP-2127 Server Cards — Path Correction

**CORRECTION from prior reports:** The MCP Server Cards working draft settled on
**`/.well-known/mcp.json`** as the discovery endpoint — not `/.well-known/mcp/server-card.json`
as noted in earlier research reports. Earlier research was based on SEP-1649, which has been
fully superseded by SEP-2127.

[[SEP-2127 PR]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)
[[SEP-2127 source]](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/aa59517442d323a33ed915fc408f1584c4a23dfa/seps/2127-mcp-server-cards.md)
[[WG meeting July 13]](https://meet.modelcontextprotocol.io/2026/07/mcp-server-card-working-group-t2UdFEqDlwwg)
[[Agent Ready validator]](https://agent-ready.dev/mcp-card-validator)

**Status as of July 28:**
- WG charter term ends **August 14, 2026** (17 days)
- Still Draft; WG meeting held July 13
- New validator at `agent-ready.dev` + how-to at `agent-ready.dev/how-to-publish-an-mcp-server-card`
- Claude Desktop + Cursor already shipping support
- Not part of the 2026-07-28 spec; likely post-RC merge

**Subregistry-audit update needed:** When planning the next audit pass, use
`GET /.well-known/mcp.json` (not `mcp/server-card.json`) to check server card support.
This is a **path correction** — CLAUDE.md §13 noted the wrong path.

---

## 6. Security — No Catalog Impact, New Community CVEs

### New CVEs (July 12–28) — None Affect Our Catalog

Two new CVEs surfaced in the July 12–28 window. Neither affects our 19 catalog entries.

| CVE | Affected | CVSS | Type | Status |
|---|---|---|---|---|
| **CVE (MCP Appium)** | MCP Appium package | Medium | XSS via improper input neutralization | Not in catalog |
| **mcp-gitlab path traversal** | `zereight/mcp-gitlab` job_id param | Medium | Arbitrary file read | Not in catalog; STDIO-pattern |

[[CISA vulnerability bulletin July 13]](https://www.cisa.gov/news-events/bulletins/sb26-201)

Both are STDIO/community packages. Our remote-HTTP + auth-gated model is structurally immune.

### Security Posture: Clean Window Holds

No new CVEs affecting any cataloged server since July 7 (Day 13 when we last reported) through today
(Day 30+ clean window). The cumulative picture remains:

- Five independent research frameworks (NSA, OWASP MCP Top 10, OX Security, GBHackers,
  Security Boulevard) all cite remote-HTTP + auth-gated as the structural defense
- Practical DevSecOps confirms: 43% of public MCP servers have ≥1 vulnerability; 5.5% have
  poisoned tool descriptions in production; 73% SSRF-vulnerable in BlueRock scan
  [[Practical DevSecOps stats]](https://www.practical-devsecops.com/mcp-security-statistics-2026-report/)
- Our 19 catalog servers: all remain `approved`/`public`

**Pending audit item still open:** CVE-2026-25536 TypeScript SDK cross-client data leak
(patched in v1.26.0) — TypeScript-SDK vendor audit pass confirming all vendors ≥v1.26.0
has not been run. With SDK v2.0.0 stable today, vendors migrating to v2 automatically clear
this audit gate; vendors staying on v1.x should be on v1.29.0 (current stable).

---

## 7. X (Twitter) MCP — Auth Complexity Assessment

**`https://api.x.com/mcp`** — 200+ endpoints, Streamable HTTP, OAuth 2.0 via xurl bridge.

[[X Dev community announcement]](https://devcommunity.x.com/t/announcing-the-hosted-x-mcp/269558)
[[MCP.Directory guide]](https://mcp.directory/blog/x-twitter-mcp-server)
[[OpenTweet guide]](https://opentweet.io/blog/xmcp-x-official-mcp-server-guide)

**Auth model complexity (new research this window):**
- X killed Free/Basic/Pro API tiers in **February 2026**; moved to pay-per-use credits
- **Cost per action**: $0.015/post created, **$0.20/post if contains URL**
- Pay-per-use enrollment required in a **Production environment** — without it, MCP returns
  `client-not-enrolled` errors
- Follows/Blocks endpoints are **Enterprise-only**; programmatic replies Enterprise-only too
- Headless-only: the MCP only operates in an active conversation; no background scheduling

**Catalog assessment:** The auth complexity (pay-per-use, Production env requirement, no
headless scheduling) significantly lowers catalogability for a no-user-present gateway use
case. Holding at **#2 curate priority** but down-ranking from "verify auth model" to
"confirm gateway-compatible auth path exists before proceeding."

---

## 8. Catalog Hooks — Action Queue

All 19 approved servers remain `approved`/`public`. No demotions.

### HubSpot MCP — Curate Priority #1, Confirmed Ready

`mcp.hubspot.com` — GA since April 13, 2026; OAuth 2.1 + PKCE only (no private-app-token
alternative path); full CRM access (contacts, companies, deals, tickets, engagements,
associations); one-click Claude connector now available.

[[HubSpot GA changelog]](https://developers.hubspot.com/changelog/remote-hubspot-mcp-server-is-now-generally-available)
[[HubSpot MCP developer docs]](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server)

**Status:** All pre-conditions met (GA, endpoint confirmed, auth model documented). Ready for
`subregistry-curate` in the next run.

### AWS Agent Registry Namespace Migration (Aug 6, 2026)

`bedrock-agentcore` namespace → `agent-registry` (9 days away). Our `com.aws/mcp` (AWS MCP
Server, IAM SigV4) is a **distinct product** from AWS Agent Registry — no catalog action
needed. AWS Agent Registry itself remains Preview with no GA date.

[[AWS Agent Registry docs]](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry.html)
[[InfoQ coverage]](https://www.infoq.com/news/2026/04/aws-agent-registry-preview/)

---

## 9. Events & Community

| Event | Date | Location | Note |
|---|---|---|---|
| **MCPCon Seoul** | Aug 13–14, 2026 | Seoul | 15 days away |
| **SEP-2127 WG ends** | Aug 14, 2026 | — | Server Cards final state |
| **AWS namespace migration** | Aug 6, 2026 | — | `bedrock-agentcore` → `agent-registry` |
| **MCPCon Shanghai** | Sept 6–7, 2026 | Shanghai (KubeCon China) | ~40 days |
| **MCPCon Europe** | Sept 17–18, 2026 | Amsterdam | — |
| **MCPCon North America** | Oct 22–23, 2026 | San Jose, CA | — |

MCPCon Shanghai session abstracts remain inaccessible via public crawl. Re-check around
August 1 as the event approaches.

---

## 10. Summary Table

| Angle | Finding | Action |
|---|---|---|
| **MCP spec 2026-07-28** | FINAL ships TODAY — stateless, OAuth 2.1, MCP Apps/Tasks | No schema change; track vendor compliance |
| **SDK v2 stable** | Python July 27; TypeScript July 28 | Vendors can now migrate from beta; v1.x security patch window starts |
| **Glama** | ~61,399 (+7,731 since July 11) | Track |
| **MCPToplist** | 76,803+ (July 17 snapshot) | Trust gap: 76k+ indexed vs. 19 approved |
| **Workato Enterprise MCP Registry** | Launched July 16; 60+ servers; strong governance model | Add to landscape.md watch list |
| **SEP-2127 path** | **CORRECTED: `/.well-known/mcp.json`** (was `mcp/server-card.json`) | Update CLAUDE.md §13; use correct path in audit |
| **CVEs July 12–28** | MCP Appium XSS + mcp-gitlab traversal; neither in catalog | No catalog action |
| **Clean security window** | Day 30+ — no cataloged server CVEs | Continue monitoring |
| **HubSpot MCP** | GA + OAuth 2.1 + PKCE confirmed, one-click Claude connector | **#1 next curate run** |
| **X/Twitter MCP** | Auth complexity (pay-per-use tiers, Production env required) | Hold at #2; verify gateway auth path |
| **TS SDK CVE-2026-25536 audit** | Still pending (all vendors should be ≥v1.26.0 / migrating to v2) | **#1 next audit** |
| **AWS Agent Registry** | Namespace migration Aug 6 | No catalog action; `com.aws/mcp` unaffected |
| **MCPCon Seoul** | Aug 13–14 (15 days) | Watch for catalog candidates |
