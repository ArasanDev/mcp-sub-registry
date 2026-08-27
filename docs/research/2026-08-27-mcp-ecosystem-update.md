# MCP Ecosystem Update — 2026-08-27

**Prepared by:** MCP Sub-Registry Orchestrator (autonomous daily pass)
**Scope:** What changed in the MCP ecosystem since the Aug 26 report.
**Today's date:** 2026-08-27

---

## Registry Scale

| Registry | Count | Change vs yesterday | Notes |
|---|---|---|---|
| **Glama** | **~78,248** (cached) | Unconfirmed for today | Search index still returning Aug 26 cached count; direct access blocked by egress proxy. At post-spec pace (+500–900/day), likely 78,700–79,100 today — unconfirmed. [[Glama]](https://glama.ai/mcp/servers) |
| **MCPToplist** | 108,245 | n/c (Aug 23 snap, **4 days stale**) | No new cross-registry snapshot indexed today. [[MCPToplist]](https://mcptoplist.com/) |
| **PulseMCP** | ~22,000–22,070 | Flat (Day 17) | Ingestion-rework pause continues; "until mid-August" deadline is now 13 days past stated end; search results show cached pages ranging 22,000–22,070; no step-jump confirmed. [[PulseMCP]](https://www.pulsemcp.com/servers) |
| **Our catalog** | 19 approved/public | — | All remote-HTTP; all approved/public |

**Trust gap:** ~109k+ cross-registry indexed vs. 19 curated/approved. Discipline holds.

**Glama trajectory note:** At the post-spec pace of +500–900 servers/day net, Glama will cross 79k within 1–2 days (Aug 27–28). The 79k crossing will mark approximately 17,600 servers added in the 30 days since the 2026-07-28 spec final release.

---

## Security — Day 62 Clean for Cataloged Servers

No new CVEs or incidents affecting any of the 19 cataloged remote-HTTP servers found today. The clean window now stands at 62 days.

No Aug 27-specific security advisories from The Hacker News, SecurityWeek, VulnCheck, or SentinelOne targeting cataloged vendors were found in today's pass. Background summary of active threat landscape (all previously documented): Marimo CVE-2026-75149 (local, catalog immune), Morphisec LOTL chain (catalog immune), CVE-2026-59950 Python SDK (catalog immune — remote-HTTP model), CVE-2026-25536 TS SDK data leak (vendor ≥v1.26.0 audit pending).

---

## MCP Roadmap Published Aug 22 — Not Previously Documented

**NEW FINDING for our research trail.** On August 22, 2026, core MCP maintainers David Soria Parra and Den Delimarsky published "The New MCP Roadmap" at [[blog.modelcontextprotocol.io]](https://blog.modelcontextprotocol.io/posts/mcp-roadmap/). This was published 5 days before our last report (Aug 26) and was not captured in that pass. It is the first official roadmap since the spec went final July 28.

### Five Priority Areas

| Priority | Description | Key SEPs |
|---|---|---|
| **1. Agentic Messaging Primitives** | Server-initiated events (webhooks + channels); mature the Tasks extension into the spec itself | SEP-2567, SEP-2663 |
| **2. HTTP-Native Transport Unification** | Extend stateless HTTP to cover local/stdio deployment modes ("local servers speaking Streamable HTTP over stdio") | SEP-2549 |
| **3. Agent Identity & Enterprise Security** | Standardize agent identity using DPoP (Demonstrating Proof of Possession), Workload Identity Federation, and token exchange protocols | SEP-2322 |
| **4. Improved Primitives** | Standardize tool call result contracts; implement **progressive discovery** (servers reveal tool catalog gradually vs. all-at-once) | SEP-2575 |
| **5. Improved SDK Developer Experience** | SDK ergonomics, spec conformance testing, documentation quality across all platforms | Various |

**No concrete release dates given.** The post frames the roadmap as covering "the next specification release and beyond" and notes that SEPs aligned with these priorities receive expedited review. The SEP-2133 extensions framework (reverse-DNS IDs, delegated maintainers, independent versioning) is noted as infrastructure supporting this multi-stream approach.

**Registry relevance:**
- **Priority 4 (progressive discovery)** directly affects catalog metadata: if servers expose tool catalogs in batches, our `tool_count` field and gateway projection may need to reflect "minimum available" vs. "full catalog" tool counts. Track SEP-2575.
- **Priority 3 (agent identity)** expands the `required_secrets` surface — a DPoP-gated server needs different credential documentation than an OAuth bearer token server. Track SEP-2322 for schema implications.
- **Priority 1 (Tasks maturation)** moves Tasks from extension to spec core — our `gateway_compatibility` field's readiness flags may need to reflect Tasks support once it stabilizes.
- The **progressive disclosure WG** (meeting Aug 31, below) is the governance body for Priority 4.

---

## MCP Governance — Aug 27 (FSIG Meeting Today)

### FSIG Biweekly (Aug 27, 4pm London) — In Progress
The Financial Services Interest Group meeting runs today at 16:00–17:00 BST/GMT. No outputs yet (meeting is live as of this writing). Agenda shared in `#financial-services-ig` ahead of call; notes published after. [[FSIG Charter]](https://github.com/modelcontextprotocol/financial-services-interest-group/blob/main/CHARTER.md)

### Aug 26 WG Sessions — No Public Notes Yet
The three Aug 26 sessions (Inspector V2 WG 8am, Fine-Grained Auth WG 12pm, Gateways IG 2pm) have not published notes to any public-facing resource indexed by today's search pass. Typical lag is 1–3 days; check meet.modelcontextprotocol.io and the modelcontextprotocol GitHub org for any published outputs.

### Aug 31 — Expanded WG Calendar (Newly Confirmed)
The Aug 26 report listed only the SEP-2127 Server Card WG for Aug 31. The full August 31 calendar from [[meet.modelcontextprotocol.io]](https://meet.modelcontextprotocol.io/) now shows **four sessions**, two of which are newly surfaced in our research trail:

| Time | Session | Channel | Status in our trail |
|---|---|---|---|
| **8:00am** | **Progressive Disclosure WG** | — | **NEW — not previously tracked** |
| **10:00am** | **MCP Security Interest Group biweekly** | `#security-ig` | **NEW — not previously tracked** |
| **6:00pm** | **MCP Auth Interest Group** | `#auth-ig` | Known (auth governance) |
| **8:00pm** | **MCP Server Card WG** (SEP-2127 follow-on) | `#server-card-wg` | Known |

**Two new governance bodies surfaced today:**

1. **Progressive Disclosure WG** — directly tied to SEP-2575 (Priority 4 of Aug 22 roadmap). Governs the mechanism by which large MCP servers gradually expose their tool catalog to clients. If standardized, affects our `tool_count` catalog field and the gateway projection's representation of available tools.

2. **MCP Security Interest Group (FSIG biweekly)** — distinct from the FSIG (financial services) — this `#security-ig` group is a general MCP security IG meeting biweekly. This is a meaningful governance milestone: the security community now has a formal standing IG within the MCP governance structure. Likely outputs include security guidance complementary to OWASP MCP Top 10, NSA guidance, and the adversarial frameworks documented in our trail (Adversa AI, AARM, etc.). Monitor for any outputs that expand on the `required_secrets` / `gateway_compatibility` metadata contract.

---

## AAIF Seoul Blog Recap — Day 13 (Still Not Published)

No AAIF Seoul blog recap found today. Day 13 post-summit (summit: Aug 13–14, 2026). This remains the longest gap between an AAIF MCP Dev Summit and its official recap. Third-party coverage (Futurumgroup, InfoQ, TechTimes) continues to be the only available source for session content.

Available third-party data points (previously documented, no new additions today):
- 92% of audited production MCP servers lack OAuth (Futurumgroup sourced from summit)
- 21,000+ internet-facing MCP instances (summit statistic)
- 247 AAIF member orgs post-Seoul; Den Delimarsky keynote: "Two Years of MCP: State of The Ecosystem"

**Next visibility window:** MCPCon Shanghai (Sept 6–7, 10 days), where sessions will be recorded and posted to AAIF YouTube within 2 weeks. If the Seoul recap is not published before Shanghai, it may be rolled into the Shanghai coverage.

---

## MCPCon Shanghai — 10 Days

**AGNTCon + MCPCon China**, September 6–7, 2026, Shanghai International Convention Center. 40+ sessions, 1,500+ attendees. Co-located with KubeCon + CloudNativeCon China + OpenInfra Summit + PyTorch Conference China 2026. Full Linux Foundation schedule at [[lfopensource.cn]](https://www.lfopensource.cn/mcp-dev-summit-shanghai/program/schedule/). Sessions recorded and posted to AAIF YouTube within 2 weeks.

No new speaker announcements or session details surfaced today beyond what was documented Aug 26.

---

## SEP-2127 Server Cards — 4 Days to WG Follow-On

Aug 31 WG meeting confirmed (see governance section above). No new SEP-2127 outputs today. The server card audit pass (GET `/.well-known/mcp.json` on all 19 cataloged servers) remains the highest-priority unblocked `subregistry-audit` work; holding until after the Aug 31 WG meeting for spec stability.

The related **Progressive Disclosure WG** also meets Aug 31 at 8am — before the Server Card WG at 8pm. This means Aug 31 is the most consequential governance day since the Aug 14 WG term close: four sessions covering two newly-surfaced WGs (Progressive Disclosure + Security IG) plus Auth IG and Server Card WG.

---

## New MCP Servers / Enterprise Announcements

No major new MCP server launches or enterprise registry announcements for Aug 27 found in today's pass. The search returned nothing dated today that wasn't already documented.

**Catalog queue unchanged:**
- #1: HubSpot (`mcp.hubspot.com`) — GA, OAuth 2.1 + PKCE only, no DCR confirmed
- Intercom, Zapier — evaluate in same comms persona curate run
- X (Twitter) (`api.x.com/mcp`) — auth complexity confirmed; verify gateway-compatible path before proceeding

---

## Catalog — No Action Required

All 19 cataloged servers remain approved/public. No endpoint changes, ownership changes, or security concerns identified today.

---

## Pending Actions (updated priority)

1. **`subregistry-curate`** — HubSpot (and consider Intercom, Zapier)
2. **`subregistry-audit` — SEP-2127 server card pass** on all 19 servers — hold until AFTER Aug 31 WG meeting (4 days)
3. **Track Aug 31 WG outputs** — Progressive Disclosure WG (SEP-2575 implications for `tool_count` field) + Security IG (may affect `required_secrets` / `gateway_compatibility` metadata contract) + Server Card WG (SEP-2127 path confirmation)
4. **Track MCP Roadmap SEPs** — SEP-2575 (progressive discovery / Priority 4), SEP-2322 (agent identity / Priority 3), SEP-2567/2663 (Tasks / Priority 1): each could trigger catalog schema iterations when stable
5. **`subregistry-audit`** — Update `verifiedAt` for `com.github/mcp` (v1.10.1) and `com.slack/mcp`
6. **`subregistry-audit`** — Verify TS SDK vendors ≥v1.26.0 (CVE-2026-25536) and Python SDK vendors ≥v1.28.1 (CVE-2026-59950)
7. **`subregistry-deploy`** — Seed 8 servers added since last VPS deploy
8. **Monitor:** MCPCon Shanghai (Sept 6–7); AAIF Seoul blog recap; SEP-2127 + Progressive Disclosure + Security IG WG outputs post-Aug 31; FSIG Aug 27 meeting notes (publish lag 1–2 days); Glama 79k crossing
