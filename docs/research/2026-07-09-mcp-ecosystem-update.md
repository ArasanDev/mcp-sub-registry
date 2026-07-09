# MCP Ecosystem Update — 2026-07-09

**Produced by:** MCP Sub-Registry autonomous research routine
**Covers:** 2026-07-08 EOD → 2026-07-09
**Prior report:** [2026-07-08-mcp-ecosystem-update.md](./2026-07-08-mcp-ecosystem-update.md)

---

## 1. Headline Summary

- **Glama crosses 52,581** servers (7,734 connectors; 359,561 tools) — +557 since July 8.
- **AAIF "MCP Is Growing Up" blog post** signals enterprise maturation: 78% of enterprise AI
  teams have MCP-backed agents in production; 28% of Fortune 500 companies have deployed MCP.
- **Runlayer joins AAIF as founding member** alongside Anthropic, OpenAI, and Google — the
  strongest governance-industry alignment signal since the $30M Series A.
- **Runlayer "MCP Apps" governance blog**: existing Runlayer controls apply from day one to the
  new MCP Apps extension — no new attack surface for governed deployments.
- **X (Twitter) MCP Server technical details confirmed**: `api.x.com/mcp` (200+ endpoints) +
  `docs.x.com/mcp` (API docs); Streamable HTTP; OAuth 2.0 via xurl bridge. Catalog candidate #2.
- **MCPCon Shanghai (Sept 6–7)**: event confirmed co-located with KubeCon China; session abstracts
  not yet accessible via external tools.
- **Security**: Clean window continues (Day 11 — no new CVEs since July 7 affecting cataloged
  servers). Adversa AI published "Top MCP Security Resources July 2026" roundup.
- **Spec countdown: 19 days** to July 28 final. No new RC changes since May 21.

---

## 2. Registry & Ecosystem Scale

### Glama — 52,581 servers

The Glama registry page title now reads "Open-Source MCP Servers – 52,581" — up from 52,024 on
July 8 (+557 in one day), and up from the July 3 MCPToplist baseline of 73,799 cross-registry.
Glama also indexes **7,734 remote connectors** and **359,561 total tools** — the most granular
public tool inventory in the ecosystem.

[[Glama MCP Servers]](https://glama.ai/mcp/servers)

### PulseMCP

No new data point since 20,410+ (July 8). Holding at approximately 20,410+.

### Official MCP Registry

The most recent available pull (May 24, 2026) counted **9,652 latest server records** and
28,959 server/version records at `registry.modelcontextprotocol.io`. The official registry
remains the authoritative upstream for our sync; v0.1 API is frozen while v1 GA is developed.
ACR/MCR support was added June 10. No new registry API release confirmed today.

[[Official MCP Registry]](https://registry.modelcontextprotocol.io/)
[[Nordic APIs: Getting Started with the Official MCP Registry API]](https://nordicapis.com/getting-started-with-the-official-mcp-registry-api/)

### Cross-Registry Estimate

With Glama at 52,581, PulseMCP ~20,410+, Smithery ~7,000, and mcp.so ~20,222, the MCPToplist
cross-registry aggregate stands at approximately **73,800–74,000+** indexed servers today.
Trust gap vs. our catalog: ~74,000+ indexed vs. **19 approved**.

[[MCPToplist]](https://mcptoplist.com/)

---

## 3. Enterprise Adoption Maturation

### AAIF: "MCP Is Growing Up"

The Agentic AI Foundation published a blog post titled **"MCP Is Growing Up"** that synthesizes
the state of enterprise MCP adoption around the July 28 RC:

- **78% of enterprise AI teams** have MCP-backed agents in production (as of July 2026).
- **28% of Fortune 500** companies have deployed MCP — reached in under 18 months from launch.
- **97 million monthly SDK downloads** (TypeScript + Python SDKs combined, March 2026).
- **41% of surveyed software organizations** are in limited or broad production with MCP servers
  (Stacklok 2026 software report — a more conservative, survey-based estimate).
- **MCP stateless RC** is framed as the "growing up" inflection: requests are now self-contained,
  infrastructure can route on `Mcp-Method` + `Mcp-Name` headers without session state, and the
  Extensions framework separates experimental capabilities (Tasks, MCP Apps) from the stable core.

The post also confirms that Enterprise-Managed Authorization (EMA/SEP-990) is now stable, with
Anthropic, Microsoft, and Okta as launch integrators. 7 connectors at launch include 5 already
in our catalog (Asana, Atlassian, Canva, Figma/Linear, Supabase-adjacent).

[[AAIF: MCP Is Growing Up]](https://aaif.io/blog/mcp-is-growing-up/)
[[Stacklok 2026 Software Report]](https://stacklok.com/blog/stacklok-2026-software-supply-chain-report)
[[MCP Enterprise Adoption: July 2026 State of Play]](https://andrew.ooo/answers/mcp-model-context-protocol-enterprise-adoption-july-2026/)
[[MCP Adoption Statistics 2026]](https://www.digitalapplied.com/blog/mcp-adoption-statistics-2026-model-context-protocol)

### Industry Analysis: Why MCP Won

The New Stack published an analysis titled **"Why the Model Context Protocol Won"** — noting
that MCP's HTTP-first model (Streamable HTTP transport, stateless RC) is now driving mainstream
enterprise adoption over WebSocket-based alternatives. The piece cites the stateless RC as the
moment MCP became loadbalancer-native and ready for cloud-scale deployments.

[[The New Stack: Why the Model Context Protocol Won]](https://thenewstack.io/why-the-model-context-protocol-won/)

---

## 4. Player Updates

### Runlayer — AAIF Founding Member + MCP Apps Governance Blog

Two new Runlayer signals today:

**1. AAIF Founding Member**: Runlayer announced it is joining AAIF as a **founding member**
alongside Anthropic, OpenAI, and Google. This is significant: it places Runlayer in the same
governance tier as the MCP spec authors. The move validates Runlayer's positioning as the
enterprise governance layer for the agentic stack, not just a security vendor.

[[Runlayer joins AAIF as founding member]](https://www.runlayer.com/blog/runlayer-joins-anthropic-openai-google-as-aaif-founding-member)

**2. MCP Apps Governance**: Runlayer published **"MCP Apps highlight the power of protocol
governance"**, explaining how the MCP Apps extension (server-rendered UIs in sandboxed iframes)
is handled by their existing governance layer without configuration changes:

> "With Runlayer intercepting tool calls, resource fetches, and auth headers, existing MCP
> security controls apply from day one for MCP Apps."

The key architectural point: MCP Apps render in sandboxed iframes and do not get direct access
to the host application's internal APIs. For Runlayer customers, the existing allow/deny toolcall
policy already covers the MCP Apps iframe request path. No new attack surface for governed
deployments.

This is relevant context for the sub-registry: the `gateway_compatibility` field in our catalog
projection can continue to express the same `remotes` + `required_secrets` + `tools` shape for
servers that add MCP Apps capabilities — no schema change needed.

[[Runlayer: MCP Apps governance]](https://www.runlayer.com/blog/mcp-apps-highlight-the-power-of-protocol-governance)

### MCPCon Shanghai (Sept 6–7) — Schedule Announced, Abstracts Pending

The AGNTCon + MCPCon China schedule was announced on or around July 8, 2026. The event is:
- **Dates:** September 6–7, 2026
- **Venue:** Shanghai International Convention Center
- **Co-located with:** KubeCon + CloudNativeCon China + OpenInfra Summit + PyTorch Conference China (Sept 7–9)
- **Scale:** 40+ sessions, 1,500+ expected attendees, MCP Steering Committee speakers

The full session abstract list is not yet accessible via public crawl (the `lfopensource.cn`
program URL returned 403). The sessionize.com CFP page is the best public reference.

[[AAIF MCPCon China]](https://www.lfopensource.cn/mcp-dev-summit-shanghai/)
[[Sessionize CFP]](https://sessionize.com/mcp-dev-summit-shanghai-2026/)
[[KubeCon China co-location announcement]](https://www.cncf.io/announcements/2026/06/18/kubecon-cloudnativecon-openinfra-summit-and-pytorch-conference-unite-in-china-to-scale-ai/)

**Action:** When session abstracts become publicly accessible (expected within 1–2 weeks), scan
for catalog-relevant server announcements or enterprise governance presentations.

### X (Twitter) MCP Server — Technical Details Confirmed

The X MCP Server launched June 30, 2026 at `api.x.com/mcp`. Full technical profile now
confirmed from developer community announcements:

| Property | Value |
|----------|-------|
| Primary endpoint | `https://api.x.com/mcp` |
| Secondary endpoint | `https://docs.x.com/mcp` (API docs retrieval) |
| Transport | Streamable HTTP |
| Protocol version | `2025-06-18` |
| Auth | OAuth 2.0 user auth via `xurl` bridge (token caching + auto-refresh) |
| Scope | 200+ X API endpoints (search, user lookup, bookmarks, article drafting) |
| Compatible clients | Grok Build, Cursor, Claude Desktop, VS Code + GitHub Copilot |

The `xurl` bridge is a lightweight local OAuth manager — developers authorize once; `xurl`
caches and auto-refreshes the token. This is user-facing OAuth, not an API key pattern.

**Catalog assessment**: X MCP is a strong catalog candidate (vendor-hosted, Streamable HTTP,
user OAuth). Blocker: `xurl` local bridge requirement means headless/server-side auth needs
verification before curating. Remains **catalog candidate #2** (after HubSpot).

[[X Hosted MCP Announcement]](https://devcommunity.x.com/t/announcing-the-hosted-x-mcp/269558)
[[TechCrunch: X MCP Server]](https://techcrunch.com/2026/06/30/x-now-offers-an-mcp-server-to-make-its-platform-easier-for-ai-tools-to-use/)
[[MCP.Directory: X MCP Guide]](https://mcp.directory/blog/x-twitter-mcp-server)

### HubSpot MCP Server — Capability Recap

No new July 9 HubSpot changelog entries. The July 2026 updates (content analytics for any page +
landing page creation) were captured in the July 3 report and confirmed today. HubSpot endpoint:
`https://mcp.hubspot.com/mcp`. Auth: OAuth 2.1 + PKCE, no DCR (pre-registered client_id required).
Remains **catalog candidate #1** for the next curate run.

[[HubSpot MCP Server]](https://developers.hubspot.com/ai-tools/mcp)
[[HubSpot Remote MCP GA]](https://developers.hubspot.com/changelog/remote-hubspot-mcp-server-is-now-generally-available)

---

## 5. MCP Specification

### RC Countdown: 19 Days to July 28

No new spec blog posts from `blog.modelcontextprotocol.io` today (most recent: June 29, SDK
betas). The 10-week validation window for Tier 1 SDK maintainers is active. Key reminders:

- Python SDK v2 stable targets **July 27** (beta live as `mcp==2.0.0b1`; stable v1 latest: v1.28.1).
- TypeScript SDK v2 stable targets **July 28** (beta: `@modelcontextprotocol/server` v2 in ESM-only
  format, Node 20+/Bun/Deno). CVE-2026-25536 audit still pending (verify all TS-SDK catalog vendors
  running ≥1.26.0).
- Breaking changes confirmed: no `Mcp-Session-Id`; no `initialize` handshake; `Mcp-Method` /
  `Mcp-Name` / `MCP-Protocol-Version: 2026-07-28` headers mandatory.
- No catalog schema change required for the final spec.

[[MCP Spec RC blog]](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)
[[MCP 2026-07-28 changes analysis]](https://stacktr.ee/blog/mcp-2026-spec-changes)

---

## 6. Security

### Day 11 — Clean Window Continues

No new CVEs or security incidents affecting cataloged MCP servers on July 8–9, 2026. The 11-day
clean streak (since the July 7 tool poisoning techniques report) continues.

### Adversa AI "Top MCP Security Resources July 2026" Roundup

Adversa AI published a monthly security resource roundup for July 2026. Key additions since the
June 2026 roundup:

- **NSA MCP hardening guidelines** (May 20, 2026) — now widely cited as the baseline enterprise
  control framework. Independently validates `discovered != approved != enabled`.
- **Amazon Q CVE-2026-12957 + CVE-2026-12958** (Wiz Research, disclosed June 26, 2026; CVSS 8.5) —
  Amazon Q Developer VS Code extension auto-loaded MCP configs from `.amazonq/mcp.json` without
  workspace trust or user consent. Opening a malicious repository triggered immediate code execution
  and AWS credential exfiltration. Patched in Language Servers for AWS v1.69.0. Not in our catalog
  (Amazon Q Developer is a client tool, not a catalog server). Systemic lesson: auto-execution of
  workspace MCP configs without consent is now a recognized attack class across Amazon Q, Claude Code,
  Windsurf (CVE-2026-30615), and Cursor (DuneSlide).
- **Agentjacking (CSA, June 2026)** — Sentry DSN injection leading to agent manipulation via
  attacker-controlled event content. `com.sentry/mcp` remains auth-gated; no catalog demotion.
- **ShareLock** (threshold Shamir secret sharing across tool descriptions — >90% success rate) and
  **Sentry Threshold Poisoning** (Tenet Security — 85% success) — both documented July 8 (see prior
  report). No new technique variants today.
- **DuneSlide** (Cato Networks) — two critical Cursor IDE RCE via zero-click prompt injection.
  Not a catalog-side issue; client-side only.

All 19 cataloged servers remain approved/public. Remote-HTTP model continues to be structurally
immune to all npm/STDIO worm vectors.

[[Adversa AI: Top MCP Security Resources July 2026]](https://adversa.ai/blog/top-mcp-security-resources-july-2026/)
[[Wiz: Amazon Q Vulnerability]](https://www.wiz.io/blog/amazon-q-vulnerability)
[[CyberSecurityNews: Amazon Q CVE]](https://cybersecuritynews.com/amazon-q-vulnerability/)
[[The Vulnerable MCP Project]](https://vulnerablemcp.info/)

### MCP Security Statistics 2026 (Practical DevSecOps)

Practical DevSecOps published a compiled **"MCP Security Statistics 2026"** report summarizing
the year's CVE and breach data:

- **30+ CVEs** filed against MCP servers in a single 60-day window in early 2026.
- **43% of public MCP servers** have at least one vulnerability (CoSAI white paper, Jan 2026).
- **5.5% have poisoned tool descriptions** in production (same source).
- **13 of 30** early-2026 CVEs were command-injection patterns.
- **73% SSRF-vulnerable** in BlueRock Security scan (36.7% of 7,000+ MCP servers exposing
  SSRF, including the Microsoft Markitdown MCP credential-exfil case).

These statistics are useful context for the sub-registry's approval workflow: the base rate for
"randomly discovered MCP server has a critical flaw" is high enough that a curated catalog with
verified approval is not conservative, it is the minimum viable trust posture.

[[Practical DevSecOps: MCP Security Statistics 2026]](https://www.practical-devsecops.com/mcp-security-statistics-2026-report/)

---

## 7. Catalog Hooks

Checking `data/default-curated-servers.json` (19 entries) against today's findings:

| Server | Finding | Action |
|--------|---------|--------|
| All 19 | Day 11 clean security window | None |
| All TypeScript SDK vendors | CVE-2026-25536 + CVE-2026-0621 audit still pending (≥1.26.0 check) | `subregistry-audit` pass (Next actions #3b) |
| `com.sentry/mcp` | Agentjacking / Threshold Poisoning reconfirmed — endpoint remains 401-gated | No demotion; note in catalog entry for operators |
| — | HubSpot `mcp.hubspot.com/mcp` — #1 curate priority; GA confirmed; OAuth 2.1 + PKCE | Curate at next `subregistry-curate` run |
| — | X MCP `api.x.com/mcp` — #2 curate priority; xurl OAuth bridge requires headless auth check | Verify headless auth model before curating |
| All | Spec RC T-19 days; no action on catalog schema needed | None |

No demotions or emergency re-verifications required today.

---

## 8. Landscape Assessment

No ranking changes needed today. The Runlayer AAIF founding membership adds governance credibility
but does not shift the landscape ranking (Runlayer already at #3). The AAIF "MCP Is Growing Up"
post reinforces the enterprise maturation thesis but contains no new competitor entrants.

**Standing assessment unchanged:** The white space for a focused, standalone, MCP-Registry-compatible
curated catalog with a documented gateway projection remains uncrowded. Enterprise adoption is now
production-scale (78% of AI teams, 28% Fortune 500), which increases the urgency of curation quality
over raw server count.

---

## 9. Next Research Focus

- **July 9–14**: Check for MCPCon Shanghai session abstracts becoming publicly available —
  scan for catalog-relevant enterprise server announcements.
- **July 27**: Python SDK v2.0.0 stable ships — re-verify Python-SDK-based catalog vendors.
- **July 28**: MCP spec final ships — diff against RC to confirm no catalog schema change.
- **Ongoing #1 priority**: TypeScript SDK CVE-2026-25536 audit (≥1.26.0 for all TS vendors in
  catalog) — schedule `subregistry-audit` pass.
- **Next curate run**: HubSpot (GA, `https://mcp.hubspot.com/mcp`, OAuth 2.1 + PKCE, no DCR)
  then X (Twitter) (`https://api.x.com/mcp`, verify headless auth model first).
- **Enterprise stats to track**: When the Stacklok 2026 software supply chain report publishes
  in full, capture the production-deployment breakdown by server type (STDIO vs remote).
