# MCP Ecosystem Update — 2026-07-01

Daily research pass. Covers developments since the June 30 report
([2026-06-30-mcp-ecosystem-update.md](./2026-06-30-mcp-ecosystem-update.md)).
Focus: MCP Python SDK v2.0.0b1 confirmed shipped (same-day correction to yesterday's report);
Glama crosses 50k servers; spec countdown now 27 days; CVE-2025-6514 (mcp-remote RCE)
context for operators; no new CVEs or incidents; all 19 catalog servers on Streamable HTTP.

All external claims cited with source URLs.

---

## 1. MCP Python SDK v2.0.0b1 — Confirmed Shipped June 30

**Correction to the June 30 report:** Yesterday's report noted the Python SDK v2 beta had
slipped past the June 30 target. It shipped later that same day.

**v2.0.0b1** is now available on PyPI (published June 30, 2026). It is the first beta
release with full 2026-07-28 specification support, including stateless protocol
negotiation and the extensions framework.

**Release timeline:**

| Version | Date | Status |
| --- | --- | --- |
| v1.28.1 | June 26, 2026 | Latest stable (production-recommended) |
| v2.0.0a3 | June 26, 2026 | Last alpha |
| **v2.0.0b1** | **June 30, 2026** | **First beta — now available** |
| v2.0.0 (stable) | July 27, 2026 | Target (1 day before final spec) |

Production recommendation: pin `mcp>=1.27,<2` until stable v2.0.0 ships July 27.
Vendors running Python-SDK-based MCP servers should plan migration before the July 28
spec freeze. The beta window is approximately 27 days.

[[MCP Python SDK — PyPI]](https://pypi.org/project/mcp/)
[[MCP Python SDK — GitHub Releases]](https://github.com/modelcontextprotocol/python-sdk/releases)

---

## 2. MCP TypeScript SDK — v1.29.0 Latest Stable; v2 Beta Incoming

The latest stable TypeScript SDK release is **v1.29.0** (published April 2026). This is
well past the v1.26.0 security patch boundary for CVE-2026-25536 (cross-client data leak)
and CVE-2026-0621 (ReDoS). Any vendor still running v1.25.x or earlier is unpatched.

A **v2.0.0-beta.1** is in active development targeting the same July 28 final spec date.
The v2 SDK splits into `@modelcontextprotocol/server` and `@modelcontextprotocol/client`
packages, drops SSE transport from core, and aligns with stateless protocol semantics.

**Catalog action (ongoing):** The CVE-2026-25536 TypeScript SDK audit remains pending.
Of the 19 cataloged servers, those running TypeScript-SDK-based implementations
(Sentry, Linear, Figma, Notion, GitHub, Neon, Supabase, Slack) should be verified
as running ≥v1.26.0. This is carried forward to the next `subregistry-audit` pass.

[[TypeScript SDK — GitHub]](https://github.com/modelcontextprotocol/typescript-sdk)
[[CVE-2026-25536 Advisory]](https://github.com/advisories/GHSA-345p-7cg4-v4c7)
[[CVE-2026-25536 Detail — VulnerableMCP]](https://vulnerablemcp.info/vuln/cve-2026-25536-sdk-cross-client-data-leak.html)

---

## 3. Spec Countdown: 27 Days to July 28 Final

The 2026-07-28 MCP specification final release is now **27 days away**. The release
candidate has been locked since May 21, 2026; no new RC changes.

Confirmed breaking changes (recapped for reference):

- `initialize`/`initialized` handshake and `Mcp-Session-Id` header removed (stateless core)
- New required request headers: `Mcp-Method`, `Mcp-Name`, `MCP-Protocol-Version: 2026-07-28`
- `_meta` carries capabilities and W3C trace context per-request
- `ttlMs` / `cacheScope` added (client-side tool list caching)
- Roots, Sampling, Logging formally deprecated (12-month window)
- Error code -32002 → -32602
- MCP Apps (SEP-1865) and Tasks become official extensions
- Six SEPs for OAuth 2.0/OIDC auth hardening

**Catalog impact:** None. Our catalog schema and gateway projection contract do not need
changes for the July 28 spec. All 19 entries are on Streamable HTTP transport, which is
spec-forward.

[[MCP RC Announcement]](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)

---

## 4. CVE-2025-6514 — mcp-remote OS Command Injection (CVSS 9.6)

This CVE was disclosed earlier in 2025 but warrants explicit cataloging as it documents
**the first confirmed full RCE from a remote MCP server to a client OS** and is directly
relevant to operators connecting to cataloged servers via `mcp-remote`.

**Vulnerability:** Inadequate sanitization of the OAuth `authorization_endpoint` URL in
server responses allows arbitrary OS command injection when an MCP client using `mcp-remote`
(versions 0.0.5–0.1.15) connects to a malicious or compromised server. CVSS 9.6 (Critical).
437,000+ downloads of vulnerable versions were at risk.

**Fix:** mcp-remote v0.1.16. Operators using `mcp-remote` as a client adapter should
ensure they are on v0.1.16+.

**Catalog relevance:** This vulnerability is exploitable only from the *client* side when
connecting to a malicious *server*. Our catalog's job is to ensure servers are trustworthy,
which directly mitigates CVE-2025-6514 exposure for operators connecting to cataloged
entries via mcp-remote. No catalog entry requires action; the threat model reinforces
our approval workflow's value.

[[CVE-2025-6514 — SentinelOne]](https://www.sentinelone.com/vulnerability-database/cve-2025-6514/)
[[CVE-2025-6514 — JFrog analysis]](https://jfrog.com/blog/2025-6514-critical-mcp-remote-rce-vulnerability/)
[[GitHub Advisory GHSA-6xpm-ggf7-wc3p]](https://github.com/advisories/GHSA-6xpm-ggf7-wc3p)

---

## 5. Registry Scale — Glama Crosses 50k

Updated figures as of July 1, 2026:

| Registry | Count | Change vs June 30 |
| --- | --- | --- |
| Glama | **50,262** (+ ~6,951 remote connectors) | **+~462 from ~49,800 est; first 50k crossing** |
| PulseMCP | **20,120+** | ~flat vs 20,200 est |
| Smithery | **~7,300** | +~300 from 7,000 est |
| mcp.so | **~20,222** | flat |
| Official MCP Registry | ~9,652 latest / 28,959 versioned | flat |
| **MCPToplist cross-registry** | **73,547** | new figure (aggregate of all above) |

**Glama hitting 50k** is a milestone: it now tracks 50,262 open-source servers plus
6,951 remote connectors (293,804+ tools indexed). The cross-registry total (mcptoplist.com)
stands at 73,547 as of late June 2026. Against 19 approved entries in our catalog, the
trust gap is approximately **3,870:1** — reinforcing why deliberate curation matters.

[[Glama MCP Servers]](https://glama.ai/mcp/servers)
[[PulseMCP]](https://www.pulsemcp.com/servers)
[[MCPToplist]](https://mcptoplist.com/)

---

## 6. No New CVEs or Incidents July 1 — Clean Window Extends

The clean security window that began June 29 continues. No new CVEs or active incidents
were found for the period June 30 – July 1, 2026. Active ongoing campaigns (IronWorm,
Miasma, SANDWORM_MODE) have not produced new public disclosures today.

All 19 cataloged servers remain approved/public. Remote-HTTP-only catalog is structurally
immune to all documented npm/STDIO worm vectors.

---

## 7. AAIF and Community Events

The Agentic AI Foundation (AAIF, housed at the Linux Foundation) made several announcements
in late June that are worth cataloging for ecosystem context:

- **138 ambassadors in 41 countries** — First AAIF Ambassador cohort announced June 23, 2026.
  Indicates strong global ecosystem investment in MCP governance.
- **MCPCon North America** — October 22–23, 2026 in **San Jose, CA** (previously listed as
  "North America" without a specific city).
- **MCPCon Europe** — September 17–18, 2026, Amsterdam. Unchanged.

The Agentic Gateway project was also welcomed as an AAIF hosted project, and goose v1.36.0
(Anthropic's OSS agent framework) shipped a new hooks system.

[[AAIF 2026 Events Program]](https://www.linuxfoundation.org/press/agentic-ai-foundation-announces-global-2026-events-program-anchored-by-agntcon-mcpcon-north-america-and-europe)
[[AAIF Home]](https://aaif.io/)

---

## 8. MACH Alliance MCP Registry — Substantive Detail

The MACH Alliance MCP Registry (first noted June 2026) now has enough public detail to
assess properly:

- **70+ enterprise technology providers** in the MACH Alliance, including Stripe and Vercel
  (both already in our catalog).
- Vendor-neutral, enterprise-focused; supports both public and internal-only entries.
- Includes automated metadata checks plus community reporting. Optional verification tier.
- Aligned with official MCP Registry metadata format.
- Governing model: member organizations control publishing; non-members have read access.
- Focus is composable commerce/content/infrastructure — adjacent to but not competing with
  our general-purpose curation.

**Assessment:** Corroborates that Stripe and Vercel (in our catalog) are well-established
in enterprise MCP contexts. Not a sync source — MACH Alliance's scope is narrower. Stays
on watch list.

[[MACH Alliance MCP Registry]](https://machalliance.org/mach-alliance-mcp-registry)

---

## 9. Anthropic Engineering — Code Execution via MCP

Anthropic published a new engineering blog post: "Code execution with MCP: building more
efficient AI agents" (by Adam Jones and Conor Kelly). The post focuses on sandboxed code
execution capabilities accessible via MCP tool calls. No catalog action required, but it
signals Anthropic is actively publishing production use-case guidance for MCP.

[[Anthropic Engineering — Code execution with MCP]](https://www.anthropic.com/engineering/code-execution-with-mcp)

---

## 10. Catalog Hooks Summary

| Server | Status | Action |
| --- | --- | --- |
| All 19 entries | On Streamable HTTP ✓ | No transport migration needed for July 28 spec |
| TS-SDK vendors (Sentry, Linear, Figma, Notion, GitHub, Neon, Supabase, Slack) | TS SDK version unverified | **Pending:** `subregistry-audit` to verify ≥v1.26.0 |
| com.atlassian/mcp | Streamable HTTP confirmed ✓ | SSE shutdown June 30 — no action |
| com.asana/mcp | V2 Streamable HTTP ✓ | Already migrated June 18 audit |
| Python-SDK vendors | Upgrade window before July 27 | Audit pass should confirm v2 migration plan |

No entries require immediate demotion or removal today.

---

## Summary

| Topic | Status |
| --- | --- |
| MCP Python SDK v2.0.0b1 | **Confirmed released June 30** (corrects yesterday's "slipped" report) |
| MCP TypeScript SDK | v1.29.0 latest stable; CVE-2026-25536 audit pending |
| Spec countdown | **27 days** to July 28 final |
| Glama scale | **50,262** (first 50k milestone) |
| Cross-registry total | **73,547** (MCPToplist) |
| New CVEs / incidents | **None** (clean window continues from June 29) |
| Catalog entries | All 19 approved/public; all on Streamable HTTP |
| Active threat campaigns | IronWorm, Miasma, SANDWORM_MODE — no new July disclosures |
| Next action | `subregistry-audit`: TypeScript SDK version verification + Python-SDK migration check |
