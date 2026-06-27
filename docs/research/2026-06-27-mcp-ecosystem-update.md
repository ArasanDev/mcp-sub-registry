# MCP Ecosystem Update — 2026-06-27

Daily research pass. Covers developments since the June 26 report
([2026-06-26-mcp-ecosystem-update.md](./2026-06-26-mcp-ecosystem-update.md)).
Focus: registry scale update (Glama 49,010 / PulseMCP 19,620+); Bitwarden CLI supply
chain attack — first documented targeting of MCP config files and AI coding tool
credentials; MCP Python SDK v2 beta due June 30; AWS Agent Registry new preview features;
Atlassian SSE shutdown in 3 days; agentic-community/mcp-gateway-registry bi-weekly cadence;
SEP-2127 Go library published; spec countdown 31 days.

All external claims cited with source URLs.

---

## 1. Registry Scale: Glama 49,010 / PulseMCP 19,620+ / Spec Countdown 31 Days

### Glama

Glama's MCP server index has crossed **49,010** as of the June 27 indexing run — up from
48,480 on June 26, a single-day gain of **~530 servers**. Growth rate remains 400–530
servers per day, consistent with automated GitHub and npm indexing.

[[Glama MCP servers]](https://glama.ai/mcp/servers)

### PulseMCP

PulseMCP's hand-reviewed directory now shows **19,620+** servers, up from 19,500+ on June
25–26 — a gain of **~120 servers in approximately two days**. The slower growth rate
relative to Glama reflects manual editorial review.

[[PulseMCP directory]](https://www.pulsemcp.com/servers)

### Cross-registry estimate

Combined estimate across Official MCP Registry, Glama, Smithery, PulseMCP, and mcp.so:
**~74,000+ indexed MCP servers** (MCPToplist cross-registry count reached 72,503 on June
23; Glama alone added ~1,500+ in four days since). Our curated set: **19 approved**. The
trust gap continues to widen; the sub-registry's value proposition is unchanged.

### Spec countdown

**31 days** to the July 28, 2026 final MCP specification release. RC locked May 21.

[[MCP RC blog]](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)

---

## 2. Bitwarden CLI Supply Chain Attack — First Documented MCP Config File Targeting

**Date of attack:** April 22, 2026 (5:57 PM – 7:30 PM ET; 90-minute exposure window).

`@bitwarden/cli@2026.4.0` on the public npm registry contained a malicious payload for
approximately **90 minutes** on April 22, 2026. The attack vector was a compromised GitHub
Actions workflow in Bitwarden's CI/CD pipeline — consistent with the broader Shai-Hulud /
Checkmarx campaign pattern (Miasma Waves 1–3, SANDWORM_MODE).

### Why this matters to a curated sub-registry

This is documented as **the first supply chain attack that explicitly targeted AI coding
assistant credentials and MCP configuration files**. The payload collected:
- Secrets and tokens across Azure, AWS, GitHub, GCP, and npm
- SSH material and shell history
- **AI tooling configuration and MCP-related files** — specifically probing for
  Claude Code, Cursor, Codex CLI, and Aider config files containing MCP server definitions

The malware included a dedicated module targeting authenticated AI coding assistants, not
just cloud credentials. Stolen data was AES-256-GCM encrypted and exfiltrated to
attacker-controlled GitHub repositories (a dead-drop C2 pattern that survives domain seizure).

**Scope:** ~334 downloads of the malicious version; Bitwarden vaults remained safe; CI
tokens were the primary credential risk.

**Attribution:** Part of the Shai-Hulud / Checkmarx campaign (same worm family as
Miasma Waves 1–3, IronWorm, SANDWORM_MODE). Malware reinfects all packages a victim npm
token can publish — the self-propagating worm mechanism.

### Catalog impact

Bitwarden is not in our curated catalog. No direct action required. However, this attack
establishes a new threat pattern:

> MCP configuration files — which contain server endpoint URLs and auth tokens — are now
> a high-value exfiltration target for supply chain attacks.

Operators who store MCP server credentials in config files alongside their npm-managed
toolchains should treat their MCP config as a first-class secret surface. Our schema
stores secret **names**, never values — the correct design.

[[SecurityWeek — Bitwarden npm supply chain attack]](https://www.securityweek.com/bitwarden-npm-package-hit-in-supply-chain-attack/)
[[OX Security — Shai-Hulud / Bitwarden CLI]](https://www.ox.security/blog/shai-hulud-bitwarden-cli-supply-chain-attack/)
[[Endor Labs — Shai-Hulud third coming]](https://www.endorlabs.com/learn/shai-hulud-the-third-coming----inside-the-bitwarden-cli-2026-4-0-supply-chain-attack/)
[[Socket.dev — Bitwarden CLI compromised]](https://socket.dev/blog/bitwarden-cli-compromised)
[[Palo Alto Unit 42 — npm supply chain monitoring]](https://unit42.paloaltonetworks.com/monitoring-npm-supply-chain-attacks/)

---

## 3. MCP Python SDK v2 Beta Due Tomorrow — June 30

The MCP Python SDK v2 release schedule is now explicit and imminent:

| Milestone | Date |
|---|---|
| v2.0.0a1 alpha | June 11, 2026 |
| **v2.0.0b1 beta** | **June 30, 2026 (tomorrow)** |
| Stable v2.0.0 | July 27, 2026 (1 day before final spec) |

**Breaking change:** The beta introduces `2026-07-28` spec compliance — stateless core,
no `Mcp-Session-Id`, no initialize handshake, new `Mcp-Method`/`Mcp-Name` headers. Any
project with `mcp` as a dependency should add an upper bound `mcp>=1.27,<2` before the
stable release lands to avoid auto-upgrade breakage.

**Catalog relevance:** Vendors in our catalog who use the Python SDK to build their
remote MCP server (e.g., Sentry, Stripe, Vercel) need to ship v2-compatible versions
before July 28 to stay compatible with v2-only clients. The beta landing tomorrow gives
them a one-month implementation window (June 30 → July 28). This is the pending
**CVE-2026-25536 (cross-client data leak)** remediation path for TypeScript SDK users,
and the equivalent compliance path for Python SDK users.

[[MCP Python SDK — GitHub]](https://github.com/modelcontextprotocol/python-sdk)
[[Context Studios — MCP v2 alpha analysis]](https://www.contextstudios.ai/blog/mcp-v2-alpha-the-july-28-protocol-shift-to-plan-for)
[[MCP RC blog]](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)

---

## 4. AWS Agent Registry — New Preview Features

The **AWS Agent Registry** (Amazon Bedrock AgentCore, Preview since April 9, 2026) shipped
two new features in its latest release notes:

1. **Web Search as MCP connector:** A fully managed Web Search tool is now exposed as a
   built-in connector target on the AgentCore Gateway using MCP. It combines a proprietary
   Amazon web index with structured knowledge graph data; all data residency stays within
   the AWS environment (zero data egress). Agents query via standard MCP tool calls.

2. **Bedrock Guardrails in policy:** Guardrails now evaluates agent outputs and
   gateway-target inputs for prompt injection attempts, harmful content, and sensitive data
   exposure — giving enterprises safety/security enforcement at the MCP gateway layer.

**Registry relevance:** The AgentCore model — private org catalog + policy enforcement +
MCP-exposed tools — continues to build toward a full enterprise registry. Still Preview;
no GA date announced. The integration of Guardrails at the gateway layer is the closest
AWS has come to runtime governance that is distinct from the registry catalog, which is
the correct separation.

[[AWS Agent Registry — Preview announcement]](https://aws.amazon.com/about-aws/whats-new/2026/04/aws-agent-registry-in-agentcore-preview/)
[[AWS Agent Registry — docs]](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry.html)
[[AWS governing AI assets at scale — open source blog]](https://aws.amazon.com/blogs/opensource/governing-ai-assets-at-scale-with-mcp-gateway-and-registry/)
[[AWS Bedrock AgentCore release notes]](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/release-notes.html)

---

## 5. Atlassian SSE Shutdown — T-3 Days (Catalog Clear)

The Atlassian HTTP+SSE endpoint (`https://mcp.atlassian.com/v1/sse`) shuts down in
**3 days on June 30, 2026**. Our catalog entry `com.atlassian/mcp` is already on
Streamable HTTP (`https://mcp.atlassian.com/v1/mcp`, `type: streamable-http`). No action
required.

Note: Atlassian documentation also references a `/v1/mcp/authv2` path for the OAuth v2
flow. Our catalog entry should be verified post-shutdown to confirm the exact active path.
This is a lower-priority follow-up (the primary endpoint is the same).

The SSE deprecation wave is now ecosystem-wide. Any community MCP registry entries still
pointing to `mcp.atlassian.com/v1/sse` will break in 3 days — a useful test of other
registries' freshness.

[[Atlassian SSE deprecation notice]](https://community.atlassian.com/forums/Atlassian-Remote-MCP-Server/HTTP-SSE-Deprecation-Notice/ba-p/3205484)
[[YouTube — Jira MCP SSE migration guide]](https://www.youtube.com/watch?v=RsoyrmlssfI)

---

## 6. agentic-community/mcp-gateway-registry — Bi-Weekly Release Cadence

The OSS `agentic-community/mcp-gateway-registry` project (an enterprise-ready MCP Gateway
+ Registry combining Keycloak/Entra OAuth, dynamic tool discovery, and unified access for
AI agents and coding assistants) continues to ship **releases every two weeks**.

Recent notable additions as of June 2026:
- **Coding-assistant OAuth integration** (v1.25.0): Direct OAuth flow for VS Code, Cursor,
  Claude Code integrations
- **Client ID Metadata Document (CIMD) support**: Aligns with OAuth 2.0 Dynamic Client
  Registration spec used by enterprise identity providers
- **RFC 8707 resource-parameter enforcement**: Prevents token reuse across resource
  servers — mitigates a class of cross-server injection attacks

**Registry relevance:** This is an active and increasingly specification-aligned OSS
gateway+registry. The bi-weekly release cadence and focus on enterprise identity (Keycloak,
Entra, CIMD, RFC 8707) makes it a strong reference implementation for separation of
registry from runtime. It remains on our watch list rather than the main ranking — it's a
building block, not a commercial competitor.

[[agentic-community/mcp-gateway-registry — GitHub]](https://github.com/agentic-community/mcp-gateway-registry)

---

## 7. SEP-2127 MCP Server Cards — Go Reference Library Published

A Go library implementing **SEP-2127 MCP Server Cards** has been published:
[`github.com/olgasafonova/mcp-servercard-go`](https://github.com/olgasafonova/mcp-servercard-go).
This joins the Python reference implementation (`cognimata/mcp-server-card-demo`) as a
second language library targeting the `/.well-known/mcp/server-card.json` canonical path.

The existence of multi-language libraries indicates SEP-2127 adoption is building ahead of
the formal spec merge. Claude Desktop + Cursor already ship MCP v2.1 with Server Card
support (since April 2026). The Working Group charter ends August 14, 2026.

**Registry action (unchanged):** Once SEP-2127 merges into spec, extend
`subregistry-audit` to GET `/.well-known/mcp/server-card.json` on each cataloged server
origin and record tool count + protocol version in `verification.notes`. No schema
migration needed now.

[[SEP-2127 PR]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)
[[mcp-servercard-go library]](https://github.com/olgasafonova/mcp-servercard-go)
[[Server Card charter]](https://modelcontextprotocol.io/community/server-card/charter)

---

## 8. Open Audit Actions (Carried Forward)

| # | Action | Priority | Status |
|---|---|---|---|
| 1 | Verify TypeScript SDK vendors in catalog are running ≥1.26.0 (CVE-2026-25536 cross-client data leak) | High | **Open** — next `subregistry-audit` run |
| 2 | DNS rebinding: confirm all cataloged vendors run MCP server ≥v0.25 (CVE-2026-11624) | Medium | Open |
| 3 | Extend `subregistry-audit` to fetch `/.well-known/mcp/server-card.json` once SEP-2127 merges | Low (post-Aug 14) | Blocked on spec merge |
| 4 | Next curate run: Comms & support group (HubSpot, Intercom, Zapier) | Medium | Queued |

No new catalog actions required from today's findings. All 19 approved entries remain
`approved`/`public`.

---

## 9. Summary for Catalog Operators

| Finding | Catalog action |
|---|---|
| Bitwarden CLI supply chain (April 22, 2026) | None — not in catalog; reinforces secret-name-only schema design |
| MCP Python SDK v2 beta June 30 | Monitor vendor upgrades; flag non-compliant entries in next audit |
| AWS Agent Registry new preview features | None — still Preview; landscape watch list unchanged |
| Atlassian SSE shutdown June 30 | None — already on Streamable HTTP |
| agentic-community/mcp-gateway-registry | Watch list — active OSS reference implementation |
| SEP-2127 Go library | Plan `subregistry-audit` extension (post-Aug 14) |
| Glama 49,010 / PulseMCP 19,620+ | Scale update only — no catalog action |
