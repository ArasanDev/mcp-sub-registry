# MCP Ecosystem Update — 2026-07-06

Daily research pass. Covers developments since the July 5 report
([2026-07-05-mcp-ecosystem-update.md](./2026-07-05-mcp-ecosystem-update.md)).
Focus: Claude Code MCP reliability improvements (v2.1.199); X (Twitter) official hosted MCP
server launch; TikTok / Meta / Google ads MCP pattern; AWS Agent Registry namespace migration
(Aug 6); CMCPSE certification; ToolHive agent skills + vMCP circuit breakers; ecosystem scale
update (Glama ~51,577); spec countdown 22 days; clean security window extends to Day 8.

All external claims cited with source URLs.

---

## 1. Ecosystem Scale

| Directory | Count | vs. July 5 |
|-----------|-------|------------|
| **Glama** | **~51,577 servers** | +347 (+0.7%) |
| Glama connectors | 6,951 | ~stable |
| PulseMCP | 20,110+ | ~stable |
| Smithery | ~7,300 | ~stable |
| MCPToplist (cross-registry) | ~73,547 | ~stable |
| **Our curated set** | **19** | unchanged |

Glama's live page title shows **~51,577 open-source MCP servers** as of July 6, up ~347 from
51,230 on July 5. Growth rate is moderating to ~300–400/day after the late-June batch-indexing
spikes. Remote connectors stable at 6,951.

[[Glama MCP Registry]](https://glama.ai/mcp/servers)
[[Glama connectors]](https://glama.ai/mcp/connectors)

**Trust gap: ~73k+ indexed vs. 19 approved** — the gap continues to widen.

---

## 2. Claude Code MCP Reliability — v2.1.199 (July 2, 2026)

Anthropic shipped Claude Code v2.1.199 on July 2, 2026, containing several MCP-specific
stability and auth improvements that affect how clients connect to our cataloged servers.

[[Claude Code changelog]](https://code.claude.com/docs/en/changelog)
[[Claude Code July 2026 release notes — Releasebot]](https://releasebot.io/updates/anthropic/claude-code)

### Idle-timeout for hanging remote tools

Remote MCP tool calls that receive no response for **5 minutes** now abort with an error
rather than blocking the session indefinitely. The timeout is configurable via the
`CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` environment variable. This addresses a known failure
mode where a server returns 200 OK but then stalls before sending tool results, leaving
the agent frozen. Operators running high-latency cataloged servers should review their
expected tool response times and set the env var accordingly.

### OAuth `invalid_scope` fix for enterprise IdPs

A long-standing bug caused Claude Code to request the authorization server's full
`scopes_supported` catalog when the client specified no scope. This caused `invalid_scope`
failures on GitLab self-hosted and other enterprise identity providers that reject unbounded
scope requests. Fixed in v2.1.199. Our cataloged servers using OAuth 2.1 (Atlassian, Asana,
HubSpot, Linear, Supabase, etc.) are the directly affected class — enterprise operators on
those servers who experienced auth failures should update Claude Code and re-authenticate.

### Capability discovery retry logic

`tools/list`, `prompts/list`, and `resources/list` discovery calls now retry on transient
network errors with short backoff, rather than failing the session on the first error.
Combined with: headless environments skip the OAuth browser-popup and go straight to the
paste-the-URL prompt. Both changes reduce session-startup friction for remote endpoints.

### Clearer HTTP 404 diagnostics

MCP HTTP 404 errors now surface the request URL in the error message and point to the MCP
configuration file. Useful for diagnosing misconfigured gateway catalog projections.

### Catalog relevance

No catalog data changes required. These are client-side improvements that make the Claude
Code MCP client more robust when connecting to our cataloged servers. The `invalid_scope`
fix is the highest-priority item for operators with enterprise IdP deployments.

---

## 3. X (Twitter) Official Hosted MCP Server — June 30, 2026

X shipped an official hosted MCP server on June 30, 2026, making the X API accessible to
any MCP-compatible AI tool (Claude, Cursor, Grok Build, others) without requiring developers
to build and host their own X API bridge.

[[TechCrunch: X now offers an MCP server to make its platform easier for AI tools to use]](https://techcrunch.com/2026/06/30/x-now-offers-an-mcp-server-to-make-its-platform-easier-for-ai-tools-to-use/)
[[CybersecurityNews: X Launches Hosted MCP Servers to Connect Cursor, Claude, and Other AI Tools]](https://cybersecuritynews.com/x-launches-hosted-mcp-servers/)
[[The Next Web: X launches hosted MCP server so AI tools can plug into its API directly]](https://thenextweb.com/news/x-hosted-mcp-server-ai-tools-api)

### What it exposes

The server wraps existing X API capabilities — searching posts, reading content, user
lookups, and conversation/trend analysis — in MCP tool format. It does **not** add new
capabilities beyond what the X API already offers. Authentication is via the user's own X
account OAuth permissions, hosted and managed by X.

### Industry significance

X joins GitHub, Slack, Notion, Stripe, Salesforce, Atlassian, Asana, Linear, and Supabase
as platforms that now ship an **official, vendor-hosted** MCP endpoint rather than leaving
integration to third-party community servers. The pattern is now well-established: platforms
ship their own MCP server to ensure quality, governance, and auth control over AI agent access.

### Catalog candidate assessment

X's MCP server is a candidate for a future curate run. Prerequisites for approval:
- Endpoint URL confirmation and reachability verification
- Auth model: OAuth 2.1 with PKCE preferred (X historically used OAuth 2.0 Bearer + OAuth 1.0a)
- Rate-limit and terms-of-service review (X API access tiers vary by plan)

**Not adding to the catalog today** — requires a proper curate-run endpoint verification.
Noted here for the next `subregistry-curate` pass.

---

## 4. Ad-Platform MCP Server Pattern (Meta + Google + TikTok)

Three major advertising platforms shipped official MCP servers in an eight-week window
(April–May 2026):

| Platform | Launch | Status |
|----------|--------|--------|
| **Google** | April 28, 2026 | GA |
| **Meta** | April 29, 2026 | GA |
| **TikTok** | May 13, 2026 | Announced; no public docs/GA date as of June 2026 |

[[Digital Applied: Meta, Google, TikTok Ship Official Ads MCP Servers]](https://www.digitalapplied.com/blog/official-ads-mcp-servers-meta-google-tiktok-2026-playbook)
[[Digiday: TikTok launches MCP server to let AI agents run campaigns]](https://digiday.com/marketing/tiktok-launches-mcp-server-to-let-ai-agents-run-campaigns/)
[[TikTok: About TikTok for Business Agentic Hub and MCP Server]](https://ads.tiktok.com/help/article/about-tiktok-for-business-agentic-hub-and-mcp-server)

TikTok's offering is **two-layer**: a **TikTok for Business Agentic Hub** (a discovery
marketplace for AI-powered campaign solutions) and the **TikTok for Business MCP Server**
(the connectivity layer giving AI agents structured access to the Ads API: campaign
management, performance reporting, audience configuration, and creative operations).

### Catalog relevance

These are **advertising-platform-specific** endpoints, not general-purpose developer tools.
Their catalog utility depends on whether the gateway operator's persona is a marketing/RevOps
team. None of these are current catalog candidates under our "developer productivity and
infrastructure" primary persona. They are worth noting in the watch list as the persona-based
catalog expansion (§12.5 strategy) matures — "if you are a performance marketer, here are
the trusted MCP servers for you."

---

## 5. AWS Agent Registry — Namespace Migration August 6, 2026

The AWS Agent Registry (currently in public preview under the `bedrock-agentcore` namespace)
is migrating to a new `agent-registry` namespace on **August 6, 2026** — 31 days from today.

[[AWS Agent Registry docs — Get started]](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-get-started.html)
[[AWS Agent Registry overview]](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry.html)
[[InfoWorld: AWS targets AI agent sprawl with new Bedrock Agent Registry]](https://www.infoworld.com/article/4157183/aws-targets-ai-agent-sprawl-with-new-bedrock-agent-registry.html)

Affected: endpoints, IAM policies, SDK clients, CLI scripts, and registry data. AWS has
published a migration FAQ. The service itself remains **Preview** — no GA announcement.

The AWS Agent Registry now documents its approval workflow: publishers submit MCP servers,
tools, agents, and skills; the registry exposes them as an MCP endpoint; downstream
consumers discover via semantic + keyword search. This is the same `discovered → approved
→ consumed` pattern as our registry, at the AWS scale.

**Catalog action:** `com.aws/mcp` (AWS MCP Server, already approved in our catalog) is
**distinct** from the AWS Agent Registry. No catalog change needed. The namespace migration
is purely an AWS internal infrastructure event. Track whether the AWS Agent Registry reaches
GA before the spec ships on July 28.

---

## 6. CMCPSE — First Dedicated MCP Security Certification (Practical DevSecOps)

Practical DevSecOps launched the **Certified MCP Security Expert (CMCPSE)** on
June 15, 2026 — described as the first hands-on security certification built specifically
for attacking and defending MCP infrastructure.

[[Practical DevSecOps: Certified MCP Security Expert (CMCPSE)]](https://www.practical-devsecops.com/certified-mcp-security-expert/)
[[National Law Review press release]](https://natlawreview.com/press-releases/practical-devsecops-launches-certified-mcp-security-expert-cmcpse-first)

**Coverage:** OWASP MCP Top 10, tool poisoning attacks, prompt injection defense,
OAuth 2.1 for MCP, supply chain security for AI agent workflows. 60-day lab access,
30+ hands-on exercises, 6-hour practical exam. $599.

**Why it matters for the registry:** The existence of a formalized MCP security
certification signals that the practitioner market has matured beyond "patch the
individual CVE" toward "build it right from the start." Security practitioners working
from a CMCPSE curriculum will recognize the value of our `discovered != approved != enabled`
separation — it maps directly to the OWASP MCP Top 10 controls the certification teaches.
This is also a distribution channel: CMCPSE-credentialed operators are the exact audience
for a curated registry.

---

## 7. ToolHive — Agent Skills + vMCP Circuit Breakers

Stacklok's ToolHive (Apache 2.0 enterprise MCP platform, already on our landscape watch
list) has shipped two significant capability additions relevant to the registry-to-runtime
pipeline:

[[Stacklok ToolHive releases]](https://github.com/stacklok/toolhive/releases)
[[ToolHive docs: updates]](https://docs.stacklok.com/toolhive/updates)
[[Stacklok: From unknown to verified — Solving the MCP server trust problem]](https://stacklok.com/blog/from-unknown-to-verified-solving-the-mcp-server-trust-problem/)

### Agent Skills (registry-published instruction bundles)

ToolHive now supports **agent skills** — reusable bundles of instructions and configuration
that teach AI agents how to perform specific tasks. Teams publish skills to a registry and
install them across supported AI clients from a single CLI. This is noteworthy: ToolHive
is effectively building a **skill registry on top of its MCP server registry**. The two
layers (what server, what skills) are kept separate but connected. This validates the
direction of §12.5 strategy — persona-based curated bundles are the next product layer
after a trusted server catalog.

### vMCP Circuit Breakers (production resilience)

ToolHive's virtual MCP proxy (`vMCP`) now includes circuit breakers that prevent cascading
failures when backend MCP servers degrade. Additionally, the Registry Server gained
cluster-wide namespace scanning for multi-tenant Kubernetes deployments. These are
production-hardening features that signal ToolHive is being deployed at enterprise scale.

---

## 8. Spec + SDK — 22 Days to July 28

**Spec final: July 28, 2026 — 22 days away.** No new RC changes since the May 21 lock.

[[2026-07-28 MCP Spec RC — MCP Blog]](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)
[[Beta SDKs — MCP Blog]](https://blog.modelcontextprotocol.io/posts/sdk-betas-2026-07-28/)

| SDK | Stable target | Current |
|-----|--------------|----------|
| Python `mcp` | July 27, 2026 | v2.0.0b1 beta (June 30) |
| TypeScript | July 28, 2026 | v2 beta; new packages: `@modelcontextprotocol/server` + `@modelcontextprotocol/client` |
| Go | July 28, 2026 | v1.7.0-pre.1 beta |
| C# | July 28, 2026 | v2.0.0-preview.1 beta |

v1.x SDKs receive security updates for ≥6 months post-v2 GA. CVE-2026-25536 audit gate
(≥1.26.0) remains valid until vendors migrate to v2.

**MCPCon Shanghai** schedule announcement expected **July 8, 2026** (2 days away).
Event: September 6–7, co-located with KubeCon + CloudNativeCon China.
[[MCPCon Shanghai — LF Open Source]](https://www.lfopensource.cn/mcp-dev-summit-shanghai/)

---

## 9. CVE-2026-25536 TypeScript SDK Audit — Still Pending

No new information today on the vendor-by-vendor TypeScript SDK patch status.

[[CVE-2026-25536 — NVD]](https://nvd.nist.gov/vuln/detail/CVE-2026-25536)
[[CVE-2026-25536 — Vulnerable MCP Project]](https://vulnerablemcp.info/vuln/cve-2026-25536-sdk-cross-client-data-leak.html)

Affected: `@modelcontextprotocol/sdk` v1.10.0–v1.25.3. Fixed: v1.26.0. Also covers
CVE-2026-0621 ReDoS (patched in v1.25.2). TypeScript SDK v2 (July 28) is class-closed
on both issues but requires migration. The audit pass (`subregistry-audit`) remains the
next highest-priority action after the HubSpot curate run.

---

## 10. Security Window — Day 8 Clean

No new MCP CVEs disclosed on July 5 or July 6. Longest clean window in the tracked period.
The **Practical DevSecOps MCP Security Statistics 2026** report now documents **40+ CVEs**
by April 2026 (pace: ~1 CVE every 4 days in H1 2026); the current clean streak is the
likely result of coordinated disclosure windows rather than a sustained drop in vulnerability
research.

[[Practical DevSecOps MCP Security Statistics 2026]](https://www.practical-devsecops.com/mcp-security-statistics-2026-report/)
[[Vulnerable MCP Project — CVE database]](https://vulnerablemcp.info/)

---

## 11. Catalog Status — All 19 Servers Approved/Public

No catalog-level action from today's findings. All 19 approved remote servers remain
`approved`/`public`.

**Additions flagged for next curate run:**
- **X (Twitter) MCP Server** (`https://api.x.com/2/mcp` or similar — endpoint URL to be
  verified): Official vendor-hosted, OAuth-gated, reads-only X API data. Requires endpoint
  discovery + reachability verification before approval.

**Pending from §13 Next Actions (in priority order):**
1. Seed the 19-server catalog into the live DB (→ `subregistry-deploy`)
2. Next curate run: HubSpot (`https://mcp.hubspot.com/mcp`, OAuth 2.1 + PKCE, no DCR) +
   X (Twitter) MCP Server (new candidate)
3. Next audit: TypeScript SDK CVE-2026-25536 verification (PRIORITY)
4. Track SEP-2127 Server Cards merge (WG term ends Aug 14, 2026)

---

## Summary

| Item | Finding |
|------|----------|
| Glama | **~51,577** — +347 vs July 5 |
| Spec countdown | **22 days** to July 28 final |
| Claude Code v2.1.199 | MCP idle-timeout, OAuth scope fix, retry logic, better 404 errors |
| X MCP Server | Official hosted server launched June 30; catalog candidate for next curate run |
| Ads-platform pattern | Meta (Apr 29), Google (Apr 28), TikTok (May 13) all ship official MCP servers |
| AWS Agent Registry | Namespace migration: bedrock-agentcore → agent-registry on Aug 6 (still Preview) |
| CMCPSE certification | First hands-on MCP security certification (Practical DevSecOps, June 15, $599) |
| ToolHive | Agent skills registry layer + vMCP circuit breakers shipped |
| CVE-2026-25536 | Audit still pending; no new vendor patch info today |
| Clean security window | **Day 8** — no new MCP CVEs July 5–6 |
| Catalog | All 19 approved/public; no action; X server flagged for next curate pass |
