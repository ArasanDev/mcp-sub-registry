# MCP Ecosystem Update — 2026-07-10

**Produced by:** MCP Sub-Registry autonomous research routine
**Covers:** 2026-07-09 EOD → 2026-07-10
**Prior report:** [2026-07-09-mcp-ecosystem-update.md](./2026-07-09-mcp-ecosystem-update.md)

---

## 1. Headline Summary

- **Glama crosses 53,151 servers** (+570 vs July 9; 7,956 connectors; 366,331 tools) — continued
  acceleration into the July 28 spec window.
- **PulseMCP jumps to 21,330+** (+920 vs July 8 peak; a one-day batch-indexing spike or catch-up
  reconciliation; largest single-day PulseMCP move recorded this research series).
- **Salesloft MCP Server announced (July 9)** — Clari + Salesloft launched a hosted MCP server
  now natively listed in Anthropic's Claude connector directory; sales/revenue persona catalog
  candidate (watch list).
- **"What Happens Locally, Leaks Globally" (arxiv:2606.21338)** — academic paper analyzes 10,655
  MCP servers; 12.4% have confirmed privacy leakage risks; credentials are the dominant entity
  class (56.22%). Directly validates our secret-names-only schema design.
- **WebMCP MSTI (arxiv:2606.06387)** — new academic attack taxonomy: Mid-Session Tool Injection
  exploits WebMCP's live tool registration lifecycle via AbortSignal hijacking or race conditions.
  Not a catalog-side risk; relevant to gateway operators using WebMCP.
- **AAIF "MCP Is Now Enterprise Infrastructure"** — new blog with Uber production stats: 5,000+
  engineers, 10,000+ internal services, 60,000+ agent executions per week on MCP.
- **Security**: Clean window continues (Day 12 — no new CVEs affecting cataloged servers since
  July 7). Spec countdown: **18 days** to July 28 final.

---

## 2. Registry & Ecosystem Scale

### Glama — 53,151 Servers

Glama's registry page now reports **53,151 MCP servers** (up from 52,581 on July 9, +570 in 24h),
with **7,956 remote connectors** and **366,331 total tools** — the most granular public tool
inventory in the ecosystem. The connector and tool counts also grew materially (+222 connectors,
+6,770 tools vs yesterday), suggesting active new server registrations rather than just metadata
updates.

[[Glama MCP Servers]](https://glama.ai/mcp/servers)

### PulseMCP — 21,330+ Servers

PulseMCP's directory now shows **21,330+** servers — up from the 20,410+ reading on July 8 (+920,
the largest single-day jump in this research series). This magnitude suggests either a batch
indexing reconciliation (similar to Glama's +5,868 spike on June 22) or successful crawler
coverage of a previously missed cluster of repositories. The remote-only filtered view shows
21,170+, indicating the preponderance of this growth is in remote or hybrid servers.

[[PulseMCP Servers]](https://www.pulsemcp.com/servers)

### Cross-Registry Estimate

With Glama at 53,151, PulseMCP at 21,330+, Smithery at ~7,000, and mcp.so at ~20,222:

| Registry | Count (July 10) | vs July 9 |
|----------|-----------------|-----------|
| Glama | 53,151 | +570 |
| PulseMCP | 21,330+ | +920 est. |
| mcp.so | ~20,222 | — |
| Smithery | ~7,000 | — |
| **Cross-registry total** | **~74,500+** | +1,490 |

Trust gap vs. our catalog: **~74,500+ indexed vs. 19 approved**. The gap is the product.

[[MCPToplist]](https://mcptoplist.com/)

---

## 3. Player Updates

### Salesloft MCP Server — Revenue Intelligence, Natively in Claude Connector Directory

**Clari + Salesloft** announced on July 9, 2026 that they are launching a hosted MCP Server that
opens live revenue data to every major AI ecosystem. The headline development for our catalog:
**Salesloft is now natively listed in Anthropic's Claude connector directory** (343 verified
integrations) — with no custom setup required by end users.

| Property | Detail |
|----------|--------|
| Auth model | OAuth (Salesloft user auth; StackOne Connect handles token exchange, storage, refresh) |
| Transport | Remote hosted MCP (Streamable HTTP; Clari-operated) |
| Coverage | Salesloft Cadence + activity data, Clari Copilot call intelligence (topics/keywords), Clari forecasting + deal inspection data |
| Planned write-back | AI tools can take action inside Salesloft without revenue data leaving the platform |
| AI ecosystem support | Claude (native), ChatGPT, Microsoft Copilot, Google Gemini, Salesforce Agentforce |
| Planned custom connectors | Microsoft Copilot + Google Gemini connectors in progress (late summer 2026) |

**Catalog assessment**: Salesloft/Clari is a sales/revenue intelligence platform. The endpoint is
vendor-hosted and Anthropic-blessed (native connector directory listing), which meets our quality
bar. However, the current catalog persona is developer tools + developer productivity. Salesloft
fits a future **sales/revenue persona** bundle per §12.5 — add to the watch list rather than the
current curate queue. The OAuth-gated auth model and Anthropic connector directory inclusion are
both positive trust signals.

[[Yahoo Finance: Salesloft MCP Announcement]](https://finance.yahoo.com/technology/ai/articles/salesloft-sets-pace-mcp-bringing-173800883.html)
[[Salesloft MCP Newsroom]](https://www.salesloft.com/company/newsroom/clari-salesloft-forecasting-execution-mcp-server)
[[Salesloft Help Center: MCP Server]](https://help.salesloft.com/s/article/Salesloft-MCP-Server?language=en_US)

### AAIF "MCP Is Now Enterprise Infrastructure" — Uber Production Stats

The Agentic AI Foundation published a new blog post **"MCP Is Now Enterprise Infrastructure:
Everything That Happened at MCP Dev Summit North America 2026"** summarizing the April 2–3 Summit
outcomes. The key new data point:

**Uber MCP production deployment (disclosed at Summit):**
- 5,000+ engineers using MCP-backed agents
- 10,000+ internal services with MCP interfaces
- 1,500+ monthly active agents
- 60,000+ agent executions per week

This is the most specific large-enterprise production deployment stat in the public record for MCP.
AWS also disclosed at the Summit that MCP is a "core building block" for Amazon's internal MCP
discovery infrastructure and open-sourced their `agent-sop` project. The Summit ran 95+ sessions
across four tracks; 23/95 sessions (24%) focused on security — the highest security density of any
MCP event to date.

[[AAIF: MCP Is Now Enterprise Infrastructure]](https://aaif.io/blog/mcp-is-now-enterprise-infrastructure-everything-that-happened-at-mcp-dev-summit-north-america-2026/)
[[Futurum Group: MCP Dev Summit 2026 Readout]](https://futurumgroup.com/insights/mcp-dev-summit-2026-aaif-sets-a-clear-direction-with-disciplined-guardrails/)
[[Digital Applied: MCP Dev Summit Readout]](https://www.digitalapplied.com/blog/mcp-dev-summit-2026-readout-protocol-roadmap-analysis)

### Runlayer 1.25.0 — Shadow MCP Visibility + 14 New Connectors

Runlayer's product update 1.25.0 (published January 23, 2026; surfaced in today's research sweep)
introduced capabilities material to the sub-registry's use case:

- **Shadow MCP server visibility**: Admins can see where *unmanaged* ("shadow") MCP servers are
  being configured on developer devices — with trends over time and suggestions for where managed
  alternatives exist. This is a direct enterprise implementation of the discovery → approval
  governance loop our catalog enables.
- **14 new connectors added**: Braintrust, Gong, Snowflake (full OAuth), Lever, Workday,
  Salesforce, Socket.dev, Scanner.dev, Amplitude, HuggingFace, BrowserUse, Heroku,
  CrowdStrike Falcon, Microsoft Agent 365.
- **Metrics tab**: Per-connector tool call success rate, failure patterns, security violation
  counts, and P95 latency — the observability layer our catalog's `verifiedAt` field links into.
- Runlayer named to **Notable Capital & Morgan Stanley 2026 Rising in Cyber list** (voted by 150
  CISOs) — the strongest enterprise security legitimacy signal since the $30M Series A.

[[Runlayer Product Update 1.25.0]](https://www.runlayer.com/blog/runlayer-product-update-1-25-0)

### MCPCon Shanghai — Session Abstracts Still Inaccessible

The AGNTCon + MCPCon China event (Sept 6–7, Shanghai International Convention Center) continues
to list the main program URL as returning 403. The Sessionize CFP page indicates the schedule
announcement was expected July 8, but abstracts are not publicly reachable. Will re-check in the
July 12–14 research window.

[[AGNTCon + MCPCon China]](https://www.lfopensource.cn/mcp-dev-summit-shanghai/)

---

## 4. MCP Specification

### RC Countdown: 18 Days to July 28

No new spec blog posts from `blog.modelcontextprotocol.io` since the June 29 SDK betas
announcement. The 10-week validation window for Tier 1 SDKs is in its final stretch:

- **Python SDK v2**: `mcp==2.0.0b1` live; stable v2.0.0 targets July 27.
- **TypeScript SDK v2**: `@modelcontextprotocol/server` v2.0.0-beta.2 (July 2) live;
  stable targets July 28. CVE-2026-25536 audit still pending (confirm all TS-SDK catalog vendors
  running ≥1.26.0).
- **Breaking changes confirmed** (no changes since May 21 lock): stateless core; no `Mcp-Session-Id`;
  no `initialize`/`initialized` handshake; mandatory `Mcp-Method` / `Mcp-Name` /
  `MCP-Protocol-Version: 2026-07-28` headers; MCP Apps + Tasks as official extensions.
- No catalog schema change required.

The **WorkOS** and **ChatForest** builder guides (July 2026) confirm there is **no ambiguity** about
breaking changes: every server that currently relies on session ID state or the initialize handshake
must refactor before July 28 to stay compatible with compliant clients.

[[MCP Spec RC Blog]](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)
[[WorkOS: MCP 2026 Agent Auth Changes]](https://workos.com/blog/mcp-2026-spec-agent-authentication)
[[ChatForest: Builder Guide to RC Breaking Changes]](https://chatforest.com/builders-log/mcp-spec-2026-07-28-release-candidate-stateless-breaking-changes-builder-guide/)

---

## 5. Security

### Day 12 Clean Window — No New CVEs Affecting Cataloged Servers

No new CVEs or security incidents affecting cataloged MCP servers on July 9–10. 12 consecutive
days clean. All 19 catalog entries remain approved/public.

### "What Happens Locally, Leaks Globally" — Privacy Leakage in 10,655 MCP Servers

Academic paper (arxiv:2606.21338, June 2026) applying a cross-language static analysis framework
(MCPPrivacyDetector) to 10,655 real-world MCP servers:

| Metric | Finding |
|--------|---------|
| Servers with privacy-sensitive data | 6,657 (62.5%) |
| Servers with confirmed privacy leakage risks | 1,317 (12.4% of total; 19.8% of sensitive-data servers) |
| False positive rate | 4.0% (192/200 confirmed genuine leaks) |
| Dominant entity class | Credentials (API keys, tokens) — 56.22% |
| Second entity class | Contact info (PII) — 29.78% |

**Leakage rate by registry:**
| Registry | Leakage Rate |
|----------|-------------|
| MCP.io | 18.1% |
| Smithery | 15.1% |
| PulseMCP | 13.2% |
| MCPMarket | ~12% |
| Awesome MCP | ~12% |
| Cursor Directory | 9.3% |
| Glama | 8.8% |

**Key mechanism**: leakage is largely protocol-induced — credentials, API keys, and PII cross the
local/LLM boundary by being returned, logged, or raised inside a tool handler, with no explicit
outbound request in source code. This is not an attack-induced vulnerability; it is the default
behavior when developers embed credentials in tool return values or error messages.

**Sub-registry implication**: Our schema stores secret *names* only — never values. This is the
correct structural response to exactly the leakage pattern this paper documents. The paper also
confirms that Glama (8.8%) has the lowest leakage rate among major registries studied — a positive
signal for using Glama as a discovery source, though the rate is still non-zero and individual
entries require verification.

[[arxiv:2606.21338]](https://arxiv.org/pdf/2606.21338)

### WebMCP MSTI — Mid-Session Tool Injection via Third-Party Scripts

A new academic paper (arxiv:2606.06387) documents **WebMCP Tool Surface Poisoning** — specifically
a class called **Mid-Session Tool Injection (MSTI)**. WebMCP is an emerging protocol that allows
websites to expose tools directly to AI agents browsing the web, creating a new tool registration
surface distinct from the MCP server registration model.

MSTI attack classes:
- **Tool Hijacking**: Attackers use third-party scripts to interfere with tool registration via
  `AbortSignal` API or race conditions during the registration window. This modifies which tools
  the agent sees mid-session.
- **Tool Framing**: Manipulating tool metadata (`name`, `description`, `readOnlyHint`, `inputSchema`)
  to alter the agent's understanding of tool semantics without changing the tool itself.

**Catalog relevance**: MSTI is a WebMCP and client-side concern — our catalog does not expose a
runtime surface. The relevant control is at the gateway layer (tool call allow/deny policy) and
the MCP client layer (tool registration origin verification). Noting here because as WebMCP
adoption grows, catalog servers may declare WebMCP compatibility; the gateway operator needs to
apply identity binding controls before trusting WebMCP-sourced tools.

[[arxiv:2606.06387 — WebMCP Tool Surface Poisoning]](https://arxiv.org/abs/2606.06387)
[[Adversa AI: July 2026 Security Resources]](https://adversa.ai/blog/top-mcp-security-resources-july-2026/)

### "Defending Model Context Protocol" — Architectural Governance Framework

Security Boulevard (cross-posted from Gopher Security, July 7, 2026) published **"Defending Model
Context Protocol: A Framework for Future-Proof AI Security"**, arguing that MCP's centralization of
agent-to-tool connectivity creates a high-value target that cannot be secured by prompt sanitization
alone. The article calls for:

1. **Architectural agentic governance** — registry-level verification before runtime exposure.
2. **Schema manipulation prevention** — signed tool manifests (consistent with Microsoft's July 2
   requirement) to prevent mid-description injection.
3. **Identity integrity across long-lived sessions** — session reuse without re-auth creates
   lateral movement paths.

All three control points are embodied by the sub-registry's `approved` status + `verifiedAt`
timestamp + secret-names-only schema. This is the third independent framework (after NSA guidance
and OWASP MCP Top 10) to frame registry-level approval as the foundational security control.

[[Security Boulevard: Defending MCP]](https://securityboulevard.com/2026/07/defending-model-context-protocol-a-framework-for-future-proof-ai-security/)
[[Gopher Security Blog]](https://www.gopher.security/blog/defending-model-context-protocol-ai-security)

---

## 6. Catalog Hooks

Checking `data/default-curated-servers.json` (19 entries) against today's findings:

| Server | Finding | Action |
|--------|---------|--------|
| All 19 | Day 12 clean security window | None |
| All TypeScript SDK vendors | CVE-2026-25536 + CVE-2026-0621 audit still pending (≥1.26.0 check) | `subregistry-audit` — overdue; **priority #1** |
| `com.sentry/mcp` | MSTI / Agentjacking reconfirmed — endpoint remains 401-gated; operators must treat Sentry event content as untrusted | No demotion; note stands |
| — | Salesloft MCP (Clari, July 9) — Anthropic connector directory, vendor-hosted, OAuth-gated | Watch list: **sales persona bundle** per §12.5; not current curate queue |
| — | HubSpot `mcp.hubspot.com/mcp` — still #1 curate priority | Curate at next `subregistry-curate` run |
| — | X MCP `api.x.com/mcp` — still #2 curate priority; xurl headless auth pending | Verify before curating |
| All | Spec RC T-18 days; no catalog schema change needed | None |

No demotions or emergency re-verifications required today.

---

## 7. Landscape Assessment

No ranking changes needed today. The two material field movements:

1. **Scale update**: Glama 53,151 and PulseMCP 21,330+ are new highs; updating landscape.md.
2. **Research validation**: Three independent security frameworks ("Defending MCP" + MSTI paper +
   "What Happens Locally" paper) all converge on registry-level approval as a foundational control.
   The privacy leakage paper is the first large-scale empirical demonstration of the problem our
   catalog is designed to solve.

**Standing assessment unchanged:** White space for a focused, standalone curated catalog with
a gateway projection remains uncrowded. Enterprise adoption is now production-scale (Uber at
60k+ executions/week on MCP). The urgency of curation quality increases as scale increases.

---

## 8. Next Research Focus

- **July 12–14**: Re-check MCPCon Shanghai session abstracts — expected to become accessible.
- **Ongoing #1**: TypeScript SDK CVE-2026-25536 audit (≥1.26.0 for all TS vendors in catalog).
  Now 12 days overdue as a planned action; schedule `subregistry-audit` pass.
- **July 27**: Python SDK v2.0.0 stable ships.
- **July 28**: MCP spec final ships — diff RC vs. final to confirm no catalog schema change.
- **Next curate run**: HubSpot (`https://mcp.hubspot.com/mcp`, OAuth 2.1 + PKCE, no DCR),
  then X (`https://api.x.com/mcp`, verify headless auth).
- **Sales persona watch list**: Salesloft/Clari now in Anthropic connector directory — monitor
  for a stable hosted endpoint URL before considering for the sales persona bundle (§12.5).
