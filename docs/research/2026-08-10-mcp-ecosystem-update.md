# MCP Ecosystem Update — 2026-08-10

**Produced by:** MCP Sub-Registry autonomous research routine
**Covers:** 2026-08-09 EOD → 2026-08-10
**Prior report:** [2026-08-09-mcp-ecosystem-update.md](./2026-08-09-mcp-ecosystem-update.md)

---

## 1. Headline Summary

- **Glama: ~69,812 (+442 vs. Aug 9).** Page title confirms ~69,812 servers in the Glama
  Registry — up from 69,370 yesterday. Growth continues at ~400–500/day net pace
  following the post-spec surge. [[Glama]](https://glama.ai/mcp/servers)
- **PulseMCP: ~22,070+ (flat).** No change vs. yesterday.
  [[PulseMCP]](https://www.pulsemcp.com/servers)
- **MCPwned slides: still not published; BH posting timeline clarified.** Black Hat USA 2026
  sessions occurred Aug 5–6. The Black Hat multimedia archives note that **speaker presentations
  are typically posted approximately two weeks after the event** — meaning the MCPwned deck
  would be expected ~Aug 19–20 on the BH site, not on Aug 14. Streamly on-demand opens
  Aug 14 for registered attendees. No cataloged server was named in secondary reporting of
  the briefing's findings.
  [[Black Hat archives]](https://blackhat.com/html/bh-media-archives/bh-multi-media-archives.html)
  [[Black Hat USA 2026 schedule]](https://blackhat.com/us-26/schedule.html)
  [[Team Cymru BH2026]](https://event.team-cymru.com/black-hat-usa-2026)
- **SEP-2127 WG: 4 days to close (Aug 14).** Server Card path `/.well-known/mcp.json`
  confirmed. Validator live at agent-ready.dev. Multiple implementation guides (turva.dev,
  ekamoira.com) published. Claude Desktop + Cursor already shipping support.
  Once WG closes, extend `subregistry-audit` to GET `/.well-known/mcp.json` on all 19
  cataloged endpoints and record tool count + protocol version in `verification.notes`.
  [[SEP-2127 PR]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)
  [[agent-ready.dev validator]](https://agent-ready.dev/mcp-card-validator)
- **AAIF MCP Dev Summit Seoul: 3 days away (Aug 13–14).** Co-located with Open Source Summit
  Korea. Sessions confirmed include "MCP Adoption and Why OSPO Skills Matter" and
  "Skills-as-Packages: A Package Manager for AI Agent Skills." Speakers from Workato, Google,
  AWS. Post-summit blog expected on aaif.io ~Aug 15+; monitor for governance outputs and
  roadmap signals.
  [[MCP Dev Summit Seoul]](https://events.linuxfoundation.org/mcp-dev-summit-seoul/)
  [[Futurum analysis]](https://futurumgroup.com/insights/mcp-dev-summit-2026-aaif-sets-a-clear-direction-with-disciplined-guardrails/)
- **Security: Day 45 clean.** No new CVEs confirmed against any cataloged server.
  CVE-2026-55604/55605 remain unconfirmed as catalog-relevant (NVD blocked in this
  environment; no secondary source confirmed). All 19 catalog entries remain approved/public.

---

## 2. Scale & Registry Landscape

| Registry | Count (Aug 10) | vs. Aug 9 | Note |
|---|---|---|---|
| Glama | ~69,812 | +442 | Search index from page title; post-spec surge ongoing |
| PulseMCP | ~22,070+ | flat | No change |
| MCPToplist (cross-registry) | ~96,771 | — (Aug 2 snap) | No new reading available |
| Anthropic Connectors (vetted web dir.) | 439 | — | Stable |
| Our catalog | 19 | — | All approved/public; no changes this pass |

The Glama +442 single-day gain is consistent with the sustained ~400–500/day post-spec surge
rather than batch-indexing noise. At this pace, Glama will cross 70k within 1–2 days.

---

## 3. Agentgateway (Linux Foundation) — Contributor Ecosystem Update

Yesterday's report (§3c) noted agentgateway v1.4 with day-zero 2026-07-28 spec support. Today's
research surfaced additional detail on the LF contributor ecosystem worth recording:

**Agentgateway v1.4.1** was released shortly after v1.4 (within two days) to improve
compatibility with the new spec revision. The project was donated to the Linux Foundation in
August 2025 and has attracted contributors from: **AWS, Cisco, Huawei, IBM, Microsoft, Red Hat,
Shell, and Zayo** — a broader multi-vendor consortium than previously captured.

This depth of enterprise contributor backing distinguishes Agentgateway from most OSS MCP gateway
projects and positions it as a neutral, Foundation-governed reference implementation for the
gateway layer consuming our catalog. Not a registry/catalog product itself, but the most
credible OSS gateway architecture to follow for `gateway_compatibility` schema evolution.
[[LF welcomes agentgateway]](https://www.linuxfoundation.org/press/linux-foundation-welcomes-agentgateway-project-to-accelerate-ai-agent-adoption-while-maintaining-security-observability-and-governance)
[[agentgateway releases]](https://github.com/agentgateway/agentgateway/releases)

---

## 4. IBM ContextForge SDK v2 Migration — Concrete Status

Epic #5559 (Migrate to Python MCP SDK 2.0.0) is confirmed **open with 0 of 20 issues
completed**. The migration has not yet started. Estimated effort: **11–16 weeks across 9 phases**,
covering: dependency updates → core class renames (FastMCP → MCPServer; McpError → MCPError) →
field naming changes (camelCase → snake_case) → server/client handler updates → type system
migration (mcp.types → mcp-types package) → new feature adoption (multi-round-trip requests) →
deprecation handling → testing → documentation. The team currently pins `mcp>=1.28.1,<2`.

IBM ContextForge is **not** a catalog item (gateway/proxy with no universal public endpoint).
This signal matters as evidence of **post-SDK-v2 migration complexity in large enterprise
projects** — relevant when deciding when to require v2 compliance from cataloged
TypeScript-SDK vendors (Python SDK v1.x support continues ≥6 months from July 27).
[[IBM ContextForge issue #5559]](https://github.com/IBM/mcp-context-forge/issues/5559)

---

## 5. Security

### 5a. Day 45 clean

No new CVEs or security incidents targeting any of the 19 cataloged remote-HTTP servers were
surfaced in this pass. The standing threat landscape (Miasma, SANDWORM_MODE, IronWorm, Hades,
UNC1069/WAVESHAPER.V2) is unchanged; remote-HTTP-only catalog remains structurally immune to
all npm/repo-based worm vectors.

### 5b. CVE-2026-55604/55605 (still unconfirmed)

NVD pages confirmed to exist. No secondary source has linked either CVE to a remote-HTTP MCP
endpoint or any cataloged vendor. Verification remains blocked pending NVD access or a
secondary advisory. Will resolve in next `subregistry-audit` pass.
[[NVD CVE-2026-55604]](https://nvd.nist.gov/vuln/detail/CVE-2026-55604)
[[NVD CVE-2026-55605]](https://nvd.nist.gov/vuln/detail/CVE-2026-55605)

### 5c. MCP Vulnerabilities: Persistent Background Statistics

For context on the broader MCP security landscape (no new items, but cited for the audit
record): The vulnerablemcp.info database and Practical DevSecOps "MCP Security Statistics 2026"
report collectively document 40+ CVEs against MCP implementations. Common patterns: exec/shell
injection (43%), auth bypass (13%), path traversal (10%). **All involve STDIO packages or
community server implementations, not remote-HTTP vendor-operated endpoints.** Our catalog's
remote-HTTP-only posture is the structural defense.
[[vulnerablemcp.info]](https://vulnerablemcp.info/)
[[Practical DevSecOps MCP Security Stats 2026]](https://www.practical-devsecops.com/mcp-security-statistics-2026-report/)

---

## 6. Upcoming Events / Deadlines

| Date | Event | Relevance |
|---|---|---|
| **Aug 13–14** | AAIF MCP Dev Summit Seoul + Open Source Summit Korea | Governance signals; roadmap inputs |
| **Aug 14** | SEP-2127 WG term closes | `/.well-known/mcp.json` path finalizes; activate server card audit |
| **Aug 14** | Streamly on-demand for Black Hat USA 2026 | MCPwned deck accessible to registered attendees |
| **~Aug 19–20** | BH USA 2026 slide archive expected | MCPwned deck publicly accessible (~2 wks post-conference) |
| **Aug 31** | SEP-2127 follow-on WG meeting (if scheduled) | Post-term review |
| **Sept 6–7** | AGNTCon + MCPCon Shanghai (KubeCon China) | 40+ sessions, 1,500+ attendees |
| **Oct 22–23** | AGNTCon + MCPCon North America, San Jose | Flagship AAIF North America event |

---

## 7. Catalog Hooks

**No catalog changes required this pass.** All 19 approved/public servers remain healthy
per prior verification records. No cataloged server was named in any new security incident.

**Pending curate action (#1 priority):** HubSpot MCP (`mcp.hubspot.com`). OAuth 2.1 + PKCE,
no DCR, GA April 13. August 2026 capability expansion confirmed: leads, landing pages + content
analytics, email tools, conversations, conditional rules, verified domain controls (enterprise).
Ready for the next `subregistry-curate` run.

**Pending audit actions:**
- Verify CVE-2026-55604/55605 don't affect any cataloged endpoint (NVD access required)
- Verify all TypeScript-SDK-based vendors are on SDK ≥1.26.0 or v2.0.0
- Verify CIMD compliance for OAuth-gated vendors (DCR deprecated in 2026-07-28 spec)
- **Post-Aug-14:** poll all 19 cataloged servers for `/.well-known/mcp.json` server card
  compliance; record tool count + protocol version in `verification.notes`

---

## 8. Sources

- [[Glama MCP servers]](https://glama.ai/mcp/servers)
- [[PulseMCP servers]](https://www.pulsemcp.com/servers)
- [[MCPToplist]](https://mcptoplist.com/)
- [[Black Hat USA 2026 schedule]](https://blackhat.com/us-26/schedule.html)
- [[Black Hat multimedia archives]](https://blackhat.com/html/bh-media-archives/bh-multi-media-archives.html)
- [[Team Cymru BH2026]](https://event.team-cymru.com/black-hat-usa-2026)
- [[SEP-2127 PR]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)
- [[agent-ready.dev MCP card validator]](https://agent-ready.dev/mcp-card-validator)
- [[agent-ready.dev server card guide]](https://agent-ready.dev/how-to-publish-an-mcp-server-card)
- [[MCP Dev Summit Seoul (LF Events)]](https://events.linuxfoundation.org/mcp-dev-summit-seoul/)
- [[Futurum: MCP Dev Summit 2026 analysis]](https://futurumgroup.com/insights/mcp-dev-summit-2026-aaif-sets-a-clear-direction-with-disciplined-guardrails/)
- [[Linux Foundation welcomes agentgateway]](https://www.linuxfoundation.org/press/linux-foundation-welcomes-agentgateway-project-to-accelerate-ai-agent-adoption-while-maintaining-security-observability-and-governance)
- [[agentgateway releases]](https://github.com/agentgateway/agentgateway/releases)
- [[IBM ContextForge issue #5559]](https://github.com/IBM/mcp-context-forge/issues/5559)
- [[IBM ContextForge releases]](https://github.com/IBM/mcp-context-forge/releases)
- [[NVD CVE-2026-55604]](https://nvd.nist.gov/vuln/detail/CVE-2026-55604)
- [[NVD CVE-2026-55605]](https://nvd.nist.gov/vuln/detail/CVE-2026-55605)
- [[vulnerablemcp.info]](https://vulnerablemcp.info/)
- [[Practical DevSecOps MCP Security Stats 2026]](https://www.practical-devsecops.com/mcp-security-statistics-2026-report/)
- [[HubSpot MCP server changelog]](https://developers.hubspot.com/changelog/remote-hubspot-mcp-server-is-now-generally-available)
