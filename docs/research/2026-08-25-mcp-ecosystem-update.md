# MCP Ecosystem Update — 2026-08-25

**Prepared by:** MCP Sub-Registry Orchestrator (autonomous daily pass)
**Scope:** What changed in the MCP ecosystem since the Aug 24 report.
**Today's date:** 2026-08-25

---

## Registry Scale

| Registry | Count | Change vs yesterday | Notes |
|---|---|---|---|
| **Glama** | **77,381** | **+549 (CROSSES 77k MILESTONE)** | Live page title confirms count [[Glama]](https://glama.ai/mcp/servers) |
| **MCPToplist** | 108,245 | n/c (Aug 23 snap, 2 days stale) | Cross-registry deduped; no new snapshot [[MCPToplist]](https://mcptoplist.com/) |
| **PulseMCP** | ~22,020–22,050 | Flat (Day 15) | Ingestion-rework pause now 15 days past mid-August stated end date; still no step-jump [[PulseMCP]](https://www.pulsemcp.com/servers) |
| **Our catalog** | 19 approved/public | — | All remote-HTTP, all approved/public |

**Trust gap:** ~109k+ cross-registry indexed vs. 19 curated/approved in our catalog. The gap persists; approval workflow discipline is the product.

### Glama 77k milestone detail
Glama's live server listing now reads "77,381 Open-Source MCP Servers" in the page title. At the current growth pace (~400–600/day net), Glama is on track to cross 78k within ~2–3 days. This marks another milestone in the post-spec-final surge that has added ~15k servers since the 2026-07-28 release.

---

## Security — Day 60 Clean for Cataloged Servers

No new CVEs or incidents affecting any of the 19 cataloged remote-HTTP servers were found today. The 60-day clean window continues.

### New research: Morphisec "drp-compliance-sdk" MCP supply chain attack

Morphisec published analysis of a malicious npm package (`drp-compliance-sdk`) designed to compromise MCP server environments through a 5-stage kill chain. Key details:

- **Attack vector:** Attacker publishes a convincingly packaged npm module with a polished README, plausible compliance terminology (SOX, DRP-2026), and a tagged release — no binary payload in source.
- **Obfuscation:** Malicious URL base64-encoded; process spawn obfuscated via character-code arrays — passes standard SAST and human code review.
- **Trigger:** Fires automatically on the initial MCP protocol handshake (`tools/list` call) — **before the user invokes any tool or types any prompt**. This is a significant escalation from post-invocation attacks.
- **LOTL chain:** `node.exe → wscript.exe → curl.exe` — uses only signed Microsoft binaries (living-off-the-land).
- **No CVE assigned** yet as of today's research.
- [[Morphisec analysis]](https://morphisec.com/mcp-attack-chain/)

**Catalog impact:** Our remote-HTTP-only catalog is structurally immune. The `drp-compliance-sdk` attack requires the victim to install and configure the malicious npm package as a local/STDIO MCP server. No remote-HTTP endpoint in our catalog is exposed to this vector. However, this attack class reinforces why the `discovered != approved != enabled` boundary is critical — unapproved servers reaching an MCP host can fire malicious payloads before any user interaction.

**Related context:** Morphisec also demonstrated AI Usage Control at Black Hat USA 2026 (Aug 1–6) — endpoint governance for MCP connectors (discovers shadow AI, MCP connectors, enforces policy). Not a catalogable server; signals enterprise endpoint security vendors maturing MCP awareness. [[Morphisec launch]](https://www.einpresswire.com/article/928840804/morphisec-launches-ai-usage-control-governing-shadow-and-sanctioned-ai-on-the-endpoint)

---

## AAIF Seoul Blog Recap — Still Not Published (Day 11)

The AAIF blog recap for the MCP Dev Summit Seoul (Aug 13–14) has **not been published** as of today (Day 11 post-summit). For comparison, the North America summit recap was published within ~48h. The extended delay (now 11 days) is anomalous.

What is available:
- **Futurumgroup** coverage confirmed the summit focused heavily on security ("high-stakes confrontation") with 92% of production MCP servers lacking OAuth, 21,000+ internet-exposed. [[Futurumgroup]](https://futurumgroup.com/insights/mcp-dev-summit-2026-aaif-sets-a-clear-direction-with-disciplined-guardrails/)
- **Forkast** framed it as "security inflection point." [[Forkast]](https://forkast.news/the-model-context-protocol-reaches-a-security-inflection-point/)
- **TechTimes** (Aug 19): "Agentic AI's Production Gap Takes Center Stage at Seoul's Record AI Summit" — 81 speakers, 307 booths, 25,000+ attendees, focused on why enterprise AI agents fail before production. [[TechTimes]](https://www.techtimes.com/articles/324972/20260819/agentic-ais-production-gap-takes-center-stage-seouls-record-ai-summit.htm)

Monitoring continues. Next expected visibility window: MCPCon Shanghai (12 days).

---

## MCPCon Shanghai — 12 Days Away

**AGNTCon + MCPCon China** remains confirmed for **September 6–7, 2026** at the Shanghai International Convention Center, co-located with KubeCon + CloudNativeCon China + OpenInfra Summit + PyTorch Conference China 2026.

- Linux Foundation tweeted the full agenda is now published at [[lfopensource.cn schedule]](https://www.lfopensource.cn/mcp-dev-summit-shanghai/program/schedule/)
- 40+ sessions covering MCP & agent protocols, infrastructure, orchestration, evaluation, and production systems.
- Sessions to be recorded, available on AAIF YouTube channel within 2 weeks of the event.
- [[AAIF event page]](https://aaif.io/press/agentic-ai-foundation-announces-global-2026-events-program-anchored-by-agntcon-mcpcon-north-america-and-europe/)

**Catalog relevance:** Monitor Shanghai session abstracts for new MCP server announcements (especially enterprise vendors debuting hosted endpoints), governance standards updates, and any security disclosures targeting cataloged servers.

---

## SEP-2127 Server Cards — WG Follow-On Meeting in 6 Days

The SEP-2127 Working Group closed on Aug 14. Follow-on meetings:
- **Aug 31** (6 days) — next scheduled WG session
- **Sep 7** — second follow-on session

The PR (#2127) remains open. Path confirmed: `/.well-known/mcp.json`. An alternative per-server endpoint of `/.well-known/mcp/server-card.json` is also being discussed as a belt-and-braces companion. Validator live at [agent-ready.dev](https://agent-ready.dev/mcp-card-validator).

**Catalog action:** `subregistry-audit` SEP-2127 pass remains highest-priority unblocked work. Triggering after the Aug 31 WG meeting gives maximum spec stability before auditing.

---

## MCP Roadmap — Active Working Groups

The Aug 22 roadmap blog detailed 5 priority areas for the next spec cycle (already captured Aug 22–23 reports). No new roadmap posts today. [[MCP Roadmap]](https://blog.modelcontextprotocol.io/posts/mcp-roadmap/)

Key active work items from the roadmap of note:
- **Tasks extension (SEP-2663):** Moving toward inclusion in next spec version; enables long-running async work with retry/expiry.
- **Agentic messaging:** Webhooks + channels for server-initiated events (eliminating polling).
- **Agent identity (PoP/WIF/token-exchange):** Enterprise SSO tightening; CIMD replacing DCR.

No catalog schema change needed. Tracking for future `gateway_compatibility` field implications.

---

## GitHub MCP Server — v1.10.1 Still Latest

No new GitHub MCP Server release today. v1.10.1 (Aug 20) remains current — fixed `add_issue_comment` schema compatibility regression from v1.10.0. [[Releases]](https://github.com/github/github-mcp-server/releases)

Update `verifiedAt` for `com.github/mcp` in next `subregistry-audit` pass.

---

## Catalog Status — All 19 Servers Approved/Public

No catalog demotions or actions warranted from today's research. All 19 servers remain:
- `approved` + `public`
- Remote-HTTP endpoints (structurally immune to STDIO/npm worm vectors including Morphisec `drp-compliance-sdk`)
- Day 60 clean security window continues

**Pending catalog work (unchanged, priority order):**
1. **`subregistry-audit`** — SEP-2127 server card GET for all 19; update `verifiedAt` for `com.github/mcp` (v1.10.1) and `com.slack/mcp`; TS SDK CVE-2026-25536 vendor check (≥v1.26.0 or SDK v2). Trigger after Aug 31 SEP-2127 WG meeting for max stability.
2. **`subregistry-curate`** — HubSpot MCP (`mcp.hubspot.com`; GA April 13; OAuth 2.1+PKCE only; no DCR; August 2026 capability expansion confirmed).

---

## Sources

- [Glama MCP Registry](https://glama.ai/mcp/servers) — 77,381 servers (live, Aug 25)
- [PulseMCP Directory](https://www.pulsemcp.com/servers) — ~22,020–22,050 (ingestion pause Day 15)
- [MCPToplist](https://mcptoplist.com/) — 108,245 (Aug 23 snap)
- [Morphisec — MCP Supply Chain Attack via Malicious Compliance SDK](https://morphisec.com/mcp-attack-chain/)
- [Morphisec AI Usage Control launch](https://www.einpresswire.com/article/928840804/morphisec-launches-ai-usage-control-governing-shadow-and-sanctioned-ai-on-the-endpoint)
- [Futurumgroup — MCP Dev Summit 2026: AAIF Sets A Clear Direction](https://futurumgroup.com/insights/mcp-dev-summit-2026-aaif-sets-a-clear-direction-with-disciplined-guardrails/)
- [Forkast — MCP Security Inflection Point](https://forkast.news/the-model-context-protocol-reaches-a-security-inflection-point/)
- [TechTimes — Agentic AI's Production Gap (Seoul summit)](https://www.techtimes.com/articles/324972/20260819/agentic-ais-production-gap-takes-center-stage-seouls-record-ai-summit.htm)
- [AAIF — MCPCon China Sept 6–7](https://aaif.io/press/agentic-ai-foundation-announces-global-2026-events-program-anchored-by-agntcon-mcpcon-north-america-and-europe/)
- [LF Open Source — MCPCon Shanghai Schedule](https://www.lfopensource.cn/mcp-dev-summit-shanghai/program/schedule/)
- [SEP-2127 PR #2127](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)
- [Agent Ready — SEP-2127 Validator](https://agent-ready.dev/mcp-card-validator)
- [MCP Roadmap Blog](https://blog.modelcontextprotocol.io/posts/mcp-roadmap/)
- [GitHub MCP Server Releases](https://github.com/github/github-mcp-server/releases)
- [The New Stack — MCP Roadmap 2026](https://thenewstack.io/model-context-protocol-roadmap-2026/)
