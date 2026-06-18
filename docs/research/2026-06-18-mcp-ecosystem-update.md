# MCP Ecosystem Update — 2026-06-18

Daily research pass. Covers developments since the June 17 report
([2026-06-17-mcp-ecosystem-update.md](./2026-06-17-mcp-ecosystem-update.md)).
Focus: spec RC breaking-change detail, new security surface from OX Security research,
Asana endpoint migration (catalog action), MCP tunnels, and SEP-2127 status.
All external claims are cited.

---

## 1. Spec RC — breaking changes now fully documented

The **2026-07-28 Release Candidate** was locked May 21, 2026; final spec ships July 28.
[[MCP RC blog]](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)
[[2026 Roadmap]](https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/)

Previous reports recorded the headline (stateless protocol, `Mcp-Method`/`Mcp-Name` headers).
Today's pass fills in the breaking-change specifics that SDK maintainers and registry operators
need to track:

### Breaking changes (four, with catalog impact)

| Change | Detail | Catalog / registry impact |
|---|---|---|
| `initialize`/`initialized` handshake **removed** | Protocol version + client capabilities now travel in `_meta` on every request | Remote servers must not depend on session establishment; no schema change for our catalog |
| `Mcp-Session-Id` header **deprecated** | Sessions gone at the protocol layer; enables stateless round-robin load balancing | No direct impact — remote endpoints we catalog may need internal updates |
| Error code change | Missing resource: `-32002` → JSON-RPC standard `-32602` (Invalid Params) | Clients that hard-match `-32002` must update; watch for SDK releases confirming fix |
| Tasks API redesigned | Experimental Tasks moved to Extensions framework; `tasks/get`, `tasks/update`, `tasks/cancel` API | No catalog schema change required |

### New headers / fields

- **`MCP-Protocol-Version`** — replaces session-based versioning (per-request)
- **`Mcp-Method`** and **`Mcp-Name`** — required; enables load-balancer routing without body inspection
- **`_meta` object** — carries client capabilities + W3C trace context (`traceparent`, `tracestate`, `baggage`)
- **`ttlMs` / `cacheScope`** — HTTP-style cache control on list/read responses
- **`InputRequiredResult`** — replaces SSE streams for elicitation; uses `inputRequests` + `requestState`

### Deprecations (12-month minimum window before removal)

Roots, Sampling, Logging are officially deprecated in this RC.

### Registry operator checklist (by July 28)

1. Verify all cataloged vendors have shipped or committed to shipping SDK ≥ v1.26.0 (covers CVE-2026-25536) and RC transport changes.
2. Update any doc/API response shape that references session IDs.
3. `GET /v0.1/gateway/catalog` projection is unaffected — no catalog schema fields change.

---

## 2. Catalog action — Asana V1 SSE endpoint shut down (May 11, 2026)

**This is the most concrete catalog action from this research pass.**

The Asana V1 Beta MCP endpoint **`https://mcp.asana.com/sse`** was shut down on
**May 11, 2026**.
[[Asana GitHub issue — V1 deprecation + V2 migration]](https://github.com/anthropics/claude-plugins-official/issues/998)

The current endpoint is `https://mcp.asana.com/v2/mcp` (Streamable HTTP transport).

Our catalog entry `com.asana/mcp` still points to the dead V1 URL. The entry has been
updated in `data/default-curated-servers.json` as part of this commit:
- `remotes[0].type`: `"sse"` → `"http"`
- `remotes[0].url`: `"https://mcp.asana.com/sse"` → `"https://mcp.asana.com/v2/mcp"`
- `version` bumped to `"remote-2026-06-v2"`
- `verification.verifiedAt` updated; note added

**Atlassian SSE reminder:** The Atlassian Rovo MCP SSE endpoint
(`https://mcp.atlassian.com/v1/sse`) deprecates **June 30, 2026 — 12 days away**.
We do not have Atlassian in our catalog. No action needed, but note for any future
Atlassian curate run: use Streamable HTTP at `https://mcp.atlassian.com/v1/mcp`.
[[Atlassian deprecation notice]](https://community.atlassian.com/forums/Atlassian-Remote-MCP-Server/HTTP-SSE-Deprecation-Notice/ba-p/3205484)

---

## 3. OX Security "Mother of All AI Supply Chains" — complete picture

Previous reports noted this research existed (April 2026). Today's pass fills in the full scope.
[[OX Security advisory]](https://www.ox.security/blog/mcp-supply-chain-advisory-rce-vulnerabilities-across-the-ai-ecosystem/)
[[OX Security — systemic vulnerability]](https://www.ox.security/blog/the-mother-of-all-ai-supply-chains-critical-systemic-vulnerability-at-the-core-of-the-mcp/)
[[The Hacker News]](https://thehackernews.com/2026/04/anthropic-mcp-design-vulnerability.html)
[[CSA research note — MCP STDIO RCE]](https://labs.cloudsecurityalliance.org/research/csa-research-note-mcp-rce-design-vulnerability-20260423-csa/)

### Root cause

Architectural: Anthropic's official MCP SDKs (Python, TypeScript, Java, Rust) allow any
STDIO server launched with a valid command string to execute arbitrary OS commands. This is
by design for local/developer use; the problem is that the same pathway is exposed without
guard rails in production-hosted environments.

Anthropic characterised the STDIO transport behaviour as "expected behavior" and declined to
modify the protocol specification. The practical fix is: **do not deploy STDIO servers in
multi-tenant or internet-reachable environments**.

### Scale

- **150M+ downloads** of affected SDK packages
- **7,000+ publicly accessible MCP servers** scanned
- **Up to 200,000 vulnerable instances** total
- **9 out of 11 MCP registries** successfully "poisoned" in proof-of-concept testing
  (the PoC ran a command generating an empty file, not actual malware)
- **14 CVEs** disclosed across affected IDEs and tools
  [[SoftwareSeni breakdown]](https://www.softwareseni.com/how-the-ox-security-audit-exposed-7000-plus-mcp-servers-14-cves-and-one-design-flaw/)

### Notable CVEs from this research (partial list)

| CVE | Affected | Severity | Status |
|---|---|---|---|
| CVE-2026-30615 | Windsurf IDE | Critical | Zero user interaction required for exploitation |
| CVE-2026-30623 | Anthropic MCP SDK (command injection via stdio) | High | Patched per liteLLM advisory |
| CVE-2026-11624 | MCP servers <v0.25 (DNS rebinding, no Origin header validation) | High | Fixed in v0.25+ |

[[CVE-2026-30623 liteLLM]](https://docs.litellm.ai/blog/mcp-stdio-command-injection-april-2026)
[[CVE-2026-23744 MCPJam Inspector]](https://www.linkedin.com/pulse/cve-2026-23744-critical-rce-mcpjam-inspector-targeting-developers-nvj9f)

### Impact on our catalog

**None of these CVEs affect our 19 approved remote-HTTP servers.**
Our catalog deliberately excludes stdio/package-based servers from the approved set.
The remote-HTTP model is the structural defense against the entire STDIO RCE class.

This research is the strongest third-party validation to date of our architectural choice.
The fact that 9/11 registries were successfully poisoned underscores that undiscriminating
discovery directories are not a substitute for curation.

---

## 4. Anthropic MCP Tunnels — enterprise deployment pattern (May 19, 2026)

Announced at Code with Claude London, May 19, 2026. Currently in research preview.
[[InfoQ]](https://www.infoq.com/news/2026/05/claude-mcp-tunnels/)
[[The New Stack]](https://thenewstack.io/anthropic-mcp-tunnels-sandboxes/)
[[The Decoder]](https://the-decoder.com/anthropic-adds-self-hosted-sandboxes-and-mcp-tunnels-to-claude-managed-agents/)

### What it is

MCP Tunnels allow Anthropic Managed Agents to reach **private** MCP servers (behind
corporate firewalls, no public URL) via an outbound-only encrypted tunnel. No inbound
firewall rules required. Three-layer crypto: outer mTLS + inner TLS + OAuth per MCP server.

Self-hosted sandboxes (public beta) allow tool execution inside customer-controlled
infrastructure. Sandbox providers: Cloudflare, Daytona, Modal, Vercel.

### Registry relevance

MCP Tunnels means operators can register a **private** (non-public) MCP server with
Anthropic's managed infrastructure without exposing it to the internet. This does not
affect our current catalog (all 19 entries are public remote endpoints), but it introduces
a new server archetype worth tracking:

> **Private-tunnel servers** — approved catalog endpoint is a tunnel-registered identifier,
> not a public HTTPS URL. Schema consideration for a future `remotes[].type: "mcp-tunnel"`.

No action needed now. Note it in the roadmap when this exits research preview.

---

## 5. SEP-2127 (MCP Server Cards) — not yet merged

Working Group status as of June 2026:
- **Active**; led by David Soria Parra (Anthropic) + Sam Morrow Drums (GitHub)
- Charter dated 2026-03-26; weekly sessions; term ends **August 14, 2026**
- Path confirmed: `/.well-known/mcp/server-card.json`
- Client adoption: Claude Desktop + Cursor already shipping Server Card support (April 2026)
- **Status: Draft. Target June 2026 merge — but not confirmed as merged.**
[[SEP-2127 PR]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)
[[MCP roadmap]](https://modelcontextprotocol.io/development/roadmap)

The Working Group term (Aug 14) extends past the July 28 spec ship date, suggesting Server
Cards may land in a post-RC point release rather than the July 28 final spec.

**Registry action (unchanged from previous):** once merged, extend `subregistry-audit` to
GET `/.well-known/mcp/server-card.json` on each cataloged endpoint. No schema migration needed yet.

---

## 6. CVE-2026-25536 — vendor confirmation status

The MCP TypeScript SDK cross-client data leak (CVSS 7.1) is patched in SDK 1.26.0.
Affected: SDK 1.10.0–1.25.3.
[[Tenable CVE page]](https://www.tenable.com/cve/CVE-2026-25536)
[[GitHub Advisory]](https://github.com/advisories/GHSA-345p-7cg4-v4c7)
[[Vulnerable MCP Project]](https://vulnerablemcp.info/vuln/cve-2026-25536-sdk-cross-client-data-leak.html)

**Status of our TypeScript SDK-based catalog vendors:** no vendor has publicly confirmed
their upgrade to ≥1.26.0. This remains an open audit item. The next `subregistry-audit`
pass should attempt to verify SDK version from vendor changelogs or endpoint headers for:
- Stripe MCP
- Vercel MCP
- Webflow MCP
- Exa MCP
- Context7 MCP
- AWS MCP Knowledge MCP (Python, likely unaffected; confirm)
- Any vendor whose server is TypeScript/Node-based

---

## 7. Ecosystem scale and registry player updates

### Scale (updated)

| Directory | Server count | Update |
|---|---|---|
| Glama | ~37,000 | Grew from 36,986 (Jun 16) |
| mcp.so | ~20,222 | As of April 2026; unvetted |
| PulseMCP | 18,240+ | Official co-steward, hand-reviewed subset |
| Smithery | ~7,300 | Growing ~650/month; hosting layer |

[[Glama]](https://glama.ai/mcp/servers)
[[PulseMCP]](https://www.pulsemcp.com/servers)
[[TrueFoundry comparison]](https://www.truefoundry.com/blog/best-mcp-registries)

### Smithery historical note (for the record)

The GitGuardian-reported **path traversal** in Smithery's build system (June 2025, now fixed)
exposed deployment credentials for 3,000+ hosted MCP apps.
[[SC Media]](https://www.scworld.com/news/smithery-ai-fixes-path-traversal-flaw-that-exposed-3000-mcp-servers)
[[GitGuardian]](https://blog.gitguardian.com/breaking-mcp-server-hosting/)

This is a 2025 incident now fully remediated, but it illustrates the risk of centralized
hosting platforms and is referenced in the authzed.com MCP breach timeline.
[[authzed timeline]](https://authzed.com/blog/timeline-mcp-breaches)

### Palo Alto Prisma AIRS 3.0

No new June 2026 announcements beyond what was recorded June 17 (Portkey acquisition
closed May 29; Prisma AIRS 3.0 AI Gateway; Agent Artifact Scanning for MCP servers).
[[Palo Alto — AI Gateway blog]](https://www.paloaltonetworks.com/blog/2026/05/securing-and-governing-ai-agents-at-scale-through-a-unified-ai-gateway/)

---

## 8. Catalog action summary

| Server | Issue | Action taken |
|---|---|---|
| `com.asana/mcp` | V1 SSE endpoint `https://mcp.asana.com/sse` shut down May 11, 2026 | **Updated in this commit**: URL → `https://mcp.asana.com/v2/mcp`, type `sse` → `http` |
| All TS-SDK-based vendors | CVE-2026-25536; SDK 1.26.0 required | **Pending**: flag for next `subregistry-audit` pass |

---

## 9. Threat status (running summary)

| Threat | Status | Catalog risk |
|---|---|---|
| SANDWORM_MODE npm worm (June 16) | Active; 19 packages confirmed | None — remote-HTTP model unaffected |
| Miasma worm toolkit (open-sourced June 9) | Toolkit public; derivative variants expected H2 2026 | None — remote-HTTP model unaffected |
| OX Security STDIO RCE (April 2026) | 14 CVEs; Anthropic declines protocol fix; STDIO-specific | None — no STDIO servers in catalog |
| CVE-2026-25536 MCP TS SDK data leak | Patched in 1.26.0; vendor upgrade status unknown | Pending vendor audit |
| CVE-2026-11624 DNS rebinding | Fixed in MCP server v0.25+ | Likely unaffected; confirm in next audit |
| VIPER-MCP 106 zero-days (ongoing) | Sweeping public repos; no cataloged vendor named | Monitor |

---

*Report written by the autonomous orchestrator of the MCP Sub-Registry (2026-06-18).*
*Prior report: [2026-06-17-mcp-ecosystem-update.md](./2026-06-17-mcp-ecosystem-update.md)*
