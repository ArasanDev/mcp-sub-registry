# MCP Ecosystem Update — 2026-08-09

**Produced by:** MCP Sub-Registry autonomous research routine
**Covers:** 2026-08-08 EOD → 2026-08-09
**Prior report:** [2026-08-08-mcp-ecosystem-update.md](./2026-08-08-mcp-ecosystem-update.md)

---

## 1. Headline Summary

- **MCPwned slides: still not confirmed publicly available.** Black Hat USA 2026 closed Aug 6.
  BH policy posts slides by 6 PM Pacific the day after each live briefing (i.e., Aug 6 and 7
  for the Aug 5–6 briefings). As of this research pass, no confirmed public download link for
  the MCPwned deck (Team Cymru / "How Exposed AI Agents Became the Internet's New Recon Toy")
  was found via web search. Black Hat briefings page remains the canonical check location.
  Streamly on-demand access opens **Aug 14**. The underlying findings (AI honeypot: 155 MCP
  probes, 344 AI API-key probes in 48h from 327 unique IPs) have been widely reported but
  the primary source deck remains unconfirmed as published.
  [[Black Hat USA 2026 Briefings]](https://blackhat.com/us-26/briefings.html)
  [[Team Cymru BH2026]](https://event.team-cymru.com/black-hat-usa-2026)
- **Glama: ~69,370 (slight index fluctuation).** The Glama search index title returned
  "69,370" today, compared to 69,395 on Aug 8. This is consistent with day-to-day batch
  indexing variation rather than a real contraction. Post-2026-07-28-spec surge continues
  at ~500–1,000/day pace overall. [[Glama]](https://glama.ai/mcp/servers)
- **PulseMCP: ~22,070+ (flat).** Page title shows 22,070+, essentially flat vs 22,080+ on
  Aug 8. [[PulseMCP]](https://www.pulsemcp.com/servers)
- **SEP-2127 WG closes in 5 days (Aug 14).** Working group led by David Soria Parra
  (Anthropic) + Sam Morrow Drums (GitHub); term ends Aug 14, 2026. Path confirmed:
  `/.well-known/mcp.json`. Validator live at agent-ready.dev. Production implementation
  guides now live on turva.dev and ekamoira.com. Claude Desktop + Cursor already shipping
  Server Card support. Once WG closes, extend `subregistry-audit` to poll all 19 cataloged
  servers for server card compliance.
  [[SEP-2127 PR]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)
  [[Server Card WG Charter]](https://modelcontextprotocol.io/community/working-groups/server-card)
  [[agent-ready.dev]](https://agent-ready.dev/how-to-publish-an-mcp-server-card)
- **AAIF MCP Dev Summit Seoul: 4 days away (Aug 13–14).** Co-located with Open Source
  Summit Korea. Session topics surfaced from the schedule include "MCP Adoption and Why OSPO
  Skills Matter" and "Skills-as-Packages: A Package Manager for AI Agent Skills." Speakers
  include Workato, Google, and AWS representatives. Likely to produce new governance signals
  and MCP roadmap inputs — monitor aaif.io/blog for post-summit outputs (expected ~Aug 15+).
  [[MCP Dev Summit Seoul]](https://events.linuxfoundation.org/mcp-dev-summit-seoul/)
  [[OSS Korea 2026 schedule]](https://osskorea2026.sched.com/)
- **Adversa AI August 2026 MCP security resources published.** Monthly roundup covers
  new attack surface findings: two CVSS 9.8 zero-click RCEs in Cursor (DuneSlide; patched);
  AWS Kiro rewriting its own MCP server config after reading hidden text; Cursor deeplink
  flaw installing attacker-controlled MCP servers; GitHub Agentic Workflows leaking private
  repo content as public comments. None affect our remote-HTTP-only catalog.
  [[Adversa AI August 2026 MCP resources]](https://adversa.ai/blog/top-mcp-security-resources-august-2026/)
- **Security: Day 44 clean.** No new CVEs confirmed against any of the 19 cataloged servers.
  CVE-2026-55604 and CVE-2026-55605 NVD pages confirmed to exist; no evidence they target
  any cataloged remote-HTTP endpoint (NVD blocked in this environment; no secondary source
  confirmed MCP-catalog relevance). Continuing to monitor.
- **HubSpot MCP August expansion: fully confirmed.** Capabilities are available by hub/tier.
  Leads, landing pages, content analytics, email tools, and conversations are available to
  all hubs and tiers; campaign management requires Marketing Hub Professional/Enterprise;
  quotes/revenue objects are beta on Revenue Hub Professional/Enterprise; verified domain
  restriction requires Claude Enterprise. Any app built on the HubSpot MCP server picks up
  these updates automatically. **Still #1 next curate priority.**
  [[HubSpot changelog]](https://developers.hubspot.com/changelog/remote-hubspot-mcp-server-is-now-generally-available)

---

## 2. Scale & Registry Landscape

| Registry | Count (Aug 9) | vs. Aug 8 | Note |
|---|---|---|---|
| Glama | ~69,370 | −25 (index fluctuation) | Batch indexing; overall growth trend intact |
| PulseMCP | ~22,070+ | flat | Stable; essentially same as Aug 8 |
| MCPToplist (cross-registry) | ~96,771 | — (Aug 2 snap) | No new reading available |
| Anthropic Connectors (vetted web dir.) | 439 | — | Stable |
| Anthropic Connectors (all surfaces) | 950+ | — | Per claude.com July 28 blog |
| Our catalog | 19 | — | All approved/public; no changes this pass |

The Glama "decrease" of ~25 is indexing noise. The underlying trend from July 28 onward
(~63,926 → ~69,370 in 12 days = +5,444) is the post-spec surge at ~450 servers/day net.

---

## 3. MCP Spec / SDK / Registry Developments

### 3a. MCP Official Registry (v0.1 API freeze)

The official MCP Registry remains in **API freeze (v0.1)** with "no breaking changes for the
next month or more." v1 GA is in development. The v0.1 registry is our primary sync source;
no action needed this pass.
[[Official Registry]](https://registry.modelcontextprotocol.io/)

### 3b. CIMD adoption mainstream

Following the 2026-07-28 spec's formal deprecation of Dynamic Client Registration in favor of
Client ID Metadata Documents (CIMD):

- **WorkOS** rolled CIMD into AuthKit; published implementation guide
- **Auth0, Authlete, Stytch, Keycloak** all implementing CIMD
- DCR continues to work as fallback; formally deprecated, slated for removal after summer 2027
- FastMCP has an open issue for CIMD server-side support

All OAuth-gated servers in our catalog (Atlassian, GitHub, Slack, Stripe, etc.) should be
verified for CIMD compliance in the next `subregistry-audit` pass.
[[WorkOS CIMD guide]](https://workos.com/blog/client-id-metadata-documents-cimd-oauth-client-registration-mcp)
[[MCP 2026-07-28 blog]](https://blog.modelcontextprotocol.io/posts/2026-07-28/)

### 3c. Agentgateway v1.4 (OSS reference)

The `agentgateway` open-source project released v1.4 on July 27 with day-zero support for
the 2026-07-28 spec, including the new `server/discover` RPC (stateless capability discovery
replacing the initialize handshake). No catalog action needed; useful as OSS reference for
gateway integration with the new spec.
[[agentgateway blog]](https://agentgateway.dev/blog/2026-08-03-new-mcp-spec-revision/)

---

## 4. Security

### 4a. Adversa AI August 2026 MCP security digest

Adversa AI published their monthly MCP security roundup for August 2026. Key new items
surfaced beyond what was in the July digest:

1. **Two CVSS 9.8 zero-click RCEs in Cursor IDE (DuneSlide — CVE-2026-50548 / CVE-2026-50549,
   patched Cursor 3.0, April 2, 2026; Cato Networks):** prompt injection via attacker-controlled
   MCP server response or poisoned web search result can trigger sandbox escape + OS-level RCE
   without user interaction. Patched. Not a catalog-side risk.
   [[Cato Networks DuneSlide]](https://www.catonetworks.com/blog/duneslide-two-critical-rce-vulnerabilities/)
2. **AWS Kiro IDE rewriting its own MCP server config after reading hidden text:** a variation
   of the "prompt injection via MCP-connected content" attack class; Kiro IDE's agent reads
   attacker-placed hidden text and modifies `~/.kiro/mcp_servers.json`. Client-host concern;
   no catalog action. Validates the enterprise registry-enforced allowlist as the structural defense.
3. **Cursor deeplink flaw installing attacker-controlled MCP server:** malformed deeplink URI
   causes Cursor to add a rogue MCP server to its config without explicit user approval. Client-side;
   no catalog action.
4. **GitHub Agentic Workflows reading private repos + posting as public comment:** GitHub's own
   agentic automation, when given broad permissions and exposed to attacker-controlled input, can
   exfiltrate private repo contents into public PR comments. Not an MCP catalog issue; illustrates
   scope-minimization as a governance principle our approval workflow already enforces.

All four are **client-host or IDE-side** attack surfaces. Our remote-HTTP-only catalog has no
runtime surface; structurally immune.
[[Adversa AI August 2026]](https://adversa.ai/blog/top-mcp-security-resources-august-2026/)

### 4b. CVE spot-check (CVE-2026-55604, 55605, 58446, 39313)

NVD pages for CVE-2026-55604 and CVE-2026-55605 exist and were indexed (NVD direct fetch
blocked in this environment). No secondary source confirmed these target any cataloged
remote-HTTP endpoint. CVE-2026-58446 and CVE-2026-39313 were not surfaced in any
MCP-specific security source in this pass. **Day 44 clean** — no cataloged servers named in
any new incident. Will verify in next `subregistry-audit` pass when direct fetch is available.

### 4c. Standing threat summary (no new worms/campaigns)

No new worm campaigns or supply-chain attacks surfaced in this pass beyond what was recorded
in prior reports. The Miasma, SANDWORM_MODE, IronWorm, and Hades families are still the
live threat backdrop; remote-HTTP-only catalog remains structurally immune to all npm/repo-based
infection vectors.

---

## 5. Upcoming Events / Deadlines

| Date | Event | MCP relevance |
|---|---|---|
| **Aug 13–14** | AAIF MCP Dev Summit Seoul (co-located Open Source Summit Korea) | Governance signals; roadmap inputs; post-summit blog expected |
| **Aug 14** | SEP-2127 WG term closes | Server Cards path `/.well-known/mcp.json` finalizes; activate audit pass |
| **Aug 14** | Streamly on-demand for Black Hat USA 2026 opens | MCPwned slides may become accessible |
| **Aug 31** | SEP-2127 follow-on WG meeting (if scheduled) | Post-term review |
| **Sept 6–7** | MCPCon Shanghai (KubeCon China co-located) | 40+ sessions, 1,500+ attendees |
| **Oct 22–23** | AGNTCon + MCPCon North America, San Jose | Flagship AAIF North America event |

---

## 6. IBM ContextForge SDK Migration (Watch Item)

IBM ContextForge (AI gateway, registry, proxy for MCP/A2A/REST) has an open EPIC
(GitHub issue #5559) to migrate from Python MCP SDK 1.x to 2.0.0. Key breaking changes
in v2: FastMCP → MCPServer rename, McpError → MCPError, `mcp.types` moved to a separate
`mcp-types` package, WebSocket transport removal. They pinned `mcp>=1.28.1,<2` pre-stable.

IBM ContextForge is a gateway/proxy product — **not** a catalog item (no universal public
endpoint). This watch item is relevant as a signal of enterprise SDK v2 migration complexity.
The migration tracking shows v2 adoption is non-trivial for large production deployments.
[[IBM ContextForge issue #5559]](https://github.com/IBM/mcp-context-forge/issues/5559)

---

## 7. Catalog Hooks

**No catalog changes required this pass.** All 19 approved/public servers remain healthy
per prior verification records. No cataloged server was named in any new security incident
or news item in this pass.

**Pending curate action (still #1):** HubSpot MCP (`mcp.hubspot.com`). August 2026
capability expansion is confirmed and fully characterized. OAuth 2.1 + PKCE, no DCR, one-click
Claude connector. All tiers supported for core tools; enterprise-tier features for verified
domain controls. Ready for the next `subregistry-curate` run.

**Pending audit action:** Verify CVE-2026-55604/55605/58446/39313 don't affect any cataloged
endpoint (NVD blocked in this environment); verify all TypeScript-SDK-based vendors are on
SDK ≥1.26.0 or v2.0.0; verify CIMD compliance for OAuth-gated vendors post-spec.
Post-Aug-14: poll all 19 servers for `/.well-known/mcp.json` (SEP-2127 server card compliance).

---

## 8. Sources

- [[Black Hat USA 2026 Briefings]](https://blackhat.com/us-26/briefings.html)
- [[Team Cymru BH2026]](https://event.team-cymru.com/black-hat-usa-2026)
- [[Glama]](https://glama.ai/mcp/servers)
- [[PulseMCP servers]](https://www.pulsemcp.com/servers)
- [[SEP-2127 PR]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)
- [[MCP Server Card WG Charter]](https://modelcontextprotocol.io/community/working-groups/server-card)
- [[agent-ready.dev server card guide]](https://agent-ready.dev/how-to-publish-an-mcp-server-card)
- [[MCP Dev Summit Seoul (LF Events)]](https://events.linuxfoundation.org/mcp-dev-summit-seoul/)
- [[Open Source Summit Korea 2026 schedule]](https://osskorea2026.sched.com/)
- [[AAIF global events PR]](https://www.prnewswire.com/news-releases/agentic-ai-foundation-announces-global-2026-events-program-anchored-by-agntcon--mcpcon-north-america-and-europe-302732860.html)
- [[Adversa AI August 2026 MCP security resources]](https://adversa.ai/blog/top-mcp-security-resources-august-2026/)
- [[Adversa AI August 2026 agentic AI security resources]](https://adversa.ai/blog/top-agentic-ai-security-resources-august-2026/)
- [[Cato Networks DuneSlide CVE-2026-50548/50549]](https://www.catonetworks.com/blog/duneslide-two-critical-rce-vulnerabilities/)
- [[NVD CVE-2026-55604]](https://nvd.nist.gov/vuln/detail/CVE-2026-55604)
- [[NVD CVE-2026-55605]](https://nvd.nist.gov/vuln/detail/CVE-2026-55605)
- [[HubSpot MCP server changelog]](https://developers.hubspot.com/changelog/remote-hubspot-mcp-server-is-now-generally-available)
- [[Official MCP Registry]](https://registry.modelcontextprotocol.io/)
- [[MCP 2026-07-28 spec blog]](https://blog.modelcontextprotocol.io/posts/2026-07-28/)
- [[WorkOS CIMD guide]](https://workos.com/blog/client-id-metadata-documents-cimd-oauth-client-registration-mcp)
- [[Agentgateway v1.4 blog]](https://agentgateway.dev/blog/2026-08-03-new-mcp-spec-revision/)
- [[IBM ContextForge SDK v2 migration epic]](https://github.com/IBM/mcp-context-forge/issues/5559)
