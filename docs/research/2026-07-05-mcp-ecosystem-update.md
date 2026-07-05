# MCP Ecosystem Update — 2026-07-05

Daily research pass. Covers developments since the July 4 report
([2026-07-04-mcp-ecosystem-update.md](./2026-07-04-mcp-ecosystem-update.md)).
Focus: New security analyses of the 2026-07-28 spec attack surfaces (SecurityWeek + Akamai);
Claude Code OAuth token theft via MCP hijacking (Mitiga Labs, no patch planned); Kiro IDE
enterprise MCP governance as a new landscape entrant; ecosystem scale update (Glama crosses
51k); spec countdown 23 days; clean security window extends to Day 7.

All external claims cited with source URLs.

---

## 1. Ecosystem Scale — Glama Crosses 51k

| Directory | Count | vs. July 3 |
|-----------|-------|------------|
| **Glama** | **51,230 servers** | +385 (+0.8%) |
| PulseMCP | 20,110+ | ~stable |
| Smithery | ~7,300 | ~stable |
| MCPToplist (cross-registry) | ~73,547 | ~stable |
| **Our curated set** | **19** | unchanged |

Glama has crossed **51,000 servers** for the first time — up from 50,845 on July 3.

[[Glama MCP Registry]](https://glama.ai/mcp/servers)
[[PulseMCP Server Directory]](https://www.pulsemcp.com/servers)

**Trust gap: ~73k+ indexed vs. 19 approved.** This gap is the product.

---

## 2. Security Analysis of 2026-07-28 Spec — New Attack Surfaces (SecurityWeek + Akamai)

Two independent security research publications in early July 2026 analyzed the attack surface
introduced by the 2026-07-28 RC specification. Both SecurityWeek and Akamai published analyses
focused on the enterprise security implications of the stateless core, MCP Apps, Tasks extension,
and new mandatory headers.

[[SecurityWeek: New Enterprise-Ready MCP Specification Brings New Security Challenges]](https://www.securityweek.com/new-enterprise-ready-mcp-specification-brings-new-security-challenges/)
[[Akamai: The New MCP Specification: What Security Teams Must Prepare For]](https://www.akamai.com/blog/security-research/new-mcp-specification-security-teams-must-prepare)

### Three new attack surfaces

**1. MCP Apps (SEP-1865) — stored XSS risk**

MCP Apps are now a first-class extension: servers can ship interactive HTML interfaces that
MCP hosts (IDEs, agents) render in sandboxed iframes. The risk: stored cross-site scripting
(XSS) in server-provided HTML that a host renders without proper sandboxing or CSP. A
compromised or malicious server could inject persistent JavaScript into the client environment.

**2. Tasks extension — DoS vector**

The Tasks extension enables long-running, asynchronous server-side operations. Because task
creation is client-cheap but server-expensive (CPU, memory, database), an attacker can submit
a burst of task requests and immediately disconnect, leaving the server to process costly
operations with no requester to bill. One-way asynchronous exploitation: no round-trip
required.

**3. Mcp-Method / Mcp-Name headers — protocol confusion + data leakage**

New mandatory headers (`Mcp-Method`, `Mcp-Name`, `MCP-Protocol-Version: 2026-07-28`) enable
header-based request routing and caching. Two risks introduced:
- **Protocol confusion / HTTP desync**: crafted header sequences can confuse shared proxies and
  load balancers about request boundaries.
- **Secret leakage via headers**: if developers map API keys, tokens, or PII into these headers
  (a common mistake), those values become visible to every proxy, CDN, and log aggregator along
  the path.

### Catalog relevance

Our catalog is a curation registry — **not a runtime surface**. We do not proxy, host, or
execute tool calls. The XSS and DoS risks are client-host and server-implementation concerns.
The header-confusion risk is a gateway-operator concern. Our remote-HTTP-only catalog model
stores no runtime state and provides no execution surface for any of these vectors.

However, the security analysis reinforces a key annotation we should propagate through the
gateway projection: cataloged servers must not receive secret *values* from the gateway
(our schema enforces this — `required_secrets` stores names only). The Backslash analysis
(June 20, already in landscape.md) and these new analyses agree on the same underlying
requirement.

---

## 3. Claude Code OAuth Token Theft via MCP Hijacking (Mitiga Labs)

**Disclosure timeline:**
- March 23, 2026: Mitiga Labs discovery
- April 10, 2026: Reported to Anthropic
- April 12, 2026: Anthropic response — "out of scope"
- June 2026: Security Boulevard coverage
- July 2026: SecurityWeek, CyberSecurityNews, CSO Online, eSecurity Planet coverage

[[SecurityWeek: Claude Code OAuth Tokens Can Be Stolen Through Stealthy MCP Hijacking]](https://www.securityweek.com/claude-code-oauth-tokens-can-be-stolen-through-stealthy-mcp-hijacking/)
[[Mitiga: MCP Token Theft in Claude Code: A Man-in-the-Middle Attack Chain]](https://www.mitiga.io/blog/claude-code-mcp-token-theft-mitm)
[[CyberSecurityNews: Hackers Can Hijack Claude Code MCP Traffic to Steal OAuth Tokens]](https://cybersecuritynews.com/claude-code-mcp-traffic-hijack/)

### Attack mechanism

The MCP configuration and stored OAuth tokens live in `~/.claude.json`. A malicious npm
package using a `postinstall` lifecycle hook silently rewrites MCP server URLs in that file,
replacing legitimate entries with an attacker-controlled local proxy. Claude Code then reads the
rewritten URL and routes all MCP traffic — including OAuth bearer tokens — through the attacker's
infrastructure. No privilege escalation or memory corruption required. The full chain executes via
the standard npm install flow.

### Why Anthropic said "out of scope"

Anthropic determined that user consent to install npm packages is a prerequisite for the attack,
placing it in the same category as pre-authenticated software supply-chain risks. No patch is
planned. The detection and response burden falls on enterprise security teams.

### Catalog relevance

**No direct catalog action.** This is a client-side attack on Claude Code, not a vulnerability in
any of our cataloged servers. Our servers are remote-HTTP, OAuth-gated endpoints — they are the
*destination* of legitimate MCP traffic, not the vector.

**Operator awareness note:** Enterprises deploying Claude Code alongside our registry should:
1. Monitor `~/.claude.json` (or org-level MCP config) for unexpected URL changes
2. Alert on MCP server URL modifications outside of controlled deployments
3. Treat OAuth refresh anomalies on SaaS platforms as a potential MCP hijack indicator

The attack further validates the value of a curated registry that pins trusted server URLs —
an operator with a policy-enforced MCP allowlist (e.g., Kiro registry below, Obot, JFrog)
is structurally harder to compromise via URL-swap attacks.

---

## 4. Kiro IDE — Enterprise MCP Governance (New Landscape Entrant)

Amazon's **Kiro IDE** has shipped two enterprise governance features relevant to the MCP catalog
model:

[[Kiro: Enterprise governance — control your MCP servers and models]](https://kiro.dev/blog/enterprise-governance-mcp-and-models/)
[[Kiro MCP Registry docs]](https://kiro.dev/docs/enterprise/governance/mcp/)

**MCP Server Registry (March 12, 2026):**
Admins define an allowlist of approved MCP servers as a JSON file hosted on any HTTPS endpoint
(S3, nginx, internal web server). The URL is set in the Kiro admin console and enforced for all
org users. This is exactly the `approved-server-list-as-a-catalog` pattern — Kiro reads from a
registry like ours and enforces it at the IDE layer. Our `GET /v0.1/gateway/catalog` projection
format is compatible with this pattern.

**Kiro CLI 2.11.0 (July 2, 2026):**
Added dedicated OAuth management commands for remote MCP servers:
- `/mcp auth` — forces re-authentication
- `/mcp cancel-auth` — aborts a pending auth flow  
- `/mcp logout` — removes stored credentials

[[Kiro CLI 2.11.0 changelog]](https://kiro.dev/changelog/cli/2-11/)

**Landscape significance:** Kiro is the second major IDE (after VS Code/GitHub Copilot via Obot)
to ship enterprise MCP allowlist governance. The pattern of IDE-layer enforcement against a
registry-provided allowlist is now established by two independent implementations. Our gateway
catalog projection can serve as the source-of-truth for such lists. Kiro added to landscape.md
watch list.

---

## 5. Spec + SDK Countdown — 23 Days

**Spec final:** July 28, 2026 — **23 days away.** No new RC changes since the May 21 lock.

[[2026-07-28 MCP Spec RC — MCP Blog]](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)
[[Beta SDKs for 2026-07-28 — MCP Blog]](https://blog.modelcontextprotocol.io/posts/sdk-betas-2026-07-28/)

**SDK stable release dates:**

| SDK | Stable target | Status |
|-----|--------------|--------|
| Python `mcp` | July 27, 2026 | v2.0.0b1 beta live (June 30) |
| TypeScript | July 28, 2026 | v2 beta live; new package names: `@modelcontextprotocol/server` + `@modelcontextprotocol/client` |
| Go | July 28, 2026 | v1.7.0-pre.1 beta |
| C# | July 28, 2026 | v2.0.0-preview.1 beta |

v1.x of all SDKs receives security updates for ≥6 months post-v2 GA.

**MCPCon Shanghai schedule** expected July 8, 2026 (3 days away). Event itself: September 6–7,
co-located with KubeCon + CloudNativeCon China.
[[MCPCon Shanghai — LF Open Source]](https://www.lfopensource.cn/mcp-dev-summit-shanghai/)

---

## 6. Pending Audit — CVE-2026-25536 TypeScript SDK Verification

**Status: still pending** — no new information today. This remains the highest-priority audit
item.

[[CVE-2026-25536 — GitHub Advisory]](https://github.com/advisories/GHSA-345p-7cg4-v4c7)
[[CVE-2026-25536 — SentinelOne]](https://www.sentinelone.com/vulnerability-database/cve-2026-25536/)

The vulnerability affects `@modelcontextprotocol/sdk` v1.10.0–v1.25.3 (cross-client data leak
via shared `StreamableHTTPServerTransport` / `McpServer` instance reuse). Patched in **v1.26.0**.

Catalog vendors that use the TypeScript SDK for their hosted endpoints need to be running ≥1.26.0.
Next `subregistry-audit` run must verify which cataloged vendors have updated. Also covers
CVE-2026-0621 (ReDoS, patched in v1.25.2).

The TypeScript SDK v2 (stable July 28) uses entirely new package names and the session/transport
model is redesigned — this vulnerability is class-closed in v2. Until vendors migrate, the
v1 patch (≥1.26.0) is the gate.

---

## 7. Catalog Status — All 19 Servers Approved/Public

No catalog-level action from today's findings. All 19 approved remote servers remain
`approved`/`public`. The Mitiga Labs Claude Code attack is a client-side issue; the
2026-07-28 spec security concerns are runtime/implementation concerns; both are structurally
outside our catalog boundary.

**Pending from §13 Next Actions (in priority order):**
1. Seed the 19-server catalog into live DB (→ `subregistry-deploy`)
2. Next curate run: HubSpot (`https://mcp.hubspot.com/mcp`, OAuth 2.1 + PKCE, no DCR)
3. Next audit: TypeScript SDK CVE-2026-25536 verification (PRIORITY)
4. Track SEP-2127 Server Cards merge (WG term ends Aug 14, 2026)

---

## Summary

| Item | Finding |
|------|---------|
| Glama | **51,230** — first crossing of 51k |
| PulseMCP | 20,110+ |
| Spec countdown | **23 days** to July 28 final |
| Security: new spec | XSS (MCP Apps), DoS (Tasks), header confusion — operator concerns; catalog immune |
| Security: MCP hijack | Claude Code OAuth token theft (Mitiga Labs); no patch; client-side only |
| New landscape entrant | Kiro IDE enterprise MCP allowlist governance (March + July 2026) |
| MCPCon Shanghai | Schedule announced July 8 (event Sept 6–7) |
| CVE-2026-25536 | Audit still pending |
| Clean security window | Day 7 — no new MCP CVEs July 4–5 |
| Catalog | All 19 approved/public; no action needed |
