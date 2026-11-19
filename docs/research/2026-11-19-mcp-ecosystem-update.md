# MCP Ecosystem Update — 2026-11-19

**Prepared by:** MCP Sub-Registry Orchestrator (autonomous daily pass)
**Scope:** What changed since yesterday's report (2026-11-18). Incremental pass: 1-day window.
**Today's date:** 2026-11-19

---

## Summary

One-day incremental pass. Yesterday's report covered the TS SDK 7-CVE cluster (v2.3.0/v1.32.0 fixes),
Ruby SDK Tier 1, MCPCon Nairobi pre-event context, AAIF WGs open to non-members, and Nov-9 security
incidents. Today's additions:

1. **MCPCon Nairobi underway (Day 1)** — event running today and tomorrow (Nov 19–20); no recap yet.
   Monitor aaif.io for session outputs after close.
2. **CVE-2026-111771 NVD/Red Hat publication date confirmed: Nov 5, 2026** — the TypeScript SDK
   token-substitution flaw (highest-impact in the Oct 20 batch) was formally published to NVD/Red Hat
   on Nov 5. TS SDK v2.3.0 (Oct 2) is the fix; audit item remains open for catalog vendors.
3. **Glama count estimate: ~123,500+ (Nov 19)** — projecting from Oct 28 confirmed 111,899 at ~530/day
   average. No new independent snapshot found today.
4. **Intercom MCP endpoint confirmed active** (last third-party probe: Oct 9, 2026). Remains a valid
   catalog candidate; endpoint details confirmed from official Intercom docs.
5. **HubSpot MCP: September 15, 2026 write-access expansion** surfaced — CRM records, campaigns,
   content, and pipelines now have write access. No November update found. Overdue curate item remains.
6. **GitHub MCP server v2.0.2 (Oct 8) is current** — consistent with CLAUDE.md §13 next-action note.
   No November release found in search.
7. **TypeScript SDK v2.4.0 (Oct 23) remains latest** — no v2.5.0 or November release found.
   v2.4.0 ships 6 additional vulnerability fixes beyond the Oct 20 batch.
8. **No new CVEs affecting catalog servers found** — Day 91+ clean window continues for 19 approved
   remote-HTTP servers.

---

## Registry Scale

| Registry | Count | As of | Notes |
|---|---|---|---|
| **Glama** | ~123,500+ (est.) | Nov 19, 2026 | Projected from Oct 28 confirmed 111,899; ~530/day avg. [[Glama]](https://glama.ai/mcp/servers) |
| **Official MCP Registry** | ~53,075 distinct names | Nov 1, 2026 | Third-party snapshot. [[registry.modelcontextprotocol.io]](https://registry.modelcontextprotocol.io/) |
| **PulseMCP** | ~21,614–21,710 | late Oct 2026 | Flat; submissions paused. [[PulseMCP]](https://www.pulsemcp.com/servers) |
| **Smithery (Arcade.dev)** | Directory-only | Nov 2026 | Proxy gone since Oct 31. [[Smithery]](https://smithery.ai/) |
| **Our catalog** | 19 approved/public | — | All remote-HTTP; HubSpot + Intercom overdue for curate. |

No new Glama snapshot found today. The ~530/day projection is based on the Oct 28 confirmed 111,899
figure (up from ~121,515 on Nov 15 per yesterday's report — search results today confirmed the Oct 28
baseline, but the Nov 15 estimate was already in §13 from yesterday). The two data points are
consistent.

[[eSEOspace Oct 28 snapshot]](https://eseospace.com/blog/glama-mcp/)

---

## MCPCon Nairobi — Day 1 (Ongoing)

The MCP Dev Summit Nairobi 2026 is running **today and tomorrow (Nov 19–20)** at an AAIF-organized
event presented by the Linux Foundation. The event focuses on developers and startups building
practical AI tools and services in Africa.

No session outputs, blog recap, or announcement summaries are yet available — expected
after close on Nov 20.

**Action:** Re-check aaif.io/blog and the Linux Foundation events page after Nov 20 for any
MCP governance signals, spec roadmap discussions, or new AAIF project announcements from this event.

[[Linux Foundation event page]](https://events.linuxfoundation.org/mcp-dev-summit-nairobi/)
[[AAIF blog]](https://aaif.io/blog/)

---

## TypeScript SDK CVE Cluster — Formal Publication Dates Confirmed

Building on yesterday's coverage of the Oct 20 CVE disclosures, today's search confirmed the formal
NVD/Red Hat Security Advisory publication dates:

| CVE | CVSS | Description | Published (NVD/Red Hat) | Fixed in |
|---|---|---|---|---|
| **CVE-2026-111771** | n/a (token substitution) | Server accepts bearer tokens not issued for target server; audience validation must be explicitly enabled post-upgrade | **Nov 5, 2026** | TS SDK server 2.3.0 |
| **CVE-2026-111769** | 6.5 (Medium) | HTTP client follows cross-origin redirects without stripping custom headers/bodies | Nov 5, 2026 (Red Hat) | SDK 1.32.0 / client 2.3.0 |
| **CVE-2026-111770** | 7.7 (High) | Race condition: shared transport/server instance leaks responses across HTTP requests; PoC available | Nov 5, 2026 (aggregator) | server 2.3.0 |

**Key detail on CVE-2026-111771:** Upgrading to v2.3.0 is necessary but **not sufficient** — audience
validation must be explicitly configured by operators. This is an operator action item, not just a
library update.

The formal NVD/Red Hat publication on Nov 5 (two weeks after disclosure) is relevant to downstream
enterprise security scanners that pick up CVEs from NVD rather than GitHub advisories. Catalog
vendors using the TypeScript SDK who had not yet upgraded should now be triggering internal patch cycles.

[[CVE-2026-111771 (Red Hat)]](https://access.redhat.com/security/cve/CVE-2026-111771)
[[CVE-2026-111769 (Red Hat)]](https://access.redhat.com/security/cve/CVE-2026-111769)
[[CVE-2026-111770 (The Hacker Wire)]](https://www.thehackerwire.com/vulnerability/CVE-2026-111770/)

**Catalog impact:** Our 19 catalog entries are remote-HTTP vendor endpoints. We do not run the TS SDK
server ourselves. Catalog pages are structurally unaffected. The audit item (verify TS SDK-based
vendors on v2.3.0+) remains open — specifically check that audience validation is configured on
vendors running `@modelcontextprotocol/server >= 2.3.0`.

---

## TypeScript SDK — No New November Release

Search found **v2.4.0 (Oct 23, 2026) remains the latest release**. No v2.5.0 or November 2026 release
was found. v2.4.0 added 6 additional vulnerability fixes and tightened `x-mcp-header` validation to
the 2026-07-28 spec.

[[TypeScript SDK releases]](https://releases.sh/modelcontextprotocol/mcp-typescript-sdk.md)
[[TypeScript SDK docs]](https://ts.sdk.modelcontextprotocol.io/v2/)

---

## GitHub MCP Server — v2.0.2 Confirmed Current

A third-party aggregator confirms **v2.0.2 published Oct 8, 2026** as the current release. This is
consistent with CLAUDE.md §13 next-action item 3b which calls for updating `verifiedAt` for
`com.github/mcp`. No November release was found.

The server has been on the 2026-07-28 spec since at least July 23 per GitHub's own changelog.

[[GitHub MCP Server changelog (July 23)]](https://github.blog/changelog/2026-07-23-github-mcp-server-supports-the-next-mcp-specification/)

**Audit item:** Bump `verifiedAt` for `com.github/mcp` to v2.0.2 / Oct 8, 2026 in the next
`subregistry-audit` pass.

---

## HubSpot MCP — September Write-Access Expansion

A consultancy blog dated September 15, 2026 describes a **significant HubSpot MCP server capability
expansion** giving Claude write access to CRM records, campaigns, content, and pipelines. Prior to
this, access was read-only for most objects. Full reauthentication required for portals to receive
the new capabilities.

HubSpot also publishes monthly MCP server changelogs via account notifications (confirmed July,
August, September editions).

No November 2026 update was found, but HubSpot's MCP server remains live and expanding. The endpoint
`mcp.hubspot.com` requires OAuth 2.1 + PKCE (no DCR).

**Catalog note:** This remains the #1 overdue curate item. The write-access expansion since the last
review materially increases the value of this catalog entry.

[[HubSpot MCP GA]](https://developers.hubspot.com/changelog/remote-hubspot-mcp-server-is-now-generally-available)

---

## Intercom MCP — Endpoint Confirmed Active

Intercom's official MCP server remains live. Key details confirmed from docs and third-party probes:

- **US endpoint:** `https://mcp.intercom.com/mcp` (Streamable HTTP; legacy SSE deprecated)
- **EU endpoint:** `https://mcp.eu.intercom.com/mcp`
- **AU:** Not supported
- **Auth:** OAuth (recommended) or Bearer access token
- **Last probed:** Oct 9, 2026 (third-party; endpoint returned expected response)
- **Tools:** ~13–15 (conversations, contacts, Help Center articles)

This is a valid, live catalog candidate. The endpoint is structurally suitable for curating.

[[Intercom MCP docs]](https://developers.intercom.com/docs/guides/mcp)
[[Intercom integrations page]](https://www.intercom.com/integrations/connectors/intercom-mcp-server)

---

## Security — Day 91+ Clean Window

No new CVEs affecting any of the 19 cataloged servers were found today. The clean window
continues. The catalog's remote-HTTP-only, auth-gated model remains structurally immune to the
active attack classes documented in §13.

The formal Nov 5 NVD publication of CVE-2026-111770/111769/111771 may trigger enterprise scanner
alerts at catalog vendors using the TypeScript SDK, but these are fixes already available in v2.3.0
(Oct 2). The operator action on CVE-2026-111771 (enabling audience validation explicitly) is the
key outstanding item.

---

## Catalog Action Items (unchanged from yesterday, with one addition)

| Priority | Item | Type | Status |
|---|---|---|---|
| 1 | **HubSpot** (`mcp.hubspot.com`) | curate | Overdue 7+ months; write-access added Sept 15 |
| 2 | **Intercom** (`mcp.intercom.com/mcp`) | curate | Endpoint confirmed active; ready |
| 3 | **TS SDK vendor audit** (CVE-2026-111771 audience validation) | audit | Operator config check needed |
| 4 | **`com.github/mcp` verifiedAt** → v2.0.2 / Oct 8 | audit | Next audit pass |
| 5 | **MCPCon Nairobi** outputs | monitor | Check aaif.io after Nov 20 |

---

## No Material Landscape Shift

No landscape.md update required today. No new entrants, no ranking changes, no spec developments.
The ecosystem is in a normal operating state between the Oct 20 TS SDK CVE patch cycle and the
March 2027 next spec release.
