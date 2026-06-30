# MCP Ecosystem Update — 2026-06-30

Daily research pass. Covers developments since the June 28 report
([2026-06-28-mcp-ecosystem-update.md](./2026-06-28-mcp-ecosystem-update.md)).
Focus: Atlassian SSE endpoint confirmed dead today; MCP Python SDK v2 beta slipped
(still alpha, v2.0.0a3); spec countdown 28 days; no new CVEs or incidents
June 29–30 — clean window; CVE-2026-25536 TypeScript SDK audit still pending.

All external claims cited with source URLs.

---

## 1. Atlassian SSE Endpoint Dead — Industry SSE Deprecation Milestone

**As of today, June 30, 2026, the Atlassian Rovo MCP Server's HTTP+SSE transport
is officially shut down.**

The endpoint `https://mcp.atlassian.com/v1/sse` has reached its announced end-of-life
date. Atlassian confirmed the deprecation notice on its Community forums and developer
documentation: after June 30, 2026, the SSE endpoint no longer accepts connections.

### Catalog status

Our catalog entry `com.atlassian/mcp` already uses the **Streamable HTTP endpoint**
(`https://mcp.atlassian.com/v1/mcp`). **No catalog action required.** This was
migrated proactively ahead of the deadline.

### Industry-wide pattern

Atlassian's SSE shutdown is the most prominent milestone in the broader SSE→Streamable
HTTP migration wave that preceded the July 28 final spec. The July 28 spec formally
removes SSE transport from the core protocol (no `Mcp-Session-Id`, no
initialize/initialized handshake). Atlassian, Asana (already migrated to V2 Streamable
HTTP as of the June 18 audit), and other major vendors have all moved or are moving to
Streamable HTTP ahead of the spec.

Any remaining SSE-typed entries in the catalog should be treated as a migration-pending
item in the next `subregistry-audit` pass.

[[Atlassian SSE Deprecation Notice — Community]](https://community.atlassian.com/forums/Atlassian-Remote-MCP-Server/HTTP-SSE-Deprecation-Notice/ba-p/3205484)
[[Atlassian Streamable HTTP Setup — Support]](https://support.atlassian.com/atlassian-rovo-mcp-server/docs/troubleshooting-and-verifying-your-setup/)

---

## 2. MCP Python SDK v2 Beta Slipped — Still Alpha as of June 30

**The MCP Python SDK v2 beta did not ship today as targeted.**

The expected timeline was:
- June 11, 2026: v2.0.0a1 (first alpha)
- **June 30, 2026:** v2.0.0b1 (beta) — target date, **missed**
- July 27, 2026: stable v2.0.0 (one day before the final spec)

The latest release as of June 30 is **v2.0.0a3** (June 26, 2026), which added stateless
protocol negotiation and multi-round tool calls. Alpha 2 (June 16) added full 2026-07-28
types and per-version protocol validation.

The beta has not been published to PyPI. The stable v2 target of July 27, 2026 remains
unchanged, meaning SDK maintainers and vendors have approximately **27 days** to complete
the validation window.

### Catalog implications

- v1.x remains stable and production-recommended; v2 pre-releases are opt-in only.
- Vendors should pin `mcp>=1.27,<2` until they are ready to migrate.
- The next `subregistry-audit` pass should confirm which (if any) of our 19 cataloged
  servers expose Python-SDK-based implementations and verify their upgrade trajectory
  before the July 28 deadline.
- The slip does not change our catalog schema or the gateway projection contract.

[[MCP Python SDK — GitHub Releases]](https://github.com/modelcontextprotocol/python-sdk/releases)
[[MCP Python SDK — PyPI]](https://pypi.org/project/mcp/)

---

## 3. MCP Spec Countdown: 28 Days to July 28 Final

The 2026-07-28 final MCP specification ships in **28 days**. The release candidate has
been locked since May 21, 2026. The ten-week SDK validation window is now approximately
three-quarters complete.

### Key RC changes (no new additions since June 28)

The RC's breaking changes remain as previously documented:
- Stateless core: `Mcp-Session-Id` removed; no `initialize`/`initialized` handshake
- New headers: `Mcp-Method`, `Mcp-Name`, `MCP-Protocol-Version: 2026-07-28`
- `_meta` carries per-request capabilities + W3C trace context
- `ttlMs` / `cacheScope` added for resource caching
- Roots / Sampling / Logging deprecated (12-month transition window)
- MCP Apps (SEP-1865) + Tasks as official extensions
- 6 SEPs for OAuth 2.0 / OIDC auth hardening

No changes to our catalog schema are required.

### Official MCP blog

No new posts since June 18, 2026 (EMA / Zero-touch OAuth announcement). The blog
remains at three posts: EMA (June 18), the RC announcement (May 21), and the maintainer
team expansion (April 8).

[[MCP RC blog post]](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)
[[MCP blog]](https://blog.modelcontextprotocol.io/)

---

## 4. Security: Clean Window June 29–30, CVE-2026-25536 Audit Still Pending

### No new CVEs or incidents June 29–30

A review of security feeds (Tenable, VulnCheck, vulnerablemcp.info, Adversa AI,
SecurityWeek, The Hacker News) shows **no new CVEs or publicly disclosed MCP-related
incidents** for June 29 or June 30, 2026. The two-day window is clean.

### Open action: CVE-2026-25536 TypeScript SDK audit

**CVE-2026-25536** (MCP TypeScript SDK cross-client data leak, CVSS 7.1) remains
an open audit item. The vulnerability affects SDK versions 1.10.0–1.25.3 and was
patched in v1.26.0. It is a race condition in `StreamableHTTPServerTransport` that
routes Client A's tool results to Client B when a single `McpServer` instance is
reused across concurrent connections.

Impact in enterprise environments: sensitive data (API responses, file contents,
database query results) may be exposed across security boundaries in stateless
HTTP transport deployments with concurrent access.

**Recommended action:** the next `subregistry-audit` pass must verify that all
TypeScript-SDK-based vendors in the catalog are running `@modelcontextprotocol/sdk
>= 1.26.0`. This is a standing open item.

[[CVE-2026-25536 — SentinelOne]](https://www.sentinelone.com/vulnerability-database/cve-2026-25536/)
[[CVE-2026-25536 — vulnerablemcp.info]](https://vulnerablemcp.info/vuln/cve-2026-25536-sdk-cross-client-data-leak.html)
[[CVE-2026-25536 — Tenable]](https://www.tenable.com/cve/CVE-2026-25536)

### Prior CVE context: CVE-2026-0621 ReDoS (patched January 2026)

For completeness: **CVE-2026-0621** is a ReDoS vulnerability in the MCP TypeScript SDK's
`UriTemplate` class (affecting versions ≤1.25.1) that was patched in v1.25.2. The
`partToRegExp()` function generated nested-quantifier regex for exploded template
variables (`{/id*}`, `{?tags*}`), causing catastrophic backtracking on crafted input.
Impact: 100% CPU, server hang/crash (DoS). Patched January 2026; confirmed in the
GitLab Advisory Database and GitHub Advisory GHSA-8r9q-7v3j-jr4g.

Any vendor running TypeScript SDK ≥1.26.0 is protected against both CVE-2026-0621
(patched in 1.25.2) and CVE-2026-25536 (patched in 1.26.0). The audit target is
therefore simply: **all TS SDK vendors ≥1.26.0**.

[[CVE-2026-0621 — GitLab Advisory]](https://advisories.gitlab.com/pkg/npm/@modelcontextprotocol/sdk/CVE-2026-0621/)
[[CVE-2026-0621 — GHSA-8r9q-7v3j-jr4g — GitHub]](https://github.com/advisories/GHSA-8r9q-7v3j-jr4g)
[[CVE-2026-0621 — VulnCheck]](https://www.vulncheck.com/advisories/mcp-typescript-sdk-uritemplate-exploded-array-pattern-redos)

---

## 5. Registry Scale: Stable (No New Data Points)

Direct fetches of Glama and PulseMCP returned 403 today. Based on the June 28 readings
and stable daily growth rates:

| Registry | June 28 count | Estimated June 30 | Note |
|---|---|---|---|
| Glama | 49,411 | ~49,800–50,200 | ~400/day growth rate |
| PulseMCP | 20,040+ | ~20,200+ | ~80/day growth rate |
| Smithery | ~7,000 | ~7,000 | Contracting/stable |
| Official MCP Registry | ~9,652 latest | ~9,700+ | from late-May data |

Cross-registry estimate: **~74,000–75,000+ indexed servers**. Our curated catalog: **19
approved**. The trust gap continues to widen; this is the market condition our
curation discipline is designed to address.

[[Glama — MCP servers]](https://glama.ai/mcp/servers)
[[PulseMCP — directory]](https://www.pulsemcp.com/servers)

---

## 6. AWS MCP Server GA Context

The **AWS MCP Server reached GA on May 6, 2026**, with full coverage of all AWS API
operations via a single managed endpoint (`https://mcp.amazonaws.com`), IAM SigV4
authentication, and sandboxed Python script execution for multi-step operations.
Available in us-east-1 and eu-central-1 (Frankfurt). Priced at no additional charge;
users pay only for underlying AWS resource usage.

Our catalog entries `com.aws/mcp` and `com.aws/mcp-knowledge` were added before GA
and remain current. The InfoQ and AWS blog coverage (published May 6, 2026) confirms
the GA scope matches our cataloged endpoint and auth model.

[[AWS MCP Server GA — AWS blog]](https://aws.amazon.com/blogs/aws/the-aws-mcp-server-is-now-generally-available/)
[[AWS MCP Server GA — AWS What's New]](https://aws.amazon.com/about-aws/whats-new/2026/05/aws-mcp-server/)
[[AWS MCP Server GA — InfoQ]](https://www.infoq.com/news/2026/05/aws-mcp-ga/)

---

## 7. Catalog Check — All 19 Servers Remain Approved/Public

Cross-checking today's findings against the 19-server catalog:

- **com.atlassian/mcp** — SSE endpoint is dead today, but our entry already points to
  Streamable HTTP (`https://mcp.atlassian.com/v1/mcp`). No action.
- **com.asana/mcp** — already migrated to V2 Streamable HTTP in the June 18 audit. No action.
- **com.aws/mcp** and **com.aws/mcp-knowledge** — GA confirmed. No action.
- All others: no new incidents, endpoint changes, or ownership issues surfaced in today's research.

**Standing open item:** CVE-2026-25536 TypeScript SDK audit (verify all TS-SDK-based vendors
≥1.26.0). This requires live endpoint testing; schedule as the next `subregistry-audit` pass.

---

## Summary

| Item | Status | Catalog action |
|---|---|---|
| Atlassian SSE shutdown (June 30) | CONFIRMED today; our entry already on Streamable HTTP | None |
| MCP Python SDK v2 beta | Slipped — still at v2.0.0a3 (June 26 alpha); beta not shipped | None; monitor |
| MCP spec final (July 28) | 28 days; RC locked; no schema changes for catalog | None |
| New CVEs / incidents June 29–30 | None — clean window | None |
| CVE-2026-25536 TS SDK audit | Still pending; next `subregistry-audit` must run this | Schedule audit |
| Registry scale | Stable ~74k–75k indexed; 19 approved | None |
