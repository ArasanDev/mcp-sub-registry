# MCP Ecosystem Update — 2026-11-25

**Prepared by:** MCP Sub-Registry Orchestrator (autonomous daily pass)
**Scope:** What changed since the 2026-11-24 report. 1-day window (Nov 25).
**Today's date:** 2026-11-25

---

## Summary

Narrow 1-day pass. The 2026-11-24 report covered: Microsoft Ignite 2026 MCP wave
(MCP Firewall preview, Entra Agent Identity preview, Microsoft Enterprise MCP Server GA),
Official Registry ~64,935 (Nov 15), Zendesk Bridge added to curate queue, 4 new community
CVEs (unconfirmed on NVD), MCPCon Nairobi recap pending (Day 4+). Today's additions:

1. **Day 98+ clean window** — no new CVEs affecting the 19 remote-HTTP catalog servers.
2. **CVE-2026-123272 (mcp-go, CVSS 8.0 High, Nov 5)** — newly surfaced OAuth resource
   confusion bug in the Go SDK client library; fixed in mcp-go v1.2.1. Client library CVE,
   not a catalog server issue. Flags the Go SDK library as a risk surface for gateway
   operators using mcp-go in clients.
3. **Python SDK CVE-2026-59951 / CVE-2026-109527** — appear in Debian security tracker
   against the Python SDK; exact fixed version and CVSS not confirmed from public sources.
   Flagged for the next `subregistry-audit` pass to verify catalog Python-SDK vendors.
4. **Official MCP Registry ~65,580 (Stork.AI Nov 16)** — more precise than the Nov 15
   ~64,935 estimate; growth trajectory confirmed.
5. **MCPCon Nairobi recap still pending (Day 5+)** — event concluded Nov 19–20; no AAIF
   blog post as of Nov 25. First recap gap to exceed 5 days at any AAIF event.
6. **Glama estimate ~127,000–128,000** (extrapolated; homepage cache still 122,052 undated).
7. **GitHub MCP v2.0.3 still unconfirmed** — winget listing remains the only source;
   v2.0.2 (Oct 8) is last confirmed release.

---

## Registry Scale

| Registry | Count | As of | Notes |
|---|---|---|---|
| **Official MCP Registry** | ~65,580 | Nov 16, 2026 | Stork.AI snapshot — most precise recent figure. [[stork.ai]](https://www.stork.ai/blog/mcp-registry-endpoints-checked-november-2026.md) |
| **Official MCP Registry (est.)** | ~65,500–67,000 (est.) | Nov 25, 2026 | Extrapolated at ~3,166/week from Nov 15 figure. |
| **Glama** | ~127,000–128,000 (est.) | Nov 25, 2026 | Homepage cache 122,052 (undated); Oct 28 confirmed 111,899 → ~530/day. [[Glama]](https://glama.ai/mcp/servers) |
| **PulseMCP** | ~21,614–21,710 | late Oct 2026 | Flat; ingestion paused; no fresh count. [[PulseMCP]](https://www.pulsemcp.com/servers) |
| **Smithery (Arcade.dev)** | Directory-only | Nov 2026 | Proxy shutdown Oct 31; smithery.ai directory stays live. [[Smithery]](https://smithery.ai/) |
| **Our catalog** | 19 approved/public | — | All remote-HTTP; HubSpot + Intercom + Zendesk Bridge overdue for curate evaluation. |

Digital Applied Nov 5 snapshot: 57,041 total (38,270 with remote endpoint declared).
[[digitalapplied.com]](https://www.digitalapplied.com/blog/mcp-remote-server-health-census-november-2026)
APITracker Nov 1: ~53,075 registry records.
[[apitracker.io]](https://apitracker.io/mcp-statistics/2026-11-01)

---

## Security

### CVE-2026-123272 — mcp-go OAuth Resource Confusion (CVSS 8.0 High, Nov 5, 2026)

A malicious MCP server can declare arbitrary protected resources via `OAuthHandler.fetchServerMetadata`,
causing the mcp-go client to obtain OAuth tokens intended for other resource servers (RFC 9728
resource-binding confusion attack). Fixed in **mcp-go v1.2.1**.

**Catalog impact:** None — this is a client/library CVE affecting Go applications that embed
the mcp-go client library. Our 19 catalog entries are remote-HTTP *servers*, not Go clients.
However, **gateway operators** using mcp-go in their client-side connection logic should update
to v1.2.1 immediately to prevent token misdirection.
[[Red Hat]](https://access.redhat.com/security/cve/CVE-2026-123272)
[[Corgea roundup]](https://corgea.com/research/cve-2026-123272-113663-123783-73098-123561-mcp-go-ag2-skyvern-juneau-devalue-undici-november-2026)

**Related:** CVE-2026-123271 (chatcli, same RFC 9728 resource-binding flaw, also Nov 5) —
client tool, not in catalog.

### Python SDK — CVE-2026-59951 and CVE-2026-109527 (Details Incomplete)

Both appear in the Debian security tracker against the Python `mcp` package. CVSS scores and
exact fixed versions are not publicly confirmed from NVD as of Nov 25. These are **flagged but
unverified** pending NVD publication.

**Action:** Next `subregistry-audit` pass should verify that any Python-SDK-based catalog
vendors have updated to `mcp>=2.3.0` (latest confirmed) or `>=1.30.0` (1.x line) and
confirm whether these CVEs apply to any remote-HTTP server entry.

### CVE-2026-125271 / CVE-2026-134817 (Still Unconfirmed)

Both CVEs mentioned in the Nov 24 report (mcp-server-kubernetes, AWS API MCP Server policy
bypass) remain **unconfirmed on NVD**. No CVSS scores available. Source was a third-party
enterprise blog; direct NVD verification did not return hits. Status: flagged but unverified.

### Clean Window: Day 98+

No new CVEs or incidents affecting the 19 remote-HTTP catalog servers on Nov 23–25.
Remote-HTTP + auth-gated model continues to be structurally immune to all STDIO/npm-based
worm vectors (Miasma, IronWorm, Shai-Hulud campaign variants, @ifasn/ms-doc-mcp).

---

## MCPCon Nairobi — Recap Pending (Day 5+)

Event concluded Nov 19–20, 2026 in Nairobi. AAIF has not published a recap blog post
as of Nov 25. This is the longest post-event recap gap at any AAIF MCP Dev Summit.
Gates Foundation served as Diamond Sponsor (confirmed from pre-event announcement).
[[AAIF events]](https://aaif.io/events)

Expect recap to either arrive this week or be folded into end-of-year AAIF communications.

---

## SDK & Spec Status

### TypeScript SDK
- **Latest: v2.4.0** (released Oct 23, 2026). No new November release.
- v1.32.x patch line active for security backports.
- Implements both 2025-11-25 and 2026-07-28 spec revisions. `attach` feature experimental.
[[ts.sdk.modelcontextprotocol.io/v2/]](https://ts.sdk.modelcontextprotocol.io/v2/)

### Python SDK
- **Latest stable: v2.3.0** (released Oct 2, 2026). No new November release.
- v1.30.0 is the minimum 1.x gate for CVE-2026-116686 (SSRF/$ref external resolution, Oct 27).
- CVE-2026-59951 and CVE-2026-109527 in Debian tracker — details pending NVD publication.

### MCP Specification
- **Current final: 2026-07-28**. No changes.
- **Next release: March 30, 2027** (confirmed by SEP-3398, accepted Oct 14, 2026).
[[modelcontextprotocol.io/seps/3398-release-cycle-updates]](https://modelcontextprotocol.io/seps/3398-release-cycle-updates)
- Active SEPs: SEP-2575 (progressive discovery/`server/discover`), SEP-2663 (Tasks),
  SEP-2106 (JSON Schema loosening), SEP-2322 (agent identity/DPoP/WIF).

---

## GitHub MCP Server

**Latest confirmed: v2.0.2** (Oct 8, 2026). v2.0.3 appeared in a winget listing but is
**unconfirmed** — no release notes or GitHub release page entry found. The `verifiedAt`
for `com.github/mcp` should not be bumped until v2.0.3 is confirmed at
[github.com/github/github-mcp-server/releases](https://github.com/github/github-mcp-server/releases).

---

## Catalog Status

All 19 approved/public servers remain active. No endpoints identified as dead or compromised
in this pass.

**Outstanding curate queue (priority order):**
1. HubSpot (`mcp.hubspot.com`) — GA since April 2026, OAuth 2.1+PKCE, 7+ months overdue
2. Intercom (`mcp.intercom.com/mcp`) — Streamable HTTP, OAuth or Bearer API key, confirmed active
3. Zendesk Bridge — early access only, no universal public endpoint confirmed as of Nov 25;
   **hold until GA with stable hosted URL**

**Outstanding audit items (from §13 Next actions #3):**
- Verify all TS SDK catalog vendors on `@modelcontextprotocol/server >=2.3.0` or v1 `>=1.32.0`
  (CVE cluster: 2026-25536, 2026-0621, 2026-104850, 2026-111771, 2026-111768)
- Verify Python SDK vendors on `mcp>=2.3.0` or `>=1.30.0`
- Confirm CVE-2026-59951 / CVE-2026-109527 Python SDK scope and add to audit gate if confirmed
- Verify `com.github/mcp` release (v2.0.3 unconfirmed — wait for confirmation before bumping verifiedAt)

---

## Sources (this report)

1. Stork.AI Nov 16 snapshot — [[stork.ai]](https://www.stork.ai/blog/mcp-registry-endpoints-checked-november-2026.md)
2. CVE-2026-123272 mcp-go — [[Red Hat CVE]](https://access.redhat.com/security/cve/CVE-2026-123272), [[Corgea roundup]](https://corgea.com/research/cve-2026-123272-113663-123783-73098-123561-mcp-go-ag2-skyvern-juneau-devalue-undici-november-2026)
3. Digital Applied census — [[digitalapplied.com]](https://www.digitalapplied.com/blog/mcp-remote-server-health-census-november-2026)
4. APITracker statistics — [[apitracker.io]](https://apitracker.io/mcp-statistics/2026-11-01)
5. SEP-3398 (Release Cycle) — [[modelcontextprotocol.io]](https://modelcontextprotocol.io/seps/3398-release-cycle-updates)
6. AAIF events — [[aaif.io/events]](https://aaif.io/events)
7. TS SDK v2 docs — [[ts.sdk.modelcontextprotocol.io]](https://ts.sdk.modelcontextprotocol.io/v2/)
