# MCP Ecosystem Update — 2026-07-04

Daily research pass. Covers developments since the July 3 report
([2026-07-03-mcp-ecosystem-update.md](./2026-07-03-mcp-ecosystem-update.md)).
Focus: Claude Sonnet 5 released June 30 (most agentic Sonnet yet, previously uncaptured);
AWS Agent Registry namespace migration scheduled August 6; HubSpot Self-Service MCP Auth
Apps public beta details (curate-relevant); spec countdown 24 days; clean security window
extends to Day 6; AAIF events calendar confirmed.

All external claims cited with source URLs.

---

## 1. Claude Sonnet 5 — Released June 30, 2026 (Previously Uncaptured)

Anthropic shipped **Claude Sonnet 5** on June 30, 2026 — the same day as the Python SDK
v2.0.0b1 beta, which was the focus of the July 1 report. Sonnet 5 is described as the
most agentic Sonnet model yet: stronger reasoning, tool use, coding, and autonomous task
handling.

[[Introducing Claude Sonnet 5 — Anthropic]](https://www.anthropic.com/news/claude-sonnet-5)

### Key specs

| Attribute | Value |
|-----------|-------|
| Context window | 1 million tokens |
| Max output tokens | 128,000 |
| Introductory pricing (through Aug 31) | $2 / $10 per M tokens (input / output) |
| Standard pricing (post Aug 31) | $3 / $15 per M tokens |
| Availability | Free, Pro, Max, Team, Enterprise; Claude Code; Claude Platform |

### Catalog relevance

A more capable, agentic default model raises the quality bar for every server in the
catalog. Agents running on Sonnet 5 will invoke tools with less human review — the
reliability and security of cataloged endpoints matters more, not less. The curate
criteria (`approved` = human-reviewed, endpoint live, auth-gated, no active incident)
are directly validated by this trajectory.

The release also confirms the EMA (Enterprise-Managed Authorization) + Okta provisioning
noted on June 23: Sonnet 5 ships with the ability for admins to provision MCP connectors
org-wide through their identity provider, with users getting automatic access on first
login. This is live behavior, not a roadmap item.

---

## 2. AWS Agent Registry — Namespace Migration August 6, 2026

**AWS Agent Registry** remains in **public preview** as of July 4, 2026. No GA
announcement has been made.

Significant operational note: starting **August 6, 2026**, the service namespace moves
from `bedrock-agentcore` → `agent-registry`. All endpoints, IAM policies, SDK clients,
CLI scripts, and registry data must be updated before that date.

[[AWS Agent Registry — what's new / preview]](https://aws.amazon.com/about-aws/whats-new/2026/04/aws-agent-registry-in-agentcore-preview/)
[[AWS Bedrock AgentCore release notes]](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/release-notes.html)

**Watch list update:** AWS Agent Registry entering a named namespace (`agent-registry`) is
a signal of progression toward GA. Once GA is confirmed, evaluate whether a dedicated
catalog entry for the Agent Registry MCP endpoint is warranted (distinct from our existing
`com.aws/mcp` server entry, which is the unified AWS API access server that reached GA
May 6, 2026).

### Clarifying the AWS landscape (two distinct products)

| Product | Status | Our catalog |
|---------|--------|-------------|
| **AWS MCP Server** (Agent Toolkit for AWS) | **GA since May 6, 2026**; available in us-east-1 + eu-central-1; IAM-based governance; CloudWatch + CloudTrail logging | `com.aws/mcp` (approved/public) |
| **AWS Agent Registry** (Bedrock AgentCore) | **Preview** (GA pending); namespace migration Aug 6 | Watch list — not yet catalogable |

[[AWS MCP Server GA]](https://aws.amazon.com/blogs/aws/the-aws-mcp-server-is-now-generally-available/)
[[AWS MCP Server — what's new May 6]](https://aws.amazon.com/about-aws/whats-new/2026/05/aws-mcp-server/)
[[InfoQ: AWS MCP Server GA]](https://www.infoq.com/news/2026/05/aws-mcp-ga/)

---

## 3. HubSpot — Self-Service MCP Auth Apps (Public Beta Since January 13, 2026)

Our catalog's top curate priority (Next actions #2) is the HubSpot MCP server. A key
detail relevant to that curate run:

On **January 13, 2026**, HubSpot launched a **public beta for Self-Service MCP Auth Apps**,
enabling ecosystem partners and third-party developers to build and manage their own AI
connectors to the HubSpot Remote MCP Server via a self-service Developer Platform UI —
no HubSpot partnership or direct integration agreement required.

[[Public Beta: Self-Service MCP Auth Apps for the HubSpot Remote MCP Server]](https://developers.hubspot.com/changelog/public-beta-self-service-mcp-auth-apps-for-the-hubspot-remote-mcp-server)
[[HubSpot MCP Server developer docs]](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server)

### Auth requirements confirmed

- **OAuth 2.1 + PKCE** required (no Dynamic Client Registration)
- Single-use refresh token rotation
- MCP Auth Apps UI in HubSpot Developer Platform handles app registration

### Implications for curate

The "no DCR" constraint (noted in §13 Next actions) is the right flag for the catalog
auth notes field. The self-service beta means the integration workflow for operators using
our catalog to reach HubSpot is now straightforward: register an app in the Developer
Platform, use OAuth 2.1 + PKCE. The HubSpot endpoint confirmed at
`https://mcp.hubspot.com/mcp` (GA April 13, 2026) should be added in the next curate run
with these auth details.

---

## 4. Spec Countdown — 24 Days

The 2026-07-28 MCP specification final publishes in **24 days**. No new RC changes since
the May 21 lock. All key breaking changes (stateless core, no initialize handshake, no
`Mcp-Session-Id`, mandatory `Mcp-Method`/`Mcp-Name` headers) remain as documented in
prior reports.

[[2026-07-28 MCP Spec RC — MCP Blog]](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)

**SDK timeline reminder:**
- Python v2.0.0 stable: July 27 (1 day before spec)
- TypeScript v2 stable: July 28 (spec day)
- All four Tier 1 SDKs have beta builds; cataloged vendors should begin migration planning

---

## 5. Anthropic Claude Connectors Directory — 343 Verified Integrations

Anthropic maintains its own **Claude Connectors Directory** with 343 verified MCP
integrations — a figure distinct from the community directories (Glama, PulseMCP,
Smithery). This is Anthropic-vetted, not community-submitted.

[[awesome-claude-connectors — GitHub]](https://github.com/rdmgator12/awesome-claude-connectors)

**Context:** Glama indexes 50,845; PulseMCP 20,120+; Anthropic's own verified list: 343.
The trust gap between "indexed" and "verified" is now formally documented by Anthropic's
own curation filter. Our 19-server approved catalog is at the strict end of that same
spectrum.

---

## 6. AAIF Events Calendar — Full Schedule Confirmed

The complete 2026 AAIF global events program is confirmed:

| Event | Date | Location |
|-------|------|----------|
| MCP Dev Summit Seoul | Aug 13–14 | Seoul |
| MCP Dev Summit Shanghai | Sept 6–7 | Co-located with KubeCon + CloudNativeCon China |
| MCP Dev Summit Tokyo | Sept 10–11 | Tokyo |
| AGNTCon + MCPCon Europe | Sept 17–18 | Amsterdam |
| MCP Dev Summit Toronto | Oct 5–6 | Toronto |
| AGNTCon + MCPCon North America | Oct 22–23 | San Jose, CA |
| MCP Dev Summit Nairobi | Nov 19–20 | Nairobi |

[[AAIF Global 2026 Events Program — PR Newswire]](https://www.prnewswire.com/news-releases/agentic-ai-foundation-announces-global-2026-events-program-anchored-by-agntcon-mcpcon-north-america-and-europe-302732860.html)
[[AAIF Events — Linux Foundation]](https://events.linuxfoundation.org/aaif-events/)

MCPCon Shanghai schedule announcement (July 8) pending — watch.

---

## 7. Security — Clean Window Extends to Day 6

No new MCP-specific CVEs or supply-chain incidents on July 4, 2026. The SharePoint RCE
CVE-2026-45659 (added to CISA KEV with a July 4 patch deadline for U.S. agencies) is not
MCP-related.

[[CISA KEV — SharePoint CVE-2026-45659]](https://thehackernews.com/2026/07/sharepoint-rce-cve-2026-45659-added-to.html)

All 19 catalog servers remain approved/public. The clean window since July 1 is notable
given the elevated attack surface documented in prior reports (Miasma, IronWorm,
BlueRock SSRF survey).

**Pending audit:** TypeScript SDK-based vendors in the catalog should be verified at
≥1.26.0 (CVE-2026-25536 cross-client data leak + CVE-2026-0621 ReDoS). This remains
the #3b next action.

---

## 8. Registry Scale

| Directory | Count | Change vs. July 3 |
|-----------|-------|-------------------|
| Glama | **50,845 servers** (+ 7,266 connectors; 338,998 tools) | Stable (no new batch indexing) |
| PulseMCP | **20,120+** | Stable |
| MCPToplist cross-registry aggregate | **~73,547** | Stable |
| Anthropic Claude Connectors (verified) | **343** | First tracked |
| Our catalog (approved/public) | **19** | No change |

---

## Catalog Flags

| Server | Finding | Action |
|--------|---------|--------|
| `com.aws/mcp` | GA confirmed May 6, 2026; available in us-east-1 + eu-central-1 only; now part of "Agent Toolkit for AWS"; IAM + CloudWatch + CloudTrail | Update `verification.notes` in next audit pass — no approval change |
| (curate target) `com.hubspot/mcp` | Self-service Auth App beta live (Jan 13, 2026); OAuth 2.1 + PKCE, no DCR; endpoint `https://mcp.hubspot.com/mcp` GA April 13 | Add in next `subregistry-curate` run (Next actions #2) |

---

## Summary

- **Claude Sonnet 5** (released June 30, previously uncaptured) raises the agentic
  capability baseline; stronger tool use makes catalog quality matter more.
- **AWS Agent Registry** namespace migration August 6 — still preview, watch for GA.
- **HubSpot** self-service Auth App beta (Jan 13) confirms the OAuth 2.1 + no-DCR path
  for our pending curate run.
- **Spec countdown: 24 days** — no new changes.
- **Security window Day 6** — clean.
- All 19 catalog servers remain approved/public.
