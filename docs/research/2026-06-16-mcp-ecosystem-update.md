# MCP Ecosystem Update — 2026-06-16

Daily research pass. Covers developments since the June 15 second-pass report
([2026-06-15-mcp-ecosystem-update.md](./2026-06-15-mcp-ecosystem-update.md)).
Focus: what changed, what it means to a curated sub-registry. All external claims are cited.

---

## 1. Official registry & spec — no new breaking changes

### Official registry — June 10 release includes ACR/MCR support

The `modelcontextprotocol/registry` GitHub repository shows a commit/update on **June 10, 2026**
that added support for **ACR (Azure Container Registry)** and **MCR (Microsoft Container Registry)**
as package sources in `server.json`.
[Source: github.com/modelcontextprotocol/registry](https://github.com/modelcontextprotocol/registry)

**Implication:** The upstream server.json schema can now reference container-registry sources
in addition to npm/PyPI/Docker Hub. Our catalog model already stores `packages[]` as an
array of `{registry_name, name, version}` objects; ACR/MCR are additive. No schema
migration needed, but if we curate containerized servers in future we should store the
`registry_name` accurately (e.g. `mcr.microsoft.com`).

### Spec RC — locked; no new changes

The 2026-07-28 RC (locked May 21, ships July 28) is unchanged. No new SEPs or
amendments since the June 15 report. The stateless core, Tasks extension (3-endpoint
pattern: create/status/cancel), MCP Apps (server-rendered UIs), and mandatory
`Mcp-Method`/`Mcp-Name` headers remain the key changes.
Sources: [MCP RC blog post](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/),
[DEV.to migration](https://dev.to/rabinarayanpatra/why-mcp-2026-07-28-spec-drops-sessions-and-goes-stateless-1gd)

---

## 2. Registry / catalog player updates

### Directory scale (June 2026)

| Directory | Count | Change vs 2026-06-15 | Source |
|---|---|---|---|
| **Glama** | ~36,950 | Unchanged | [glama.ai/mcp/servers](https://glama.ai/mcp/servers) |
| **PulseMCP** | ~18,410+ | **+170 from 18,240+** | [pulsemcp.com](https://www.pulsemcp.com/servers) |
| **mcp.so** | ~20,222 | Unchanged | prior report |
| **Smithery** | ~7,000+ | Unchanged | prior report |

PulseMCP growth: +170 servers in roughly 24 hours, consistent with its ongoing 1,000+/month
intake pace.

### Kong MCP Registry — formal announcement February 2, 2026

The **exact announcement date** is now confirmed: **February 2, 2026**. Kong introduced
the MCP Registry as a new enterprise directory inside **Kong Konnect Catalog** to register,
discover, and govern MCP servers and AI-native tools for agentic applications.
[Source: PR Newswire](https://www.prnewswire.com/news-releases/kong-introduces-mcp-registry-in-kong-konnect-to-power-ai-connectivity-for-agent-discovery-and-governance-302676451.html),
[Kong press room](https://konghq.com/company/press-room/press-release/kong-introduces-mcp-registry),
[DEVOPSdigest](https://www.devopsdigest.com/kong-introduces-mcp-registry-in-kong-konnect)

Key features:
- Centralized system of record for approved internal and external MCP servers
- Governance over servers "in full operational context" including API dependencies,
  ownership, blast radius, and inherited policies
- Compliant with the AI Alliance Interoperability Framework (AAIF)
- Launched in **tech preview** inside Kong Konnect; Dev Portal and secure access
  capabilities to follow

**Implication for our ranking:** Kong's tech preview is now formally announced and shipping
(not just rumored). Moving from "watch list" to a ranked entry is warranted — see landscape
update below. Kong's angle is API-centric governance tying MCP servers to their underlying
APIs; this is differentiated from our standalone catalog-projection model but targets the
same enterprise buyer.

### Runlayer — named to "Rising in Cyber 2026"

Runlayer was named to **Notable Capital & Morgan Stanley's Rising in Cyber 2026 list**,
voted on by 150 sitting CISOs. The list identifies the 30 most promising private cybersecurity
startups based on CISO surveys.
[Source: risingincyber.com](https://risingincyber.com/),
[PRNewswire correction notice](https://www.prnewswire.com/news-releases/notable-capital-unveils-rising-in-cyber-2026-302769101.html),
[Runlayer $11M blog](https://www.runlayer.com/blog/runlayer-raises-11m-to-scale-enterprise-mcp-infrastructure)

Context: Runlayer also reported enterprise customer traction (Instacart, Gusto, dbt Labs,
Opendoor) within four months of stealth operations. The CISO vote endorsement is a
meaningful signal — it means 150 enterprise security executives are paying attention.

**Implication:** Runlayer's credibility as an enterprise MCP security layer is growing
fast. Their 18,000+ server catalog with security-approved entries + ABAC is the closest
direct competitor to a curated sub-registry in the commercial space.

### Obot — v0.22.0 and MCP Dev Summit workshops

Obot released **v0.22.0** with a notable catalog feature:
- Kubernetes Secrets binding for catalog entry environment variables — catalog entries can
  now declare a `secretBinding` and Obot wires values from existing k8s Secrets into MCP
  server pods at deploy time, rather than requiring users to type credentials into Obot.

Obot also hosted workshops at:
- **MCP Dev Summit Bengaluru** — June 9, 2026 (enterprise MCP authentication, identity, governance)
- **MCP Dev Summit Mumbai** — June 14, 2026

[Source: obot.ai resources](https://obot.ai/resources/learning-center/mcp-catalog/),
[Obot MCP governance](https://obot.ai/enterprise-mcp-governance/)

**Implication for our boundary:** Obot's k8s Secrets binding is a deployment-time runtime
feature that belongs on their side of the `approved != enabled` boundary. Our catalog stores
only secret *names* (e.g. `ANTHROPIC_API_KEY`, `AWS_ACCESS_KEY_ID`); Obot binds the values.
This is correct boundary discipline — no action on our side.

### MintMCP — SOC 2 Type II confirmed; not a catalog

Confirmed: **MintMCP** holds **SOC 2 Type II** certification. It provides HIPAA compliance,
BAA availability, SAML/OIDC/RBAC, and managed hosting for MCP servers.
However, it is explicitly a **gateway/deployment tool, not a catalog or registry** — it has
no server registry or lifecycle tracking system for what MCP servers exist and who owns them.
[Source: mintmcp.com](https://www.mintmcp.com/blog/mcp-gateways-soc2-compliant-organizations),
[Prefect comparison](https://www.prefect.io/resources/best-mcp-deployment-platforms-enterprise-2026)

**Implication:** MintMCP occupies a different niche. Its SOC 2 Type II certification is
the strongest compliance posture of any player reviewed so far. Not a direct competitor to
us (catalog) but a potential downstream consumer of our gateway projection.

### AWS Agent Registry — still in preview; pricing model confirmed

AWS Agent Registry (Bedrock AgentCore) remains in **preview** as of June 2026 (launched
April 9, 2026). New detail: the confirmed pricing model is **per Net Records** (active
records at any moment; deletions decrement the count), indicating GA is not yet shipped.
[Source: aws.amazon.com/bedrock/agentcore/pricing](https://aws.amazon.com/bedrock/agentcore/pricing/),
[InfoQ April 2026](https://www.infoq.com/news/2026/04/aws-agent-registry-preview/),
[AWS What's New](https://aws.amazon.com/about-aws/whats-new/2026/04/aws-agent-registry-in-agentcore-preview)

---

## 3. Security — npm supply chain worm targets MCP server packages directly

This is the most significant new finding in this pass. The threat landscape has escalated
from targeted MCP server vulnerabilities to **active npm supply chain worms that explicitly
target MCP server packages**.

### Mini Shai-Hulud: npm worm with MCP server injection payload

A worm-style supply chain attack tracked as **"Mini Shai-Hulud"** and more recently as the
**Node-gyp Supply Chain Compromise** has been executing in multiple waves since early 2026.
Key timeline:

| Date | Event |
|---|---|
| April 29, 2026 | First wave published to npm — TanStack and others compromised |
| May 11, 2026 | Second wave — 796 packages, ~132M combined monthly downloads |
| May 14, 2026 | node-ipc (10M weekly downloads) compromised: versions 9.1.6, 9.2.3, 12.0.1 published simultaneously |
| May 28–29, 2026 | Microsoft MSRC published advisories on typosquatted npm packages + dependency confusion variants |
| June 2026 | Snyk tracking ongoing as "Node-gyp Supply Chain Compromise — June 2026"; 57 packages, hundreds of malicious versions |

Sources:
[Wiz Blog (TanStack)](https://www.wiz.io/blog/mini-shai-hulud-strikes-again-tanstack-more-npm-packages-compromised),
[Snyk node-gyp](https://snyk.io/blog/node-gyp-supply-chain-compromise-self-propagating-npm-worm-binding-gyp/),
[NHS England Digital advisory](https://digital.nhs.uk/cyber-alerts/2026/cc-4781),
[Microsoft MSRC May 28](https://www.microsoft.com/en-us/security/blog/2026/05/28/typosquatted-npm-packages-used-steal-cloud-ci-cd-secrets/),
[Microsoft MSRC May 29](https://www.microsoft.com/en-us/security/blog/2026/05/29/33-malicious-npm-packages-abuse-dependency-confusion-profile-developer-environments/),
[Unit 42 npm tracker](https://unit42.paloaltonetworks.com/monitoring-npm-supply-chain-attacks/)

**MCP-specific payload capabilities:**
- The worm specifically targets packages with `mcp-server` in the npm package name
- Injects an **embedded prompt injection payload into MCP tool descriptions**, designed to
  target and hijack AI coding assistants (Claude Code, Cursor, Codex CLI, etc.)
- Harvests **LLM API keys** (Anthropic, OpenAI, etc.) from environment variables
- Self-propagates by re-publishing packages from any maintainer account it reaches
- GitHub API exfiltration with DNS fallback for credential exfiltration
- Persistence via hook injection into GitHub Actions workflows

[Source: Glasp summary article](https://glasp.co/articles/mcp-security-tool-poisoning-supply-chain),
[The Hacker News Feb 2026](https://thehackernews.com/2026/02/malicious-npm-packages-harvest-crypto.html)

**Catalog flags:**
1. Our 19 curated servers are **remote HTTP/streamable-HTTP endpoints**, not npm packages.
   Direct exposure is **low** — we do not distribute via npm.
2. However: any downstream consumer that wraps our catalog items with npm-installed adapters
   (e.g. `@mcp/client-http`) should verify those adapter packages were not in the affected set.
3. We should add a catalog metadata field note that delivery is remote HTTP (not npm), to
   help consumers understand that our entries bypass this attack vector entirely.
4. **Prompt injection into MCP tool descriptions is now confirmed weaponized at scale.**
   This directly validates our position: a curated sub-registry that verifies tool
   descriptions before approving a server is a control layer that blocks this exact attack.
   Our tool count and description review should be a documented part of the curation process.

### Clawdbot/OpenClaw exposure — now fully documented

The **Clawdbot (also known as OpenClaw and Moltbot)** exposure from January 2026 is now
fully documented with active-exploitation evidence:

| Field | Value |
|---|---|
| Date | January 23–26, 2026 (initial discovery + disclosure) |
| Affected | 900+ exposed gateways on port 18789; some sources cite 42,000+ instances total |
| Data exposed | Anthropic API keys, Telegram/Slack tokens, Signal credentials, chat histories |
| Root cause | WebSocket API on port 18789 had auth disabled by default; blindly trusted any connection routed via reverse proxy as localhost |
| Active exploitation | Confirmed — automated campaigns extracting credentials and establishing persistent access |

Sources:
[CryptoTimes Jan 27](https://www.cryptotimes.io/2026/01/27/clawdbot-gateway-exposure-puts-api-keys-and-chats-at-risk/),
[CybersecurityNews](https://cybersecuritynews.com/clawdbot-chats-exposed/),
[Pillar Security (active traffic)](https://www.pillar.security/blog/caught-in-the-wild-real-attack-traffic-targeting-exposed-clawdbot-gateways),
[VentureBeat](https://venturebeat.com/security/mcp-shipped-without-authentication-clawdbot-shows-why-thats-a-problem),
[PointGuard AI](https://www.pointguardai.com/ai-security-incidents/mcp-without-guardrails-leaves-clawdbot-exposed)

**Catalog flag:** Clawdbot/OpenClaw is not in our catalog. This incident is now the
canonical real-world case for "MCP without authentication." Our selection criterion of
requiring documented auth (OAuth 2.0, API key, or IAM) is directly validated. For the
`com.supabase/mcp` and `com.neon/mcp` entries (flagged in §13 for auth model verification),
this incident makes that verification higher priority.

### Running security threat table (updated)

| Threat | Status | Change since 2026-06-15 |
|---|---|---|
| postmark-mcp malicious npm squatting | Canonical named incident | No new named incident |
| CVE-2025-54136 (tool poisoning) | Structural baseline | No patch; protocol level |
| CVE-2026-26118 (Azure MCP SSRF) | Patched March 10, 2026 | Unchanged |
| CVE-2026-33032 (nginx-ui unauthenticated RCE) | Ongoing risk | Unchanged |
| CVE-2026-30615 (Windsurf IDE zero-interaction RCE) | IDE-side; not a catalog server | Unchanged |
| Rug pull attacks | Active threat | Now confirmed category: **silent description mutations weaponized** |
| Clawdbot/OpenClaw exposure | **Active exploitation confirmed** | **NEW** — fully documented; 900+ gateways |
| Mini Shai-Hulud npm worm | **Active; MCP packages explicitly targeted** | **NEW** — prompt injection in tool descriptions |

---

## 4. Provenance / signing — academic architecture proposed

### MDPI paper: RFC 8615 + Sigstore OIDC + JCS/JWS for MCP registries

A peer-reviewed paper in **MDPI Future Internet (vol. 18, no. 5, 2026)** proposes a
three-layer security architecture specifically for MCP registries:

1. **RFC 8615 decentralized discovery** — well-known endpoints for registry metadata
2. **Sigstore OIDC-backed provenance** — signing at build time using keyless
   certificate-transparency-backed signatures (the same approach SLSA uses)
3. **JCS/JWS runtime message signing** — JSON Canonicalization Scheme + JSON Web
   Signatures to detect and block dynamic capability mutation (rug pull attacks)

The paper identifies two root-cause gaps: (a) the current registry relies on an unverified
pointer architecture, and (b) MCP has no built-in mechanism to detect definition changes
post-approval.
[Source: MDPI Future Internet 18(5):243](https://www.mdpi.com/1999-5903/18/5/243)

**Implication:** The academic community is now formalizing the provenance architecture
that practitioners have been calling for. The three-layer model maps cleanly to our
curation lifecycle:
- Layer 1 (RFC 8615 discovery) → our upstream sync
- Layer 2 (Sigstore provenance) → a future field in our curation metadata: `provenance.attestation_url`
- Layer 3 (JCS/JWS runtime) → out of scope for our registry; this belongs on the gateway

No action required now. Record as a roadmap item: when Sigstore attestations become
common in the official registry, add `provenance.attestation_url` and
`provenance.signing_method` to our approved server schema.

---

## 5. Catalog hooks — flags from this pass

| Server | Flag | Priority |
|---|---|---|
| `com.supabase/mcp` | Auth model unverified; Akamai database-backend class flagged; Clawdbot incident makes this higher priority | **Elevated: verify auth in next audit** |
| `com.neon/mcp` | Same as supabase | **Elevated: verify auth in next audit** |
| All 19 servers | npm supply chain worm targets `mcp-server` packages; our servers are remote HTTP endpoints — direct exposure is low | Log: add delivery-type note to curation docs |
| HubSpot MCP (`mcp.hubspot.com`) | Pending external verification (blocked by environment egress); OAuth 2.1 + PKCE — auth model is the right kind | Unchanged |

No endpoints in the current catalog appear dead or ownership-changed based on this pass.
The next full endpoint verification should be the `subregistry-audit` run.

---

## Summary — what changed and what it means

| Topic | Finding | Action |
|---|---|---|
| Spec | No new changes; RC locked May 21, ships July 28 | Track; no catalog schema change |
| Official registry | June 10 update: ACR/MCR support | Note in schema docs if containerized servers added |
| PulseMCP | 18,410+ (+170) | Scale signal; no action |
| Kong MCP Registry | Formally announced Feb 2, 2026 — tech preview in Konnect | **Update landscape ranking** |
| Runlayer | Rising in Cyber 2026 (150 CISO votes) | Reinforces #10 ranking; note in landscape |
| Obot v0.22.0 | k8s Secrets binding for catalog entries | Confirms registry/runtime boundary is holding |
| npm supply chain worm | Mini Shai-Hulud **explicitly targets MCP server npm packages + injects prompt injection into tool descriptions** | **Flag in catalog: our remote-HTTP delivery bypasses this** |
| Clawdbot | 900+ exposed gateways; active exploitation | **Elevates auth verification priority for supabase/neon** |
| MDPI paper | Three-layer provenance architecture formally proposed | Add `provenance.attestation_url` to roadmap |
| AWS Agent Registry | Still in preview | Unchanged watch item |
