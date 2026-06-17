# MCP Ecosystem Update — 2026-06-17

Daily research pass. Covers developments since the June 16 report
([2026-06-16-mcp-ecosystem-update.md](./2026-06-16-mcp-ecosystem-update.md)).
Focus: what changed, what it means to a curated sub-registry. All external claims are cited.

---

## 1. Active threat — SANDWORM_MODE npm worm (discovered June 16, 2026)

**The highest-priority new finding today.**

Socket.dev identified and tracked a live supply-chain campaign named **SANDWORM_MODE**: a
self-replicating npm worm specifically designed to inject malicious MCP server configurations
into AI coding agents and IDEs.
[Source: socket.dev — SANDWORM_MODE](https://socket.dev/blog/sandworm-mode-npm-worm-ai-toolchain-poisoning),
[CSO Online](https://www.csoonline.com/article/4136476/shai-hulud-style-npm-worm-hits-ci-pipelines-and-ai-coding-tools.html),
[Infosecurity Magazine](https://www.infosecurity-magazine.com/news/shai-hulud-like-worm-devs-npm-ai/),
[InfoWorld](https://www.infoworld.com/article/4136478/new-npm-worm-hits-ci-pipelines-and-ai-coding-tools.html)

### How it works

1. **Entry**: Typosquatted npm packages impersonating widely-used Node.js libraries and
   emerging AI development tools. Published under two aliases: **official334** and **javaorg**.
   At least 19 packages confirmed malicious.
2. **Persistence**: After install, the worm writes a hidden directory in `~/.` and drops a
   malicious MCP server that registers three innocuous-sounding tools via standard MCP
   JSON-RPC. It then injects this server config into `.claude/settings.json` (Claude Code),
   Cursor's `.cursor/mcp.json`, and VS Code's `settings.json`.
3. **Time bomb**: Payload activates 48 hours after installation to evade sandbox analysis.
4. **Exfiltration**: Stolen LLM API keys, SSH keys, and environment variables are
   transmitted to `https://pkg-metrics[.]official334[.]workers[.]dev`.
5. **Propagation**: Uses stolen npm tokens from the infected developer's environment to
   publish new malicious versions of legitimate packages, spreading to downstream consumers.

### Why this is architecturally distinct from Mini Shai-Hulud

The June 2026 Mini Shai-Hulud (previously documented) targeted `mcp-server` npm packages
and injected prompt injection into **tool descriptions**. SANDWORM_MODE is a different
vector: it attacks the **MCP client configuration** (the list of approved servers), silently
adding a malicious remote to the set of trusted servers the agent connects to at boot.

### Impact on this registry

**Our remote-HTTP catalog is not a direct attack surface**: our 19 approved servers are
major enterprise vendors hosted on their own domains; no npm package install is required to
use them. The SANDWORM_MODE worm cannot hijack our endpoints.

However, this is an **operator advisory**: any downstream operator running Claude Code,
Cursor, or VS Code with npm-installed MCP clients should:
- Audit their MCP server lists immediately.
- Pin and sign their `.claude/settings.json` / `.cursor/mcp.json` configs.
- Treat any MCP server config that appeared without an explicit operator action as suspect.
- Our catalog's explicit `approved` gate and `verifiedAt` timestamps are exactly the
  kind of audit trail that helps operators distinguish sanctioned from injected servers.

**Also related**: Semgrep documented **Miasma v2** concurrently — a separate self-spreading
npm worm using a malicious `binding.gyp` file, compromising 57 packages in the same Shai-Hulud
threat family.
[Source: Semgrep — Miasma v2](https://semgrep.dev/blog/2026/miasma-v2-self-spreading-npm-worm-now-uses-malicious-bindinggyp-file-and-compromises-57-packages/)

---

## 2. Landscape shift — Portkey acquired by Palo Alto Networks (closed May 29, 2026)

**Second highest-priority finding today.**

Palo Alto Networks announced and closed the acquisition of Portkey in May 2026. Portkey is
now being integrated as the AI Gateway layer inside **Prisma AIRS 3.0**.
[Source: Palo Alto Networks press release](https://www.paloaltonetworks.com/company/press/2026/palo-alto-networks-to-acquire-portkey-to-secure-the-rise-of-ai-agents),
[Acquisition completion](https://www.paloaltonetworks.com/company/press/2026/palo-alto-networks-completes-acquisition-of-portkey-to-secure-ai-agents),
[PR Newswire](https://www.prnewswire.com/news-releases/palo-alto-networks-to-acquire-portkey-to-secure-the-rise-of-ai-agents-302759436.html)

### Implications

- **Portkey standalone is in maintenance mode.** Security and dependency patches only;
  no new features. The Admin API and MCP Registry are unchanged today but will eventually
  converge into Prisma AIRS's API surface. The Portkey MCP Gateway as a standalone watch-list
  entry is effectively **absorbed into PAN**.
- **Palo Alto Networks / Prisma AIRS** becomes a credible large-vendor MCP gateway +
  security platform play. Prisma AIRS already covered AI runtime security; adding Portkey's
  gateway (trillions of tokens/month, unified model/tool API) makes it a heavyweight in the
  enterprise MCP governance space.
- **Competitive signal**: The fact that an incumbent SASE/NGFW vendor (PAN, ~$8B ARR) is
  acquiring AI gateway tooling validates the market signal we already track — enterprise buyers
  want governed access to MCP servers, not just raw access. The trust-gate approach is
  mainstream now.
- **Landscape update**: See landscape.md — Portkey removed from active watch list; Prisma
  AIRS added as a new enterprise entrant.

---

## 3. Official spec & registry — no new breaking changes

### Spec RC — 41 days to ship

The 2026-07-28 Release Candidate (locked May 28) is unchanged: stateless core (no sessions,
no `initialize`), mandatory `Mcp-Method` / `Mcp-Name` HTTP headers, Tasks extension (3-endpoint
create/status/cancel), MCP Apps packaging, authorization hardening, Extensions framework.
Shipping July 28, 2026.
[Source: MCP RC blog post](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)

**No schema migration needed for the registry.** The gateway operator must update transport
validation to handle the new mandatory headers before July 28.

### Official registry — recent activity

The `modelcontextprotocol/registry` repository had activity on June 16 across multiple SDK
repos (`rust-sdk`, `go-sdk`, `typescript-sdk`, `experimental-ext-*`). One merged PR
(#806: "Fix missing $schema entries — data migration") confirms ongoing data-quality
maintenance in the upstream.
[Source: github.com/modelcontextprotocol](https://github.com/modelcontextprotocol)

The MCP Registry has grown to approximately **2,000 server entries** since launch
(September 2025), reflecting strong upstream intake velocity.
[Source: Portkey blog — MCP Registry context](https://portkey.ai/blog/mcp-registry/)

### MCP 2026 Roadmap — no registry/provenance items in core

The 2026 roadmap explicitly calls out four priority areas: transport evolution & scalability,
agent communication (Tasks), governance maturation (Working Group delegation), and enterprise
readiness. **No dedicated registry, provenance, or signing initiatives are in the core 2026
plan.** The roadmap does flag "deeper security and authorization work" as receiving community
support but without core-maintainer prioritization.
[Source: MCP 2026 Roadmap blog](https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/)

---

## 4. MCP Server Cards / .well-known discovery — approaching spec merge

**This is the most forward-looking structural development of the week.**

**SEP-2127** (submitted as PR #2127, authored by `@dsp-ant`) proposes standardizing
`/.well-known/mcp/server-card.json` as a machine-readable metadata endpoint on every
HTTP MCP server. The confirmed URL path is `/.well-known/mcp/server-card.json`.
[Source: SEP-2127 PR](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127),
[SEP-1649 issue](https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1649)

### What the card exposes

- Identity: `name`, `title`, `description`, `websiteUrl`, `repository`, `version`
- Transport list (e.g. `streamable-http`, endpoint URL)
- All tool definitions with MCP tool annotations
- Auth/policy posture

Claude Desktop and Cursor already ship **MCP v2.1** with Server Card support (April 2026).
PulseMCP, Smithery, and aggregators are already crawling `/.well-known/mcp/server-card.json`
for metadata discovery.
[Source: SEP-2127 research tracking](https://github.com/bug-ops/zeph/issues/3701)

### Parallel IETF track

A parallel IETF individual submission, **draft-serra-mcp-discovery-uri-04** (March 25, 2026;
expires September 25, 2026), defines the `mcp://` URI scheme and a two-mode discovery
mechanism: `/.well-known/mcp-server` (HTTP) + DNS TXT records. It is not endorsed by IETF
and has no formal standing, but signals that the discovery problem is being addressed at
multiple levels simultaneously.
[Source: IETF Datatracker — draft-serra-mcp-discovery-uri](https://datatracker.ietf.org/doc/draft-serra-mcp-discovery-uri/),
[draft-morrison-mcp-dns-discovery](https://datatracker.ietf.org/doc/draft-morrison-mcp-dns-discovery/)

### Registry implication (action item)

Once SEP-2127 merges (June 2026 target), our registry can query `/.well-known/mcp/server-card.json`
on each cataloged server's domain to **automatically verify**: tool count, protocol version,
transport type, and auth posture. This should be integrated into the `subregistry-audit`
process: add a `serverCard` field (or extend `verification.notes`) recording the card's
`version` and `toolCount` at last check. No schema migration needed immediately — record it
in `verification.notes` for now and formalize when the spec merges.

---

## 5. Directory scale update (June 17, 2026)

| Directory | Count (June 17) | Count (June 16) | Change | Source |
|---|---|---|---|---|
| **PulseMCP** | **18,570+** | 18,410+ | **+160** | [pulsemcp.com](https://www.pulsemcp.com/servers) |
| **Glama** | **~36,986** | ~36,950 | **+36** | [glama.ai/mcp/servers](https://glama.ai/mcp/servers) |
| **mcp.so** | ~20,222 | ~20,222 | unchanged | prior report |
| **Smithery** | ~7,000+ | ~7,000+ | unchanged | prior report |

PulseMCP growth is consistent with its ~1,000+/month intake pace; Glama continues slower
organic intake. The gap between Glama (unvetted aggregator, ~37k) and our curated set (19
approved) is the trust differential that makes a curated sub-registry meaningful.

---

## 6. Security threat landscape — additional context

### Cloud Security Alliance — "Agentjacking" formalized (June 12, 2026)

CSA published a research note formalizing **"agentjacking"** — the attack class where
adversary-controlled MCP server injection hijacks AI coding agents. Distinct from tool
poisoning (manipulates tool *descriptions*); agentjacking adds the malicious server to the
agent's *approved server list*.
[Source: CSA Research — Agentjacking MCP Injection](https://labs.cloudsecurityalliance.org/research/csa-research-note-agentjacking-mcp-sentry-injection-20260612/)

### OX Security — RCE advisory across MCP ecosystem

OX Security published an advisory documenting systemic RCE vulnerabilities in MCP
implementations — enabling arbitrary command execution by exploiting how MCP servers handle
unvalidated input from tool call payloads.
[Source: OX Security — MCP Supply Chain RCE Advisory](https://www.ox.security/blog/mcp-supply-chain-advisory-rce-vulnerabilities-across-the-ai-ecosystem/)

No cataloged server vendor was specifically named. This reinforces the importance of
re-verification cadence via `subregistry-audit` and the `verified` status field.

### Post-RSAC 2026 — MCP security consensus

The Coalition for Secure AI published a post-RSAC 2026 piece confirming that MCP security
was the dominant theme at the conference, with twelve threat categories discussed.
[Source: CSAi — After RSAC 2026](https://www.coalitionforsecureai.org/after-rsac-2026-the-mcp-security-question-everyone-kept-asking/)

The conference reinforced our boundary: `discovered != approved != enabled` was cited by
multiple presenters as the correct governance model (the NSA also used exactly this framing in
U/OO/6030316-26).

---

## 7. Other player updates

### MCP ecosystem momentum

MCP has reached **110 million monthly SDK downloads** across all official SDKs in 16 months
since launch, making it the fastest-adopted AI protocol standard by most measures.
[Source: WorkOS — Everything about MCP 2026](https://workos.com/blog/everything-your-team-needs-to-know-about-mcp-in-2026)

### Obot v0.22.0

Obot v0.22.0 (released prior to this report) added k8s Secrets binding and `obot scan`
for fleet-wide visibility into which AI clients, MCP servers, and skills are installed
across developer machines. Consistent with their clean `discovery → approval → runtime`
model.
[Source: Obot GitHub releases](https://github.com/obot-platform/obot/releases)

### MCP Tunnels (May 19, 2026)

Announced at Code with Claude London (May 19, 2026): MCP Tunnels open an outbound-only
encrypted connection so agents can reach customer data without inbound firewall rules.
Self-hosted sandboxes entered public beta with Cloudflare, Daytona, Modal, and Vercel as
providers. This is a **transport-layer** development for the gateway; no catalog schema
change needed.
[Source: WorkOS — MCP 2026](https://workos.com/blog/everything-your-team-needs-to-know-about-mcp-in-2026)

### AWS Agent Registry (preview, April 9, 2026)

No GA announcement. Still in preview in Amazon Bedrock AgentCore. Supports IAM + OAuth
(Custom JWT). Exposes registry as an MCP endpoint itself.
[Source: AWS What's New](https://aws.amazon.com/about-aws/whats-new/2026/04/aws-agent-registry-in-agentcore-preview)

---

## 8. Catalog hooks — action assessment

All 19 approved/public servers in `data/default-curated-servers.json` have been checked
against today's findings:

| Server | Finding | Action |
|---|---|---|
| All 19 | None named in SANDWORM_MODE, Miasma v2, OX RCE advisory, or Agentjacking CSA note | No action |
| `com.supabase/mcp`, `com.neon/mcp`, `com.sentry/mcp` | Re-verified 2026-06-16 (HTTP 401 on unauth access — auth-gated, not Clawdbot-style open) | No action |
| All 19 | All remote HTTP; not npm packages; SANDWORM_MODE cannot inject our endpoints | No action |

**No demotion warranted.** All servers remain `approved`/`public`.

**Next audit opportunity**: Once SEP-2127 merges (expected June 2026), run `subregistry-audit`
with a `/.well-known/mcp/server-card.json` check per cataloged server to cross-validate
tool counts and protocol version claims. This would strengthen our `verifiedAt` evidence.

---

## 9. Summary — what changed since June 16

1. **SANDWORM_MODE** (active): npm worm injecting malicious MCP configs into AI agent toolchains. No
   catalog impact; operator advisory issued above.
2. **Portkey → Prisma AIRS** (closed May 29): Portkey standalone in maintenance; PAN enters as major
   enterprise MCP player. Landscape updated.
3. **SEP-2127 / Server Cards** (approaching merge): `/.well-known/mcp/server-card.json` standard;
   plan `subregistry-audit` extension once merged.
4. **Directory growth**: PulseMCP 18,570+ (+160), Glama ~36,986 (+36).
5. **Spec** unchanged: July 28, 2026 ships in 41 days. No catalog schema change needed.
6. **No cataloged servers** named in any new security incident; all remain approved/public.

---

## Update — Second Research Pass (2026-06-17, second run)

Addendum findings surfaced in a second daily pass. All new material; none of the below
was in the morning report.

---

### 10. Miasma Worm — Third Distinct Supply-Chain Threat, Toolkit Open-Sourced

**Highest-priority new finding in this pass.**

Miasma is architecturally distinct from both SANDWORM_MODE (npm worm targeting MCP client
configs) and Mini Shai-Hulud (tool-description injection). Miasma is a **repository-level
worm** that compromises developer credentials and poisons `mcp.json` config files in
repositories themselves.

#### Timeline

- **June 5, 2026**: Miasma compromised **73 Microsoft GitHub repositories** across the
  `Azure`, `Azure-Samples`, `Microsoft`, and `MicrosoftDocs` GitHub orgs using stolen
  contributor credentials. A malicious commit landed in `Azure/durabletask`; payload
  activates when the repo is opened in Claude Code, Gemini CLI, Cursor, or VS Code — adding
  a malicious MCP server to the user's config.
  [Source: The Hacker News](https://thehackernews.com/2026/06/miasma-worm-hits-73-microsoft-github.html),
  [The Register](https://www.theregister.com/cyber-crime/2026/06/09/miasma-supply-chain-attack-toolkit-goes-public-on-github/5253074)

- **June 9, 2026**: An unknown actor open-sourced the **full Miasma toolkit** on GitHub.
  The published toolkit targets 15 AI coding agents, uses per-infection unique encryption
  to bypass hash-based detection, and ships modular payloads covering PyPI, npm, RubyGems,
  JFrog Artifactory, and GitHub.
  [Source: SafeDep](https://safedep.io/miasma-worm-ai-coding-agent-config-injection/),
  [Cloudsmith](https://cloudsmith.com/blog/miasma-worms-path-of-destruction)

#### Why this is a distinct and escalated threat

Miasma is a **descendant** of TeamPCP/Mini Shai-Hulud but doubled the target surface (15 agents
vs 7) and is now **public tooling** — the barrier to building derivative variants is near zero.
The attack surface is repository-embedded `mcp.json` files, not npm packages. A developer
cloning a compromised repo silently inherits a malicious MCP server entry.

The open-sourcing on June 9 is the key escalation signal: expect accelerating derivative
variants throughout H2 2026.

#### Registry posture

Our remote-HTTP-only catalog model remains the correct defense against all three worm vectors
(SANDWORM_MODE, Miasma, Mini Shai-Hulud). An operator reading our catalog cannot be pushed a
malicious server via the Miasma vector because our approved servers are on enterprise-owned
domains — not npm packages or repo-embedded configs.

**Operator advisory (second issuance):** Any downstream operator using Claude Code, Cursor,
VS Code, or Gemini CLI should:
- Audit all `mcp.json` / `.claude/settings.json` entries for servers they did not explicitly add.
- Treat any recently cloned repository that modified MCP config files as potentially compromised.
- Reference our approved catalog as a control layer to distinguish sanctioned from injected servers.

---

### 11. CVE-2026-27825 + CVE-2026-27826 — "MCPwnfluence" (mcp-atlassian)

Pluto Security disclosed two critical vulnerabilities in the **`mcp-atlassian`** Python package
(a popular community MCP server for Jira/Confluence). These are distinct from the OX Security
systemic RCE advisory covered in the morning report.

**CVE-2026-27825** (CVSS 9.1 — Critical): Arbitrary file write via unconstrained `download_path`
parameter in `confluence_download_attachment`. Exploitable in two unauthenticated HTTP requests;
achieves root shell. The package had ~334,000 downloads/week at time of disclosure.
[Source: Arctic Wolf](https://arcticwolf.com/resources/blog-uk/cve-2026-27825-critical-unauthenticated-rce-and-ssrf-in-mcp-atlassian/),
[Pluto Security — MCPwnfluence](https://pluto.security/blog/mcpwnfluence-cve-2026-27825-critical/)

**CVE-2026-27826** (SSRF): Unvalidated `X-Atlassian-Jira-Url` / `X-Atlassian-Confluence-Url`
headers enable SSRF; exploits cloud metadata endpoint (`169.254.169.254`) to steal IAM credentials.
[Source: GitLab advisory](https://advisories.gitlab.com/pkg/pypi/mcp-atlassian/CVE-2026-27826/)

**Both patched in mcp-atlassian 0.17.0** (February 2026).

#### Registry impact

`com.atlassian/mcp` in our catalog points to Atlassian's **official remote server**
(`https://mcp.atlassian.com/v1/mcp`) — not the `mcp-atlassian` Python package. The official
remote server is operated by Atlassian, not the community package. No catalog action needed;
noting for operator awareness.

#### Companion scanner — MCPwn

A new open-source MCP supply chain scanner (`mcpwn`) was published alongside this disclosure.
It scanned 14 servers and found 100% with critical findings. Additional finding: `nginx-ui`
MCP integration — CVE-2026-33032 (CVSS 9.8), full server takeover in two requests, 2,600+
exposed instances.
[Source: GitHub ressl/mcpwn](https://github.com/ressl/mcpwn),
[DEV Community](https://dev.to/piiiico/mcpwn-is-live-we-scanned-the-supply-chains-of-14-mcp-servers-heres-what-we-found-38cl)

---

### 12. CVE-2026-25536 — MCP TypeScript SDK Cross-Client Data Leak

A vulnerability in the official `@modelcontextprotocol/sdk` (versions 1.10.0–1.25.3) caused
cross-client data leaks when a single `McpServer` instance was reused across multiple
`StreamableHTTPServerTransport` connections — JSON-RPC message ID collisions routed responses
to wrong clients.

- CVSS: AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:L/A:N
- Patched in SDK version **1.26.0**
- Published: February 4, 2026
[Source: Tenable](https://www.tenable.com/cve/CVE-2026-25536),
[VulnerableMCP.info](https://vulnerablemcp.info/vuln/cve-2026-25536-sdk-cross-client-data-leak.html)

**Registry relevance**: Vendors who ship a self-hosted remote HTTP MCP server using the
TypeScript SDK should confirm they are running ≥1.26.0. Our `verifiedAt` audit cadence is the
mechanism to surface this; flag for the next `subregistry-audit` pass.

---

### 13. Salesforce Summer '26 — MCP Servers GA (June 15, 2026)

Salesforce's Agentforce MCP servers reached **General Availability on June 15, 2026** as part
of the Summer '26 release — one day before this research pass.

- External agents (Claude, ChatGPT, Cursor) can consume Salesforce MCP tools natively: SObject
  CRUD, SOQL queries, Data 360, and Tableau analytics.
- Bidirectional: Agentforce also consumes external MCP servers via Atlas Reasoning Engine 3.0.
- Salesforce Agentforce ARR: $800M, up 169% YoY; combined AI revenue $2.9B.
[Source: TechTimes](https://www.techtimes.com/articles/318456/20260616/salesforce-agentforce-multi-agent-orchestration-hits-ga-agent-descriptions-now-drive-reliability.htm),
[Salesforce release notes](https://www.salesforce.com/news/stories/summer-2026-product-release-announcement/),
[ChatForest builder guide](https://chatforest.com/builders-log/salesforce-summer-26-agentforce-multi-agent-orchestration-atlas-a2a-mcp-builder-guide/)

**Registry implication**: Salesforce-hosted MCP is now a real enterprise endpoint. The server
URL pattern would be org-specific (like Google Cloud MCP), which is why it was not in the catalog
previously. Landscape honorable mentions updated.

---

### 14. HubSpot Remote MCP — GA Confirmed (April 13, 2026)

**This unblocks a previously pending catalog candidate.**

The HubSpot remote MCP at `mcp.hubspot.com` reached GA on April 13, 2026 with full read + write
capabilities. This was previously blocked by this environment's egress; the confirmation comes
from HubSpot's official developer changelog.

- Auth: OAuth 2.1 + PKCE, user-scoped permissions respected
- Endpoint: `https://mcp.hubspot.com/mcp`
- Read + write: contacts, companies, deals, tickets, carts, products, orders, invoices, quotes,
  subscriptions, segments, calls, emails, meetings, notes, tasks
- Read-only: blog posts, landing pages, campaigns, marketing events
[Source: HubSpot developer changelog](https://developers.hubspot.com/changelog/remote-hubspot-mcp-server-is-now-generally-available),
[HubSpot MCP docs](https://developers.hubspot.com/mcp)

**Catalog action**: HubSpot MCP is confirmed GA. Add in the next `subregistry-curate` run
(Comms & support group alongside Intercom, Zapier). Endpoint: `https://mcp.hubspot.com/mcp`.

---

### 15. Atlassian — HTTP+SSE Transport Deprecated June 30, 2026

Atlassian issued a hard deprecation notice: the HTTP+SSE endpoint
(`https://mcp.atlassian.com/v1/sse`) goes dark on **June 30, 2026**. Replacement is
Streamable HTTP at `https://mcp.atlassian.com/v1/mcp`.
[Source: Atlassian Community](https://community.atlassian.com/forums/Atlassian-Remote-MCP-Server/HTTP-SSE-Deprecation-Notice/ba-p/3205484)

**Catalog status: already safe.** `com.atlassian/mcp` in our catalog is recorded with
`https://mcp.atlassian.com/v1/mcp` (Streamable HTTP) — the correct post-deprecation URL.
No catalog update needed.

**Watch item**: `com.asana/mcp` currently uses `https://mcp.asana.com/sse` (SSE transport).
Asana has not announced a deprecation date, but the broader MCP ecosystem is moving away from
SSE. Flag for the next `subregistry-audit` to verify Asana's SSE endpoint remains live and
check for an announced migration.

---

### 16. Player Pulse — June 17 Updates

**Runlayer** (v0.25.0, June 9): Added **1Password integration** (vault references only — never
raw secrets), **Box MCP server** with identity enforcement + audit logging, **Cursor hooks
partnership**, and full **AARM Extended Conformance** (R1–R9: intercept, evaluate, enforce, and
produce cryptographically signed audit receipts). The 1Password integration is a direct signal
that enterprise buyers want secrets-safe catalog entries; Runlayer stores vault *names*, not values.
[Source: 1Password blog](https://1password.com/blog/secure-mcp-credentials-1password-runlayer),
[Runlayer blog](https://www.runlayer.com/blog)

**TrueFoundry**: Launched **Agent Gateway on June 2, 2026** — a unified control plane joining
their LLM Gateway and MCP Gateway with per-team RBAC. Customers: NVIDIA, Innovaccer, Siemens
Healthineers. Also confirmed Claude Fable 5 live on TrueFoundry AI Gateway.
[Source: BusinessWire](https://www.businesswire.com/news/home/20260602233322/en/TrueFoundry-Launches-Agent-Gateway-to-Close-the-Enterprise-AI-Governance-Gap)

**PulseMCP**: Launched **"Estimated Downloads" metric** — a blended signal from registry counters,
social, and web traffic — for every listed server. Useful quality signal to consider for future
catalog notes.
[Source: PulseMCP newsletter](https://www.pulsemcp.com/posts/newsletter-ai-energy-gpt-image-api-estimated-mcp-downloads)

**Docker MCP**: Added a **warning banner for unverified community servers** in the Docker Desktop
catalog UI. This is external confirmation that the `approved != discovered` stance is mainstream —
even Docker now visually distinguishes vetted from unvetted servers.
[Source: Docker MCP Catalog docs](https://docs.docker.com/ai/mcp-catalog-and-toolkit/catalog/)

**Official registry** (PR #1364): Added `postInstallInstructions` as an optional field in the
package schema. Lets server authors surface post-install setup steps in the registry record.
[Source: modelcontextprotocol/registry PRs](https://github.com/modelcontextprotocol/registry/pulls)

---

### 17. Catalog Hooks — Second Pass Assessment

| Server | Finding | Action |
|---|---|---|
| `com.atlassian/mcp` | SSE deprecated June 30; our catalog uses Streamable HTTP URL already | None — already safe |
| `com.asana/mcp` | Uses SSE endpoint; no deprecation announced but watch category | Flag for next audit |
| All 19 | CVE-2026-27825/27826 affects community `mcp-atlassian` package, not official remote | None |
| All 19 | CVE-2026-25536 affects TypeScript SDK <1.26.0 (server-side); re-verify on next audit pass | Flag: ask vendors to confirm SDK version |
| HubSpot | GA confirmed; endpoint `https://mcp.hubspot.com/mcp`, OAuth 2.1 + PKCE | Add via `subregistry-curate` |

---

### 18. Second-Pass Summary

1. **Miasma worm toolkit open-sourced (June 9)**: Third distinct supply-chain threat vector.
   73 Microsoft repos compromised June 5; full toolkit public June 9. Derivative variants
   expected to accelerate in H2 2026. Remote-HTTP catalog model is the correct defense.
2. **CVE-2026-27825/27826 (MCPwnfluence)**: Critical RCE + SSRF in `mcp-atlassian` Python package.
   Our catalog uses official remote server, not the community package — no direct action needed.
3. **CVE-2026-25536**: MCP TypeScript SDK data-leak patched in 1.26.0 — flag for next audit.
4. **Salesforce MCP GA (June 15)**: Major enterprise vendor goes live with MCP. Org-specific
   endpoint pattern keeps it out of our catalog; landscape honorable mentions updated.
5. **HubSpot MCP confirmed GA**: Catalog candidate now fully unblocked. Add in next curate run.
6. **Atlassian SSE deadline June 30**: Our catalog URL already correct.
7. **Asana SSE watch**: No deprecation announced; flag for next audit.
8. **Ecosystem tooling**: MCPwn scanner (100% critical across 14 servers), PulseMCP Estimated
   Downloads metric, Docker unverified-server warning banner — all validate the trust-gate model.
