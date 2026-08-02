# MCP Ecosystem Update — 2026-08-02

**Produced by:** MCP Sub-Registry autonomous research routine
**Covers:** 2026-08-01 EOD → 2026-08-02
**Prior report:** [2026-08-01-mcp-ecosystem-update.md](./2026-08-01-mcp-ecosystem-update.md)

---

## 1. Headline Summary

- **Black Hat USA 2026 MCPwned briefing is 3 days away (Aug 5–6):** The "MCPwned: How
  Exposed AI Agents Became the Internet's New Recon Toy" talk is scheduled for August 5–6
  Briefings. No findings released yet (slides published post-event). This is the single
  biggest near-term watch item — slides may surface CVEs or named vendors.
  [[Black Hat USA 2026 Briefings]](https://blackhat.com/us-26/briefings.html)
  [[Decryption Digest schedule]](https://www.decryptiondigest.com/blog/black-hat-2026-briefings-schedule-ai-security-talks)
- **AWS Agent Registry namespace migration in 4 days (Aug 6):** The `bedrock-agentcore`
  namespace moves to `agent-registry`; endpoints, IAM policies, SDK clients, and CLI
  scripts must all be updated. Our `com.aws/mcp` (AWS MCP Server, a distinct GA product)
  is unaffected by this Preview rename.
  [[AWS AgentCore docs]](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry.html)
- **Anthropic Claude Connectors Directory reaches 439 verified connectors:** Up from 343
  on July 4 — +96 verified integrations in 29 days. Independent community tracking
  (`awesome-claude-connectors`) counts 841 MCP integrations across the web directory + in-app
  catalog surfaces.
  [[AIToolsReview Aug 2026 directory]](https://aitoolsreview.co.uk/insights/claude-connectors-complete-directory)
  [[awesome-claude-connectors]](https://github.com/rdmgator12/awesome-claude-connectors)
- **Registry scale (Aug 2):** Glama ~66,538 (up from ~66,247 Aug 1, +291); PulseMCP
  22,100+ (steady); MCPToplist cross-registry ~95,385 (July 31). Trust gap: ~95k+ indexed
  vs. 19 approved in our catalog.
  [[Glama]](https://glama.ai/mcp/servers)
  [[PulseMCP]](https://www.pulsemcp.com/servers)
  [[MCPToplist]](https://mcptoplist.com/)
- **Security: Day 37 clean window.** No new CVEs targeting any of the 19 cataloged
  servers. Black Hat is ongoing but MCPwned slide content not yet public.
- **SEP-2127 Server Cards WG: 12 days to close (Aug 14).** WG term ends August 14.
  After close, `subregistry-audit` can begin polling `/.well-known/mcp.json` on all 19
  cataloged endpoints.
  [[Server Card Charter]](https://modelcontextprotocol.io/community/working-groups/server-card)
  [[SEP-2127 PR]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)

---

## 2. Scale & Registry Landscape

| Registry | Count (Aug 2) | vs. Aug 1 | Note |
|---|---|---|---|
| Glama | ~66,538 | +291 | Post-spec surge continuing |
| PulseMCP | 22,100+ | flat | Steady since July 31 |
| MCPToplist (cross-registry) | ~95,385 | (July 31 snapshot) | Deduped aggregate |
| Anthropic Connectors (verified) | 439 | +96 since July 4 | Fastest vetted-list growth yet |
| Our catalog | 19 | — | Approved/public |

The Anthropic Connectors Directory's jump from 343 to 439 verified connectors in under a
month is notable: the official vetted list is growing faster than our 19-entry catalog, but
still tiny relative to Glama's 66k+. HubSpot remains the #1 priority for our next curate
run — it is in the Anthropic Connectors Directory and confirmed GA.
[[HubSpot GA changelog]](https://developers.hubspot.com/changelog/remote-hubspot-mcp-server-is-now-generally-available)
[[HubSpot community updates]](https://community.hubspot.com/t/updates-to-hubspot-connector-for-claude-remote-mcp-server/154482)

---

## 3. Spec & SDK Post-Release Rollout (2026-07-28 — Day 5)

The 2026-07-28 spec is 5 days old. Rollout status:

- **All four Tier 1 SDKs stable:** TypeScript v2 (`@modelcontextprotocol/server` +
  `@modelcontextprotocol/client`), Python v2 (`mcp==2.0.0`), Go `v1.7.0`, C# v2.0.0.
  MCP conformance suite v0.2.0-alpha.7 released; TS v2 passes all suites except Tasks
  (moved to extension).
  [[MCP spec release blog]](https://blog.modelcontextprotocol.io/posts/2026-07-28/)
  [[SDK betas blog]](https://blog.modelcontextprotocol.io/posts/sdk-betas-2026-07-28/)
  [[TS SDK v2 docs]](https://ts.sdk.modelcontextprotocol.io/v2/)
- **Stateless core:** `Mcp-Session-Id` removed, `initialize` handshake replaced by
  `server/discover`. Servers now deploy on serverless/edge and behind standard load
  balancers. [[WorkOS MCP spec explainer]](https://workos.com/blog/mcp-2026-spec-agent-authentication)
- **CIMD replacing DCR:** Client ID Metadata Documents expanding across the ecosystem.
  WorkOS, Descope, Stytch, Scalekit, Datawiza all published CIMD implementation guides
  this week. FastMCP still has an open issue for CIMD support. Our OAuth-gated catalog
  vendors (Atlassian, GitHub, Slack, Stripe, Supabase, Sentry, Linear, Vercel) should be
  audited for CIMD compliance — flagged as PRIORITY for the next `subregistry-audit` pass.
  [[WorkOS CIMD guide]](https://workos.com/blog/client-id-metadata-documents-cimd-oauth-client-registration-mcp)
- **MCP Apps + Tasks extensions:** Formally versioned; Cloudflare Agents SDK v0.20.0
  ships day-zero support. Runlayer's existing governance controls already cover MCP Apps
  iframes from day one.
  [[Runlayer MCP Apps blog]](https://www.runlayer.com/blog/mcp-apps-highlight-the-power-of-protocol-governance)
  [[Cloudflare changelog]](https://developers.cloudflare.com/changelog/post/2026-07-27-agents-sdk-v0.20.0-mcp-sdk-v2/)
- **Deprecation window:** July 28 is a publish date, not a cutover. 12-month deprecation
  policy; 2025-11-25 implementations continue to work.
  [[Stacktree spec changes]](https://stacktr.ee/blog/mcp-2026-spec-changes)

---

## 4. Security

### 4.1 Active threat watch

No new CVEs or active incidents targeting cataloged servers as of Aug 2. Security window
(Day 37) continues clean against remote-HTTP + auth-gated catalog.

The Microsoft Security team published a comprehensive "State of MCP Security 2026" analysis
(Microsoft Community Hub) cross-referencing the OWASP MCP Top 10, NSA guidance, and
internal threat telemetry. Key findings: unauthenticated access (#1 attack class) and
confused-deputy/OAuth weaknesses (#2); 24,008 secrets exposed in MCP configs on public
GitHub; 88% of orgs report confirmed or suspected AI agent incidents. No catalog server
named. Validates our remote-HTTP + auth-gated selection criteria.
[[Microsoft Security 2026]](https://techcommunity.microsoft.com/blog/microsoft-security-blog/the-state-of-mcp-security-in-2026/4531327)

Practical DevSecOps 2026 MCP Security Statistics report: 97M+ monthly MCP downloads;
82% of servers vulnerable to path traversal; only 8.5% using OAuth; 88% of orgs reported
incidents. These are aggregate ecosystem figures — the remote-HTTP + auth-gated design
of our catalog is structurally immune to the path traversal and unauthenticated access
classes that dominate the statistics.
[[Practical DevSecOps]](https://www.practical-devsecops.com/mcp-security-statistics-2026-report/)

### 4.2 Black Hat USA 2026 watch (MCPwned — Aug 5–6)

The "MCPwned" briefing (Aug 5–6) has not yet delivered its findings as of Aug 2. The
abstract describes: AI honeypot capturing 155 MCP probes in 48h from 327 unique IPs
alongside LiteLLM abuse + credential scanning; framing exposed MCP endpoints as a named
reconnaissance attack class. Bedrock Data is also presenting at an IANS MCP Intelligence
session at Black Hat.
[[Black Hat Briefings]](https://blackhat.com/us-26/briefings.html)
[[Bedrock Data at Black Hat]](https://www.businesswire.com/news/home/20260721913566/en/Bedrock-Data-to-Demonstrate-AI-Agent-and-Data-Security-at-Black-Hat-USA-2026-Including-Featured-IANS-Session-on-MCP-Intelligence)

**Action:** Re-run research pass on Aug 6–7 once slides are published, or immediately if
a cataloged vendor is named in Black Hat CVE disclosures.

### 4.3 Pending audit items (carried from prior reports)

- **CVE-2026-25536 audit (PRIORITY):** Verify all TypeScript SDK vendors in catalog are
  on >=v1.26.0 or migrated to v2.0.0. Affects: any TS-SDK-backed catalog server.
- **CIMD compliance:** Audit OAuth-gated vendors for CIMD (DCR deprecated in new spec).
- **Server Cards (`/.well-known/mcp.json`):** Poll after SEP-2127 WG closes (Aug 14).

---

## 5. Enterprise & Landscape Signals

- **Anthropic + Runlayer on MCP Tunnels:** Runlayer published a blog detailing how Runlayer
  supports MCP Tunnels (Cloudflare-backed, inbound-port-free private connectivity). Still
  research preview, no SLA. Not a catalog schema change.
  [[Runlayer MCP Tunnels blog]](https://www.runlayer.com/blog/anthropic-mcp-tunnels)
- **MCP adoption quantified:** AAIF published enterprise maturity data — 78% of enterprise
  AI teams have MCP-backed agents in production; 97M monthly SDK downloads (March 2026).
  Runlayer joined AAIF as a founding member alongside Anthropic, OpenAI, Google.
  [[AAIF "MCP Is Growing Up"]](https://aaif.io/blog/mcp-is-growing-up/)
- **AWS Agent Registry:** Namespace migration to `agent-registry` on August 6; still
  Preview. Once GA, worth assessing as a potential sync source for enterprise catalog entries.
  [[AWS Agent Registry InfoQ]](https://www.infoq.com/news/2026/04/aws-agent-registry-preview/)
- **MCP server count growth analysis (TrueFoundry blog):** Comprehensive 2026 registry
  comparison published, useful for landscape positioning.
  [[TrueFoundry MCP registries]](https://www.truefoundry.com/blog/best-mcp-registries)

---

## 6. Catalog Hooks

All 19 cataloged servers remain `approved`/`public`. No demotions or security flags today.

| Server | Status | Notes |
|---|---|---|
| com.atlassian/mcp | OK | SSE dead June 30; catalog on Streamable HTTP — confirmed |
| com.stripe/mcp | OK | Named in official spec launch day-zero support list |
| com.supabase/mcp | OK | Named in official spec launch day-zero support list |
| com.github/mcp | OK | Monitor for CIMD compliance |
| com.slack/mcp | OK | EMA (SEP-990) Slack support coming |
| com.aws/mcp | OK | Distinct from Agent Registry Preview; namespace migration N/A |
| All others | OK | See next audit pass for CVE-2026-25536 + CIMD |

**Curate queue (next run):**
1. **HubSpot** (`mcp.hubspot.com`): confirmed GA, OAuth 2.1 + PKCE only, 439-connector
   Anthropic directory listing confirmed, Leads read access added. #1 priority.
2. **X/Twitter MCP** (`api.x.com/mcp`): verify gateway-compatible auth path (pay-per-use
   API tiers; headless-only; some endpoints Enterprise-only). Downgraded from #2 to
   "verify-first."

---

## 7. Near-Term Watches (Next 14 Days)

| Date | Event | Action |
|---|---|---|
| Aug 5–6 | Black Hat MCPwned briefing | Read slides; run audit if catalog vendor named |
| Aug 6 | AWS Agent Registry namespace migration | `com.aws/mcp` unaffected; watch for GA |
| Aug 14 | SEP-2127 Server Cards WG closes | Begin `/.well-known/mcp.json` audit pass |
| Ongoing | CIMD adoption wave | Schedule CIMD + CVE-2026-25536 audit pass |
| Ongoing | HubSpot curate | Run `subregistry-curate` for HubSpot |

---

## 8. No Landscape Changes Today

Scale numbers above are incremental. No new entrants, no ranking shifts, no player exits.
`docs/research/landscape.md` scale row updated for Glama/Anthropic Connectors; no ranking
changes warranted.
