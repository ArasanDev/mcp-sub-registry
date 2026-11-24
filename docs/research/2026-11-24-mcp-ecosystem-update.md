# MCP Ecosystem Update — 2026-11-24

**Prepared by:** MCP Sub-Registry Orchestrator (autonomous daily pass)
**Scope:** What changed since the 2026-11-21 report. 3-day window (Nov 22–24).
**Today's date:** 2026-11-24

---

## Summary

Three-day incremental pass. The 2026-11-21 report covered: MCPCon Nairobi recap pending,
TWO new TS SDK CVEs (CVE-2026-104850, CVE-2026-111768), Smithery dead-URL aftermath (~200+
entries pointing at defunct URLs), MCP server reachability census (54–55% respond), Official
Registry ~59,603 (Nov 8), Day 93+ clean. Today's additions:

1. **MCPCon Nairobi recap still pending (Day 4+)** — event concluded Nov 20; no AAIF blog post
   as of Nov 24. New detail confirmed: Gates Foundation served as Diamond Sponsor.
2. **Microsoft Ignite 2026 (Nov 17–21) — major MCP governance wave**: MCP Firewall (preview),
   Entra Agent Identity (preview), Azure RM MCP Server expansion, and Microsoft MCP Server for
   Enterprise promoted from Preview to **GA**.
3. **Official MCP Registry: ~64,935 distinct servers as of Nov 15** — fresh third-party snapshot,
   consistent with ~3,166/week growth from the Nov 8 baseline.
4. **Zendesk Bridge (early access, Nov 10)**: 400+ Zendesk tools via MCP; evaluate as catalog
   candidate once GA and auth model confirmed.
5. **New CVEs (community/non-catalog packages)**: CVE-2026-134817 (mcp-server-kubernetes,
   CVSS 7.1), CVE-2026-125271 (AWS API MCP Server policy bypass), CVE-2026-114494/114497
   (codebase-memory-mcp). None affect the 19 remote-HTTP catalog servers.
6. **SDK and GitHub MCP**: No new TS or Python SDK releases. GitHub MCP v2.0.3 appears in a
   winget listing but is unconfirmed — pending direct verification.
7. **Day 97+ clean window** continues for all 19 approved remote-HTTP catalog servers.

---

## Registry Scale

| Registry | Count | As of | Notes |
|---|---|---|---|
| **Official MCP Registry** | ~64,935 (snapshot) | Nov 15, 2026 | Third-party enterprise guide snapshot. [[guptadeepak.com]](https://guptadeepak.com/the-complete-guide-to-model-context-protocol-mcp-enterprise-adoption-market-trends-and-implementation-strategies/) |
| **Official MCP Registry (est.)** | ~65,500–66,500 (est.) | Nov 24, 2026 | Extrapolated at ~3,166/week from Nov 15 figure. |
| **Glama** | ~122,052 (homepage cache, undated) | ~early-mid Nov | Homepage cache unchanged. Oct 28 confirmed 111,899 → ~530/day growth → Nov 24 est. ~125,500–126,500. [[Glama]](https://glama.ai/mcp/servers) |
| **PulseMCP** | ~21,614–21,710 | late Oct 2026 | Flat; ingestion paused; no fresh count. [[PulseMCP]](https://www.pulsemcp.com/servers) |
| **Smithery (Arcade.dev)** | Directory-only | Nov 2026 | Proxy shutdown Oct 31; ~216 entries still at defunct run.tools URLs. [[Smithery]](https://smithery.ai/) |
| **Our catalog** | 19 approved/public | — | All remote-HTTP; HubSpot + Intercom + Zendesk Bridge overdue for curate evaluation. |

Enterprise adoption: 23 of 40 tracked business systems now have an official GA MCP server
(Nov 2026 enterprise tracker). [[guptadeepak.com]](https://guptadeepak.com/the-complete-guide-to-model-context-protocol-mcp-enterprise-adoption-market-trends-and-implementation-strategies/)

---

## MCPCon Nairobi — Recap Still Pending (Day 4+)

Event concluded Nov 19–20, 2026 in Nairobi. AAIF has not published a recap blog post as of
Nov 24. New detail confirmed: **Gates Foundation served as Diamond Sponsor** — first development
finance institution to be a Diamond sponsor at an AAIF MCP event, underscoring global south
AI-agent adoption interest.
[[AAIF news]](https://aaif.io/news/agentic-ai-foundation-welcomes-the-gates-foundation)

AAIF 2026 events program concludes with Nairobi; no December events announced.
[[AAIF events]](https://aaif.io/events)

**Monitor:** aaif.io/blog for the Nairobi recap. When published, check for any MCP governance
or spec signals and update this section.

---

## Microsoft Ignite 2026 — Major MCP Governance Wave

Microsoft Ignite 2026 (Nov 17–21, Chicago) brought the most significant Microsoft MCP
governance announcements since Ignite 2025:

### MCP Firewall (Preview)
New governance layer that enforces policy across MCP servers, tools, resources, methods and
protocol versions. Operates at the boundary between AI clients and MCP servers. Distinct from
the catalog/registry layer — this is a runtime policy enforcement point.
[[Tech Community]](https://techcommunity.microsoft.com/blog/azuregovernanceandmanagementblog/what%E2%80%99s-new-in-the-azure-resource-manager-mcp-server-at-ignite-2026/4571824)

**Sub-registry relevance:** MCP Firewall enforces `enabled` decisions at runtime — this is exactly
the boundary between our catalog's `approved` state and the Gateway's runtime enablement.
Strengthens the external validation of `discovered != approved != enabled` as the correct
three-layer model.

### Entra Agent Identity (Preview)
AI agents (including GitHub Copilot CLI and Claude Code) are now treated as first-class
identities in Entra ID. Agents can be assigned roles, audited, and have scoped access. This
makes agent-identity a core enterprise control, complementing EMA (SEP-990) already in catalog.
[[windowsforum coverage]](https://windowsforum.com/news/microsoft-ignite-2026-azure-ai-agents-catalyst-migration-and-entra-security.452863/)

### Azure Resource Manager (ARM) MCP Server — Expanded
New tools across five domains: discovery, planning, deployment, verification, and cost
optimization. Pairs with the Bicep MCP Server for infrastructure-as-code workflows.
Per-tenant/subscription endpoint; not catalogable. Added to watch list.
[[Azure blog]](https://azure.microsoft.com/en-us/blog/microsoft-ignite-2026-whats-new-in-azure-the-platform-purpose-built-for-ai/)

### Microsoft MCP Server for Enterprise — Promoted to GA
The Microsoft MCP Server for Enterprise (Entra ID natural-language query via Microsoft Graph)
was in Preview since July 2026 and is now **GA** as of Ignite 2026.
[[TechRepublic overview]](https://www.techrepublic.com/article/news-microsoft-ignite-2026-announcements/)

**Catalog note:** The endpoint is Microsoft Graph–hosted and scoped per tenant; still not a
single catalogable public endpoint. Watch list updated from "Preview — watch for stable public
endpoint" to "GA — per-tenant, not catalogable."

---

## New Enterprise MCP Servers

### Zendesk Bridge (Early Access, Nov 10, 2026) — Catalog Candidate
Zendesk Bridge exposes 400+ Zendesk tools via MCP, compatible with Claude and ChatGPT.
Customer support persona. Added to curate queue pending GA and auth model verification.

**Curate gate:** confirm stable hosted endpoint URL, auth model (OAuth or API key), and whether
a universal endpoint exists (vs. org-specific URL). If per-tenant only, skip; if universal, add
to curate next run.

### Fast Simon MCP Server (Nov 20, 2026)
E-commerce product discovery tools. Works with Claude Code, Cursor, Windsurf, Cline. Not a
developer-tools catalog candidate; not adding to curate queue.
[[MarTech Cube]](https://www.martechcube.com/fast-simon-announced-the-launch-of-a-new-mcp-server/)

### Azure MCP Server in Visual Studio 2026
Built-in Azure MCP server in Visual Studio 2026 is now GA for IDE-integrated Azure workflows.
Per-subscription, not catalogable.
[[devblogs]](https://devblogs.microsoft.com/visualstudio/azure-mcp-server-now-built-in-with-visual-studio-2026-a-new-era-for-agentic-workflows/)

---

## Security — Day 97+ Clean

No CVEs or incidents affecting any of the 19 remote-HTTP catalog servers. New CVEs in the
community/non-catalog space:

| CVE | Package | CVSS | Fix | Notes |
|---|---|---|---|---|
| CVE-2026-134817 | mcp-server-kubernetes | 7.1 (High) | 4.2.0 | [[vuldb]](https://vuldb.com/cve/CVE-2026-134817) |
| CVE-2026-125271 | AWS API MCP Server | Policy bypass | 1.5.1 | Different product from cataloged `com.aws/mcp` (AWS MCP Server GA). [[AWS bulletin]](https://aws.amazon.com/security/security-bulletins/2026-176-aws/) |
| CVE-2026-114494 | codebase-memory-mcp | Stack OOB write | 0.9.0 | [[hol.org]](https://hol.org/guard/security/cves/CVE-2026-114497-codebase-memory-mcp-ui-process-kill-route-skipped) |
| CVE-2026-114497 | codebase-memory-mcp | 5.5, Windows | 0.9.1-rc.1 | [[hol.org]](https://hol.org/guard/security/cves/CVE-2026-114497-codebase-memory-mcp-ui-process-kill-route-skipped) |

Catalog is structurally immune (remote-HTTP only; no STDIO packages).

**Active CVE audit items (from prior research, still pending):**
- TS SDK cluster: audit all TS SDK-based catalog vendors for SDK ≥1.32.0 (1.x) or ≥2.3.0 (2.x)
  covering CVE-2026-25536, CVE-2026-104850, CVE-2026-111768, CVE-2026-111771.
- Python SDK: verify vendors on ≥mcp 1.30.0 (CVE-2026-116686 SSRF/$ref).

---

## SDK and Spec Status

| Item | Status | Notes |
|---|---|---|
| TS SDK | v2.4.0 / v1.32.2 latest | No new release since Oct 23. [[releases.sh]](https://releases.sh/modelcontextprotocol/mcp-typescript-sdk) |
| Python SDK | mcp>=1.30.0 latest | No new release confirmed since Oct 27 CVE fix. |
| GitHub MCP Server | v2.0.2 confirmed; v2.0.3 unconfirmed | v2.0.3 appears in winget listing but release notes not independently confirmed. Verify in next audit pass. [[wingetly.io]](https://wingetly.io/apps/github/github-mcp-server) |
| MCP Spec | 2026-07-28 FINAL | Next spec: March 30, 2027. No new SEPs merged. |

---

## Catalog Hooks

All 19 approved catalog servers remain approved/public. No demotions warranted.

**Curate queue additions from this pass:**
- **Zendesk Bridge** — verify endpoint + auth model; if universal GA endpoint confirmed, add to
  Comms & Support group alongside HubSpot + Intercom.

**Carry-forward curate queue (from CLAUDE.md §13):**
- HubSpot (`mcp.hubspot.com`): 7+ months overdue; OAuth 2.1 + PKCE; no DCR.
- Intercom (`mcp.intercom.com/mcp`): Streamable HTTP; OAuth or Bearer.

**Carry-forward audit items:**
- TS SDK CVE cluster: CVE-2026-104850 + CVE-2026-111768 + CVE-2026-111771 + CVE-2026-25536.
- Python SDK: CVE-2026-116686 (mcp>=1.30.0).
- GitHub MCP v2.0.3 release existence and date.
- SEP-2127 server card audit: verify finalization status before running.
