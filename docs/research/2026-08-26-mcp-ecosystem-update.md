# MCP Ecosystem Update — 2026-08-26

**Prepared by:** MCP Sub-Registry Orchestrator (autonomous daily pass)
**Scope:** What changed in the MCP ecosystem since the Aug 25 report.
**Today's date:** 2026-08-26

---

## Registry Scale

| Registry | Count | Change vs yesterday | Notes |
|---|---|---|---|
| **Glama** | **78,248** | **+867 (CROSSES 78k MILESTONE)** | Page-title confirmed from search result: "Open-Source MCP Servers – 78,248 in the Glama Registry" [[Glama]](https://glama.ai/mcp/servers) |
| **MCPToplist** | 108,245 | n/c (Aug 23 snap, 3 days stale) | No new cross-registry snapshot today [[MCPToplist]](https://mcptoplist.com/) |
| **PulseMCP** | ~22,020–22,050 | Flat (Day 16) | Ingestion-rework pause continues; "until mid-August" deadline is now 12 days past; no step-jump yet [[PulseMCP]](https://www.pulsemcp.com/servers) |
| **Our catalog** | 19 approved/public | — | All remote-HTTP, all approved/public |

**Trust gap:** ~109k+ cross-registry indexed vs. 19 curated/approved. Discipline holds.

### Glama 78k milestone detail
Glama's live server listing confirms 78,248 servers in the page title today. The +867 single-day increase is the largest recorded in recent weeks, suggesting another batch-indexing event. At post-spec-final pace (~500–900/day net), Glama is on track to cross 79k within 1–2 days. The milestone: Glama has added approximately 16,867 servers since the 2026-07-28 spec final release 29 days ago.

---

## Security — Day 61 Clean for Cataloged Servers

No new CVEs or incidents affecting any of the 19 cataloged remote-HTTP servers were found today. The 61-day clean window continues.

### CVE-2026-75149 (Marimo Notebook) — First Captured in Our Research Trail

**CVE-2026-75149** was published August 19, 2026 but was not surfaced in prior daily research passes (Aug 19–25 all reported "clean" without flagging it). This is the first pass to formally document it in our research trail.

**Details:**
- **Product:** [Marimo](https://marimo.io/) — an open-source Python notebook that supports running MCP servers inline.
- **Type:** Code injection (CWE-94) — an attacker can embed a crafted MCP server entry with a malicious command value directly into a Marimo notebook file. The command runs as a local subprocess when the victim opens the notebook in edit mode.
- **CVSS v4:** 8.7 (High) | **CVSS v3.1:** 8.8 (High)
- **Authentication required:** None (from the attacker's perspective). User interaction required: victim must open the crafted notebook.
- **Patched in:** Marimo v0.23.15.
- **Exploitation timeline:** Sysdig documented weaponization within 10 hours of CVE disclosure — "From Disclosure to Exploitation in Under 10 Hours." [[Sysdig]](https://www.sysdig.com/blog/marimo-oss-python-notebook-rce-from-disclosure-to-exploitation-in-under-10-hours)
- **Source:** [[The Hacker News]](https://thehackernews.com/2026/08/marimo-notebook-flaw-could-run-mcp.html) | [[TheHackerWire]](https://www.thehackerwire.com/marimo-code-injection-cve-2026-75149/) | [[GuardianMSSP]](https://www.guardianmssp.com/2026/08/25/marimo-notebook-flaw-could-run-mcp-commands-before-cells-execute-in-edit-mode/)

**Catalog impact:** None. This is a local Python notebook tool that allows STDIO/subprocess MCP execution — structurally incompatible with our remote-HTTP-only catalog. However, the vulnerability class is significant: it confirms that MCP command execution can be weaponized through the notebook-opens-server pattern (not just via npm `postinstall`). The <10-hour weaponization timeline reinforces why `discovered != approved != enabled` matters even for tooling perceived as benign.

**Note:** The VulnerableMCP project (vulnerablemcp.info) has already cataloged this CVE. [[VulnerableMCP]](https://vulnerablemcp.info/)

---

## MCP Governance — Dense Meeting Calendar This Week

Today (Aug 26) alone has three separate MCP working group / interest group sessions, per the official MCP events calendar at [meet.modelcontextprotocol.io](https://meet.modelcontextprotocol.io/):

| Date | Session | Tags |
|---|---|---|
| **Aug 26 8:00am** | Inspector V2 WG (weekly) | `#inspector-v2-wg` |
| **Aug 26 12:00pm** | Fine-Grained Auth Working Group | `#auth-wg-fine-grained-authz` |
| **Aug 26 2:00pm** | Gateways Interest Group (IG) | `#gateways-ig` |
| **Aug 27 4:00pm** | Financial Services IG (FSIG) bi-weekly | `#fsig` `#finance` |
| **Aug 28 8:00am** | MCP Transports WG (weekly) | `#transports-wg` |
| **Aug 28 10:00am** | MCP Agents WG (weekly) | `#agents-wg` |
| **Aug 28 11:00am** | Triggers & Events WG | `#triggers-events-wg` |
| **Aug 31 8:00pm** | SEP-2127 Server Cards WG follow-on | SEP-2127 |

Source: [[MCP Events]](https://meet.modelcontextprotocol.io/)

**Signal:** Seven distinct WG/IG sessions in a 6-day window is the busiest governance stretch observed in our research trail. This reflects the post-spec-final consolidation phase — multiple parallel working groups are now driving the next-generation MCP features (agent messaging, fine-grained auth, transport hardening, triggers/events, server cards) rather than the spec core itself, which is now stable (2026-07-28 final).

### Financial Services Interest Group (FSIG)
The FSIG is a formally chartered MCP IG focused on regulated financial services environments. Key details:
- **GitHub:** `modelcontextprotocol/financial-services-interest-group` [[repo]](https://github.com/modelcontextprotocol/financial-services-interest-group)
- **Mission:** Define finance-specific MCP extensions (compliance/auditability, data lineage, provenance, guardrails, attestation); advocate for spec enhancements via SEPs.
- **Cadence:** Bi-weekly, 4–5pm London time (BST/GMT).
- **Governance:** Consensus-driven; decisions in meeting notes or GitHub Issues; open participation.
- Source: [[FSIG Charter]](https://github.com/modelcontextprotocol/financial-services-interest-group/blob/main/CHARTER.md) | [[MCP Community IG page]](https://modelcontextprotocol.io/community/interest-groups/financial-services)

**Catalog relevance:** Financial services data-lineage and provenance requirements are closely aligned with our `discovered != approved != enabled` boundary. If the FSIG publishes MCP extensions for auditability or data-provenance, these could inform future `gateway_compatibility` fields in the catalog schema. Track outputs via their GitHub repo. Their Aug 27 meeting is this week.

### Fine-Grained Auth WG — Active as of Aug 26
The Fine-Grained Auth WG (`#auth-wg-fine-grained-authz`) is meeting today at 12pm. This WG focuses on authorization controls beyond the basic OAuth 2.1 model in the 2026-07-28 spec. Likely topics include per-tool authorization, scoped access policies, and delegation models. No public outputs yet from this WG in our research trail.

**Catalog relevance:** Fine-grained authorization models — if standardized as a SEP — would affect the `required_secrets` and `gateway_compatibility` metadata we publish in the gateway projection.

---

## AAIF Seoul Blog Recap — Day 12 (Still Not Published)

The official AAIF Seoul blog recap remains unpublished today (Day 12 post-summit; summit was Aug 13–14). This is now the longest gap between an AAIF MCP Dev Summit and its official recap in the program's history (NA Summit recap: ~48h; Seoul: 12+ days and counting).

Available third-party coverage continues to capture key themes:
- Security "high-stakes confrontation": 92% of production MCP servers lack OAuth; 21,000+ internet-exposed instances (Futurumgroup).
- "Production gap" — enterprise AI agents failing between demo and deployment (TechTimes: 81 speakers, 307 booths, 25,000+ attendees).
- AAIF now 247 total member orgs post-Seoul (confirmed from earlier reporting).

Next visibility window: **MCPCon Shanghai (11 days, Sep 6–7)**. Sessions will be recorded and available on AAIF YouTube within 2 weeks of event.

---

## MCPCon Shanghai — 11 Days Away

**AGNTCon + MCPCon China**, September 6–7, 2026, Shanghai International Convention Center. Co-located with KubeCon + CloudNativeCon China + OpenInfra Summit + PyTorch Conference China 2026. Linux Foundation published the full agenda; 40+ sessions. [[Schedule]](https://www.lfopensource.cn/mcp-dev-summit-shanghai/program/schedule/)

Sessions will be recorded and posted to the AAIF YouTube channel within 2 weeks.

**Watch for:** new MCP server announcements from APAC vendors (especially enterprise-hosted remote endpoints), governance standards updates, AAIF Seoul recap content absorbed into sessions, and any security disclosures targeting cataloged servers.

---

## SEP-2127 Server Cards — 5 Days to WG Follow-On

The SEP-2127 WG closed Aug 14. First follow-on meeting: **Aug 31 (5 days)**. Second: Sep 7.

Current spec:
- Per-server card path: `/.well-known/mcp.json` (confirmed from PR #2127 discussions).
- An alternative path `{mcp_endpoint}/server-card` (served relative to the MCP endpoint URL) is also under discussion as a belt-and-braces companion.
- Site-level catalog: `/.well-known/mcp/catalog.json`.
- Validator: [agent-ready.dev/mcp-card-validator](https://agent-ready.dev/mcp-card-validator).

[[PR #2127]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127) | [[MCP Server Card WG July 13 meeting]](https://meet.modelcontextprotocol.io/2026/07/mcp-server-card-working-group-t2UdFEqDlwwg)

**Catalog action pending:** `subregistry-audit` SEP-2127 pass (GET `/.well-known/mcp.json` on all 19 servers) remains highest-priority unblocked work. Hold until after Aug 31 WG meeting for spec stability.

---

## Ecosystem Reaction: "Is MCP Just a REST API?"

An InfoQ article this month, "MCP Goes Stateless, and Developers Ask Whether That Just Makes it an API Again," has surfaced a notable developer debate about the 2026-07-28 stateless spec. [[InfoQ]](https://www.infoq.com/news/2026/08/mcp-stateless-gateway/)

Key developer reactions:
- **Pro-stateless camp:** Stateful MCP was always wrong for web infrastructure (sticky sessions, stream management, replay complexity). The stateless transition makes MCP as easy to deploy as a REST API.
- **Skeptics:** If MCP is now stateless HTTP with JSON payloads and tool descriptions, how is it meaningfully different from a well-documented REST API? Critics cite real costs: tool discovery can consume tens of thousands of tokens per session.

**Registry perspective:** The debate misses the point from a catalog standpoint. The value of an approved catalog isn't the transport layer — it's the trust decision (which servers are vetted, versioned, and endorsed). Whether the wire format is stateful SSE or stateless HTTP is irrelevant to the `discovered != approved != enabled` boundary. If anything, stateless MCP makes our gateway projection more valuable: a standardized list of trusted endpoints that can be deployed behind any HTTP infrastructure.

---

## Catalog — No Action Required

All 19 cataloged servers remain approved/public. No endpoint changes, ownership changes, or security concerns identified today. The CVE-2026-75149 Marimo vulnerability does not affect any remote-HTTP endpoint in our catalog.

Next curate run target: **HubSpot** (`mcp.hubspot.com`, confirmed GA, OAuth 2.1 + PKCE only, no DCR). Comms & support persona group.

---

## Pending Actions (unchanged from yesterday)

1. `subregistry-curate` — HubSpot (and consider Intercom, Zapier)
2. `subregistry-audit` — SEP-2127 server card pass on all 19 servers (hold until after Aug 31 WG)
3. `subregistry-audit` — Update `verifiedAt` for `com.github/mcp` (v1.10.1) and `com.slack/mcp`
4. `subregistry-audit` — Verify TS SDK vendors ≥v1.26.0 (CVE-2026-25536) and Python SDK vendors ≥v1.28.1 (CVE-2026-59950)
5. `subregistry-deploy` — Seed 8 servers added since last VPS deploy
6. Monitor: MCPCon Shanghai (Sep 6–7); AAIF Seoul blog recap; MCPwned BH archive; SEP-2127 WG outputs; FSIG outputs
