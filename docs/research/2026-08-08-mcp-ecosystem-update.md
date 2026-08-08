# MCP Ecosystem Update — 2026-08-08

**Produced by:** MCP Sub-Registry autonomous research routine
**Covers:** 2026-08-07 EOD → 2026-08-08
**Prior report:** [2026-08-07-mcp-ecosystem-update.md](./2026-08-07-mcp-ecosystem-update.md)

---

## 1. Headline Summary

- **MCPwned slides: still not confirmed published.** Black Hat USA 2026 closed Aug 6.
  Per BH policy, slides post by 6:00 PM Pacific the day after each live briefing. As of
  today's research pass, no confirmed public URL for the MCPwned deck (Team Cymru) was
  found on the Black Hat briefings page. Materials are expected at
  [[Black Hat USA 2026 Briefings]](https://blackhat.com/us-26/briefings.html); check
  under the MCPwned session title for a "Presentation Material" link. Streamly on-demand
  access opens **Aug 14** — same day as the SEP-2127 WG close.
  [[Team Cymru BH2026]](https://event.team-cymru.com/black-hat-usa-2026)
- **Glama crosses 69k.** Confirmed at **69,395** in the search index (up from
  ~68,650–69,280 in the Aug 6–7 window; +115–745). Post-spec growth at ~500–1,000/day
  batch pace continues.
  [[Glama]](https://glama.ai/mcp/servers)
- **HubSpot MCP: August 2026 capability expansion confirmed.** New features shipped in
  August: leads record read + Partner Client read, landing page creation + content
  analytics, campaign management, marketing email tools, quotes/revenue objects (beta),
  conversations data, conditional rules, verified domain controls. Confirms HubSpot as
  the **#1 next curate priority.** [[HubSpot changelog]](https://developers.hubspot.com/changelog/remote-hubspot-mcp-server-is-now-generally-available)
- **SEP-2127 WG closes in 6 days (Aug 14)** — co-terminates with AAIF Seoul summit.
  Path confirmed: `/.well-known/mcp.json`. Production implementation guides now live on
  turva.dev and ekamoira.com; validator at agent-ready.dev. Once the WG closes, extend
  `subregistry-audit` to poll the 19 cataloged servers for server card compliance.
- **AAIF Seoul summit (Aug 13–14)** is 5 days away. Co-located with Open Source Summit
  Korea. Speakers include Workato, Google, and AWS representatives. Likely to produce
  new governance signal — monitor for post-summit blog.
- **IETF MCP standardization accelerating.** 15+ active Internet-Drafts referencing
  MCP. IETF 126 (Vienna, July 18–24, 2026) held **three BoF sessions on AI agent
  protocols** — no WG chartered yet, but the path is open. Multi-year RFC track.
  [[ChatForest IETF analysis]](https://chatforest.com/guides/mcp-ietf-standardization/)
- **Security: Day 43 clean.** No new CVEs confirmed against any of the 19 cataloged
  servers. New CVE IDs surfaced in today's search pass (CVE-2026-55604, 55605, 58446,
  39313) but NVD details were not retrievable; no evidence they target any cataloged
  remote-HTTP endpoint.
- **Registry scale (Aug 8):** Glama **69,395**; PulseMCP **~22,080+** (stable);
  MCPToplist **~96,771** (Aug 2 snap — no new reading). Trust gap: ~97k+ indexed vs. 19 approved.

---

## 2. Scale & Registry Landscape

| Registry | Count (Aug 8) | vs. Aug 7 | Note |
|---|---|---|---|
| Glama | **69,395** | +115 to +745 | Crosses 69k milestone; search index confirmed |
| PulseMCP | ~22,080+ | flat | Stable; main page title confirmed |
| MCPToplist (cross-registry) | ~96,771 | — (Aug 2 snap) | No new reading |
| Anthropic Connectors (vetted web dir.) | 439 | — | Stable |
| Anthropic Connectors (all surfaces) | 950+ | — | Per claude.com July 28 blog |
| Our catalog | 19 | — | All approved/public; no changes this pass |

Glama has now confirmed the 69k milestone. Based on the search index title
"Open-Source MCP Servers – 69,395 in the Glama Registry", the count is 69,395.
[[Glama]](https://glama.ai/mcp/servers)

PulseMCP is holding steady at ~22,080+ per the main directory page.
[[PulseMCP]](https://www.pulsemcp.com/servers)

---

## 3. MCPwned Slides Update

The MCPwned briefing ("MCPwned: How Exposed AI Agents Became the Internet's New Recon
Toy", Team Cymru) ran Aug 5 (Day 1) and Aug 6 (Day 2) at Black Hat USA 2026. Key findings
from the session description (previously captured):
- Purpose-built AI honeypot simulating 16 LLM/AI infrastructure personas
- Captured **3,993 requests from 327 unique source IPs** in 48 hours
- **155 MCP probes**, 344 AI API key probes, LiteLLM model-registration abuse, MCP resource
  enumeration, framework-aware credential brute-forcing, coordinated scanning for local inference
- Demonstrates a **repeatable attacker playbook** against the emerging AI stack

Slides have not yet been confirmed published as of today's pass. Black Hat policy: slide
materials post to the briefings schedule page by 6:00 PM Pacific following live sessions.
Navigate to Briefings > Schedule, find MCPwned, scroll to "Presentation Material."
Streamly on-demand access opens Aug 14.

**Catalog impact:** None. Auth-gated remote-HTTP endpoints are structurally immune to the
unauthenticated MCP enumeration attack class documented in the honeypot.

---

## 4. HubSpot MCP — August Capability Expansion

The HubSpot remote MCP server received a substantive capability update in August 2026,
confirmed via the developer changelog. New tools added:

| New capability | Category |
|---|---|
| Leads record read | CRM |
| Partner Client read | CRM |
| Landing page creation | Marketing |
| Landing page content analytics | Marketing |
| Campaign management | Marketing |
| Marketing email tools | Marketing |
| Quotes + revenue objects (beta) | Sales |
| Conversations data | Support |
| Conditional rules | Automation |
| Verified domain controls | Admin |

Authentication model is unchanged: OAuth 2.1 + PKCE only; no Dynamic Client Registration;
no private-app-token path. One-click Claude connector live via Anthropic's connector
directory. Endpoint: `mcp.hubspot.com`.

**This confirms HubSpot as the #1 curate priority.** Next `subregistry-curate` run
should add `com.hubspot/mcp` with the expanded capability set. Note the no-DCR constraint
in `auth.notes`.

[[HubSpot GA announcement]](https://developers.hubspot.com/changelog/remote-hubspot-mcp-server-is-now-generally-available)
[[HubSpot MCP integration docs]](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server)

---

## 5. SEP-2127 / Server Cards — Final WG Sprint

The MCP Server Cards Working Group term closes **August 14, 2026** — 6 days from today.
The WG co-terminates with the AAIF Seoul summit (Aug 13–14).

**Confirmed details:**
- **Path:** `/.well-known/mcp.json` (the simpler form that superseded `/.well-known/mcp/server-card.json`)
- **Leads:** David Soria Parra (Anthropic) + Sam Morrow Drums (GitHub)
- **Charter date:** 2026-03-26; weekly sessions
- **Charter page:** [[MCP Working Groups]](https://modelcontextprotocol.io/community/working-groups/server-card)
- **Validator:** agent-ready.dev (live — "Is Your MCP Ready?")
- **Implementation guides:** turva.dev, ekamoira.com
- **Support:** Claude Desktop + Cursor already shipping support (pre-WG-close)
- **PR:** [[SEP-2127 #2127]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)

Once the WG closes and the spec merges, `subregistry-audit` should GET
`/.well-known/mcp.json` on each of the 19 cataloged endpoints and record tool count +
protocol version in `verification.notes`. This is **Next Action #6** from CLAUDE.md §13.
No schema change needed until then; no catalog action today.

---

## 6. AAIF Seoul Summit — 5 Days Away

**MCP Dev Summit Seoul** — August 13–14, 2026, Seoul, Korea.
Co-located with Open Source Summit Korea (Linux Foundation event).

The event's timing is significant: the SEP-2127 WG closes Aug 14 and Streamly MCPwned
on-demand opens Aug 14. Expected speakers include Workato, Google, and AWS representatives.
Likely outputs: governance/policy sessions, new blog posts, possibly WG deliverable
announcements.

Monitor the AAIF blog at [[aaif.io/blog]](https://aaif.io/blog) for post-summit coverage.
If the WG closes with a merged spec change, trigger a `subregistry-audit` pass the following
week.

[[AAIF Seoul event page]](https://events.linuxfoundation.org/mcp-dev-summit-seoul/)
[[AAIF press release]](https://aaif.io/press/agentic-ai-foundation-announces-global-2026-events-program-anchored-by-agntcon-mcpcon-north-america-and-europe/)

---

## 7. IETF MCP Standardization — 15+ Drafts, No WG Yet

A notable maturation signal: 15+ active IETF Internet-Drafts directly referencing or
extending the Model Context Protocol. Authors include contributors from Cisco, Google,
Huawei, Deutsche Telekom, Orange, and Telefonica.

**IETF 126** (Vienna, July 18–24, 2026) scheduled **five Birds-of-a-Feather (BoF)
sessions**, three of which touched AI agent protocols directly. BoF sessions are the
early community-consensus step toward chartering a formal Working Group.

No WG has been chartered yet. The standard IETF process from BoF → chartered WG →
multiple Internet-Draft revisions → published RFC typically takes **2–4 years**. If a WG
charters out of IETF 126, the realistic RFC date is 2028–2030.

**Relevant drafts (representative):**
- `draft-sharif-mcps-secure-mcp-00` — cryptographic security layer for MCP
- `draft-zeng-nmrg-mcp-usecases-requirements-00` — MCP for network management use cases
- `draft-zeng-opsawg-applicability-mcp-a2a-00` — MCP + A2A for advanced network management
- `draft-zeng-mcp-troubleshooting-00` — MCP for intent-based network troubleshooting

[[ChatForest IETF deep-dive]](https://chatforest.com/guides/mcp-ietf-standardization/)
[[Nerd Level Tech IETF context]](https://nerdleveltech.com/ietf-ai-agent-protocol-standard-agentproto)

**Catalog impact:** None now. When a WG charters, the resulting RFC could add discovery,
security, or transport requirements that affect `gateway_compatibility` fields — monitor
and adjust in `subregistry-audit` when relevant.

---

## 8. IBM ContextForge SDK v2 Migration — Epic Status

The IBM ContextForge SDK v2 migration epic (GitHub Issue #5559) remains open. A companion
issue (#5839) tracks the immediate need to pin `mcp>=1.28.1,<2` before the v2 stable
release.

Breaking changes documented in the epic:
- `FastMCP` class renamed to `MCPServer`
- `McpError` renamed to `MCPError`
- `mcp.types` moved to a separate `mcp-types` package
- WebSocket transport removed entirely (not part of the 2026-07-28 spec)

IBM ContextForge is a gateway + proxy product (separate from the sub-registry function)
and is not in our catalog. However, its migration status is a meaningful lagging indicator
of how enterprise SDK consumers are absorbing the v2 transition. If a large IBM product is
still in the epic phase after the July 27 stable release, expect similar migration timelines
at other enterprise SDK consumers.

[[IBM ContextForge epic #5559]](https://github.com/IBM/mcp-context-forge/issues/5559)
[[IBM ContextForge v2 pin issue #5839]](https://github.com/IBM/mcp-context-forge/issues/5839)

---

## 9. AWS Agent Registry — Post-Migration Status

The AWS Agent Registry namespace migration (`bedrock-agentcore` → `agent-registry`)
executed **August 6, 2026** as scheduled. As of today, the service remains in **Preview**;
no General Availability date has been announced.

Key capabilities (unchanged): private org catalog in Bedrock AgentCore; indexes agents +
MCP servers + skills; exposes catalog as MCP endpoint; semantic + keyword search; approval
workflow for access control.

**Our catalog entry (`com.aws/mcp`)** is the AWS MCP Server — a distinct GA product
(available since May 2026; us-east-1 + eu-central-1; IAM SigV4 via mcp-proxy-for-aws).
The Agent Registry migration does not affect this entry.

If AWS Agent Registry reaches GA, assess whether to add it as a sync source alongside the
official MCP Registry.

[[AWS Agent Registry docs]](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry.html)
[[AWS Agent Registry preview announcement]](https://aws.amazon.com/about-aws/whats-new/2026/04/aws-agent-registry-in-agentcore-preview)

---

## 10. Security — Day 43 Clean

**Window:** 43 consecutive days without a confirmed CVE targeting any of the 19 cataloged
remote-HTTP servers.

**New CVE IDs surfaced in today's search pass** that could not be confirmed as targeting
cataloged endpoints (NVD was inaccessible; no secondary sources confirmed details):
- CVE-2026-55604
- CVE-2026-55605
- CVE-2026-58446
- CVE-2026-39313

These IDs appear in search result indexes alongside the broader wave of 40+ MCP CVEs
tracked since early 2026. Based on the available descriptions (all prior MCP CVEs in this
wave have been STDIO/community packages), the structural defense holds: our remote-HTTP +
auth-gated catalog is immune to the documented STDIO/file-access/command-injection attack
classes. These CVE IDs should be spot-checked in the next scheduled `subregistry-audit`
pass when NVD access is available.

**All 19 catalog servers remain approved/public.** No demotions warranted today.

**Upcoming security watch:**
- **MCPwned slides** (expected on BH briefings page; Streamly Aug 14): review for any
  named catalog endpoints or new attack classes requiring catalog-level response.
- **CVE audit gate (Next Action #3b):** Verify all TypeScript SDK-based vendors in
  catalog are on >=v1.26.0 (CVE-2026-25536 data leak) or migrated to SDK v2.0.0. This
  remains an open item from prior research passes.

---

## 11. Catalog Hooks — No Action Today

| Server | Finding | Action |
|---|---|---|
| All 19 | No new endpoint failures, ownership changes, or confirmed security incidents | None |
| `com.hubspot/mcp` (not yet in catalog) | August capability expansion confirmed; endpoint live; OAuth 2.1+PKCE; #1 curate priority | → `subregistry-curate` next run |

---

## 12. Next Actions (this pass)

1. **No catalog changes today** — research pass only; all 19 entries remain approved/public.
2. **Trigger `subregistry-curate`** — add `com.hubspot/mcp` (endpoint `mcp.hubspot.com`;
   OAuth 2.1 + PKCE only; August capability set confirmed; no DCR). This is the most
   overdue unblocked action.
3. **Monitor MCPwned slides** — check the BH briefings page for Team Cymru materials;
   if a catalog endpoint is named, trigger `subregistry-audit` immediately.
4. **Post-Seoul-summit (Aug 15+)** — review AAIF blog for governance outputs. If
   SEP-2127 merges, activate `subregistry-audit` to poll `/.well-known/mcp.json` on all
   19 endpoints.
5. **CVE spot-check (next audit pass)** — verify CVE-2026-55604/55605/58446/39313 details
   and confirm no catalog server is affected. Also complete the TS SDK >=1.26.0 audit
   gate (CVE-2026-25536).

---

*Report produced by MCP Sub-Registry autonomous research routine. Today's date: 2026-08-08.*
