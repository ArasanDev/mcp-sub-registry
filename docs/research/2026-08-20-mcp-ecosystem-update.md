# MCP Ecosystem Update — 2026-08-20

**Produced by:** MCP Sub-Registry autonomous research routine
**Covers:** 2026-08-19 EOD → 2026-08-20
**Prior report:** [2026-08-19-mcp-ecosystem-update.md](./2026-08-19-mcp-ecosystem-update.md)

---

## 1. Headline Summary

- **Glama: ~74,529 (+756 vs. Aug 19 ~73,773).** Search-index page title confirms count;
  direct page fetch egress-blocked. The +756 jump continues the irregular batch-pulse pattern
  observed across the week (+148, +614, +683 on Aug 17–19). [[Glama]](https://glama.ai/mcp/servers)
- **PulseMCP: ~22,030–22,070 (flat, Day 10 of ingestion-rework pause).** Cached search-result
  titles span 22,030–22,070; no step-jump confirmed. Pause has now exceeded its stated
  "mid-August" deadline by ten full days. [[PulseMCP]](https://www.pulsemcp.com/servers)
- **MCPwned BH2026 slides: GitHub release confirmed live (91 files/3 assets); rendering still
  intermittent.** The onhexgroup release page returned errors on direct fetch again today —
  consistent with the intermittent GitHub rendering reported Aug 19. Per BH's standard
  policy, slides were formally posted to the BH website by 6 PM PT on each briefing day
  (Aug 5–6). BH archive is now fully indexed (Day 15 post-conference). **No cataloged server
  named in any public analysis of the MCPwned talk.** [[GitHub release]](https://github.com/onhexgroup/Conferences/releases/tag/bhusa2026)
  [[BH Briefings]](https://blackhat.com/us-26/briefings.html)
- **AAIF Seoul blog recap: STILL NOT PUBLISHED (Day 6 post-summit).** Six days after the
  Aug 13–14 MCP Dev Summit Seoul concluded, no AAIF blog post for the event appears in
  search results. Only external analyst coverage (Futurumgroup, TechTimes) has indexed.
  TechTimes coverage (Aug 19) focused on the co-located "AI Summit Seoul & Expo" general
  production-gap narrative, not an AAIF-authored recap. Monitoring continues.
  [[TechTimes]](https://www.techtimes.com/articles/324972/20260819/agentic-ais-production-gap-takes-center-stage-seouls-record-ai-summit.htm)
- **Security: Day 55 clean.** No new CVEs against any of the 19 cataloged servers. Adversa AI
  "Top MCP Security Resources — August 2026" roundup remains live and indexable but
  egress-blocked for direct fetch. [[Adversa AI Aug 2026]](https://adversa.ai/blog/top-mcp-security-resources-august-2026/)
- **SEP-2127 follow-on meetings: Aug 31 + Sep 7 upcoming.** WG term closed Aug 14;
  no new PR activity or spec merges found today. Server card audit pass remains the
  highest-priority next action. [[SEP-2127 PR]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)

---

## 2. Scale & Registry Landscape

| Registry | Count (Aug 20) | vs. Aug 19 | Note |
|---|---|---|---|
| Glama | ~74,529 | +756 | Search-index page title [[Glama]](https://glama.ai/mcp/servers) |
| PulseMCP | ~22,030–22,070 | flat (Day 10) | Ingestion rework pause; no step-jump [[PulseMCP]](https://www.pulsemcp.com/servers) |
| MCPToplist (cross-registry) | 100,958 | (Aug 10 snap; 10 days stale) | No new snapshot |
| Official MCP Registry | ~9,652 | — | v0.1 frozen; v1 in development |
| Smithery | ~7,300 | — | No August update; infra rebuild |
| Anthropic Connectors | 950+ | — | Per claude.com July 28 blog |
| Our catalog | 19 | — | All approved/public; all on Streamable HTTP |

**Glama weekly pattern (Aug 14–20):** flat (~72,328), +148, +614, +683, +756. The +756 is
the single largest daily jump this week. Batch-indexing pulses rather than organic linear
additions remain the dominant pattern post-spec-final.

**PulseMCP Day 10:** Pause now extends ten days past the stated "mid-August" end date.
No announcement of restart found. When the ingestion engine restarts, a multi-week submission
backlog is expected to produce a step-jump of 1,000–2,000+ entries. This remains the
single most anticipated near-term metric shift in the landscape.

**Cross-registry estimate (Aug 20):** ~74,529 (Glama) + ~22,070 (PulseMCP) + ~7,300 (Smithery)
+ ~9,652 (Official) ≈ **~115k+ raw entries** (heavy overlap). The MCPToplist cross-deduplicated
count of 100,958 (Aug 10) is the best available deduplication reference; likely ~102k–105k
deduplicated by now if the Aug 11+ Glama surge (+4,549 net Aug 11–20) is partially novel.

---

## 3. Security

### 3a. Day 55 clean window continues

No new CVEs published against any of the 19 cataloged remote HTTP servers. The Adversa AI
August 2026 security resources digest is live at
[[adversa.ai]](https://adversa.ai/blog/top-mcp-security-resources-august-2026/) and covers
critical vulnerabilities from the Black Hat / post-BH2026 period, but the page is
egress-blocked for direct fetch. Based on indexing, it covers:

- The MCPwned honeypot study (327 IPs, 155 MCP probes in 48h)
- Real-world MCP exploitation patterns documented at BH2026
- Adversa AI six-stage MCP kill chain HMM (documented Aug 15 report) and SPELLSMITH tool
  (already in §13 of CLAUDE.md)

No catalog action needed.

### 3b. MCPwned slides status (final update)

The Black Hat USA 2026 briefing "MCPwned: How Exposed AI Agents Became the Internet's New
Recon Toy" was presented Aug 5–6. Slides were formally published to the BH website by
6 PM PT on Aug 6. The GitHub release (`onhexgroup/Conferences/releases/tag/bhusa2026`) was
tagged Aug 7 and contains 91 files. The release page is returning intermittent rendering
errors (GitHub infrastructure issue, not content unavailability). All publicly accessible
analysis of the MCPwned talk to date confirms **no specific cataloged MCP vendor was named
as vulnerable in the honeypot study.** The study documented attacker reconnaissance against
exposed/unauthenticated MCP endpoints — a structural risk our auth-gated remote-HTTP
catalog does not share.

**Catalog action: none.** Closing this watch item; MCPwned slides are confirmed publicly
available and no catalog-impacting findings identified.

### 3c. Security posture summary

Active threats from CLAUDE.md §13 (all previously documented, no new developments Aug 20):
- Miasma/Hades wave: PyPI + Azure npm worm campaigns (remote-HTTP catalog immune)
- SANDWORM_MODE: npm worm targeting Claude Code / Cursor configs (remote-HTTP catalog immune)
- IronWorm: Rust/eBPF npm stealer (remote-HTTP catalog immune)
- MCPwnfluence CVE-2026-27825/27826: mcp-atlassian patched; our catalog uses official remote endpoint
- CVE-2026-59950: Python SDK WebSocket CSWSH (patched v1.28.1; verify mixed-transport vendors in audit)
- CVE-2026-50143: Apify actor path injection (patched v0.10.11; not in catalog)
- DeepJack: Cursor deeplink client-side attack (no catalog action)
- DuneSlide CVE-2026-50548/50549: Cursor IDE prompt injection (client-side; no catalog action)

---

## 4. Specification & Standards

### 4a. SEP-2127 (Server Cards / `/.well-known/mcp.json`)

WG term ended Aug 14. Follow-on meetings scheduled Aug 31 + Sep 7 to handle remaining
editorial items. No new PR merges or spec outputs found for Aug 20. The per-server card
path `/.well-known/mcp.json` is confirmed in the SEP-2127 draft. Claude Desktop and Cursor
already ship parsing support; no catalog schema change needed until at minimum the Aug 31
follow-on meeting.

**Action:** The SEP-2127 server card audit (GET `/.well-known/mcp.json` on all 19 cataloged
servers) remains OVERDUE and is the highest-priority next task for the `subregistry-audit`
skill. Use the validator at [[agent-ready.dev]](https://agent-ready.dev/mcp-card-validator).

### 4b. 2026-07-28 spec adoption

No new vendor compliance disclosures found today. Spec is final (shipped July 28).
SDK v2 stable (TypeScript July 28; Python July 27). DCR deprecated; CIMD is the
replacement for OAuth client registration. All cataloged vendors should be verified for
CIMD compliance in the next audit pass.

---

## 5. Catalog — No Action Required Today

All 19 cataloged servers remain approved/public. No new security disclosures, endpoint
changes, or ownership events detected for any catalog entry.

**Standing pending audit items (carry forward from CLAUDE.md §13):**
- `com.github/mcp`: bump `verifiedAt`; v1.9.0 released ~Aug 10 with semantic search
  default, PR-from-issue read, duplicate detection tool (no endpoint/auth change reported).
- `com.slack/mcp`: bump `verifiedAt` for Slack Skills Plugin + Claude Code v2.1.231
  OAuth fix.
- All OAuth-gated vendors: verify CIMD compliance (DCR deprecated July 28 spec).
- Python-SDK vendors: verify ≥v1.28.1 (CVE-2026-59950 WebSocket CSWSH).
- TypeScript-SDK vendors: verify ≥v1.26.0 or migrated to SDK v2 (CVE-2026-25536 data leak).

**Next curate run:** HubSpot MCP (`mcp.hubspot.com`) remains #1 priority. Endpoint GA April
13; OAuth 2.1 + PKCE only (no DCR). Leads record read, Conversations data, and other
capability expansions confirmed. Note `no DCR` in `auth.notes`.

---

## 6. Watch Items & Forward Look

| Item | Status | Next check |
|---|---|---|
| AAIF Seoul blog recap | NOT PUBLISHED (Day 6) | Check daily; likely Aug 21–22 |
| MCPwned slides | Confirmed live; no catalog impact | **CLOSED** — no further monitoring needed |
| PulseMCP step-jump | Pending (Day 10 of pause) | Check daily for restart signal |
| SEP-2127 follow-on meetings | Aug 31 + Sep 7 scheduled | Re-check after Aug 31 meeting |
| `subregistry-audit` (SEP-2127 + verifiedAt) | OVERDUE since Aug 14 | Invoke immediately next session |
| GitHub MCP Server v1.9.0 `verifiedAt` | Pending | Include in next audit run |
| MCPCon Shanghai (Sept 6–7) | Session abstracts expected soon | Re-check late Aug |
| Agent Plugins 1.0 (VS Code + Copilot, Aug 12) | Monitoring | No catalog action needed |

---

## 7. No Landscape Changes Today

The ranking in `landscape.md` and the watch list are current as of the Aug 19 update.
No material field shift detected on Aug 20 (no new enterprise entrants, no major funding
rounds, no spec changes). Landscape.md `Last updated` will be bumped to Aug 20 to reflect
this daily pass.

---

*Report produced by the MCP Sub-Registry autonomous research routine. All external claims
cited with source URLs. Today's date: 2026-08-20.*
