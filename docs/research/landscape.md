# MCP Registry Landscape — Canonical Ranking

Living ranking of the significant MCP registry / catalog / governance players, maintained
by the orchestrator's daily research routine (`CLAUDE.md` §10). Update this table when the
field shifts; archive deep findings as dated reports in this folder.

- **Latest deep report:** [2026-06-15-mcp-registry-landscape.md](./2026-06-15-mcp-registry-landscape.md)
- **Latest daily update:** [2026-06-17-mcp-ecosystem-update.md](./2026-06-17-mcp-ecosystem-update.md)
- **Last updated:** 2026-06-17 (daily scheduled run)

## Ranking criteria

Significance to a *curated sub-registry that feeds a gateway* — weighted toward: ecosystem
influence, scale, curation/trust quality, governance maturity, and relevance to our niche
(clean `discovered != approved != enabled` separation). Not a pure popularity list.

## Top 11 (2026-06-17)

| # | Player | Layer | Scale / signal | Curation & governance | Relevance to us |
| --- | --- | --- | --- | --- | --- |
| 1 | **Official MCP Registry** | Upstream discovery | Authoritative; v0.1 frozen → v1 GA; June 10 update added ACR/MCR support; ~2,000 entries | Metadata only, no quality/security guarantees | Our primary **sync source** |
| 2 | **JFrog MCP Registry** | Enterprise registry | Part of JFrog supply-chain suite; **GA March 18, 2026** | Curated internal catalog, RBAC, audit, allowlist | **Closest analogue** — benchmark; now fully shipped |
| 3 | **Obot** | Gateway + catalog | OSS (MIT); **$35M seed confirmed**; v0.22.0 released (k8s Secrets binding + fleet scan) | **Clean** discovery→approval→runtime, IT-verified trust | Best model-match; well-funded; study its split |
| 4 | **Palo Alto Networks / Prisma AIRS** | Enterprise security + AI gateway | Incumbent SASE/NGFW player (~$8B ARR); **acquired Portkey (closed May 29, 2026)**; Portkey gateway now Prisma AIRS 3.0 AI Gateway core; trillions of tokens/month processed | Prisma AIRS runtime security + Portkey AI gateway governance; centralized control plane for agentic AI | **New entrant** at enterprise tier; validates governance-over-MCP market; watch for registry/catalog features |
| 5 | **Lunar.dev MCPX** | Gateway + catalog | OSS core + commercial | Partial separation, sandbox vetting, hardened tools | Model-match; trust tooling ideas |
| 6 | **Docker MCP Catalog / Gateway** | Directory + OCI | Major vendor; OCI private catalogs | Container-per-server isolation; no enterprise RBAC | Private-catalog distribution pattern |
| 7 | **PulseMCP** | Directory | **~18,570+** hand-reviewed (+160 since Jun 16); official co-steward | Largest hand-reviewed directory | Curation precedent + sync source |
| 8 | **Glama** | Directory | ~36,986 servers (+36 since Jun 16) | Light curation on a large set | Breadth reference + sync source |
| 9 | **Smithery** | Directory + hosting | ~7,000+ | No formal governance; prototyping-grade | Discovery breadth, not a trust layer |
| 10 | **TrueFoundry** | Enterprise gw + registry | Commercial, VPC-native | RBAC, audit, virtual servers | Enterprise registry benchmark |
| 11 | **Runlayer** | Enterprise gateway + catalog | $11M seed (Khosla/Felicis); **Rising in Cyber 2026** (150 CISO votes, Notable Capital/Morgan Stanley); MCP founder (D.S. Parra) as consultant; 18,000+ server catalog | Security-approved servers, ABAC, fast-tracked approval; curated vs. raw | **Elevated** — CISO endorsement validates enterprise market signal |

**Honorable mentions / watch list:** Kong AI Gateway (MCP Registry in Konnect Catalog, announced Feb 2, 2026; incumbent API-gw credibility),
mcp.so (~20,222, unvetted), MCP Market (~10k, community),
MintMCP (**SOC 2 Type II certified**; STDIO-to-production containerization; active June 2026 development),
Microsoft MCP Gateway (k8s, no catalog),
**AWS Agent Registry** (April 9, 2026 preview; private org catalog in Bedrock AgentCore; indexes agents/MCP servers/skills; exposes as MCP endpoint; watch for GA),
Composio, Operant, Airlock,
**Portkey** *(acquired by Palo Alto Networks, May 29, 2026; now Prisma AIRS; standalone in maintenance mode)*,
agentic-community/mcp-gateway-registry (OSS gateway+registry),
**Agensi** (new Q1-Q2 2026; curated marketplace with automated 8-point security scan).

## Standing reads

- **White space:** a focused, standalone, MCP-Registry-compatible **curated catalog with a
  documented gateway projection** is uncrowded — most rivals bundle curation into a
  full gateway/runtime suite.
- **Trust is the wedge:** provenance, version-pinning, verification, and change-detection
  are the differentiators buyers care about post-incident (postmark-mcp, CVE-2025-54136,
  CVE-2026-26118, CVE-2026-33032, RSAC 2026's systemic supply-chain advisory,
  VIPER-MCP's 106 zero-days across 39,884 repos, Akamai's database MCP flaws,
  the Clawdbot/OpenClaw 900+ gateway exposure with active exploitation (Jan 2026),
  the Mini Shai-Hulud npm worm that **specifically targets `mcp-server` packages and
  injects prompt injection into tool descriptions**,
  and **SANDWORM_MODE** (June 16, 2026) — a live npm worm injecting malicious MCP server
  configs into AI agent toolchains via 19 typosquatted packages, targeting Claude Code /
  Cursor / VS Code config files to steal API keys and SSH keys).
- **NSA validation (May 20, 2026):** The NSA published MCP security design guidance
  explicitly recommending source-verified, reputable MCP registries as a control layer.
  The `discovered != approved != enabled` boundary is exactly the NSA's recommended
  gate. Document: U/OO/6030316-26, 17pp.
  [NSA PDF](https://www.nsa.gov/Portals/75/documents/Cybersecurity/CSI_MCP_SECURITY.pdf)
- **Scale signal (Censys, June 2026):** 12,520 internet-accessible MCP services found;
  ~40% expose tools with no authentication. The unvetted surface grows while our
  approved set stays narrow and verified.
- **Spec watch:** MCP 2026-07-28 RC (locked May 28; ships July 28 — **41 days**) removes session state
  and adds mandatory `Mcp-Method`/`Mcp-Name` headers. No catalog schema change required;
  Gateway operator must update transport validation before July 28.
- **Server Cards (SEP-2127, targeting June 2026 merge):** `/.well-known/mcp/server-card.json` standard
  for machine-readable server metadata. Claude Desktop + Cursor already shipping support (April 2026).
  Parallel IETF track: draft-serra-mcp-discovery-uri-04 (expires Sep 2026). Once merged, `subregistry-audit`
  can query this endpoint to auto-verify tool counts and protocol version on cataloged servers.
- **Acquisition signal:** Palo Alto Networks acquiring Portkey (closed May 29, 2026) is the strongest
  enterprise validation signal to date — an $8B-ARR incumbent paying for AI gateway governance confirms
  the market we serve is real and growing. Portkey is now in maintenance mode; Prisma AIRS is the live entity.
</content>
