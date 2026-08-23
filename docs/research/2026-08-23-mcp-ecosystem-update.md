# MCP Ecosystem Update — 2026-08-23

**Produced by:** MCP Sub-Registry autonomous research routine
**Covers:** 2026-08-22 EOD → 2026-08-23
**Prior report:** [2026-08-22-mcp-ecosystem-update.md](./2026-08-22-mcp-ecosystem-update.md)

---

## 1. Headline Summary

- **Official MCP Roadmap blog post published August 22, 2026.** The MCP Core Maintainers
  published a new roadmap at `blog.modelcontextprotocol.io/posts/mcp-roadmap/` covering the
  next specification release and beyond. Five priority areas: agentic messaging primitives,
  HTTP-native transport unification, agent identity + enterprise security, improved primitives,
  and improved SDK DX. The agent-identity area (Proof of Possession, Workload Identity
  Federation, token exchange) is the most significant signal for our catalog schema roadmap.
  [[MCP Roadmap]](https://blog.modelcontextprotocol.io/posts/mcp-roadmap/)
- **Glama crosses 76k: ~76,327 (+713 vs. Aug 22).** The search-index page title updated to
  "76,327 in the Glama Registry" — a moderate daily gain resuming after yesterday's flat day.
  [[Glama]](https://glama.ai/mcp/servers)
- **PulseMCP: still flat (Day 13 of pause).** The ~22,020–22,070 range persists. The stated
  "mid-August" ingestion-rework deadline is now 13+ days overdue. Step-jump remains pending.
  [[PulseMCP]](https://www.pulsemcp.com/servers)
- **GitHub Copilot JetBrains + Eclipse MCP governance (Aug 18).** Enterprise managed settings
  for GitHub Copilot extended `allowedMcpServers` / `deniedMcpServers` to JetBrains IDEs. A
  Microsoft Java blog separately documented Eclipse support. Third major IDE ecosystem (after
  VS Code and Kiro) to enforce a URL-based MCP allowlist — directly validating our gateway
  catalog projection as an allowlist source-of-truth.
  [[GitHub Changelog Aug 18]](https://github.blog/changelog/2026-08-18-enterprise-managed-settings-in-github-copilot-for-jetbrains/)
- **AAIF Seoul blog recap: STILL NOT PUBLISHED (Day 9 post-summit).** No official AAIF post
  found in search indexes or via the search for `site:aaif.io` — likely published after the
  Aug 22–24 window closes or blocked from direct fetch. Keep monitoring.
- **Security: Day 58 clean.** No new CVEs or incidents against any of the 19 cataloged
  remote-HTTP servers for Aug 22–23.

---

## 2. Scale & Registry Landscape

| Registry | Count (Aug 23) | vs. Aug 22 | Note |
|---|---|---|---|
| Glama | **~76,327** | **+713** | Crosses 76k; search-index title [[Glama]](https://glama.ai/mcp/servers) |
| PulseMCP | ~22,020–22,070 | flat (Day 13) | Ingestion pause overdue [[PulseMCP]](https://www.pulsemcp.com/servers) |
| MCPToplist (cross-registry) | 100,958 | (Aug 10 snap; 13 days stale) | No new snapshot |
| Official MCP Registry | ~9,652 | — | v0.1 frozen; v1 in development |
| Smithery | ~7,300 | — | No August update; infra rebuild |
| Anthropic Connectors | 950+ | — | Per claude.com July 28 blog |
| Our catalog | 19 | — | All approved/public; all on Streamable HTTP |

**Glama pattern (Aug 14–23):** flat (~72,328), +148, +614, +683, +756, +1,085 (Aug 21),
flat (Aug 22), **+713 (Aug 23, crosses 76k)**. Indexing resumed after the Aug 22 flat day.
Next structural milestone: 77k, at current pace ~1–2 days.

**PulseMCP Day 13:** Ingestion rework pause still ongoing. No announcement of restart found.
The step-jump backlog grows with each passing day.

---

## 3. Spec & Protocol

### 3a. New MCP Roadmap Published — August 22, 2026

The MCP Core Maintainers published a new official roadmap blog post covering the next
specification release and the direction for protocol work over the coming months. This is
the first major roadmap update since the 2026-07-28 final spec shipped.
[[MCP Roadmap]](https://blog.modelcontextprotocol.io/posts/mcp-roadmap/)

**Five priority areas:**

1. **Agentic messaging primitives** — Modernizing request-response patterns to support
   longer-running loops, streamed results, and mid-flight work steering (Tasks extension,
   progress notifications). Evolves what the 2026-07-28 spec introduced as an extension.

2. **HTTP-native transport unification** — Simplifying MCP server/client development by
   unifying deployment modes around HTTP, making remote servers as straightforward as
   standard HTTP workloads. Directly aligns with our remote-HTTP-only catalog posture.

3. **Agent identity and enterprise-ready security** — Implementing standardized identity
   recognition for cloud-based agents via **Proof of Possession (PoP)**, **Workload Identity
   Federation (WIF)**, and **token exchange mechanisms**. This is the most significant signal
   for our catalog schema roadmap: future catalog entries may need to capture supported
   identity mechanisms (`PoP`, `WIF`) as part of `gateway_compatibility` metadata.

4. **Improved primitives** — Standardizing tool result handling; introducing **progressive
   discovery** to address challenges with large tool catalogs. "Progressive discovery" is
   directly relevant to how downstream gateways consume our catalog's `tool_count` field and
   tool manifest metadata.

5. **Improved SDK developer experience** — Better SDK ergonomics, specification conformance
   testing, documentation across all supported platforms.

**Registry implication:** No catalog schema change needed now. Flag for the `subregistry-audit`
and schema roadmap: when PoP/WIF identity mechanisms appear in cataloged vendor docs, add
`identity_mechanisms` to `gateway_compatibility`. Track progressive-discovery adoption as a
signal for when to add per-tool manifest endpoints to catalog entries.

---

## 4. Governance — IDE Allowlist Expansion

### 4a. GitHub Copilot JetBrains + Eclipse MCP Governance (August 18, 2026)

Enterprise managed settings for GitHub Copilot extended `allowedMcpServers` / `deniedMcpServers`
to JetBrains IDEs (Aug 18 changelog) and Eclipse (Microsoft Java Developer blog). Key capabilities:

- **`allowedMcpServers`** and **`deniedMcpServers`** in the enterprise managed settings file.
- Identifies servers by **remote URL** (wildcards supported, canonicalized to prevent evasion),
  **local command** (exact command + args), or **name** (user-assigned label).
- Managed values take precedence over developer settings; connections outside the allowlist
  are blocked at the IDE plugin layer.
- JetBrains support also includes: centralized OpenTelemetry configuration (collector endpoint,
  protocol, service name, resource attributes, content-capture policy), and
  `permissions.disableBypassPermissionsMode` to disable Bypass Approvals / Autopilot for
  Copilot agents in JetBrains.

[[GitHub Changelog Aug 18]](https://github.blog/changelog/2026-08-18-enterprise-managed-settings-in-github-copilot-for-jetbrains/)
[[GitHub MCP Allowlists Aug 6]](https://github.blog/changelog/2026-08-06-mcp-allowlists-in-enterprise-managed-settings/)
[[Digital Applied coverage]](https://www.digitalapplied.com/blog/github-mcp-allowlists-copilot-roi-agent-governance)
[[Microsoft Java blog]](https://devblogs.microsoft.com/java/mcp-registry-and-allowlist-controls-for-copilot-in-jetbrains-and-eclipse-now-in-public-preview/)

**Registry implication:** This is the third major IDE ecosystem (after VS Code on Aug 6 and
Kiro IDE from March 2026) to enforce a URL-based MCP allowlist using remote `remotes[].url`.
Our `GET /v0.1/gateway/catalog` stable URL field is now a confirmed direct input for at least
three distinct enterprise IDE governance mechanisms. **Endpoint URL stability is a product
guarantee.** No code change needed; product signal documented.

---

## 5. Security

### 5a. Continuous clean window — Day 58

No new CVEs, tool poisoning disclosures, or security incidents involving any of the 19
cataloged remote-HTTP servers found for Aug 22–23. The clean window that began after the
June 2026 incident cluster continues.

No new public MCP CVEs detected in today's search sweep for Aug 22–23.

---

## 6. Ongoing Watch Items (status as of Aug 23)

| Item | Status | Days Active | Expected |
|---|---|---|---|
| AAIF Seoul blog recap | NOT published | Day 9 | ~Aug 22–25 (window extending) |
| PulseMCP ingestion restart + step-jump | Not yet | Day 13 overdue | Unknown |
| SEP-2127 PR merge | Still open (PR #2127) | — | Post-WG-close; Aug 31/Sep 7 meetings |
| MCPToplist snapshot refresh | 13 days stale | — | No cadence signal |
| `subregistry-audit` SEP-2127 trigger | **OVERDUE** | Triggered Aug 14 | Next session |
| `com.github/mcp` verifiedAt (v1.10.1) | **OVERDUE** | v1.10.1 since Aug 20 | Next audit pass |
| `com.slack/mcp` verifiedAt update | Pending | — | Next audit pass |
| TS SDK vendors ≥1.26.0 audit | Pending | — | Next audit pass |
| Python SDK vendors ≥1.28.1 audit | Pending | — | Next audit pass |
| PoP/WIF identity mechanism monitoring | **NEW** | From Aug 22 roadmap | When vendors ship |

---

## 7. Landscape Ranking Changes

No ranking position changes. The official MCP Roadmap (§3a) and GitHub Copilot JetBrains
governance (§4a) are signals to record in `landscape.md`'s watch list and "Last updated"
line. Glama count updated to ~76,327 (crosses 76k milestone).

---

## 8. Catalog Actions

No new catalog actions required from today's research. Audit pass items remain highest priority:
- SEP-2127 server-card GET (all 19 servers)
- `com.github/mcp` verifiedAt (target: v1.10.1)
- `com.slack/mcp` verifiedAt
- TS SDK and Python SDK vendor version checks

Schema roadmap item added: monitor PoP/WIF identity mechanism adoption by cataloged vendors
as a trigger for adding `identity_mechanisms` to `gateway_compatibility`.

---

## Sources

- [MCP Roadmap (Aug 22, 2026)](https://blog.modelcontextprotocol.io/posts/mcp-roadmap/)
- [Glama MCP Registry](https://glama.ai/mcp/servers)
- [PulseMCP Server Directory](https://www.pulsemcp.com/servers)
- [GitHub Changelog Aug 18 — Enterprise managed settings JetBrains](https://github.blog/changelog/2026-08-18-enterprise-managed-settings-in-github-copilot-for-jetbrains/)
- [GitHub Changelog Aug 6 — MCP allowlists enterprise managed settings](https://github.blog/changelog/2026-08-06-mcp-allowlists-in-enterprise-managed-settings/)
- [Digital Applied — GitHub MCP Allowlists coverage](https://www.digitalapplied.com/blog/github-mcp-allowlists-copilot-roi-agent-governance)
- [Microsoft Java Blog — MCP Registry/Allowlist Copilot JetBrains+Eclipse](https://devblogs.microsoft.com/java/mcp-registry-and-allowlist-controls-for-copilot-in-jetbrains-and-eclipse-now-in-public-preview/)
- [GitHub MCP Server releases](https://github.com/github/github-mcp-server/releases)
- [SEP-2127 PR #2127](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)
- [Futurumgroup AAIF Seoul coverage](https://futurumgroup.com/insights/mcp-dev-summit-2026-aaif-sets-a-clear-direction-with-disciplined-guardrails/)
- [MCP Agent Ready validator](https://agent-ready.dev/mcp-card-validator)
- [MCPToplist](https://mcptoplist.com/)
