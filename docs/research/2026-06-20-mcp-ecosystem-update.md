# MCP Ecosystem Update — 2026-06-20

Daily research pass. Covers developments since the June 19 report
([2026-06-19-mcp-ecosystem-update.md](./2026-06-19-mcp-ecosystem-update.md)).
Focus: Backslash Security's three new attack surfaces in the MCP 2026-07-28 spec;
Atlassian SSE shutdown in 10 days; AAIF governance milestones; AWS Agent Registry and
MCP Tunnels still in preview; Qualys "Shadow IT" framing; SDK version updates;
HubSpot auth status for next curate run.

All external claims cited with source URLs.

---

## 1. Backslash Security: Three New Attack Surfaces in the 2026-07-28 Spec

Backslash Security published an analysis of the MCP 2026-07-28 Release Candidate (RC lock:
May 21, 2026; final spec: July 28, 2026) and identified three new attack surfaces introduced
by changes in the spec.
[[Backslash — New MCP Spec Opens Three New Attack Surfaces]](https://www.backslash.security/blog/new-mcp-spec-opens-new-attack-surfaces)

### 1a. MCP Apps (SEP-1865): iframe attack surface

MCP Apps lets servers ship interactive HTML interfaces that hosts render in a **sandboxed
iframe**. UI templates are declared upfront so hosts can prefetch and cache them before
anything runs; UI actions route back through the same JSON-RPC audit path as any tool call.
[[MCP Apps blog post]](https://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/)
[[ext-apps specification]](https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx)

**Security concern:** HTML rendered inside an IDE iframe does not generate outbound network
traffic visible to gateway-layer monitoring tools. Any prompt injection or data exfiltration
embedded in the rendered HTML goes through the iframe's postMessage channel, invisible to
a network-layer gateway. Detecting this class of attack requires **endpoint-level** visibility
into the IDE host process and the iframe sandbox itself — something no remote MCP gateway
can provide. Backslash frames this as a fundamental shift: "The new spec is moving security
to the endpoint layer, whether your security team is already there or not."

### 1b. Stateless transport + Mcp-Method / Mcp-Name header routing

The RC removes `initialize`/`initialized` handshake and `Mcp-Session-Id`. Routing now uses
new HTTP headers `Mcp-Method` and `Mcp-Name`, enabling load balancers and gateways to
dispatch without inspecting the JSON-RPC body.
[[MCP 2026-07-28 RC blog]](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)

**Security concern:** Gateways that relied on session context to enforce per-client policy
now need to reconstruct client identity from request-level signals only. Old DPI-based
detection patterns for malicious tool calls (that matched session + content) must be
rebuilt around stateless per-request context. This is an operational security migration
burden that many gateway operators will be slow to complete.

### 1c. Tasks extension: new lifecycle attack surface

Tasks graduated from experimental core to opt-in extension. Clients now drive work via
`tasks/get`, `tasks/update`, `tasks/cancel` against stateless task handles returned from
`tools/call`.

**Security concern:** Long-running task handles live outside the original request context.
A compromised server can accept a `tasks/update` from a client that doesn't own the
original task — if servers don't enforce task ownership, cross-client task hijacking
becomes possible. The spec doesn't mandate ownership enforcement.

### 1d. NeighborJack (resurfaces in new-spec context)

Originally documented in June 2025, NeighborJack is referenced again because the stateless
spec increases the number of MCP servers running as local HTTP listeners (no sticky session
needed). Backslash found hundreds of MCP servers binding to `0.0.0.0` (all network
interfaces) rather than `127.0.0.1`, making them reachable from the local network — a
co-working space or café attacker can connect directly to the MCP server, impersonate tools,
and execute OS commands if those tools expose shell access.
[[Virtualization Review — NeighborJack]](https://virtualizationreview.com/articles/2025/06/25/mcp-servers-hit-by-neighborjack-vulnerability-and-more.aspx)
[[CSO Online — Misconfigured MCP servers]](https://www.csoonline.com/article/4012712/misconfigured-mcp-servers-expose-ai-agent-systems-to-compromise.html)

**Catalog impact:** NeighborJack does not affect our remote-HTTPS catalog — our 19 approved
entries are hosted endpoints, not local listeners. However, operators who run locally-deployed
MCP servers alongside remote ones should audit local binding addresses.

---

## 2. AAIF Governance Milestone — 170 Member Organizations

The Agentic AI Foundation (AAIF), launched under the Linux Foundation with MCP, goose, and
AGENTS.md as founding projects, now has **170 member organizations** — reached in under
four months, compared to CNCF's membership at the same stage. The Technical Steering
Committee has approved a formal **project lifecycle policy** with three stages: Growth,
Impact, and Emeritus, opening the door for external projects to join.
[[Linux Foundation AAIF announcement]](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation)
[[AAIF blog — MCP Dev Summit NA 2026]](https://aaif.io/blog/mcp-is-now-enterprise-infrastructure-everything-that-happened-at-mcp-dev-summit-north-america-2026/)

**India summits complete:**
- **MCP Dev Summit Bengaluru** — June 9–10, 2026. Hands-on workshops; speakers included Angie
  Jones (VP Developer Experience, AAIF) and David Nalley (Director of Developer Experience,
  Amazon Web Services).
  [[Bengaluru event]](https://events.linuxfoundation.org/mcp-dev-summit-bengaluru/)
- **MCP Dev Summit Mumbai** — June 14–15, 2026. Co-located with OpenSearchCon India, Open Source
  Summit India, and KubeCon + CloudNativeCon India.
  [[Mumbai event]](https://events.linuxfoundation.org/mcp-dev-summit-mumbai/)

**SDK versions announced at MCP Dev Summit North America (April 2–3, NYC):**
- **Python SDK v1.27.0**: RFC 8707 OAuth resource validation, StreamableHTTP idle timeout,
  TasksCallCapability backport.
- **TypeScript SDK v2.0.0-alpha**: Standard Schema support, Fastify integration, TaskManager
  refactor.
[[MCP Dev Summit NA 2026 recap]](https://aaif.io/blog/mcp-is-now-enterprise-infrastructure-everything-that-happened-at-mcp-dev-summit-north-america-2026/)

> **Note on CVE-2026-25536**: The TS SDK v2.0.0-alpha is a separate alpha track. The patched
> release for the cross-client data leak (CVE-2026-25536) is v1.26.0 on the v1 stable track.
> Audit pass to verify catalog vendors are running ≥1.26.0 remains pending (carried from June 19).

---

## 3. Atlassian SSE Deprecation Deadline: June 30 (10 Days)

The Atlassian Rovo MCP Server's HTTP+SSE transport (`https://mcp.atlassian.com/v1/sse`)
is deprecated and **shuts down June 30, 2026** — 10 days from today. The replacement is
the Streamable HTTP endpoint (`https://mcp.atlassian.com/v1/mcp`).
[[Atlassian deprecation notice]](https://community.atlassian.com/forums/Atlassian-Remote-MCP-Server/HTTP-SSE-Deprecation-Notice/ba-p/3205484)
[[Jira MCP SSE migration video]](https://www.youtube.com/watch?v=RsoyrmlssfI)

**Catalog status:** Our entry `com.atlassian/mcp` already points to
`https://mcp.atlassian.com/v1/mcp` (updated in the June 18 audit that also fixed the Asana
V2 endpoint). No action needed — we are already on the correct endpoint.

This is the most visible industry-wide SSE→Streamable HTTP migration event this week.
Expect similar announcements from other vendors as the 2026-07-28 spec approaches GA.
Pattern: any vendor cataloged with an SSE-typed URL should be treated as at-risk.
[[MCP SSE migration guide]](https://www.channel.tel/blog/mcp-sse-to-streamable-http-migration)

---

## 4. AWS Agent Registry and MCP Tunnels — Still in Preview

### AWS Agent Registry
AWS Agent Registry (Amazon Bedrock AgentCore) entered preview on April 9, 2026. As of
June 20, 2026, it remains in **preview with no GA date announced**. During preview, cost is
zero; GA pricing will be per "Net Records."
[[AWS Agent Registry preview announcement]](https://aws.amazon.com/about-aws/whats-new/2026/04/aws-agent-registry-in-agentcore-preview)
[[AWS docs — Agent Registry]](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry.html)

The registry is a private org-scoped catalog: publish MCP servers, tools, agents, and skills;
control access via approval workflow; expose the registry itself as an MCP endpoint so builders
can discover tools from their IDEs. Not a public catalog.

**Watch signal:** When AWS Agent Registry reaches GA it becomes the strongest enterprise-scale
precedent for private sub-registries. Its pricing model (per record) will signal what enterprise
customers will pay for governed catalog access.

### MCP Tunnels
Announced at Code with Claude London, May 19, 2026. As of June 20, still in **research
preview** (beta; request access required). Built on Cloudflare transport; no uptime or
continuity commitment. Anthropic may modify or discontinue at any time.
[[The New Stack — MCP Tunnels]](https://thenewstack.io/anthropic-mcp-tunnels-sandboxes/)
[[InfoQ — MCP Tunnels]](https://www.infoq.com/news/2026/05/claude-mcp-tunnels/)
[[Claude API docs — MCP Tunnels]](https://platform.claude.com/docs/en/agents-and-tools/mcp-tunnels/overview)

**Catalog impact:** No action yet. When MCP Tunnels reaches GA, consider tracking
`remotes[].type: "mcp-tunnel"` as a new archetype for private-network servers (already
flagged in CLAUDE.md §13 next actions).

---

## 5. Enterprise Risk: "MCP Shadow IT" (Qualys) + CSA Data

### Qualys: MCP servers are the new Shadow IT (March 2026)
Qualys extended its TotalAI platform with MCP server discovery, inventory, and security
assessment. Their framing — MCP servers frequently evade traditional visibility by binding
to localhost, running on random high ports, or living inside developer tools — matches the
NeighborJack pattern. Many are deployed as experiments and become production dependencies
without formal approval.
[[Qualys — MCP Servers as Shadow IT]](https://blog.qualys.com/product-tech/2026/03/19/mcp-servers-shadow-it-ai-qualys-totalai-2026)

**Enterprise context (Gravitee, Feb 2026 survey):** Of ~3 million AI agents deployed across
750 enterprises surveyed, **47% are not actively monitored or secured** — ~1.5 million
unmanaged agents. 88% of surveyed organizations reported an AI agent-related security or
data privacy incident in the past 12 months.

### CSA survey: 82% of enterprises have unknown AI agents
The Cloud Security Alliance surveyed enterprises and found **82% have AI agents running
in their environments that IT is unaware of**. This independently validates the Shadow IT
framing and directly supports the curated sub-registry value proposition: if the catalog
is the approved list, the gap is the shadow list.
[[CSA survey — unknown AI agents]](https://finance.yahoo.com/sectors/technology/articles/cloud-security-alliance-survey-reveals-130000206.html)

---

## 6. Registry Scale Update

| Registry | Count (Jun 19) | Count (Jun 20) | Delta |
|----------|---------------|---------------|-------|
| Glama | ~36,986 | ~38,156 | +1,170 |
| PulseMCP | ~18,570+ | ~18,570+ (est.) | — |
| Official MCP Registry | ~9,652 (May 24 snapshot) | No new data | — |
| mcp.so | ~20,222 | No new data | — |

Glama's count of **38,156** (page title) is a notable single-day jump of ~1,170. No
announcement found explaining the spike — could reflect a batch indexing run or GitHub
scrape update.
[[Glama MCP servers]](https://glama.ai/mcp/servers)

PulseMCP has been growing at ~1,000+ new indexed servers per month in Q1–Q2 2026.
[[ChatForest MCP ecosystem 2026]](https://chatforest.com/guides/mcp-ecosystem-2026-state-of-the-standard/)

---

## 7. HubSpot MCP: OAuth Auth Issues in Community (Pre-Curate Check)

HubSpot MCP server reached GA on April 13, 2026. OAuth 2.1 with PKCE is required; no
Dynamic Client Registration (DCR) supported — clients need pre-registered Client ID + Secret.
[[HubSpot remote MCP GA]](https://developers.hubspot.com/changelog/remote-hubspot-mcp-server-is-now-generally-available)
[[HubSpot MCP developer docs]](https://developers.hubspot.com/mcp)

Community reports (LibreChat, Kiro IDE) show OAuth handshake failures when the client
doesn't support pre-registered credential flows:
[[LibreChat HubSpot OAuth issue]](https://github.com/danny-avila/LibreChat/discussions/11564)
[[Kiro DCR issue]](https://github.com/kirodotdev/Kiro/issues/8551)

**Curate guidance for next run (Comms & Support group):**
- Use endpoint `https://mcp.hubspot.com/mcp`.
- `authScheme: oauth2` with `pkceRequired: true`; note DCR is NOT supported.
- `authentication_type: "oauth2-pkce"` in catalog entry.
- HubSpot's public beta self-service auth app flow requires developers to create a HubSpot app first.
[[HubSpot self-service auth app beta]](https://developers.hubspot.com/changelog/public-beta-self-service-mcp-auth-apps-for-the-hubspot-remote-mcp-server)

---

## 8. Catalog Status Review

| Server | Status | Action |
|--------|--------|--------|
| `com.atlassian/mcp` | Endpoint already on `/v1/mcp` | No action; SSE shuts down June 30 (already fixed) |
| All TypeScript SDK vendors | Audit pending | CVE-2026-25536 — verify running SDK ≥1.26.0 |
| `com.github/mcp`, `com.sentry/mcp`, `com.stripe/mcp`, `com.linear/mcp`, `com.figma/mcp`, `com.notion/mcp`, `com.cloudflare/mcp`, `com.slack/mcp`, `com.neon/mcp`, `com.supabase/mcp` | Likely TypeScript SDK; audit needed | CVE-2026-25536 priority vendors |
| HubSpot MCP | Not yet in catalog | Queue for next curate run (Comms & Support group) |

All 19 current entries remain `approved` / `public` / remote-HTTPS. No demotions.

---

## 9. Cumulative Threat Landscape (updated)

| Threat | Class | Status | Our exposure |
|--------|-------|--------|--------------|
| SANDWORM_MODE (June 16, 2026) | npm worm → MCP config injection | Active | None — remote-HTTP catalog |
| Miasma Waves 1–3 (June 1/3/17, 2026) | npm supply chain worm → RAT | Active, escalating | None — remote-HTTP catalog |
| Agentjacking via Sentry events (June 12) | Trust-conduit injection via MCP data | Active; Sentry won't fix | Operator risk; endpoint auth-gated |
| OX Security STDIO RCE (April 2026) | 200k+ instances; STDIO design flaw | Ongoing | Immune — no STDIO in catalog |
| CVE-2026-25536 | SDK cross-client data leak (TS ≤1.25.3) | Patched in 1.26.0 | Audit pass pending |
| BlueRock SSRF (2026) | 36.7% of 7k MCP servers SSRF-vulnerable | Ongoing | Vendor responsibility |
| CVE-2026-27825/27826 MCPwnfluence | CVSS 9.1 RCE + SSRF in mcp-atlassian | Resolved (patched 0.17.0) | Not in catalog |
| MCP Apps iframe attack surface (new) | Endpoint-layer attack; invisible to network gateways | Active with new spec (July 28) | Vendor responsibility; registry boundary is catalog-layer |
| NeighborJack (0.0.0.0 binding) | Local network MCP server exposure | Ongoing; resurfaces with stateless spec | Does not affect our remote-HTTPS entries |
| MCP Shadow IT (Qualys, March 2026) | Unmanaged MCP servers in enterprise environments | Active; 47% of agents unmonitored | Sub-registry approval workflow is the mitigation |

---

## 10. Key Dates and Watch Points

| Date | Event |
|------|-------|
| **June 30, 2026** | Atlassian SSE endpoint shuts down — catalog already correct |
| **July 28, 2026** | MCP 2026-07-28 spec GA — stateless core, MCP Apps, Tasks extension, auth hardening |
| **Aug 14, 2026** | SEP-2127 Working Group term ends (MCP Server Cards) |
| **Q4 2026** | Cross-app access (AAIF roadmap); MCP Tunnels GA watch |
| **TBD** | AWS Agent Registry GA — signals enterprise pricing for private catalog access |

---

## Summary

No new zero-days or active supply chain attacks landed between June 19–20. The dominant
signal today is **architectural**: the 2026-07-28 RC spec, now 38 days from final publication,
opens three new security surfaces that bypass gateway-layer detection. Our remote-HTTPS,
curation-layer catalog is structurally immune to the supply chain worm class and to
NeighborJack. The iframe/MCP Apps attack surface is a vendor implementation concern, not a
catalog concern. The most urgent operational action remains the pending **CVE-2026-25536
audit pass** for TypeScript SDK vendors.

AAIF's 170-member growth and the completion of the India MCP Dev Summits signal protocol
governance is maturing — the foundation is consolidating faster than CNCF did. AWS Agent
Registry and MCP Tunnels remaining in preview means no catalog schema change is warranted yet.
