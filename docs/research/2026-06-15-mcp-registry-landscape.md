# MCP Registry & Sub-Registry Landscape — 2026-06-15

First landscape scan for the MCP Sub-Registry. Establishes the field, the top players,
the trust/security backdrop, and where this product's niche sits. All external claims are
linked. Web-research date: 2026-06-15. Maintained by the orchestrator (`CLAUDE.md` §10).

> Method note: live web research run from the main session (sub-agents are denied web
> egress). API-shape facts about the official registry are corroborated against this
> repo's own upstream client (`apps/api/src/services/registry-client.ts`).

---

## Executive summary

1. **The official MCP Registry is discovery-only and unvetted.** It launched in preview
   (2025-09-08), froze its API at `v0.1`, and is iterating toward a v1 GA. It stores
   `server.json` metadata and explicitly does **not** guarantee server quality, security,
   or uniqueness. That gap is the entire reason a curated sub-registry exists.
2. **The market splits into two layers** that are often conflated: **aggregators/directories**
   (breadth, discovery — Glama, PulseMCP, Smithery, mcp.so, MCP Market, Docker MCP Catalog)
   and **governance planes** (gateways + enterprise registries — JFrog, Lunar.dev MCPX,
   Obot, TrueFoundry, Kong, Runlayer, MintMCP, Microsoft, AWS).
3. **The exact niche of this product — a curated catalog that cleanly separates
   `discovered != approved != enabled` and feeds a separate gateway as disabled drafts —
   is rare.** A 2026 survey of 13 enterprise gateways found *only Obot and Lunar.dev MCPX*
   clearly separate discovery → approval → runtime; most collapse those boundaries.
4. **Security has become the dominant buying reason.** Real malicious-server and
   tool-poisoning incidents (postmark-mcp; CVE-2025-54136) made "supply-chain allowlist"
   the core value proposition of a curated registry. Provenance, version-locking, and
   change-detection are now table stakes.

**Implication for us:** stay narrowly the *curation/approval* layer, lead with the clean
trust boundary and provenance, and treat the gateway projection as the defensible product
surface. Do not drift into gateway/runtime features — that market is crowded; ours is not.

---

## 1. The official MCP Registry (upstream)

| Fact | Detail | Source |
| --- | --- | --- |
| What it is | App-store-style metadata registry of publicly available MCP servers; authoritative discovery source | [modelcontextprotocol.io/registry/about](https://modelcontextprotocol.io/registry/about) |
| Launch | Preview launched **2025-09-08** | [github.com/modelcontextprotocol/registry](https://github.com/modelcontextprotocol/registry) |
| API status | API frozen at **v0.1**; v0 development continues while validating toward **v1 GA** | [github.com/modelcontextprotocol/registry](https://github.com/modelcontextprotocol/registry) |
| Base URL | `https://registry.modelcontextprotocol.io` (this repo's client targets `/v0.1/servers`) | repo `registry-client.ts` |
| Data format | `server.json`; versioned schema (e.g. `static.modelcontextprotocol.io/schemas/2025-07-09/server.schema.json`) | [modelcontextprotocol.info/tools/registry/publishing](https://modelcontextprotocol.info/tools/registry/publishing/) |
| List semantics | cursor/`limit` pagination, `updated_since`, `include_deleted=true`, `version=latest`; soft-delete (deleted records retrievable on request) | repo `registry-client.ts` + `modelcontextprotocol.io/registry` |
| Operators | Stewarded with Anthropic, GitHub, PulseMCP, Microsoft | [truefoundry.com/blog/best-mcp-registries](https://www.truefoundry.com/blog/best-mcp-registries) |
| Guarantees | **None on quality/security/uniqueness** — metadata only, permissive moderation | [truefoundry.com/blog/best-mcp-registries](https://www.truefoundry.com/blog/best-mcp-registries) |
| Spec trajectory | **2026-07-28 spec release candidate**: stateless core, extensions, auth improvements, formal deprecation policy | [blog.modelcontextprotocol.io](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/) |

**Read:** we sync from this source, preserve its `io.modelcontextprotocol.registry/official`
namespace, and add curation on top. We assume `/v0.1` upstream; re-verify the version label
and schema date each research cycle, as v1 GA will move them.

---

## 2. Aggregators / directories (breadth layer)

Large public catalogs optimized for discovery, not governance. Useful as **sync sources**
and competitive reference; none of them is a trust boundary.

| Player | Approx. scale | Curation | Hosting | Notes | Source |
| --- | --- | --- | --- | --- | --- |
| **Glama** | ~36,950 servers | Light/curated subset | Metadata | Large open-source registry | [glama.ai/mcp/servers](https://glama.ai/mcp/servers) |
| **PulseMCP** | ~18,240+ servers | Largest hand-reviewed directory | Metadata | Co-steward of official registry | [pulsemcp.com/servers](https://www.pulsemcp.com/servers) |
| **mcp.so** | ~19,000 submitted | No verification; open GitHub submit | Metadata | Largest selection, hard for production | [truefoundry.com/blog/best-mcp-registries](https://www.truefoundry.com/blog/best-mcp-registries) |
| **MCP Market** | ~10,000+ | Community-curated, browsable UI | Metadata | Good for category browsing | [truefoundry.com/blog/best-mcp-registries](https://www.truefoundry.com/blog/best-mcp-registries) |
| **Smithery** | ~2,500–7,000 (sources vary) | No formal governance | Hosted + local CLI | Best for prototyping, not production | [truefoundry](https://www.truefoundry.com/blog/best-mcp-registries) · [obot.ai](https://obot.ai/blog/the-13-best-mcp-gateways-for-enterprise-teams/) |
| **Docker MCP Catalog** | — | OCI-based; container-per-server | Hosted images | Private OCI catalogs for enterprises | [docker.com/blog/private-mcp-catalogs](https://www.docker.com/blog/private-mcp-catalogs-oci-composable-enterprise-ai/) |

> Provenance across these "remains unclear and quality varies wildly" — the recurring
> critique that motivates a curated layer.
> [automationswitch.com](https://automationswitch.com/ai-workflows/where-to-find-mcp-servers-2026)

## 3. Governance planes (gateways + enterprise registries)

These pair a registry/catalog with runtime enforcement. Most **collapse** discovery,
approval, and runtime — the opposite of our model. From the 2026 13-gateway survey
([obot.ai](https://obot.ai/blog/the-13-best-mcp-gateways-for-enterprise-teams/)):

| Player | Has catalog? | Discovery→Approval→Runtime separation | License |
| --- | --- | --- | --- |
| **Obot** | Curated, IT-verified trust levels | **Yes (clean)** | OSS (MIT) |
| **Lunar.dev MCPX** | Admin-operated | **Partial (sandbox/pre-prod)** | OSS core + commercial |
| **JFrog MCP Registry** | Curated internal catalog, RBAC + audit | Governance-first allowlist | Commercial | ([truefoundry](https://www.truefoundry.com/blog/best-mcp-registries)) |
| **TrueFoundry** | Platform-managed registry | Unclear (no end-user catalog) | Commercial |
| **Runlayer** | IT-curated registry | Partial | Commercial |
| **MintMCP** | "10,000+" catalog (vetting undocumented) | Unclear | Commercial |
| **Kong AI Gateway** | MCP Registry (Technical Preview) | Partial | OSS core + commercial |
| **Microsoft MCP Gateway** | **None** | No (admin config only) | OSS (k8s) |
| **AWS Bedrock AgentCore** | Semantic search, no UI | No (discovery coupled to runtime) | Commercial (AWS) |
| **Docker MCP Gateway** | OCI catalog | No (no enterprise IdP/RBAC) | OSS |
| **agentic-community/mcp-gateway-registry** | Gateway+registry, OAuth, dynamic discovery | Governance-oriented | OSS | ([github](https://github.com/agentic-community/mcp-gateway-registry)) |

Also relevant: Composio (managed connector library), Portkey (read-only directory),
MCP Manager (policy UI, no catalog), Operant, Arcade (runtime, not governance), Airlock
(human-in-the-loop approval). See [obot.ai](https://obot.ai/blog/the-13-best-mcp-gateways-for-enterprise-teams/),
[getmaxim.ai](https://www.getmaxim.ai/articles/top-5-enterprise-mcp-gateway-solutions-in-2026/),
[arcade.dev](https://www.arcade.dev/blog/mcp-gateways-runtimes-registries-guide/).

## 4. Security & trust backdrop (the "why")

| Signal | Detail | Source |
| --- | --- | --- |
| First malicious MCP server | `postmark-mcp` — ~1,500 downloads/week, ~300 orgs affected before discovery (Koi Security) | [pipelab.org/state-of-mcp-security-2026](https://pipelab.org/blog/state-of-mcp-security-2026/) |
| Tool poisoning | Malicious tool descriptions enter the agent context as trusted content; **CVE-2025-54136** is a structural case | [truefoundry tool-poisoning](https://www.truefoundry.com/blog/blog-mcp-tool-poisoning-gateway-defense) |
| Rug pulls | Tool passes review, then silently mutates its definition; most clients don't alert on description changes | [practical-devsecops](https://www.practical-devsecops.com/mcp-security-vulnerabilities/) |
| Recommended controls | Digital signing, version-locking, provenance tracking, scan descriptions at install **and every update**, reject silent changes | [aembit.io](https://aembit.io/blog/the-ultimate-guide-to-mcp-security-vulnerabilities/) |

**Read:** these map directly to features we should own — version-pinned approvals,
`contentHash` per item (already present), provenance/verification metadata, and a
research routine that watches for incidents affecting cataloged servers.

---

## 5. Where this product sits (positioning)

- **We are a curation/approval layer, not a gateway and not a directory.** Our defensible
  edge is the clean `discovered != approved != enabled` separation that the market mostly
  lacks (only Obot / Lunar.dev MCPX do it cleanly).
- **Closest analogues:** JFrog MCP Registry and Runlayer (curated internal catalog as
  supply-chain allowlist) — but those are bundled into commercial governance suites. A
  focused, standalone, MCP-Registry-compatible curated catalog feeding *any* gateway via a
  documented projection is open white space.
- **Moat to build:** trust signals (provenance, verification, version-pinning,
  change-detection) + a stable, well-specified gateway projection contract.
- **Anti-goals:** do not add runtime, proxying, secret injection, RBAC, or a public
  marketplace. That is where the crowded gateway market lives.

## 6. Open questions to resolve next cycle

1. Official registry v1 GA timing + final schema version/date (re-verify `/v0.1` assumption).
2. Does the official project define/bless a downstream "sub-registry" concept, or only
   third-party patterns (PulseMCP-style)?
3. Emerging standards for signed/provenance-attested MCP servers we should consume.
4. Whether JFrog/Runlayer/Obot expose a *documented catalog projection contract* a gateway
   imports — direct competitor analysis for our `/v0.1/gateway/catalog`.

## Sources

- https://modelcontextprotocol.io/registry/about
- https://github.com/modelcontextprotocol/registry
- https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/
- https://modelcontextprotocol.info/tools/registry/publishing/
- https://www.truefoundry.com/blog/best-mcp-registries
- https://obot.ai/blog/the-13-best-mcp-gateways-for-enterprise-teams/
- https://glama.ai/mcp/servers
- https://www.pulsemcp.com/servers
- https://www.docker.com/blog/private-mcp-catalogs-oci-composable-enterprise-ai/
- https://automationswitch.com/ai-workflows/where-to-find-mcp-servers-2026
- https://www.arcade.dev/blog/mcp-gateways-runtimes-registries-guide/
- https://www.getmaxim.ai/articles/top-5-enterprise-mcp-gateway-solutions-in-2026/
- https://github.com/agentic-community/mcp-gateway-registry
- https://pipelab.org/blog/state-of-mcp-security-2026/
- https://www.truefoundry.com/blog/blog-mcp-tool-poisoning-gateway-defense
- https://www.practical-devsecops.com/mcp-security-vulnerabilities/
- https://aembit.io/blog/the-ultimate-guide-to-mcp-security-vulnerabilities/
</content>
