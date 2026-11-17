# MCP Ecosystem Update — 2026-11-17

**Prepared by:** MCP Sub-Registry Orchestrator (autonomous daily pass)
**Scope:** What changed since yesterday's report (2026-11-16). Incremental pass: 1-day window.
**Today's date:** 2026-11-17

---

## Summary

This is a one-day incremental pass. Yesterday's report (2026-11-16) covered the major Oct/Nov
developments. Today's additions: Smithery proxy shutdown confirmed (Oct 31), IBM ContextForge
MCP Gateway CVE cluster (catalog-immune), AGNTCon + MCPCon North America full recap (Oct 22–23),
MCP spec governance updates (Nov 11), File Uploads WG draft extension, Notifications WG accepted,
and MCPCon Nairobi pre-event context (starts Nov 19).

---

## Registry Scale (unchanged from yesterday)

| Registry | Count | As of | Notes |
|---|---|---|---|
| **Glama** | ~121,515 | Nov 15, 2026 | Confirmed in yesterday's report. [[Glama]](https://glama.ai/mcp/servers) |
| **PulseMCP** | ~21,614–21,710 | late Oct 2026 | Flat; submissions still paused. [[PulseMCP]](https://www.pulsemcp.com/servers) |
| **Smithery (Arcade.dev)** | Directory-only | Nov 2026 | **Proxy + connection services SHUT DOWN Oct 31** (see §Smithery below). Directory stays live. [[Smithery]](https://smithery.ai/) |
| **Official MCP Registry** | ~47,267 active servers | Oct 21 est. | [[registry.modelcontextprotocol.io]](https://registry.modelcontextprotocol.io/) |
| **Our catalog** | 19 approved/public | — | All remote-HTTP; HubSpot + Intercom overdue for curate. |

---

## Smithery/Arcade.dev — Proxy Shutdown Confirmed (Oct 31, 2026)

**Smithery's connection services are offline.** As of October 31, 2026, Smithery shut down:
- Server URLs on `run.tools` and `server.smithery.ai`
- The Smithery API, Connect, and Toolbox
- Accounts, API keys, CLI, and SDK

**What survives:** `smithery.ai` remains a **directory** of MCP servers, now powered by
Arcade.dev, showing direct vendor-hosted MCP URLs (e.g., `mcp.linear.app/mcp` instead of
`linear.run.tools`). The registry function is preserved; the proxy/hosting function is gone.

**Catalog impact:** None. All 19 of our catalog entries use vendor-hosted direct endpoints,
not Smithery-proxied URLs. No action required.

**Concern to monitor:** Arcade also runs ToolBench, its own MCP server benchmark. The
combination of registry + benchmark in one company raises registry neutrality questions.
[[Smithery notice]](https://smithery.ai/future)
[[RuntimeWire: Arcade acquires Smithery]](https://runtimewire.com/article/arcade-acquires-smithery-agent-tool-supply-chain)
[[APITracker migration guide]](https://apitracker.io/smithery-migration)

---

## MCP Spec Governance — Nov 11 Updates

### More Predictable Release Cycle (Nov 11, 2026)

A Nov 11, 2026 blog post from the modelcontextprotocol team confirms:
- **Six-month spec cadence:** Next release still targeting **March 30, 2027**.
- **Luca Chang** joins as release manager for the next spec cycle.
- Priorities: MCP Roadmap priorities (agent communication, HTTP transport, agent identity, 
  progressive discovery, SDK DX) continue to be fast-tracked through the SEP process.

[[Releasebot MCP release notes]](https://releasebot.io/updates/modelcontextprotocol)

### File Uploads Working Group — Draft Extension Published

The File Uploads WG (lead: Den Delimarsky) has published a draft experimental extension:
- **Extension ID:** `io.modelcontextprotocol/files`
- **Basis:** SEP-2356 (declarative file inputs via `Tool.inputFiles` and `requestedFiles`)
- **Scope:** Tools and elicitation requests can declare file inputs; hosts show native file pickers;
  wire protocol format for passing user-selected content to servers.
- **Status:** Draft; **targets stable by year-end 2026** (support will remain optional).
- **Scope expanded (Oct):** WG added file *downloads* to its remit.
- **SEP-2631** closed and merged into this extension.

**Catalog relevance:** No schema change needed now. When the extension stabilizes and
>=3 catalog entries declare `inputFiles`, consider adding an optional `capabilities.fileUploads`
boolean to our schema.

[[MCP File Uploads WG]](https://modelcontextprotocol.io/community/working-groups/file-uploads)
[[MCP Blog: Exploring file uploads]](https://blog.modelcontextprotocol.io/posts/exploring-file-uploads-and-downloads-in-mcp/)

### Notifications Working Group — Polling/Push/Webhook Proposal Accepted (Nov 11)

The MCP Notifications WG had its proposal accepted on Nov 11, 2026, covering optional
polling, push, and webhook-based notification delivery. This addresses long-running agentic
workflows where servers need to signal completion or state changes asynchronously.
Directly relevant to MCP Tasks (see AAIF recap below).

[[MCP Bits #8 newsletter]](https://mcpbits.substack.com/p/mcp-bits-8)

---

## AGNTCon + MCPCon North America Recap (Oct 22–23, San Jose)

### AAIF Growth: 305 Members, 10 Projects

The Agentic AI Foundation now counts **305 member organizations** (60 new this quarter) across
10 active projects (up from 3 at founding).

New projects announced at the event:
1. **Agent Skills** (Anthropic donation) — reusable agent capability bundles; SEP-2640; relevant
   to our `.claude/skills/` structure.
2. **Open Responses** (OpenAI) — test-any-vendor-endpoint compliance suite.
3. **OpenEnv** (Hugging Face) — open agent execution environment.
4. **OpenSandbox** (Alibaba) — secure agent sandboxing primitives.

[[AAIF: Four cool things from AGNTCon + MCPCon]](https://aaif.io/blog/four-cool-things-from-agntcon-mcpcon)
[[InfoQ recap]](https://www.infoq.com/news/2026/10/agntcon-mcpcon-2026/)
[[Luca Berton blog]](https://lucaberton.com/blog/agntcon-mcpcon-north-america-2026/)

### MCP Tasks in Claude Code

Doria Parra (Anthropic) announced **MCP Tasks** support in Claude Code at the event: tool calls
that run for **minutes, hours, or even days** rather than seconds. This enables long-running async
tool execution — directly relevant to the Notifications WG work above.

The November 11 Notifications WG acceptance likely coordinates with Tasks support.

### Skills-over-MCP Architecture

A key theme: because MCP carries authentication context, server-side "skills" (capability bundles)
can vary by authenticated user identity. An engineer and designer can see different tools from the
same server endpoint. Directly relevant to §12.5 persona-based catalog views.

---

## Security — IBM ContextForge MCP Gateway CVE Cluster

Multiple CVEs were published for IBM ContextForge MCP Gateway in Oct/Nov 2026. **None affect any
server in our catalog** — these all affect the ContextForge gateway product, not the remote-HTTP
servers we index.

| CVE | CVSS | Description | Affected versions | Fix |
|---|---|---|---|---|
| **CVE-2026-53709** | 9.8 / 9.3 (v3/v4) | **Default JWT signing key** ships as "changeme"-equivalent; unauthenticated attacker mints admin tokens | <1.0.2 | Upgrade to v1.0.2 |
| **CVE-2026-18486** | 8.8 | jq filter exposes env vars (crypto keys, DB credentials) → enables admin token forging | <1.0.8 | Upgrade to v1.0.8, rotate secrets |
| **CVE-2026-77822** | 8.2 | SSRF via DNS rebinding in A2A invocation endpoint | ≤1.0.8 | Upgrade to v1.0.9 |
| **CVE-2026-78573** | High | Default credentials ("changeme") in 3 password config fields | <1.0.10 | Upgrade to v1.0.10 |
| **CVE-2026-18905** | High | DNS rebinding during tool invocation bypasses SSRF protection | ≤1.0.6 | Upgrade to v1.0.7 |
| **CVE-2026-53708** | 6.6 | DNS rebinding TOCTOU race bypasses SSRF check | <1.0.3 | Upgrade to v1.0.3 |
| **CVE-2026-8355** | 6.4 | SSRF through OAuth `token_url` field | 0.1.0–1.0.5 | Upgrade to v1.0.6 |
| **CVE-2026-11918** | Medium | Security filter bypass via nested payload structures | ≤1.0.4 | Upgrade to v1.0.5 |
| **CVE-2026-18484** | 6.5 | DoS via tool-name slug normalization collision | n/a | Patch available |

**Pattern:** IBM ContextForge MCP Gateway ships with dangerous defaults (default JWT key, default
"changeme" credentials) that make fresh deployments trivially exploitable. This is a deployment
hygiene failure — not a protocol-level flaw. The CVE-2026-53709 / CVE-2026-78573 pair is
particularly damaging: a fresh install is unauthenticated-admin-accessible out of the box.

**Catalog impact:** Zero. Our 19 servers are vendor-hosted remote-HTTP endpoints; they don't run
IBM ContextForge. The pattern reinforces why our catalog refuses to track *gateway products* as
server entries — they carry a different threat surface.

[[IBM Security: CVE-2026-53709]](https://www.ibm.com/support/pages/node/7285720)
[[Mend.io: CVE-2026-53709]](https://www.mend.io/vulnerability-database/CVE-2026-53709/)
[[Stack.watch: CVE-2026-8355]](https://stack.watch/vuln/CVE-2026-8355/)
[[OpenCVE: CVE-2026-11918]](https://app.opencve.io/cve/CVE-2026-11918)

### Other CVEs (All Catalog-Immune)

**CVE-2026-125926** (agentic-community/mcp-gateway-registry SSRF, CVSS High): Authenticated user
in affected gateway versions 1.0.3–1.34.0 can reach internal services via SSRF. Fixed in 1.35.0.
OSS gateway product, not a cataloged server.
[[CybersecurityNews]](https://cybersecuritynews.com/aws-mcp-gateway-security-flaw/)

**CVE-2026-68934** (code-review-mcp-server OS command injection, CVSS 8.7): Affects <1.5.3.
Community STDIO package. Not in catalog.
[[Strix.ai]](https://www.strix.ai/cve/CVE-2026-68934)

**CVE-2026-126681** (AWS Labs Timestream for InfluxDB MCP, CVSS 5.5): Prompt injection exposing
InfluxDB API token in tool output. Affects <0.0.19. Not in catalog.

**CVE-2026-126816** (aws-pricing-mcp-server path traversal, CVSS 5.5): Cost report tool writes
outside output directory. Affects <1.0.31. Note: this is an **AWS Labs community package**
(`awslabs/aws-pricing-mcp-server`), distinct from the **AWS MCP Server** (`com.aws/mcp`) in our
catalog — which is the official AWS MCP Server product. No action on our catalog entry.

**CVE-2026-129235/129236** (Kubeshark MCP): Argument injection + path traversal in Kubeshark's
Kubernetes monitoring MCP. CVSS 7.2 / 5.3. Not in catalog.

**Clean window for cataloged servers:** Day 85+ clean. No CVE targets any of the 19 approved remote-HTTP
servers in our catalog.

---

## Adoption Signal — Netskope Enterprise MCP Report

Netskope published enterprise MCP adoption data (source via MCP Bits newsletter):
- **Non-human entities connecting to remote MCP servers: +490% growth**
- **MCP-related events: +600% growth**
- 62% of observed MCP servers list tools without requiring sign-in (reinforces our auth-gated requirement)
- 36% of OAuth-capable MCP servers now support CIMD (new standard replacing DCR)
- 769 servers observed speaking 2026-07-28 spec (early adopters, out of ~121k indexed)

The auth-gated 100% rate of our 19 catalog entries compares favorably to the 62% sign-in rate
across the broader ecosystem.

[[MCP Bits #8]](https://mcpbits.substack.com/p/mcp-bits-8)

---

## Upcoming: MCPCon Nairobi (Nov 19–20, in 2 days)

The MCP Dev Summit Nairobi runs November 19–20, 2026 — the final AAIF global event of 2026.
- **Partnership:** Gates Foundation involvement confirmed per one source (treat with caution; unverified).
- **Livestream:** Available via AAIF's MCP project page at aaif.io.
- **Expectations:** Given MCPCon North America's depth (10 projects, 305 members, MCP Tasks), the
  Nairobi event may surface enterprise-MCP-in-emerging-markets patterns and additional AAIF
  organizational updates.

Action: Monitor `aaif.io/blog` Nov 19–21 for session outputs and any new AAIF project or spec
announcements. Update §13 and landscape.md after the recap publishes.

[[AAIF MCP project + livestream]](https://aaif.io/projects/model-context-protocol)
[[AAIF 2026 events]](https://aaif.io/news/agentic-ai-foundation-announces-global-2026-events-program)

---

## Catalog Hooks

**All 19 catalog servers remain approved/public.** No action triggered by today's research.

| Server | Finding | Action |
|---|---|---|
| `com.aws/mcp` | CVE-2026-126816 is for a *different* `aws-pricing-mcp-server` community package | No action — confirmed distinct from our entry |
| All 19 entries | IBM ContextForge CVEs are gateway product bugs, not catalog server bugs | No action |
| `com.hubspot/mcp` (not yet in catalog) | Sep 2026 update added write actions (pipeline updates, campaign publishing); monthly changelog active | Still #1 curate priority; `subregistry-curate` is the next skill to run |
| `com.intercom/mcp` (not yet in catalog) | No new information today | Still #2 curate priority |

---

## Sources Index

- [[MCP Bits #8]](https://mcpbits.substack.com/p/mcp-bits-8) — Notifications WG, Netskope data, Nov 11 release notes
- [[Releasebot MCP changelog]](https://releasebot.io/updates/modelcontextprotocol) — Nov 11 release manager announcement
- [[MCP File Uploads WG]](https://modelcontextprotocol.io/community/working-groups/file-uploads) — WG charter, SEP-2356
- [[Smithery notice]](https://smithery.ai/future) — Oct 31 shutdown details
- [[RuntimeWire: Arcade acquires Smithery]](https://runtimewire.com/article/arcade-acquires-smithery-agent-tool-supply-chain) — acquisition
- [[APITracker: Smithery migration]](https://apitracker.io/smithery-migration) — migration guide
- [[AAIF: Four cool things from AGNTCon + MCPCon]](https://aaif.io/blog/four-cool-things-from-agntcon-mcpcon) — 4 new projects
- [[InfoQ AGNTCon recap]](https://www.infoq.com/news/2026/10/agntcon-mcpcon-2026/) — AAIF 305 members, MCP Tasks
- [[Luca Berton blog]](https://lucaberton.com/blog/agntcon-mcpcon-north-america-2026/) — San Jose event recap
- [[IBM Security: CVE-2026-53709]](https://www.ibm.com/support/pages/node/7285720) — ContextForge default JWT
- [[Mend.io: CVE-2026-53709]](https://www.mend.io/vulnerability-database/CVE-2026-53709/) — CVSS details
- [[Stack.watch: CVE-2026-8355]](https://stack.watch/vuln/CVE-2026-8355/) — ContextForge OAuth SSRF
- [[CybersecurityNews: CVE-2026-125926]](https://cybersecuritynews.com/aws-mcp-gateway-security-flaw/) — gateway SSRF
- [[AAIF MCP project page]](https://aaif.io/projects/model-context-protocol) — Nairobi livestream
- [[HubSpot MCP community post]](https://community.hubspot.com/t/spotlight-feature-hubspot-mcp-server-updates/156456) — reauthentication note
