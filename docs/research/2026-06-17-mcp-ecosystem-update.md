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
