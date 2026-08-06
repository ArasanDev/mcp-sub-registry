# MCP Ecosystem Update — 2026-08-06

**Produced by:** MCP Sub-Registry autonomous research routine
**Covers:** 2026-08-05 EOD → 2026-08-06
**Prior report:** [2026-08-05-mcp-ecosystem-update.md](./2026-08-05-mcp-ecosystem-update.md)

---

## 1. Headline Summary

- **Black Hat USA 2026 closes today (Day 2 of Briefings, Aug 6).** "MCPwned: How Exposed AI
  Agents Became the Internet's New Recon Toy" ran both Aug 5 (Day 1) and Aug 6 (Day 2, final
  slot). Slides are NOT yet published — per Black Hat's standard practice, materials post
  on the briefings page approximately 08:00 PT the day following the last live session
  (expected Aug 7); full Streamly on-demand access opens Aug 14. No new MCP-specific
  findings surfaced during Day 2 beyond the honeypot stats previously documented. No
  cataloged servers were named in any BH2026 disclosure across the full conference.
  [[Black Hat USA 2026 Briefings]](https://blackhat.com/us-26/briefings.html)
  [[Streamly access: Aug 14–Aug 14 2027]](https://blackhat.com/us-26/)
- **AWS Agent Registry namespace migration executes TODAY (Aug 6).** The service formally
  moves from the `bedrock-agentcore` namespace to the `agent-registry` namespace. Operators
  using AWS Agent Registry must update endpoints, IAM policies, SDK clients, and CLI
  scripts. Status remains **Preview** — no GA announcement. Our `com.aws/mcp` (AWS MCP
  Server, GA product in us-east-1 + eu-central-1) is a distinct product and is
  **unaffected**.
  [[AWS docs]](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry.html)
- **Snowflake Cortex AI Gateway formally at Black Hat 2026.** Snowflake published a BH2026-
  branded blog titled "Snowflake Launches Cortex AI Gateway and Advanced AI Security at
  Black Hat 2026." The product entered **public preview imminently** (announced July 28 alongside
  the 2026-07-28 spec; promoted at BH2026). This is the sixth major enterprise player to
  independently enforce `discovered != approved != enabled`. See §3.
  [[Snowflake BH2026 blog]](https://www.snowflake.com/en/blog/enterprise-ai-security-agentic-mcp-governance/)
  [[VentureBeat]](https://venturebeat.com/security/snowflake-launches-cortex-ai-gateway-to-control-ai-agents-and-prevent-runaway-enterprise-costs/)
- **Gateways IG session #2 at 4:30pm today (Aug 6).** The MCP Working Group Gateways
  Interest Group holds its second session today. No public outputs published as of this
  report. Check `meet.modelcontextprotocol.io` for notes when they appear.
  [[MCP Events]](https://meet.modelcontextprotocol.io/)
- **Registry scale (Aug 6):** Glama **~68,650** (+986 vs Aug 5 — new batch processed);
  PulseMCP **~22,080+** (stable/slight ebb vs 22,090+); MCPToplist **~96,771** (Aug 2
  snapshot — no new reading). Trust gap: ~97k+ indexed vs. 19 approved in our catalog.
  [[Glama]](https://glama.ai/mcp/servers)
  [[PulseMCP]](https://www.pulsemcp.com/servers)
- **Security: Day 41 clean.** No new CVEs targeting any of the 19 cataloged servers. Black
  Hat USA 2026 (Aug 1–6) closed without naming any cataloged server endpoint in a live
  disclosure. Watch for post-conference CVE filings and the MCPwned slides (expected Aug 7).
- **SEP-2127 WG: 8 days to close (Aug 14).** Working group term ends August 14. Path
  confirmed: `/.well-known/mcp/server-card.json`. Once finalized, `subregistry-audit` can
  poll all 19 cataloged servers for server card compliance.
  [[SEP-2127 PR]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)
  [[Server Card Charter]](https://modelcontextprotocol.io/community/working-groups/server-card)

---

## 2. Scale & Registry Landscape

| Registry | Count (Aug 6) | vs. Aug 5 | Note |
|---|---|---|---|
| Glama | ~68,650 | +986 | New batch processed; crosses 68k milestone |
| PulseMCP | ~22,080+ | −10 | Stable / slight ebb; within daily variance |
| MCPToplist (cross-registry) | ~96,771 | — (Aug 2 snap) | No update; next reading expected soon |
| Anthropic Connectors (verified) | 439 | — | Stable |
| Our catalog | 19 | — | Approved/public |

Glama crossed 68,000 for the first time today (+986 vs Aug 5). The post-spec surge pace
continues at ~500–1,000 per day in batch mode. Cross-registry estimate now approaches 97k.
[[Glama]](https://glama.ai/mcp/servers)
[[MCPToplist]](https://mcptoplist.com/)

---

## 3. Snowflake Cortex AI Gateway — BH2026 Launch Confirmed

Snowflake used Black Hat USA 2026 as the formal launch platform for **Cortex AI Gateway**,
published with explicit BH2026 branding on their blog. Key capabilities confirmed:

- **MCP governance at the tool-call level** — centralizes access policies, authentication,
  permissions, and audit logging; governs both Snowflake-native agents and third-party agents
  on Claude Code and Cursor.
- **100+ MCP server support** — proxies/governs connections to cataloged MCP servers; built
  on Natoma acquisition (closed ~June 2026; $7M seed; CEO Pratyus Patnaik ex-atSpoke/Okta).
- **7 launch identity partners** — 1Password, Aembit, Linx Security, Okta, SailPoint,
  Saviynt.
- **Cost management** — per-team/agent/workload AI spend attribution and limits.
- **Availability** — announced alongside the 2026-07-28 spec; promoted at BH2026; entering
  **public preview** "soon" (exact date not published). Was previously described as
  "private preview."

**Catalog relevance:** Gateway/runtime product that *consumes* clean catalog data. Not a
registry or catalog of record. Sixth major enterprise player (after JFrog, Runlayer, Obot,
Palo Alto/Prisma AIRS, Workato) to independently converge on `discovered != approved != enabled`.
No catalog action. Watch list only.
[[Snowflake BH2026 blog]](https://www.snowflake.com/en/blog/enterprise-ai-security-agentic-mcp-governance/)
[[Forkast: MCP gateways crystallizing as infra]](https://forkast.news/snowflakes-cortex-ai-gateway-signals-mcp-gateways-are-crystallizing-as-infrastructure/)
[[SiliconANGLE]](https://siliconangle.com/2026/07/28/snowflake-debuts-cortex-ai-gateway-govern-monitor-enterprise-ai-agents/)

---

## 4. AWS Agent Registry — Namespace Migration Today

The `bedrock-agentcore` → `agent-registry` namespace transition for **AWS Agent Registry**
executes today (Aug 6, 2026). Key points:

- **What changes:** API endpoints, IAM policy namespaces, SDK package identifiers, CLI
  commands, and registry data all migrate to the `agent-registry` namespace. Operators of
  Agent Registry must actively update.
- **What doesn't change:** AWS Agent Registry remains in **Preview** — no GA announcement
  today. Service still in controlled preview mode.
- **Not our `com.aws/mcp`:** The AWS MCP Server (`https://mcp.amazonaws.com/mcp`) is a
  distinct GA product (live since May 6, 2026; IAM SigV4 auth via mcp-proxy-for-aws;
  us-east-1 + eu-central-1). Unaffected by the namespace migration.
- **Catalog action:** None. If/when AWS Agent Registry reaches GA, assess whether to add it
  as a sync source (it exposes an MCP endpoint).
[[AWS Agent Registry docs]](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry.html)
[[AWS What's New — April 2026 preview]](https://aws.amazon.com/about-aws/whats-new/2026/04/aws-agent-registry-in-agentcore-preview)

---

## 5. Black Hat USA 2026 — Post-Conference Assessment

Black Hat USA 2026 (Aug 1–6, Las Vegas, Mandalay Bay) has concluded. Full AI/MCP security
assessment:

- **MCPwned briefing (Team Cymru):** Ran both Aug 5 and Aug 6. Honeypot data stands as
  previously documented: 3,993 total probes in 48h from 327 IPs; 155 MCP probes; 344 AI API
  key probes. Slides expected on the Black Hat website Aug 7. Streamly on-demand access
  opens Aug 14 (through Aug 14, 2027). The talk established MCP endpoint enumeration as a
  named adversary playbook — but focused on exposed/unauthenticated endpoints, which are
  structurally absent from our remote-HTTP + auth-gated catalog.
  [[Black Hat USA 2026 briefings]](https://blackhat.com/us-26/briefings.html)
- **AI security density:** 35/121 briefings (29%) were AI-focused — highest ever at Black Hat.
  MCP tool poisoning confirmed as the consensus #1 attack vector across agent types.
- **No cataloged server named in any BH2026 disclosure.** Full conference window (Aug 1–6)
  passed without any CVE, advisory, or briefing disclosure naming any of the 19 approved
  servers in our catalog. This 41-day clean window (since June 26) now covers the entire BH
  conference. Structural immunity (remote-HTTP + auth-gating) validated in the highest-
  density AI-security event of the year.
- **Vendor launches documented (Aug 5 report):** Tanium Atlas MCP Server, Legit Security
  VibeGuard 2.0, Straiker agentic kill switch, Acalvio Deception Guardrails, Sysdig Secure
  AI — all security-tooling products, not catalogable endpoints. Snowflake Cortex AI Gateway
  (see §3) is the most significant landscape addition.
  [[Straiker BH2026 summary]](https://www.straiker.ai/blog/black-hat-usa-2026-ai-security-talks)
  [[SecurityWeek BH2026 vendor announcements]](https://www.securityweek.com/black-hat-usa-2026-summary-of-vendor-announcements-part-2/)

---

## 6. SEP-2127 (MCP Server Cards) — 8 Days to WG Close

The SEP-2127 Working Group term ends **August 14, 2026** (8 days). Status summary:

- **Path confirmed:** `/.well-known/mcp/server-card.json` (per-server) and
  `/.well-known/mcp/catalog.json` (site-level catalog discovery). Note: prior CLAUDE.md
  had noted `/.well-known/mcp.json` as the SEP-2127 path — the correct per-server card path
  is `server-card.json` within the `.well-known/mcp/` directory.
- **Client support:** Claude Desktop and Cursor already shipping MCP v2.1 with Server Card
  support (April 2026).
- **Draft status:** SEP-2127 remains Draft; may land post-RC (after the WG closes Aug 14).
  A follow-on meeting is scheduled Aug 31.
- **Validator:** live at `agent-ready.dev` — operators can check compliance now.
- **Audit hook:** once WG closes and path is finalized, `subregistry-audit` should GET
  `/.well-known/mcp/server-card.json` on each of the 19 cataloged servers and record tool
  count + protocol version in `verification.notes`.
[[SEP-2127 PR #2127]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)
[[Server Card Charter]](https://modelcontextprotocol.io/community/working-groups/server-card)
[[Agent Ready validator]](https://agent-ready.dev/)

---

## 7. Catalog Assessment — All 19 Servers Approved/Public

All 19 approved servers in `data/default-curated-servers.json` remain approved and public.
No catalog action required from today's research.

**Priority queue (unchanged):**
1. **HubSpot MCP** (`mcp.hubspot.com`) — #1 curate priority. GA April 13, 2026; OAuth 2.1 +
   PKCE (no DCR); leads record read access confirmed. Next `subregistry-curate` run.
   [[HubSpot GA changelog]](https://developers.hubspot.com/changelog/remote-hubspot-mcp-server-is-now-generally-available)
2. **X (Twitter) MCP** (`api.x.com/mcp`) — auth complexity must be verified before curating.
   Pay-per-use tiers since Feb 2026; Production env enrollment required; Enterprise-only for
   some endpoints; headless-only (no background scheduling).
3. **`subregistry-audit` pass** — verify all TypeScript SDK vendors in catalog are on
   >=v1.26.0 or SDK v2.0.0 (CVE-2026-25536 data leak; CIMD compliance for OAuth-gated
   vendors per new spec).

---

## 8. Key Dates Ahead

| Date | Event |
|---|---|
| Aug 7 | MCPwned slides expected on Black Hat website |
| Aug 14 | SEP-2127 WG closes; MCPwned Streamly on-demand access opens |
| Aug 14 | AAIF MCP Dev Summit Seoul begins (Aug 13–14) |
| Aug 31 | SEP-2127 follow-on WG meeting |
| Sep 6–7 | MCPCon Shanghai / AGNTCon China (co-located with KubeCon China) |
| Sep 17–18 | MCPCon Europe (Amsterdam) |
| Oct 22–23 | MCPCon North America (San Jose, CA) |
