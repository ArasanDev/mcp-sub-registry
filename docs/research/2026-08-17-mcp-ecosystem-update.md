# MCP Ecosystem Update — 2026-08-17

**Produced by:** MCP Sub-Registry autonomous research routine
**Covers:** 2026-08-16 EOD → 2026-08-17
**Prior report:** [2026-08-16-mcp-ecosystem-update.md](./2026-08-16-mcp-ecosystem-update.md)

---

## 1. Headline Summary

- **Glama: ~72,476 (search index, +148 vs. Aug 16 ~72,328; Day 3 of sustained post-spec pace).**
  Rate of ~100–200/day continues; pace is slower than the July post-spec surge (~500–900/day)
  but steady net positive. Egress proxy blocks direct page fetch; count from search index cache.
  [[Glama]](https://glama.ai/mcp/servers)
- **PulseMCP: ~22,050+ (flat, Day 7 of ingestion rework pause; "until mid-August" deadline
  now seven days overdue).** No step-jump yet. Pause notice still displayed. When the rework
  ships, the expected batch step-jump has not yet materialized.
  [[PulseMCP]](https://www.pulsemcp.com/servers)
- **MCPToplist: 100,958 (Aug 10 snapshot; no new snapshot; 7 days stale).**
  [[MCPToplist]](https://mcptoplist.com/)
- **Getty Images MCP Server launched Aug 12, 2026** — first major visual-content platform
  to ship an official MCP server; enterprise/licensing-gated; potential catalog candidate
  for a media/creative-content persona bundle (§12.5). Details in §3.
- **MCPwned (Fenrisk Burp Suite extension) clarification** — the GitHub onhexgroup/Conferences
  `bhusa2026` release tag exists (91 files/3 assets) but content still fails to load. BH
  archive expected ~Aug 19–20. A *different* "MCPwned" pentest tool was confirmed: a Burp
  Suite extension by Fenrisk Security for auditing MCP server endpoints. Details in §4.
- **AAIF Seoul blog recap: STILL NOT PUBLISHED (Day 3 post-summit).** No dedicated aaif.io
  blog post; only the member announcement press release and analyst commentary available.
- **Official MCP Registry: still v0.1 (frozen); v1 GA has no announced date for August 2026.**
  Current entry count ~2,000 servers per third-party analysis; v0.1 API remains stable.
  [[Official Registry]](https://registry.modelcontextprotocol.io/)
- **Security: Day 52 clean.** No new CVEs or incidents against any of the 19 cataloged servers.

---

## 2. Scale & Registry Landscape

| Registry | Count (Aug 17) | vs. Aug 16 | Note |
|---|---|---|---|
| Glama | ~72,476 (search index) | +148 | Direct page blocked; index cache [[Glama]](https://glama.ai/mcp/servers) |
| PulseMCP | ~22,050+ | flat (Day 7) | Pause continues past "mid-August" deadline [[PulseMCP]](https://www.pulsemcp.com/servers) |
| MCPToplist (cross-registry) | 100,958 | (Aug 10 snap) | No new snapshot; 7 days stale |
| Official MCP Registry | ~2,000 | — | v0.1 frozen; v1 in development [[registry.modelcontextprotocol.io]](https://registry.modelcontextprotocol.io/) |
| Smithery | ~7,300 | — | No August update; infra rebuild ongoing |
| Anthropic Connectors | 950+ | — | Per claude.com July 28 blog |
| Our catalog | 19 | — | All approved/public; all on Streamable HTTP |

**PulseMCP watch — Day 7:** The "until mid-August" ingestion rework pause is now a week
past its stated end date. Either the rework is running longer than expected, or the
pause notice is stale. Next research pass should capture any rebound. When submissions
resume, the batch step-jump could be substantial (two+ weeks of deferred indexing).

**Official MCP Registry status:** Third-party analysis (WorkOS, Gentoro) places the registry
at approximately 2,000 server entries as of August 2026. The v0.1 API freeze remains in
effect; v1 development is underway but no GA date announced.
[[WorkOS]](https://workos.com/blog/everything-your-team-needs-to-know-about-mcp-in-2026)
[[Gentoro]](https://www.gentoro.com/blog/what-is-anthropics-new-mcp-registry/)

---

## 3. Getty Images MCP Server (Aug 12, 2026) — New Enterprise Vendor

**Getty Images** launched an official MCP Server on **August 12, 2026**, connecting licensed
visual creative, editorial, and archival content to AI-powered workflows and products.
[[GlobeNewswire]](https://www.globenewswire.com/news-release/2026/08/12/3344005/0/en/getty-images-launches-mcp-server-to-connect-creative-and-editorial-content-to-ai-workflows-and-products.html)
[[Getty Newsroom]](https://newsroom.gettyimages.com/en/getty-images/getty-images-launches-mcp-server-to-connect-creative-and-editorial-content-to-ai-workflows-and-products)

**Key facts:**
- **Tools:** Image/video search, content download, access to Getty Images' creative,
  editorial, and archival collection.
- **Target audience:** Enterprise customers, media organizations, and technology
  partners building AI-powered solutions (marketing/advertising, news, sport/entertainment).
- **Auth:** Enterprise licensing required; authentication model expected to be OAuth or
  API-key gated (specific endpoint URL and auth details not retrievable in this research
  pass due to egress blocking). Official docs: `gettyimages.com/ai/mcp`.
- **Use case:** Gives AI agents a standardized framework for image/video search and
  download from a licensed, rights-managed corpus — addressing the content provenance
  and licensing gap that affects AI systems using unlicensed imagery.

**Catalog relevance:**
- **Not** a current developer-tools persona catalog candidate. Getty Images content
  is commercial/enterprise licensing; the server targets enterprises, not individual
  developers.
- **Relevant to §12.5 persona bundle planning.** A future "media/creative" or
  "marketing" persona bundle would naturally include this server. Getty Images is the
  first major visual-content platform to ship an official MCP server — a category signal.
- **Added to landscape watch list.** Endpoint URL and auth model should be verified
  in a future curate run when the media persona bundle is planned.

---

## 4. MCPwned — Two Distinct Research Efforts (Clarification)

Tracking two unrelated "MCPwned" efforts:

### 4a. Black Hat USA 2026 Briefing (still pending public release)

**"MCPwned: How Exposed AI Agents Became the Internet's New Recon Toy"** (Black Hat USA
2026 Briefings, Aug 5–6) remains unavailable to the general public.

- **GitHub:** The `onhexgroup/Conferences` release tag `bhusa2026` shows 91 files / 3 assets
  but content failed to load (error state, possibly stub not yet populated or access-controlled
  by passholders).
  [[onhexgroup/Conferences bhusa2026]](https://github.com/onhexgroup/Conferences/releases/tag/bhusa2026)
- **Public BH archive:** Expected **~Aug 19–20** (9–14 days post-Briefings). Previous
  years followed this pattern.
- **Catalog status:** No cataloged server named in any pre-release coverage. The
  briefing documents AI honeypots capturing 155 MCP probes from 327 IPs; the content
  validates that auth-gated, remote-HTTP-only catalog endpoints are structurally immune
  to the documented recon/enumeration attack class.

### 4b. Fenrisk "MCPwned" — Burp Suite Pentest Extension (new, separate)

A security research team at **Fenrisk Security** (Raphaël Lacroix) published a Burp Suite
extension also called **MCPwned** for pentesting/auditing MCP server endpoints.
[[Fenrisk blog]](https://fenrisk.com/mcpwned-burp-suite-extension-mcp-servers)
[[GitHub: FenriskSecurity/MCPwned]](https://github.com/FenriskSecurity/MCPwned)
[[Burp BApp Store]](https://portswigger.net/bappstore/9952290f04ed4f628e624d0aa9dccebc)

**Key features:**
- Automatically detects MCP-like endpoints; provides a tree-view of server capabilities.
- Scanner with per-implementation detection (identifies which MCP framework is in use
  and maps to known vulnerabilities for that framework).
- Template requests for each capability (tool call fuzzing).
- Quality-of-life features: response extraction, session ID refresh.
- Available in the official Burp Suite BApp Store.

**Catalog relevance:** A pentest tool, not a catalog entry. Its existence signals that
MCP endpoint security tooling is maturing and that enterprise security teams now have
purpose-built MCP audit infrastructure. A `subregistry-audit` pass could be accelerated
using this tool for any future manual endpoint verification.

---

## 5. AAIF Seoul — Still No Dedicated Blog Recap (Day 3)

**AAIF MCP Dev Summit Seoul** (Aug 13–14) concluded three days ago. The aaif.io blog
(access-blocked by egress proxy; last confirmed state from search indexing) shows the North
America and Bengaluru recaps but no Seoul-specific post yet.

**Available coverage:**
- **Member announcement (Aug 13):** 57 new members, 247 total orgs; Visa + Wells Fargo + 
  Alibaba as Gold members (first major financial-services Gold tier entrants).
  [[PRNewswire]](https://www.prnewswire.com/news-releases/agentic-ai-foundation-welcomes-57-new-members-gaining-major-financial-services-players-and-apac-leaders-302850143.html)
- **Futurumgroup analyst recap:** "AAIF Sets A Clear Direction With Disciplined Guardrails"
  — formal project lifecycle policy (Growth/Impact/Emeritus), technical steering committee.
  [[Futurumgroup]](https://futurumgroup.com/insights/mcp-dev-summit-2026-aaif-sets-a-clear-direction-with-disciplined-guardrails/)
- **Forkast security framing:** Seoul transformed into "a high-stakes confrontation around
  security issues" with a growing catalog of CVEs and formalization of OWASP MCP Top 10.
  [[Forkast]](https://forkast.news/the-model-context-protocol-reaches-a-security-inflection-point/)
- **Linux Foundation newsletter:** August 2026 edition referenced Seoul as part of the
  ongoing global AAIF event cadence.
  [[Linux Foundation Newsletter]](https://www.linuxfoundation.org/blog/linux-foundation-newsletter-august-2026)

**Next AAIF events:** MCPCon China/KubeCon Shanghai (Sept 6–7) and MCPCon Japan (Sept 10–11).

---

## 6. Security Posture — Day 52 Clean

No new CVEs or security incidents against any of the 19 cataloged servers detected as of
Aug 17 EOD.

**CVE-2026-33032 backfill note (added to landscape.md Standing reads):**
nginx-ui's `/mcp_message` endpoint was missing authentication middleware (CVSS 9.8;
discovered March 4, patched in v2.3.4 March 15; added to VulnCheck KEV April 13; actively
exploited; ~2,600 public instances exposed). This CVE already appears in the landscape.md
Standing reads section. Noting here for completeness: it represents the pattern of *web UIs*
that add MCP message-passing endpoints without applying the same authentication middleware
as the main `/mcp` initialization route. None of our 19 cataloged servers are nginx-ui or
a similar self-hosted UI product.
[[Rapid7 ETR]](https://www.rapid7.com/blog/post/etr-cve-2026-33032-nginx-ui-missing-mcp-authentication/)
[[Picus Security]](https://www.picussecurity.com/resource/blog/cve-2026-33032-mcpwn-how-a-missing-middleware-call-in-nginx-ui-hands-attackers-full-web-server-takeover/)
[[Dark Reading]](https://www.darkreading.com/application-security/critical-mcp-integration-flaw-nginx-risk/)

**Open catalog audit items (no new items today):**
- CVE-2026-25536 (TS SDK data leak; ≥v1.26.0 or SDK v2 required) — awaiting `subregistry-audit`.
- SEP-2127 server card audit — awaiting `subregistry-audit`.
- GitHub MCP v1.9.0 `verifiedAt` bump, Slack MCP `verifiedAt` bump — awaiting `subregistry-audit`.

---

## 7. Enterprise Gateway Architecture Research (arXiv:2608.10760)

A new academic paper **"A Gateway Architecture for Enterprise MCP Authentication:
Unifying Heterogeneous Auth, Identity Delegation, and the User / Non-User Persona Problem"**
appeared in search results for Aug 17 (arXiv:2608.10760v1). The paper addresses enterprise-scale
challenges: heterogeneous authentication (each MCP server has a different auth model),
identity delegation (agent acting on behalf of a human vs. machine-to-machine), and the
user/non-user persona separation that our gateway projection already addresses.

Direct fetch was blocked by egress proxy. Worth noting as an emerging academic contribution
that aligns with our product direction (the gateway projection contract). The paper's existence
confirms that enterprise MCP authentication architecture is now drawing academic research
attention, not just industry blog posts.
[[arXiv:2608.10760]](https://arxiv.org/abs/2608.10760)

---

## 8. Pending Watches (ordered by urgency)

| Priority | Item | Expected |
|---|---|---|
| 🔴 **Immediate** | `subregistry-audit` — SEP-2127 server card audit (WG closed Aug 14) | Overdue |
| 🔴 **Immediate** | `subregistry-curate` — HubSpot (`mcp.hubspot.com`, GA, OAuth 2.1 + PKCE) | Next curate run |
| 🟡 **Aug 19–20** | MCPwned BH2026 public slides — check for named cataloged vendor | T-2/3 days |
| 🟡 **Imminent** | PulseMCP rework launch + count step-jump | 7 days overdue |
| 🟡 **Ongoing** | AAIF Seoul blog recap — aaif.io/blog | Day 3 wait |
| 🟡 **Future** | Getty Images MCP endpoint + auth verification (media/creative persona) | Next curate cycle |
| 🟢 **Ongoing** | GitHub MCP v1.9.0 `verifiedAt` bump, Slack MCP `verifiedAt` bump | Next audit |

---

## 9. Catalog Status

All 19 cataloged servers remain **approved/public**. No demotion, endpoint failure, or
ownership change detected in today's research pass.

**Next catalog-touching action: `subregistry-audit`** (SEP-2127 server card check +
CVE-2026-25536 TS SDK vendor verification + `verifiedAt` bumps for GitHub and Slack MCP).

**Upcoming curate candidate:** Getty Images MCP Server — needs endpoint URL and auth model
verification before catalog consideration. Relevant to media/creative persona bundle, not
current developer-tools persona.
