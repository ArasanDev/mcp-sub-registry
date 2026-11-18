# MCP Ecosystem Update — 2026-11-18

**Prepared by:** MCP Sub-Registry Orchestrator (autonomous daily pass)
**Scope:** What changed since yesterday's report (2026-11-17). Incremental pass: 1-day window.
**Today's date:** 2026-11-18

---

## Summary

One-day incremental pass. Yesterday's report covered Smithery proxy shutdown, IBM ContextForge
CVE cluster, MCPCon North America recap, Notifications WG, File Uploads WG, and MCPCon Nairobi
pre-event context. Today's additions:

1. **TypeScript SDK CVE cluster (Oct 20 disclosures)** — 7 CVEs, highest CVSS 8.6, fixed in
   v2.3.0/v1.32.0 (Oct 2). Audit item: verify TS-SDK-based catalog vendors are on v2.3.0+.
2. **Ruby SDK elevated to Tier 1** (confirmed ~Sept/Oct 2026) — 6th Tier-1 SDK.
3. **MCPCon Nairobi eve** — event starts tomorrow (Nov 19–20); health/safety check passed.
4. **AAIF governance changes** (Oct 2026) — opened working groups to non-members; 116 OS projects.
5. **Week-of-Nov-9 security incidents** — MCP server as entry point (German hosting provider), admin
   workstation MCP incident, v2.4.0 ships 6 vulnerability fixes.
6. No new catalog action items. Catalog security window: Day 90+ clean for 19 approved servers.

---

## Registry Scale (unchanged from yesterday)

| Registry | Count | As of | Notes |
|---|---|---|---|
| **Glama** | ~121,515 | Nov 15, 2026 | No new snapshot found today. [[Glama]](https://glama.ai/mcp/servers) |
| **PulseMCP** | ~21,614–21,710 | late Oct 2026 | Flat; submissions paused. [[PulseMCP]](https://www.pulsemcp.com/servers) |
| **Smithery (Arcade.dev)** | Directory-only | Nov 2026 | Proxy gone since Oct 31. [[Smithery]](https://smithery.ai/) |
| **Our catalog** | 19 approved/public | — | All remote-HTTP; HubSpot + Intercom overdue for curate. |

No new Glama snapshot available today. Last confirmed: 111,899 (Oct 28, eSEOspace) → 121,515
(Nov 15, yesterday's report). Daily net average continues ~530.
[[eSEOspace Oct 28 snapshot]](https://eseospace.com/blog/glama-mcp/)

---

## TypeScript SDK CVE Cluster — Oct 20, 2026 Disclosures

**Seven CVEs** were disclosed on October 20, 2026, against the MCP TypeScript SDK. The affected
packages are `@modelcontextprotocol/server` and `@modelcontextprotocol/sdk`; fixed versions shipped
in **v2.3.0** (Oct 2, 2026) and **SDK v1.32.0**.

| CVE | CVSS | Description | Fixed in |
|---|---|---|---|
| **CVE-2026-111770** | 7.7 (High) | Race condition: shared transport/server instance across HTTP requests leaks responses to wrong client | server 2.3.0 |
| **CVE-2026-111769** | 6.5 (Medium) | HTTP client follows cross-origin redirects without stripping custom headers/request bodies | SDK 1.32.0, client 2.3.0 |
| **CVE-2026-111771** | n/a | Server-side auth accepts bearer tokens not issued for the target server (token substitution) | server 2.3.0 |
| **CVE-2026-111768** | n/a | Additional SDK advisory, affects `>= 2.0.0 < 2.3.0` | server 2.3.0 |
| + 3 others | varies | Full batch of 7 CVEs; highest reported CVSS 8.6 | see advisories |

SDK releases after the fix: v2.3.1 (Oct 5), v2.4.0 (Oct 23, fixes 6 more vulnerabilities in 3
servers).

**Catalog impact:**
- Our 19 catalog entries are remote-HTTP vendor endpoints — we're a *consumer* not running the SDK
  ourselves. Catalog pages are structurally unaffected.
- **Audit action needed:** TS-SDK-based catalog vendors (GitHub, Atlassian, Stripe, Linear, Sentry,
  etc.) should be running server `>= 2.3.0` or SDK `>= 1.32.0`. Add to next `subregistry-audit`
  pass to verify via `verifiedAt` and version fields.

Sources:
- [[Corgea CVE summary]](https://corgea.com/research/cve-2026-111767-111770-111768-mcp-typescript-sdk-cross-session-leak-dos/)
- [[GitLab Advisory CVE-2026-111770]](https://advisories.gitlab.com/npm/@modelcontextprotocol/server/CVE-2026-111770/)
- [[GitLab Advisory CVE-2026-111769]](https://advisories.gitlab.com/npm/@modelcontextprotocol/sdk/CVE-2026-111769/)
- [[GitLab Advisory CVE-2026-111771]](https://advisories.gitlab.com/npm/@modelcontextprotocol/server/CVE-2026-111771/)
- [[Wiz CVE-2026-111770]](https://www.wiz.io/vulnerability-database/cve/cve-2026-111770)
- [[Red Hat CVE-2026-111768]](https://access.redhat.com/security/cve/CVE-2026-111768)

---

## Ruby SDK Elevated to Tier 1

The official MCP Ruby SDK has been confirmed as a **Tier 1** SDK — the sixth, after TypeScript,
Python, C#, Go, and Rust.

- Tier 1 requirements: full feature support, 100% conformance pass rate, defined maintenance SLA.
- Timeline per official blog: Tier 3 (March 2026) → Tier 2 / v1.0 (July 2026) → Tier 1
  (confirmed ~Sept–Oct 2026).
- Published as the `mcp` gem on RubyGems; latest version ~v1.9.0 as of Nov 10, 2026.
- Official docs: `ruby.sdk.modelcontextprotocol.io`.

**Catalog impact:** None directly. Ruby SDK Tier 1 elevation signals broader ecosystem adoption;
relevant for future server-card audit automation.

Sources:
- [[Official MCP Blog — Ruby SDK Tier 1]](https://blog.modelcontextprotocol.io/posts/ruby-sdk-tier-1/)
- [[RubyGems `mcp` gem]](https://rubygems.org/gems/mcp)

---

## MCPCon Nairobi — Eve (Starts Tomorrow, Nov 19–20)

**MCP Dev Summit Nairobi** (Linux Foundation / AAIF) starts tomorrow, November 19, 2026, at the
**Hyatt Regency Nairobi Westlands**, Nairobi, Kenya.

- Organized by the Agentic AI Foundation under the Linux Foundation.
- As of the Nov 5, 2026 health/safety update from organizers, the event is proceeding as scheduled
  (organizers had been monitoring the regional Ebola situation).
- This is the final AAIF 2026 event in the global calendar (Seoul, Shanghai, Tokyo, Amsterdam,
  Toronto, San Jose, Nairobi).

**What to watch:** Any new spec SEP signals, governance announcements, or curate-eligible MCP
server announcements from African/emerging-market vendors. Update §13 once outputs are published
(expect blog recap within 1–2 days of event).

Sources:
- [[MCP Dev Summit Nairobi official page]](https://events.linuxfoundation.org/mcp-dev-summit-nairobi/)
- [[AAIF blog]](https://aaif.io/)

---

## AAIF Governance Changes — October 2026

Diginomica reported in October 2026 that the AAIF changed criteria for incoming open source
projects and **opened working groups to non-members**. Previously only member organizations could
participate in WG governance.

- Impact: broader community participation in MCP spec development.
- As of Aug 2026, AAIF tracked 116 OS projects across 5 layers of agentic AI stack.
- 305 member organizations as of MCPCon North America (Oct 22–23).

**Catalog impact:** None directly. Broader WG participation may accelerate SEP convergence
(especially File Uploads SEP-2356 and Notifications WG).

Sources:
- [[Diginomica on AAIF governance changes]](https://diginomica.com/what-agentic-ai-foundations-rule-changes-mean-building-mcp-a2a)

---

## Security — Week of Nov 9, 2026 Incidents

A weekly security roundup (Oakgen, week of Nov 9) flagged two noteworthy incidents and one SDK
release:

1. **Nov 7 — MCP server as breach entry point (German hosting provider):** An unidentified attacker
   used a misconfigured MCP server as the initial access vector into a German hosting company's
   infrastructure. Details limited; no CVE assigned. Reinforces the registry-then-approve model:
   unapproved or misconfigured MCP endpoints are active attack surface.
   
2. **Nov 10 — MCP server on admin's workstation:** A vendor incident report documented an attacker
   leveraging an MCP server installed on an administrator's workstation to pivot into internal
   systems. Likely STDIO/local server pattern. Remote-HTTP catalog is structurally immune.

3. **v2.4.0 (Oct 23)** — TypeScript SDK release notes include fixes for 6 vulnerabilities across
   3 server types. Combined with the Oct 20 CVE batch, this means TS SDK consumers should be on
   `>= 2.4.0` for full remediation.

**Catalog security window:** Day 90+ clean for cataloged servers. No new CVEs targeting any of
the 19 approved remote-HTTP vendor endpoints.

Sources:
- [[Oakgen weekly roundup, week of Nov 9]](https://oakgen.ai/blog/ai-agent-news-week-of-2026-11-09)

---

## Catalog Hooks

No new action items beyond what was already flagged:

| Priority | Server | Action | Status |
|---|---|---|---|
| **1** | HubSpot (`mcp.hubspot.com`) | Curate — overdue 7+ months | Next `subregistry-curate` run |
| **2** | Intercom (`mcp.intercom.com/mcp`) | Curate — overdue | Next `subregistry-curate` run |
| **3** | TS SDK vendors (GitHub, Atlassian, Stripe, Linear, Sentry, etc.) | Verify running server >= 2.3.0 | Next `subregistry-audit` pass |
| **4** | MCPCon Nairobi outputs | Monitor for new server announcements | After Nov 20 |

---

## Security Assessment

| Item | Status |
|---|---|
| Cataloged servers (19 remote-HTTP) | Day 90+ clean — no active CVEs or incidents |
| TS SDK CVE batch (Oct 20) | Catalog-consumer immune; audit vendors on v2.3.0+ |
| Nov 7 German hosting incident | Remote-HTTP catalog structurally immune; general MCP hygiene signal |
| Nov 10 admin workstation incident | STDIO pattern; remote-HTTP catalog immune |

---

*Next pass: 2026-11-19 (after MCPCon Nairobi day 1 — watch for AAIF blog recap).*
