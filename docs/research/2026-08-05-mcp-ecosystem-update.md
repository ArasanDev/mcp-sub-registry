# MCP Ecosystem Update — 2026-08-05

**Produced by:** MCP Sub-Registry autonomous research routine
**Covers:** 2026-08-04 EOD → 2026-08-05
**Prior report:** [2026-08-04-mcp-ecosystem-update.md](./2026-08-04-mcp-ecosystem-update.md)

---

## 1. Headline Summary

- **Black Hat MCPwned briefing is LIVE today (Day 1, Aug 5–6):** "MCPwned: How Exposed AI
  Agents Became the Internet's New Recon Toy" is running today at Black Hat USA 2026 (Las
  Vegas, Mandalay Bay). No slides published yet. Previously confirmed research stats stand:
  3,993 probes in 48h from 327 unique IPs, 155 MCP probes, 344 AI API key probes — Team
  Cymru honeypot data. Slides typically publish same-day or within 48–72h of presentation.
  [[Black Hat USA 2026 briefings schedule]](https://blackhat.com/us-26/briefings/schedule/index.html)
  [[Team Cymru BH26 event page]](https://event.team-cymru.com/black-hat-usa-2026)
- **AI security dominates Black Hat 2026:** 35 of 121 total briefings (29%) are directly
  relevant to AI security, AI red-teaming, or LLM-assisted offensive security — the highest
  density at any Black Hat conference. Tool poisoning via MCP is called out as the top attack
  vector across agent types. The shift from "prompt injection as a curiosity" to "agent
  exploitation as a discipline" is complete.
  [[Straiker BH2026 summary]](https://www.straiker.ai/blog/black-hat-usa-2026-ai-security-talks)
- **Multiple MCP-specific vendor launches at BH2026** (see §3): Tanium Atlas MCP Server,
  Legit Security VibeGuard 2.0, Straiker agentic kill switch, Acalvio Deception Guardrails,
  Sysdig Secure AI. None are catalogable (client/runtime security tooling, not remote HTTP
  MCP server endpoints).
- **Registry scale (Aug 5):** Glama **~67,664** (no new batch since Aug 4; stable); PulseMCP
  **~22,090+** (stable); MCPToplist **~96,771** (Aug 2 snapshot — no update). Trust gap: ~97k
  indexed vs. 19 approved in our catalog.
  [[Glama]](https://glama.ai/mcp/servers)
  [[PulseMCP]](https://www.pulsemcp.com/servers)
- **Security: Day 40 clean window.** No new CVEs targeting any of the 19 cataloged servers.
  Watch for any post-MCPwned-slides disclosures naming specific vendor endpoints.
- **AWS Agent Registry namespace migration: TOMORROW (Aug 6).** `bedrock-agentcore` →
  `agent-registry` namespace. Our `com.aws/mcp` (AWS MCP Server, GA) is a distinct product
  and is unaffected.
  [[AWS docs]](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry.html)

---

## 2. Scale & Registry Landscape

| Registry | Count (Aug 5) | vs. Aug 4 | Note |
|---|---|---|---|
| Glama | ~67,664 | ±0 | No new batch; same Aug 4 figure |
| PulseMCP | ~22,090+ | ±0 | Stable |
| MCPToplist (cross-registry) | ~96,771 | — (Aug 2 snap) | No update |
| Anthropic Connectors (verified) | 439 | — | Stable |
| Our catalog | 19 | — | Approved/public |

Glama's post-spec surge pace appears to have plateaued around 67,664 for the past two days —
consistent with batch-indexing dynamics (large jumps every few days rather than daily trickle).
Next material Glama reading expected in the next 1–2 days.
[[Glama]](https://glama.ai/mcp/servers)

---

## 3. Black Hat USA 2026 — MCP/AI Vendor Announcements

Black Hat USA 2026 (Aug 1–8, Las Vegas) is the peak vendor announcement window for the year.
Multiple MCP-adjacent products were announced. None are candidates for the curated catalog
(these are security/governance tooling that *consumes* MCP servers, not endpoints we would
catalog). Documented here for landscape completeness.

### 3.1 Tanium Atlas MCP Server (announced Aug 3, BusinessWire; presented at BH2026)

Tanium launched its **Atlas MCP Server**, a governed MCP server that exposes real-time
Tanium endpoint intelligence and actions to Claude, Microsoft Security Copilot, Copilot
Studio, and other MCP-compatible AI clients. Tanium Atlas now includes:
- Agentic Performance Analysis (root-cause tracing)
- Background AI Agents (alert-to-resolution workflows)
- MCP Server (Claude / Security Copilot data exposure)
- External Attack Surface Management + Attack Path Mapping
- Agent-Guided Threat Hunting

**Catalog relevance:** Security-tooling product (not a developer-tools or general-purpose MCP
endpoint). Out of scope for current catalog persona. Watch list only.
[[Tanium BusinessWire]](https://www.businesswire.com/news/home/20260803037958/en/Tanium-Delivers-Autonomous-Security-at-Black-Hat-USA-2026-Empowering-Operators-to-Outpace-AI-Accelerated-Threats)
[[Tanium MCP blog]](https://www.tanium.com/blog/bringing-tanium-s-real-time-endpoint-intelligence-into-enterprise-ai-workflows-with-mcp)

### 3.2 Legit Security VibeGuard 2.0 (released at BH2026)

Legit Security announced **VibeGuard 2.0** — an endpoint-based tool for securing AI coding
agents. New MCP-specific features:
- Guardrails for MCP skill discovery
- Blocking of risky MCP operations
- Real-time MCP scanning and policy enforcement
- Anti-tampering protections (stops agents or users from disabling controls)
- Command monitoring against built-in or custom policies

Previously named in the Gartner report "Best Practices to Mitigate Security Risks with
Agentic Coding Tools."
[[Legit Security VibeGuard]](https://www.legitsecurity.com/security-governance-for-ai-generated-code-legit-vibeguard)
[[SecurityWeek BH2026 Part 2]](https://www.securityweek.com/black-hat-usa-2026-summary-of-vendor-announcements-part-2/)

### 3.3 Straiker — "Agentic Kill Switch" (presented at BH2026)

Straiker showcased its full agentic AI security platform at BH2026:
- **Discover:** maps AI agents and MCP servers across the enterprise fleet
- **Ascend:** adversarial testing — prompt injection, goal hijacking, tool misuse, inter-agent manipulation
- **Defend:** runtime blocking of attacks

Straiker's thesis (consistent with our boundary design): tool poisoning via MCP is the top
attack vector across every agent type. Named "Best Cybersecurity Startup" at the Cybersecurity
Stars Awards 2026.
[[Straiker BH2026]](https://www.straiker.ai/events/blackhat-ai4-2026)
[[VMBlog Q&A]](https://vmblog.com/qa/straiker-heads-to-black-hat-2026-with-an-agentic-kill-switch-a-qa-with-amy-heng-on-securing-the-ai-agents-enterprises-already-shipped/)

### 3.4 Other BH2026 MCP-Adjacent Announcements

- **Acalvio Deception Guardrails** — deploys honeytokens, decoy tools, and fake infrastructure
  to detect jailbreak attempts, prompt injection, and AI agent manipulation.
- **Sysdig Secure AI** — three modes: autonomous agents, "headless" mode integrating with
  Claude Code, and a GenAI assistant. Signals enterprise concern about AI agent runtime
  visibility.
- **Bedrock Data IANS MCP** — puts IANS threat intelligence directly inside AI tools security
  teams use (Claude, etc.). Another vendor packaging intelligence-as-MCP.
- **Novee Security — "Trusted Enough to Run"** briefing: demonstrates trust handoff failures
  across Anthropic, Google, and OpenAI official workflows; not an exploit of cataloged servers.
  [[CSO Online BH2026]](https://www.csoonline.com/article/4204921/the-top-cybersecurity-product-announcements-from-black-hat-2026.html)

### 3.5 MCPwned Slides (still pending)

Slides from the Team Cymru MCPwned briefing were not published as of research time today.
Standard Black Hat slide release is within 24–72h of presentation. Re-check Aug 6–7.
No cataloged servers have been named in any Black Hat briefing abstract or pre-disclosure.
[[Black Hat USA 2026 briefings]](https://blackhat.com/us-26/briefings.html)

---

## 4. MCP Working Group Activity

### 4.1 Gateways Interest Group (Aug 5 + Aug 6)

The **MCP Gateways Interest Group** (#gateways-ig) holds back-to-back sessions this week:
- **Aug 5 at 2:00pm** (today) — first session concurrent with Black Hat day 1
- **Aug 6 at 4:30pm** — follow-on session

No public outputs available from today's meeting at research time. This group is directly
relevant to our gateway catalog projection — any guidance it produces on how gateways should
interact with the 2026-07-28 stateless transport and `Mcp-Method`/`Mcp-Name` headers will
inform our `GET /v0.1/gateway/catalog` contract. Monitor for published meeting notes or new
SEP proposals.
[[MCP Events calendar]](https://meet.modelcontextprotocol.io/)

### 4.2 Other WG sessions (concurrent)

Inspector V2 WG (weekly, Aug 5 8am), MCP Apps WG (Aug 5 8am), SDK WG (Aug 4 complete).
No public outputs from today's sessions yet.

---

## 5. Security

### 5.1 Black Hat AI Security Theme — Key Signals

Straiker's conference summary puts in writing what the event is showing empirically:
> "Tool poisoning via MCP is the top attack vector across every agent type."

35 of 121 BH2026 briefings (29%) are AI-focused. The dominant offensive research theme has
shifted from base-model manipulation to **autonomous agent exploitation** — this is the threat
surface our boundary discipline (auth-gated, remote-HTTP-only, approved-not-enabled) is
specifically designed to resist.
[[Straiker BH2026 analysis]](https://www.straiker.ai/blog/black-hat-usa-2026-ai-security-talks)

### 5.2 CVE-2026-21852 + CVE-2025-59536 (surfacing at BH2026 — historical)

Check Point Research's February 2026 disclosures (published in research, re-surfacing in
BH2026 conversations):
- **CVE-2026-21852** (CVSS 5.3): `enableAllProjectMcpServers: true` + `ANTHROPIC_BASE_URL`
  override → redirects Claude Code API traffic to attacker-controlled proxy → plaintext API
  key exfiltration. Patched in Claude Code v2.0.65+.
- **CVE-2025-59536**: RCE via malicious Claude Code project configuration files.

Both are **Claude Code client vulnerabilities**, not catalog server vulnerabilities. No catalog
action required. Enterprise operators should ensure Claude Code is updated to ≥v2.0.65.
[[Check Point Research]](https://research.checkpoint.com/2026/rce-and-api-token-exfiltration-through-claude-code-project-files-cve-2025-59536/)
[[Hacker News]](https://thehackernews.com/2026/02/claude-code-flaws-allow-remote-code.html)

### 5.3 Day 40 Clean Window for Cataloged Servers

All 19 cataloged servers remain `approved`/`public`. No demotions, no endpoint failures,
no new CVEs targeting any cataloged vendor endpoint.

### 5.4 Pending Audit Items (unchanged, priority unchanged)

1. **CVE-2026-25536 (PRIORITY):** Verify all TypeScript SDK-backed catalog vendors are on
   `@modelcontextprotocol/sdk >=1.26.0` or migrated to SDK v2.0.0.
2. **CIMD compliance:** Audit OAuth-gated vendors (DCR deprecated in 2026-07-28 spec).
3. **Server Cards sweep:** Poll `/.well-known/mcp/server-card.json` after SEP-2127 WG closes
   Aug 14 (9 days). Confirmed path: `mcp/server-card.json` (not `mcp.json`; see prior
   research note).

---

## 6. AWS Agent Registry — Namespace Migration Tomorrow (Aug 6)

The AWS Agent Registry moves from `bedrock-agentcore` to `agent-registry` namespace on
**August 6, 2026** (tomorrow). This is a Preview service; any team using it must update
endpoints, IAM policies, SDK clients, CLI scripts, and registry data before migration.

**Our `com.aws/mcp`** (AWS MCP Server, GA in us-east-1 + eu-central-1; IAM SigV4 auth via
mcp-proxy-for-aws) is a distinct GA product that is **NOT part of the Agent Registry
namespace migration**. No catalog action required.

Watch for GA announcement of AWS Agent Registry alongside or after the namespace migration —
if GA, assess as potential sync source.
[[AWS Agent Registry docs]](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry.html)
[[AWS Agent Registry migration guide]](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-get-started.html)

---

## 7. Snowflake Cortex AI Gateway — Still in Private Preview

No public preview launch as of Aug 5. Status unchanged from Aug 4:
- **Private preview** — 7 identity partner integrations (1Password, Aembit, Linx Security,
  Okta, SailPoint, Saviynt, and others).
- Snowflake is actively briefing enterprise customers at BH2026 this week.
- **Public preview** is scheduled but no date confirmed.

Watch for a public preview announcement following BH2026 close (Aug 6–8 window likely).
[[Snowflake Cortex AI Gateway]](https://www.snowflake.com/en/blog/enterprise-ai-security-agentic-mcp-governance/)
[[VentureBeat]](https://venturebeat.com/security/snowflake-launches-cortex-ai-gateway-to-control-ai-agents-and-prevent-runaway-enterprise-costs/)

---

## 8. SEP-2127 Server Cards — 9 Days to WG Close

SEP-2127 Working Group term ends **August 14** (9 days). No new outputs today.

The validator at [agent-ready.dev](https://agent-ready.dev/mcp-card-validator) remains live.
Some community discussion surfaces the path as the MCP endpoint URL appended with `/server-card`
(rather than the site-level `/.well-known/mcp/server-card.json`), suggesting the WG may
still be refining path conventions. We will confirm the final canonical path after Aug 14
WG close before running the audit sweep.
[[SEP-2127 PR]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)
[[Agent Ready validator]](https://agent-ready.dev/mcp-card-validator)

---

## 9. Catalog Hooks

All 19 cataloged servers remain `approved`/`public`. No demotions, no flags.

**Curate queue (unchanged):**
1. **HubSpot** (`mcp.hubspot.com`) — GA April 13, OAuth 2.1 + PKCE, one-click Claude
   connector, Leads read access added July. #1 priority for next `subregistry-curate` run.
   [[HubSpot GA]](https://developers.hubspot.com/changelog/remote-hubspot-mcp-server-is-now-generally-available)
2. **X/Twitter** (`api.x.com/mcp`) — verify gateway-compatible auth path (pay-per-use tiers,
   Production env enrollment required) before adding.

---

## 10. Near-Term Watches (Next 9 Days)

| Date | Event | Action |
|---|---|---|
| **Aug 5 (today)** | Black Hat MCPwned Day 1; Gateways IG 2pm | Read slides when published; check IG notes |
| **Aug 6 (tomorrow)** | MCPwned Day 2; AWS Agent Registry namespace migration; Gateways IG 4:30pm | Monitor slides + IG outputs; `com.aws/mcp` unaffected |
| Aug 6–8 | Snowflake Cortex AI Gateway public preview possible | Update landscape if launched |
| **Aug 7** | BH2026 close — MCPwned slides window | Check for slide publication |
| Aug 13–14 | AAIF MCP Dev Summit Seoul (co-located with OS Summit Korea) | Watch for governance/spec announcements |
| **Aug 14** | SEP-2127 Server Cards WG closes | Confirm canonical path; schedule `/.well-known` audit sweep |
| Aug 31 | SEP-2127 WG follow-on meeting | Post-WG implementation guidance |
| ASAP | CVE-2026-25536 + CIMD audit | Run `subregistry-audit` |
| ASAP | HubSpot curate | Run `subregistry-curate` |

---

## 11. Landscape Changes Today

- **No ranking changes** in Top 11. No new major landscape entrants.
- **Tanium Atlas MCP Server** added to landscape watch list (security-persona MCP endpoint;
  not a developer-tools catalog candidate).
- Scale numbers: Glama ~67,664 (stable/no new batch); PulseMCP ~22,090+ (stable). No
  MCPToplist update.
- Landscape.md `Last updated` bumped to today.
