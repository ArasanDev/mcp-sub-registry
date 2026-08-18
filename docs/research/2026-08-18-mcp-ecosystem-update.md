# MCP Ecosystem Update — 2026-08-18

**Produced by:** MCP Sub-Registry autonomous research routine
**Covers:** 2026-08-17 EOD → 2026-08-18
**Prior report:** [2026-08-17-mcp-ecosystem-update.md](./2026-08-17-mcp-ecosystem-update.md)

---

## 1. Headline Summary

- **Glama: ~73,090 (+614 vs. Aug 17 ~72,476).** Page title from live Glama registry confirms
  this count; direct page fetch still egress-blocked, sourced from search index.
  [[Glama]](https://glama.ai/mcp/servers)
- **PulseMCP: ~22,050+ (flat, Day 8 of ingestion rework pause).** No step-jump yet; "until
  mid-August" deadline now eight days overdue. Submissions remain paused.
  [[PulseMCP]](https://www.pulsemcp.com/servers)
- **Azure DevOps Remote MCP Server GA (Aug 5, 2026):** General availability confirmed with
  org-specific endpoint `https://mcp.dev.azure.com/{organization}`. Entra-only auth;
  MSA standalone orgs not supported. Endpoint remains org-specific — not a universal
  catalogable endpoint. Watch list updated; catalog action blocked until a universal endpoint
  is confirmed. [[Azure DevOps GA]](https://devblogs.microsoft.com/devops/azure-devops-remote-mcp-server-ga/)
- **CVE-2026-10591 (Kiro IDE, CVSS 8.8/8.6, patched v0.11.130):** Prompt injection via hidden
  web page text rewrites `mcp.json` and auto-launches attacker-controlled MCP server.
  Client-side attack on Kiro IDE. No catalog action; reinforces stable endpoint URL guarantee.
  [[AWS Security]](https://aws.amazon.com/security/security-bulletins/2026-037-aws/)
  [[The Hacker News]](https://thehackernews.com/2026/07/aws-kiro-flaw-let-poisoned-web-page.html)
- **MCPwned BH2026 slides (onhexgroup/Conferences):** GitHub release still loading-error on Aug 18.
  BH archive expected Aug 19–20. No cataloged vendor named; honeypot research content confirmed
  from conference coverage.
- **AAIF Seoul blog recap:** Futurumgroup published analyst coverage ("AAIF Sets A Clear
  Direction With Disciplined Guardrails"); official aaif.io blog post still absent (Day 4
  post-summit).
  [[Futurumgroup]](https://futurumgroup.com/insights/mcp-dev-summit-2026-aaif-sets-a-clear-direction-with-disciplined-guardrails/)
- **Adversa AI: Three August 2026 digests now live** — MCP security, AI Coding Agent security,
  and Agentic AI security. CVE-2026-10591 highlighted across all three.
  [[Adversa AI August MCP digest]](https://adversa.ai/blog/top-mcp-security-resources-august-2026/)
- **Security: Day 53 clean.** No new CVEs against any of the 19 cataloged servers.

---

## 2. Scale & Registry Landscape

| Registry | Count (Aug 18) | vs. Aug 17 | Note |
|---|---|---|---|
| Glama | ~73,090 | +614 | Search-index title from live page [[Glama]](https://glama.ai/mcp/servers) |
| PulseMCP | ~22,050+ | flat (Day 8) | Ingestion rework pause continues [[PulseMCP]](https://www.pulsemcp.com/servers) |
| MCPToplist (cross-registry) | 100,958 | (Aug 10 snap) | No new snapshot; 8 days stale |
| Official MCP Registry | ~2,000 | — | v0.1 frozen; v1 in development |
| Smithery | ~7,300 | — | No August update; infra rebuild |
| Anthropic Connectors | 950+ | — | Per claude.com July 28 blog |
| Our catalog | 19 | — | All approved/public; all on Streamable HTTP |

**Glama growth rate:** +614 today vs. +148 Aug 17. Rate has been inconsistent (Aug 15: +214;
Aug 16: ~flat; Aug 17: +148; Aug 18: +614) suggesting batch indexing pulses rather than
linear daily additions. Overall post-spec surge remains at ~200–600/day net.

**PulseMCP pause — Day 8:** The ingestion rework now exceeds its "mid-August" deadline by
a full week. The deferred batch step-jump (estimated two+ weeks of submissions) has not
arrived. Could indicate a technical delay or that the restart is imminent — next pass should
capture any rebound.

---

## 3. Spec & Official Infrastructure

- **2026-07-28 spec**: Final. No RC changes post-July 28. Adoption tracking ongoing.
- **Official MCP Registry**: Still v0.1 frozen; ~2,000 entries per third-party counts
  (WorkOS, Gentoro analysis). V1 GA date not announced. No schema or API changes this week.
  [[Official Registry]](https://registry.modelcontextprotocol.io/)
- **SEP-2127 server card audit**: WG closed Aug 14; follow-on meetings Aug 31 + Sep 7.
  Trigger for `subregistry-audit` remains ACTIVE — GET `/.well-known/mcp.json` on all
  19 cataloged servers is the next required audit step.

---

## 4. New Catalog Candidates & Watch List

### Azure DevOps Remote MCP Server (GA, Aug 5, 2026) — Watch list, not yet catalogable
- **Endpoint:** `https://mcp.dev.azure.com/{organization}` (org-slug required in URL)
- **Auth:** Microsoft Entra; org must be Entra-backed (MSA standalone unsupported)
- **Transport:** Streamable HTTP
- **Status:** GA since Aug 5, 2026; announced with Microsoft Foundry integration
- **Catalog blocker:** Endpoint is org-specific — no universal `https://mcp.dev.azure.com/`
  (or similar) endpoint confirmed. Existing CLAUDE.md §13 note about org-specific Azure
  DevOps URLs holds. Will re-evaluate if Microsoft ships a single universal hosted endpoint.
- **Security note:** The Azure DevOps Confused Deputy Attack (Manifold Security, Aug 11) —
  hidden HTML in PR descriptions carries indirect prompt injection via the MCP server — is
  documented; no CVE filed; MSRC triaging. This is a server-side concern, not a catalog
  blocker for org-specific entries, but operators must treat PR description content as
  untrusted external data.
- [[Azure DevOps GA]](https://devblogs.microsoft.com/devops/azure-devops-remote-mcp-server-ga/)
- [[GA coverage — dotnetramblings]](https://www.dotnetramblings.com/post/05_08_2026/05_08_2026_8/)

### Digi International MCP Server — Not a catalog candidate
- IoT/embedded vendor; MCP server for Digi Remote Manager and Genesis management platform.
- Device management persona, not developer-tools; org/account-specific.
- [[Digi press release]](https://www.digi.com/company/press-releases/2026/digi-launches-mcp-server-to-power-ai-workflows)

---

## 5. Security

### CVE-2026-10591 — Kiro IDE mcp.json rewrite via prompt injection (CVSS 8.8/8.6)
- **Affected:** Amazon Kiro IDE < v0.11.130
- **Attack vector:** Hidden CSS one-pixel text on a web page injects instructions into the
  Kiro agent; agent uses its file-write tool to overwrite `~/.kiro/settings/mcp.json`,
  registering an attacker-controlled MCP server. On next IDE open, the injected server
  auto-starts with developer privileges.
- **Root cause:** Agent can modify the files that define its own execution boundaries —
  prompt injection becomes privilege escalation when LLM has write access to MCP config.
- **Patch:** Kiro v0.11.130 (July 22, 2026). Classified as "Insufficient File Write
  Restrictions to Execution-Sensitive Paths."
- **Catalog impact:** None. Client-side attack on an IDE; no catalog server affected.
- **Signal:** Reinforces the product guarantee in CLAUDE.md §13 Next actions #8 — our
  catalog's stable `remotes[].url` values are an input to enterprise allowlists (GitHub
  Enterprise, Kiro IDE HTTPS-hosted JSON allowlist). URL stability matters because changes
  to an allowlist that reference our catalog endpoints require explicit operator action.
- [[AWS Security Bulletin]](https://aws.amazon.com/security/security-bulletins/2026-037-aws/)
- [[The Hacker News]](https://thehackernews.com/2026/07/aws-kiro-flaw-let-poisoned-web-page.html)
- [[Codex Knowledge Base (structural analysis)]](https://codex.danielvaughan.com/2026/07/25/kiro-mcp-config-rce-prompt-injection-codex-cli-sandbox-defence-config-immutability/)

### Ruby SDK — CVE-2026-67431 and CVE-2026-33946 (session auth bypass)
- **Affected:** MCP Ruby SDK (session ID used to authorize tool calls without caller binding)
- **Catalog impact:** None — no Ruby SDK vendors in our 19-server catalog; remote-HTTP
  endpoint model is decoupled from SDK session management internals.
- Surfacing in August roundups; documented for completeness.

### MCPwned (BH2026 honeypot research) — slides still pending
- The onhexgroup/Conferences `bhusa2026` GitHub release (91 files, 3 assets) shows
  a loading error as of Aug 18. BH archive expected Aug 19–20.
- Confirmed talk content (from conference coverage): AI honeypot simulated 16 LLM/AI
  infrastructure personas across 16 ports, captured 3,993 requests from 327 unique IPs
  in 48h; 155 MCP probes; attacker playbook: LiteLLM model-registration abuse, MCP
  resource enumeration, framework-aware credential brute-forcing, coordinated scanning
  for local inference services.
- No cataloged vendor named in any BH2026 disclosure.
- [[Black Hat USA 2026 Briefings]](https://blackhat.com/us-26/briefings.html)
- [[Straiker AI — BH2026 AI security recap]](https://www.straiker.ai/blog/black-hat-usa-2026-ai-security-talks)

### Adversa AI August 2026 Digests
Three separate monthly roundup posts now live (compared to two in prior months):
1. **MCP security best practices & resources: August 2026** — spec auth hardening,
   Azure DevOps confused deputy, CVE-2026-10591 highlighted.
   [[Link]](https://adversa.ai/blog/top-mcp-security-resources-august-2026/)
2. **Top AI Coding Agent security resources — August 2026** — Kiro mcp.json rewrite
   attack class, coding-agent attack surface analysis.
   [[Link]](https://adversa.ai/blog/top-ai-coding-agent-security-resources-august-2026/)
3. **Top Agentic AI security resources — August 2026** — broader agent security; MCP
   integration attack surfaces.
   [[Link]](https://adversa.ai/blog/top-agentic-ai-security-resources-august-2026/)

### Catalog status
All 19 approved/public servers remain healthy. No endpoint changes, no ownership changes,
no security incidents targeting any cataloged server. Day 53 clean.

---

## 6. AAIF / Governance

- **Seoul summit (Aug 13–14) blog recap:** No official aaif.io blog post through Aug 18
  (Day 4 post-summit). Futurumgroup published analyst coverage — key themes: "disciplined
  guardrails," security hardening, governance maturation. Forkast's framing ("high-stakes
  confrontation around security issues") continues to be the most-cited third-party
  characterization.
  [[Futurumgroup analyst]](https://futurumgroup.com/insights/mcp-dev-summit-2026-aaif-sets-a-clear-direction-with-disciplined-guardrails/)
  [[Forkast]](https://forkast.news/the-model-context-protocol-reaches-a-security-inflection-point/)
- **AAIF org count:** 247 members (57 new from Seoul announcement, Visa + Wells Fargo +
  Alibaba at Gold tier). No new additions reported today.
- **MCPCon Shanghai (Sept 6–7):** 40+ sessions at Shanghai International Convention Center;
  40 days out. No new schedule updates.

---

## 7. Catalog Hooks

| Server | Finding | Action |
|---|---|---|
| All 19 | Day 53 clean; no endpoint/auth changes | None required |
| `com.github/mcp` | v1.9.0 (Aug 10) — `verifiedAt` update pending | `subregistry-audit` #3b |
| `com.slack/mcp` | Slack Skills Plugin + CC v2.1.231 OAuth fix | `subregistry-audit` #3b |
| All TS SDK vendors | CVE-2026-25536 audit pending (≥v1.26.0 / SDK v2) | `subregistry-audit` #3c |
| All Python SDK vendors | CVE-2026-59950 audit pending (≥v1.28.1) | `subregistry-audit` #3d |
| All 19 | SEP-2127 server card audit OVERDUE (WG closed Aug 14) | `subregistry-audit` #3a |

**Priority unchanged:** `subregistry-audit` remains the highest-priority next action, specifically
the SEP-2127 server card audit (OVERDUE) plus `verifiedAt` updates for GitHub MCP v1.9.0 and Slack.

---

## 8. Summary of What Changed vs. Aug 17

| Item | Aug 17 | Aug 18 |
|---|---|---|
| Glama | ~72,476 | ~73,090 (+614) |
| PulseMCP | ~22,050+ (Day 7) | ~22,050+ (Day 8) |
| MCPwned slides | Not public | Still not public; expected Aug 19–20 |
| AAIF Seoul recap | Not published (Day 3) | Not published (Day 4) |
| Azure DevOps GA | Watch list | Confirmed org-specific; not catalogable |
| CVE-2026-10591 | Noted in Adversa digest | Full detail documented (CVSS 8.8; client-side) |
| Adversa digests | 2 Aug digests known | 3 Aug digests confirmed live |
| Catalog (19 servers) | Day 52 clean | Day 53 clean |

---

*Report generated autonomously by the MCP Sub-Registry research routine.*
