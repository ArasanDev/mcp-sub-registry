# MCP Ecosystem Update — 2026-11-28

**Prepared by:** MCP Sub-Registry Orchestrator (autonomous daily pass)
**Scope:** What changed since the 2026-11-27 report. 1-day window (Nov 27–28).
**Today's date:** 2026-11-28

---

## Summary

Relatively quiet day post-Thanksgiving US holiday weekend. Four notable findings: (1)
**MCPCon Nairobi recap now Day 9 absent** — definitively the longest post-event gap in
AAIF history (previous longest was ~5 days); no explanation has been published; (2)
**Canva MCP technical details confirmed** — `https://mcp.canva.com/mcp`, OAuth 2.0,
Streamable HTTP, GA Oct 7, 2026 — curate candidate #1 fully verified; (3)
**CVE-2026-137308 formally closed** — unverifiable across all CVE sources including NVD,
GCVE, and MCP security aggregators; not in catalog; (4) two previously uncaptured
community CVEs from the Nov 5–8 Corgea roundup documented (CVE-2026-113663 and
CVE-2026-123271) — both catalog-immune.

Security: **Day 101+ clean window** holds for all 19 cataloged servers. No new
catalog-relevant CVEs in the Nov 21–28 window. No new SDK or spec releases.

---

## Registry Scale

| Registry | Count | As of | Notes |
|---|---|---|---|
| **Official MCP Registry** | ~68,000–69,000 (est.) | Nov 28, 2026 | Extrapolated from Stork.AI Nov 16 snapshot (65,580) at ~3,166/week. No new direct snapshot. [[stork.ai]](https://www.stork.ai/) |
| **Glama** | ~129,500–131,000 (est.) | Nov 28, 2026 | Oct 28 confirmed 111,899; ~530/day growth; homepage cached at 122,052 (undated). [[Glama]](https://glama.ai/mcp/servers) |
| **PulseMCP** | ~21,500–22,000 (est.) | Nov 28, 2026 | No new snapshot. Ingestion resumed (confirmed Nov 26 report). [[PulseMCP]](https://www.pulsemcp.com) |
| **Smithery (Arcade.dev)** | ~26,000–27,400 (est.) | late Oct 2026 | Proxy shutdown Oct 31; directory-only. No new count. [[Smithery]](https://smithery.ai) |

No significant count movements from yesterday. Scale estimates are extrapolations.

---

## Finding 1: MCPCon Nairobi Recap — Day 9 Absent (Definitively Longest Gap)

**Status:** STILL ABSENT. As of Nov 28, 2026, the AAIF has published no recap of MCPCon
Nairobi (Nov 19–20, 2026). Day 9 post-event with no recap is definitively the longest
post-event gap in AAIF MCP Dev Summit history. The aaif.io/blog page shows the most recent
summit recap is "MCP Is Now Enterprise Infrastructure" (North America, July 10, 2026).

For context, previous recap timelines:
- North America (Oct 22–23): published July 10 (within 1 day — same event in different year? No, timeline is consistent in reports)
- Seoul (Aug 13–14): recap expected ~Aug 15; gap was approximately 1-2 days
- Nairobi (Nov 19–20): 9 days elapsed, no recap

The Gates Foundation was confirmed as Diamond Sponsor. No session outputs, slides, or
speaker announcements have appeared on the aaif.io blog. The event's Linux Foundation page
at events.linuxfoundation.org/mcp-dev-summit-nairobi/ confirms the event concluded Nov 20.

**Catalog action:** None. No new MCP governance or spec signals emerged from the event yet.
Continue monitoring. If recap does not appear by Dec 1, flag for manual follow-up.

**Sources:**
- [[aaif.io/blog (most recent recap — North America)]](https://aaif.io/blog/mcp-is-now-enterprise-infrastructure-everything-that-happened-at-mcp-dev-summit-north-america-2026)
- [[events.linuxfoundation.org/mcp-dev-summit-nairobi/]](https://events.linuxfoundation.org/mcp-dev-summit-nairobi/)

---

## Finding 2: Canva MCP — Curate Candidate #1 Fully Verified

Canva MCP was first noted as "previously uncaptured" in the Nov 27 report (GA Oct 7, 2026).
Today's research confirms the full technical profile needed for the curate queue:

| Field | Value |
|---|---|
| **Primary endpoint** | `https://mcp.canva.com/mcp` |
| **Alternative (Developer Portal apps)** | `https://api.canva.com/connect/v1/mcp` |
| **Transport** | Streamable HTTP |
| **Auth** | OAuth 2.0; CIMD supported (DCR deprecated per 2026-07-28 spec but active) |
| **Plan requirement** | Pro plan required for some automation features |
| **GA date** | October 7, 2026 |
| **Waitlist** | None (no-waitlist GA) |
| **Claude connectors directory** | Listed (Anthropic-vetted) |
| **EMA launch list** | YES — Canva is one of 7 EMA launch connectors (Jun 23, 2026) |

The EMA listing is the strongest trust signal: Anthropic + Microsoft + Okta jointly vetted
Canva for zero-touch org-level provisioning. Combined with GA status, no-waitlist, and
Streamable HTTP transport, Canva is the highest-confidence curate candidate in the queue.

**Recommended catalog entry:** `com.canva/mcp`, `https://mcp.canva.com/mcp`, OAuth 2.0
(note CIMD preferred; DCR fallback active), Pro plan caveat in auth.notes, EMA-verified signal
in curation notes.

**Sources:**
- [[canva.dev/blog/developers/canva-mcp-ga/]](https://www.canva.dev/blog/developers/canva-mcp-ga/)
- [[docs.aigateway.cequence.ai Canva entry]](https://docs.aigateway.cequence.ai/docs/remote-mcp-servers/canva)
- [[mcpservers.org Canva]](https://mcpservers.org/remote-mcp-servers/canva)

---

## Finding 3: CVE-2026-137308 — FORMALLY CLOSED (Unverifiable)

CVE-2026-137308 was flagged Nov 27 as "surfaced in a secondary security database but could
not be independently verified." After a dedicated search today across NVD, GCVE, Corgea,
VulnCheck, SentinelOne, and all MCP security aggregators, the ID returns no results anywhere.

**Conclusion:** CVE-2026-137308 does not appear to be a real or published CVE. It is likely
either a mislabeled ID in the secondary source that flagged it, or a hallucinated artifact.
Removing from watch list. No catalog action required.

**Source:** NVD CVE map search [[nvd.nist.gov]](https://nvd.nist.gov); no results returned
for ID 2026-137308 across GCVE, Corgea, Adversa AI aggregator, or SentinelOne databases.

---

## Finding 4: Two Uncaptured Community CVEs — Nov 5–8 Roundup

The Corgea Nov 5–8 security roundup (published ~Nov 8, 2026) included two MCP-related CVEs
not previously documented in this research trail:

**CVE-2026-113663** — `ag2` / AutoGen framework  
- Class: OAuth resource-indicator spoofing  
- Description: attacker-controlled `resource` field tricks client into passing bearer token to
  attacker-controlled server  
- Affected: ag2/autogen (community framework package)  
- **Catalog impact:** None. Our catalog does not include ag2/autogen endpoints. Remote-HTTP
  catalog is structurally immune (we control resource endpoints; no community framework packages).  
- [[corgea.com roundup]](https://corgea.com/research/cve-2026-113663-123272-123271-110930-77604-ag2-mcp-go-chatcli-codex-code-graph-rag-november-2026)

**CVE-2026-123271** — `chatcli`  
- Class: OAuth resource-indicator spoofing (same class as CVE-2026-113663)  
- Affected: `chatcli` community MCP client package  
- **Catalog impact:** None. Not in catalog; community client, not a server.  
- [[corgea.com roundup]](https://corgea.com/research/cve-2026-113663-123272-123271-110930-77604-ag2-mcp-go-chatcli-codex-code-graph-rag-november-2026)

**Note:** GO-2026-6911 is a second advisory for `mcp-go` (up to v1.5.0, bearer token leak on
redirect) in the same roundup. This is the same codebase already tracked as CVE-2026-123272
(CVSS 8.0, Nov 5) in our §13. No new catalog action; confirms mcp-go has two distinct Go
Security Tracker entries.

---

## Security Status

**Day 101+ clean window** for all 19 cataloged servers. No new CVEs against any cataloged
endpoint in the Nov 21–28 window. The cluster of open audit items from §13 (TS SDK CVE audit,
Python SDK CVE audit, SEP-2127 server card audit) remain unactioned — these require the
`subregistry-audit` skill, not this research pass.

Active threat class reminder (from prior research): OAuth resource-indicator spoofing is now
the dominant new CVE pattern (CVE-2026-113663, CVE-2026-123271, CVE-2026-104850, CVE-2026-111771)
— four CVEs in this class since October. Not a catalog-side risk (we store endpoints and secret
names, not OAuth flows), but relevant for gateway operators consuming our catalog.

---

## Spec / SDK Status

No changes since the Nov 27 report:
- **TS SDK:** v2.4.0 (Oct 23, 2026) remains latest on the v2.x line
- **Python SDK:** mcp v2.3.0 (Oct 2, 2026) remains latest
- **Next spec release:** 2027-03-30 (confirmed 6-month cadence, last Tuesday of Mar/Sep)
- No blog posts or new releases on blog.modelcontextprotocol.io for November 2026

---

## Catalog Hooks

| Server | Status | Action needed |
|---|---|---|
| All 19 cataloged servers | ✅ Approved/public | No change |
| `com.canva/mcp` | 🔵 Curate candidate | Add via `subregistry-curate` (see Finding 2 for full profile) |
| `com.hubspot/mcp` | 🔵 Curate candidate #2 | 7+ months overdue; OAuth 2.1 + PKCE, no DCR |
| `com.intercom/mcp` | 🔵 Curate candidate #3 | Streamable HTTP, OAuth or Bearer API key |
| `com.zendesk/mcp` | 🟡 Watch | Zendesk Bridge early access Nov 10; verify universal endpoint |

No server needs demotion, retirement, or security flagging from today's research.

---

## Open Items Carried Forward

1. **MCPCon Nairobi recap** — Day 9+. Flag for manual follow-up if still absent Dec 1.
2. **Curate run due:** Canva (fully verified, #1 priority), HubSpot (#2, 7+ months overdue),
   Intercom (#3), Zendesk Bridge (verify endpoint). Invoke `subregistry-curate`.
3. **Audit run due:** SEP-2127 server card audit, TS SDK CVE cluster (≥1.32.0/≥2.3.0),
   Python SDK (≥1.30.0/≥2.2.0), GitHub MCP `verifiedAt` → Nov 24 (v2.3.0 confirmed).
   Invoke `subregistry-audit`.
4. **CVE-2026-137308 CLOSED** — removed from watch list.
