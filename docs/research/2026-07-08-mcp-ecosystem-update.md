# MCP Ecosystem Update — 2026-07-08

Daily research pass. Covers developments since the July 7 report
([2026-07-07-mcp-ecosystem-update.md](./2026-07-07-mcp-ecosystem-update.md)).
Focus: ecosystem scale (Glama ~52,024); spec countdown 20 days; MCPCon Shanghai schedule
due today; TypeScript SDK 2.0.0-beta.2 released July 2; new CVEs (SSRF, Critical RCE);
new tool poisoning techniques (ShareLock, Threshold Poisoning, DuneSlide); Microsoft
Dataverse 60+ MCP servers; Obot v0.23.x security advisories; clean security window
for all 19 cataloged servers continues.

All external claims cited with source URLs.

---

## 1. Ecosystem Scale

| Directory | Count | vs. July 7 |
|-----------|-------|------------|
| **Glama** | **~52,024 servers** | +63 (+0.1%) |
| Glama connectors | ~6,951 | ~stable |
| PulseMCP | 20,410+ | +300 |
| Smithery | ~7,300 | ~stable |
| MCPToplist (cross-registry) | 73,799 | +252 (as of July 3) |
| Official MCP Registry | ~2,000 (est.) | unchanged |
| **Our curated set** | **19** | unchanged |

Glama's page title now reads "Open-Source MCP Servers – 52,024" — crossing the 52k milestone.
PulseMCP reached 20,410+, up ~300 from yesterday's 20,110+. MCPToplist's most recent
timestamped data point is 73,799 (July 3 at 03:48 UTC); its live count is higher as of today.

[[Glama MCP Registry]](https://glama.ai/mcp/servers)
[[PulseMCP]](https://www.pulsemcp.com/servers)
[[MCPToplist]](https://mcptoplist.com/)

**Trust gap: ~73.8k+ indexed vs. 19 approved.** The gap widened again.

---

## 2. Spec Countdown — 20 Days to July 28 Final

The 2026-07-28 RC remains frozen since May 21. Final specification ships **July 28, 2026 —
20 days from today**. No new blog posts on blog.modelcontextprotocol.io since June 29.
No errata or clarifications were published July 6–8. The ten-week validation window is on track.

[[MCP RC blog]](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)
[[MCP blog archives]](https://blog.modelcontextprotocol.io/archives/)

Previously documented breaking changes remain the complete list (stateless core, `Mcp-Method`/
`Mcp-Name` headers, `ttlMs`/`cacheScope`, MCP Apps, Tasks extension, 6 OAuth SEPs, Roots/
Sampling/Logging deprecated). No catalog schema change needed on July 28.

---

## 3. SDK v2 — TypeScript beta.2 Released July 2

### TypeScript SDK: 2.0.0-beta.2 (July 2, 2026)

A second TypeScript v2 beta shipped **July 2, 2026 at 12:27 UTC** — the first new release
since beta.1 on June 30. Key changes in beta.2:

- **Dual CJS + ESM output**: each package now emits both `.mjs`/`.d.mts` and `.cjs`/`.d.cts`,
  resolving the ESM-only restriction noted at beta.1. Node.js 20+, Bun, and Deno all supported.
- **HTTP error alignment**: capability-related errors now return `400 Bad Request` per spec.
- **Package names unchanged**: `@modelcontextprotocol/server` + `@modelcontextprotocol/client`
  (not the old `@modelcontextprotocol/sdk`). Zod v4 and ArkType work natively.

Stable TypeScript v2 still targets **July 28, 2026**.

[[typescript-sdk releases]](https://github.com/modelcontextprotocol/typescript-sdk/releases)
[[TS SDK v2 docs]](https://ts.sdk.modelcontextprotocol.io/v2/)

### Python SDK: mcp==2.0.0b1 (unchanged)

No b2 cut since June 30. Latest stable production release remains `1.28.1` (June 26).
Stable v2 targets **July 27, 2026**. Pin `mcp>=1.27,<2` until ready to migrate.

[[PyPI mcp]](https://pypi.org/project/mcp/)
[[python-sdk releases]](https://github.com/modelcontextprotocol/python-sdk/releases)

### CVE-2026-25536 TypeScript SDK Audit (pending)

All TypeScript SDK-based vendors in our catalog should be running `@modelcontextprotocol/sdk`
>=1.26.0 (cross-client data leak) and >=1.25.2 (ReDoS CVE-2026-0621). The beta.2 dual-output
change has no security implication for this audit requirement. Audit pass still pending
(CLAUDE.md §13 Next actions #3b).

---

## 4. MCPCon Shanghai — Schedule Expected Today

The AGNTCon + MCPCon China schedule announcement was expected **July 8, 2026** (today). The
official event page (`lfopensource.cn/mcp-dev-summit-shanghai/`) and the AAIF news feed
(`aaif.io/news/`) both returned HTTP 403 during this research pass and could not be scraped.
A schedule URL (`/program/schedule/`) appears in indexed sitemaps, suggesting the page
structure exists, but content was not retrievable.

**What is confirmed from the CFP:**
- **Event**: September 6–7, 2026, Shanghai, co-located with KubeCon + CloudNativeCon +
  OpenInfra + PyTorch Conference China.
- **Scale**: 40+ sessions, 1,500+ expected attendees, MCP Steering Committee members confirmed.
- **CFP tracks**: agent architectures, MCP implementation and scaling, AI security and
  observability, open standards and governance, enterprise deployment patterns, infrastructure
  and orchestration.

**Proxy signal from MCP Dev Summit North America (April 2–3, NYC, ~1,200 attendees, 95+ sessions):**
Registry and catalog governance was a central theme. Amazon, Uber, Docker, Kong, and Bloomberg
all described converging on a centralized gateway + registry control-plane architecture.
Notable sessions included "Kubernetes-Native Agent Discovery: A Unified Registry for MCP
Servers and Skills" (Carlos Santana, AWS) and "Dynamic MCPs: Agentic Discovery, Configuration,
and Management of MCP Workloads" (Jim Clark, Docker). Security was the single most represented
theme with 23 dedicated sessions. Expect Shanghai to continue both threads.

[[AAIF Shanghai CFP]](https://www.lfopensource.cn/mcp-dev-summit-shanghai/)
[[Sessionize CFP]](https://sessionize.com/mcp-dev-summit-shanghai-2026/)
[[AAIF NA Summit readout]](https://aaif.io/blog/mcp-is-now-enterprise-infrastructure-everything-that-happened-at-mcp-dev-summit-north-america-2026/)
[[InfoQ NA Summit coverage]](https://www.infoq.com/news/2026/04/aaif-mcp-summit/)

**Catalog action**: None. Monitor AAIF news feed for confirmed schedule and scan session
abstracts when available for new catalog candidates.

---

## 5. Security — New CVEs and Tool Poisoning Techniques

### 5.1 CVE-2026-14748 — SSRF in AIAnytime mcp-wiki (July 5, 2026)

- **Affected**: AIAnytime Awesome-MCP-Server — `mcp-wiki/wiki-summary` component
  (`mcp-wiki/src/mcp_wiki/server.py`)
- **Type**: Server-Side Request Forgery (SSRF) via unsanitized `url` argument — CWE-918
- **CVSS**: 6.3 / Medium
- **Disclosure**: July 5, 2026 (public, exploit published)
- **Patch**: None as of disclosure; project has not responded to the report.
- **Attack vector**: Remote, no authentication required.
- **Catalog impact**: Not in catalog (community server, not a first-party vendor endpoint).

[[NVD]](https://nvd.nist.gov/vuln/detail/CVE-2026-14748)
[[TheHackerWire]](https://www.thehackerwire.com/vulnerability/CVE-2026-14748/)
[[OffSeq Threat Radar]](https://radar.offseq.com/threat/cve-2026-14748-server-side-request-forgery-in-aian-399fb0d90d087f1f)

### 5.2 CVE-2026-0755 — OS Command Injection in gemini-mcp-tool (CVSS 9.8 Critical)

- **Affected**: `gemini-mcp-tool` npm package
- **Type**: OS command injection via unsanitized user input passed to `execAsync` shell commands
- **CVSS**: 9.8 / Critical — Network-exploitable, no authentication, no user interaction required
- **Disclosure date**: July 2026 (exact day not confirmed in research)
- **Catalog impact**: Not in catalog (community/unofficial package, not a vendor-hosted remote endpoint).

Both CVEs follow the community-package SSRF and command-injection patterns that have dominated
MCP CVE filings in 2026. Remote-HTTP-only catalog is structurally immune to both.

### 5.3 Tool Poisoning — Three New Techniques Documented

**ShareLock Multi-Tool Poisoning**
A technique splitting malicious instructions across multiple benign-looking MCP tool
descriptions using Shamir's threshold secret-sharing logic. The attack assembles the
malicious payload only when a threshold of "innocent" tools are called together — bypassing
single-tool inspection. Reported **>90% success rate** across tested models.

[[ITECS on Tool Poisoning]](https://itecsonline.com/post/mcp-tool-poisoning-enterprise-ai-agent-security-2026)
[[Practical DevSecOps]](https://www.practical-devsecops.com/mcp-tool-poisoning/)

**Sentry MCP Threshold Poisoning (Tenet Security)**
Researchers found attackers can inject fake Sentry error events via a public DSN. The Sentry
MCP server returns them as trusted diagnostics to coding agents, which then execute attacker-
controlled commands. Reported **85% success rate**. This is distinct from the "Agentjacking"
issue (CSA, June 2026) — the latter covered DSN exposure; this covers active attacker
injection into the event stream.

**Catalog note**: `com.sentry/mcp` remains auth-gated (confirmed HTTP 401 on unauthenticated
requests — June 16 audit). No demotion. Operators must treat Sentry event content as untrusted
external data.

**DuneSlide (Cato Networks, Cursor IDE)**
Cato Networks disclosed two critical RCE vulnerabilities via zero-click prompt injection in
Cursor IDE. Exact CVE IDs and disclosure date could not be independently verified (403 on
Cato's page). Documented in July 2026 security search results.

[[Cato Networks DuneSlide]](https://www.catonetworks.com/blog/duneslide-two-critical-rce-vulnerabilities/)

### 5.4 Clean Window — Day 10

**No new CVEs directly affecting our 19 cataloged servers on July 7–8, 2026.** All three new
items above affect community packages or specific IDEs, not first-party vendor-hosted remote
endpoints. The clean window for cataloged servers extends to Day 10.

Previously documented active threats remain (IronWorm, Miasma Hades, SANDWORM_MODE,
MCPTox). All are npm/STDIO/package vectors; remote-HTTP-only catalog is structurally immune.

[[vulnerablemcp.info]](https://vulnerablemcp.info/)

---

## 6. Players & Landscape

### Microsoft Dataverse — 60+ MCP Servers (July 6, 2026)

Microsoft published its July Dataverse wave update on **July 6, 2026**: the Dataverse catalog
now includes **60+ ready-to-use MCP servers** for AI agents. The Dataverse coding-agent
plugin now supports Claude, Cursor, and GitHub Copilot (expanded from prior narrow support)
with MCP governance controls. Private previews coming by end of July: remote Dataverse MCP
server support and `create_table`/`update_table`/`delete_table` operations.

This is a significant expansion of Microsoft's enterprise MCP footprint beyond the Entra ID
MCP Server (Preview, announced earlier July 2026). 60+ servers in a managed internal catalog
validates the "persona-based curated bundles" direction (CLAUDE.md §12.5).

[[Microsoft Power Platform Blog — Dataverse July 2026]](https://www.microsoft.com/en-us/power-platform/blog/2026/07/06/dataverse-july2026/)

**Catalog relevance**: Dataverse MCP servers are per-tenant enterprise SaaS endpoints, not
catalogable. Added to landscape watch list.

### Obot — v0.23.x Security Advisories (June 22, 2026)

Obot latest release is **v0.23.3** (June 25, 2026). The v0.23.2 release (June 22) included
three security advisories:
1. **OAuth token theft** — tokens could be exfiltrated under certain flows
2. **Unauthenticated MCP Registry access** — unauthenticated clients could query the registry
3. **SSRF via remote MCP URLs** — attacker-supplied server URLs could trigger SSRF from the
   Obot host

These are patched in v0.23.2+. Noteworthy because Obot is ranked #4 in our landscape and
its security track record affects confidence in its `discovered → approved → runtime` model.

[[Obot GitHub Releases]](https://github.com/obot-platform/obot/releases)

### Runlayer — Post-Series A Activity

No new Runlayer announcement specifically on July 5–8 was confirmed. Post-Series A partnerships
now documented: **Cursor Hooks partnership** (Runlayer security scanning enforced for any
MCP server accessed via Cursor Hooks), **Box enterprise partnership** (Box MCP server in
Runlayer marketplace with permissions enforcement + audit logging). No product version drop
or funding news in the July 5–8 window.

[[Runlayer Cursor Hooks blog]](https://www.runlayer.com/blog/cursor-hooks)
[[Runlayer Box partnership]](https://www.runlayer.com/blog/box-and-runlayer-mcp-partnership)

### JFrog — No July Updates

No JFrog MCP Registry feature announcements found for July 2026. Last major milestone was
GA on March 18, 2026. JFrog remains #2 in the landscape ranking.

### Docker MCP Catalog — Governance UX Improvements

Docker's July Desktop release added:
- **Community server warning banner**: explicit UI signal when a server is community-provided
  and unverified — mirrors our `approved` vs `discovered` distinction.
- **Gordon OAuth flow**: working Authenticate/Cancel buttons for MCP OAuth authorization
  directly in the chat interface.
- **60+ new remote MCP servers** added to the catalog.

[[Docker MCP Catalog docs]](https://docs.docker.com/ai/mcp-catalog-and-toolkit/catalog/)
[[Docker remote MCP OAuth]](https://www.docker.com/blog/connect-to-remote-mcp-servers-with-oauth/)

### AWS Agent Registry — Namespace Migration Reminder (Aug 6)

Still in Preview. Confirmed: the **namespace migration from `bedrock-agentcore` to
`agent-registry` occurs August 6, 2026**. Users must update endpoints, IAM policies,
SDK clients, and CLI scripts before that date. `com.aws/mcp` (AWS MCP Server) is a
distinct GA product unaffected by this registry-service rename.

[[AWS docs — registry]](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry.html)

### SEP-2127 Server Cards — Merged as Draft (June 26)

SEP-2127 was merged into the spec repo on June 26, 2026, with status "Draft." Discovery
endpoint: `/.well-known/mcp-server-card` (single server) or
`/.well-known/mcp-server-card/{server-name}` (multi-server). A reference implementation
is required before the SEP reaches "Final." Working Group active through August 14, 2026.
No new outputs on July 7–8.

[[SEP-2127 PR]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)
[[SEP-2127 text]](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/aa59517442d323a33ed915fc408f1584c4a23dfa/seps/2127-mcp-server-cards.md)

---

## 7. Catalog Hooks

Checking `data/default-curated-servers.json` (19 entries) against today's findings:

| Server | Finding | Action |
|--------|---------|--------|
| All 19 | Day 10 clean security window | None |
| All TypeScript SDK vendors | CVE-2026-25536 audit pending (>=1.26.0 check) | `subregistry-audit` pass (Next actions #3b) |
| `com.sentry/mcp` | Threshold Poisoning technique documented; endpoint remains auth-gated (401) | No demotion; note operators must treat event content as untrusted |
| — | CVE-2026-14748 (mcp-wiki SSRF) — not in catalog | None |
| — | CVE-2026-0755 (gemini-mcp-tool RCE 9.8) — not in catalog | None |
| — | X (`api.x.com/mcp`) — catalog candidate #2 | Verify headless Bearer token auth before curating |
| — | HubSpot (`mcp.hubspot.com`) — #1 curate priority | OAuth 2.1 + PKCE; GA April 13; no DCR |
| `com.aws/mcp` | AWS Agent Registry namespace migration Aug 6 — distinct product, no direct impact | Monitor; no action expected |

No catalog entries need demotion or immediate re-verification today.

---

## 8. Next Research Focus

- **July 8** (today): Check AAIF news feed and `lfopensource.cn/mcp-dev-summit-shanghai/program/schedule/`
  for confirmed MCPCon Shanghai program — scan abstracts for catalog candidates.
- **July 27**: Python SDK v2.0.0 stable ships — re-verify Python-SDK-based catalog vendors.
- **July 28**: MCP spec final ships — confirm no catalog schema change via diff read against RC.
- **Ongoing highest priority**: TypeScript SDK CVE-2026-25536 audit (>=1.26.0 for all TS vendors
  in catalog) — schedule `subregistry-audit` pass.
- **Next curate run**: HubSpot (GA, `https://mcp.hubspot.com/mcp`, OAuth 2.1 + PKCE, no DCR)
  then X (Twitter) (`https://api.x.com/mcp`, verify headless auth model).
