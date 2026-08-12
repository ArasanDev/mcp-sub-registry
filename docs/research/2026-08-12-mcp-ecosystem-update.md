# MCP Ecosystem Update — 2026-08-12

**Produced by:** MCP Sub-Registry autonomous research routine
**Covers:** 2026-08-11 EOD → 2026-08-12
**Prior report:** [2026-08-11-mcp-ecosystem-update.md](./2026-08-11-mcp-ecosystem-update.md)

---

## 1. Headline Summary

- **Glama: ~70,857 servers (+641 vs. Aug 11).** Page title confirms the count; net growth
  rate holding at ~400–650/day post-spec surge. Connectors now at ~11,497; tools at ~540,510+
  (Aug 9 measurement; likely higher today).
  [[Glama]](https://glama.ai/mcp/servers)
- **MCPToplist: 100,958 cross-registry (Aug 10 snapshot; no new snapshot as of Aug 12).**
  The 100k milestone stands. No new component-registry additions confirmed this pass.
  [[MCPToplist]](https://mcptoplist.com/)
- **PulseMCP: ~22,070+ (flat).** No material change vs. prior days.
  [[PulseMCP]](https://www.pulsemcp.com/servers)
- **HubSpot MCP — new August 2026 capabilities confirmed (curate priority #1 remains).**
  At least three new capability areas added to the remote HubSpot MCP server / Claude connector
  in August: Leads record read, Conversations data (read-only), and Help Desk reply ratings.
  These are additive to the previously confirmed August expansion (landing pages, content
  analytics, marketing email tools, quotes/revenue beta, conditional rules, verified domain
  controls, partner client read). Details in §3.
  [[HubSpot changelog]](https://developers.hubspot.com/changelog)
  [[HubSpot community thread]](https://community.hubspot.com/t/updates-to-hubspot-connector-for-claude-remote-mcp-server/154482)
- **GitHub Enterprise MCP Allowlists — GA August 6, 2026.** Enterprise owners can now
  centrally approve or deny specific MCP servers for GitHub Copilot clients via
  `allowedMcpServers` / `deniedMcpServers` keys in managed-settings.json. Enforced on
  Copilot app, Copilot CLI, and VS Code. Broken configs fail closed. Details in §4.
  [[GitHub Changelog]](https://github.blog/changelog/2026-08-06-mcp-allowlists-in-enterprise-managed-settings/)
- **GitHub MCP Server v1.9.0 released August 10, 2026.** Semantic search, label ordering,
  PR improvements, duplicate detection tool (behind flag). Details in §4.
  [[Releases]](https://github.com/github/github-mcp-server/releases)
- **Nutanix MCP Server for NCP announced August 10, 2026.** Open-source MCP server for
  Nutanix Cloud Platform, using Prism v4 API; supports Claude Code, GitHub Copilot, Cursor.
  New enterprise infrastructure entrant; not a developer-tools catalog candidate. Details in §5.
  [[GlobeNewswire]](https://www.globenewswire.com/news-release/2026/08/10/3341875/0/en/nutanix-puts-agentic-ai-into-action-for-enterprises.html)
- **Slack MCP and Skills Plugin for Claude Code and Cursor — August 2026.** New plugin
  announced bringing Slack MCP Server access + guided skills to Claude Code and Cursor.
  Slack CLI 4.6.0 released with new manifest diff and block preview commands. Details in §6.
  [[Slack Developer Changelog]](https://docs.slack.dev/changelog/)
- **MCPwned slides: still not published.** Streamly on-demand opens Aug 14 for registered
  attendees; BH archive expected ~Aug 19–20 for the public. No cataloged server named.
- **SEP-2127 WG closes tomorrow (Aug 14).** Audit trigger confirmed: GET
  `/.well-known/mcp.json` on all 19 cataloged servers once WG closes.
- **AAIF Seoul Summit starts tomorrow (Aug 13–14).** No outputs yet as of Aug 12. Blog
  expected ~Aug 15+. Speakers confirmed from Workato, Google MCP Platform team, and AWS.
- **Security: Day 47 clean.** No new CVEs against any cataloged server.

---

## 2. Scale & Registry Landscape

| Registry | Count (Aug 12) | vs. Aug 11 | Note |
|---|---|---|---|
| Glama | ~70,857 | +641 | Page-title source; connectors ~11,497; tools ~540,510+ (Aug 9 measurement) |
| PulseMCP | ~22,070+ | flat | Stable across Aug 10–12 |
| MCPToplist (cross-registry) | 100,958 | (Aug 10 snap) | No new snapshot; 100k milestone holds |
| Smithery | ~7,300 | — | No August update found; infra rebuild ongoing |
| Anthropic Connectors (vetted web dir.) | 439 | — | Stable |
| Our catalog | 19 | — | All approved/public |

**Glama tool count milestone:** ~540,510 tools indexed as of Aug 9. This is the first time
the tool count has been noted at this scale, reflecting both server growth and average tool
count increases post-spec (more tools per server as vendors add spec-compliant tool schemas).

**Smithery:** No August 2026 update found. Infrastructure rebuild from the March free-tier
cutoff is ongoing. Count remains at approximately 7,300 — growth stagnant relative to
Glama (+641/day) and PulseMCP.

---

## 3. HubSpot MCP — August 2026 Capability Expansion

**Priority #1 curate target. Status: ready for `subregistry-curate` run.**

Three new capability areas confirmed added to the remote HubSpot MCP server and Claude
connector in August 2026, building on the prior capability expansion documented in §13:

### 3a. Leads Record Read Access (NEW — August 2026)
Allows AI agents to query leads to surface active prospects, lead status, and where contacts
or companies stand in their sales journey. This fills a key gap for CRM-focused workflows —
previously Leads were accessible only via the contacts object without intent/stage context.

### 3b. Conversations Data Support (NEW — August 2026)
Read-only access to conversation data across: **live chat, email, WhatsApp, SMS, Messenger**.
For Claude-based CRM workflows, this enables churn signal detection, support trend summarization,
and account health flagging from conversation history, without leaving the MCP session.

### 3c. Help Desk Reply Ratings (NEW — August 2026)
When a support rep rates a Customer Agent response in Help Desk, that rating surfaces as a
coaching opportunity. Admins can update guidelines or point to better knowledge sources.
Primarily a feedback loop improvement; less core to typical curate criteria but reflects
breadth of HubSpot's MCP surface area.

**Full August 2026 capability set (cumulative):**
- Leads record read access (new Aug)
- Conversations data / multi-channel (new Aug)
- Help Desk reply ratings (new Aug)
- Conditional field logic and custom pipeline stage validations (previously confirmed)
- Landing pages + content analytics
- Marketing email tools
- Quotes/revenue (beta)
- Verified domain controls
- Partner client read

**Catalog relevance:** Endpoint `mcp.hubspot.com`; GA since April 13, 2026; OAuth 2.1 +
PKCE only (no DCR; HubSpot requires pre-registered `client_id`). No-DCR policy must be
noted in the catalog entry's `auth.notes` field. Remains `#1` next curate target.

[[HubSpot developer changelog]](https://developers.hubspot.com/changelog)
[[HubSpot community thread]](https://community.hubspot.com/t/updates-to-hubspot-connector-for-claude-remote-mcp-server/154482)
[[HubSpot MCP integration docs]](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server)
[[HubSpot Remote MCP GA]](https://developers.hubspot.com/changelog/remote-hubspot-mcp-server-is-now-generally-available)

---

## 4. GitHub MCP — Two Significant August 2026 Updates

### 4a. Enterprise MCP Allowlists — GA August 6, 2026 (MAJOR)

GitHub announced general availability of enterprise MCP allowlists via managed settings on
**August 6, 2026**.

**Mechanism:**
- Enterprise owners add `allowedMcpServers` and `deniedMcpServers` keys to
  `copilot/managed-settings.json` in the enterprise's managed settings repository.
- Each key is a list of matchers identifying MCP servers by:
  - `serverUrl` — matches remote servers (wildcard support)
  - `serverCommand` — matches local servers by exact command and arguments
  - `serverName` — matches user-assigned labels (convenience, not a security control)
- Currently enforced on: **GitHub Copilot app, Copilot CLI, and VS Code**.

**Security design — fail closed:**
- A configuration that cannot be verified is **blocked, not permitted**. This explicit
  fail-closed posture is significant: it means a mis-configured or unrecognized MCP server
  is denied by default, rather than silently allowed through.

**Sub-registry relevance:** This is the second major IDE/platform to ship a registry-enforced
MCP allowlist (after Kiro IDE in March 2026 and Obot's IT-admin catalog verification feature).
It validates the sub-registry as a natural allowlist source-of-truth: enterprise operators
who want to configure GitHub's `allowedMcpServers` need a curated, versioned list of approved
endpoint URLs — exactly what our `GET /v0.1/gateway/catalog` projection provides.

[[GitHub Changelog — MCP allowlists in enterprise managed settings]](https://github.blog/changelog/2026-08-06-mcp-allowlists-in-enterprise-managed-settings/)
[[GitHub Docs — MCP allowlist enforcement]](https://docs.github.com/en/copilot/reference/mcp-allowlist-enforcement)
[[ai.wain.blog — Broken configs fail closed]](https://ai.wain.blog/en/github-copilot-mcp-allowlists-EKLlWvgE/)
[[Digital Applied coverage]](https://www.digitalapplied.com/blog/github-mcp-allowlists-copilot-roi-agent-governance)

### 4b. GitHub MCP Server v1.9.0 — August 10, 2026

Released August 10, 2026 (13:10 UTC). Key changes relevant to catalog users:

- **Semantic search_issues by default** — more relevant results without explicit `semantic:true`
- **Label results ordered by issue count (desc)** — better signal on active labels
- **Pull requests: return closing PRs from `issue_read`** — better cross-reference traversal
- **Issue type removal support** — new API surface
- **Optional `find_duplicate` tool** (behind `duplicate_detection` flag) — AI-driven dedup
- **Singular Project Issue Field updates** — granular field writes
- **`create_or_update_file` content documented as plain text** (not base64) — docs clarification

Our catalog entry `com.github/mcp` is the official GitHub remote MCP server. This release
does not affect endpoint URL or auth model; `verifiedAt` should be updated in the next
`subregistry-audit` pass.

[[GitHub MCP Server releases]](https://github.com/github/github-mcp-server/releases)
[[GitHub MCP Server repo]](https://github.com/github/github-mcp-server)

---

## 5. Nutanix MCP Server for NCP — August 10, 2026 (New Enterprise Entrant)

On **August 10, 2026**, Nutanix announced the **MCP Server for Nutanix Cloud Platform (NCP)**.

**What it does:**
- Open-source implementation of the MCP specification
- Acts as a secure passthrough between AI assistants and the Nutanix Prism v4 API
- Enables AI agents to translate plain-English requests into precise infrastructure API actions
- Targets: daily hybrid cloud operations automation (provisioning, config, visibility)
- AI client support: **GitHub Copilot, Claude Code, Cursor**
- Available at: `developers.nutanix.com`

**Catalog impact:** Not a developer-tools catalog candidate. Nutanix NCP is an
enterprise infrastructure product with per-environment deployment; no single universal
endpoint. The pattern (infrastructure management via MCP + Prism API) joins the growing
class of vendor-specific infrastructure MCP servers (AWS, Azure, Google Cloud, Dataverse).

**Landscape relevance:** Seventh major enterprise infrastructure vendor to ship an official
MCP server following AWS, Azure, Google Cloud, Snowflake, Salesforce, and Microsoft Dataverse.
The pattern of wrapping proprietary management APIs (Prism v4 in this case) as MCP endpoints
is now well-established across the cloud/infra sector.

[[GlobeNewswire]](https://www.globenewswire.com/news-release/2026/08/10/3341875/0/en/nutanix-puts-agentic-ai-into-action-for-enterprises.html)
[[The Manila Times]](https://www.manilatimes.net/2026/08/10/tmt-newswire/globenewswire/nutanix-puts-agentic-ai-into-action-for-enterprises/2402125)
[[SDxCentral]](https://www.sdxcentral.com/news/nutanix-cloud-platform-gains-mcp-server-ai-updates/)
[[Efficiently Connected]](https://www.efficientlyconnected.com/nutanix-mcp-server-agentic-ai-hybrid-cloud/)
[[Blocks and Files]](https://www.blocksandfiles.com/hci/2026/08/10/nutanix-adding-ai-agent-access-bridge-to-its-cloud-platform/5285493)

---

## 6. Slack MCP and Skills Plugin — August 2026

Slack Developer announced a new **Slack MCP and Skills Plugin** for Claude Code and Cursor.
Exact announcement date is within August 2026 (prior to Aug 12).

**What the plugin provides:**
- Direct Slack MCP Server access from within Claude Code and Cursor sessions
- Guided skills for Slack platform development: Block Kit, app scaffolding, Web API calls,
  Slack CLI, messaging, search
- Bridges the gap between the generic Slack MCP server (search, send, manage canvases) and
  developer-workflow-specific tooling (app scaffolding, CLI, Slack API guidance)

**Slack CLI 4.6.0** (released August 2026):
- `slack manifest diff` — prints differences between the project manifest and live app settings
- `slack blocks preview` — opens Block Kit blocks in the Block Kit Builder for visual inspection

**Ashby + Slack MCP integration** (August 2026):
- Ashby's Slack integration now supports Ashby MCP for organizations that have MCP enabled
- Slackbot connects to Ashby conversationally for direct action-taking without leaving Slack

**Catalog impact:** `com.slack/mcp` is already in our catalog. The Skills Plugin is a client-side
developer experience improvement and does not affect the endpoint URL or auth model. The `verifiedAt`
date should be updated in the next audit pass.

[[Slack Developer Changelog]](https://docs.slack.dev/changelog/)
[[Ashby + Slack MCP]](https://www.ashbyhq.com/product-updates/slack-ashby-mcp)

---

## 7. Docker MCP Catalog — August 2026 Context

No MCP-specific Docker releases confirmed with exact August dates this pass. However, Docker
published three blog posts in early August with governance and security relevance:

- **Aug 5, 2026** — "Governance Is a Developer Experience Problem" by Karan Verma — frames
  MCP server governance as a developer UX challenge, not just a security one. Aligns with
  the Custom Catalogs and Profiles feature (GA May 15, 2026).
- **Aug 4, 2026** — "The Software Supply Chain Is Under Siege. Devs Are Still the First Line
  of Defense" by Mark Lechner — supply-chain framing directly relevant to MCP server trust.
- **Aug 3, 2026** — "Empty sandboxes break developer experience" by Oleg Šelajev — developer
  ergonomics in sandboxed / containerized MCP execution.
- **Jul 30, 2026** — Docker joining NVIDIA's Open Secure AI Alliance — ecosystem positioning.

Additionally, secondary sources (Releasebot, blocked in this environment) reported two
Docker August bugfixes/features of note:
- Factory reset now correctly clears MCP Toolkit profiles, catalogs, and authorizations
  (prior bug: reset did not clear MCP state).
- "Custom rules" tab added to Gordon AI assistant's permissions dialog, allowing allow/deny
  rules for specific commands or MCP tools — mirrors the `allowedMcpServers` / `deniedMcpServers`
  pattern GitHub shipped for Copilot (§4a), now implemented in Docker's Gordon AI agent.

[[Docker blog]](https://www.docker.com/blog/)
[[Docker MCP Catalog docs]](https://docs.docker.com/ai/mcp-catalog-and-toolkit/catalog/)

---

## 8. Team Cymru Pure Signal MCP Server — Backfill (Launched April 29, 2026)

A reference to **Team Cymru's Pure Signal MCP Server** appeared in search results linked
from their Black Hat USA 2026 event page, clarifying a missing item from prior research.

**Launch date: April 29, 2026** (not August; surfacing now for catalog consideration).

**What it is:** The first purpose-built, production-grade MCP server for threat intelligence,
connecting MCP-compatible AI agents directly to Team Cymru's Pure Signal platform — described
as "the world's largest threat intelligence data ocean." Compatible with Claude, Microsoft
Security Copilot, Copilot Studio, GitHub Copilot, and custom agents.

**Catalog consideration:** Security persona product (not developer-tools persona); likely
requires a Pure Signal subscription (paid threat intelligence platform). Not a universal
public endpoint. Should be tracked on the **security-persona watch list** alongside Tanium
Atlas MCP and Straiker for the §12.5 persona-based catalog bundles roadmap. No current
curate action.

[[BusinessWire — Team Cymru Pure Signal MCP Server]](https://www.businesswire.com/news/home/20260429970778/en/Team-Cymru-Launches-Pure-Signal-MCP-Server-Bringing-Agentic-AI-to-the-Worlds-Largest-Threat-Intelligence-Data-Ocean)
[[Help Net Security]](https://www.helpnetsecurity.com/2026/04/29/team-cymru-pure-signal-mcp-server/)
[[Security Brief (Australia)]](https://securitybrief.com.au/story/team-cymru-launches-mcp-server-for-threat-intelligence)

---

## 9. Upcoming Events / Deadlines

| Date | Event | Relevance |
|---|---|---|
| **Aug 13–14** | AAIF MCP Dev Summit Seoul + Open Source Summit Korea | No outputs yet as of Aug 12; blog expected ~Aug 15+; speakers from Workato, Google MCP Platform team, AWS |
| **Aug 14** | SEP-2127 WG formal term closes | **Activate server card audit pass** — GET `/.well-known/mcp.json` on all 19 cataloged servers |
| **Aug 14** | Streamly on-demand for Black Hat USA 2026 | MCPwned slides accessible to registered attendees |
| **~Aug 19–20** | BH USA 2026 slide archive expected public | MCPwned deck publicly accessible |
| **Aug 31** | SEP-2127 WG follow-on meeting (post-term) | Continued path/format resolution |
| **Sept 6–7** | AGNTCon + MCPCon Shanghai (KubeCon China) | 40+ sessions, 1,500+ attendees |
| **Oct 22–23** | AGNTCon + MCPCon North America, San Jose | Flagship AAIF North America event |

---

## 10. Security

### 10a. Day 47 clean

No new CVEs or security incidents targeting any of the 19 cataloged remote-HTTP servers
surfaced this pass. All 19 catalog entries remain approved/public.

### 10b. CVE-2026-55604/55605 (still unconfirmed)

NVD pages confirmed to exist from prior pass. No secondary source links either CVE to a
remote-HTTP MCP endpoint or cataloged vendor. NVD access still blocked in this environment.
Will attempt resolution in next `subregistry-audit` pass.
[[NVD CVE-2026-55604]](https://nvd.nist.gov/vuln/detail/CVE-2026-55604)
[[NVD CVE-2026-55605]](https://nvd.nist.gov/vuln/detail/CVE-2026-55605)

### 10c. GitHub Enterprise allowlists — security design note

The fail-closed design of GitHub's enterprise MCP allowlists (§4a) is the third instance
of IDE/platform MCP enforcement explicitly choosing "block on unrecognized" over "allow on
unrecognized" (after Kiro IDE and Obot). This is the correct default and is becoming the
industry norm. Catalog curators should note: our endpoint URLs in `remotes[].url` are the
identifiers enterprise operators will use to populate `allowedMcpServers` lists; keeping
these stable and versioned is a direct product value.

---

## 11. Catalog Hooks

**No catalog changes this pass.** All 19 approved/public servers remain in good standing.
No cataloged server was named in any new security incident.

**Pending curate action (#1 priority):** HubSpot MCP (`mcp.hubspot.com`). GA April 13;
OAuth 2.1 + PKCE only (no DCR — note in `auth.notes`); August 2026 capability expansion
now includes Leads record read + Conversations + Help Desk ratings on top of the prior
confirmed set. Ready for next `subregistry-curate` run.

**GitHub catalog entry (`com.github/mcp`):** v1.9.0 released Aug 10. No endpoint or auth
change; update `verifiedAt` in next audit pass.

**Slack catalog entry (`com.slack/mcp`):** Skills Plugin announced; no endpoint or auth change.
Update `verifiedAt` in next audit pass.

**Nutanix MCP Server:** Per-environment deployment, no universal endpoint — not catalogable.
Add to landscape watch list under infrastructure-management persona.

**Team Cymru Pure Signal MCP Server:** Subscription-gated security-intelligence product.
Not a developer-tools catalog candidate. Add to security-persona watch list for §12.5
persona-bundle roadmap.

**Pending audit actions (unchanged from prior pass):**
- **Aug 14+ (tomorrow):** Activate server card audit — GET `/.well-known/mcp.json` on all
  19 cataloged servers; record tool count + protocol version in `verification.notes`.
- Verify CVE-2026-55604/55605 don't affect any cataloged endpoint (requires NVD access).
- Verify all TypeScript-SDK-based vendors on SDK ≥1.26.0 or v2.0.0 (CVE-2026-25536 gate).
- Verify CIMD compliance for OAuth-gated vendors (DCR deprecated in 2026-07-28 spec).
- Update `verifiedAt` for `com.github/mcp` (v1.9.0 released Aug 10) and `com.slack/mcp`
  (Skills Plugin Aug 2026) in next audit pass.

---

## 12. Sources

| # | Source | URL |
|---|---|---|
| 1 | Glama MCP Registry | https://glama.ai/mcp/servers |
| 2 | PulseMCP Server Directory | https://www.pulsemcp.com/servers |
| 3 | MCPToplist cross-registry | https://mcptoplist.com/ |
| 4 | HubSpot developer changelog | https://developers.hubspot.com/changelog |
| 5 | HubSpot community — connector updates thread | https://community.hubspot.com/t/updates-to-hubspot-connector-for-claude-remote-mcp-server/154482 |
| 6 | HubSpot remote MCP GA changelog | https://developers.hubspot.com/changelog/remote-hubspot-mcp-server-is-now-generally-available |
| 7 | HubSpot MCP integration docs | https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server |
| 8 | GitHub Changelog — MCP allowlists GA (Aug 6) | https://github.blog/changelog/2026-08-06-mcp-allowlists-in-enterprise-managed-settings/ |
| 9 | GitHub Docs — MCP allowlist enforcement | https://docs.github.com/en/copilot/reference/mcp-allowlist-enforcement |
| 10 | ai.wain.blog — GitHub allowlists fail-closed analysis | https://ai.wain.blog/en/github-copilot-mcp-allowlists-EKLlWvgE/ |
| 11 | Digital Applied — GitHub MCP allowlists + ROI tab | https://www.digitalapplied.com/blog/github-mcp-allowlists-copilot-roi-agent-governance |
| 12 | GitHub MCP Server releases | https://github.com/github/github-mcp-server/releases |
| 13 | GlobeNewswire — Nutanix MCP Server for NCP (Aug 10) | https://www.globenewswire.com/news-release/2026/08/10/3341875/0/en/nutanix-puts-agentic-ai-into-action-for-enterprises.html |
| 14 | SDxCentral — Nutanix MCP coverage | https://www.sdxcentral.com/news/nutanix-cloud-platform-gains-mcp-server-ai-updates/ |
| 15 | Efficiently Connected — Nutanix MCP | https://www.efficientlyconnected.com/nutanix-mcp-server-agentic-ai-hybrid-cloud/ |
| 16 | Blocks and Files — Nutanix MCP coverage | https://www.blocksandfiles.com/hci/2026/08/10/nutanix-adding-ai-agent-access-bridge-to-its-cloud-platform/5285493 |
| 17 | Slack Developer Changelog | https://docs.slack.dev/changelog/ |
| 18 | Ashby — Slack MCP integration | https://www.ashbyhq.com/product-updates/slack-ashby-mcp |
| 19 | Docker blog | https://www.docker.com/blog/ |
| 20 | Docker MCP Catalog docs | https://docs.docker.com/ai/mcp-catalog-and-toolkit/catalog/ |
| 21 | BusinessWire — Team Cymru Pure Signal MCP (Apr 29) | https://www.businesswire.com/news/home/20260429970778/en/Team-Cymru-Launches-Pure-Signal-MCP-Server-Bringing-Agentic-AI-to-the-Worlds-Largest-Threat-Intelligence-Data-Ocean |
| 22 | Help Net Security — Team Cymru Pure Signal MCP | https://www.helpnetsecurity.com/2026/04/29/team-cymru-pure-signal-mcp-server/ |
| 23 | Security Brief AU — Team Cymru MCP | https://securitybrief.com.au/story/team-cymru-launches-mcp-server-for-threat-intelligence |
| 24 | NVD CVE-2026-55604 | https://nvd.nist.gov/vuln/detail/CVE-2026-55604 |
| 25 | NVD CVE-2026-55605 | https://nvd.nist.gov/vuln/detail/CVE-2026-55605 |
| 26 | MCP Dev Summit Seoul | https://events.linuxfoundation.org/mcp-dev-summit-seoul/ |
| 27 | SEP-2127 PR | https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127 |
| 28 | Docker blog — Custom MCP Catalogs and Profiles (May 15) | https://www.docker.com/blog/create-custom-mcp-catalogs-and-profiles/ |
