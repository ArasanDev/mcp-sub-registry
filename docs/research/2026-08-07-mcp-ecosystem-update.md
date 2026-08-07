# MCP Ecosystem Update — 2026-08-07

**Produced by:** MCP Sub-Registry autonomous research routine
**Covers:** 2026-08-06 EOD → 2026-08-07
**Prior report:** [2026-08-06-mcp-ecosystem-update.md](./2026-08-06-mcp-ecosystem-update.md)

---

## 1. Headline Summary

- **MCPwned slides status: expected today, not yet confirmed published.** Black Hat USA
  2026 formally closed Aug 6. Per Black Hat's standard post-conference practice, briefing
  materials (slides + whitepapers) post to the official briefings page approximately the
  morning after the final live session. The MCPwned presentation (Team Cymru) ran both
  Aug 5 and Aug 6; slides are expected on the Black Hat website Aug 7. As of this morning's
  research pass, no confirmed public URL for the slides was found. Streamly on-demand access
  opens Aug 14. Monitor the [Black Hat USA 2026 briefings page](https://blackhat.com/us-26/briefings.html)
  and [Team Cymru's event page](https://event.team-cymru.com/black-hat-usa-2026) for
  confirmation.
- **Microsoft enterprise MCP wave continues.** Three distinct Microsoft announcements
  converge this week: (1) Dynamics 365 Customer Service MCP Server reached **GA July 30**;
  (2) new **governance controls for D365 Customer Service** published Aug 5; (3) **7 MCP
  launch data partners** for Dynamics 365 Sales were announced July 21 (ZoomInfo, Dun &
  Bradstreet, LeadIQ, Draup, Gong, Enlyft, HG Insights). Microsoft's enterprise MCP
  footprint now spans three distinct catalog products (D365 Customer Service, D365 ERP,
  Dataverse MCP Servers) plus the MCP Server for Enterprise (Entra ID, Preview). See §3.
- **AAIF posts stateless-adoption blog.** "The Ecosystem Responds to Stateless MCP"
  documents unusually fast vendor adoption post-2026-07-28 spec — infrastructure providers,
  cloud platforms, and vendors shipped production implementations within days. Simon
  Willison publicly noted stateless MCP "recaptured my interest."
  [[AAIF]](https://aaif.io/blog/the-ecosystem-responds-to-stateless-mcp)
- **Anthropic Connectors Directory: resolving the count discrepancy.** Our running
  tracked figure is 439 (the official vetted-and-curated web directory, per AIToolsReview
  Aug 2026 and consistent with prior tracking). The claude.com July 28 blog states "over 950
  MCP servers in the connectors directory" — this broader count includes both the vetted web
  directory **and** the in-app catalog (community-built + local desktop-extension connectors
  Anthropic surfaces but does not itself vet). An independent GitHub tracker
  (awesome-claude-connectors, July 23) counted 841 connectors across both surfaces + 18
  pending verification. The meaningful curation signal remains the **439 vetted web directory
  entries**; the 950+ figure represents total discoverability. See §4.
- **Registry scale (Aug 7):** Glama **~68,650–69,280** (trending toward 69k milestone;
  two readings within Aug 6–7 window); PulseMCP **~22,080+** (stable); MCPToplist
  **~96,771** (Aug 2 snap — unchanged). Trust gap: ~97k+ indexed vs. 19 approved.
- **Security: Day 42 clean.** No new CVEs targeting any of the 19 cataloged servers.
  Black Hat USA 2026 full conference window (Aug 1–6) closed without naming any catalog
  server endpoint. 42-day clean window continues.
- **SEP-2127 WG: 7 days to close (Aug 14).** Working group term unchanged; server card
  path confirmed as `/.well-known/mcp/server-card.json`. AAIF MCP Dev Summit Seoul
  (Aug 13–14) is 6 days away — co-located with Open Source Summit Korea.

---

## 2. Scale & Registry Landscape

| Registry | Count (Aug 7) | vs. Aug 6 | Note |
|---|---|---|---|
| Glama | ~68,650–69,280 | +0 to +630 | Two readings in 24h window; trending toward 69k |
| PulseMCP | ~22,080+ | ~flat | Stable |
| MCPToplist (cross-registry) | ~96,771 | — (Aug 2 snap) | No new reading |
| Anthropic Connectors (vetted web dir.) | 439 | — | Stable; see §4 for context |
| Anthropic Connectors (all surfaces) | 950+ | — | Per claude.com July 28 blog |
| Our catalog | 19 | — | Approved/public; no changes |

Glama is trending toward the 69k milestone. The post-spec surge (first noted July 29) appears
to be stabilizing into a batch-indexing rhythm of ~500–1,000 new entries per day rather than
an organic-growth pace.
[[Glama]](https://glama.ai/mcp/servers)
[[PulseMCP]](https://www.pulsemcp.com/servers)

---

## 3. Microsoft Enterprise MCP — Three-Wave Announcement

Microsoft's enterprise MCP footprint has expanded substantially across the past two weeks
through coordinated product announcements. This is the clearest signal yet of major-platform
MCP adoption at the application layer (not just infrastructure).

### 3a. Dynamics 365 Customer Service MCP Server GA (July 30, 2026)

The D365 Customer Service MCP Server reached general availability, enabling MCP-compatible
AI clients to securely access service data, knowledge bases, cases, and workflows. The GA
makes the MCP tools used by Service Agent in Microsoft 365 Copilot available as an
independent offering for third-party AI clients. Governance controls for D365 Customer
Service were published as a separate blog post on Aug 5.

[[Microsoft D365 CS MCP Server GA blog]](https://www.microsoft.com/en-us/dynamics-365/blog/it-professional/2026/07/30/dynamics-365-customer-service-mcp-server-ga/)
[[Governance blog Aug 5]](https://www.microsoft.com/en-us/dynamics-365/blog/it-professional/2026/08/05/governance-customer-service/)
[[RCP Mag coverage]](https://rcpmag.com/blogs/rcp-channel-briefing/2026/08/microsoft-makes-dynamics-365-customer-service-mcp.aspx)

### 3b. Dynamics 365 Sales: 7 MCP Data Partners (announced July 21, 2026)

Microsoft announced 7 third-party MCP data providers integrating into Dynamics 365 Sales:
**ZoomInfo, Dun & Bradstreet, LeadIQ, Draup, Gong, Enlyft, HG Insights.** Each partner
shipped an MCP server for Dynamics 365 Sales, delivering account enrichment, firmographics,
buying signals, contact data, risk intelligence, deal context, market intelligence, and
next-action recommendations without sellers leaving the Microsoft environment.

[[Microsoft D365 Sales blog]](https://www.microsoft.com/en-us/dynamics-365/blog/business-leader/2026/07/21/extending-agentic-microsoft-dynamics-365-sales-with-mcp/)
[[MSDynamicsWorld coverage]](https://msdynamicsworld.com/story/ai-agents-dynamics-365-sales-microsoft-announces-mcp-launch-partners)
[[Cloud Wars coverage]](https://cloudwars.com/ai/microsoft-enlists-7-mcp-partners-to-serve-customer-insights-into-dynamics-365-sales/)

### 3c. Catalog Relevance

All three D365 MCP servers use per-tenant org-specific URLs, making them not directly
catalogable in a universal registry. However, they represent a major enterprise adoption
pattern — *enterprise software vendors exposing their application data layers via MCP
served from their own infrastructure.* This is the pattern Salesforce adopted (Agentforce 3),
now being replicated at Microsoft scale. No catalog action; watch list updated mentally —
these are the "enterprise application data" persona's natural boundaries.

---

## 4. Anthropic Connectors Directory — Count Clarification

Our running tracking figure of **439** represents the Anthropic-curated, vetted **web
directory** (visible at claude.ai/connectors, reviewed for security + compatibility +
reliability). This is the most meaningful curation signal — analogous to our own
`approved` layer.

The broader **950+** figure from the Claude July 28 blog encompasses both:
1. The vetted web directory (439 entries as of Aug 2026)
2. The in-app catalog — community-built and local desktop-extension connectors that
   Anthropic *surfaces* but does not itself build or vet

An independent GitHub tracker (awesome-claude-connectors, July 23, 2026) counted **841
connectors** across both surfaces + 18 held pending vendor verification.

**Takeaway for our catalog:** The vetted directory (439 entries) maps closest to our
`approved` tier — it's the signal that matters. The 2× growth from 343 (July 4) → 439
(Aug 2026) in the vetted tier shows Anthropic's own curation velocity. Our 19/439 ratio
= ~4.3% of Anthropic's vetted set, focused on trusted remote endpoints with no org-specific
URLs.
[[GitHub awesome-claude-connectors]](https://github.com/rdmgator12/awesome-claude-connectors)
[[claude.com July 28 blog]](https://claude.com/blog/bringing-mcp-2026-07-28-to-claude)

---

## 5. AAIF Stateless MCP Adoption Blog

The Agentic AI Foundation published **"The Ecosystem Responds to Stateless MCP"** documenting
rapid vendor uptake of the 2026-07-28 spec:

- Infrastructure providers, cloud platforms, and SDK maintainers shipped production
  implementations within days of the spec release — described as "unusually fast for an
  open standard."
- The core value: MCP no longer requires protocol sessions. Every request is independent
  and carries its protocol version, client identity, and capabilities. Servers no longer
  need sticky sessions or shared session stores to scale horizontally — an MCP server now
  behaves like any other HTTP service.
- AAIF also published a companion migration guide: **"Migrate MCP Servers to Stateless
  Architecture (2026-07-28)"** — formal adoption tooling.
- Simon Willison (independent developer, Datasette creator) publicly noted the stateless
  design "recaptured my interest" in MCP — a signal that the protocol shift resolved
  real pain points practitioners had been experiencing.

AAIF has also posted a third blog in the adoption series: **"MCP Graduates to Enterprise
Infrastructure: Stateless Architecture & Security"** documenting the enterprise maturation
angle.

[[AAIF stateless adoption blog]](https://aaif.io/blog/the-ecosystem-responds-to-stateless-mcp)
[[AAIF migration guide]](https://aaif.io/blog/migrate-sessions-to-stateless-requests-with-mcp-2026-07-28)
[[AAIF enterprise infrastructure blog]](https://aaif.io/blog/mcp-graduates-to-enterprise-infrastructure-stateless-architecture-formal-governance-and-security)

---

## 6. SDK v2 Adoption in the Wild

Early signals of Python SDK v2 adoption effort at scale:

- **IBM ContextForge** (open-source enterprise MCP infrastructure, IBM Research) created a
  comprehensive migration epic ([GH issue #5559](https://github.com/IBM/mcp-context-forge/issues/5559))
  to migrate from Python MCP SDK 1.x to 2.0.0 — addressing all breaking changes and
  ensuring full 2026-07-28 spec compliance. IBM ContextForge running on 1.x as of migration
  start confirms the v1→v2 transition is a real enterprise effort even for sophisticated users.
- **LangChain MCP Adapters** added a GitHub issue for testing v2 SDK compatibility
  ([langchain-mcp-adapters #578](https://github.com/langchain-ai/langchain-mcp-adapters/issues/578)).
- **Backward compatibility confirmed:** A v2 server answers the legacy `initialize`
  handshake alongside the new `server/discover` RPC, ensuring clients still on 2025-11-25
  protocol keep connecting during the migration window.
- **Real Python** covered "MCP Gets Its Biggest Rewrite" as the lead story in its
  August 2026 Python news roundup — signals broad developer community awareness.
  [[Real Python]](https://realpython.com/python-news-august-2026/)
  [[IBM ContextForge issue]](https://github.com/IBM/mcp-context-forge/issues/5559)
  [[LangChain MCP adapters issue]](https://github.com/langchain-ai/langchain-mcp-adapters/issues/578)

**Audit implication (open action):** Our `subregistry-audit` pass should verify TypeScript
SDK vendors are on >=1.26.0 or v2.0.0, and Python SDK vendors are on >=1.28.1 or v2.0.0
before the 6-month v1 security-patch window ends (~Jan 2027).

---

## 7. AWS Agent Registry — Post-Migration Status

The `bedrock-agentcore` → `agent-registry` namespace migration executed on schedule
(Aug 6). Key status:

- **Still Preview:** No GA announcement coincided with the migration. AWS Agent Registry
  remains in controlled preview.
- **Documentation base:** The bedrock-agentcore docs now redirect to/reflect the
  agent-registry namespace. Operators must update endpoints, IAM policies, SDK clients,
  and CLI scripts.
- **com.aws/mcp unaffected:** The AWS MCP Server (`https://mcp.amazonaws.com/mcp`) is a
  distinct GA product (us-east-1 + eu-central-1; IAM SigV4 via mcp-proxy-for-aws). No
  catalog action.
- **Watch for GA:** If AWS Agent Registry reaches GA, assess as potential sync source
  (it exposes an MCP endpoint for agent/server discovery).
  [[AWS Agent Registry docs]](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry.html)

---

## 8. Security: Day 42 Clean Window

All 19 cataloged servers remain approved and public. No new CVEs affecting any catalog
endpoint were disclosed in the Aug 6–7 window or during the full Black Hat USA 2026
conference (Aug 1–6, 42-day clean window since June 26).

**Background context from accumulating research:**
- Adversa AI published a comprehensive "MCP Security Best Practices & Resources: August
  2026" roundup consolidating the OWASP MCP Top 10, NSA guidance, and CVE database.
  [[Adversa AI August 2026]](https://adversa.ai/blog/top-mcp-security-resources-august-2026/)
- The MCP CVE project on GitHub tracks all MCP-related CVE filings:
  [[mcp-security-project/mcp-cve-project]](https://github.com/mcp-security-project/mcp-cve-project)
- The "30 CVEs in 60 days" framing (early 2026) remains the backdrop: 43% command-injection,
  82% path-traversal risk in surveyed STDIO implementations. Remote-HTTP + auth-gated catalog
  is structurally immune to all STDIO-class vulnerabilities.
- **MCPwned slides:** Expected Aug 7; not yet confirmed published. The honeypot data
  (3,993 probes/48h from 327 IPs; 155 MCP probes) focuses on exposed/unauthenticated
  endpoints — structurally absent from our catalog. Monitor for post-conference CVE filings.

---

## 9. Catalog Assessment — All 19 Servers Approved/Public

No catalog action from today's research.

**Priority queue (unchanged):**
1. **HubSpot MCP** (`mcp.hubspot.com`) — #1 curate priority. GA April 13, 2026; OAuth
   2.1 + PKCE (no DCR); leads read access added in last update. Next `subregistry-curate` run.
   [[HubSpot GA]](https://developers.hubspot.com/changelog/remote-hubspot-mcp-server-is-now-generally-available)
2. **X (Twitter) MCP** (`api.x.com/mcp`) — auth complexity must be resolved (pay-per-use
   tiers since Feb 2026; Production env enrollment required; Enterprise-only for some
   endpoints; headless-only). Verify gateway-compatible auth path first.
3. **`subregistry-audit` pass** — verify all TypeScript SDK vendors in catalog are on
   >=v1.26.0 or SDK v2.0.0 (CVE-2026-25536 data leak + CIMD compliance for OAuth-gated
   vendors per new spec). Priority: run before the 6-month v1 security-patch window closes
   (~Jan 2027).

---

## 10. Key Dates Ahead

| Date | Event |
|---|---|
| Aug 7 (today) | MCPwned slides expected on Black Hat website (not yet confirmed) |
| Aug 13–14 | AAIF MCP Dev Summit Seoul (co-located with Open Source Summit Korea) |
| Aug 14 | SEP-2127 WG closes; MCPwned Streamly on-demand access opens |
| Aug 14 | AAIF MCP Dev Summit Seoul Day 2 |
| Aug 31 | SEP-2127 follow-on WG meeting |
| Sep 6–7 | MCPCon Shanghai / AGNTCon China (KubeCon China co-located) |
| Sep 17–18 | MCPCon Europe (Amsterdam) |
| Oct 22–23 | MCPCon North America (San Jose, CA) |
