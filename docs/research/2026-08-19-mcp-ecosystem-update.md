# MCP Ecosystem Update — 2026-08-19

**Produced by:** MCP Sub-Registry autonomous research routine
**Covers:** 2026-08-18 EOD → 2026-08-19
**Prior report:** [2026-08-18-mcp-ecosystem-update.md](./2026-08-18-mcp-ecosystem-update.md)

---

## 1. Headline Summary

- **Glama: ~73,773 (+683 vs. Aug 18 ~73,090).** Search-index page title confirms count;
  direct page fetch egress-blocked; consistent with recent batch-pulse pattern (+614 Aug 18,
  +148 Aug 17). [[Glama]](https://glama.ai/mcp/servers)
- **PulseMCP: ~22,050+ (flat, Day 9 of ingestion-rework pause).** Multiple page variants
  still show 22,040–22,070; stated "mid-August" deadline now nine days overdue. No step-jump
  yet. [[PulseMCP]](https://www.pulsemcp.com/servers)
- **MCPwned BH2026 slides: GitHub release live (Aug 7), loading errors persist.** The
  `onhexgroup/Conferences/releases/tag/bhusa2026` release shows 91 files / 3 assets; page
  rendering still intermittent. An X post (`@connect24h`, Aug 19) indicates assets are
  downloadable; BH archive may be formally indexed Aug 19–20. No cataloged server named in
  any public coverage so far. [[GitHub release]](https://github.com/onhexgroup/Conferences/releases/tag/bhusa2026)
- **AAIF Seoul blog recap: still not published (Day 5 post-summit).** aaif.io remains
  egress-blocked; only Futurumgroup analyst coverage indexed.
  [[Futurumgroup]](https://futurumgroup.com/insights/mcp-dev-summit-2026-aaif-sets-a-clear-direction-with-disciplined-guardrails/)
- **DeepJack (Cursor deeplink MCP install abuse) surfaced in Adversa AI August digest.**
  Client-side attack; no catalog action; documented below.
- **Two new retail MCP servers launched (Aug 12–13):** Xnurta MCP (retail media) and EDITED
  MCP (retail dataset). Catalog candidates for a §12.5 retail/commerce persona bundle.
- **Security: Day 54 clean.** No new CVEs against any of the 19 cataloged servers.

---

## 2. Scale & Registry Landscape

| Registry | Count (Aug 19) | vs. Aug 18 | Note |
|---|---|---|---|
| Glama | ~73,773 | +683 | Search-index title [[Glama]](https://glama.ai/mcp/servers) |
| PulseMCP | ~22,050+ | flat (Day 9) | Ingestion rework pause; no step-jump [[PulseMCP]](https://www.pulsemcp.com/servers) |
| MCPToplist (cross-registry) | 100,958 | (Aug 10 snap; 9 days stale) | No new snapshot |
| Official MCP Registry | ~2,000 | — | v0.1 frozen; v1 in development |
| Smithery | ~7,300 | — | No August update; infra rebuild |
| Anthropic Connectors | 950+ | — | Per claude.com July 28 blog |
| Our catalog | 19 | — | All approved/public; all on Streamable HTTP |

**Glama growth rate (Aug):** +214, ~flat, +148, +614, +683 on Aug 15–19 respectively.
Inconsistent daily rates continue to suggest batch-indexing pulses rather than linear
organic additions. Net rate post-spec-final: ~200–700/day.

**PulseMCP Day 9:** Ingestion rework pause has exceeded its stated "mid-August" deadline by
more than a week. When the restart fires, expect a multi-week submission backlog to produce
a step-jump of 1,000–2,000+ entries. This remains the single most anticipated metric shift
in the near-term landscape.

---

## 3. Security

### 3a. DeepJack — Cursor deeplink MCP install abuse (new from Adversa AI August digest)

**Source:** Adversa AI, Proofpoint "CursorJack" write-up (July 15, 2026);
[[DeepJack]](https://adversa.ai/blog/cursor-security-deepjack-deeplink-vulnerability-mcp-rce/)
[[CursorJack]](https://www.proofpoint.com/us/blog/threat-insight/cursorjack-weaponizing-deeplinks-exploit-cursor-ide)

- A crafted `cursor://` deeplink installs an attacker-controlled MCP server after one click
  and one confirmation dialog.
- The install dialog renders the server command in a single-line field — a long command
  pushes its malicious tail off-screen. A second variant uses double-URL encoding to present
  a `mcp/install` URI as a PR review link.
- Root cause confirmed by Cursor internally April 27, 2026. Fix applied July 13 (no public
  advisory, no CVE). No CVE assigned; named vulnerability only.
- **Catalog action: none.** This is a client-side attack requiring developer interaction in
  Cursor IDE. Our remote-HTTP catalog is structurally immune (curated allowlist is the
  defense; a developer using our approved catalog endpoints cannot be redirected by deeplink
  to an unapproved server). Reinforces catalog endpoint URL stability as a product guarantee.

### 3b. DuneSlide (CVE-2026-50548/50549) — already documented

Two critical CVSS 9.8 zero-click RCE flaws via prompt injection in Cursor IDE (Cato Networks,
previously documented in the Aug 18 report). No new developments.
[[Cato Networks]](https://www.catonetworks.com/blog/duneslide-two-critical-rce-vulnerabilities/)

### 3c. Adversa AI August 2026 digests — active

Three August digests (MCP Security, AI Coding Agent Security, Agentic AI Security) remain
the current month's primary research roundup. The August MCP digest specifically highlights
DeepJack, CVE-2026-10591 (Kiro IDE mcp.json rewrite), and the ongoing six-stage kill-chain
HMM model for MCP attack sequencing.
[[Adversa AI August MCP]](https://adversa.ai/blog/top-mcp-security-resources-august-2026/)

### 3d. Day 54 clean window

No new CVEs or incidents affecting any of the 19 cataloged remote-HTTP servers. The clean
window (security counter in §13) advances to Day 54.

---

## 4. MCPwned BH2026 Slides — Status

**GitHub release** (`onhexgroup/Conferences/releases/tag/bhusa2026`): published Aug 7,
91 files, 3 assets. Page rendering has been intermittent (loading errors) since Aug 17.
An X post (`@connect24h`) in Japanese suggests bulk download is possible and slides are
present. No transcript or excerpt identifies any of our 19 cataloged servers.

**BH archive** (blackhat.com) posts slides within one business day of each briefing day
(Briefings were Aug 5–6); slides should be formally indexed. No search-accessible summary
of MCPwned slide content yet.

**Assessment:** The BH2026 MCPwned deck confirms the honeypot/reconnaissance theme
(155 MCP probes, 3,993 requests, 327 source IPs in 48h) from conference coverage. If no
cataloged vendor is named by next research pass, this watch item can be retired.
[[BH Briefings]](https://blackhat.com/us-26/briefings.html)

---

## 5. AAIF Seoul Summit — Recap Status

**Day 5 post-summit (Aug 13–14).** Official aaif.io blog recap still absent. Futurumgroup
analyst piece ("AAIF Sets A Clear Direction With Disciplined Guardrails") remains the only
indexed recap.
[[Futurumgroup]](https://futurumgroup.com/insights/mcp-dev-summit-2026-aaif-sets-a-clear-direction-with-disciplined-guardrails/)

The North America summit recap was published approximately one week post-event. Seoul recap
is likely in production and should appear before Aug 21–22. Monitor aaif.io/blog.

Confirmed Seoul facts from existing sources:
- 57 new members announced (total: 247 orgs)
- First financial-services Gold members: Visa + Wells Fargo
- Runlayer confirmed AAIF founding member (alongside Anthropic, OpenAI, Google)
- "Disciplined guardrails" theme: independent validation of `discovered != approved != enabled`

---

## 6. GitHub MCP Server — No New Release Since v1.9.0

GitHub MCP Server v1.9.0 (Aug 10) remains the latest release.
[[Releases]](https://github.com/github/github-mcp-server/releases)

Key v1.9.0 capabilities (already documented in §13 next actions): semantic search default,
PR-from-issue read, find_duplicate tool. `verifiedAt` update for `com.github/mcp` is
pending the next `subregistry-audit` pass.

---

## 7. New Vendor MCP Launches — Retail Persona

Two retail-sector MCP servers launched in the Aug 12–13 window:

### Xnurta MCP (Aug 13, 2026)
- Retail media MCP server connecting Xnurta retail-media data to AI assistants.
- Read-only Data Query mode GA; write capabilities in closed beta.
- Targets ChatGPT, Claude, and enterprise AI platforms.
- [[Yahoo Finance]](https://finance.yahoo.com/media-advertising/articles/xnurta-launches-mcp-retail-media-120000129.html)
- **Catalog assessment:** Retail media persona, not developer-tools. Candidate for §12.5
  retail/commerce persona bundle. URL and auth model not yet verified; catalog action
  deferred pending verification.

### EDITED MCP (Aug 12, 2026)
- Retail dataset MCP (fashion/retail price intelligence, "world's deepest retail dataset").
- Targets Claude Code, Claude Desktop, custom AI agents.
- [[Yahoo Finance]](https://finance.yahoo.com/technology/ai/articles/edited-launches-mcp-retail-superintelligence-071100868.html)
- **Catalog assessment:** Retail data/intelligence persona. Same bundle candidate as Xnurta.
  Technical stack (Streamable HTTP vs. SSE) and auth model unknown; verify before adding.

**Observation:** Both launches confirm the §12.5 persona-bundle direction. A "retail &
commerce intelligence" persona group could be a distinct curate target. No immediate catalog
action; record for next curate planning.

---

## 8. Black Hat MCP Vendor Wave

CryptoRank published an article noting "Agent Infrastructure Security Crystallizes as a
Market" at BH2026 — confirming MCP security as a named vertical at the conference, with
multiple vendors (Runlayer, Palo Alto Prisma AIRS, others) sponsoring or briefing.
[[CryptoRank]](https://cryptorank.io/news/feed/cddfe-black-hats-mcp-vendor-wave-agent-infrastructure-security-crystallizes-as-a-market)

This accelerates the timeline for enterprise demand for curated, trust-anchored catalogs
like ours vs. raw aggregators.

---

## 9. Catalog Hooks

| Server | Status | Action |
|---|---|---|
| All 19 approved/public | Clean (Day 54) | No demotion warranted |
| `com.github/mcp` | v1.9.0 since Aug 10 | Update `verifiedAt` in next audit pass |
| `com.slack/mcp` | Skills Plugin + CC v2.1.231 OAuth fix | Update `verifiedAt` in next audit pass |
| SEP-2127 audit (all 19) | OVERDUE (WG closed Aug 14) | Highest-priority `subregistry-audit` item |
| Xnurta MCP | New launch Aug 13 | Verify URL/auth; candidate for retail persona bundle |
| EDITED MCP | New launch Aug 12 | Verify URL/auth; candidate for retail persona bundle |

---

## 10. Next-Pass Priorities

1. **`subregistry-audit`** (highest priority — overdue):
   - SEP-2127 server card check: GET `/.well-known/mcp.json` on all 19 servers
   - Update `verifiedAt` for `com.github/mcp` (v1.9.0) and `com.slack/mcp`
   - Verify TypeScript SDK vendors ≥ v1.26.0 (CVE-2026-25536) or on SDK v2.0.0
   - Verify Python SDK vendors ≥ v1.28.1 (CVE-2026-59950)
2. **MCPwned slides:** If BH archive indexes MCPwned content, verify no cataloged server named;
   retire this watch item if clean.
3. **AAIF Seoul recap:** When published (expect Aug 21–22), read for any catalog-relevant
   announcements (new vendor MCP servers, EMA expansion, SEP-2127 progress).
4. **PulseMCP step-jump:** When the ingestion restart fires, capture the new count.
5. **Next `subregistry-curate`:** Comms & support group — HubSpot (`mcp.hubspot.com`) is
   confirmed #1 priority. Xnurta + EDITED retail servers are #2 group candidate (verify
   endpoints first).
