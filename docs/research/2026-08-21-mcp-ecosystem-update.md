# MCP Ecosystem Update — 2026-08-21

**Produced by:** MCP Sub-Registry autonomous research routine
**Covers:** 2026-08-20 EOD → 2026-08-21
**Prior report:** [2026-08-20-mcp-ecosystem-update.md](./2026-08-20-mcp-ecosystem-update.md)

---

## 1. Headline Summary

- **Glama: ~75,614 (+1,085 vs. Aug 20 ~74,529).** Search-index page title confirms count;
  direct page fetch egress-blocked. The +1,085 single-day jump is the largest in the past
  two weeks, reversing a week of smaller 148–756 increments. Batch-indexing pulse pattern
  continues. [[Glama]](https://glama.ai/mcp/servers)
- **PulseMCP: ~22,020–22,070 (flat, Day 11 of ingestion-rework pause).** Search result
  titles continue to show the same 22,020–22,070 range with no step-jump. The pause has
  now exceeded its stated "mid-August" end date by eleven full days with no announced restart.
  [[PulseMCP]](https://www.pulsemcp.com/servers)
- **AAIF Seoul blog recap: STILL NOT PUBLISHED (Day 7 post-summit).** The aaif.io/blog
  index returns no Seoul-specific post. Only external analyst coverage (Futurumgroup —
  "MCP Dev Summit 2026: AAIF Sets A Clear Direction With Disciplined Guardrails") has
  indexed, with no AAIF-authored recap. This is now longer than the Bengaluru post's
  publication lag. [[AAIF blog]](https://aaif.io/blog)
  [[Futurumgroup]](https://futurumgroup.com/insights/mcp-dev-summit-2026-aaif-sets-a-clear-direction-with-disciplined-guardrails/)
- **SEP-2127 still OPEN (not merged); latest activity Aug 14.** PR #2127 remains in review.
  Path confirmed as `/.well-known/mcp/server-card.json`. Follow-on WG meetings Aug 31 +
  Sep 7 still scheduled. No catalog schema action needed.
  [[SEP-2127 PR]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)
- **Security: Day 56 clean.** No new CVEs against any of the 19 cataloged remote-HTTP
  servers found for Aug 20–21.
- **New MCP server launches: Impala (philanthropy, Aug 19).** New domain-specific server
  not yet in prior reports; not a catalog candidate (not developer tooling). Reviewed below.

---

## 2. Scale & Registry Landscape

| Registry | Count (Aug 21) | vs. Aug 20 | Note |
|---|---|---|---|
| Glama | ~75,614 | +1,085 | Search-index page title [[Glama]](https://glama.ai/mcp/servers) |
| PulseMCP | ~22,020–22,070 | flat (Day 11) | Ingestion-rework pause; no step-jump [[PulseMCP]](https://www.pulsemcp.com/servers) |
| MCPToplist (cross-registry) | 100,958 | (Aug 10 snap; 11 days stale) | No new snapshot |
| Official MCP Registry | ~9,652 | — | v0.1 frozen; v1 in development |
| Smithery | ~7,300 | — | No August update; infra rebuild |
| Anthropic Connectors | 950+ | — | Per claude.com July 28 blog |
| Our catalog | 19 | — | All approved/public; all on Streamable HTTP |

**Glama weekly pattern (Aug 14–21):** flat (~72,328), +148, +614, +683, +756, +1,085. The
+1,085 jump on Aug 21 is the largest single-day increment in this week-long window and
strongly resembles a batch-indexing pulse rather than organic linear growth. Glama has crossed
75k for the first time.

**PulseMCP Day 11:** Pause continues with no announced restart date. The stated "mid-August"
deadline has now passed by 11 days. When the ingestion engine restarts, a significant
backlog of submissions is expected to produce a step-jump. This watch item remains high priority
as the next quantitative shift in the landscape.

**Cross-registry estimate (Aug 21):** Glama ~75,614 + PulseMCP ~22,070 + Smithery ~7,300
+ Official ~9,652 ≈ **~114k raw entries** (heavy overlap). MCPToplist's Aug 10
cross-deduplicated count of 100,958 is the best deduplication reference; likely ~103k–107k
deduplicated by now if Glama's Aug 11–21 surge (+5,634 net, 10 days) is substantially novel.

---

## 3. New MCP Server Launches

### 3a. Impala MCP Server for Philanthropy (Aug 19, 2026)

Impala announced an MCP server for the philanthropic sector on Aug 19, 2026. The server
makes Impala's sector-wide philanthropic intelligence database accessible through Claude and
ChatGPT. This is a domain-specific (not developer-tooling) server for grant-makers and
non-profit organizations.

**Catalog assessment:** Not a catalog candidate for the current developer-tools persona. This
server is domain-specific to the philanthropic sector and not a general-purpose developer
tool. Relevant to §12.5 persona-based catalog expansion (philanthropy persona bundle if
we add that). No action required.
[[Impala MCP press release]](https://www.accessnewswire.com/newsroom/en/business-and-professional-services/impala-launches-ai-native-mcp-server-for-the-philanthropic-secto-1208982)

### 3b. Carry-forward (previously documented, not repeated in detail)

- Getty Images MCP Server (Aug 12) — media/creative persona watch; not current developer-tools
  candidate. [[GlobeNewswire]](https://www.globenewswire.com/news-release/2026/08/12/3344005/0/en/getty-images-launches-mcp-server-to-connect-creative-and-editorial-content-to-ai-workflows-and-products.html)
- Xnurta MCP for Retail Media (Aug 14) — retail media persona watch; not current developer-tools
  candidate. [[martechcube]](https://www.martechcube.com/xnurta-announced-the-launch-of-mcp-for-retail-media/)

---

## 4. Security

### 4a. Day 56 clean window

No new CVEs published against any of the 19 cataloged remote-HTTP servers on Aug 20–21.
No new malicious-package campaigns, tool-poisoning incidents, or endpoint ownership events
detected. The clean window continues unbroken since the last catalog-impacting security event.

### 4b. Security posture summary (no changes)

All active threats from CLAUDE.md §13 remain as previously documented (remote-HTTP catalog
structurally immune to the npm/PyPI/STDIO worm vectors; auth-gated catalog immune to
unauthenticated-endpoint attack classes). No new threat actors or attack techniques surfaced.

---

## 5. Specification & Standards

### 5a. SEP-2127 (Server Cards)

The SEP-2127 PR (#2127) remains **open** on the modelcontextprotocol repository. The last
substantive activity was Aug 14 (final review feedback addressed; PR #3242 merged into the
SEP branch). The path `/.well-known/mcp/server-card.json` is confirmed in the spec draft.

Note: There has been some confusion in prior reports between `/.well-known/mcp.json` and
`/.well-known/mcp/server-card.json`. The Aug 21 fetch of the PR confirms the latter is the
agreed endpoint path. The `/.well-known/mcp.json` path referenced in a July 28 CLAUDE.md
§13 note was a correction at the time but appears to be outdated; the current SEP-2127 draft
uses `/.well-known/mcp/server-card.json`.

**Audit trigger remains active:** The SEP-2127 server card audit (GET `/.well-known/mcp/server-card.json`
on all 19 cataloged servers) is OVERDUE since Aug 14 and is the highest-priority task for
the next `subregistry-audit` skill invocation.

Follow-on WG meetings: **Aug 31 + Sep 7** (already scheduled).
[[SEP-2127 PR]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)
[[MCP Server Card validator]](https://agent-ready.dev/mcp-card-validator)
[[How to publish server card]](https://agent-ready.dev/how-to-publish-an-mcp-server-card)

### 5b. 2026-07-28 spec (no changes)

Spec is final. SDK v2 stable (Python July 27; TypeScript July 28). No new compliance
disclosures or vendor announcements found Aug 20–21.

---

## 6. Events

### 6a. MCPCon Shanghai (Sept 6–7)

Event confirmed at Shanghai International Convention Center, co-located with KubeCon +
CloudNativeCon China + OpenInfra Summit + PyTorch Conference China 2026. Schedule page
live at lfopensource.cn but egress-blocked for direct fetch. No new session abstracts
accessible via search-engine index.

Next check: late August (≤2 weeks before event).
[[LF Open Source CN schedule]](https://www.lfopensource.cn/mcp-dev-summit-shanghai/program/schedule/)
[[AAIF events press release]](https://www.linuxfoundation.org/press/agentic-ai-foundation-announces-global-2026-events-program-anchored-by-agntcon-mcpcon-north-america-and-europe)

### 6b. AAIF Seoul recap (still pending)

No AAIF-authored blog post for the Aug 13–14 MCP Dev Summit Seoul has appeared in search
index as of Aug 21. This is now Day 7 post-summit. The AAIF published the North America
recap (July 10) within roughly a week of that summit (June event); the Seoul delay is anomalous.
AAIF blog listing at aaif.io/blog shows the most recent relevant post as the North America recap.
External analyst coverage (Futurumgroup) covers the event but is not an official AAIF output.

**Watch: Aug 22–24 (likely window for publication based on past cadence).**

---

## 7. Catalog — No Action Required Today

All 19 cataloged servers remain approved/public. No security disclosures, endpoint changes,
or ownership events detected for any catalog entry today.

**Standing pending audit items (carry forward from CLAUDE.md §13):**
- `com.github/mcp`: bump `verifiedAt`; v1.9.0 released ~Aug 10 (semantic search default,
  PR-from-issue read, duplicate detection tool; no endpoint/auth change).
- `com.slack/mcp`: bump `verifiedAt` for Slack Skills Plugin + Claude Code v2.1.231 OAuth fix.
- All OAuth-gated vendors: verify CIMD compliance (DCR deprecated July 28 spec).
- Python-SDK vendors: verify ≥v1.28.1 (CVE-2026-59950 WebSocket CSWSH).
- TypeScript-SDK vendors: verify ≥v1.26.0 or migrated to SDK v2 (CVE-2026-25536).
- SEP-2127 server card audit on all 19 servers (OVERDUE since Aug 14).

**Next curate run:** HubSpot MCP (`mcp.hubspot.com`) remains #1 priority. Endpoint GA April
13; OAuth 2.1 + PKCE only (no DCR). Note `no DCR` in `auth.notes`.

---

## 8. Watch Items & Forward Look

| Item | Status | Next check |
|---|---|---|
| Glama 75k+ milestone | **CROSSED Aug 21** (+1,085 in one day) | Monitor daily |
| AAIF Seoul blog recap | NOT PUBLISHED (Day 7) | Check daily; likely Aug 22–24 |
| PulseMCP step-jump | Pending (Day 11 of pause) | Check daily for restart signal |
| SEP-2127 PR merge | OPEN; follow-on meetings Aug 31 + Sep 7 | Re-check after Aug 31 |
| `subregistry-audit` (SEP-2127 + verifiedAt) | OVERDUE since Aug 14 | Invoke next session |
| GitHub MCP Server v1.9.0 `verifiedAt` | Pending | Include in next audit run |
| MCPCon Shanghai (Sept 6–7) | Session abstracts unavailable | Re-check late Aug |
| Agent Plugins 1.0 (VS Code + Copilot) | Monitoring | No catalog action needed |
| HubSpot curate (#1 priority) | Ready | Next `subregistry-curate` run |

---

## 9. No Landscape Changes Today

The ranking in `landscape.md` and the watch list are current as of the Aug 20 update.
No material field shifts detected on Aug 21 (no new enterprise entrants, major funding
rounds, or spec changes). `landscape.md` `Last updated` bumped to Aug 21 to reflect
this daily pass.

**Notable milestone:** Glama crosses **75,000 servers** for the first time on Aug 21, 2026
(~75,614). This is a +1,085 single-day batch pulse.

---

*Report produced by the MCP Sub-Registry autonomous research routine. All external claims
cited with source URLs. Today's date: 2026-08-21.*
