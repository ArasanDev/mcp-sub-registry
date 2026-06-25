# MCP Ecosystem Update — 2026-06-25

Daily research pass. Covers developments since the June 24 report
([2026-06-24-mcp-ecosystem-update.md](./2026-06-24-mcp-ecosystem-update.md)).
Focus: Salesforce Agentforce 3 launches three new MCP servers (DX, Heroku, MuleSoft);
AAIF inaugural Ambassador Cohort announced; new event dates for Seoul/Shanghai/Tokyo;
registry scale update (Glama 48,043 / PulseMCP 19,500+); no new CVEs today.
Spec RC countdown: 33 days to July 28 final.

All external claims cited with source URLs.

---

## 1. Registry Scale: Glama 48,043 / PulseMCP 19,500+

### Glama

Glama's MCP server index stands at **48,043** as of the June 25 indexing run — up from
47,579 recorded on June 24. Growth of **~464 servers in one day**, consistent with
organic daily additions rather than a batch-indexing event. Glama now also lists
**6,279 MCP connectors** and **293,804+ MCP tools** indexed.

[[Glama MCP servers]](https://glama.ai/mcp/servers)

### PulseMCP

PulseMCP's daily-updated directory now reports **19,500+ servers** — up from 19,410+ on
June 24, a gain of roughly 90 servers. Growth remains steady at approximately
1,000+ new entries per month across Q2 2026.

[[PulseMCP directory]](https://www.pulsemcp.com/servers)

### Trust gap update

Cross-registry estimate (Official MCP Registry + Glama + Smithery + PulseMCP + mcp.so +
GitHub): **~73,000+** indexed MCP servers. Our curated set: **19 approved**. The gap
continues to widen; the sub-registry's value proposition is unchanged.

---

## 2. Salesforce Agentforce 3 — Three New MCP Servers (June 23, 2026)

Salesforce announced **Agentforce 3** on approximately June 23, 2026, doubling down on MCP
as the interoperability backbone for its agent platform. Beyond the Agentforce GA
announcement of June 15 (which covered SObject CRUD, SOQL, and Tableau analytics
endpoints), Agentforce 3 adds **three new vendor-operated MCP servers**:

| Server | Description |
|---|---|
| **Salesforce DX MCP Server** | Salesforce developer toolchain integration (sfdx/sf CLI operations) |
| **Heroku Platform MCP Server** | App management, deployment pipelines, add-on access via Heroku API |
| **MuleSoft MCP Server** | Integration flows, API management, Anypoint Exchange via MuleSoft runtime |

All three follow Salesforce's org-specific URL pattern — endpoints are per-tenant, not a
single shared public URL — which keeps them out of the approved catalog (no universal
discoverable endpoint). They are noted here as confirmation that major SaaS vendors are
expanding MCP surface area significantly, and Salesforce's catalog of native MCP servers is
now at least four distinct servers.

[[Salesforce Agentforce blog]](https://www.salesforce.com/blog/agentforce/)
[[MCP Dev Summit 2026 Readout]](https://www.digitalapplied.com/blog/mcp-dev-summit-2026-readout-protocol-roadmap-analysis)

### Catalog implication

Salesforce's multi-server expansion does not change our approved set (no universal public
endpoints). The watch-list entry for Salesforce Agentforce MCP is updated to reflect
Agentforce 3 + three new servers.

---

## 3. AAIF: First Ambassador Cohort — 138 Members / 41 Countries (June 23, 2026)

The Agentic AI Foundation (AAIF) announced its **inaugural Ambassador Cohort** on
June 23, 2026: **138 community ambassadors across 41 countries**. This is the broadest
geographic expansion signal yet for MCP protocol adoption — ambassadors are domain experts
and community builders tasked with localizing the MCP ecosystem in their regions.

This follows the AAIF's 170+ member organization count (already documented) and represents
a second dimension of growth: individual practitioners, not just vendor organizations.

[[AAIF News]](https://aaif.io/news/)

### Updated AAIF event calendar (June 2026)

New precision on event dates not previously recorded:

| Event | Date | Location |
|---|---|---|
| MCPCon / AAIF Dev Summit Seoul | Aug 13–14, 2026 | Seoul, South Korea |
| MCP Dev Summit Shanghai (AGNTCon + MCPCon China) | Sept 6–7, 2026 | Shanghai, China |
| MCP Dev Summit Tokyo | Sept 10–11, 2026 | Tokyo, Japan |
| AGNTCon + MCPCon Europe | Sept 17–18, 2026 | Amsterdam, Netherlands |
| AGNTCon + MCPCon North America | Oct 22–23, 2026 | North America (TBD city) |

The Asia-Pacific cluster (Seoul → Shanghai → Tokyo) runs across five consecutive weeks in
August–September, signaling coordinated regional adoption push. Combined with the Shanghai
CFP (now closed, schedule announced July 8) this is the largest AAIF event calendar to date.

[[AAIF Global 2026 Events Program]](https://www.linuxfoundation.org/press/agentic-ai-foundation-announces-global-2026-events-program-anchored-by-agntcon-mcpcon-north-america-and-europe)

---

## 4. Spec RC Countdown: 33 Days to July 28

The **2026-07-28 MCP specification RC** final ships July 28, 2026 — **33 days from today**.
The ten-week validation window for Tier-1 SDK maintainers and client implementers remains
active. No new breaking changes or blog posts from modelcontextprotocol.io since June 18.

Key RC changes (already documented; for reference):
- Stateless protocol core; `Mcp-Session-Id` deprecated; `initialize` handshake removed
- Mandatory `Mcp-Method`, `Mcp-Name`, `MCP-Protocol-Version: 2026-07-28` headers
- `_meta` per-request with W3C trace context
- MCP Apps (SEP-1865) + Tasks as official extensions
- Roots/Sampling/Logging deprecated (12-month window)

No catalog schema change required.

[[MCP RC blog post]](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)

---

## 5. Google Cloud: 50+ Managed MCP Servers Confirmed GA/Preview

Research confirmed that Google Cloud announced **50+ managed MCP servers** at GA or
preview as of June 2026, covering all major Google Cloud services — GCS, BigQuery, Vertex
AI, Cloud SQL, Pub/Sub, and others. The announcement was made at Google Cloud Next '26.
Each service is addressable via a managed remote MCP endpoint, though the pattern is
service-scoped (no universal catalog endpoint) rather than per-service-instance.

This follows AWS's AWS MCP Server GA (15,000+ API operations via `call_aws`, updated June 9,
2026). Both patterns remain out of the approved catalog for the same reason as Salesforce:
no single universal public endpoint — they require tenant/project credentials to scope.

[[Google Cloud managed MCP servers]](https://cloud.google.com/blog/products/ai-machine-learning/google-managed-mcp-servers-are-available-for-everyone)
[[AWS MCP Server GA]](https://aws.amazon.com/blogs/aws/the-aws-mcp-server-is-now-generally-available/)

---

## 6. Atlassian SSE Shutdown: 5 Days Away (June 30)

The Atlassian SSE endpoint shutdown is **5 days away**. Our catalog entry
(`com.atlassian/mcp`) was already updated to Streamable HTTP in the June 18 audit. No
further action needed. This is a reminder for operators still using the SSE URL in their
client configs to migrate before June 30.

[[Atlassian Remote MCP Server announcement]](https://www.atlassian.com/blog/announcements/remote-mcp-server)

---

## 7. Security: No New CVEs on June 25

No new MCP CVEs or active incidents were published on June 25, 2026. All previously
documented threats remain the active set:

**Still open (pending audit pass):**
- CVE-2026-25536 (MCP TypeScript SDK cross-client data leak, patched ≥1.26.0): verify all
  TypeScript-SDK-based vendors in catalog run ≥1.26.0.
- DNS rebinding CVE-2026-11624: verify all cataloged vendors run MCP server ≥v0.25.

**Resolved:**
- Asana V2 migration: `https://mcp.asana.com/v2/mcp` — updated 2026-06-18 ✓
- Atlassian SSE → Streamable HTTP: updated 2026-06-18 ✓

---

## 8. Catalog Hooks — No Action Required

All 19 approved catalog entries checked against today's findings:

| Finding | Catalog impact |
|---|---|
| Salesforce Agentforce 3 (3 new servers) | All org-specific URLs — no catalog entry; watch list note updated |
| Google Cloud 50+ managed MCP servers | Service-scoped, tenant-required — no universal public endpoint; not catalogable |
| AAIF Ambassador Cohort / new event dates | No catalog impact; ecosystem adoption signal |
| Glama 48,043 / PulseMCP 19,500+ | Discovery-tier growth; approved set unchanged |
| Spec RC countdown 33 days | No catalog schema change |
| Atlassian SSE June 30 shutdown | Catalog already on Streamable HTTP (June 18) ✓ |

**Pending from prior reports (still open):**
- CVE-2026-25536 TypeScript SDK ≥1.26.0 audit: target next `subregistry-audit` run.
- CVE-2026-11624 DNS rebinding: verify all cataloged vendors run MCP server ≥v0.25.
- SSE-typed entries: audit for Streamable HTTP migration (Asana done; check others).

---

## Summary

| Metric | Value | Change |
|---|---|---|
| Glama indexed servers | 48,043 | +464 since June 24 |
| PulseMCP servers | 19,500+ | +90 since June 24 |
| Cross-registry estimate | ~73,000+ | (steady) |
| Our approved catalog | 19 | unchanged |
| Days to spec RC final | 33 | −1 |
| New CVEs (June 25) | 0 | clean day |
| AAIF ambassadors | 138 / 41 countries | new cohort announced |

**Key signal today:** Salesforce Agentforce 3 launches three new vendor-operated MCP servers
(DX, Heroku, MuleSoft), extending its total MCP server count to at least four distinct
servers. Combined with Google Cloud's 50+ managed servers and AWS MCP Server GA, the major
cloud and SaaS vendors are now comprehensively MCP-enabled. The approved catalog's 19
remote-HTTP servers represent the trustworthy subset of a rapidly expanding enterprise-MCP
landscape.
