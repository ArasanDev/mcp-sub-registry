# MCP Ecosystem Update — 2026-08-03

**Produced by:** MCP Sub-Registry autonomous research routine
**Covers:** 2026-08-02 EOD → 2026-08-03
**Prior report:** [2026-08-02-mcp-ecosystem-update.md](./2026-08-02-mcp-ecosystem-update.md)

---

## 1. Headline Summary

- **Snowflake Cortex AI Gateway launches at Black Hat 2026:** Snowflake announced
  Cortex AI Gateway at Black Hat USA 2026 (Aug 1–6), built on its May 2026 Natoma
  acquisition. Public preview incoming. Supports 100+ MCP servers; partners with
  1Password, Aembit, Linx Security, Okta, SailPoint, Saviynt for identity + audit.
  This is the sixth major enterprise player to independently enforce
  `discovered != approved != enabled` as a governance layer, and the most
  data-platform-centric entrant yet. Requires landscape update.
  [[Snowflake blog]](https://www.snowflake.com/en/blog/enterprise-ai-security-agentic-mcp-governance/)
  [[VentureBeat]](https://venturebeat.com/security/snowflake-launches-cortex-ai-gateway-to-control-ai-agents-and-prevent-runaway-enterprise-costs/)
  [[CryptoRank analysis: "MCP Gateways crystallizing as infrastructure"]](https://cryptorank.io/news/feed/0902a-snowflakes-cortex-ai-gateway-signals-mcp-gateways-are-crystallizing-as-infrastructure)
- **Black Hat MCPwned briefing (Aug 5–6) still forthcoming:** The main AI-security
  talk of the week has not yet delivered slides or CVEs (Briefings run Aug 5–6).
  Snowflake's Cortex AI Gateway is the primary MCP-relevant BH2026 announcement so far.
  Snowflake is reporting $1.33B quarterly product revenue context.
  [[Black Hat Briefings]](https://blackhat.com/us-26/briefings.html)
- **AWS Agent Registry namespace migration tomorrow (Aug 6):** The `bedrock-agentcore`
  namespace becomes `agent-registry`. Endpoints, IAM policies, SDK clients, and CLI
  scripts must be updated by tomorrow. Our `com.aws/mcp` (AWS MCP Server — a distinct
  GA product) is unaffected.
  [[AWS docs]](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry.html)
- **Registry scale (Aug 3):** Glama ~67,178 (up from ~66,538, +640); PulseMCP ~22,090+;
  MCPToplist cross-registry ~96,771 (Aug 2 snapshot — up from ~95,385). Trust gap:
  ~97k indexed vs. 19 approved in our catalog.
  [[Glama]](https://glama.ai/mcp/servers)
  [[PulseMCP]](https://www.pulsemcp.com/servers)
  [[MCPToplist]](https://mcptoplist.com/)
- **Security: Day 38 clean window.** No new CVEs targeting any of the 19 cataloged
  servers. Vigilance elevated for Black Hat (Aug 5–6) MCPwned slides.
- **SEP-2127 WG: 11 days to close (Aug 14).** WG meeting scheduled; confirmed path
  is `/.well-known/mcp/server-card.json`. Note: CLAUDE.md §13 recorded `/.well-known/mcp.json`
  as a prior correction — the confirmed path from the GitHub PR is
  `/.well-known/mcp/server-card.json`. See §6 for details.
  [[Server Card Charter]](https://modelcontextprotocol.io/community/working-groups/server-card)
  [[SEP-2127 PR]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)

---

## 2. Scale & Registry Landscape

| Registry | Count (Aug 3) | vs. Aug 2 | Note |
|---|---|---|---|
| Glama | ~67,178 | +640 | Crosses 67k; post-spec surge continuing |
| PulseMCP | ~22,090+ | −10 (variation) | Data variation; directionally stable |
| MCPToplist (cross-registry) | ~96,771 | (Aug 2 snapshot) | Crosses 96k |
| Anthropic Connectors (verified) | 439 | — | Stable since July 4 update |
| Our catalog | 19 | — | Approved/public |

MCPToplist has now crossed 96k across the Official MCP Registry, Glama, Smithery, mcp.so,
and PulseMCP. The trust gap stands at **~97k indexed vs. 19 approved**. This ratio (>5,000:1)
is the product's core value proposition.

---

## 3. New Landscape Entrant: Snowflake Cortex AI Gateway

Snowflake launched Cortex AI Gateway at Black Hat USA 2026, completing the integration of
its **Natoma acquisition** (intent announced May 28, 2026; 27-person team; $7M seed from
Greylock + Index Ventures; CEO Pratyus Patnaik, previously sold atSpoke to Okta).
[[Snowflake press release]](https://www.snowflake.com/en/news/press-releases/snowflake-advances-the-trusted-agentic-enterprise-era-with-unified-monitoring-and-cost-management/)
[[Forbes: Snowflake Buys Natoma]](https://www.forbes.com/sites/janakirammsv/2026/05/31/snowflake-buys-natoma-to-govern-the-agents-acting-on-its-data/)

**What Natoma (now Cortex AI Gateway) does:**
- Centralized MCP gateway: checks who requested an action, what permissions apply, whether
  it is allowed, then logs it. Enforces identity, policy, and audit at the tool-call level.
- Prebuilt library of 100+ MCP servers; governs both Snowflake-native agents (CoWork, CoCo)
  and third-party agents built on Claude Code, Cursor, etc.
- Seven identity partner integrations announced at BH: **1Password, Aembit, Linx Security,
  Okta, SailPoint, Saviynt** — broader identity ecosystem than any prior MCP governance product.
- Cost management: attributes AI token/tool costs to specific teams, agents, workloads;
  enforces spending limits before bills escalate.

**Landscape significance:**
- This is the sixth major enterprise player to independently converge on
  `discovered != approved != enabled` — joining Runlayer, Workato, Kiro, JFrog, and Docker.
- Snowflake's $1.33B+ quarterly revenue and existing enterprise data platform position
  make this the highest-leverage enterprise integration threat to pure-play MCP governance
  vendors (especially Runlayer).
- Cortex AI Gateway is a **gateway/runtime product**, not a public registry/catalog. It
  does not replace the sub-registry function; it is a customer of clean catalog data.
  Our `GET /v0.1/gateway/catalog` projection is exactly what Cortex AI Gateway would import
  to populate its approved-server list. No catalog action required.
- **Public preview** expected soon (no exact date announced).
- CryptoRank framing: "MCP Gateways Are Crystallizing as Infrastructure" — industry
  analysts now treat MCP governance as foundational, not optional.
  [[ChannelE2E]](https://www.channele2e.com/news/snowflake-unifies-ai-agent-security-governance-and-cost-controls-with-cortex-ai-gateway)

→ **Landscape update:** Added Snowflake Cortex AI Gateway to the watch list. Does not
displace existing Top-11 rankings (it is a gateway/runtime product, not a standalone registry).

---

## 4. Spec & SDK (Day 6 Post-Release)

No new spec or SDK releases since Aug 2. Rollout status is stable:
- All four Tier 1 SDK v2 releases (TS, Python, Go, C#) shipped and stable.
- CIMD adoption expanding (WorkOS, Descope, Stytch, Scalekit, Datawiza guides live);
  FastMCP CIMD support still open issue.
- 12-month deprecation window means 2025-11-25 implementations still work.
- Catalog schema: no changes needed.
[[MCP Blog]](https://blog.modelcontextprotocol.io/posts/2026-07-28/)

---

## 5. Security

### 5.1 Black Hat 2026 (active; Aug 1–6)

Slides and CVEs from the **"MCPwned"** briefing (Aug 5–6) have not yet been published.
This remains the single highest-priority watch item for a potential catalog audit trigger.

Snowflake's MCP governance announcement at Black Hat is the most substantive MCP-related
disclosure from the event so far. No new CVEs or named catalog vendors in any BH disclosure
as of Aug 3.

### 5.2 Security window

**Day 38 clean** — no new CVEs targeting any of the 19 cataloged servers.
The remote-HTTP + auth-gated catalog model continues to provide structural immunity
to STDIO/npm supply-chain worm vectors (Miasma, IronWorm, Shai-Hulud, etc.).

### 5.3 Pending audit items (unchanged)

- **CVE-2026-25536 (PRIORITY):** Verify all TypeScript SDK vendors in catalog are on
  >=v1.26.0 or migrated to v2.0.0. Affects any TS-SDK-backed catalog server.
- **CIMD compliance:** Audit OAuth-gated vendors for CIMD (DCR deprecated in new spec).
- **Server Cards:** Poll `/.well-known/mcp/server-card.json` after SEP-2127 WG closes
  (Aug 14). Note path clarification in §6.

---

## 6. SEP-2127 Server Cards — Path Clarification

The confirmed canonical path from the GitHub PR and Working Group is:

```
/.well-known/mcp/server-card.json
```

CLAUDE.md §13 (July 28 update) recorded `/.well-known/mcp.json` as a "corrected path."
This appears to be a conflation: `/.well-known/mcp.json` may refer to a catalog-discovery
file (separate from the per-server server-card), while the server card itself lives at
`/.well-known/mcp/server-card.json`. The landscape.md (line 192-193) already has the
correct path. Next audit pass should use `/.well-known/mcp/server-card.json` per the WG.

WG term officially ends Aug 14. A WG meeting is scheduled for Aug 31, 2026 — suggesting
follow-on work (implementation guidance, extensions) may continue beyond the Aug 14 term.
[[SEP-2127 PR — confirmed merged]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)
[[Agent Ready validator]](https://agent-ready.dev/how-to-publish-an-mcp-server-card)

---

## 7. HubSpot MCP — Update

HubSpot MCP server (`mcp.hubspot.com`) added a **CRM object snapshot polling endpoint**
in its latest update (July 31, 2026):
- New `snapshotStatusId` return on snapshot creation
- Polling endpoint to check processing status (processing / completed / failed)
- Extends existing read access to campaigns, landing pages, website pages, blog posts,
  and Leads (added previously)

Auth: OAuth 2.1 + PKCE only (no private-app-token path; no DCR).
Status: GA since April 2026. Still **#1 priority for next `subregistry-curate` run**.
[[HubSpot community updates]](https://community.hubspot.com/t/updates-to-hubspot-connector-for-claude-remote-mcp-server/154482)
[[HubSpot GA changelog]](https://developers.hubspot.com/changelog/remote-hubspot-mcp-server-is-now-generally-available)

---

## 8. Catalog Hooks

All 19 cataloged servers remain `approved`/`public`. No demotions, no security flags.

| Server | Status | Notes |
|---|---|---|
| com.stripe/mcp | OK | Day-zero spec adopter; stable |
| com.supabase/mcp | OK | Day-zero spec adopter; stable |
| com.atlassian/mcp | OK | Streamable HTTP; SSE dead June 30 |
| com.github/mcp | OK | Monitor CIMD compliance |
| com.aws/mcp | OK | Distinct from Agent Registry; migration Aug 6 N/A for this entry |
| All others | OK | Next audit: CVE-2026-25536 + CIMD sweep |

**Curate queue (next run):**
1. **HubSpot** (`mcp.hubspot.com`) — snapshot polling added, GA, OAuth 2.1 + PKCE,
   in Anthropic Connectors Directory. #1 priority.
2. **X/Twitter** (`api.x.com/mcp`) — auth complexity; verify gateway path before adding.

---

## 9. Near-Term Watches (Next 12 Days)

| Date | Event | Action |
|---|---|---|
| Aug 5–6 | Black Hat MCPwned briefing — slides publish | Read; run audit if catalog vendor named |
| Aug 6 | AWS Agent Registry namespace migration | `com.aws/mcp` unaffected; watch for GA |
| Aug 13–14 | AAIF MCP Dev Summit Seoul | Watch for governance/spec announcements |
| Aug 14 | SEP-2127 Server Cards WG closes | Begin `/.well-known/mcp/server-card.json` audit |
| ASAP | CVE-2026-25536 + CIMD audit | Run `subregistry-audit` pass |
| ASAP | HubSpot curate | Run `subregistry-curate` |

---

## 10. Landscape Changes Today

- **Scale numbers updated:** Glama ~67,178 (+640); MCPToplist ~96,771 (+1,386 since prior
  snapshot).
- **Snowflake Cortex AI Gateway added to watch list** in `docs/research/landscape.md`.
- No ranking changes in Top 11. Snowflake is a gateway/runtime product; it feeds off clean
  catalog data rather than replacing a curated registry.
