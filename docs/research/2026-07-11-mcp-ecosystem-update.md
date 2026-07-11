# MCP Ecosystem Update — 2026-07-11

**Produced by:** MCP Sub-Registry autonomous research routine
**Covers:** 2026-07-10 EOD → 2026-07-11
**Prior report:** [2026-07-10-mcp-ecosystem-update.md](./2026-07-10-mcp-ecosystem-update.md)

---

## 1. Headline Summary

- **Glama crosses 53,668 servers** (+517 vs July 10's 53,151; 7,956+ connectors; 366,331+
  tools) — continued steady growth 17 days out from the July 28 spec final.
- **Large-scale MCP vulnerability scan published (GBHackers):** 9,695 servers analyzed
  across GitHub, Glama, Lobehub, and PulseMCP; 5,832 with security issues; 2,259 confirmed
  exploitable; 2,054 unauthenticated. Biggest systematic security scan yet. Remote-HTTP +
  auth-gated catalog is structurally immune to all file-access and command-injection findings.
- **EMA/SEP-990 detailed InfoQ coverage (July 2026):** Enterprise-Managed Authorization
  confirmed stable; 7 launch connector servers (Asana, Atlassian, Canva, Figma, Granola,
  Linear, Supabase) — **5 of 7 already in our catalog**; Anthropic + Microsoft + Okta as
  integrators.
- **MCPCon Shanghai schedule released (July 8):** 40+ sessions confirmed; event Sept 6–7
  co-located with KubeCon + CloudNativeCon China. Session abstracts not yet accessible.
- **Spec countdown: 17 days** to July 28 final. RC unchanged since May 21 lock. All four
  Tier 1 SDK v2 betas live.
- **Security: Day 13 clean window** — no new CVEs affecting cataloged servers since July 7.

---

## 2. Registry & Ecosystem Scale

### Glama — 53,668 Servers

Glama's registry page reports **53,668 MCP servers** (up from 53,151 on July 10, +517
in ~24h), with connector and tool counts holding steady at 7,956+ remote connectors and
366,331+ total tools. [[Glama]](https://glama.ai/mcp/servers)

The daily growth rate (~500/day) is consistent with the pace observed over the past week,
driven by ongoing automated indexing and new community submissions ahead of the July 28
spec launch.

### Comparative Scale (as of July 11)

| Registry | Count | Notes |
|---|---|---|
| Glama | **53,668** | Automated crawl, all transport types |
| MCPToplist cross-registry aggregate | **~73,800+** | Estimated; last hard data July 3 |
| PulseMCP | **21,330+** | Last spike July 8–9; stable since |
| Official MCP Registry | **9,652** servers / **28,959** versioned | v0.1 frozen; v1 in dev |
| Smithery | **~7,300** | Contracting; free tier ended Mar 1 |
| Anthropic Claude Connectors Directory | **343** verified | Vendor-curated; highest-trust tier |
| **This catalog** | **19 approved** | All remote-HTTP, all auth-gated |

The trust gap between the broadest aggregators (73k+ indexed) and our curated catalog
(19 approved) remains the core thesis: volume is noise; curation is the product.

---

## 3. Security: Large-Scale MCP Vulnerability Scan

### GBHackers / Research: 9,695 Servers Analyzed

A comprehensive large-scale security analysis of **9,695 MCP servers** across GitHub,
Glama, Lobehub, and PulseMCP has been published, identifying significant vulnerabilities
across the ecosystem:

[[GBHackers — Thousands of MCP Servers Found Vulnerable]](https://gbhackers.com/thousands-of-mcp-servers-found-vulnerable/)

**Scale of findings:**
- **5,832 servers** with at least one security issue
- **2,259 confirmed exploitable** (beyond simple authentication gaps)
- **4,982 distinct security issues** across all categories
- **2,054 unauthenticated** (no auth at all; amplifies all other vulnerabilities)

**Vulnerability breakdown:**
| Type | Count |
|---|---|
| Arbitrary file access | 880 |
| Command injection | 476 |
| SSRF | 422 |
| XSS | 211 |
| Prompt injection (malicious) | 185 |

**Key insight from researchers:** "Commonly trusted indicators like popularity, repository
activity, and verification badges do not reliably reflect security posture." This validates
the core premise of curated sub-registries: community verification signals are insufficient;
independent review is required.

**Catalog impact:** All 19 catalog entries use **remote-HTTP transport** with
**authentication required** (OAuth, PAT, or API key). This provides structural immunity
to the dominant finding categories (file access and command injection are STDIO/process-level
attacks; auth-gating blocks unauthenticated SSRF). No catalog action required.

### Security Posture: Day 13 Clean Window

No new CVEs affecting any cataloged server have been identified July 7–11. The cumulative
security picture:
- Remote-HTTP-only model is now the most-cited structural defense in independent research
  (NSA, OWASP MCP Top 10, OX Security, GBHackers large-scale scan, Security Boulevard —
  five independent frameworks)
- All 19 catalog servers remain `approved`/`public`

**Pending audit item:** CVE-2026-25536 TypeScript SDK cross-client data leak (patched in
SDK v1.26.0) — TypeScript SDK vendor audit pass still pending. TS SDK v1.29.0 is current
stable; vendors running <1.26.0 remain affected.

---

## 4. Spec & SDK Status

### MCP Specification — 17 Days to July 28 Final

The 2026-07-28 Release Candidate (locked May 21, 2026) remains unchanged. Final
specification publishes July 28, 2026. [[RC blog]](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)

Breaking changes in scope (already documented in prior reports):
- Stateless protocol core; `Mcp-Session-Id` deprecated; no initialize handshake
- Mandatory `Mcp-Method`/`Mcp-Name`/`MCP-Protocol-Version: 2026-07-28` headers
- `ttlMs`/`cacheScope` added; MCP Apps (SEP-1865) + Tasks as official extensions
- Six SEPs for OAuth 2.0/OIDC auth hardening
- Roots/Sampling/Logging deprecated (12-month window)

No catalog schema change required.

### SDK v2 Betas — All Tier 1 Live

| SDK | Current Beta | Stable Target |
|---|---|---|
| Python | `mcp==2.0.0b1` | July 27, 2026 |
| TypeScript | `@modelcontextprotocol/server` v2.0.0-beta.2 | July 28, 2026 |
| Go | `v1.7.0-pre.1` | July 28, 2026 |
| C# | `v2.0.0-preview.1` | July 28, 2026 |

[[SDK betas blog]](https://blog.modelcontextprotocol.io/posts/sdk-betas-2026-07-28/)

Vendors using Python SDK should pin `mcp>=1.27,<2` until ready to migrate. v1 receives
security patches for ≥6 months post-v2 stable.

---

## 5. Enterprise Governance & EMA

### EMA Stable — InfoQ Deep-Dive Coverage

InfoQ published a detailed technical analysis of **Enterprise-Managed Authorization
(EMA / SEP-990)** reaching stable status. [[InfoQ — MCP EMA Enterprise Auth]](https://www.infoq.com/news/2026/07/mcp-ema-enterprise-auth/)

**7 launch connector servers confirmed:**
Asana, Atlassian, Canva, Figma, Granola, Linear, Supabase

**5 of 7 are in our catalog:** `com.asana/mcp`, `com.atlassian/mcp`, `com.figma/mcp`,
`com.linear/mcp`, `com.supabase/mcp`. This is the strongest external signal yet that our
curation criteria align with enterprise identity and trust requirements.

**Integrators at launch:** Anthropic (shared MCP layer for Claude/Claude Code/Cowork),
Microsoft (VS Code), Okta. Slack support confirmed in progress.

EMA flow: users sign in once via org IdP → zero-touch MCP server provisioning → no
per-server consent prompts for approved servers.

---

## 6. Events & Community

### MCPCon Shanghai Schedule Released (July 8)

The session schedule for **AGNTCon + MCPCon China 2026** was announced July 8, 2026.
[[AAIF MCPCon Shanghai]](https://www.lfopensource.cn/mcp-dev-summit-shanghai/)
[[Sessionize CFP page]](https://sessionize.com/mcp-dev-summit-shanghai-2026/)

- **Date:** September 6–7, 2026
- **Location:** Shanghai International Convention Center (co-located with KubeCon +
  CloudNativeCon + OpenInfra Summit + PyTorch Conference China)
- **Scale:** 40+ sessions, 1,500+ expected attendees; MCP Steering Committee speakers
- **Session abstracts:** Not yet accessible via public crawl; re-check late July

This is the third major 2026 MCPCon after MCP Dev Summit North America (San Jose, April)
and the ongoing European conference schedule (Amsterdam Sept 17–18, North America Oct 22–23).

### SEP-2127 Server Cards — Working Group Active

Working Group term ends August 14, 2026 (34 days). Status: still Draft. Claude Desktop
and Cursor already shipping support. The IS Your MCP Ready? scanner (isyourmcpready.com)
is live and scanning /.well-known/mcp/server-card.json. No spec merge expected before
July 28 RC final; likely post-RC.

---

## 7. New Vendor MCP Servers (Not Catalog Candidates)

### Featured MCP Server (July 7)
Featured, an AI co-pilot for PR agencies, launched a hosted MCP server for PR
professionals connecting to Claude, Cursor, VS Code. [[GlobeNewswire]](https://www.globenewswire.com/news-release/2026/07/07/3323391/0/en/Featured-Launches-an-MCP-Server-Bringing-AI-Agents-to-PR-Agencies.html)
**Catalog assessment:** PR persona; not developer tools. Not in curate queue.

### Press Ranger MCP Server (July 9)
Press Ranger launched a press release distribution MCP server. [[GlobeNewswire]](https://www.globenewswire.com/news-release/2026/07/09/3325174/0/en/Press-Ranger-Launches-the-First-MCP-Server-for-Press-Release-Distribution.html)
**Catalog assessment:** Niche PR persona; endpoint/auth model not yet verified. Not in
curate queue.

### X (Twitter) MCP Server — Auth Verification Pending
Technical profile confirmed: `https://api.x.com/mcp` (200+ endpoints) + `https://docs.x.com/mcp`
(API docs); Streamable HTTP; OAuth 2.0 via xurl bridge (token caching + auto-refresh).
**Catalog status:** #2 curate priority (after HubSpot); headless auth model verification
required before adding. No change from yesterday.

---

## 8. Catalog Hook — No Actions Required

All 19 approved servers remain `approved`/`public`. Catalog is all remote-HTTP, all auth-gated.

**Priority action queue (unchanged from July 10):**
1. **Next curate:** HubSpot (`mcp.hubspot.com`, OAuth 2.1 + PKCE, GA April 13) — #1
2. **Next curate:** X (Twitter) MCP (`api.x.com/mcp`, OAuth 2.0 via xurl) — #2
3. **Next audit:** TypeScript SDK vendor pass (CVE-2026-25536 ≥v1.26.0 compliance)
4. **Roadmap:** `provenance.attestation_url` field when Sigstore-signed artifacts common

---

## 9. Summary Table

| Angle | Finding | Action |
|---|---|---|
| Glama scale | 53,668 (+517) | Track |
| Large-scale scan | 5,832/9,695 servers with issues; remote-HTTP immune | No catalog action |
| EMA stable | 5/7 launch connectors in catalog | Validates curation criteria |
| Spec RC | Unchanged; 17 days to July 28 final | No schema change |
| SDK v2 | All Tier 1 betas live; Python stable July 27 | Vendors: pin mcp>=1.27,<2 |
| MCPCon Shanghai | Schedule released; 40+ sessions Sept 6–7 | Re-check abstracts late July |
| Security window | Day 13 clean; no cataloged-server CVEs | Continue monitoring |
| X MCP Server | Auth verification pending | #2 curate priority |
| HubSpot | GA; endpoint confirmed | #1 curate priority |
