# MCP Ecosystem Update — 2026-08-24

**Produced by:** MCP Sub-Registry autonomous research routine
**Covers:** 2026-08-23 EOD → 2026-08-24
**Prior report:** [2026-08-23-mcp-ecosystem-update.md](./2026-08-23-mcp-ecosystem-update.md)

---

## 1. Headline Summary

- **MCPToplist crosses 108k: 108,245 cross-registry (Aug 23 snapshot; +7,287 vs. Aug 10
  baseline).** The MCPToplist cross-registry aggregate jumped from 100,958 (Aug 10) to 108,245
  by Aug 23 — a 13-day gain of +7,287 entries across Official MCP Registry, Glama, Smithery,
  mcp.so, and PulseMCP. This update was not captured in the Aug 23 report, which still cited
  the stale Aug 10 snapshot. The new snapshot confirms the ecosystem-wide trend is accelerating
  even while PulseMCP remains paused.
  [[MCPToplist]](https://mcptoplist.com/)
- **Glama: ~76,832 (+505 vs. Aug 23).** The search-index title reads "Open-Source MCP Servers
  – 76,832 in the Glama Registry" — a moderate daily gain continuing the post-77k approach.
  At current pace (~400–700/day), the 77k milestone is likely within 0–1 days.
  [[Glama]](https://glama.ai/mcp/servers)
- **PulseMCP: still flat (Day 14 of pause).** The ~22,020–22,050 range persists across all
  indexed pages. No announcement of ingestion-rework completion found. The step-jump backlog
  continues to accumulate.
  [[PulseMCP]](https://www.pulsemcp.com/servers)
- **AAIF Seoul blog recap: still not published (Day 10 post-summit).** No official AAIF post
  found on aaif.io. Third-party analysis is surfacing (Futurumgroup, Forkast) describing the
  summit as a "high-stakes confrontation" on security and "AAIF sets a clear direction with
  disciplined guardrails" — but no official recap from AAIF itself.
  [[Futurumgroup]](https://futurumgroup.com/insights/mcp-dev-summit-2026-aaif-sets-a-clear-direction-with-disciplined-guardrails/)
- **Security: Day 59 clean.** No new CVEs or incidents against any of the 19 cataloged
  remote-HTTP servers for Aug 23–24. Searching returns only previously-documented CVEs
  (CVE-2026-35394, CVE-2026-40576, CVE-2026-76404) — none affecting cataloged servers.
- **MCPCon Shanghai (Sept 6–7) in 13 days.** Event is confirmed on schedule at the Shanghai
  International Convention Center, co-located with KubeCon + CloudNativeCon China. Sessions
  will be recorded and posted to the AAIF YouTube channel within two weeks. No new schedule
  changes found.
  [[Shanghai schedule]](https://www.lfopensource.cn/mcp-dev-summit-shanghai/program/schedule/)

---

## 2. Scale & Registry Landscape

| Registry | Count (Aug 24) | vs. Aug 23 | Note |
|---|---|---|---|
| Glama | **~76,832** | **+505** | Search index title; approaching 77k [[Glama]](https://glama.ai/mcp/servers) |
| PulseMCP | ~22,020–22,050 | flat (Day 14) | Ingestion pause overdue [[PulseMCP]](https://www.pulsemcp.com/servers) |
| MCPToplist (cross-registry) | **108,245** | **+7,287 vs. Aug 10** | NEW Aug 23 snapshot — crosses 108k [[MCPToplist]](https://mcptoplist.com/) |
| Official MCP Registry | ~9,652 | — | v0.1 frozen; v1 in development |
| Smithery | ~7,300 | — | No August update; infra rebuild |
| Anthropic Connectors | 950+ | — | Per claude.com July 28 blog |
| Our catalog | 19 | — | All approved/public; all on Streamable HTTP |

**MCPToplist update context:** The previous tracked value was 100,958 (Aug 10 snapshot, 13 days
stale as of yesterday). The new Aug 23 snapshot at 108,245 represents a +7,287 gain (7.2% growth
in 13 days). This is consistent with Glama's own +713/day pace over the same period. The cross-
registry milestone now sits at 108k.

**Glama Aug 14–24 pattern:** ~72,328 → +148 → +614 → +683 → +756 → +1,085 (Aug 21) → flat
(Aug 22) → +713 (Aug 23, crosses 76k) → **+505 (Aug 24, ~76,832)**. Steady approach to 77k.

---

## 3. Spec & Protocol

### 3a. No new spec posts since Aug 22

The MCP blog shows two roadmap posts: the March 2026 roadmap (`/posts/2026-mcp-roadmap/`) and
the Aug 22 roadmap (`/posts/mcp-roadmap/`). The August roadmap was already documented in the
Aug 23 report. No new blog posts appeared on Aug 24.
[[MCP Blog]](https://blog.modelcontextprotocol.io/)

The March 2026 roadmap (for reference) organized work around four priority areas: transport
evolution/scalability, agent communication (Tasks), governance maturation, and enterprise
readiness. It introduced a structural shift from milestone-based to priority-area-based
organization. The August roadmap (already captured) extended this with PoP/WIF/token-exchange
agent identity and progressive discovery for large catalogs.
[[March 2026 MCP Roadmap]](https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/)

### 3b. SEP-2127 follow-on meetings approaching

SEP-2127 (MCP Server Cards, `/.well-known/mcp.json`) WG term ended Aug 14. Follow-on meetings
are scheduled for **Aug 31** (7 days) and **Sep 7** (14 days). The PR is still open. The
validator at agent-ready.dev is live and the path is confirmed. Once the spec merges, the
`subregistry-audit` server card pass becomes actionable against all 19 catalog entries.
[[SEP-2127 PR]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)
[[Agent Ready validator]](https://agent-ready.dev/mcp-card-validator)

---

## 4. Ecosystem Players

### 4a. AAIF Seoul: third-party coverage surfaces; no official recap

The MCP Dev Summit Seoul (Aug 13–14) continues to generate coverage without an official AAIF
recap post. Two new third-party sources surfaced:

- **Futurumgroup** published "MCP Dev Summit 2026: AAIF Sets A Clear Direction With Disciplined
  Guardrails" — describing the foundation as setting concrete guardrails for MCP governance and
  enterprise-safety posture.
  [[Futurumgroup]](https://futurumgroup.com/insights/mcp-dev-summit-2026-aaif-sets-a-clear-direction-with-disciplined-guardrails/)

- **Forkast** published "The Model Context Protocol Reaches a Security Inflection Point" —
  characterizing the Seoul summit as a "high-stakes confrontation" between protocol designers
  and the security community meeting in person for the first time.
  [[Forkast]](https://forkast.news/the-model-context-protocol-reaches-a-security-inflection-point/)

The Forkast framing ("routine industry check-in → high-stakes confrontation, protocol designers
and security community meeting in person for the first time") matches the observed trend in
our research: security has become the dominant agenda item at every AAIF summit since BH2026.

**Status: Day 10 post-summit, no official AAIF blog. Continue monitoring aaif.io/blog.**

### 4b. MCPCon Shanghai — 13 days away

Sept 6–7 at the Shanghai International Convention Center, co-located with KubeCon China.
40+ sessions confirmed. Sessions will be recorded and posted to the AAIF YouTube channel.
No session abstract changes or speaker updates found today.
[[Shanghai schedule]](https://www.lfopensource.cn/mcp-dev-summit-shanghai/program/schedule/)

### 4c. No new enterprise server launches

No new enterprise MCP server announcements found for Aug 24. The Impala philanthropy MCP
server (launched Aug 19, already in Anthropic Connectors Directory) remains the most recent
notable launch. Getty Images MCP (Aug 12) was previously catalogued in the watch list.

---

## 5. Security

**Day 59 clean.** Searching for new Aug 24 MCP CVEs returned only previously-documented entries:

- CVE-2026-76404 (Splunk MCP Server App, CVSS 9.1, Aug 19 — already documented in Aug 22 report)
- CVE-2026-35394 (Mobile MCP intent injection — not catalog-relevant, STDIO/device)
- CVE-2026-40576 (Excel MCP Server path traversal — not catalog-relevant, STDIO)

No new CVEs affecting any of the 19 remote-HTTP cataloged servers.

**Upcoming:** The Forkast framing of the Seoul summit as a "security inflection point" suggests
increased security scrutiny is coming to the post-summit period. The Aug 31 and Sep 7 follow-on
WG meetings may produce security-related SEPs. Monitor closely.

---

## 6. Catalog Actions

No new catalog actions required today. The next scheduled high-priority actions remain:

1. **`subregistry-audit` — SEP-2127 trigger (HIGHEST PRIORITY):** GET `/.well-known/mcp.json`
   on all 19 cataloged servers. The WG closed Aug 14; follow-on meetings Aug 31 + Sep 7.
   Use agent-ready.dev/mcp-card-validator. Record HTTP status + tool count + protocol version
   in `verification.notes` per entry.

2. **Update `verifiedAt` for `com.github/mcp`** — GitHub MCP Server v1.10.1 (Aug 20) is now
   the current release. No endpoint/auth changes, but `verifiedAt` is stale.

3. **Next curate run: HubSpot** (`mcp.hubspot.com`) — confirmed OAuth 2.1 + PKCE, GA April 13,
   one-click Claude connector, August 2026 capability expansion (Leads, Conversations,
   Help Desk, landing pages, marketing email, quotes/revenue beta).

4. **Verify TS SDK vendors ≥v1.26.0** (CVE-2026-25536) and Python SDK vendors ≥v1.28.1
   (CVE-2026-59950) — audit pass pending.

---

## 7. Summary

A quiet day. The headline update is a **MCPToplist new snapshot (108,245, Aug 23)** — the first
new cross-registry snapshot in 14 days, confirming the ecosystem crossed 108k and that overall
growth accelerated despite PulseMCP's ongoing pause. Glama continues its steady +500/day approach
to the 77k milestone. No new spec changes, no new CVEs against cataloged servers, and the AAIF
Seoul blog recap remains outstanding (Day 10). The next near-term event of note is the SEP-2127
follow-on WG meeting (Aug 31, 7 days) and MCPCon Shanghai (Sept 6–7, 13 days).

**Trust gap persists:** 108k+ cross-registry indexed vs. 19 approved in our catalog. The
sub-registry approval workflow is the answer to this gap — and the backlog (HubSpot curate,
SEP-2127 audit pass) remains the highest-priority work for the next active session.
