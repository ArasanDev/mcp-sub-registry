# MCP Ecosystem Update — 2026-06-21

Daily research pass. Covers developments since the June 20 report
([2026-06-20-mcp-ecosystem-update.md](./2026-06-20-mcp-ecosystem-update.md)).
Focus: IronWorm + Miasma worm escalation (new variant, cross-platform); Adversa AI MCP
Security TOP 25 framework; OWASP MCP Top 10 beta Phase 3; MACH Alliance MCP Registry entry;
Smithery hosting policy change; HubSpot OAuth no-DCR confirmation; Atlassian SSE 9-day
deadline; JFrog MCP Registry GA detail; spec countdown (37 days to July 28).

All external claims cited with source URLs.

---

## 1. Supply Chain Threat Escalation: IronWorm + New Miasma Variant

The Miasma/Shai-Hulud worm family has escalated further since the Wave 3 (`@mastra`) event
documented June 17. Two concurrent campaigns are now active.

### 1a. IronWorm — Rust-based stealer with eBPF kernel rootkit

A new threat actor (npm account "asteroiddao") published 50+ poisoned npm packages containing
**IronWorm**: a Rust ELF binary triggered via `preinstall` lifecycle hook. Key facts:

- Targets 86 environment variables covering credentials for OpenAI Codex, Anthropic/Claude,
  Gemini, Cursor, AWS, Docker, Kubernetes, npm, Vault, and Exodus crypto wallets.
- Uses **eBPF kernel rootkit techniques** to hide process execution from scanner visibility.
- Explicitly harvests AI coding assistant configuration files (Claude Code, Cursor, VS Code,
  Gemini-CLI).

[[The Hacker News — IronWorm and New Miasma Worm Variant Hit npm]](https://thehackernews.com/2026/06/ironworm-and-new-miasma-worm-variant.html)

### 1b. New Miasma variant — binding.gyp bypass, 57 packages, 286 versions

Alongside IronWorm, a new Miasma worm variant appeared with 57 npm packages across 286
malicious versions. The key capability escalation: **this variant drops lifecycle hooks
entirely and executes through `binding.gyp`**, bypassing every scanner that watches
`package.json` scripts. It then:

- Injects a 4.3 MB dropper into GitHub repos across multiple maintainers.
- Wires the dropper to auto-run through Claude Code, Gemini, Cursor, and VS Code config files.
- Includes three MCP packages from the Red Hat portfolio acquired in 2026.

This is the **Phantom Gyp technique** now confirmed deployed across two distinct campaigns
(not just documented as a theoretical attack vector).

[[The Hacker News — IronWorm and New Miasma Worm Variant Hit npm]](https://thehackernews.com/2026/06/ironworm-and-new-miasma-worm-variant.html)
[[SafeDep — Miasma Worm Targets AI Coding Agents via GitHub Repos]](https://safedep.io/miasma-worm-ai-coding-agent-config-injection/)

### 1c. Miasma Hades wave — cross-platform to Azure and PyPI

The Miasma campaign crossed language boundaries: a "Hades" wave disabled **73 repositories on
Microsoft Azure** and dropped **37 malicious Python wheels on PyPI**. The worm is now a
cross-platform threat, not npm-only.

[[Phoenix Security — Miasma Azure/Hades PyPI supply chain worm]](https://phoenix.security/miasma-azure-hades-pypi-supply-chain-worm-2026/)

### Catalog implication

All 19 catalog entries are remote HTTP servers — the Miasma/IronWorm attack vector targets
local stdio package installs. No catalog demotion warranted. The remote-HTTP-only approach
remains the structural defense against this entire worm family. However, operators installing
**any** npm or Python package in the same environment as AI coding assistants should treat
supply chain hygiene as an active combat posture, not a hygiene checkbox.

---

## 2. Security Frameworks Maturing: Adversa AI TOP 25 + OWASP MCP Top 10 Beta

### 2a. Adversa AI MCP Security TOP 25

Adversa AI launched the **MCP Security TOP 25** — billed as the industry's first comprehensive
vulnerability classification system specific to MCP. Key structure:

- Classifies 25 vulnerability categories across: AI-unique risks, AppSec classics, and hybrids.
- Dimensions: type (AI / AppSec / Unique / Both) + exploitability level.
- **#1 rated: Prompt injection** — critical consequence × ease of exploitation.
- Other categories include: input/instruction boundary failure, missing auth/authorization
  framework, session management design flaws (now acute given stateless RC), supply chain
  injection, tool poisoning.
- Intended as a living framework, updated as new vectors emerge.

[[Adversa AI — MCP Security TOP 25]](https://adversa.ai/mcp-security-top-25-mcp-vulnerabilities/)
[[PR Newswire launch announcement]](https://www.prnewswire.com/news-releases/adversa-ai-launches-mcp-security-top-25-definitive-resource-for-mcp-vulnerabilities-threats-and-defenses-302559920.html)
[[SecurityWeek coverage]](https://www.securityweek.com/top-25-mcp-vulnerabilities-reveal-how-ai-agents-can-be-exploited/)

**Relevance:** This is now a credible external reference point for the trust signals we apply
in `subregistry-audit`. It validates that curation at the registry layer (tool poisoning, supply
chain) is one of the most impactful single-point defenses available.

### 2b. OWASP MCP Top 10 — Phase 3 Beta (stable, citable)

The OWASP MCP Top 10 project (led by Vandana Verma Sehgal) has reached **Phase 3: beta release
and pilot testing**. Categories are stable enough to cite; rankings may still shift before
final release. Covers MCP01:2025 through MCP10:2025.

Equixly (June 4, 2026) published a mapping of NSA's MCP guidance against the OWASP MCP Top 10.
Microsoft's `agent-governance-toolkit` repo also cross-references OWASP MCP Top 10.

[[OWASP MCP Top 10 official page]](https://owasp.org/www-project-mcp-top-10/)
[[OWASP GitHub project]](https://github.com/OWASP/www-project-mcp-top-10)
[[Equixly — NSA guidance × OWASP MCP Top 10 mapping]](https://equixly.com/blog/2026/06/04/mapping-nsa-s-mcp-guidance-to-the-owasp-mcp-top-10-how-to-test-for-the-risks/)
[[PipeLab — State of MCP Security 2026]](https://pipelab.org/blog/state-of-mcp-security-2026/)

**Relevance:** Two independent frameworks (NSA guidance + OWASP Top 10) now explicitly validate
the `discovered != approved != enabled` boundary as the correct control. Our architecture is
ahead of the majority of the ecosystem.

---

## 3. Registry Landscape Updates

### 3a. MACH Alliance MCP Registry — new entrant

The MACH Alliance (open, composable enterprise technology consortium) launched its own
**MCP Registry**: a vendor-neutral central directory aligned with MCP-Registry-compatible
metadata. Key characteristics:

- Metadata format aligned with the official MCP Registry API.
- Publishing is open (not restricted to Alliance members), but member-only features for
  verification/governance.
- Applies automated checks + community-driven reporting; enterprises are expected to add
  their own governance layer.
- Explicitly positioned as enterprise-grade, composable architecture tooling.

[[MACH Alliance MCP Registry]](https://machalliance.org/mach-alliance-mcp-registry)
[[MACH Alliance MCP Servers Directory]](https://machalliance.org/mcp-servers-directory)

This is a new landscape entrant since our last ranking update. It belongs on the watch list —
vendor-neutral community registry with enterprise aspirations but no direct curation signal yet.

### 3b. Smithery hosting policy shift

Smithery announced significant infrastructure changes: **free plan hosting ended March 1, 2026**;
new deployments are paid-only. The company is **rebuilding its hosting infrastructure from scratch**,
piloting new infrastructure with paid customers. Context: a path traversal vulnerability
disclosed in June 2025 by GitGuardian exposed 3,000+ hosted servers and an API token granting
control over those servers. Smithery rotated credentials and patched, but the incident accelerated
the infrastructure rebuild.

[[GitGuardian — Path Traversal to Supply Chain Compromise]](https://blog.gitguardian.com/breaking-mcp-server-hosting/)
[[SC Media — Smithery fixes path traversal flaw]](https://www.scworld.com/news/smithery-ai-fixes-path-traversal-flaw-that-exposed-3000-mcp-servers/)

**Landscape implication:** Smithery's hosted server count (~7,000) may contract as free-tier
servers go offline without paid upgrades. The platform's role as a discovery/breadth source
remains, but hosted reliability is reduced during the infrastructure rebuild.

### 3c. JFrog MCP Registry GA — detail

JFrog announced GA of its **Universal MCP Registry** on March 18, 2026. Key governance features:

- Native **proactive blocking** of malicious or non-compliant MCP servers before execution
  (not post-incident remediation).
- Policy enforcement at point of request: license type, vulnerability severity, operational risk.
- Integrates with JFrog Artifactory (storage) and JFrog Curation (policy); manages AI models,
  agent skills, and MCP tools alongside software dependencies on a single platform.
- Positioned as "the secure system of record for the AI-driven software supply chain."

[[JFrog press release]](https://jfrog.com/press-room/jfrog-unveils-universal-mcp-registry-for-ai-software-supply-chain/)
[[BusinessWire announcement]](https://www.businesswire.com/news/home/20260318132919/en/JFrog-Unveils-Universal-MCP-Registry-Delivering-a-Secure-System-of-Record-for-the-AI-Driven-Software-Supply-Chain/)
[[JFrog blog — Shadow AI + MCP governance]](https://jfrog.com/blog/jfrog-ai-catalog-evolves-to-detect-shadow-ai-govern-mcps/)

**Relevance:** JFrog GA is the most complete enterprise analogue to this sub-registry; their
proactive blocking model at request time is the Gateway layer above us — complementary, not
competing. Their landscape rank (#2) is confirmed.

### 3d. Server counts (June 21)

| Source | Count (June 21) | Change since June 20 |
| --- | --- | --- |
| **Glama** | **38,524** | +368 (~24h, batch indexing) |
| **PulseMCP** | **18,240+** (official/remote filter) | Unknown (filtered count) |
| **Smithery** | ~7,000 | Contracting as free tier ends |
| **Our catalog** | **19 approved/public** | Unchanged |

[[Glama MCP Servers]](https://glama.ai/mcp/servers)
[[PulseMCP Server Directory]](https://www.pulsemcp.com/servers)

---

## 4. HubSpot MCP OAuth — No-DCR Requirement Confirmed

The next curate run targets HubSpot (`mcp.hubspot.com/mcp`, OAuth 2.1 + PKCE). Research
confirms the implementation detail that matters for integration:

- HubSpot requires **pre-registered OAuth client credentials** (Client ID + Client Secret).
- **Dynamic Client Registration (DCR) is not supported** — clients that attempt auto-DCR fail.
- Confirmed failures in: **Kiro IDE** (issue `#8551` — "Incompatible auth server: does not
  support dynamic client registration") and **LibreChat** (discussion `#11564`).
- Workaround for affected clients: proxy via `mcp-remote`, which handles PKCE independently
  and accepts pre-registered credentials.
- HubSpot community threads also document OAuth 500 errors from clients sending incorrect
  redirect URIs — must register both `claude.ai` and `claude.com` redirect URIs if using
  Claude connectors.

[[HubSpot MCP developer page]](https://developers.hubspot.com/mcp)
[[HubSpot GA changelog]](https://developers.hubspot.com/changelog/remote-hubspot-mcp-server-is-now-generally-available)
[[Kiro issue #8551]](https://github.com/kirodotdev/Kiro/issues/8551)
[[LibreChat discussion #11564]](https://github.com/danny-avila/LibreChat/discussions/11564)

**Catalog entry note:** when adding `com.hubspot/mcp`, record in `auth.notes`:
`"OAuth 2.1 + PKCE, no DCR; clients must supply pre-registered client_id + client_secret;
mcp-remote proxy required for DCR-only clients"`.

---

## 5. Atlassian SSE Shutdown — 9 Days (June 30, 2026)

The Atlassian Rovo MCP Server SSE endpoint (`https://mcp.atlassian.com/v1/sse`) is being
shut down in **9 days** on June 30, 2026. Migration path confirmed:

- New endpoint: `https://mcp.atlassian.com/v1/mcp` (Streamable HTTP)
- Auth endpoint: `https://mcp.atlassian.com/v1/mcp/authv2`

Our catalog does not include the Atlassian server, so no catalog action is required.
This is documented here as context for the industry-wide SSE→Streamable HTTP migration
that continues to accelerate. Any SSE-typed catalog entry in a future curate run must be
verified against the operator's migration timeline before adding.

[[Atlassian SSE deprecation notice]](https://community.atlassian.com/forums/Atlassian-Remote-MCP-Server/HTTP-SSE-Deprecation-Notice/ba-p/3205484)
[[Jira MCP SSE Migration — YouTube]](https://www.youtube.com/watch?v=RsoyrmlssfI)
[[Chanl — SSE to Streamable HTTP migration guide]](https://www.channel.tel/blog/mcp-sse-to-streamable-http-migration)

---

## 6. Spec Countdown — 37 Days to July 28

The MCP 2026-07-28 Release Candidate (locked May 21) ships as the final specification on
**July 28, 2026** — 37 days from today. Status of the critical migration items:

- Stateless core (no `initialize`/`initialized`, no `Mcp-Session-Id`) is the headline change.
- `Mcp-Method` + `Mcp-Name` headers mandatory for Streamable HTTP routing.
- MCP Apps (SEP-1865) and Tasks as opt-in extensions.
- `ttlMs` + `cacheScope` for list/read cache control.
- W3C Trace Context in `_meta`.
- Roots/Sampling/Logging deprecated (12-month window).

Tier 1 SDK maintainers are expected to ship support within the 10-week validation window
that ends July 28. **No catalog schema change required**. Gateway operator must update
transport validation.

[[MCP RC blog post]](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)
[[MCP.Directory RC explained]](https://mcp.directory/blog/mcp-2026-07-28-release-candidate)
[[WorkOS — authentication changes in 2026 spec]](https://workos.com/blog/mcp-2026-spec-agent-authentication)

---

## 7. SEP-2127 Server Cards — Status Update

SEP-2127 (MCP Server Cards at `/.well-known/mcp/server-card.json`) is progressing with active
Working Group (term ends Aug 14, 2026). New confirmation:

- Go reference implementation available: `github.com/olgasafonova/mcp-servercard-go`
- Apify has an open issue to update their server card to the hybrid SEP-2127 + registry shape
  (issue `#790`), suggesting real adoption is beginning.
- **Claude Desktop + Cursor already shipping Server Card support since April 2026.**
- May land post-RC (after July 28) rather than in the RC itself.

[[SEP-2127 PR]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)
[[Apify server-card update issue]](https://github.com/apify/apify-mcp-server/issues/790)
[[Go reference implementation]](https://github.com/olgasafonova/mcp-servercard-go)

**Once merged into spec**, `subregistry-audit` can query `/.well-known/mcp/server-card.json`
on each cataloged server origin to auto-verify tool count + protocol version. No schema migration
needed now.

---

## 8. Catalog Hooks — No Demotions; Pending Actions

| Server | Finding | Action |
| --- | --- | --- |
| All 19 entries | IronWorm/Miasma targets local stdio installs; our entries are remote HTTP | No demotion |
| TypeScript SDK vendors | CVE-2026-25536 patched in SDK 1.26.0; audit pass pending | **Flag: subregistry-audit** |
| Atlassian MCP | Not in catalog; SSE shutdown June 30 | No action |
| com.hubspot/mcp | Auth detail confirmed (no DCR); not yet in catalog | Note in next curate entry |

**Pending audit trigger:** Next `subregistry-audit` run should verify that all TypeScript
SDK-based vendors in the catalog are running ≥1.26.0 (CVE-2026-25536). Vendors to check
include any server whose `packages` field lists `@modelcontextprotocol/sdk` in the TypeScript
ecosystem.

---

## Summary for CLAUDE.md §13

**New threats (June 21):** IronWorm (Rust/eBPF npm stealer, 50+ poisoned packages targeting
AI credentials) + new Miasma variant (57 pkgs, 286 versions, bypasses scanners via binding.gyp,
3 MCP packages in @redhat portfolio included, AI coding agent configs targeted); Miasma Hades
wave now cross-platform to Azure + PyPI. Remote-HTTP-only catalog remains structurally immune.

**New security frameworks:** Adversa AI MCP Security TOP 25 (industry's first comprehensive
vulnerability classification, prompt injection #1); OWASP MCP Top 10 Phase 3 beta (citable;
NSA guidance now cross-mapped to OWASP Top 10 by Equixly June 4).

**Landscape:** Glama 38,524 (+368 in ~24h); MACH Alliance enters as new watch-list player;
Smithery free hosting ended March 1, rebuilding infrastructure; JFrog MCP Registry GA
March 18 confirmed with proactive-blocking detail.

**Next curate:** HubSpot no-DCR confirmed — pre-registered client_id + secret required,
mcp-remote workaround for DCR-only clients. Note in catalog entry auth.notes.

**Atlassian SSE shutdown June 30 (9 days):** not in catalog, no action. Track as
industry SSE→Streamable HTTP signal.

**Spec countdown:** 37 days to July 28 RC final. No catalog schema change required.
